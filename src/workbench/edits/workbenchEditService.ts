import type { WorkbenchFile } from '../types';
import {
  applyUnifiedDiff,
  extractCodeFenceBlocks,
  extractDiffSources,
  extractReplacementBlocks,
  hasFenceFlag,
  normalizePatchPath,
  splitUnifiedDiffByFile,
} from './patchParser';

export type EditStats = { added: number; removed: number; changed: number };

export type EditConflictMetadata = {
  expectedVersion?: number;
  currentVersion?: number;
  expectedHash: string;
  currentHash: string;
  changedAfterPreview: boolean;
};

export type FileMatch = {
  file: WorkbenchFile;
  normalizedPatchPath: string;
  confidence: 'exact' | 'suffix' | 'basename';
};

export type WorkspaceEditFileCandidate = {
  fileId: string;
  fileName: string;
  filePath: string;
  originalContent: string;
  proposedContent: string;
  sourceTitle: string;
  extractionLabel: string;
  stats: EditStats;
  base: {
    version?: number;
    contentHash: string;
  };
  targetPath?: string;
  match?: Omit<FileMatch, 'file'>;
  conflict: EditConflictMetadata;
};

export type WorkspaceEditCandidate = {
  sourceTitle: string;
  edits: WorkspaceEditFileCandidate[];
  skipped: string[];
  stats: EditStats;
  kind: 'empty' | 'single-file' | 'multi-file';
};

export type BuildWorkspaceEditInput = {
  body: string;
  files: readonly WorkbenchFile[];
  sourceTitle: string;
  activeFile?: WorkbenchFile | null;
  versions?: Readonly<Record<string, number>>;
};

export type ApplyWorkspaceEditResult = {
  files: WorkbenchFile[];
  applied: WorkspaceEditFileCandidate[];
  conflicts: WorkspaceEditFileCandidate[];
};

export function buildWorkspaceEditCandidate(input: BuildWorkspaceEditInput): WorkspaceEditCandidate {
  const { body, files, sourceTitle, activeFile = null, versions = {} } = input;
  const byFileId = new Map<string, WorkspaceEditFileCandidate>();
  const skipped: string[] = [];

  for (const candidate of extractDiffSources(body)) {
    for (const section of splitUnifiedDiffByFile(candidate)) {
      if (!section.path) {
        if (activeFile) {
          const proposed = applyUnifiedDiff(activeFile.content, section.raw);
          if (proposed && proposed !== activeFile.content) {
            byFileId.set(activeFile.id, createEditCandidate({
              file: activeFile,
              proposedContent: proposed,
              sourceTitle,
              extractionLabel: 'active-file unified diff patch',
              versions,
            }));
          }
        }
        continue;
      }

      const match = findFileForPatchPath(files, section.path);
      if (!match) {
        skipped.push(`${section.path}: no opened file`);
        continue;
      }
      const proposed = applyUnifiedDiff(match.file.content, section.raw);
      if (!proposed || proposed === match.file.content) {
        skipped.push(`${section.path}: patch did not match or produced no change`);
        continue;
      }
      byFileId.set(match.file.id, createEditCandidate({
        file: match.file,
        proposedContent: proposed,
        sourceTitle,
        extractionLabel: `workspace diff (${section.path})`,
        versions,
        targetPath: section.path,
        match,
      }));
    }
  }

  for (const replacement of extractReplacementBlocks(body)) {
    const target = replacement.path ? findFileForPatchPath(files, replacement.path) : activeFile ? { file: activeFile, normalizedPatchPath: normalizePatchPath(activeFile.path), confidence: 'exact' as const } : null;
    if (!target) {
      skipped.push(`${replacement.path ?? 'replacement block'}: no opened file`);
      continue;
    }
    if (replacement.content === target.file.content) {
      skipped.push(`${target.file.path}: replacement produced no change`);
      continue;
    }
    byFileId.set(target.file.id, createEditCandidate({
      file: target.file,
      proposedContent: replacement.content,
      sourceTitle,
      extractionLabel: replacement.label,
      versions,
      targetPath: replacement.path ?? target.file.path,
      match: target,
    }));
  }

  const hasExplicitReplacementPath = extractReplacementBlocks(body).some((replacement) => replacement.path);
  if (byFileId.size === 0 && activeFile && !hasExplicitReplacementPath) {
    const extracted = extractEditableSuggestion(body, activeFile);
    if (extracted && extracted.content !== activeFile.content) {
      byFileId.set(activeFile.id, createEditCandidate({
        file: activeFile,
        proposedContent: extracted.content,
        sourceTitle,
        extractionLabel: extracted.label,
        versions,
      }));
    }
  }

  const edits = Array.from(byFileId.values());
  return {
    sourceTitle,
    edits,
    skipped: Array.from(new Set(skipped)),
    stats: combineStats(edits.map((edit) => edit.stats)),
    kind: edits.length === 0 ? 'empty' : edits.length === 1 ? 'single-file' : 'multi-file',
  };
}

