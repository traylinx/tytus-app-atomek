export type CodeFenceBlock = {
  lang: string;
  flags: string[];
  attrs: Record<string, string>;
  content: string;
};

export type UnifiedDiffFilePatch = {
  raw: string;
  path: string | null;
  oldPath: string | null;
  newPath: string | null;
};

export type ReplacementBlock = {
  content: string;
  label: string;
  lang: string;
  path: string | null;
  attrs: Record<string, string>;
};

const FENCE_RE = /```([^\n`]*)\n([\s\S]*?)```/g;
const HUNK_RE = /^@@\s+-(\d+)(?:,\d+)?\s+\+(\d+)(?:,\d+)?\s+@@/;

export function extractCodeFenceBlocks(body: string): CodeFenceBlock[] {
  return Array.from(body.matchAll(FENCE_RE))
    .map((match) => parseFenceBlock(match[1] ?? '', trimCodeBlock(match[2] ?? '')))
    .filter((block) => block.content.trim().length > 0);
}

export function parseFenceBlock(rawLang: string, content: string): CodeFenceBlock {
  const tokens = rawLang.trim().split(/[\s,]+/).filter(Boolean);
  const attrs: Record<string, string> = {};
  const flags: string[] = [];

  for (const rawToken of tokens) {
    const attr = rawToken.match(/^([a-z0-9_-]+)=(.+)$/i);
    if (attr) attrs[attr[1].toLowerCase()] = unquote(attr[2]);
    else flags.push(rawToken.toLowerCase());
  }

  return { lang: rawLang.trim().toLowerCase(), flags, attrs, content };
}

export function hasFenceFlag(blockOrLang: Pick<CodeFenceBlock, 'flags'> | string, flag: string): boolean {
  const flags = typeof blockOrLang === 'string'
    ? parseFenceBlock(blockOrLang, '').flags
    : blockOrLang.flags;
  return flags.includes(flag.toLowerCase());
}

export function extractDiffSources(body: string): string[] {
  const blocks = extractCodeFenceBlocks(body);
  const fenced = blocks
    .filter((block) => hasFenceFlag(block, 'diff') || hasFenceFlag(block, 'patch'))
    .map((block) => block.content);
  return [...fenced, body].filter((candidate, index, candidates) => looksLikeUnifiedDiff(candidate) && candidates.findIndex((other) => other === candidate) === index);
}

export function looksLikeUnifiedDiff(text: string): boolean {
  return /^@@\s+-\d+/m.test(text) || /^diff --git\s+/m.test(text) || /^---\s+/m.test(text);
}

export function splitUnifiedDiffByFile(diff: string): UnifiedDiffFilePatch[] {
  const normalized = normalizeNewlines(diff);
  if (!/^@@\s+-\d+/m.test(normalized)) return [];

  const lines = normalized.split('\n');
  const starts: number[] = [];
  lines.forEach((line, index) => {
    if (line.startsWith('diff --git ') || line.startsWith('--- ')) starts.push(index);
  });

  if (starts.length === 0) return [{ raw: normalized, ...diffSectionPathMetadata(normalized) }];

  const uniqueStarts = Array.from(new Set(starts)).sort((a, b) => a - b);
  const sections: UnifiedDiffFilePatch[] = [];
  for (let index = 0; index < uniqueStarts.length; index += 1) {
    const start = uniqueStarts[index];
    const next = uniqueStarts.find((candidate) => candidate > start && lines[candidate].startsWith('diff --git '));
    const end = next ?? lines.length;
    const raw = lines.slice(start, end).join('\n');
    if (/^@@\s+-\d+/m.test(raw)) sections.push({ raw, ...diffSectionPathMetadata(raw) });
  }

  return sections.length > 0 ? sections : [{ raw: normalized, ...diffSectionPathMetadata(normalized) }];
}

export function diffSectionPathMetadata(section: string): { path: string | null; oldPath: string | null; newPath: string | null } {
  const gitHeader = section.match(/^diff --git\s+(?:"?a\/(.+?)"?|(\S+))\s+(?:"?b\/(.+?)"?|(\S+))/m);
  const minusHeader = section.match(/^---\s+(?:"?a\/(.+?)"?|(\S+))/m);
  const plusHeader = section.match(/^\+\+\+\s+(?:"?b\/(.+?)"?|(\S+))/m);

  const oldPath = normalizePatchPath(gitHeader?.[1] || gitHeader?.[2] || minusHeader?.[1] || minusHeader?.[2] || '') || null;
  const newPath = normalizePatchPath(gitHeader?.[3] || gitHeader?.[4] || plusHeader?.[1] || plusHeader?.[2] || '') || null;
  const path = newPath && newPath !== '/dev/null' ? newPath : oldPath;
  return { path: path && path !== '/dev/null' ? path : null, oldPath, newPath };
}

export function normalizePatchPath(path: string): string {
  return path.trim().replace(/^['"]|['"]$/g, '').replace(/\\/g, '/').replace(/^[ab]\//, '').replace(/^\.\//, '');
}

export function extractReplacementBlocks(body: string): ReplacementBlock[] {
  return extractCodeFenceBlocks(body)
    .filter((block) => isReplacementBlock(block))
    .map((block) => ({
      content: stripReplacementMetadataLines(block.content),
      label: `replacement block (${block.lang || 'plain'})`,
      lang: block.lang,
      path: replacementBlockPath(block),
      attrs: block.attrs,
    }));
}

export function isReplacementBlock(block: CodeFenceBlock): boolean {
  return hasFenceFlag(block, 'atomek-replace')
    || hasFenceFlag(block, 'atomek-full')
    || hasFenceFlag(block, 'full-replacement')
    || hasFenceFlag(block, 'full')
    || hasFenceFlag(block, 'replace');
}

export function replacementBlockPath(block: CodeFenceBlock): string | null {
  const attrPath = block.attrs.path || block.attrs.file || block.attrs.target;
  if (attrPath) return normalizePatchPath(attrPath);

  const firstLines = block.content.split('\n').slice(0, 5);
  for (const line of firstLines) {
    const match = line.match(/^\s*(?:\/\/|#|<!--)?\s*(?:atomek-)?(?:path|file)\s*:\s*([^\s>]+)\s*(?:-->)?\s*$/i);
    if (match) return normalizePatchPath(match[1]);
  }
  return null;
}

export function applyUnifiedDiff(original: string, diff: string): string | null {
  if (!/^@@\s+-\d+/m.test(diff)) return null;
  const originalLines = original.split('\n');
  const diffLines = normalizeNewlines(diff).split('\n');
  const output: string[] = [];
  let originalIndex = 0;
  let sawHunk = false;

  for (let index = 0; index < diffLines.length; index += 1) {
    const header = diffLines[index].match(HUNK_RE);
    if (!header) continue;
    sawHunk = true;
    const oldStart = Number(header[1]);
    const hunkStart = Math.max(0, oldStart - 1);
    if (hunkStart < originalIndex) return null;
    output.push(...originalLines.slice(originalIndex, hunkStart));
    originalIndex = hunkStart;

    index += 1;
    for (; index < diffLines.length; index += 1) {
      const line = diffLines[index];
      if (line.startsWith('@@ ')) {
        index -= 1;
        break;
      }
      if (line.startsWith('diff --git ') || line.startsWith('--- ') || line.startsWith('+++ ')) continue;
      if (line.startsWith('\\ No newline at end of file')) continue;

      const marker = line[0];
      const content = line.slice(1);
      if (marker === ' ') {
        if (originalLines[originalIndex] !== content) return null;
        output.push(content);
        originalIndex += 1;
        continue;
      }
      if (marker === '-') {
        if (originalLines[originalIndex] !== content) return null;
        originalIndex += 1;
        continue;
      }
      if (marker === '+') {
        output.push(content);
        continue;
      }
      if (line === '') continue;
      return null;
    }
  }

  if (!sawHunk) return null;
  output.push(...originalLines.slice(originalIndex));
  return output.join('\n');
}

export function trimCodeBlock(content: string): string {
  return content.replace(/^\n+/, '').replace(/\n+$/, '');
}

export function stripReplacementMetadataLines(content: string): string {
  const lines = content.split('\n');
  let index = 0;
  while (index < Math.min(lines.length, 5)) {
    if (!/^\s*(?:\/\/|#|<!--)?\s*(?:atomek-)?(?:path|file|version|hash)\s*:/i.test(lines[index])) break;
    index += 1;
  }
  return lines.slice(index).join('\n');
}

export function normalizeNewlines(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function unquote(value: string): string {
  return value.replace(/^['"]|['"]$/g, '');
}
