import type { HostClient, TytusResource, TytusResourceGraph } from '@tytus/host-api';
import type { ChatTarget, ChatTargetAgentFamily, PodAgentChatStatus } from '../types';

export const ATOMEK_CHAT_TARGET: ChatTarget = {
  kind: 'atomek-ai',
  id: 'atomek',
  label: 'Atomek',
  description: 'Workspace assistant',
  available: true,
};

const SELECTED_TARGET_KEY_PREFIX = 'atomek:selected-chat-target';
const FAMILY_LABELS: Record<ChatTargetAgentFamily, string> = {
  openclaw: 'OpenClaw',
  hermes: 'Hermes',
};

const PRIVATE_NET_URL = /https?:\/\/(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})(?::\d+)?\S*/gi;
const PRIVATE_NET_IP = /\b(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})\b/g;
const PROVIDER_OR_MODEL = /\b(?:MiniMax(?:-M[\w.-]+)?|Moonshot|Kimi|DeepSeek|Qwen|Alibaba|Xiaomi|Nous|OpenRouter|Strato|Scalesys|ail-compound|switchAILocal|OpenAI-compatible|vLLM|llama\.cpp)\b/gi;
const INFRA_KEYS = /\b(?:route[_-]?id|pod[_-]?id|droplet[_-]?id|provider[_-]?id|publicUrl|gatewayUrl|privateUrl)\b\s*[:=]\s*[^\s,;]+/gi;
const POD_TOKEN = /\b(?:pod-agent|ail-route|strato-eu|wannolot|scalesys)[._:-][a-z0-9._:-]{4,}\b/gi;
const INFRA_URL = /https?:\/\/[^\s)]*(?:tytus\.traylinx\.com|strato|scalesys|wannolot|droplet|gateway|route|\.internal|\.local|digitalocean|do\.com|hetzner)[^\s)]*/gi;
const PRIVATE_IPV6 = /\b(?:fe80|fc00|fd[0-9a-f]{2}):[0-9a-f:]+(?:%[a-z0-9]+)?\b/gi;

export function sanitizeVisibleAgentText(value: string): string {
  return value
    .replace(PRIVATE_NET_URL, 'private gateway')
    .replace(INFRA_URL, 'private gateway')
    .replace(PRIVATE_IPV6, 'private gateway')
    .replace(PRIVATE_NET_IP, 'private gateway')
    .replace(INFRA_KEYS, 'agent runtime')
    .replace(POD_TOKEN, 'your Tytus pod')
    .replace(PROVIDER_OR_MODEL, 'agent runtime')
    .replace(/\s{3,}/g, '  ');
}

export function friendlyAgentError(message: string): { message: string; retryable: boolean } {
  const raw = message.toLowerCase();
  if (/\b(503|502|504|warm|warming|boot|starting|not ready|temporarily unavailable)\b/.test(raw)) {
    return { message: 'Agent is warming up. Try again in a moment.', retryable: true };
  }
  if (/\b(timeout|timed out|aborted)\b/.test(raw)) {
    return { message: 'Connection timed out. The agent may still be working. Try again.', retryable: true };
  }
  if (/\b(offline|stopped|unreachable|not found|404)\b/.test(raw)) {
    return { message: 'Agent is offline. Restart the pod or pick another agent.', retryable: true };
  }
  const safe = sanitizeVisibleAgentText(message).trim();
  return { message: safe || 'Agent chat failed. Try again or pick another agent.', retryable: false };
}

export function selectedChatTargetStorageKey(workspaceKey: string): string {
  return `${SELECTED_TARGET_KEY_PREFIX}:${workspaceKey}`;
}

export function readSelectedChatTargetId(workspaceKey: string): string {
  try {
    return localStorage.getItem(selectedChatTargetStorageKey(workspaceKey))?.trim() || ATOMEK_CHAT_TARGET.id;
  } catch {
    return ATOMEK_CHAT_TARGET.id;
  }
}

export function writeSelectedChatTargetId(workspaceKey: string, targetId: string): void {
  try {
    localStorage.setItem(selectedChatTargetStorageKey(workspaceKey), targetId || ATOMEK_CHAT_TARGET.id);
  } catch {
    // Browser storage may be unavailable in embedded/dev contexts.
  }
}

