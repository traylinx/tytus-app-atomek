export type RuntimeGatewayPreference = 'auto' | 'remote' | 'local';

export type RuntimeModelInfo = {
  id: string;
  source?: string;
  gatewayLabel?: string;
  [key: string]: unknown;
};

export type ListRuntimeModelsInput = {
  gatewayPreference?: RuntimeGatewayPreference;
  signal?: AbortSignal;
  [key: string]: unknown;
};

type HostLike = {
  ai?: unknown;
};

type RuntimeAiWithModels = {
  listModels?: (input?: ListRuntimeModelsInput) => Promise<unknown>;
};

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

const runtimeAi = (host: HostLike): RuntimeAiWithModels | null => {
  if (!isRecord(host.ai)) return null;
  return host.ai as RuntimeAiWithModels;
};

const modelId = (value: unknown): string | null => {
  if (!isRecord(value)) return null;
  const id = value.id;
  return typeof id === 'string' && id.trim() ? id : null;
};

const normalizeModel = (value: unknown): RuntimeModelInfo | null => {
  const id = modelId(value);
  if (!id || !isRecord(value)) return null;
  return { ...value, id };
};

const includesEmbeddingToken = (value: unknown): boolean => {
  if (typeof value === 'string') return /\bembeddings?\b|text-embedding/i.test(value);
  if (Array.isArray(value)) return value.some(includesEmbeddingToken);
  if (isRecord(value)) return Object.values(value).some(includesEmbeddingToken);
  return false;
};

/** Runtime check for host.ai.listModels without relying on host-api compile-time shape. */
export const hasModelDiscoveryApi = (host: HostLike): boolean => {
  const ai = runtimeAi(host);
  return typeof ai?.listModels === 'function';
};

/**
 * Lists runtime models when the host exposes discovery. Returns [] when absent
 * or when the host returns a non-array payload. No model IDs are hardcoded here.
 */
export const listRuntimeModels = async (
  host: HostLike,
  input?: ListRuntimeModelsInput,
): Promise<RuntimeModelInfo[]> => {
  const ai = runtimeAi(host);
  if (typeof ai?.listModels !== 'function') return [];
  const found = await ai.listModels(input);
  if (!Array.isArray(found)) return [];
  return found.map(normalizeModel).filter((model): model is RuntimeModelInfo => Boolean(model));
};

/**
 * Capability detector based only on explicit metadata fields returned by host.ai.
 * It intentionally does not infer from vendor/model names.
 */
export const modelSupportsEmbedding = (model: RuntimeModelInfo): boolean => {
  const explicitBoolean = model.embedding ?? model.embeddings ?? model.supportsEmbedding ?? model.supportsEmbeddings;
  if (explicitBoolean === true) return true;

  return includesEmbeddingToken(model.capability)
    || includesEmbeddingToken(model.capabilities)
    || includesEmbeddingToken(model.modality)
    || includesEmbeddingToken(model.modalities)
    || includesEmbeddingToken(model.task)
    || includesEmbeddingToken(model.tasks)
    || includesEmbeddingToken(model.type)
    || includesEmbeddingToken(model.kind);
};
