import type { WorkbenchFile, WorkbenchRange } from '../types';

export type ProjectIndexSkipReason = 'empty' | 'huge' | 'binary' | 'vendor' | 'unsupported';

export type ProjectIndexOptions = {
  maxFileBytes?: number;
  maxChunkChars?: number;
  chunkOverlapChars?: number;
  maxChunksPerFile?: number;
  includeDirty?: boolean;
};

export type ProjectIndexFileRecord = {
  fileId: string;
  name: string;
  path: string;
  language: WorkbenchFile['language'];
  hash: string;
  dirty: boolean;
  source: WorkbenchFile['source'];
  size: number;
  chunkIds: string[];
  indexedAt: number;
};

export type ProjectIndexSkippedFile = {
  fileId: string;
  name: string;
  path: string;
  language: WorkbenchFile['language'];
  reason: ProjectIndexSkipReason;
  size: number;
};

export type ProjectIndexChunk = {
  id: string;
  fileId: string;
  path: string;
  name: string;
  language: WorkbenchFile['language'];
  hash: string;
  dirty: boolean;
  source: WorkbenchFile['source'];
  size: number;
  ordinal: number;
  text: string;
  range: WorkbenchRange;
  charStart: number;
  charEnd: number;
  indexedAt: number;
};

export type ProjectIndexSnapshot = {
  indexedAt: number;
  signature: string;
  files: readonly ProjectIndexFileRecord[];
  skipped: readonly ProjectIndexSkippedFile[];
  chunks: readonly ProjectIndexChunk[];
  byFileId: Map<string, ProjectIndexFileRecord>;
  byChunkId: Map<string, ProjectIndexChunk>;
};

const DEFAULT_MAX_FILE_BYTES = 750_000;
const DEFAULT_MAX_CHUNK_CHARS = 2_800;
const DEFAULT_CHUNK_OVERLAP_CHARS = 240;
const DEFAULT_MAX_CHUNKS_PER_FILE = 80;

const VENDOR_PATH_PARTS = new Set([
  '.git', '.hg', '.svn', '.next', '.nuxt', '.svelte-kit', '.turbo', '.cache', '.parcel-cache',
  'node_modules', 'bower_components', 'vendor', 'dist', 'build', 'coverage', '.vite', '.DS_Store',
]);

const BINARY_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'ico', 'bmp', 'tiff', 'pdf', 'zip', 'gz', 'tgz', 'rar',
  '7z', 'tar', 'wasm', 'exe', 'dll', 'dylib', 'so', 'class', 'jar', 'pyc', 'pyo', 'woff', 'woff2', 'ttf',
  'otf', 'eot', 'mp3', 'mp4', 'm4a', 'mov', 'avi', 'webm', 'wav', 'flac', 'sqlite', 'db', 'lock',
]);

export const contentHash = (text: string): string => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const projectIndexSignature = (files: readonly WorkbenchFile[]): string => contentHash(
  files
    .map((file) => `${file.id}\u0000${file.path}\u0000${file.language}\u0000${file.dirty ? '1' : '0'}\u0000${contentHash(file.content)}`)
    .sort()
    .join('\u0001'),
);

export const shouldSkipFile = (file: WorkbenchFile, options: ProjectIndexOptions = {}): ProjectIndexSkipReason | null => {
  const size = file.size ?? file.content.length;
  if (size === 0 || file.content.length === 0) return 'empty';
  if (size > (options.maxFileBytes ?? DEFAULT_MAX_FILE_BYTES) || file.content.length > (options.maxFileBytes ?? DEFAULT_MAX_FILE_BYTES)) return 'huge';
  if (!options.includeDirty && file.dirty) return null;
  if (isVendorPath(file.path)) return 'vendor';
  if (isLikelyBinary(file)) return 'binary';
  return null;
};

export const buildProjectIndex = (files: readonly WorkbenchFile[], options: ProjectIndexOptions = {}): ProjectIndexSnapshot => {
  const indexedAt = Date.now();
  const records: ProjectIndexFileRecord[] = [];
  const skipped: ProjectIndexSkippedFile[] = [];
  const chunks: ProjectIndexChunk[] = [];

  for (const file of files) {
    const size = file.size ?? file.content.length;
    const skipReason = shouldSkipFile(file, options);
    if (skipReason) {
      skipped.push({ fileId: file.id, name: file.name, path: file.path, language: file.language, reason: skipReason, size });
      continue;
    }

    const hash = contentHash(file.content);
    const fileChunks = chunkFile(file, hash, indexedAt, options);
    chunks.push(...fileChunks);
    records.push({
      fileId: file.id,
      name: file.name,
      path: file.path,
      language: file.language,
      hash,
      dirty: file.dirty,
      source: file.source,
      size,
      chunkIds: fileChunks.map((chunk) => chunk.id),
      indexedAt,
    });
  }

  return freezeSnapshot({
    indexedAt,
    signature: projectIndexSignature(files),
    files: records,
    skipped,
    chunks,
    byFileId: new Map(records.map((record) => [record.fileId, record])),
    byChunkId: new Map(chunks.map((chunk) => [chunk.id, chunk])),
  });
};