function metadataString(meta: Record<string, unknown> | undefined, ...keys: string[]): string {
  if (!meta) return '';
  for (const key of keys) {
    const value = meta[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  return '';
}

function resourcePodId(resource: TytusResource): string {
  const fromMeta = metadataString(resource.metadata, 'podId', 'pod_id', 'pod', 'id');
  if (fromMeta) return fromMeta;
  const parts = resource.id.split('.').filter(Boolean);
  if (parts[0] === 'pod-agent') return parts[parts.length - 1] ?? resource.id;
  if (parts[0] === 'ail-route') return parts[1] ?? resource.id;
  return resource.id;
}

function resourceRouteId(resource: TytusResource): string | null {
  return metadataString(resource.metadata, 'routeId', 'route_id') || null;
}

function familyFromText(text: string): ChatTargetAgentFamily | null {
  const raw = text.toLowerCase();
  if (raw.includes('hermes')) return 'hermes';
  if (raw.includes('openclaw') || raw.includes('nemoclaw')) return 'openclaw';
  return null;
}

function resourceFamily(resource: TytusResource): ChatTargetAgentFamily | null {
  if (resource.kind !== 'pod-agent') return null;
  return familyFromText([
    resource.label,
    resource.id,
    metadataString(resource.metadata, 'displayName', 'display_name', 'name', 'podName', 'pod_name'),
    metadataString(resource.metadata, 'agentFamily', 'agent_family', 'agentType', 'agent_type', 'internalAgentType', 'brand'),
  ].join(' '));
}

function statusFromResource(resource: TytusResource): PodAgentChatStatus {
  const raw = String(resource.status ?? '').toLowerCase();
  if (raw === 'ready' || raw === 'available' || raw === 'running') return 'running';
  if (raw === 'degraded' || raw === 'starting' || raw === 'warming' || raw === 'booting') return 'warming';
  if (raw === 'stopped' || raw === 'unreachable' || raw === 'needs-setup' || raw === 'offline' || raw === 'error') return 'stopped';
  return 'unknown';
}

function isSafeCustomLabel(label: string): boolean {
  const trimmed = label.trim();
  if (trimmed.length < 2 || trimmed.length > 44) return false;
  if (PRIVATE_NET_URL.test(trimmed) || INFRA_URL.test(trimmed) || PRIVATE_IPV6.test(trimmed) || PRIVATE_NET_IP.test(trimmed) || INFRA_KEYS.test(trimmed) || POD_TOKEN.test(trimmed) || PROVIDER_OR_MODEL.test(trimmed)) {
    PRIVATE_NET_URL.lastIndex = 0;
    INFRA_URL.lastIndex = 0;
    PRIVATE_IPV6.lastIndex = 0;
    PRIVATE_NET_IP.lastIndex = 0;
    INFRA_KEYS.lastIndex = 0;
    POD_TOKEN.lastIndex = 0;
    PROVIDER_OR_MODEL.lastIndex = 0;
    return false;
  }
  PRIVATE_NET_URL.lastIndex = 0;
  INFRA_URL.lastIndex = 0;
  PRIVATE_IPV6.lastIndex = 0;
  PRIVATE_NET_IP.lastIndex = 0;
  INFRA_KEYS.lastIndex = 0;
  POD_TOKEN.lastIndex = 0;
  PROVIDER_OR_MODEL.lastIndex = 0;
  return /^[\p{L}\p{N}][\p{L}\p{N} ._()'&+-]*$/u.test(trimmed);
}

function baseLabel(resource: TytusResource, family: ChatTargetAgentFamily): string {
  const custom = metadataString(resource.metadata, 'displayName', 'display_name', 'customName', 'custom_name', 'podDisplayName', 'pod_display_name', 'name');
  if (custom) {
    const safe = sanitizeVisibleAgentText(custom)
      .replace(/\bNemoClaw\b/gi, 'OpenClaw')
      .replace(/\s+/g, ' ')
      .trim();
    if (isSafeCustomLabel(safe)) return safe;
  }
  return FAMILY_LABELS[family];
}

function descriptionFor(family: ChatTargetAgentFamily, status: PodAgentChatStatus): string {
  const familyLabel = FAMILY_LABELS[family];
  if (status === 'running') return `${familyLabel} pod agent · ready`;
  if (status === 'warming') return `${familyLabel} pod agent · warming`;
  if (status === 'stopped') return `${familyLabel} pod agent · offline`;
  return `${familyLabel} pod agent · status unknown`;
}

function targetsFromResources(graph: TytusResourceGraph | null): ChatTarget[] {
  const resources = graph?.resources ?? [];
  const candidates = resources.flatMap((resource) => {
    const agentFamily = resourceFamily(resource);
    if (!agentFamily) return [];
    const status = statusFromResource(resource);
    const podId = resourcePodId(resource);
    if (!podId) return [];
    const routeId = resourceRouteId(resource);
    return [{
      kind: 'pod-agent' as const,
      id: `pod-agent:${agentFamily}:${podId}`,
      podId,
      routeId,
      agentFamily,
      label: baseLabel(resource, agentFamily),
      description: descriptionFor(agentFamily, status),
      status,
      available: status === 'running',
    }];
  });
  return disambiguateTargets(candidates);
}

function disambiguateTargets(targets: ChatTarget[]): ChatTarget[] {
  const podTargets = targets.filter((target): target is Extract<ChatTarget, { kind: 'pod-agent' }> => target.kind === 'pod-agent');
  const familyCounts = podTargets.reduce<Record<ChatTargetAgentFamily, number>>((acc, target) => {
    acc[target.agentFamily] = (acc[target.agentFamily] ?? 0) + 1;
    return acc;
  }, { openclaw: 0, hermes: 0 });
  const seenLabels: Record<string, number> = {};
  const seenFamilies: Record<ChatTargetAgentFamily, number> = { openclaw: 0, hermes: 0 };
  return targets.map((target) => {
    if (target.kind !== 'pod-agent') return target;
    const base = target.label;
    const familyBase = FAMILY_LABELS[target.agentFamily];
    seenFamilies[target.agentFamily] += 1;
    const key = base.toLowerCase();
    seenLabels[key] = (seenLabels[key] ?? 0) + 1;
    const duplicateBase = podTargets.filter((candidate) => candidate.label.toLowerCase() === key).length > 1;
    const needsFamilySuffix = base === familyBase && familyCounts[target.agentFamily] > 1;
    if (!duplicateBase && !needsFamilySuffix) return target;
    const suffix = needsFamilySuffix ? seenFamilies[target.agentFamily] : seenLabels[key];
    return { ...target, label: `${base} ${suffix}` };
  });
}

type DaemonStateLike = {
  agents?: Array<{ id?: string; status?: string; meta?: Record<string, unknown> }>;
  included?: Array<{ id?: string; status?: string; agentId?: string; kind?: string; meta?: Record<string, unknown> }>;
};

function daemonStateTargets(host: HostClient): ChatTarget[] {
  const state = host.daemon?.state as DaemonStateLike | undefined;
  const pods = state?.included ?? [];
  const agents = state?.agents ?? [];
  const byAgentId = new Map(agents.map((agent) => [agent.id, agent]));
  const resources: TytusResource[] = pods.flatMap((pod) => {
    const id = pod.id ?? '';
    const agent = pod.agentId ? byAgentId.get(pod.agentId) : undefined;
    const meta = { ...(agent?.meta ?? {}), ...(pod.meta ?? {}) };
    const family = familyFromText([id, pod.kind, metadataString(meta, 'displayName', 'display_name', 'agentFamily', 'agentType', 'brand')].join(' '));
    if (!id || !family) return [];
    return [{
      id: `pod-agent.${id}`,
      kind: 'pod-agent',
      label: FAMILY_LABELS[family],
      status: pod.status === 'running' ? 'ready' : pod.status ?? 'unknown',
      capabilities: ['text-gen'],
      trustTier: 'tytus-pod',
      sandbox: 'pod',
      allowedRoots: [],
      cost: { unit: 'tytus-units', tier: 'mid' },
      metadata: { ...meta, podId: id },
    } satisfies TytusResource];
  });
  return targetsFromResources({ generatedAt: new Date().toISOString(), resources, warnings: [] });
}

export async function buildChatTargets(host: HostClient, graph?: TytusResourceGraph | null): Promise<ChatTarget[]> {
  let resourceGraph = graph ?? null;
  if (resourceGraph === null) {
    try {
      resourceGraph = await host.resources?.list?.() ?? null;
    } catch {
      resourceGraph = null;
    }
  }
  const fromResources = targetsFromResources(resourceGraph);
  const fallback = fromResources.length > 0 ? [] : daemonStateTargets(host);
  const byId = new Map<string, ChatTarget>();
  for (const target of [ATOMEK_CHAT_TARGET, ...fromResources, ...fallback]) byId.set(target.id, target);
  return [...byId.values()];
}
