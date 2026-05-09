import {
  listRuntimeModels,
  modelSupportsEmbedding,
  type ListRuntimeModelsInput,
  type RuntimeModelInfo,
} from './modelCapabilities';

type HostLike = {
  ai?: unknown;
};

type RuntimeAiWithEmbeddings = {
  embedText?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

const runtimeAi = (host: HostLike): RuntimeAiWithEmbeddings | null => {
  if (!isRecord(host.ai)) return null;
  return host.ai as RuntimeAiWithEmbeddings;
};

/** Runtime check for the optional host.ai.embedText embedding API. */
export const hasEmbeddingApi = (host: HostLike): boolean => {
  const ai = runtimeAi(host);
  return typeof ai?.embedText === 'function';
};

/**
 * Lists embedding-capable models only when host model discovery exposes explicit
 * embedding capability metadata. Never guesses from hardcoded model IDs.
 */
export const listEmbeddingModels = async (
  host: HostLike,
  input?: ListRuntimeModelsInput,
): Promise<RuntimeModelInfo[]> => {
  if (!hasEmbeddingApi(host)) return [];
  const models = await listRuntimeModels(host, input);
  return models.filter(modelSupportsEmbedding);
};

/** Human-readable reason an embedding flow should stay disabled. */
export const embeddingUnavailableReason = (host: HostLike): string | null => {
  if (!isRecord(host.ai)) return 'host.ai is not available in this Tytus build.';
  if (!hasEmbeddingApi(host)) return 'host.ai.embedText is not exposed by this Tytus build.';
  return null;
};
