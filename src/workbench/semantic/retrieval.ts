import type { AiContextPart, HostClient } from '@tytus/host-api';
import type { ChatAiSettings } from '../types';
import type { ProjectIndexChunk, ProjectIndexSnapshot } from '../projectIndex';
import { contextHitToText, retrieveProjectContext, type ProjectIndexContextHit, type ProjectIndexRetrievalOptions } from '../projectIndex';
import type { ProjectIndexStaleReport } from '../projectIndex';
import { embeddingModelLabel, normalizeEmbeddingAlias, readChunkVector, writeChunkVector } from './vectorStore';

export type SemanticRetrievalMode = 'keyword' | 'hybrid' | 'vector-fallback';

export type SemanticRetrievalResult = {
  hits: ProjectIndexContextHit[];
  mode: SemanticRetrievalMode;
  reason?: string;
  embeddedChunks: number;
};

type RuntimeEmbedText = {
  embedText?: (input: { input: string; gatewayPreference?: ChatAiSettings['gatewayPreference']; model?: string; signal?: AbortSignal }) => Promise<{
    embedding?: number[];
    model?: string;
    gatewayLabel?: string;
  }>;
};

type Scored = {
  chunk: ProjectIndexChunk;
  keywordScore: number;
  vectorScore: number;
  score: number;
  matchedTerms: string[];
};

const DEFAULT_LIMIT = 8;
const DEFAULT_MAX_CHARS = 12_000;
const MAX_VECTOR_CHUNKS = 180;

export const retrieveSemanticProjectContext = async (
  host: HostClient,
  snapshot: ProjectIndexSnapshot,
  query: string,
  chatSettings: ChatAiSettings,
  options: ProjectIndexRetrievalOptions = {},
  staleReport?: ProjectIndexStaleReport,
  signal?: AbortSignal,
): Promise<SemanticRetrievalResult> => {
  const keywordHits = retrieveProjectContext(snapshot, query, { ...options, limit: Math.max(options.limit ?? DEFAULT_LIMIT, 16) }, staleReport);
  const ai = host.ai as (typeof host.ai & RuntimeEmbedText) | undefined;
  if (typeof ai?.embedText !== 'function') {
    return { hits: keywordHits.slice(0, options.limit ?? DEFAULT_LIMIT), mode: 'keyword', reason: 'Semantic index unavailable — using keyword retrieval.', embeddedChunks: 0 };
  }

  try {
    const modelAlias = normalizeEmbeddingAlias(chatSettings.embeddingModel);
    const queryEmbedding = await ai.embedText({
      input: query,
      gatewayPreference: chatSettings.gatewayPreference,
      model: chatSettings.embeddingModel.trim() || undefined,
      signal,
    });
    const queryVector = normalizeVector(queryEmbedding.embedding);
    if (!queryVector) throw new Error('host.ai.embedText returned no embedding vector');

    const keywordByChunk = new Map(keywordHits.map((hit) => [hit.chunkId, hit]));
    const terms = tokenize(query);
    const vectorCandidateMap = new Map<string, ProjectIndexChunk>();
    snapshot.chunks
      .filter((chunk) => options.includeDirty !== false || !chunk.dirty)
      .slice(0, MAX_VECTOR_CHUNKS)
      .forEach((chunk) => vectorCandidateMap.set(chunk.id, chunk));
    keywordHits.forEach((hit) => {
      const chunk = snapshot.byChunkId.get(hit.chunkId);
      if (chunk) vectorCandidateMap.set(chunk.id, chunk);
    });
    const vectorCandidates = Array.from(vectorCandidateMap.values());
    const scored: Scored[] = [];
    let embeddedChunks = 0;

    for (const chunk of vectorCandidates) {
      if (signal?.aborted) break;
      const stored = readChunkVector(host.appId, modelAlias, chunk) ?? await embedAndStoreChunk(ai, host.appId, modelAlias, chunk, chatSettings, signal);
      if (!stored) continue;
      if (stored.updatedAt > Date.now() - 1_000) embeddedChunks += 1;
      const vectorScore = cosineSimilarity(queryVector, stored.vector);
      if (!Number.isFinite(vectorScore)) continue;
      const keyword = keywordByChunk.get(chunk.id);
      const keywordScore = keyword?.score ?? lexicalScore(chunk, terms);
      const combined = normalizeKeywordScore(keywordScore) * 0.42 + Math.max(0, vectorScore) * 0.58;
      scored.push({ chunk, keywordScore, vectorScore, score: combined, matchedTerms: terms.filter((term) => chunk.text.toLowerCase().includes(term)) });
    }

    if (scored.length === 0) return { hits: keywordHits.slice(0, options.limit ?? DEFAULT_LIMIT), mode: 'vector-fallback', reason: 'Semantic retrieval produced no vectors — using keyword retrieval.', embeddedChunks };

    const staleFileIds = new Set(staleReport?.files.map((file) => file.fileId) ?? []);
    const hits = scored
      .sort((a, b) => b.score - a.score || b.keywordScore - a.keywordScore || a.chunk.path.localeCompare(b.chunk.path) || a.chunk.ordinal - b.chunk.ordinal)
      .slice(0, Math.max(options.limit ?? DEFAULT_LIMIT, 1))
      .map((item) => toSemanticHit(item, staleFileIds.has(item.chunk.fileId)));

    return {
      hits: enforceCharBudget(hits, options.maxChars ?? DEFAULT_MAX_CHARS),
      mode: 'hybrid',
      reason: `Hybrid retrieval used ${embeddingModelLabel(chatSettings.embeddingModel)} embeddings + keyword ranking.`,
      embeddedChunks,
    };
  } catch (err) {
    return {
      hits: keywordHits.slice(0, options.limit ?? DEFAULT_LIMIT),
      mode: 'vector-fallback',
      reason: `Semantic retrieval failed (${err instanceof Error ? err.message : String(err)}) — using keyword retrieval.`,
      embeddedChunks: 0,
    };
  }
};