export const chunkFile = (file: WorkbenchFile, hash = contentHash(file.content), indexedAt = Date.now(), options: ProjectIndexOptions = {}): ProjectIndexChunk[] => {
  const maxChunkChars = Math.max(500, options.maxChunkChars ?? DEFAULT_MAX_CHUNK_CHARS);
  const overlapChars = Math.min(Math.max(0, options.chunkOverlapChars ?? DEFAULT_CHUNK_OVERLAP_CHARS), Math.floor(maxChunkChars / 2));
  const maxChunks = Math.max(1, options.maxChunksPerFile ?? DEFAULT_MAX_CHUNKS_PER_FILE);
  const lineStarts = lineStartOffsets(file.content);
  const chunks: ProjectIndexChunk[] = [];
  let charStart = 0;
  let ordinal = 0;

  while (charStart < file.content.length && chunks.length < maxChunks) {
    const charEnd = chooseChunkEnd(file.content, charStart, Math.min(file.content.length, charStart + maxChunkChars));
    const text = file.content.slice(charStart, charEnd).trim();
    if (text.length > 0) {
      const range = rangeForOffsets(lineStarts, charStart, charEnd);
      chunks.push({
        id: `${file.id}:${hash}:${ordinal}:${range.startLineNumber}-${range.endLineNumber}`,
        fileId: file.id,
        path: file.path,
        name: file.name,
        language: file.language,
        hash,
        dirty: file.dirty,
        source: file.source,
        size: file.size ?? file.content.length,
        ordinal,
        text,
        range,
        charStart,
        charEnd,
        indexedAt,
      });
      ordinal += 1;
    }
    if (charEnd >= file.content.length) break;
    charStart = Math.max(charStart + 1, charEnd - overlapChars);
  }

  return chunks;
};

const freezeSnapshot = (snapshot: ProjectIndexSnapshot): ProjectIndexSnapshot => ({
  ...snapshot,
  files: Object.freeze([...snapshot.files]),
  skipped: Object.freeze([...snapshot.skipped]),
  chunks: Object.freeze([...snapshot.chunks]),
});

const chooseChunkEnd = (text: string, start: number, preferredEnd: number): number => {
  if (preferredEnd >= text.length) return text.length;
  const windowStart = Math.max(start + 1, preferredEnd - 500);
  const newline = text.lastIndexOf('\n', preferredEnd);
  if (newline >= windowStart) return newline + 1;
  const sentence = Math.max(text.lastIndexOf('. ', preferredEnd), text.lastIndexOf('; ', preferredEnd));
  if (sentence >= windowStart) return sentence + 1;
  const space = text.lastIndexOf(' ', preferredEnd);
  if (space >= windowStart) return space + 1;
  return preferredEnd;
};

const lineStartOffsets = (text: string): number[] => {
  const starts = [0];
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === '\n') starts.push(index + 1);
  }
  return starts;
};

const rangeForOffsets = (lineStarts: readonly number[], start: number, end: number): WorkbenchRange => {
  const startLineIndex = findLineIndex(lineStarts, start);
  const endLineIndex = findLineIndex(lineStarts, Math.max(start, end - 1));
  return {
    startLineNumber: startLineIndex + 1,
    startColumn: start - lineStarts[startLineIndex] + 1,
    endLineNumber: endLineIndex + 1,
    endColumn: end - lineStarts[endLineIndex] + 1,
  };
};

const findLineIndex = (lineStarts: readonly number[], offset: number): number => {
  let low = 0;
  let high = lineStarts.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (lineStarts[mid] <= offset && (mid === lineStarts.length - 1 || lineStarts[mid + 1] > offset)) return mid;
    if (lineStarts[mid] > offset) high = mid - 1;
    else low = mid + 1;
  }
  return 0;
};

const isVendorPath = (path: string): boolean => path
  .split(/[\\/]+/)
  .filter(Boolean)
  .some((part) => VENDOR_PATH_PARTS.has(part));

const isLikelyBinary = (file: WorkbenchFile): boolean => {
  const extension = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : undefined;
  if (extension && BINARY_EXTENSIONS.has(extension)) return true;
  if (file.content.includes('\u0000')) return true;
  const sample = file.content.slice(0, 4_096);
  if (!sample) return false;
  let suspicious = 0;
  for (let index = 0; index < sample.length; index += 1) {
    const code = sample.charCodeAt(index);
    if (code < 9 || (code > 13 && code < 32)) suspicious += 1;
  }
  return suspicious / sample.length > 0.08;
};
