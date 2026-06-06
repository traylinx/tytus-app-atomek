import type { TytusResource, TytusResourceGraph } from '@tytus/host-api';
import type { TeamPresetId, TeamPresetPreview, TeamRoleAssignment } from './missionTypes';

export function resourceSummary(resources: readonly TytusResource[]): string {
  const counts = resources.reduce<Record<string, number>>((acc, resource) => {
    acc[resource.kind] = (acc[resource.kind] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).map(([kind, count]) => `${count} ${kind}`).join(' · ') || 'no resources';
}

export function resourceMetadataString(resource: TytusResource, key: string): string {
  const value = resource.metadata?.[key];
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

export function resourcePodId(resource: TytusResource): string {
  const metadataPodId = resourceMetadataString(resource, 'podId');
  if (metadataPodId) return metadataPodId;
  const match = resource.id.match(/(?:pod-agent|ail-route)\.([^.]+)/);
  return match?.[1] ?? '';
}

export function resourceRouteId(resource: TytusResource): string | null {
  return resourceMetadataString(resource, 'routeId') || resourceMetadataString(resource, 'route_id') || null;
}

export function resourceAgentFamily(resource: TytusResource): 'openclaw' | 'hermes' | 'ail' | null {
  const raw = [
    resourceMetadataString(resource, 'agentFamily'),
    resourceMetadataString(resource, 'agentType'),
    resourceMetadataString(resource, 'internalAgentType'),
    resourceMetadataString(resource, 'brand'),
    resource.label,
  ].join(' ').toLowerCase();
  if (resource.kind === 'ail-route' || /(^|[^a-z0-9])ail([^a-z0-9]|$)/.test(raw)) return 'ail';
  if (raw.includes('hermes')) return 'hermes';
  if (raw.includes('openclaw') || raw.includes('nemoclaw')) return 'openclaw';
  return null;
}

export function resourceDisplayLabel(resource: TytusResource): string {
  const family = resourceAgentFamily(resource);
  const podId = resourcePodId(resource);
  if (resource.kind === 'pod-agent' && family === 'openclaw') return `OpenClaw agent${podId ? ` pod ${podId}` : ''}`;
  if (resource.kind === 'pod-agent' && family === 'hermes') return `Hermes agent${podId ? ` pod ${podId}` : ''}`;
  if (resource.kind === 'ail-route') return `AIL gateway${podId ? ` ${podId}` : ''}`;
  return resource.label
    .replace(/\bNemoClaw\b/g, 'OpenClaw')
    .replace(/\bnemoclaw\b/gi, 'OpenClaw');
}

export function resourceDisplayDetail(resource: TytusResource): string {
  if (resource.kind === 'pod-agent') {
    const family = resourceAgentFamily(resource);
    const units = resourceMetadataString(resource, 'units');
    const base = family === 'openclaw'
      ? 'OpenClaw pod agent'
      : family === 'hermes'
        ? 'Hermes reasoning agent'
        : 'Tytus pod agent';
    return `${base}${units ? ` · ${units} unit${units === '1' ? '' : 's'}` : ''} · ${resource.trustTier}`;
  }
  if (resource.kind === 'local-cli') return `Local CLI · ${resource.capabilities.slice(0, 3).join(', ') || 'tool launch'}`;
  if (resource.kind === 'shared-folder') return `Shared folder · ${resource.sandbox}`;
  if (resource.kind === 'app-skill') return `App skill · ${resource.capabilities.slice(0, 3).join(', ') || 'skill instructions'}`;
  if (resource.kind === 'ail-route') return `Remote AIL route · ${resource.capabilities.slice(0, 3).join(', ') || 'text-gen'}`;
  return `${resource.kind} · ${resource.trustTier}`;
}

export function summarizeAgentTeam(graph: TytusResourceGraph | null): Array<{ label: string; value: number; detail: string; status: string }> {
  const resources = graph?.resources ?? [];
  const available = (resource: TytusResource) => resource.status === 'ready' || resource.status === 'available';
  const openClaw = resources.filter((resource) => resource.kind === 'pod-agent' && resourceAgentFamily(resource) === 'openclaw');
  const hermes = resources.filter((resource) => resource.kind === 'pod-agent' && resourceAgentFamily(resource) === 'hermes');
  const local = resources.filter((resource) => resource.kind === 'local-cli' && available(resource));
  const shared = resources.filter((resource) => resource.kind === 'shared-folder' && available(resource));
  return [
    { label: 'OpenClaw', value: openClaw.length, detail: 'fast pod agents for critique, planning, channel/app workflows', status: openClaw.some(available) ? 'ready' : 'not allocated' },
    { label: 'Hermes', value: hermes.length, detail: 'heavier pod agent family when allocated', status: hermes.some(available) ? 'ready' : 'available when installed' },
    { label: 'Local agents', value: local.length, detail: 'Claude, OpenCode, Codex, pi, Kimi through Tytus tray', status: local.length ? 'ready' : 'missing' },
    { label: 'Shared folders', value: shared.length, detail: 'mission context and handoff fabric for the whole team', status: shared.length ? 'ready' : 'needs setup' },
  ];
}

export function summarizeResourceFabric(graph: TytusResourceGraph | null): Array<{ label: string; detail: string; status: string }> {
  const resources = graph?.resources ?? [];
  const hasReady = (kind: TytusResource['kind']) => resources.some((resource) => resource.kind === kind && (resource.status === 'ready' || resource.status === 'available'));
  return [
    { label: 'Local computer', detail: hasReady('local-cli') ? 'Local CLIs, files, terminal, and installed apps are reachable through Tytus tray.' : 'Waiting for local tools from Tytus tray.', status: hasReady('local-cli') ? 'ready' : 'needs setup' },
    { label: 'Shared folders', detail: hasReady('shared-folder') ? 'Files, transcripts, patches, and artifacts can move between local agents and pods.' : 'Bind a shared folder to create the exchange layer.', status: hasReady('shared-folder') ? 'ready' : 'needs setup' },
    { label: 'Tytus pods', detail: hasReady('pod-agent') ? 'OpenClaw/Hermes pods can pick up context and return remote work products.' : 'No pod agent is ready yet.', status: hasReady('pod-agent') ? 'ready' : 'needs setup' },
    { label: 'Local apps', detail: hasReady('app-skill') ? 'App skills expose JULI3TA, Blender, Remotion, and other tools as mission capabilities.' : 'App skills appear when installed/configured.', status: hasReady('app-skill') ? 'ready' : 'optional' },
  ];
}

export const TEAM_PRESET_DEFINITIONS: Array<Pick<TeamPresetPreview, 'id' | 'label' | 'summary' | 'bestFor'>> = [
  {
    id: 'repo-repair',
    label: 'Repo Repair',
    summary: 'Local implementer plus independent reviewer, with all transcripts in the mission folder.',
    bestFor: 'code fixes, docs, release cleanup',
  },
  {
    id: 'pod-local',
    label: 'OpenClaw + Local',
    summary: 'OpenClaw/Hermes pod perspective plus local Claude/OpenCode/Codex/pi execution.',
    bestFor: 'cross-agent critique, planning, distributed work',
  },
  {
    id: 'creative-production',
    label: 'Creative Production',
    summary: 'App skills and local/pod agents share source assets, scripts, outputs, and approvals.',
    bestFor: 'JULI3TA, Blender, Remotion, media pipelines',
  },
  {
    id: 'research-watch',
    label: 'Research Watch',
    summary: 'Remote/pod research, local synthesis, shared-folder handoff, optional channel updates.',
    bestFor: 'monitoring, summaries, recurring intelligence',
  },
];

export function isResourceUsable(resource: TytusResource): boolean {
  return resource.status === 'ready' || resource.status === 'available' || resource.status === 'degraded';
}

export function resourceSearchText(resource: TytusResource): string {
  return [
    resource.id,
    resource.label,
    resource.kind,
    resourceDisplayLabel(resource),
    resourceDisplayDetail(resource),
    resource.capabilities.join(' '),
    Object.values(resource.metadata ?? {}).join(' '),
  ].join(' ').toLowerCase();
}

export function findResource(resources: TytusResource[], predicate: (resource: TytusResource) => boolean): TytusResource | null {
  return resources.find((resource) => isResourceUsable(resource) && predicate(resource)) ?? null;
}

export function findResourceByTerms(resources: TytusResource[], kind: TytusResource['kind'], terms: string[]): TytusResource | null {
  return findResource(resources, (resource) => {
    if (resource.kind !== kind) return false;
    const haystack = resourceSearchText(resource);
    return terms.some((term) => {
      const normalized = term.trim().toLowerCase();
      if (!normalized) return false;
      if (normalized.length <= 4) {
        const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`).test(haystack);
      }
      return haystack.includes(normalized);
    });
  });
}

export function assignmentFromResource(
  role: TeamRoleAssignment['role'],
  label: string,
  purpose: string,
  resource: TytusResource | null,
  fallback: string,
): TeamRoleAssignment {
  return {
    role,
    label,
    purpose,
    resourceId: resource?.id ?? `missing:${role}`,
    resourceLabel: resource ? resourceDisplayLabel(resource) : fallback,
    status: resource?.status ?? 'needs-setup',
    trustTier: resource?.trustTier ?? 'not-available',
    sandbox: resource?.sandbox ?? 'none',
  };
}

export function buildTeamPresetPreview(graph: TytusResourceGraph | null, presetId: TeamPresetId = 'repo-repair'): TeamPresetPreview {
  const definition = TEAM_PRESET_DEFINITIONS.find((item) => item.id === presetId) ?? TEAM_PRESET_DEFINITIONS[0];
  const resources = graph?.resources ?? [];
  const openClaw = findResource(resources, (resource) => resource.kind === 'pod-agent' && resourceAgentFamily(resource) === 'openclaw');
  const hermes = findResource(resources, (resource) => resource.kind === 'pod-agent' && resourceAgentFamily(resource) === 'hermes');
  const ail = findResource(resources, (resource) => resource.kind === 'ail-route');
  const shared = findResource(resources, (resource) => resource.kind === 'shared-folder');
  const claude = findResourceByTerms(resources, 'local-cli', ['claude']);
  const openCode = findResourceByTerms(resources, 'local-cli', ['opencode', 'open code']);
  const codex = findResourceByTerms(resources, 'local-cli', ['codex']);
  const pi = findResourceByTerms(resources, 'local-cli', ['pi']);
  const kimi = findResourceByTerms(resources, 'local-cli', ['kimi']);
  const anyLocal = findResource(resources, (resource) => resource.kind === 'local-cli');
  const juli3ta = findResourceByTerms(resources, 'app-skill', ['juli3ta', 'music', 'song']);
  const blender = findResourceByTerms(resources, 'app-skill', ['blender', '3d']);
  const remotion = findResourceByTerms(resources, 'app-skill', ['remotion', 'video', 'render']);
  const anySkill = findResource(resources, (resource) => resource.kind === 'app-skill');

  const planner = presetId === 'pod-local'
    ? (openClaw ?? hermes ?? ail ?? claude ?? anyLocal)
    : presetId === 'creative-production'
      ? (hermes ?? ail ?? claude ?? anyLocal)
      : presetId === 'research-watch'
        ? (openClaw ?? ail ?? hermes ?? claude ?? anyLocal)
        : (claude ?? openCode ?? ail ?? anyLocal);
  const implementer = presetId === 'creative-production'
    ? (juli3ta ?? blender ?? remotion ?? anySkill ?? openCode ?? claude ?? anyLocal)
    : (openCode ?? claude ?? codex ?? anyLocal);
  const reviewer = presetId === 'pod-local'
    ? (codex ?? pi ?? kimi ?? openClaw ?? claude ?? anyLocal)
    : presetId === 'research-watch'
      ? (pi ?? kimi ?? codex ?? openClaw ?? anyLocal)
      : (codex ?? pi ?? openClaw ?? kimi ?? anyLocal);
  const appTool = presetId === 'creative-production'
    ? (juli3ta ?? blender ?? remotion ?? anySkill)
    : presetId === 'research-watch'
      ? findResourceByTerms(resources, 'app-skill', ['browser', 'channel', 'telegram']) ?? anySkill
      : anySkill;

  const assignments: TeamRoleAssignment[] = [
    assignmentFromResource('planner', 'Planner', 'Break goal into tasks, risks, and required context.', planner, 'No planner agent ready'),
    assignmentFromResource('implementer', 'Implementer', 'Execute local/app work and return transcript or patch proposal.', implementer, 'No local/app implementer ready'),
    assignmentFromResource('reviewer', 'Reviewer', 'Independent critique before approval or handoff.', reviewer, 'No reviewer agent ready'),
    assignmentFromResource('team-desk', 'Team Desk', 'Shared mission folder for transcripts, outputs, proposals, and handoff.', shared, 'Mission folder only until shared folder is bound'),
  ];
  if (presetId === 'creative-production' || appTool) {
    assignments.push(assignmentFromResource('app-tool', 'App Tool', 'Drive installed local app skill through mission context.', appTool, 'No configured app skill'));
  }

  const readyCount = assignments.filter((assignment) => assignment.status === 'ready' || assignment.status === 'available' || assignment.status === 'degraded').length;
  const readiness: TeamPresetPreview['readiness'] = readyCount >= assignments.length - 1 ? 'ready' : readyCount >= 2 ? 'partial' : 'needs-setup';
  return { ...definition, readiness, assignments };
}

export function pickTeamPresetId(goal: string, graph: TytusResourceGraph | null, requested?: string): TeamPresetId {
  if (requested && TEAM_PRESET_DEFINITIONS.some((item) => item.id === requested)) return requested as TeamPresetId;
  const text = goal.toLowerCase();
  if (/(music|song|audio|video|render|blender|remotion|juli3ta|creative)/.test(text)) return 'creative-production';
  if (/(research|watch|monitor|news|summar|scan)/.test(text)) return 'research-watch';
  if ((graph?.resources ?? []).some((resource) => resource.kind === 'pod-agent' && isResourceUsable(resource))) return 'pod-local';
  return 'repo-repair';
}

export function buildTeamPresetPreviews(graph: TytusResourceGraph | null): TeamPresetPreview[] {
  return TEAM_PRESET_DEFINITIONS.map((definition) => buildTeamPresetPreview(graph, definition.id));
}

export function formatAssignment(assignment: TeamRoleAssignment): string {
  return `${assignment.label}: ${assignment.resourceLabel} (${assignment.status})`;
}
