import type { ProjectIndexChunk } from '../projectIndex';

export type StoredChunkVector = {
  key: string;
  appId: string;
  chunkId: string;
  contentHash: string;
  modelAlias: string;
  model: string;
  gatewayLabel: string;
  dim: number;
  vector: number[];
  updatedAt: number;
};

const KEY_PREFIX = 'tytus.atomek.semanticVector:v1';
const DEFAULT_ALIAS = '__gateway_default__';

export const normalizeEmbeddingAlias = (alias: string | undefined | null): string => {
  const trimmed = alias?.trim();
  return trimmed || DEFAULT_ALIAS;
};

export const embeddingModelLabel = (alias: string | undefined | null): string => {
  const normalized = normalizeEmbeddingAlias(alias);
  return normalized === DEFAULT_ALIAS ? 'gateway default' : normalized;
};

const storageKey = (appId: string, modelAlias: string, chunk: Pick<ProjectIndexChunk, 'id' | 'hash'>): string => [
  KEY_PREFIX,
  encodeURIComponent(appId || 'unknown-app'),
  encodeURIComponent(modelAlias),
  encodeURIComponent(chunk.id),
  chunk.hash,
].join(':');

const hasLocalStorage = (): boolean => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
};

export const readChunkVector = (appId: string, modelAlias: string, chunk: ProjectIndexChunk): StoredChunkVector | null => {
  if (!hasLocalStorage()) return null;
  try {
    const key = storageKey(appId, modelAlias, chunk);
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredChunkVector>;
    if (parsed.chunkId !== chunk.id || parsed.contentHash !== chunk.hash || parsed.modelAlias !== modelAlias) return null;
    if (!Array.isArray(parsed.vector) || parsed.vector.some((value) => typeof value !== 'number' || !Number.isFinite(value))) return null;
    return {
      key,
      appId,
      chunkId: chunk.id,
      contentHash: chunk.hash,
      modelAlias,
      model: typeof parsed.model === 'string' ? parsed.model : '',
      gatewayLabel: typeof parsed.gatewayLabel === 'string' ? parsed.gatewayLabel : '',
      dim: parsed.vector.length,
      vector: parsed.vector,
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : 0,
    };
  } catch {
    return null;
  }
};

export const writeChunkVector = (record: Omit<StoredChunkVector, 'key'>): StoredChunkVector | null => {
  if (!hasLocalStorage()) return null;
  try {
    const key = storageKey(record.appId, record.modelAlias, { id: record.chunkId, hash: record.contentHash });
    const stored: StoredChunkVector = { ...record, key };
    window.localStorage.setItem(key, JSON.stringify(stored));
    return stored;
  } catch {
    return null;
  }
};