export function extractEditableSuggestion(body: string, file: WorkbenchFile): { content: string; label: string } | null {
  for (const candidate of extractDiffSources(body)) {
    const patched = applyUnifiedDiff(file.content, candidate);
    if (patched) return { content: patched, label: 'unified diff patch' };
  }

  const blocks = extractCodeFenceBlocks(body);
  if (blocks.length === 0) return null;

  const wanted = languageAliases(file);
  const replacement = extractReplacementBlocks(body)[0];
  if (replacement) return { content: replacement.content, label: replacement.label };

  const languageMatch = blocks.find((block) => wanted.some((alias) => hasFenceFlag(block, alias)) && !hasFenceFlag(block, 'diff') && !hasFenceFlag(block, 'patch'));
  if (languageMatch) return { content: languageMatch.content, label: `matched ${languageMatch.lang || file.language} block` };

  const nonDiffBlocks = blocks.filter((block) => !hasFenceFlag(block, 'diff') && !hasFenceFlag(block, 'patch'));
  const fallback = nonDiffBlocks.sort((a, b) => b.content.length - a.content.length)[0];
  if (!fallback) return null;
  return { content: fallback.content, label: `largest fenced block (${fallback.lang || 'plain'})` };
}

export function applyWorkspaceEdit(files: readonly WorkbenchFile[], candidate: WorkspaceEditCandidate, options: { force?: boolean; versions?: Readonly<Record<string, number>> } = {}): ApplyWorkspaceEditResult {
  const editsById = new Map(candidate.edits.map((edit) => [edit.fileId, edit]));
  const applied: WorkspaceEditFileCandidate[] = [];
  const conflicts: WorkspaceEditFileCandidate[] = [];

  const nextFiles = files.map((file) => {
    const edit = editsById.get(file.id);
    if (!edit) return file;
    const currentHash = contentHash(file.content);
    const changed = file.content !== edit.originalContent || currentHash !== edit.base.contentHash;
    const conflict = {
      ...edit.conflict,
      currentVersion: options.versions?.[file.id] ?? edit.conflict.currentVersion,
      currentHash,
      changedAfterPreview: changed,
    };
    const withConflict = { ...edit, conflict };
    if (changed && !options.force) {
      conflicts.push(withConflict);
      return file;
    }
    applied.push(withConflict);
    return { ...file, content: edit.proposedContent, dirty: true };
  });

  return { files: nextFiles, applied, conflicts };
}

export function findFileForPatchPath(files: readonly WorkbenchFile[], patchPath: string): FileMatch | null {
  const normalized = normalizePatchPath(patchPath);
  const base = normalized.split('/').at(-1) ?? normalized;

  const exact = files.find((file) => normalizePatchPath(file.path) === normalized);
  if (exact) return { file: exact, normalizedPatchPath: normalized, confidence: 'exact' };

  const suffix = files.find((file) => normalizePatchPath(file.path).endsWith(`/${normalized}`));
  if (suffix) return { file: suffix, normalizedPatchPath: normalized, confidence: 'suffix' };

  const basename = files.find((file) => file.name === base || normalizePatchPath(file.path).endsWith(`/${base}`));
  return basename ? { file: basename, normalizedPatchPath: normalized, confidence: 'basename' } : null;
}

export function diffStats(original: string, proposed: string): EditStats {
  const before = original.split('\n');
  const after = proposed.split('\n');
  const max = Math.max(before.length, after.length);
  let added = 0;
  let removed = 0;
  let changed = 0;
  for (let index = 0; index < max; index += 1) {
    if (before[index] === after[index]) continue;
    if (before[index] === undefined) added += 1;
    else if (after[index] === undefined) removed += 1;
    else changed += 1;
  }
  return { added, removed, changed };
}

export function combineStats(stats: readonly EditStats[]): EditStats {
  return stats.reduce<EditStats>((total, stat) => ({
    added: total.added + stat.added,
    removed: total.removed + stat.removed,
    changed: total.changed + stat.changed,
  }), { added: 0, removed: 0, changed: 0 });
}

export function contentHash(text: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function createEditCandidate(input: {
  file: WorkbenchFile;
  proposedContent: string;
  sourceTitle: string;
  extractionLabel: string;
  versions: Readonly<Record<string, number>>;
  targetPath?: string;
  match?: FileMatch;
}): WorkspaceEditFileCandidate {
  const baseHash = contentHash(input.file.content);
  return {
    fileId: input.file.id,
    fileName: input.file.name,
    filePath: input.file.path,
    originalContent: input.file.content,
    proposedContent: input.proposedContent,
    sourceTitle: input.sourceTitle,
    extractionLabel: input.extractionLabel,
    stats: diffStats(input.file.content, input.proposedContent),
    base: {
      version: input.versions[input.file.id],
      contentHash: baseHash,
    },
    targetPath: input.targetPath,
    match: input.match ? { normalizedPatchPath: input.match.normalizedPatchPath, confidence: input.match.confidence } : undefined,
    conflict: {
      expectedVersion: input.versions[input.file.id],
      currentVersion: input.versions[input.file.id],
      expectedHash: baseHash,
      currentHash: baseHash,
      changedAfterPreview: false,
    },
  };
}

function languageAliases(file: WorkbenchFile): string[] {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return Array.from(new Set([
    file.language,
    ext,
    file.language === 'typescript' ? 'ts' : '',
    file.language === 'javascript' ? 'js' : '',
    file.language === 'markdown' ? 'md' : '',
    file.language === 'shell' ? 'sh' : '',
    file.language === 'yaml' ? 'yml' : '',
  ].filter(Boolean)));
}
