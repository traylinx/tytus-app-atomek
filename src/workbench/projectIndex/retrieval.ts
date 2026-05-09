import type { WorkbenchRange } from '../types';
import type { ProjectIndexChunk, ProjectIndexSnapshot } from './chunker';
import type { ProjectIndexStaleReport } from './indexStore';

export type ProjectIndexRetrievalOptions = {
  limit?: number;
  maxChars?: number;
  minScore?: number;
  includeDirty?: boolean;
};

export type ProjectIndexContextHit = {
  id: string;
  kind: 'index-hit';
  label: string;
  fileId: string;
  chunkId: string;
  path: string;
  range: WorkbenchRange;
  language: string;
  contentHash: string;
  dirty: boolean;
  includeBody: true;
  removable: true;
  implicit: false;
  stale?: boolean;
  charCount: number;
  text: string;
  snippet: string;
  score: number;
};

type ScoredChunk = { chunk: ProjectIndexChunk; score: number; matchedTerms: string[] };

const DEFAULT_LIMIT = 8;
const DEFAULT_MAX_CHARS = 12_000;

export const retrieveProjectContext = (
  snapshot: ProjectIndexSnapshot,
  query: string,
  options: ProjectIndexRetrievalOptions = {},
  staleReport?: ProjectIndexStaleReport,
): ProjectIndexContextHit[] => {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const staleFileIds = new Set(staleReport?.files.map((file) => file.fileId) ?? []);
  const scored = snapshot.chunks
    .filter((chunk) => options.includeDirty !== false || !chunk.dirty)
    .map((chunk) => scoreChunk(chunk, terms))
    .filter((item) => item.score >= (options.minScore ?? 1))
    .sort((a, b) => b.score - a.score || a.chunk.path.localeCompare(b.chunk.path) || a.chunk.ordinal - b.chunk.ordinal);

  const hits: ProjectIndexContextHit[] = [];
  const seen = new Set<string>();
  let charBudget = options.maxChars ?? DEFAULT_MAX_CHARS;

  for (const item of scored) {
    if (hits.length >= (options.limit ?? DEFAULT_LIMIT) || charBudget <= 0) break;
    const key = `${item.chunk.fileId}:${item.chunk.ordinal}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const text = item.chunk.text.length > charBudget ? `${item.chunk.text.slice(0, Math.max(0, charBudget - 28))}\n[...context clipped...]` : item.chunk.text;
    hits.push(toContextHit(item, text, staleFileIds.has(item.chunk.fileId)));
    charBudget -= text.length;
  }

  return hits;
};

export const toContextHit = (item: ScoredChunk, text = item.chunk.text, stale = false): ProjectIndexContextHit => {
  const { chunk, score, matchedTerms } = item;
  return {
    id: `index-hit:${chunk.id}`,
    kind: 'index-hit',
    label: `${chunk.path}:${chunk.range.startLineNumber}-${chunk.range.endLineNumber}`,
    fileId: chunk.fileId,
    chunkId: chunk.id,
    path: chunk.path,
    range: chunk.range,
    language: chunk.language,
    contentHash: chunk.hash,
    dirty: chunk.dirty,
    includeBody: true,
    removable: true,
    implicit: false,
    stale,
    charCount: text.length,
    text,
    snippet: buildSnippet(chunk.text, matchedTerms),
    score,
  };
};

export const contextHitToText = (hit: ProjectIndexContextHit): string => [
  `Path: ${hit.path}`,
  `Language: ${hit.language}`,
  `Range: ${hit.range.startLineNumber}:${hit.range.startColumn}-${hit.range.endLineNumber}:${hit.range.endColumn}`,
  `Hash: ${hit.contentHash}`,
  hit.dirty ? 'Dirty: yes' : 'Dirty: no',
  hit.stale ? 'Stale: yes' : null,
  '',
  hit.text,
].filter((line): line is string => line !== null).join('\n');

export const tokenize = (query: string): string[] => Array.from(new Set(
  query
    .toLowerCase()
    .split(/[^a-z0-9_.$/-]+/i)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2),
));

const scoreChunk = (chunk: ProjectIndexChunk, terms: readonly string[]): ScoredChunk => {
  const haystack = chunk.text.toLowerCase();
  const path = chunk.path.toLowerCase();
  const name = chunk.name.toLowerCase();
  const language = chunk.language.toLowerCase();
  let score = 0;
  const matchedTerms: string[] = [];

  for (const term of terms) {
    const textHits = countOccurrences(haystack, term);
    const pathHits = countOccurrences(path, term);
    const nameHits = countOccurrences(name, term);
    const languageHits = language === term ? 1 : 0;
    if (textHits + pathHits + nameHits + languageHits === 0) continue;
    matchedTerms.push(term);
    score += Math.min(textHits, 12);
    score += pathHits * 4;
    score += nameHits * 6;
    score += languageHits * 3;
    if (haystack.includes(`function ${term}`) || haystack.includes(`const ${term}`) || haystack.includes(`class ${term}`) || haystack.includes(`type ${term}`)) score += 3;
  }

  score += Math.max(0, 2 - chunk.ordinal * 0.05);
  return { chunk, score, matchedTerms };
};

const countOccurrences = (text: string, term: string): number => {
  let count = 0;
  let position = text.indexOf(term);
  while (position !== -1) {
    count += 1;
    position = text.indexOf(term, position + term.length);
  }
  return count;
};

const buildSnippet = (text: string, matchedTerms: readonly string[]): string => {
  const lower = text.toLowerCase();
  const firstMatch = matchedTerms
    .map((term) => lower.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0] ?? 0;
  const start = Math.max(0, firstMatch - 120);
  const end = Math.min(text.length, firstMatch + 260);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';
  return `${prefix}${text.slice(start, end).replace(/\s+/g, ' ').trim()}${suffix}`;
};
