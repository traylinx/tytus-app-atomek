import type { WorkbenchFile } from '../types';
import { buildProjectIndex, contentHash, projectIndexSignature, shouldSkipFile, type ProjectIndexOptions, type ProjectIndexSnapshot } from './chunker';

export type ProjectIndexStaleFile = {
  fileId: string;
  path: string;
  status: 'changed' | 'deleted' | 'new' | 'skipped-now' | 'dirty-state-changed';
  indexedHash?: string;
  currentHash?: string;
};

export type ProjectIndexStaleReport = {
  stale: boolean;
  signatureChanged: boolean;
  files: ProjectIndexStaleFile[];
};

export class ProjectIndexStore {
  private snapshot: ProjectIndexSnapshot;
  private options: ProjectIndexOptions;

  constructor(files: readonly WorkbenchFile[] = [], options: ProjectIndexOptions = {}) {
    this.options = { ...options };
    this.snapshot = buildProjectIndex(files, this.options);
  }

  getSnapshot(): ProjectIndexSnapshot {
    return this.snapshot;
  }

  getOptions(): ProjectIndexOptions {
    return { ...this.options };
  }

  refresh(files: readonly WorkbenchFile[], options: ProjectIndexOptions = this.options): ProjectIndexSnapshot {
    this.options = { ...options };
    this.snapshot = buildProjectIndex(files, this.options);
    return this.snapshot;
  }

  update(files: readonly WorkbenchFile[], options: ProjectIndexOptions = this.options): ProjectIndexSnapshot {
    // Full rebuild by design: deterministic, small, and safe for concurrent UI workers.
    // Public API remains incremental-friendly; callers can pass only current WorkbenchFile[] state.
    return this.refresh(files, options);
  }

  staleReport(files: readonly WorkbenchFile[]): ProjectIndexStaleReport {
    return detectProjectIndexStaleness(this.snapshot, files, this.options);
  }

  isStale(files: readonly WorkbenchFile[]): boolean {
    return this.staleReport(files).stale;
  }
}

export const createProjectIndexStore = (files: readonly WorkbenchFile[] = [], options: ProjectIndexOptions = {}): ProjectIndexStore => new ProjectIndexStore(files, options);

export const detectProjectIndexStaleness = (snapshot: ProjectIndexSnapshot, files: readonly WorkbenchFile[], options: ProjectIndexOptions = {}): ProjectIndexStaleReport => {
  const currentById = new Map(files.map((file) => [file.id, file]));
  const indexedById = snapshot.byFileId;
  const staleFiles: ProjectIndexStaleFile[] = [];

  for (const indexed of snapshot.files) {
    const current = currentById.get(indexed.fileId);
    if (!current) {
      staleFiles.push({ fileId: indexed.fileId, path: indexed.path, status: 'deleted', indexedHash: indexed.hash });
      continue;
    }
    const currentSkip = shouldSkipFile(current, options);
    if (currentSkip) {
      staleFiles.push({ fileId: indexed.fileId, path: current.path, status: 'skipped-now', indexedHash: indexed.hash, currentHash: contentHash(current.content) });
      continue;
    }
    const currentHash = contentHash(current.content);
    if (currentHash !== indexed.hash) {
      staleFiles.push({ fileId: indexed.fileId, path: current.path, status: 'changed', indexedHash: indexed.hash, currentHash });
    } else if (current.dirty !== indexed.dirty) {
      staleFiles.push({ fileId: indexed.fileId, path: current.path, status: 'dirty-state-changed', indexedHash: indexed.hash, currentHash });
    }
  }

  for (const current of files) {
    if (!indexedById.has(current.id) && !shouldSkipFile(current, options)) {
      staleFiles.push({ fileId: current.id, path: current.path, status: 'new', currentHash: contentHash(current.content) });
    }
  }

  const signatureChanged = snapshot.signature !== projectIndexSignature(files);
  return { stale: staleFiles.length > 0, signatureChanged, files: staleFiles };
};