export const semanticHitsToContextParts = (hits: readonly ProjectIndexContextHit[]): AiContextPart[] => hits.map((hit) => ({
  kind: 'workspace',
  title: `Indexed project context — ${hit.label}`,
  text: contextHitToText(hit),
}));

const embedAndStoreChunk = async (
  ai: RuntimeEmbedText,
  appId: string,
  modelAlias: string,
  chunk: ProjectIndexChunk,
  chatSettings: ChatAiSettings,
  signal?: AbortSignal,
) => {
  if (typeof ai.embedText !== 'function') return null;
  const result = await ai.embedText({
    input: chunk.text,
    gatewayPreference: chatSettings.gatewayPreference,
    model: chatSettings.embeddingModel.trim() || undefined,
    signal,
  });
  const vector = normalizeVector(result.embedding);
  if (!vector) return null;
  return writeChunkVector({
    appId,
    chunkId: chunk.id,
    contentHash: chunk.hash,
    modelAlias,
    model: result.model ?? '',
    gatewayLabel: result.gatewayLabel ?? '',
    dim: vector.length,
    vector,
    updatedAt: Date.now(),
  });
};

const toSemanticHit = (item: Scored, stale = false): ProjectIndexContextHit => {
  const label = `${item.chunk.path}:${item.chunk.range.startLineNumber}-${item.chunk.range.endLineNumber}`;
  return {
    id: `index-hit:${item.chunk.id}`,
    kind: 'index-hit',
    label,
    fileId: item.chunk.fileId,
    chunkId: item.chunk.id,
    path: item.chunk.path,
    range: item.chunk.range,
    language: item.chunk.language,
    contentHash: item.chunk.hash,
    dirty: item.chunk.dirty,
    includeBody: true,
    removable: true,
    implicit: false,
    stale,
    charCount: item.chunk.text.length,
    text: item.chunk.text,
    snippet: buildSnippet(item.chunk.text, item.matchedTerms),
    score: item.score,
    keywordScore: item.keywordScore,
    vectorScore: item.vectorScore,
  };
};

const enforceCharBudget = (hits: ProjectIndexContextHit[], maxChars: number): ProjectIndexContextHit[] => {
  let remaining = maxChars;
  const clipped: ProjectIndexContextHit[] = [];
  for (const hit of hits) {
    if (remaining <= 0) break;
    const text = hit.text.length > remaining ? `${hit.text.slice(0, Math.max(0, remaining - 28))}\n[...context clipped...]` : hit.text;
    clipped.push({ ...hit, text, charCount: text.length });
    remaining -= text.length;
  }
  return clipped;
};

const normalizeVector = (vector: unknown): number[] | null => {
  if (!Array.isArray(vector) || vector.length === 0) return null;
  const normalized = vector.map(Number).filter((value) => Number.isFinite(value));
  return normalized.length === vector.length ? normalized : null;
};

const cosineSimilarity = (a: readonly number[], b: readonly number[]): number => {
  const length = Math.min(a.length, b.length);
  if (length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let index = 0; index < length; index += 1) {
    dot += a[index] * b[index];
    normA += a[index] * a[index];
    normB += b[index] * b[index];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

const normalizeKeywordScore = (score: number): number => Math.min(1, Math.max(0, score / 24));

const tokenize = (query: string): string[] => Array.from(new Set(
  query.toLowerCase().split(/[^a-z0-9_.$/-]+/i).map((term) => term.trim()).filter((term) => term.length >= 2),
));

const lexicalScore = (chunk: ProjectIndexChunk, terms: readonly string[]): number => {
  const haystack = `${chunk.path}\n${chunk.name}\n${chunk.language}\n${chunk.text}`.toLowerCase();
  return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
};

const buildSnippet = (text: string, matchedTerms: readonly string[]): string => {
  const lower = text.toLowerCase();
  const firstMatch = matchedTerms.map((term) => lower.indexOf(term)).filter((index) => index >= 0).sort((a, b) => a - b)[0] ?? 0;
  const start = Math.max(0, firstMatch - 120);
  const end = Math.min(text.length, firstMatch + 260);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).replace(/\s+/g, ' ').trim()}${end < text.length ? '…' : ''}`;
};
