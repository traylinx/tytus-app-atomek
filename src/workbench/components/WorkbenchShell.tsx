
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import type { AiContextPart, AiThread, HostClient, TytusMission, TytusMissionRun, TytusMissionSummary, TytusResource, TytusResourceGraph } from '@tytus/host-api';
import {
  Bot,
  Bug,
  ChevronDown,
  Check,
  Copy,
  File,
  FileCode2,
  FilePlus2,
  FileSearch,
  Folder,
  FolderOpen,
  GitBranch,
  Eye,
  MessageSquareText,
  MoreHorizontal,
  PanelRight,
  Paperclip,
  Plus,
  Search,
  Send,
  Settings,
  SlidersHorizontal,
  Square,
  RefreshCcw,
  X,
} from 'lucide-react';
import { ensureHandlePermission, filesFromHandles, folderFromHandle, hasFileSystemAccessApi, openFiles, openFolder, saveWorkbenchFile } from '../fileAccess';
import { labelForLanguage } from '../language';
import { markdownToHtml } from '../markdown';
import type { ActivityView, BrowserDirectoryHandleLike, BrowserFileHandleLike, ChatAiSettings, ChatGatewayPreference, ChatMessage, ChatTarget, CursorPosition, OutputArtifact, SecondaryTab, WorkbenchFile, WorkbenchFolder, WorkbenchRange } from '../types';
import { useConversation } from '../ai/useConversation';
import { ATOMEK_CHAT_TARGET, buildChatTargets, readSelectedChatTargetId, writeSelectedChatTargetId } from '../ai/chatTargets';
import { buildDocumentRegistry } from '../context/documentRegistry';
import { DEFAULT_CHAT_CONTEXT_SCOPE, contextScopeLabel } from '../context/chatContextStore';
import type { ChatContextAttachment, ChatContextScope, ChatContextState } from '../context/chatContextStore';
import { buildAiContext } from '../context/contextBuilder';
import { useProjectIndex } from '../projectIndex';
import type { ProjectIndexContextHit } from '../projectIndex';
import { retrieveSemanticProjectContext, semanticHitsToContextParts } from '../semantic';
import { buildWorkspaceEditCandidate } from '../edits';
import type { WorkspaceEditFileCandidate } from '../edits';
import { embeddingUnavailableReason, listEmbeddingModels } from '../ai/embeddingCapability';
import { addManualCheckCommand, addManualCheckResult, buildManualCheckFollowupPrompt, createManualCheckSession, latestManualCheckStatus } from '../checks/manualChecks';
import { AtomekBrandMark, AtomekWordmark } from '../brand/AtomekBrand';
import { ATOMEK_EMBEDDED_DOCS, type AtomekEmbeddedDoc } from '../docs/embeddedDocs';
import { getPersistedHandle, savePersistedHandle } from '../persistedHandles';
import type { ManualCheckSession, ManualCheckStatus } from '../checks/manualChecks';

const WorkbenchMonacoEditor = lazy(() => import('../editor/WorkbenchMonacoEditor').then((module) => ({ default: module.WorkbenchMonacoEditor })));

const welcomeFile: WorkbenchFile = {
  id: 'welcome',
  name: 'Agent Team',
  path: 'Agent Team',
  language: 'text',
  content: '',
  dirty: false,
  source: 'sample',
};

const RECENT_KEY = 'tytus.workspace.recent';
const LAYOUT_KEY = 'tytus.workspace.layout';
const SESSION_KEY = 'tytus.atomek.session.v2';
const CHAT_AI_SETTINGS_KEY = 'tytus.atomek.chatAiSettings';
const CHAT_WORKSPACE_KEY = 'atomek:default';
const CURRENT_MISSION_KEY = 'tytus.atomek.currentMission';
const CURRENT_MISSION_EVENT = 'tytus.atomek.currentMissionChanged';
const APP_VERSION = '0.4.28';
const DEFAULT_CHAT_AI_SETTINGS: ChatAiSettings = {
  gatewayPreference: 'auto',
  model: '',
  embeddingModel: '',
};
const ACTIVITY_BAR_WIDTH = 48;

type Props = { host: HostClient };

type AppUpdateStatus = {
  appId: string;
  currentVersion: string | null;
  latestVersion: string | null;
  updateAvailable: boolean;
  manifestUrl: string | null;
  checkedAt: number;
  source: 'featured-catalog' | 'installed-row' | 'none';
  error?: string;
};

type AppUpdateApi = {
  checkUpdate?: () => Promise<AppUpdateStatus>;
  updateSelf?: () => Promise<AppUpdateStatus>;
};


// Canonical built-in TytusOS app ids. Source of truth in TytusOS:
// app/src/components/CommandPalette.tsx and app window registry.
const TYTUS_CORE_APP_IDS = {
  sharedFiles: 'filemanager',
  podInspector: 'pod-inspector',
  channels: 'channels',
  settings: 'settings',
} as const;

type RecentEntry = { name: string; path: string; at: number; kind?: 'file' | 'folder'; handleKey?: string };
type LayoutPrefs = { primaryVisible: boolean; primaryWidth: number; secondaryVisible: boolean; secondaryWidth: number; markdownPreviewVisible: boolean };
type PersistedWorkbenchFile = Pick<WorkbenchFile, 'id' | 'name' | 'path' | 'language' | 'content' | 'dirty' | 'size' | 'source'>;
type PersistedSessionState = { activity?: ActivityView; folder?: { name: string; handleKey?: string | null } | null; files?: PersistedWorkbenchFile[]; openEditorIds?: string[]; activeFileId?: string | null; query?: string; chatInput?: string; welcomeClosed?: boolean; secondaryTab?: SecondaryTab; bottomPanelVisible?: boolean; bottomPanelTab?: BottomPanelTab; recent?: RecentEntry[]; };
type PaletteItem = { label: string; detail: string; run: () => void; disabled?: boolean };
type SearchResult = { file: WorkbenchFile; lineNumber: number; line: string };
type BottomPanelTab = 'problems' | 'output' | 'terminal';
type QuickPromptKind = 'explain' | 'improve' | 'plan' | 'draft' | 'edit';
type AtomekLocalTool = {
  id: string;
  label: string;
  command?: string;
  kind: string;
  status: string;
  version?: string | null;
  description?: string;
};
type AtomekSkillSummary = {
  id: string;
  title: string;
  description: string;
  driver: string;
  source: string;
  status: string;
  appId?: string;
  skillUrl?: string;
  triggers?: string[];
};
type AtomekSkillPack = AtomekSkillSummary & {
  body: string;
  setup?: string[];
};
type LocalAgentRunState = {
  id: string;
  jobId?: string;
  toolId: string;
  label: string;
  status: 'running' | 'failed' | 'complete' | 'canceling';
  startedAt: number;
  finishedAt?: number;
  exitCode?: number;
  taskId?: string;
  taskTitle?: string;
  transcriptPath?: string;
  lines: string[];
};
type EditStats = { added: number; removed: number; changed: number };
type PendingEdit = {
  fileId: string;
  fileName: string;
  originalContent: string;
  proposedContent: string;
  sourceTitle: string;
  extractionLabel: string;
  stats: EditStats;
};
type PendingWorkspacePatch = {
  sourceTitle: string;
  edits: PendingEdit[];
  skipped: string[];
};
type MissionAuditEvent = {
  ts: string;
  kind: string;
  message: string;
  data?: Record<string, unknown>;
};
type MissionFolderState = {
  handle?: BrowserDirectoryHandleLike;
  name: string;
  missionId: string;
  title: string;
  goal: string;
  rootPath?: string;
  source: 'tray' | 'browser';
  teamPresetId?: string;
};
type MissionTaskPreview = {
  id: string;
  title: string;
  prompt: string;
  resourceHint: string;
  role: string;
  assignedResourceLabel: string;
  status: 'ready' | 'waiting' | 'running' | 'needs-approval' | 'done';
  expectedOutputs: string[];
};
type TeamPresetId = 'repo-repair' | 'pod-local' | 'creative-production' | 'research-watch';
type TeamRoleAssignment = {
  role: 'planner' | 'implementer' | 'reviewer' | 'team-desk' | 'app-tool' | 'status';
  label: string;
  purpose: string;
  resourceId: string;
  resourceLabel: string;
  status: string;
  trustTier: string;
  sandbox: string;
};
type TeamPresetPreview = {
  id: TeamPresetId;
  label: string;
  summary: string;
  bestFor: string;
  readiness: 'ready' | 'partial' | 'needs-setup';
  assignments: TeamRoleAssignment[];
};

function clampWidth(value: number, min: number, max: number): number {
  return Math.round(Math.max(min, Math.min(max, value)));
}

function workbenchLayoutLimits(width: number): { primaryMin: number; primaryMax: number; secondaryMin: number; secondaryMax: number } {
  const safeWidth = Math.max(width || 1400, 760);
  const usable = Math.max(0, safeWidth - ACTIVITY_BAR_WIDTH);
  const compact = usable < 1180;
  const primaryMin = compact ? 200 : 240;
  const secondaryMin = compact ? 300 : 340;
  const editorTargetMin = compact ? 420 : 560;
  const primaryMax = Math.max(primaryMin, Math.min(compact ? 340 : 420, Math.floor(usable * 0.28)));
  const assumedPrimary = Math.min(300, primaryMax);
  const secondaryByRatio = Math.floor(usable * (compact ? 0.34 : 0.36));
  const secondaryByEditor = usable - assumedPrimary - editorTargetMin;
  const secondaryMax = Math.max(secondaryMin, Math.min(compact ? 500 : 640, secondaryByRatio, secondaryByEditor));
  return { primaryMin, primaryMax, secondaryMin, secondaryMax };
}

type RichSegment = { type: 'markdown'; body: string; key: string } | { type: 'code'; body: string; language: string; key: string };

function splitRichBody(body: string): RichSegment[] {
  const segments: RichSegment[] = [];
  const fence = /```([^\n`]*)\n?([\s\S]*?)```/g;
  let cursor = 0;
  let block = 0;
  let match: RegExpExecArray | null;
  while ((match = fence.exec(body)) !== null) {
    if (match.index > cursor) {
      const markdown = body.slice(cursor, match.index);
      if (markdown.trim()) segments.push({ type: 'markdown', body: markdown, key: `md-${block}` });
    }
    segments.push({
      type: 'code',
      language: match[1]?.trim() || 'text',
      body: match[2] ?? '',
      key: `code-${block}`,
    });
    cursor = match.index + match[0].length;
    block += 1;
  }
  const tail = body.slice(cursor);
  if (tail.trim() || segments.length === 0) segments.push({ type: 'markdown', body: tail, key: `md-${block}` });
  return segments;
}

async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    await navigator.clipboard?.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  }
}

async function pickWritableDirectory(): Promise<BrowserDirectoryHandleLike | null> {
  const host = window as Window & { showDirectoryPicker?: (options?: unknown) => Promise<BrowserDirectoryHandleLike> };
  if (typeof host.showDirectoryPicker !== 'function') return null;
  return host.showDirectoryPicker({ mode: 'readwrite' });
}

async function writeTextToDirectory(dir: BrowserDirectoryHandleLike, fileName: string, content: string): Promise<void> {
  const getFileHandle = dir.getFileHandle;
  if (!getFileHandle) throw new Error('Selected mission folder is read-only in this browser context');
  const file = await getFileHandle.call(dir, fileName, { create: true });
  if (!file.createWritable) throw new Error(`Cannot write ${fileName}; File System Access write handle unavailable`);
  const writable = await file.createWritable();
  await writable.write(content);
  await writable.close();
}

async function ensureDirectory(dir: BrowserDirectoryHandleLike, name: string): Promise<BrowserDirectoryHandleLike> {
  const getDirectoryHandle = dir.getDirectoryHandle;
  if (!getDirectoryHandle) throw new Error('Selected mission folder cannot create subfolders in this browser context');
  return getDirectoryHandle.call(dir, name, { create: true });
}

async function writeMissionFileToBrowserDirectory(dir: BrowserDirectoryHandleLike, relPath: string, content: string): Promise<void> {
  const parts = relPath.split('/').filter(Boolean);
  if (parts.length === 0) return;
  let current = dir;
  for (const part of parts.slice(0, -1)) {
    current = await ensureDirectory(current, part);
  }
  await writeTextToDirectory(current, parts[parts.length - 1], content);
}

function resourceSummary(resources: readonly TytusResource[]): string {
  const counts = resources.reduce<Record<string, number>>((acc, resource) => {
    acc[resource.kind] = (acc[resource.kind] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).map(([kind, count]) => `${count} ${kind}`).join(' · ') || 'no resources';
}

function resourceMetadataString(resource: TytusResource, key: string): string {
  const value = resource.metadata?.[key];
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function resourcePodId(resource: TytusResource): string {
  const metadataPodId = resourceMetadataString(resource, 'podId');
  if (metadataPodId) return metadataPodId;
  const match = resource.id.match(/(?:pod-agent|ail-route)\.([^.]+)/);
  return match?.[1] ?? '';
}

function resourceAgentFamily(resource: TytusResource): 'openclaw' | 'hermes' | 'ail' | null {
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

function resourceDisplayLabel(resource: TytusResource): string {
  const family = resourceAgentFamily(resource);
  const podId = resourcePodId(resource);
  if (resource.kind === 'pod-agent' && family === 'openclaw') return `OpenClaw agent${podId ? ` pod ${podId}` : ''}`;
  if (resource.kind === 'pod-agent' && family === 'hermes') return `Hermes agent${podId ? ` pod ${podId}` : ''}`;
  if (resource.kind === 'ail-route') return `AIL gateway${podId ? ` ${podId}` : ''}`;
  return resource.label
    .replace(/\bNemoClaw\b/g, 'OpenClaw')
    .replace(/\bnemoclaw\b/gi, 'OpenClaw');
}

function resourceDisplayDetail(resource: TytusResource): string {
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

function summarizeAgentTeam(graph: TytusResourceGraph | null): Array<{ label: string; value: number; detail: string; status: string }> {
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

function summarizeResourceFabric(graph: TytusResourceGraph | null): Array<{ label: string; detail: string; status: string }> {
  const resources = graph?.resources ?? [];
  const hasReady = (kind: TytusResource['kind']) => resources.some((resource) => resource.kind === kind && (resource.status === 'ready' || resource.status === 'available'));
  return [
    { label: 'Local computer', detail: hasReady('local-cli') ? 'Local CLIs, files, terminal, and installed apps are reachable through Tytus tray.' : 'Waiting for local tools from Tytus tray.', status: hasReady('local-cli') ? 'ready' : 'needs setup' },
    { label: 'Shared folders', detail: hasReady('shared-folder') ? 'Files, transcripts, patches, and artifacts can move between local agents and pods.' : 'Bind a shared folder to create the exchange layer.', status: hasReady('shared-folder') ? 'ready' : 'needs setup' },
    { label: 'Tytus pods', detail: hasReady('pod-agent') ? 'OpenClaw/Hermes pods can pick up context and return remote work products.' : 'No pod agent is ready yet.', status: hasReady('pod-agent') ? 'ready' : 'needs setup' },
    { label: 'Local apps', detail: hasReady('app-skill') ? 'App skills expose JULI3TA, Blender, Remotion, and other tools as mission capabilities.' : 'App skills appear when installed/configured.', status: hasReady('app-skill') ? 'ready' : 'optional' },
  ];
}

const TEAM_PRESET_DEFINITIONS: Array<Pick<TeamPresetPreview, 'id' | 'label' | 'summary' | 'bestFor'>> = [
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

function isResourceUsable(resource: TytusResource): boolean {
  return resource.status === 'ready' || resource.status === 'available' || resource.status === 'degraded';
}

function resourceSearchText(resource: TytusResource): string {
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

function findResource(resources: TytusResource[], predicate: (resource: TytusResource) => boolean): TytusResource | null {
  return resources.find((resource) => isResourceUsable(resource) && predicate(resource)) ?? null;
}

function findResourceByTerms(resources: TytusResource[], kind: TytusResource['kind'], terms: string[]): TytusResource | null {
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

function assignmentFromResource(
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

function buildTeamPresetPreview(graph: TytusResourceGraph | null, presetId: TeamPresetId = 'repo-repair'): TeamPresetPreview {
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

function pickTeamPresetId(goal: string, graph: TytusResourceGraph | null, requested?: string): TeamPresetId {
  if (requested && TEAM_PRESET_DEFINITIONS.some((item) => item.id === requested)) return requested as TeamPresetId;
  const text = goal.toLowerCase();
  if (/(music|song|audio|video|render|blender|remotion|juli3ta|creative)/.test(text)) return 'creative-production';
  if (/(research|watch|monitor|news|summar|scan)/.test(text)) return 'research-watch';
  if ((graph?.resources ?? []).some((resource) => resource.kind === 'pod-agent' && isResourceUsable(resource))) return 'pod-local';
  return 'repo-repair';
}

function buildTeamPresetPreviews(graph: TytusResourceGraph | null): TeamPresetPreview[] {
  return TEAM_PRESET_DEFINITIONS.map((definition) => buildTeamPresetPreview(graph, definition.id));
}

function formatAssignment(assignment: TeamRoleAssignment): string {
  return `${assignment.label}: ${assignment.resourceLabel} (${assignment.status})`;
}

function missionSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'mission';
}

function isoNow(): string {
  return new Date().toISOString();
}

function missionRunSortValue(run: TytusMissionRun): string {
  return run.finishedAt ?? run.startedAt ?? '';
}

function saveCurrentMission(mission: MissionFolderState | TytusMission): void {
  const state: MissionFolderState = 'source' in mission
    ? mission
    : {
      missionId: mission.missionId,
      title: mission.title,
      goal: mission.goal,
      rootPath: mission.rootPath,
      name: mission.rootPath.split('/').pop() || mission.missionId,
      source: 'tray',
      teamPresetId: undefined,
    };
  try {
    localStorage.setItem(CURRENT_MISSION_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(CURRENT_MISSION_EVENT, { detail: state }));
  } catch {
    // localStorage can be unavailable in strict privacy contexts. Mission still exists on disk.
  }
}

function readCurrentMission(): MissionFolderState | null {
  try {
    const raw = localStorage.getItem(CURRENT_MISSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MissionFolderState>;
    if (!parsed.missionId || !parsed.title) return null;
    return {
      missionId: parsed.missionId,
      title: parsed.title,
      goal: parsed.goal ?? '',
      rootPath: parsed.rootPath,
      name: parsed.name ?? parsed.rootPath?.split('/').pop() ?? parsed.missionId,
      source: parsed.source === 'browser' ? 'browser' : 'tray',
      teamPresetId: TEAM_PRESET_DEFINITIONS.some((item) => item.id === parsed.teamPresetId) ? parsed.teamPresetId as TeamPresetId : undefined,
    };
  } catch {
    return null;
  }
}

function missionStateFromSummary(summary: TytusMissionSummary): MissionFolderState {
  return {
    missionId: summary.missionId,
    title: summary.title,
    goal: summary.goal,
    rootPath: summary.rootPath,
    name: summary.rootPath.split('/').pop() || summary.missionId,
    source: 'tray',
    teamPresetId: undefined,
  };
}

function buildMissionTasks(goal: string, graph: TytusResourceGraph | null, presetId?: TeamPresetId): MissionTaskPreview[] {
  const trimmedGoal = goal.trim() || 'Coordinate a Tytus mission.';
  const selectedPreset = buildTeamPresetPreview(graph, pickTeamPresetId(trimmedGoal, graph, presetId));
  const assignmentFor = (role: TeamRoleAssignment['role']) => selectedPreset.assignments.find((assignment) => assignment.role === role);
  const planner = assignmentFor('planner');
  const implementer = assignmentFor('implementer');
  const reviewer = assignmentFor('reviewer');
  const desk = assignmentFor('team-desk');
  const appTool = assignmentFor('app-tool');
  return [
    {
      id: 'task-scope',
      title: 'Scope mission and context',
      prompt: `Planner role: turn this goal into an executable mission plan, list required files/assets, and define approval gates. Goal: ${trimmedGoal}`,
      resourceHint: planner ? formatAssignment(planner) : 'Planner agent',
      role: 'planner',
      assignedResourceLabel: planner?.resourceLabel ?? 'Planner agent',
      status: 'ready',
      expectedOutputs: ['PLAN.md', 'risk list', 'resource choices'],
    },
    {
      id: 'task-execute',
      title: 'Execute or produce artifact',
      prompt: `Implementer role: use the mission folder, selected files, and shared/team desk context to execute the smallest safe step. Return transcript, artifact, or patch proposal only. Goal: ${trimmedGoal}`,
      resourceHint: implementer ? formatAssignment(implementer) : 'Local/app implementer',
      role: 'implementer',
      assignedResourceLabel: implementer?.resourceLabel ?? 'Local/app implementer',
      status: 'waiting',
      expectedOutputs: ['transcript', 'artifact', 'patch proposal'],
    },
    appTool ? {
      id: 'task-app-tool',
      title: 'Drive app skill',
      prompt: `App-tool role: use the relevant app skill only through configured Tytus/app instructions. Save source assets and outputs into the mission/team desk. Goal: ${trimmedGoal}`,
      resourceHint: formatAssignment(appTool),
      role: 'app-tool',
      assignedResourceLabel: appTool.resourceLabel,
      status: appTool.status === 'ready' || appTool.status === 'available' ? 'waiting' : 'needs-approval',
      expectedOutputs: ['app output', 'asset path', 'usage notes'],
    } : null,
    {
      id: 'task-handoff',
      title: 'Review and hand off',
      prompt: `Reviewer role: independently review the outputs, list approval decisions, and prepare a handoff that another agent can continue from. Goal: ${trimmedGoal}`,
      resourceHint: reviewer ? `${formatAssignment(reviewer)} · ${desk?.resourceLabel ?? 'mission folder'}` : 'Reviewer + mission folder',
      role: 'reviewer',
      assignedResourceLabel: reviewer?.resourceLabel ?? 'Reviewer agent',
      status: 'waiting',
      expectedOutputs: ['REVIEW.md', 'HANDOFF.md', 'approval list'],
    },
  ].filter(Boolean) as MissionTaskPreview[];
}

function buildTasksMarkdown(tasks: MissionTaskPreview[]): string {
  return [
    '# Mission tasks',
    '',
    ...tasks.map((task, index) => [
      `## ${index + 1}. ${task.title}`,
      '',
      `- ID: \`${task.id}\``,
      `- Status: ${task.status}`,
      `- Role: ${task.role}`,
      `- Assigned resource: ${task.assignedResourceLabel}`,
      `- Resource hint: ${task.resourceHint}`,
      `- Expected outputs: ${task.expectedOutputs.join(', ')}`,
      '',
      task.prompt,
      '',
    ].join('\n')),
  ].join('\n');
}

function buildHandoffMarkdown(mission: MissionFolderState): string {
  return [
    `# Handoff — ${mission.title}`,
    '',
    `- Mission ID: \`${mission.missionId}\``,
    `- Root: \`${mission.rootPath ?? mission.name}\``,
    `- Updated: ${new Date().toISOString()}`,
    '',
    '## What changed',
    '',
    '- TBD',
    '',
    '## Decisions',
    '',
    '- TBD',
    '',
    '## Open approvals',
    '',
    '- No direct writes without Atomek preview/approval.',
    '',
    '## Next owner',
    '',
    '- Pick the next OpenClaw, Hermes, local-agent, shared-folder, or app-skill resource from Atomek.',
    '',
  ].join('\n');
}

function buildMissionMarkdown(mission: MissionFolderState, graph: TytusResourceGraph | null, activeFile: WorkbenchFile | null, openEditors: WorkbenchFile[], prompt: string, presetId?: TeamPresetId): string {
  const preset = buildTeamPresetPreview(graph, pickTeamPresetId(prompt || mission.goal, graph, presetId ?? mission.teamPresetId));
  return [
    `# ${mission.title}`,
    '',
    `- Mission ID: \`${mission.missionId}\``,
    `- Updated: ${new Date().toISOString()}`,
    `- Folder: ${mission.rootPath ?? mission.name}`,
    '',
    '## Goal',
    '',
    mission.goal || '(no goal set)',
    '',
    '## Team preset',
    '',
    `- Preset: ${preset.label} (${preset.readiness})`,
    `- Best for: ${preset.bestFor}`,
    `- Summary: ${preset.summary}`,
    '',
    ...preset.assignments.map((assignment) => `- ${assignment.label}: ${assignment.resourceLabel} — ${assignment.purpose} [${assignment.status}, ${assignment.trustTier}, ${assignment.sandbox}]`),
    '',
    '## Current Atomek context',
    '',
    activeFile
      ? `- Active file: \`${activeFile.path}\` (${activeFile.language}, ${activeFile.content.length} chars${activeFile.dirty ? ', dirty' : ''})`
      : '- Active file: none',
    `- Open editors: ${openEditors.length}`,
    '',
    '## Current task',
    '',
    prompt || '(no task prompt set)',
    '',
    '## Resource graph',
    '',
    graph ? `- ${resourceSummary(graph.resources)}` : '- not loaded',
    ...(graph?.warnings?.length ? graph.warnings.map((warning) => `- Warning: ${warning.code} — ${warning.message}`) : []),
    '',
    '## Rules',
    '',
    '- Mission folder is the shared source of truth.',
    '- Shared folder / Team Desk is the exchange layer between local computer and Tytus pods when available.',
    '- Agents must not write project files directly.',
    '- Proposed edits must be returned as unified diffs or fenced replacement blocks.',
    '- Atomek previews and approves edits before applying.',
    '- Secrets are never requested or copied into mission context.',
  ].join('\n');
}

function buildResourcesMarkdown(graph: TytusResourceGraph | null): string {
  if (!graph) return '# Resources\n\nResource graph not loaded yet.\n';
  return [
    '# Resources',
    '',
    `Generated: ${graph.generatedAt}`,
    '',
    ...graph.resources.map((resource) => [
      `## ${resourceDisplayLabel(resource)}`,
      '',
      `- ID: \`${resource.id}\``,
      `- Kind: ${resource.kind}`,
      `- Status: ${resource.status}${resource.reason ? ` — ${resource.reason}` : ''}`,
      `- Trust: ${resource.trustTier}`,
      `- Sandbox: ${resource.sandbox}`,
      `- Capabilities: ${resource.capabilities.join(', ') || 'none'}`,
      resource.allowedRoots.length ? `- Allowed roots: ${resource.allowedRoots.map((root) => `\`${root}\``).join(', ')}` : '- Allowed roots: none',
      '',
    ].join('\n')),
    graph.warnings.length ? '## Warnings\n' : '',
    ...graph.warnings.map((warning) => `- ${warning.code}: ${warning.message}${warning.resourceId ? ` (${warning.resourceId})` : ''}`),
    '',
  ].join('\n');
}

function buildMissionJson(mission: MissionFolderState, graph: TytusResourceGraph | null, prompt: string, presetId?: TeamPresetId): string {
  const selectedPresetId = pickTeamPresetId(prompt || mission.goal, graph, presetId ?? mission.teamPresetId);
  const preset = buildTeamPresetPreview(graph, selectedPresetId);
  const tasks = buildMissionTasks(prompt || mission.goal, graph, selectedPresetId);
  return JSON.stringify({
    schemaVersion: 1,
    missionId: mission.missionId,
    title: mission.title,
    goal: mission.goal,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    rootPath: mission.rootPath ?? mission.name,
    teamPreset: {
      id: preset.id,
      label: preset.label,
      readiness: preset.readiness,
      summary: preset.summary,
      bestFor: preset.bestFor,
    },
    team: preset.assignments.map((assignment) => ({
      role: assignment.role,
      label: assignment.label,
      purpose: assignment.purpose,
      resourceId: assignment.resourceId,
      resourceLabel: assignment.resourceLabel,
      status: assignment.status,
      trustTier: assignment.trustTier,
      sandbox: assignment.sandbox,
    })),
    storage: {
      missionFolder: mission.rootPath ?? mission.name,
      teamDesk: preset.assignments.find((assignment) => assignment.role === 'team-desk')?.resourceLabel ?? 'mission folder',
      paths: {
        runs: 'runs/',
        outputs: 'outputs/',
        proposals: 'proposals/',
        approvals: 'approvals/',
        inbox: 'INBOX.md',
        outbox: 'OUTBOX.md',
      },
    },
    resources: (graph?.resources ?? []).filter((resource) => resource.status === 'ready').map((resource) => ({
      resourceId: resource.id,
      pinnedLabel: resourceDisplayLabel(resource),
      pinnedKind: resource.kind,
      pinnedCapabilities: resource.capabilities,
      visibility: {
        allowedRoots: resource.allowedRoots,
        sandbox: resource.sandbox,
        trustTier: resource.trustTier,
      },
    })),
    permissions: {
      fileWrite: 'preview-only',
      shellExec: 'allowlist-with-approval',
      netEgress: 'resource-default',
      secretRead: 'never',
    },
    secretsPolicy: {
      deniedGlobs: ['**/.env', '**/.env.*', '**/.ssh/**', '**/*_key*', '**/*secret*', '**/*token*', '**/id_rsa', '**/id_ed25519'],
      deniedPatterns: ['OPENAI_API_KEY\\\\s*=', 'sk-[A-Za-z0-9_-]{20,}', 'ANTHROPIC_API_KEY\\\\s*='],
    },
    budget: { maxRuntimeMinutes: 30, maxArtifactMb: 25 },
    tasks: tasks.map((task, index) => ({
      id: task.id,
      title: task.title,
      prompt: task.prompt,
      role: task.role,
      assignedResourceLabel: task.assignedResourceLabel,
      status: index === 0 ? 'ready' : 'waiting',
      selectedResourceHint: task.resourceHint,
      dependsOn: index === 0 ? [] : [tasks[index - 1].id],
      expectedOutputs: task.expectedOutputs,
      approvalGateIds: ['file-write-preview'],
    })),
  }, null, 2);
}

export function WorkbenchShell({ host }: Props) {
  const workbenchRef = useRef<HTMLDivElement | null>(null);
  const [workbenchWidth, setWorkbenchWidth] = useState(0);
  const initialLayout = useMemo(() => readLayoutPrefs(), []);
  const initialSession = useMemo(() => readSessionState(), []);
  const initialRecent = useMemo(() => mergeRecentEntries(readRecent(), initialSession.recent), [initialSession.recent]);
  const [activity, setActivity] = useState<ActivityView>(initialSession.activity ?? 'computer');
  const [primaryVisible, setPrimaryVisible] = useState(initialLayout.primaryVisible);
  const [primaryWidth, setPrimaryWidth] = useState(initialLayout.primaryWidth);
  const [secondaryTab, setSecondaryTab] = useState<SecondaryTab>(initialSession.secondaryTab ?? 'chat');
  const [secondaryVisible, setSecondaryVisible] = useState(initialLayout.secondaryVisible);
  const [secondaryWidth, setSecondaryWidth] = useState(initialLayout.secondaryWidth);
  const [bottomPanelVisible, setBottomPanelVisible] = useState(Boolean(initialSession.bottomPanelVisible));
  const [bottomPanelTab, setBottomPanelTab] = useState<BottomPanelTab>(initialSession.bottomPanelTab ?? 'problems');
  const [markdownPreviewVisible, setMarkdownPreviewVisible] = useState(initialLayout.markdownPreviewVisible);
  const [welcomeClosed, setWelcomeClosed] = useState(Boolean(initialSession.welcomeClosed));
  const [folder, setFolder] = useState<WorkbenchFolder | null>(initialSession.folder ? { name: initialSession.folder.name, files: [] } : null);
  const [currentFolderHandleKey, setCurrentFolderHandleKey] = useState<string | null>(initialSession.folder?.handleKey ?? null);
  const [files, setFiles] = useState<WorkbenchFile[]>(() => hydrateSessionFiles(initialSession.files));
  const [openEditorIds, setOpenEditorIds] = useState<string[]>(() => (initialSession.openEditorIds ?? []).filter((id) => (initialSession.files ?? []).some((file) => file.id === id)));
  const [activeFileId, setActiveFileId] = useState<string | null>(() => initialSession.activeFileId && (initialSession.files ?? []).some((file) => file.id === initialSession.activeFileId) ? initialSession.activeFileId : null);
  const [query, setQuery] = useState(initialSession.query ?? '');
  const [cursor, setCursor] = useState<CursorPosition>({ lineNumber: 1, column: 1 });
  const [activeSelection, setActiveSelection] = useState<WorkbenchRange | null>(null);
  const [documentVersions, setDocumentVersions] = useState<Record<string, number>>({});
  const [chatContextScope, setChatContextScope] = useState<ChatContextScope>(DEFAULT_CHAT_CONTEXT_SCOPE);
  const [removedContextAttachmentIds, setRemovedContextAttachmentIds] = useState<string[]>([]);
  const [projectContextHits, setProjectContextHits] = useState<ProjectIndexContextHit[]>([]);
  const [pendingPatchPrompt, setPendingPatchPrompt] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState(initialSession.chatInput ?? '');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [outputs, setOutputs] = useState<OutputArtifact[]>([]);
  const [pendingEdit, setPendingEdit] = useState<PendingEdit | null>(null);
  const [pendingWorkspacePatch, setPendingWorkspacePatch] = useState<PendingWorkspacePatch | null>(null);
  const [settingsTabOpen, setSettingsTabOpen] = useState(false);
  const [chatSettings, setChatSettings] = useState<ChatAiSettings>(() => readChatAiSettings());
  const [chatTargets, setChatTargets] = useState<ChatTarget[]>([ATOMEK_CHAT_TARGET]);
  const [selectedChatTargetId, setSelectedChatTargetId] = useState(() => readSelectedChatTargetId(CHAT_WORKSPACE_KEY));
  const [aiDirtyNotice, setAiDirtyNotice] = useState<string | null>(null);
  const [manualCheckSession, setManualCheckSession] = useState<ManualCheckSession | null>(null);
  const [manualCheckCommandInput, setManualCheckCommandInput] = useState('');
  const [manualCheckOutputInput, setManualCheckOutputInput] = useState('');
  const [manualCheckSelectedCommand, setManualCheckSelectedCommand] = useState('');
  const [manualCheckStatus, setManualCheckStatus] = useState<ManualCheckStatus>('failed');
  const [revealLine, setRevealLine] = useState<number | null>(null);
  const [status, setStatus] = useState('Ready');
  const [recent, setRecent] = useState<RecentEntry[]>(() => initialRecent);

  const openEditors = openEditorIds.map((id) => files.find((file) => file.id === id)).filter(Boolean) as WorkbenchFile[];
  const activeFile = activeFileId ? files.find((file) => file.id === activeFileId) ?? null : null;
  const documentRegistry = useMemo(() => buildDocumentRegistry({ files, openEditorIds, activeFileId, versions: documentVersions, activeSelection }), [activeFileId, activeSelection, documentVersions, files, openEditorIds]);
  const chatContextState = useMemo<ChatContextState>(() => ({
    scope: chatContextScope,
    removedAttachmentIds: removedContextAttachmentIds,
    selectedFileIds: [],
  }), [chatContextScope, removedContextAttachmentIds]);
  const builtChatContext = useMemo(() => buildAiContext(documentRegistry, files, chatContextState), [chatContextState, documentRegistry, files]);
  const projectIndex = useProjectIndex(files, { autoRefresh: true, includeDirty: true });
  const indexContextAttachments = useMemo<ChatContextAttachment[]>(() => projectContextHits.map((hit) => ({
    id: hit.id,
    kind: 'index-hit',
    label: hit.label,
    path: hit.path,
    fileId: hit.fileId,
    range: hit.range,
    dirty: hit.dirty,
    includeBody: true,
    removable: true,
    implicit: false,
    score: hit.score,
    keywordScore: hit.keywordScore,
    vectorScore: hit.vectorScore,
    snippet: hit.snippet,
  })), [projectContextHits]);
  const contextAttachments = useMemo(() => [...builtChatContext.attachments, ...indexContextAttachments], [builtChatContext.attachments, indexContextAttachments]);
  const selectedChatTarget = useMemo(() => chatTargets.find((target) => target.id === selectedChatTargetId) ?? ATOMEK_CHAT_TARGET, [chatTargets, selectedChatTargetId]);
  const ai = useConversation({ host, requestContext: builtChatContext.parts, chatSettings, selectedTarget: selectedChatTarget, setStatus });
  const combinedOutputs = useMemo(
    () => [...ai.artifacts, ...outputs].sort((a, b) => b.createdAt - a.createdAt),
    [ai.artifacts, outputs],
  );
  const settingsActive = settingsTabOpen && !activeFile;
  const showWelcome = !activeFile && !settingsActive && !welcomeClosed;
  const dirtyFiles = useMemo(() => files.filter((file) => file.dirty), [files]);
  const visibleFiles = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return files;
    return files.filter((file) => file.path.toLowerCase().includes(needle));
  }, [files, query]);

  useEffect(() => {
    setDocumentVersions((current) => {
      const next: Record<string, number> = {};
      for (const file of files) next[file.id] = current[file.id] ?? 1;
      return next;
    });
  }, [files]);

  useEffect(() => {
    setRemovedContextAttachmentIds([]);
    setProjectContextHits([]);
  }, [activeFileId, chatContextScope, openEditorIds]);

  useEffect(() => {
    setProjectContextHits([]);
  }, [files]);


  useEffect(() => {
    let active = true;
    const refreshTargets = async () => {
      const targets = await buildChatTargets(host);
      if (!active) return;
      setChatTargets(targets);
      setSelectedChatTargetId((current) => {
        const next = targets.some((target) => target.id === current) ? current : ATOMEK_CHAT_TARGET.id;
        if (next !== current) writeSelectedChatTargetId(CHAT_WORKSPACE_KEY, next);
        return next;
      });
    };
    void refreshTargets();
    const dispose = host.daemon.onStateChange(() => {
      void refreshTargets();
    });
    return () => {
      active = false;
      dispose?.();
    };
  }, [host]);

  const selectChatTarget = useCallback((targetId: string) => {
    const next = chatTargets.find((target) => target.id === targetId) ?? ATOMEK_CHAT_TARGET;
    setSelectedChatTargetId(next.id);
    writeSelectedChatTargetId(CHAT_WORKSPACE_KEY, next.id);
    setStatus(`Chat target: ${next.label}`);
  }, [chatTargets, setStatus]);

  const removeContextAttachment = useCallback((attachment: ChatContextAttachment) => {
    if (attachment.kind === 'index-hit') {
      setProjectContextHits((hits) => hits.filter((hit) => hit.id !== attachment.id));
      setStatus(`Removed project context: ${attachment.label}`);
      return;
    }
    setRemovedContextAttachmentIds((ids) => ids.includes(attachment.id) ? ids : [...ids, attachment.id]);
    setStatus(`Removed chat context: ${attachment.label}`);
  }, []);

  const openSettingsTab = useCallback(() => {
    setSettingsTabOpen(true);
    setActiveFileId(null);
    setWelcomeClosed(true);
    setStatus('Atomek settings opened');
  }, []);

  const closeSettingsTab = useCallback(() => {
    setSettingsTabOpen(false);
    setActiveFileId((current) => current ?? openEditorIds.at(-1) ?? null);
    if (openEditorIds.length === 0) setWelcomeClosed(false);
    setStatus('Atomek settings closed');
  }, [openEditorIds]);


  const bumpDocumentVersion = useCallback((fileId: string) => {
    setDocumentVersions((current) => ({ ...current, [fileId]: (current[fileId] ?? 1) + 1 }));
  }, []);

  const beginSecondaryResize = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const limits = workbenchLayoutLimits(workbenchWidth);
    const startX = event.clientX;
    const startWidth = secondaryWidth;
    const onMove = (moveEvent: PointerEvent) => {
      const next = startWidth + (startX - moveEvent.clientX);
      setSecondaryWidth(clampWidth(next, limits.secondaryMin, limits.secondaryMax));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [secondaryWidth, workbenchWidth]);

  const beginPrimaryResize = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const limits = workbenchLayoutLimits(workbenchWidth);
    const startX = event.clientX;
    const startWidth = primaryWidth;
    const onMove = (moveEvent: PointerEvent) => {
      const next = startWidth + (moveEvent.clientX - startX);
      setPrimaryWidth(clampWidth(next, limits.primaryMin, limits.primaryMax));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [primaryWidth, workbenchWidth]);

  const remember = useCallback((entry: RecentEntry) => {
    setRecent((current) => {
      const next = [entry, ...current.filter((item) => item.path !== entry.path)].slice(0, 10);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const openWorkbenchFile = useCallback((file: WorkbenchFile, lineNumber?: number) => {
    setOpenEditorIds((ids) => ids.includes(file.id) ? ids : [...ids, file.id]);
    setActiveFileId(file.id);
    setWelcomeClosed(false);
    setRevealLine(lineNumber ?? null);
    setCursor({ lineNumber: lineNumber ?? 1, column: 1 });
  }, []);

  const openEmbeddedDoc = useCallback((doc: AtomekEmbeddedDoc) => {
    const file: WorkbenchFile = {
      id: `atomek-doc:${doc.id}`,
      name: doc.fileName,
      path: `Atomek Docs/${doc.fileName}`,
      language: 'markdown',
      content: doc.body,
      dirty: false,
      source: 'sample',
    };
    setFiles((current) => mergeFiles(current, [file]));
    openWorkbenchFile(file);
    setSecondaryTab('chat');
    setSecondaryVisible(true);
    setMarkdownPreviewVisible(true);
    setStatus(`Opened Atomek guide: ${doc.title}`);
  }, [openWorkbenchFile]);

  const revealContextAttachment = useCallback((attachment: ChatContextAttachment) => {
    if (!attachment.fileId) return;
    const target = files.find((file) => file.id === attachment.fileId);
    if (!target) return;
    openWorkbenchFile(target, attachment.range?.startLineNumber ?? 1);
    setStatus(`Revealed context: ${attachment.label}`);
  }, [files, openWorkbenchFile]);

  const handleOpenFile = useCallback(async () => {
    if (!confirmDiscardDirty(dirtyFiles, 'open new files')) return;
    try {
      const picked = await openFiles();
      if (picked.length === 0) return;
      setFiles((current) => mergeFiles(current, picked));
      await Promise.all(picked.map(async (file) => {
        const handleKey = file.handle ? `file:${file.path}` : undefined;
        if (file.handle && handleKey) await savePersistedHandle(handleKey, file.handle);
        remember({ name: file.name, path: file.path, kind: 'file', handleKey, at: Date.now() });
      }));
      openWorkbenchFile(picked[0]);
      setStatus(`Opened ${picked.length} local file${picked.length === 1 ? '' : 's'}`);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') setStatus(`Open file failed: ${(err as Error).message}`);
    }
  }, [dirtyFiles, openWorkbenchFile, remember]);

  const handleOpenFolder = useCallback(async () => {
    if (!confirmDiscardDirty(dirtyFiles, 'open another folder')) return;
    try {
      const picked = await openFolder();
      const handleKey = picked.handle ? `folder:${picked.name}:${Date.now()}` : null;
      if (picked.handle && handleKey) await savePersistedHandle(handleKey, picked.handle);
      setCurrentFolderHandleKey(handleKey);
      setFolder(picked);
      setFiles(picked.files);
      setOpenEditorIds([]);
      setActiveFileId(null);
      setWelcomeClosed(false);
      remember({ name: picked.name, path: picked.name, kind: 'folder', handleKey: handleKey ?? undefined, at: Date.now() });
      setStatus(`${picked.handle ? 'Opened local folder' : 'Opened browser fallback folder'} ${picked.name} (${picked.files.length} text files indexed)`);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') setStatus(`Open folder failed: ${(err as Error).message}`);
    }
  }, [dirtyFiles, remember]);

  const updateActiveFile = useCallback((content: string) => {
    if (!activeFileId) return;
    let changed = false;
    setFiles((current) => current.map((file) => {
      if (file.id !== activeFileId) return file;
      if (file.content === content) return file;
      changed = true;
      return { ...file, content, dirty: true };
    }));
    if (changed) bumpDocumentVersion(activeFileId);
  }, [activeFileId, bumpDocumentVersion]);

  const saveActiveFile = useCallback(async () => {
    if (!activeFile) return;
    try {
      const saved = await saveWorkbenchFile(activeFile);
      setFiles((current) => current.map((file) => file.id === saved.id ? saved : file));
      setStatus(`Saved ${saved.name}`);
    } catch (err) {
      setStatus(`Save failed: ${(err as Error).message}`);
    }
  }, [activeFile]);

  const saveFileById = useCallback(async (id: string) => {
    const file = files.find((candidate) => candidate.id === id);
    if (!file) return null;
    const saved = await saveWorkbenchFile(file);
    setFiles((current) => current.map((candidate) => candidate.id === saved.id ? saved : candidate));
    return saved;
  }, [files]);

  const saveAllDirty = useCallback(async () => {
    const targets = files.filter((file) => file.dirty);
    if (targets.length === 0) {
      setStatus('No dirty files to save');
      return;
    }
    try {
      const saved = await Promise.all(targets.map((file) => saveWorkbenchFile(file)));
      const savedMap = new Map(saved.map((file) => [file.id, file]));
      setFiles((current) => current.map((file) => savedMap.get(file.id) ?? file));
      setAiDirtyNotice(null);
      setStatus(`Saved ${saved.length} dirty file${saved.length === 1 ? '' : 's'}`);
    } catch (err) {
      setStatus(`Save all failed: ${(err as Error).message}`);
    }
  }, [files]);

  const closeEditor = useCallback((id: string) => {
    const file = files.find((candidate) => candidate.id === id);
    if (file?.dirty) {
      const discard = window.confirm(`${file.name} has unsaved changes. Close without saving?`);
      if (!discard) {
        setStatus(`Close canceled — ${file.name} has unsaved changes`);
        return;
      }
    }
    setOpenEditorIds((ids) => {
      const next = ids.filter((editorId) => editorId !== id);
      if (activeFileId === id) {
        setActiveFileId(next.at(-1) ?? null);
        setActiveSelection(null);
      }
      return next;
    });
  }, [activeFileId, files]);

  const closeAllEditors = useCallback(() => {
    if (!confirmDiscardDirty(dirtyFiles, 'close all editors')) return;
    setOpenEditorIds([]);
    setActiveFileId(null);
    setRevealLine(null);
    setWelcomeClosed(false);
    setStatus('Closed all editors');
  }, [dirtyFiles]);

  const newUntitled = useCallback(() => {
    const count = files.filter((file) => file.name.startsWith('Untitled')).length + 1;
    const file: WorkbenchFile = {
      id: `untitled-${Date.now()}`,
      name: `Untitled-${count}`,
      path: `Untitled-${count}.md`,
      language: 'markdown',
      content: '# Untitled\n',
      dirty: true,
      source: 'generated',
    };
    setFiles((current) => [...current, file]);
    openWorkbenchFile(file);
  }, [files, openWorkbenchFile]);

  const buildRequestContextForPrompt = useCallback(async (prompt: string): Promise<AiContextPart[]> => {
    const requestContext = [...builtChatContext.parts];
    if (chatContextScope !== 'indexed-project') {
      setProjectContextHits([]);
      return requestContext;
    }
    const result = await retrieveSemanticProjectContext(
      host,
      projectIndex.snapshot,
      prompt,
      chatSettings,
      { limit: 8, maxChars: 12_000, includeDirty: true },
      projectIndex.staleReport,
    );
    const hits = result.hits;
    setProjectContextHits(hits);
    if (hits.length === 0) {
      setStatus(projectIndex.snapshot.chunks.length === 0
        ? 'Project index is empty — open a folder with readable files first'
        : 'Project index found no matching context for this prompt');
      return requestContext;
    }
    if (result.mode !== 'hybrid' && result.reason) setStatus(result.reason);
    else setStatus(`${hits.length} project context hit${hits.length === 1 ? '' : 's'} · ${result.reason ?? 'hybrid retrieval'}`);
    return [
      ...requestContext,
      ...semanticHitsToContextParts(hits),
    ];
  }, [builtChatContext.parts, chatContextScope, chatSettings, host, projectIndex]);

  const runAiSynthesis = useCallback(() => {
    if (!activeFile && openEditors.length === 0) {
      setStatus('Open a file before asking Atomek to synthesize an AI artifact');
      return;
    }
    const target = activeFile?.path ?? `${openEditors.length} open editors`;
    const prompt = [
      `Create a polished Markdown artifact from ${target}.`,
      'Use the open editor context already attached by Atomek.',
      'Prefer an actionable structure: summary, key findings, risks, and next steps.',
      'Do not invent missing facts. Do not use provider-specific tools or model assumptions.',
    ].join(' ');
    setSecondaryVisible(true);
    setSecondaryTab('chat');
    setStatus('Asking Atomek to synthesize an AI artifact…');
    void (async () => {
      const requestContext = await buildRequestContextForPrompt(prompt);
      const message = await ai.askAgent(prompt, { requestContext });
      if (!message || message.status === 'error') return;
      void ai.createArtifact({
        messageId: message.id,
        title: `AI synthesis — ${activeFile?.name ?? 'open workspace'}`,
        kind: 'markdown',
        body: message.body,
      }).then(() => {
        setSecondaryVisible(true);
        setSecondaryTab('outputs');
        setBottomPanelVisible(true);
        setBottomPanelTab('output');
      });
    })();
  }, [activeFile, ai, buildRequestContextForPrompt, openEditors.length]);

  const reopenRecent = useCallback(async (entry: RecentEntry) => {
    if (entry.kind === 'folder') {
      const folderFiles = files.filter((file) => file.path === entry.path || file.path.startsWith(`${entry.path}/`));
      if (folder?.name === entry.name || folderFiles.length > 0) {
        if (folderFiles.length > 0) {
          setFolder((current) => current?.name === entry.name ? current : { name: entry.name, files: folderFiles });
          setFiles((current) => mergeFiles(current, folderFiles));
        }
        setActivity('explorer');
        setPrimaryVisible(true);
        setActiveFileId(null);
        setWelcomeClosed(false);
        remember({ ...entry, at: Date.now() });
        setStatus(`Opened recent folder ${entry.name}`);
        return;
      }
    }
    const existing = files.find((file) => file.path === entry.path || file.name === entry.name);
    if (existing) {
      openWorkbenchFile(existing);
      setStatus(`Opened recent ${existing.name}`);
      return;
    }
    if (!entry.handleKey) {
      setStatus('Recent item has no stored browser permission. Use Open File or Open Folder once, then Atomek can restore it.');
      return;
    }
    try {
      if (entry.kind === 'folder') {
        const handle = await getPersistedHandle<BrowserDirectoryHandleLike>(entry.handleKey);
        if (!handle || !(await ensureHandlePermission(handle, 'readwrite'))) {
          setStatus('Browser permission expired for this folder. Click Open Folder and pick it once to refresh the recent handle.');
          return;
        }
        const picked = await folderFromHandle(handle);
        setCurrentFolderHandleKey(entry.handleKey);
        setFolder(picked);
        setFiles(picked.files);
        setOpenEditorIds([]);
        setActiveFileId(null);
        setWelcomeClosed(false);
        remember({ ...entry, at: Date.now() });
        setStatus(`Reopened ${picked.name} (${picked.files.length} text files indexed)`);
        return;
      }
      const handle = await getPersistedHandle<BrowserFileHandleLike>(entry.handleKey);
      if (!handle || !(await ensureHandlePermission(handle, 'readwrite'))) {
        setStatus('Browser permission expired for this file. Click Open File and pick it once to refresh the recent handle.');
        return;
      }
      const picked = await filesFromHandles([handle]);
      if (!picked[0]) {
        setStatus(`Recent file is not readable text: ${entry.name}`);
        return;
      }
      setFiles((current) => mergeFiles(current, picked));
      openWorkbenchFile(picked[0]);
      remember({ ...entry, at: Date.now() });
      setStatus(`Reopened ${picked[0].name}`);
    } catch (err) {
      setStatus(`Open recent failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [files, folder?.name, openWorkbenchFile, remember]);

  const askAiWithPrompt = useCallback((prompt: string) => {
    setSecondaryVisible(true);
    setSecondaryTab('chat');
    setChatInput('');
    void (async () => {
      const requestContext = await buildRequestContextForPrompt(prompt);
      await ai.askAgent(prompt, { requestContext });
    })();
  }, [ai, buildRequestContextForPrompt]);

  const attachSkillToChat = useCallback(async (skill: AtomekSkillSummary) => {
    if (!host.skills?.get) {
      setStatus('Tytus skill registry is not available in this host build');
      return;
    }
    try {
      const pack = await host.skills.get(skill.id) as AtomekSkillPack;
      const body = pack.body.length > 4_500
        ? `${pack.body.slice(0, 4_500)}\n\n[Skill pack clipped by Atomek. Ask for the full pack if needed.]`
        : pack.body;
      const skillPrompt = [
        `Use Tytus skill "${pack.title}" (${pack.id}).`,
        `Driver: ${pack.driver}. Source: ${pack.source}. Status: ${pack.status}.`,
        'Follow these instructions only as capability context. Do not execute shell commands unless the user explicitly asks and Tytus host allows it.',
        body,
      ].join('\n\n');
      setChatInput((current) => [current.trim(), skillPrompt].filter(Boolean).join('\n\n'));
      setSecondaryVisible(true);
      setSecondaryTab('chat');
      setStatus(`Attached skill ${pack.title} to chat input`);
    } catch (error) {
      setStatus(`Failed to attach skill: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [host.skills]);

  const regenerateMessage = useCallback((message: ChatMessage) => {
    const index = ai.messages.findIndex((candidate) => candidate.id === message.id);
    const previousUser = ai.messages.slice(0, index < 0 ? undefined : index).reverse().find((candidate) => candidate.role === 'user');
    if (!previousUser?.body.trim()) {
      setStatus('No previous user prompt to regenerate from');
      return;
    }
    void (async () => {
      const requestContext = await buildRequestContextForPrompt(previousUser.body);
      await ai.askAgent(previousUser.body, { requestContext });
    })();
  }, [ai, buildRequestContextForPrompt]);

  const saveMessageAsArtifact = useCallback((message: ChatMessage) => {
    void ai.createArtifact({
      messageId: message.id,
      title: message.body.split('\n').find(Boolean)?.replace(/^#+\s*/, '').slice(0, 80) || 'Atomek answer',
      kind: 'markdown',
      body: message.body,
    }).then(() => {
      setSecondaryTab('outputs');
      setBottomPanelVisible(true);
      setBottomPanelTab('output');
    });
  }, [ai]);

  const rememberMessage = useCallback((message: ChatMessage) => {
    void ai.remember({
      messageId: message.id,
      title: message.body.split('\n').find(Boolean)?.replace(/^#+\s*/, '').slice(0, 80) || 'Atomek memory',
      body: message.body,
    });
  }, [ai]);

  const saveActiveFileAsArtifact = useCallback(() => {
    if (!activeFile) {
      setStatus('No active file to save as AI artifact');
      return;
    }
    void ai.createArtifact({
      title: activeFile.path,
      kind: activeFile.language === 'markdown' ? 'markdown' : 'report',
      body: activeFile.content,
    }).then(() => {
      setSecondaryVisible(true);
      setSecondaryTab('outputs');
      setBottomPanelVisible(true);
      setBottomPanelTab('output');
    });
  }, [activeFile, ai]);

  const openOutputAsFile = useCallback((output: OutputArtifact) => {
    const path = nextGeneratedPath(files, slugFileName(output.title || output.kind));
    const file: WorkbenchFile = {
      id: `artifact-file-${output.id}-${Date.now()}`,
      name: path,
      path,
      language: 'markdown',
      content: output.body,
      dirty: true,
      source: 'generated',
    };
    setFiles((current) => [...current, file]);
    openWorkbenchFile(file);
    setStatus(`Opened ${output.title} as editable file`);
  }, [files, openWorkbenchFile]);

  const captureManualCheck = useCallback(() => {
    const command = window.prompt('Check command/name (manual capture only; Atomek will not execute it)');
    if (command === null) return;
    const normalizedCommand = command.trim();
    if (!normalizedCommand) {
      setStatus('Manual check capture canceled — command/name was empty');
      return;
    }
    const result = window.prompt('Paste check output/result');
    if (result === null) return;
    const body = [
      '# Manual check result',
      '',
      `- Captured: ${new Date().toISOString()}`,
      `- Command/name: \`${normalizedCommand.replace(/`/g, '\\`')}\``,
      '- Execution: manual user-provided output; Atomek did not run a shell command.',
      '',
      '```text',
      result,
      '```',
    ].join('\n');
    const output: OutputArtifact = {
      id: `manual-check-${Date.now()}`,
      title: `Manual check — ${normalizedCommand.slice(0, 80)}`,
      kind: 'report',
      body,
      createdAt: Date.now(),
      source: 'local',
    };
    setOutputs((current) => [output, ...current]);
    setBottomPanelVisible(true);
    setBottomPanelTab('output');
    setStatus(`Captured manual check: ${normalizedCommand}`);
  }, []);

  const previewEditFromText = useCallback((sourceTitle: string, body: string): boolean => {
    const candidate = buildWorkspaceEditCandidate({
      body,
      files,
      sourceTitle,
      activeFile,
      versions: documentVersions,
    });
    const workspacePatch: PendingWorkspacePatch = {
      sourceTitle: candidate.sourceTitle,
      edits: candidate.edits.map(toPendingEdit),
      skipped: candidate.skipped,
    };
    if (candidate.edits.length > 1) {
      setPendingWorkspacePatch(workspacePatch);
      setPendingEdit(null);
      setStatus(`Previewing AI workspace patch for ${candidate.edits.length} files`);
      return true;
    }
    if (candidate.edits.length === 1) {
      setPendingEdit(workspacePatch.edits[0]);
      setPendingWorkspacePatch(null);
      setStatus(`Previewing AI patch for ${workspacePatch.edits[0].fileName}`);
      return true;
    }
    setStatus(candidate.skipped.length > 0
      ? `No applicable edit found. ${candidate.skipped.slice(0, 2).join(' · ')}`
      : 'No fenced replacement block or applicable unified diff found. Ask Atomek for an edit again.');
    return false;
  }, [activeFile, documentVersions, files]);

  const saveLocalJobOutput = useCallback((title: string, body: string) => {
    const output: OutputArtifact = {
      id: `local-job-${Date.now()}`,
      title,
      kind: 'report',
      body,
      createdAt: Date.now(),
      source: 'local',
    };
    setOutputs((current) => [output, ...current]);
    setSecondaryVisible(true);
    setSecondaryTab('outputs');
    setBottomPanelVisible(true);
    setBottomPanelTab('output');
    setStatus(`Saved local job output: ${title}`);
    if (body.includes('```diff') || body.includes('--- a/')) previewEditFromText(title, body);
  }, [previewEditFromText]);

  const askAgent = useCallback(() => {
    const prompt = chatInput.trim();
    if (!prompt) return;
    setChatInput('');
    const shouldAutoPreviewEdit = looksLikeEditPrompt(prompt);
    void (async () => {
      const requestContext = await buildRequestContextForPrompt(prompt);
      const message = await ai.askAgent(prompt, { requestContext });
      if (!shouldAutoPreviewEdit || !message || message.status === 'error') return;
      const ok = previewEditFromText(message.body.split('\n').find(Boolean)?.replace(/^#+\s*/, '').slice(0, 80) || 'Atomek edit', message.body);
      if (!ok) setStatus('Edit request answered without a patch. Use Generate patch / Edit to request an applicable diff.');
    })();
  }, [ai, buildRequestContextForPrompt, chatInput, previewEditFromText]);

  const generatePatchPrompt = useCallback(() => {
    if (!pendingPatchPrompt) return;
    setPendingPatchPrompt(null);
    askAiWithPrompt(editPromptWithPatchInstructions(pendingPatchPrompt));
  }, [askAiWithPrompt, pendingPatchPrompt]);

  const startManualCheckSession = useCallback((reason: string) => {
    const session = createManualCheckSession(files, reason);
    setManualCheckSession(session);
    const firstCommand = session.commands[0]?.command ?? '';
    setManualCheckSelectedCommand(firstCommand);
    setManualCheckCommandInput('');
    setManualCheckOutputInput('');
    setManualCheckStatus('failed');
    setBottomPanelVisible(true);
    setBottomPanelTab('terminal');
    setStatus(session.commands.length > 0
      ? `Manual check ready: copy ${session.commands[0].command}`
      : 'Manual check ready: enter a check command to copy');
  }, [files]);

  const copyManualCheckCommand = useCallback((command: string) => {
    if (!command.trim()) return;
    void copyTextToClipboard(command);
    setManualCheckSelectedCommand(command);
    setStatus(`Manual check command copied: ${command}`);
  }, []);

  const addManualCommand = useCallback(() => {
    setManualCheckSession((session) => {
      if (!session) return session;
      const next = addManualCheckCommand(session, manualCheckCommandInput);
      const added = next.commands.at(-1)?.command ?? '';
      if (added) setManualCheckSelectedCommand(added);
      return next;
    });
    setManualCheckCommandInput('');
  }, [manualCheckCommandInput]);

  const recordManualCheckResult = useCallback(() => {
    if (!manualCheckSession || !manualCheckSelectedCommand.trim()) {
      setStatus('Select or enter a manual check command before capturing output');
      return;
    }
    const command = manualCheckSelectedCommand.trim();
    setManualCheckSession((session) => session ? addManualCheckResult(session, command, manualCheckStatus, manualCheckOutputInput) : session);
    setManualCheckOutputInput('');
    setStatus(`Captured manual check result: ${command} (${manualCheckStatus})`);
  }, [manualCheckOutputInput, manualCheckSelectedCommand, manualCheckSession, manualCheckStatus]);

  const askAgentFromManualChecks = useCallback(() => {
    if (!manualCheckSession) return;
    askAiWithPrompt(buildManualCheckFollowupPrompt(manualCheckSession));
  }, [askAiWithPrompt, manualCheckSession]);



  const applyPendingEdit = useCallback(() => {
    if (!pendingEdit) return;
    const current = files.find((file) => file.id === pendingEdit.fileId);
    if (!current) {
      setStatus(`Cannot apply edit — ${pendingEdit.fileName} is no longer open`);
      setPendingEdit(null);
      return;
    }
    if (current.content !== pendingEdit.originalContent) {
      const proceed = window.confirm(`${pendingEdit.fileName} changed after the preview was created. Apply the AI edit anyway?`);
      if (!proceed) return;
    }
    setFiles((currentFiles) => currentFiles.map((file) => file.id === pendingEdit.fileId ? { ...file, content: pendingEdit.proposedContent, dirty: true } : file));
    bumpDocumentVersion(pendingEdit.fileId);
    setAiDirtyNotice(`AI edit applied to ${current.name}. Save All to persist it to disk.`);
    setPendingEdit(null);
    startManualCheckSession(`AI edit applied to ${current.name}`);
    setStatus(`Applied AI edit to ${current.name} — unsaved; manual check ready`);
  }, [bumpDocumentVersion, files, pendingEdit, startManualCheckSession]);

  const openPendingEditAsFile = useCallback(() => {
    if (!pendingEdit) return;
    const path = nextGeneratedPath(files, `${slugFileName(pendingEdit.fileName)}-ai-edit`);
    const file: WorkbenchFile = {
      id: `pending-edit-${pendingEdit.fileId}-${Date.now()}`,
      name: path,
      path,
      language: activeFile?.language ?? 'markdown',
      content: pendingEdit.proposedContent,
      dirty: true,
      source: 'generated',
    };
    setFiles((current) => [...current, file]);
    openWorkbenchFile(file);
    setPendingEdit(null);
    setStatus(`Opened proposed edit as ${path}`);
  }, [activeFile?.language, files, openWorkbenchFile, pendingEdit]);

  const applyWorkspacePatch = useCallback(() => {
    if (!pendingWorkspacePatch) return;
    const editsById = new Map(pendingWorkspacePatch.edits.map((edit) => [edit.fileId, edit]));
    const changedAfterPreview = files.some((file) => {
      const edit = editsById.get(file.id);
      return edit && file.content !== edit.originalContent;
    });
    if (changedAfterPreview) {
      const proceed = window.confirm('One or more files changed after the workspace patch preview was created. Apply anyway?');
      if (!proceed) return;
    }
    setFiles((currentFiles) => currentFiles.map((file) => {
      const edit = editsById.get(file.id);
      return edit ? { ...file, content: edit.proposedContent, dirty: true } : file;
    }));
    editsById.forEach((_, fileId) => bumpDocumentVersion(fileId));
    setAiDirtyNotice(`AI workspace patch applied to ${editsById.size} file${editsById.size === 1 ? '' : 's'}. Save All to persist changes.`);
    setPendingWorkspacePatch(null);
    startManualCheckSession(`AI workspace patch applied to ${editsById.size} file${editsById.size === 1 ? '' : 's'}`);
    setStatus(`Applied AI workspace patch to ${editsById.size} file${editsById.size === 1 ? '' : 's'} — unsaved; manual check ready`);
  }, [bumpDocumentVersion, files, pendingWorkspacePatch, startManualCheckSession]);

  const openWorkspacePatchAsFiles = useCallback(() => {
    if (!pendingWorkspacePatch) return;
    const existing = [...files];
    const generated = pendingWorkspacePatch.edits.map((edit) => {
      const path = nextGeneratedPath(existing, `${slugFileName(edit.fileName)}-ai-edit`);
      const original = files.find((file) => file.id === edit.fileId);
      const file: WorkbenchFile = {
        id: `workspace-patch-${edit.fileId}-${Date.now()}-${path}`,
        name: path,
        path,
        language: original?.language ?? 'markdown',
        content: edit.proposedContent,
        dirty: true,
        source: 'generated',
      };
      existing.push(file);
      return file;
    });
    setFiles((current) => [...current, ...generated]);
    if (generated[0]) openWorkbenchFile(generated[0]);
    setPendingWorkspacePatch(null);
    setStatus(`Opened ${generated.length} proposed edit file${generated.length === 1 ? '' : 's'}`);
  }, [files, openWorkbenchFile, pendingWorkspacePatch]);

  const runQuickPrompt = useCallback((kind: QuickPromptKind) => {
    if (kind === 'explain') {
      askAiWithPrompt('Explain the active file. Focus on purpose, structure, risks, and next useful edits.');
      return;
    }
    if (kind === 'improve') {
      askAiWithPrompt('Review the active file and propose the smallest concrete improvements. Include exact snippets if useful.');
      return;
    }
    if (kind === 'plan') {
      askAiWithPrompt('Create an implementation plan from the open editor context. Be specific, ordered, and call out blockers.');
      return;
    }
    if (kind === 'edit') {
      askAiWithPrompt('Edit the active file or open workspace files. Prefer one git-style unified diff in a fenced diff block, with paths matching opened files. If editing one file, a complete fenced replacement is also OK. Do not use provider-specific tools or model assumptions.');
      return;
    }
    askAiWithPrompt('Draft a concrete Markdown artifact from the open editor context. Make it ready to save as an output.');
  }, [askAiWithPrompt]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey;
      if (!mod) return;
      if (event.key.toLowerCase() === 'o') { event.preventDefault(); void handleOpenFile(); }
      if (event.key.toLowerCase() === 's') { event.preventDefault(); void saveActiveFile(); }
      if (event.key.toLowerCase() === 'w') { event.preventDefault(); if (activeFileId) closeEditor(activeFileId); }
      if (event.key.toLowerCase() === 'b') { event.preventDefault(); setPrimaryVisible((value) => !value); }
      if (event.shiftKey && event.key.toLowerCase() === 'f') { event.preventDefault(); setActivity('search'); setPrimaryVisible(true); }
      if (event.key.toLowerCase() === 'k' || event.key.toLowerCase() === 'p') { event.preventDefault(); setCommandPaletteOpen(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeFileId, closeEditor, handleOpenFile, saveActiveFile]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (dirtyFiles.length === 0) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirtyFiles.length]);

  useEffect(() => {
    if (dirtyFiles.length === 0) setAiDirtyNotice(null);
  }, [dirtyFiles.length]);

  useEffect(() => {
    const node = workbenchRef.current;
    if (!node) return;
    const update = () => setWorkbenchWidth(Math.round(node.getBoundingClientRect().width));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!workbenchWidth) return;
    const limits = workbenchLayoutLimits(workbenchWidth);
    setPrimaryWidth((width) => clampWidth(width, limits.primaryMin, limits.primaryMax));
    setSecondaryWidth((width) => clampWidth(width, limits.secondaryMin, limits.secondaryMax));
  }, [workbenchWidth]);

  useEffect(() => {
    const prefs: LayoutPrefs = { primaryVisible, primaryWidth, secondaryVisible, secondaryWidth, markdownPreviewVisible };
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(prefs));
  }, [markdownPreviewVisible, primaryVisible, primaryWidth, secondaryVisible, secondaryWidth]);
  useEffect(() => {
    if (!initialSession.folder?.handleKey) return;
    let cancelled = false;
    void (async () => {
      try {
        const handle = await getPersistedHandle<BrowserDirectoryHandleLike>(initialSession.folder?.handleKey ?? '');
        if (!handle || !(await ensureHandlePermission(handle, 'readwrite')) || cancelled) return;
        const restored = await folderFromHandle(handle);
        if (cancelled) return;
        setCurrentFolderHandleKey(initialSession.folder?.handleKey ?? null);
        setFolder(restored);
        setFiles((current) => mergeRestoredFiles(current, restored.files));
        setOpenEditorIds((ids) => ids.filter((id) => restored.files.some((file) => file.id === id) || files.some((file) => file.id === id)));
        setStatus(`Restored ${restored.name} (${restored.files.length} text files indexed)`);
      } catch (err) {
        if (!cancelled) setStatus(`Workspace restore failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    })();
    return () => { cancelled = true; };
  // Restore runs once for the startup snapshot; live changes are persisted by the session effect below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    writeSessionState({
      activity,
      folder: folder ? { name: folder.name, handleKey: currentFolderHandleKey } : null,
      files: serializeSessionFiles(files),
      openEditorIds,
      activeFileId,
      query,
      chatInput,
      welcomeClosed,
      secondaryTab,
      bottomPanelVisible,
      bottomPanelTab,
      recent,
    });
  }, [activity, activeFileId, bottomPanelTab, bottomPanelVisible, chatInput, currentFolderHandleKey, files, folder, openEditorIds, query, recent, secondaryTab, welcomeClosed]);


  useEffect(() => {
    localStorage.setItem(CHAT_AI_SETTINGS_KEY, JSON.stringify(chatSettings));
  }, [chatSettings]);

  return (
    <div
      ref={workbenchRef}
      className={`workbench-workbench ${primaryVisible ? '' : 'no-primary'} ${secondaryVisible ? '' : 'no-secondary'} ${bottomPanelVisible ? 'has-bottom-panel' : ''}`}
      data-app="workbench-vscode-base"
      style={{ '--workbench-primary-width': `${primaryWidth}px`, '--workbench-secondary-width': `${secondaryWidth}px` } as CSSProperties}
    >
      <ActivityBar
        active={activity}
        setActive={(view) => {
          if (view === activity && primaryVisible) {
            setPrimaryVisible(false);
            return;
          }
          setActivity(view);
          setPrimaryVisible(true);
        }}
        togglePrimary={() => setPrimaryVisible((value) => !value)}
        openSettings={openSettingsTab}
        settingsActive={settingsActive}
      />
      {primaryVisible && (
        <div className="workbench-primary-region">
          <PrimarySidebar
            host={host}
            activity={activity}
            folder={folder}
            files={activity === 'search' ? files : visibleFiles}
            openEditors={openEditors}
            activeFileId={activeFileId}
            query={query}
            setQuery={setQuery}
            openFile={handleOpenFile}
            openFolder={handleOpenFolder}
            openWorkbenchFile={openWorkbenchFile}
            newFile={newUntitled}
            recent={recent}
            reopenRecent={reopenRecent}
            setStatus={setStatus}
            hasFsAccess={hasFileSystemAccessApi()}
            attachSkillToChat={attachSkillToChat}
            saveLocalJobOutput={saveLocalJobOutput}
            activeFile={activeFile}
          />
          <div className="workbench-primary-resizer" onPointerDown={beginPrimaryResize} title="Resize Explorer" />
        </div>
      )}
      <main className="workbench-editor-area">
        <button className="workbench-command-center" onClick={() => setCommandPaletteOpen(true)}>Workspace</button>
        <section className="workbench-editor-stack">
          <EditorTabs
            openEditors={openEditors}
            activeFileId={activeFileId}
            showWelcome={showWelcome}
            settingsOpen={settingsTabOpen}
            settingsActive={settingsActive}
            setActiveFileId={setActiveFileId}
            closeEditor={closeEditor}
            saveFile={(id) => { void saveFileById(id); }}
            closeWelcome={() => setWelcomeClosed(true)}
            openSettings={openSettingsTab}
            closeSettings={closeSettingsTab}
            secondaryVisible={secondaryVisible}
            toggleSecondary={() => setSecondaryVisible((value) => !value)}
            canPreview={activeFile?.language === 'markdown'}
            previewVisible={markdownPreviewVisible}
            togglePreview={() => setMarkdownPreviewVisible((value) => !value)}
          />
          <BreadcrumbBar file={activeFile} folder={folder} showWelcome={showWelcome} />
          {aiDirtyNotice && dirtyFiles.length > 0 ? (
            <div className="workbench-ai-dirty-banner">
              <span>{aiDirtyNotice}</span>
              <button onClick={() => { void saveAllDirty(); }}>Save all</button>
              <button onClick={() => setAiDirtyNotice(null)} title="Dismiss"><X size={13} /></button>
            </div>
          ) : null}
          <div className="workbench-editor-content">
            {activeFile ? (
              <div className={activeFile.language === 'markdown' && markdownPreviewVisible ? 'workbench-editor-split' : 'workbench-editor-single'}>
                <div className="workbench-editor-pane">
                  <Suspense fallback={<div className="workbench-empty-pane">Loading editor…</div>}>
                    <WorkbenchMonacoEditor
                      key={activeFile.id}
                      file={activeFile}
                      revealLine={revealLine}
                      onChange={updateActiveFile}
                      onCursorChange={setCursor}
                      onSelectionChange={setActiveSelection}
                      onSave={() => { void saveActiveFile(); }}
                    />
                  </Suspense>
                </div>
                {activeFile.language === 'markdown' && markdownPreviewVisible && <MarkdownPreviewPane content={activeFile.content} />}
              </div>
            ) : settingsActive ? (
              <AtomekSettingsPane
                host={host}
                chatSettings={chatSettings}
                onChange={setChatSettings}
                onClose={closeSettingsTab}
              />
            ) : showWelcome ? (
              <MissionControlHome host={host} openFile={handleOpenFile} openFolder={handleOpenFolder} newFile={newUntitled} recent={recent} reopenRecent={reopenRecent} setStatus={setStatus} openControlTower={() => { setActivity('computer'); setPrimaryVisible(true); }} openChat={() => { setSecondaryTab('chat'); setSecondaryVisible(true); }} openEmbeddedDoc={openEmbeddedDoc} />
            ) : (
              <div className="workbench-no-editor">
                <FileSearch size={34} />
                <p>No editor open</p>
                <button className="workbench-button-subtle" onClick={() => setWelcomeClosed(false)}>Show Agent Team</button>
              </div>
            )}
          </div>
          {bottomPanelVisible && (
            <BottomPanel
              tab={bottomPanelTab}
              setTab={setBottomPanelTab}
              outputs={combinedOutputs}
              clearOutputs={() => setOutputs([])}
              deleteArtifact={(id) => { void ai.deleteArtifact(id); }}
              runAiSynthesis={runAiSynthesis}
              captureManualCheck={captureManualCheck}
              openOutputAsFile={openOutputAsFile}
              manualCheckSession={manualCheckSession}
              manualCheckCommandInput={manualCheckCommandInput}
              setManualCheckCommandInput={setManualCheckCommandInput}
              manualCheckOutputInput={manualCheckOutputInput}
              setManualCheckOutputInput={setManualCheckOutputInput}
              manualCheckSelectedCommand={manualCheckSelectedCommand}
              setManualCheckSelectedCommand={setManualCheckSelectedCommand}
              manualCheckStatus={manualCheckStatus}
              setManualCheckStatus={setManualCheckStatus}
              copyManualCheckCommand={copyManualCheckCommand}
              addManualCheckCommand={addManualCommand}
              recordManualCheckResult={recordManualCheckResult}
              askAgentFromManualChecks={askAgentFromManualChecks}
              onClose={() => setBottomPanelVisible(false)}
            />
          )}
        </section>
      </main>
      {secondaryVisible && (
        <SecondarySidebar
          tab={secondaryTab}
          setTab={setSecondaryTab}
          chatInput={chatInput}
          setChatInput={setChatInput}
          chatMessages={ai.messages}
          chatThread={ai.thread}
          chatThreads={ai.threads}
          askAgent={askAgent}
          stopChat={ai.stopChat}
          regenerateMessage={regenerateMessage}
          newChat={() => { void ai.newChat(); }}
          selectThread={(threadId) => { void ai.selectThread(threadId); }}
          renameThread={(threadId, title) => { void ai.renameThread(threadId, title); }}
          deleteThread={(threadId) => { void ai.deleteThread(threadId); }}
          saveMessageAsArtifact={saveMessageAsArtifact}
          rememberMessage={rememberMessage}
          previewEditFromMessage={(message) => previewEditFromText(message.body.split('\n').find(Boolean)?.replace(/^#+\s*/, '').slice(0, 80) || 'Atomek answer', message.body)}
          runQuickPrompt={runQuickPrompt}
          pendingPatchPrompt={pendingPatchPrompt}
          generatePatchPrompt={generatePatchPrompt}
          workspaceFileCount={files.length}
          aiStatus={ai.aiStatus}
          chatSettings={chatSettings}
          chatTargets={chatTargets}
          selectedChatTarget={selectedChatTarget}
          selectChatTarget={selectChatTarget}
          openSettings={openSettingsTab}
          busy={ai.busy}
          memoryHitCount={ai.memoryHits.length}
          outputs={combinedOutputs}
          runAiSynthesis={runAiSynthesis}
          captureManualCheck={captureManualCheck}
          openOutputAsFile={openOutputAsFile}
          previewEditFromOutput={(output) => previewEditFromText(output.title, output.body)}
          canPreviewEdit={files.length > 0}
          clearOutputs={() => setOutputs([])}
          deleteArtifact={(id) => { void ai.deleteArtifact(id); }}
          host={host}
          setStatus={setStatus}
          activeFile={activeFile}
          openEditors={openEditors}
          attachSkillToChat={attachSkillToChat}
          saveLocalJobOutput={saveLocalJobOutput}
          contextScope={chatContextScope}
          setContextScope={setChatContextScope}
          contextAttachments={contextAttachments}
          removeContextAttachment={removeContextAttachment}
          revealContextAttachment={revealContextAttachment}
          projectIndexSummary={`${projectIndex.snapshot.files.length} files · ${projectIndex.snapshot.chunks.length} chunks`}
          projectIndexStale={projectIndex.isStale}
          refreshProjectIndex={() => {
            const snapshot = projectIndex.refresh(files);
            setStatus(`Project index refreshed: ${snapshot.files.length} files · ${snapshot.chunks.length} chunks`);
          }}
          onResizeStart={beginSecondaryResize}
          onClose={() => setSecondaryVisible(false)}
        />
      )}
      {commandPaletteOpen && (
        <CommandPalette
          query={commandQuery}
          setQuery={setCommandQuery}
          files={files}
          activeFile={activeFile}
          commands={[
            { label: 'File: New File', detail: 'Create an untitled Markdown file', run: newUntitled },
            { label: 'File: Open File...', detail: 'Open one or more local files', run: () => { void handleOpenFile(); } },
            { label: 'File: Open Folder...', detail: 'Open a local folder with browser permission', run: () => { void handleOpenFolder(); } },
            ...recent.map((item) => ({ label: `File: Open Recent — ${item.name}`, detail: item.path, run: () => { void reopenRecent(item); } })),
            { label: 'File: Save All', detail: `${dirtyFiles.length} dirty file${dirtyFiles.length === 1 ? '' : 's'}`, run: () => { void saveAllDirty(); }, disabled: dirtyFiles.length === 0 },
            { label: 'File: Close All Editors', detail: `${openEditors.length} open editor${openEditors.length === 1 ? '' : 's'}`, run: closeAllEditors, disabled: openEditors.length === 0 },
            { label: 'Search: Find in Files', detail: 'Open the VS Code-style search side bar', run: () => { setActivity('search'); setPrimaryVisible(true); } },
            { label: 'Help: Show Agent Team', detail: 'Open the Atomek Resource Fabric landing page', run: () => { setActiveFileId(null); setWelcomeClosed(false); setActivity('computer'); setPrimaryVisible(true); } },
            { label: 'View: Toggle Primary Side Bar', detail: primaryVisible ? 'Hide Explorer side bar' : 'Show Explorer side bar', run: () => setPrimaryVisible((value) => !value) },
            { label: 'View: Toggle Chat Panel', detail: secondaryVisible ? 'Hide right AI side bar' : 'Show right AI side bar', run: () => setSecondaryVisible((value) => !value) },
            { label: 'View: Toggle Bottom Panel', detail: bottomPanelVisible ? 'Hide Problems/Output/Terminal panel' : 'Show Problems/Output/Terminal panel', run: () => setBottomPanelVisible((value) => !value) },
            { label: 'Atomek: Open Settings', detail: 'Open settings as an editor tab', run: openSettingsTab },
            { label: 'Checks: Open Manual Check Panel', detail: 'Capture copy/paste check commands without host execution', run: () => startManualCheckSession('Manual check requested from command palette') },
            { label: 'View: Toggle Markdown Preview', detail: activeFile?.language === 'markdown' ? 'Show or hide Markdown preview split' : 'Available for Markdown files', run: () => setMarkdownPreviewVisible((value) => !value), disabled: activeFile?.language !== 'markdown' },
            { label: 'Atomek: Create AI Synthesis', detail: activeFile || openEditors.length > 0 ? 'Ask AIL to produce a saved Markdown artifact' : 'Open a file first', run: runAiSynthesis, disabled: !activeFile && openEditors.length === 0 },
            { label: 'AI: Explain Active File', detail: activeFile ? `Ask Cortex to explain ${activeFile.path}` : 'Open a file first', run: () => askAiWithPrompt('Explain the active file. Focus on purpose, structure, risks, and next useful edits.'), disabled: !activeFile },
            { label: 'AI: Improve Active File', detail: activeFile ? `Ask Cortex for concrete edits to ${activeFile.path}` : 'Open a file first', run: () => askAiWithPrompt('Review the active file and propose the smallest concrete improvements. Include exact snippets if useful.'), disabled: !activeFile },
            { label: 'AI: Draft Editable Replacement', detail: activeFile ? `Ask Cortex for a full-file replacement for ${activeFile.path}` : 'Open a file first', run: () => runQuickPrompt('edit'), disabled: !activeFile },
            { label: 'AI: Plan Workspace Work', detail: openEditors.length > 0 ? 'Use open editors as bounded context' : 'Open files first', run: () => askAiWithPrompt('Create an implementation plan from the open editor context. Be specific and sequence the work.'), disabled: openEditors.length === 0 },
            { label: 'AI: Save Active File as Artifact', detail: activeFile ? 'Persist active file in host.ai artifacts' : 'Open a file first', run: saveActiveFileAsArtifact, disabled: !activeFile },
            { label: 'AI: Capture Manual Check Output', detail: 'Paste check output as an auditable local artifact; no shell execution', run: captureManualCheck },
            { label: 'AI: Open Latest Artifact as File', detail: combinedOutputs[0] ? `Create editable file from ${combinedOutputs[0].title}` : 'No outputs yet', run: () => combinedOutputs[0] && openOutputAsFile(combinedOutputs[0]), disabled: combinedOutputs.length === 0 },
          ]}
          openWorkbenchFile={openWorkbenchFile}
          onClose={() => setCommandPaletteOpen(false)}
        />
      )}
      {pendingEdit && (
        <EditReviewDialog
          edit={pendingEdit}
          onApply={applyPendingEdit}
          onOpenAsFile={openPendingEditAsFile}
          onClose={() => setPendingEdit(null)}
        />
      )}
      {pendingWorkspacePatch && (
        <WorkspacePatchReviewDialog
          patch={pendingWorkspacePatch}
          onApply={applyWorkspacePatch}
          onOpenAsFiles={openWorkspacePatchAsFiles}
          onClose={() => setPendingWorkspacePatch(null)}
        />
      )}
      <StatusBar status={status} file={activeFile ?? welcomeFile} cursor={cursor} fileCount={files.length} dirtyCount={dirtyFiles.length} />
    </div>
  );
}

function ActivityBar({ active, setActive, togglePrimary, openSettings, settingsActive }: { active: ActivityView; setActive: (view: ActivityView) => void; togglePrimary: () => void; openSettings: () => void; settingsActive: boolean }) {
  return (
    <aside className="workbench-activity-bar" aria-label="Activity Bar">
      <button className="workbench-activity-brand" title="Toggle side bar" aria-label="Toggle side bar" onClick={togglePrimary}><AtomekBrandMark size={30} variant="cream" /></button>
      <ActivityButton icon={<File size={25} />} label="Explorer" active={active === 'explorer'} onClick={() => setActive('explorer')} />
      <ActivityButton icon={<Search size={25} />} label="Search" active={active === 'search'} onClick={() => setActive('search')} />
      <ActivityButton icon={<GitBranch size={25} />} label="Source Control" active={active === 'source-control'} onClick={() => setActive('source-control')} />
      <ActivityButton icon={<Bug size={25} />} label="Run and Debug" active={active === 'run'} onClick={() => setActive('run')} />
      <ActivityButton icon={<Bot size={25} />} label="Agent Team" active={active === 'computer'} onClick={() => setActive('computer')} />
      <div className="workbench-activity-spacer" />
      <ActivityButton icon={<Settings size={23} />} label="Settings" active={settingsActive} onClick={openSettings} />
    </aside>
  );
}

function ActivityButton({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return <button className={`workbench-activity-button ${active ? 'active' : ''}`} title={label} aria-label={label} onClick={onClick}>{icon}</button>;
}

function PrimarySidebar(props: {
  host: HostClient;
  activity: ActivityView;
  folder: WorkbenchFolder | null;
  files: WorkbenchFile[];
  openEditors: WorkbenchFile[];
  activeFileId: string | null;
  query: string;
  setQuery: (value: string) => void;
  openFile: () => void;
  openFolder: () => void;
  openWorkbenchFile: (file: WorkbenchFile, lineNumber?: number) => void;
  newFile: () => void;
  recent: RecentEntry[];
  reopenRecent: (entry: RecentEntry) => void;
  setStatus: (status: string) => void;
  hasFsAccess: boolean;
  attachSkillToChat: (skill: AtomekSkillSummary) => Promise<void>;
  saveLocalJobOutput: (title: string, body: string) => void;
  activeFile: WorkbenchFile | null;
}) {
  if (props.activity === 'search') return <SearchPane files={props.files} query={props.query} setQuery={props.setQuery} openWorkbenchFile={props.openWorkbenchFile} activeFileId={props.activeFileId} />;
  if (props.activity === 'source-control') return <PlaceholderPane title="SOURCE CONTROL" body="No source control provider registered. Git belongs here, not as a fake demo." />;
  if (props.activity === 'run') return <PlaceholderPane title="RUN AND DEBUG" body="Run configurations, terminals, and recipe execution will plug into this surface later." />;
  if (props.activity === 'computer') return <ControlTowerPane host={props.host} setStatus={props.setStatus} attachSkillToChat={props.attachSkillToChat} saveLocalJobOutput={props.saveLocalJobOutput} activeFile={props.activeFile} openEditors={props.openEditors} />;
  return <ExplorerPane {...props} />;
}

function ExplorerPane(props: Omit<Parameters<typeof PrimarySidebar>[0], 'activity'>) {
  const noFolder = !props.folder;
  const tree = useMemo(() => buildFileTree(props.files, props.folder?.name), [props.files, props.folder?.name]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const dirs = collectTreeDirPaths(tree);
    setExpandedDirs((current) => {
      const next = new Set(current);
      dirs.forEach((dir) => next.add(dir));
      return next;
    });
  }, [tree]);

  const toggleDir = useCallback((path: string) => {
    setExpandedDirs((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  return (
    <aside className="workbench-sidebar">
      <div className="workbench-sidebar-title">EXPLORER</div>
      <div className="workbench-sidebar-scroll">
        {noFolder ? (
          <>
            <p style={{ fontWeight: 600, margin: '10px 0' }}>NO FOLDER OPENED</p>
            <p className="workbench-muted">You have not yet opened a folder.</p>
            <button className="workbench-button-blue" onClick={props.openFolder}>Open Folder</button>
            <button className="workbench-button-blue" onClick={props.openFile}>Open File</button>
            <button className="workbench-button-blue" onClick={() => props.recent[0] ? void props.reopenRecent(props.recent[0]) : props.setStatus('No recent local workspace yet.')}>Open Recent</button>
            <p className="workbench-muted">{props.hasFsAccess ? 'Local files use browser-native File System Access API.' : 'Browser fallback may show a file chooser label.'}</p>
          </>
        ) : (
          <>
            <div className="workbench-sidebar-actions">
              <button className="workbench-button-subtle" onClick={props.openFile}><FilePlus2 size={14} />Open File</button>
              <button className="workbench-button-subtle" onClick={props.openFolder}><FolderOpen size={14} />Open Folder</button>
            </div>
            <input className="workbench-input" value={props.query} onChange={(event) => props.setQuery(event.target.value)} placeholder="Search files" />
            <div className="workbench-section-title"><ChevronDown size={12} /> Open Editors</div>
            {props.openEditors.length === 0 ? <p className="workbench-muted">No open editors</p> : props.openEditors.map((file) => (
              <FileRow key={file.id} file={file} active={file.id === props.activeFileId} onOpen={() => props.openWorkbenchFile(file)} label={file.name} detail={file.path} />
            ))}
            <div className="workbench-section-title"><ChevronDown size={12} /> {props.folder?.name ?? 'Workspace'}</div>
            {tree.length === 0 ? <p className="workbench-muted">No readable text files found.</p> : renderTreeNodes(tree, props.activeFileId, props.openWorkbenchFile, expandedDirs, toggleDir)}
          </>
        )}
        <div className="workbench-section-title">Recent</div>
        {props.recent.length === 0 ? <p className="workbench-muted">No recent folders yet.</p> : props.recent.map((item) => <button key={`${item.path}-${item.at}`} className="workbench-tree-row" onClick={() => { void props.reopenRecent(item); }} title={item.path}>{item.kind === 'file' ? <FileCode2 size={14} /> : <Folder size={14} />}<span className="workbench-row-name">{item.name}</span></button>)}
      </div>
    </aside>
  );
}

function FileRow({ file, active, onOpen, basePath, depth = 0, label, detail }: { file: WorkbenchFile; active: boolean; onOpen: () => void; basePath?: string; depth?: number; label?: string; detail?: string }) {
  const displayPath = basePath && file.path.startsWith(`${basePath}/`) ? file.path.slice(basePath.length + 1) : file.path;
  const displayDepth = depth || Math.max(0, displayPath.split('/').length - 1);
  return (
    <button className={`workbench-file-row ${active ? 'active' : ''}`} style={{ '--workbench-depth': displayDepth } as CSSProperties} onClick={onOpen} title={file.path}>
      <FileCode2 size={14} />
      <span className="workbench-row-text">
        <span className="workbench-row-name">{label ?? displayPath}</span>
        {detail ? <span className="workbench-row-detail">{detail}</span> : null}
      </span>
      {file.dirty && <span className="workbench-row-meta">●</span>}
    </button>
  );
}

type TreeNode = { name: string; path: string; children: TreeNode[]; file?: WorkbenchFile };

function buildFileTree(files: WorkbenchFile[], basePath?: string): TreeNode[] {
  const roots: TreeNode[] = [];
  const dirs = new Map<string, TreeNode>();
  const ensureDir = (path: string, name: string, parent: TreeNode[] = roots): TreeNode => {
    const existing = dirs.get(path);
    if (existing) return existing;
    const node: TreeNode = { name, path, children: [] };
    dirs.set(path, node);
    parent.push(node);
    return node;
  };
  files.forEach((file) => {
    const relative = basePath && file.path.startsWith(`${basePath}/`) ? file.path.slice(basePath.length + 1) : file.path;
    const parts = relative.split('/').filter(Boolean);
    let parent = roots;
    let cursor = '';
    parts.slice(0, -1).forEach((part) => {
      cursor = cursor ? `${cursor}/${part}` : part;
      const dir = ensureDir(cursor, part, parent);
      parent = dir.children;
    });
    parent.push({ name: parts.at(-1) ?? file.name, path: relative, file, children: [] });
  });
  const sortNodes = (nodes: TreeNode[]): TreeNode[] => nodes
    .sort((a, b) => Number(Boolean(a.file)) - Number(Boolean(b.file)) || a.name.localeCompare(b.name))
    .map((node) => ({ ...node, children: sortNodes(node.children) }));
  return sortNodes(roots);
}

function collectTreeDirPaths(nodes: TreeNode[]): string[] {
  return nodes.flatMap((node) => node.file ? [] : [node.path, ...collectTreeDirPaths(node.children)]);
}

function renderTreeNodes(
  nodes: TreeNode[],
  activeFileId: string | null,
  openWorkbenchFile: (file: WorkbenchFile) => void,
  expandedDirs: Set<string>,
  toggleDir: (path: string) => void,
  depth = 0,
): ReactNode {
  return nodes.map((node) => {
    if (node.file) {
      return <FileRow key={node.file.id} file={node.file} active={node.file.id === activeFileId} onOpen={() => openWorkbenchFile(node.file as WorkbenchFile)} depth={depth} label={node.name} />;
    }
    const expanded = expandedDirs.has(node.path);
    return (
      <div key={node.path}>
        <button className="workbench-folder-row" style={{ '--workbench-depth': depth } as CSSProperties} onClick={() => toggleDir(node.path)} title={expanded ? `Collapse ${node.name}` : `Expand ${node.name}`}>
          {expanded ? <ChevronDown size={12} /> : <ChevronDown className="workbench-chevron-collapsed" size={12} />}
          {expanded ? <FolderOpen size={14} /> : <Folder size={14} />}
          <span className="workbench-row-name">{node.name}</span>
          <span className="workbench-row-meta">{node.children.length}</span>
        </button>
        {expanded ? renderTreeNodes(node.children, activeFileId, openWorkbenchFile, expandedDirs, toggleDir, depth + 1) : null}
      </div>
    );
  });
}

function BreadcrumbBar({ file, folder, showWelcome }: { file: WorkbenchFile | null; folder: WorkbenchFolder | null; showWelcome: boolean }) {
  const parts = showWelcome ? ['Agent Team'] : (file?.path.split('/').filter(Boolean) ?? []);
  const normalized = folder && parts[0] === folder.name ? parts.slice(1) : parts;
  return (
    <div className="workbench-breadcrumb">
      {normalized.length === 0 ? <span>Workspace</span> : normalized.map((part, index) => (
        <span key={`${part}-${index}`} className="workbench-breadcrumb-part">
          {index > 0 && <span className="workbench-breadcrumb-sep">›</span>}
          {part}
        </span>
      ))}
    </div>
  );
}

function EditorTabs(props: {
  openEditors: WorkbenchFile[];
  activeFileId: string | null;
  showWelcome: boolean;
  settingsOpen: boolean;
  settingsActive: boolean;
  setActiveFileId: (id: string | null) => void;
  closeEditor: (id: string) => void;
  saveFile: (id: string) => void;
  closeWelcome: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  secondaryVisible: boolean;
  toggleSecondary: () => void;
  canPreview: boolean;
  previewVisible: boolean;
  togglePreview: () => void;
}) {
  return (
    <div className="workbench-tabs">
      {props.showWelcome && (
        <button className="workbench-tab active">
          <FileSearch size={15} />
          <span className="workbench-tab-name">Agent Team</span>
          <span className="workbench-tab-close" role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); props.closeWelcome(); }}><X size={13} /></span>
        </button>
      )}
      {props.settingsOpen && (
        <button className={`workbench-tab ${props.settingsActive ? 'active' : ''}`} onClick={props.openSettings} title="Atomek Settings">
          <SlidersHorizontal size={15} />
          <span className="workbench-tab-name">Atomek Settings</span>
          <span className="workbench-tab-close" role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); props.closeSettings(); }}><X size={13} /></span>
        </button>
      )}
      {props.openEditors.map((file) => (
        <button key={file.id} className={`workbench-tab ${file.id === props.activeFileId ? 'active' : ''}`} onClick={() => props.setActiveFileId(file.id)} title={file.path}>
          <FileCode2 size={15} />
          <span className="workbench-tab-name">{file.dirty && <span className="workbench-dirty-dot">●</span>}{file.name}</span>
          {file.dirty && <span className="workbench-tab-save" role="button" tabIndex={0} title="Save" onClick={(event) => { event.stopPropagation(); props.saveFile(file.id); }}>Save</span>}
          <span className="workbench-tab-close" role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); props.closeEditor(file.id); }}><X size={13} /></span>
        </button>
      ))}
      <div style={{ flex: 1 }} />
      {props.canPreview && <button className={`workbench-editor-action ${props.previewVisible ? 'active' : ''}`} title="Toggle Markdown Preview" onClick={props.togglePreview}><Eye size={16} /></button>}
      <button className={`workbench-editor-action ${props.secondaryVisible ? 'active' : ''}`} title="Toggle Chat" onClick={props.toggleSecondary}><PanelRight size={16} /></button>
    </div>
  );
}

function summarizeControlTowerResources(graph: TytusResourceGraph | null): Array<{ label: string; value: number; detail: string }> {
  const resources = graph?.resources ?? [];
  const count = (kind: TytusResource['kind']) => resources.filter((resource) => resource.kind === kind).length;
  const ready = resources.filter((resource) => resource.status === 'ready' || resource.status === 'available').length;
  return [
    { label: 'Pod agents', value: count('pod-agent'), detail: 'OpenClaw + Hermes worker pods' },
    { label: 'Local agents', value: count('local-cli'), detail: 'Claude, OpenCode, Codex, pi, Kimi' },
    { label: 'Shared folders', value: count('shared-folder'), detail: 'garagetytus + mission handoff' },
    { label: 'App skills', value: count('app-skill'), detail: 'Blender, JULI3TA, Remotion, tools' },
    { label: 'Ready resources', value: ready, detail: 'usable now' },
  ];
}

function topControlTowerResources(graph: TytusResourceGraph | null): TytusResource[] {
  const priority: Record<string, number> = {
    'pod-agent': 0,
    'local-cli': 1,
    'shared-folder': 2,
    'app-skill': 3,
    'ail-route': 4,
    workspace: 5,
  };
  return [...(graph?.resources ?? [])]
    .sort((a, b) => (priority[a.kind] ?? 9) - (priority[b.kind] ?? 9) || resourceDisplayLabel(a).localeCompare(resourceDisplayLabel(b)))
    .slice(0, 8);
}

function MissionControlHome({
  host,
  openFile,
  openFolder,
  newFile,
  recent,
  reopenRecent,
  setStatus,
  openControlTower,
  openChat,
  openEmbeddedDoc,
}: {
  host: HostClient;
  openFile: () => void;
  openFolder: () => void;
  newFile: () => void;
  recent: RecentEntry[];
  reopenRecent: (entry: RecentEntry) => void;
  setStatus: (status: string) => void;
  openControlTower: () => void;
  openChat: () => void;
  openEmbeddedDoc: (doc: AtomekEmbeddedDoc) => void;
}) {
  const [goal, setGoal] = useState('Coordinate a Tytus mission across pods, local agents, shared folders, and app skills.');
  const [graph, setGraph] = useState<TytusResourceGraph | null>(null);
  const [missionList, setMissionList] = useState<TytusMissionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [mission, setMission] = useState<TytusMission | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [teamPresetId, setTeamPresetId] = useState<TeamPresetId>('pod-local');

  const loadResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [next, missions] = await Promise.all([
        host.resources?.list?.() ?? Promise.resolve(null),
        host.missions?.list?.().catch(() => [] as TytusMissionSummary[]) ?? Promise.resolve([] as TytusMissionSummary[]),
      ]);
      setGraph(next ?? null);
      setMissionList(missions);
      if (next) setStatus(`Agent team loaded · ${next.resources.length} resources · ${next.warnings.length} warnings`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setStatus(`Agent team resource load failed: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [host.missions, host.resources, setStatus]);

  const openTytusApp = useCallback((appId: string, label: string) => {
    try {
      host.windows.openOrFocus(appId);
      setStatus(`Opened ${label}`);
    } catch (err) {
      setStatus(`Open ${label} failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [host.windows, setStatus]);

  useEffect(() => {
    void loadResources();
  }, [loadResources]);

  const startMission = useCallback(async () => {
    if (!host.missions?.create || !host.missions?.write) {
      setStatus('Mission API unavailable in this Tytus host build');
      openControlTower();
      return;
    }
    const trimmedGoal = goal.trim() || 'Coordinate a Tytus mission.';
    const selectedPresetId = pickTeamPresetId(trimmedGoal, graph, teamPresetId);
    setLoading(true);
    try {
      const created = await host.missions.create({
        title: `Atomek team mission — ${new Date().toLocaleString()}`,
        goal: trimmedGoal,
      });
      const missionState: MissionFolderState = {
        missionId: created.missionId,
        title: created.title,
        goal: created.goal,
        rootPath: created.rootPath,
        name: created.rootPath.split('/').pop() || created.missionId,
        source: 'tray',
        teamPresetId: selectedPresetId,
      };
      const audit: MissionAuditEvent = {
        ts: new Date().toISOString(),
        kind: 'mission.control.created',
        message: 'Mission created from Atomek agent-team home',
        data: { resourceCount: graph?.resources.length ?? 0 },
      };
      await host.missions.write({
        rootPath: created.rootPath,
        files: [
          { path: 'MISSION.md', content: buildMissionMarkdown(missionState, graph, null, [], trimmedGoal, selectedPresetId) },
          { path: 'MISSION.json', content: buildMissionJson(missionState, graph, trimmedGoal, selectedPresetId) },
          { path: 'RESOURCES.md', content: buildResourcesMarkdown(graph) },
          { path: 'TASKS.md', content: buildTasksMarkdown(buildMissionTasks(trimmedGoal, graph, selectedPresetId)) },
          { path: 'HANDOFF.md', content: buildHandoffMarkdown(missionState) },
          { path: 'INBOX.md', content: '# Mission inbox\n\nDrop incoming agent notes, pod outputs, and shared-folder discoveries here.\n' },
          { path: 'OUTBOX.md', content: '# Mission outbox\n\nApproved handoffs, final artifacts, and user-ready summaries go here.\n' },
          { path: 'AUDIT.jsonl', content: `${JSON.stringify(audit)}\n` },
          { path: 'RUNS.jsonl', content: '' },
          { path: 'runs/README.md', content: '# Mission runs\n\nLocal, pod, and app run transcripts land here.\n' },
          { path: 'outputs/README.md', content: '# Mission outputs\n\nFinal artifacts and generated files land here before handoff.\n' },
          { path: 'proposals/README.md', content: '# Mission proposals\n\nPatch/write/publish proposals land here before approval.\n' },
          { path: 'approvals/README.md', content: '# Mission approvals\n\nApproval and rejection decisions reference proposal files from here.\n' },
          { path: 'NEXT.md', content: ['# Next actions', '', '- Pick resources for the mission.', '- Break goal into task cards.', '- Dispatch local/pod/app runs through Atomek.', '- Review approvals before applying outputs.', ''].join('\n') },
        ],
      });
      setMission(created);
      saveCurrentMission(missionState);
      setStatus(`Mission created: ${created.rootPath}`);
      openControlTower();
    } catch (err) {
      setStatus(`Mission create failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }, [goal, graph, host.missions, openControlTower, setStatus, teamPresetId]);

  const summaries = summarizeControlTowerResources(graph);
  const agentTeam = summarizeAgentTeam(graph);
  const resourceFabric = summarizeResourceFabric(graph);
  const resources = topControlTowerResources(graph);
  const warnings = graph?.warnings ?? [];
  const teamPresets = buildTeamPresetPreviews(graph);
  const selectedTeamPreset = buildTeamPresetPreview(graph, pickTeamPresetId(goal, graph, teamPresetId));
  const tasks = buildMissionTasks(goal, graph, selectedTeamPreset.id);

  return (
    <div className="workbench-welcome workbench-control-home">
      <section className="workbench-control-hero-main">
        <div className="workbench-brand-lockup" aria-label="Atomek">
          <AtomekBrandMark size={74} variant="acid" />
          <div>
            <AtomekWordmark className="workbench-brand-wordmark" />
            <div className="workbench-control-kicker">Resource Fabric / Agent Team</div>
          </div>
        </div>
        <h1>Split the mission. Ship the build.</h1>
        <p>Atomek is the Tytus control surface for OpenClaw, Hermes, local AI agents, shared folders, pods, local apps, files, outputs, and approval-gated handoffs around one durable mission folder.</p>
        <div className="workbench-control-goal-row">
          <textarea value={goal} onChange={(event) => setGoal(event.target.value)} rows={3} aria-label="Mission goal" />
          <div className="workbench-control-hero-actions">
            <button className="workbench-button-primary" onClick={() => { void startMission(); }} disabled={loading}>Start mission</button>
            <button className="workbench-button-subtle" onClick={openControlTower}>Open team board</button>
            <button className="workbench-button-subtle" onClick={openChat}>Open chat</button>
          </div>
        </div>
        <div className="workbench-team-preset-strip" aria-label="Team presets">
          {teamPresets.map((preset) => (
            <button
              key={preset.id}
              className={`workbench-team-preset-card ${preset.id === selectedTeamPreset.id ? 'active' : ''} ${preset.readiness}`}
              onClick={() => setTeamPresetId(preset.id)}
            >
              <div>
                <strong>{preset.label}</strong>
                <span>{preset.readiness}</span>
              </div>
              <p>{preset.summary}</p>
              <small>{preset.assignments.map((assignment) => assignment.resourceLabel).slice(0, 3).join(' · ')}</small>
            </button>
          ))}
        </div>
        {mission ? <div className="workbench-control-success">Mission ready: <code>{mission.rootPath}</code></div> : null}
        {error ? <div className="workbench-inline-error">{error}</div> : null}
      </section>

      <section className="workbench-control-grid">
        <article className="workbench-control-card wide">
          <header>
            <strong>System inventory</strong>
            <button className="workbench-button-subtle" onClick={() => { void loadResources(); }} disabled={loading}><RefreshCcw size={13} /> {loading ? 'Refreshing…' : 'Refresh'}</button>
          </header>
          <div className="workbench-control-metrics">
            {summaries.map((item) => (
              <div key={item.label} className="workbench-control-metric">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                <em>{item.detail}</em>
              </div>
            ))}
          </div>
        </article>

        <article className="workbench-control-card wide">
          <header><strong>Agent team</strong><span>OpenClaw + Hermes are first-class</span></header>
          <div className="workbench-agent-brand-grid">
            {agentTeam.map((item) => (
              <div key={item.label} className={`workbench-agent-brand-card ${item.status.replace(/\s+/g, '-')}`}>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.status}</span>
                </div>
                <b>{item.value}</b>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="workbench-control-card wide">
          <header><strong>Docs & Skills</strong><span>open a guide as a markdown tab, then ask chat about it</span></header>
          <div className="workbench-doc-grid">
            {ATOMEK_EMBEDDED_DOCS.map((doc) => (
              <button key={doc.id} className="workbench-doc-card" onClick={() => openEmbeddedDoc(doc)} title={doc.summary}>
                <strong>{doc.title}</strong>
                <p>{doc.summary}</p>
                <small>{doc.tags.join(' · ')}</small>
              </button>
            ))}
          </div>
        </article>

        <article className="workbench-control-card wide">
          <header><strong>Tytus Resource Fabric</strong><span>local computer ↔ shared folders ↔ pods ↔ apps</span></header>
          <div className="workbench-fabric-flow">
            {resourceFabric.map((item, index) => (
              <div key={item.label} className={`workbench-fabric-node ${item.status.replace(/\s+/g, '-')}`}>
                <span>{index + 1}</span>
                <strong>{item.label}</strong>
                <em>{item.status}</em>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="workbench-fabric-actions">
            <button className="workbench-button-subtle" onClick={() => openTytusApp(TYTUS_CORE_APP_IDS.sharedFiles, 'Shared Files')}>Open shared files</button>
            <button className="workbench-button-subtle" onClick={() => openTytusApp(TYTUS_CORE_APP_IDS.podInspector, 'Pod Inspector')}>Open pods</button>
            <button className="workbench-button-subtle" onClick={() => openTytusApp(TYTUS_CORE_APP_IDS.channels, 'Channels')}>Open channels</button>
            <button className="workbench-button-subtle" onClick={() => openTytusApp(TYTUS_CORE_APP_IDS.settings, 'Agent Settings')}>Open agent settings</button>
          </div>
        </article>

        <article className="workbench-control-card">
          <header><strong>First missions</strong></header>
          <button className="workbench-control-preset" onClick={() => setGoal('Review this repo with local OpenCode/Claude, then ask Codex or pi for an independent review. Save all transcripts and proposed patches in the mission folder.')}>Review + patch repo</button>
          <button className="workbench-control-preset" onClick={() => setGoal('Ask OpenClaw for independent critique, use Hermes when allocated for deep planning/copy, then run local Claude/OpenCode/Codex for implementation. Keep shared context in the mission folder and approval-gate all edits.')}>OpenClaw/Hermes + local agent</button>
          <button className="workbench-control-preset" onClick={() => setGoal('Coordinate creative output: script, audio, visuals, render assets, and final handoff through app skills and shared folders.')}>Creative production</button>
        </article>

        <article className="workbench-control-card">
          <header><strong>Resume</strong><span>{missionList.length ? `${missionList.length} missions` : 'none yet'}</span></header>
          {missionList.length === 0 ? <p className="workbench-muted">Create a mission once; it stays in Tytus Home/Missions and can be resumed here.</p> : null}
          {missionList.slice(0, 4).map((item) => (
            <button key={item.missionId} className="workbench-control-preset" onClick={() => { saveCurrentMission(item); openControlTower(); }} title={item.rootPath}>
              {item.title}
              <small>{item.status ?? 'active'} · {item.taskCount ?? 0} tasks · {item.runCount ?? 0} runs</small>
            </button>
          ))}
        </article>

        <article className="workbench-control-card">
          <header><strong>Workspace</strong></header>
          <button className="workbench-start-link" onClick={openFolder}><FolderOpen size={18} />Open workspace folder</button>
          <button className="workbench-start-link" onClick={openFile}><File size={18} />Open file</button>
          <button className="workbench-start-link" onClick={newFile}><FilePlus2 size={18} />New mission note</button>
          {recent.length ? <div className="workbench-control-recent"><span>Recent</span>{recent.slice(0, 3).map((item) => <button key={`${item.path}-${item.at}`} onClick={() => { void reopenRecent(item); }}>{item.name}</button>)}</div> : null}
        </article>

        <article className="workbench-control-card wide">
          <header><strong>Resource graph</strong><span>{graph ? `${graph.resources.length} discovered` : 'not loaded'}</span></header>
          <div className="workbench-control-resource-list">
            {resources.length === 0 ? <p className="workbench-muted">No resource graph yet. Start Tytus tray beta30 or newer, then refresh.</p> : null}
            {resources.map((resource) => (
              <div key={resource.id} className="workbench-control-resource">
                <div>
                  <strong>{resourceDisplayLabel(resource)}</strong>
                  <span>{resourceDisplayDetail(resource)}</span>
                </div>
                <span className={`workbench-computer-pill ${resource.status}`}>{resource.status}</span>
              </div>
            ))}
          </div>
          {warnings.length ? <div className="workbench-resource-warnings">{warnings.slice(0, 2).map((warning) => <span key={`${warning.code}-${warning.resourceId ?? warning.message}`}>{warning.code}: {warning.message}</span>)}</div> : null}
        </article>

        <article className="workbench-control-card wide">
          <header><strong>Recommended task graph</strong></header>
          <div className="workbench-task-graph home">
            {tasks.map((task, index) => (
              <button key={task.id} className={`workbench-task-card ${task.status}`} onClick={() => setGoal(task.prompt)}>
                <span>{index + 1}</span>
                <strong>{task.title}</strong>
                <em>{task.resourceHint}</em>
                <small>{task.assignedResourceLabel}</small>
              </button>
            ))}
          </div>
        </article>

        <article className="workbench-control-card wide">
          <header><strong>Control loop</strong></header>
          <ol className="workbench-control-loop">
            <li><b>Mission</b><span>Goal + shared context folder.</span></li>
            <li><b>Resources</b><span>Pods, local agents, folders, app skills.</span></li>
            <li><b>Tasks</b><span>Plan, implement, review, render, validate.</span></li>
            <li><b>Runs</b><span>Streams + transcripts saved under <code>runs/</code>.</span></li>
            <li><b>Approvals</b><span>Diffs/artifacts applied only after preview.</span></li>
          </ol>
        </article>
      </section>
    </div>
  );
}

function SearchPane({ files, query, setQuery, openWorkbenchFile, activeFileId }: { files: WorkbenchFile[]; query: string; setQuery: (value: string) => void; openWorkbenchFile: (file: WorkbenchFile, lineNumber?: number) => void; activeFileId: string | null }) {
  const results = useMemo(() => buildSearchResults(files, query), [files, query]);
  const grouped = useMemo(() => {
    const byFile = new Map<string, SearchResult[]>();
    results.forEach((result) => byFile.set(result.file.id, [...(byFile.get(result.file.id) ?? []), result]));
    return Array.from(byFile.values()).slice(0, 50);
  }, [results]);
  return (
    <aside className="workbench-sidebar">
      <div className="workbench-sidebar-title">SEARCH</div>
      <div className="workbench-sidebar-scroll">
        <input className="workbench-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search files and text" autoFocus />
        <div className="workbench-section-title"><FileSearch size={12} /> Results</div>
        {!query.trim() ? <p className="workbench-muted">Type to search filenames and text in the opened workspace.</p> : grouped.length === 0 ? <p className="workbench-muted">No matches.</p> : grouped.map((group) => {
          const file = group[0].file;
          return (
            <div key={file.id} className="workbench-search-group">
              <FileRow file={file} active={file.id === activeFileId} onOpen={() => openWorkbenchFile(file)} />
              {group.slice(0, 5).map((result) => (
                <button key={`${file.id}-${result.lineNumber}-${result.line}`} className="workbench-search-hit" onClick={() => openWorkbenchFile(file, result.lineNumber)} title={result.line}>
                  <span className="workbench-search-line">{result.lineNumber}</span>
                  <span>{result.line}</span>
                </button>
              ))}
              {group.length > 5 && <div className="workbench-search-more">+{group.length - 5} more matches</div>}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function buildSearchResults(files: WorkbenchFile[], query: string): SearchResult[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const results: SearchResult[] = [];
  files.forEach((file) => {
    if (file.path.toLowerCase().includes(needle)) {
      results.push({ file, lineNumber: 1, line: file.path });
    }
    file.content.split('\n').some((line, index) => {
      if (!line.toLowerCase().includes(needle)) return false;
      results.push({ file, lineNumber: index + 1, line: line.trim() || '(blank line)' });
      return results.length >= 200;
    });
  });
  return results.slice(0, 200);
}

function CommandPalette(props: {
  query: string;
  setQuery: (query: string) => void;
  files: WorkbenchFile[];
  activeFile: WorkbenchFile | null;
  commands: PaletteItem[];
  openWorkbenchFile: (file: WorkbenchFile, lineNumber?: number) => void;
  onClose: () => void;
}) {
  const needle = props.query.trim().toLowerCase();
  const fileCommands: PaletteItem[] = props.files.slice(0, 80).map((file) => ({
    label: file.path,
    detail: `Open ${labelForLanguage(file.language)} file`,
    run: () => props.openWorkbenchFile(file),
  }));
  const items: PaletteItem[] = [...props.commands, ...fileCommands].filter((item) => !needle || item.label.toLowerCase().includes(needle) || item.detail.toLowerCase().includes(needle)).slice(0, 12);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') props.onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [props.onClose]);
  return (
    <div className="workbench-command-overlay" role="dialog" aria-label="Command Palette">
      <div className="workbench-command-palette">
        <input
          className="workbench-command-input"
          autoFocus
          value={props.query}
          onChange={(event) => props.setQuery(event.target.value)}
          placeholder="Type a command or file name..."
          onKeyDown={(event) => {
            if (event.key === 'Enter' && items[0] && !items[0].disabled) {
              items[0].run();
              props.onClose();
            }
          }}
        />
        <div className="workbench-command-list">
          {items.map((item) => (
            <button
              key={`${item.label}-${item.detail}`}
              disabled={item.disabled}
              className="workbench-command-item"
              onClick={() => {
                item.run();
                props.onClose();
              }}
            >
              <span>{item.label}</span>
              <small>{item.detail}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


function MarkdownPreviewPane({ content }: { content: string }) {
  const html = useMemo(() => markdownToHtml(content), [content]);
  return (
    <aside className="workbench-markdown-preview">
      <div className="workbench-preview-title"><Eye size={13} /> Preview</div>
      <div className="workbench-preview-body" dangerouslySetInnerHTML={{ __html: html }} />
    </aside>
  );
}


function ManualCheckPanel(props: {
  session: ManualCheckSession | null;
  commandInput: string;
  setCommandInput: (value: string) => void;
  outputInput: string;
  setOutputInput: (value: string) => void;
  selectedCommand: string;
  setSelectedCommand: (value: string) => void;
  status: ManualCheckStatus;
  setStatus: (value: ManualCheckStatus) => void;
  copyCommand: (command: string) => void;
  addCommand: () => void;
  recordResult: () => void;
  askAgent: () => void;
}) {
  const sessionStatus = props.session ? latestManualCheckStatus(props.session) : 'pending';
  return (
    <div className="workbench-manual-check-panel">
      <p className="workbench-muted">Terminal is parked. Atomek never executes host commands here; copy a command, run it yourself, then paste the result.</p>
      {!props.session ? (
        <pre className="workbench-terminal-placeholder">$ open the command palette and run Checks: Open Manual Check Panel</pre>
      ) : (
        <>
          <div className="workbench-manual-check-head">
            <strong>Manual edit-check loop</strong>
            <span className={`workbench-check-status ${sessionStatus}`}>{sessionStatus}</span>
            <small>{props.session.reason}</small>
          </div>
          <div className="workbench-manual-check-grid">
            <section>
              <label>Check commands</label>
              {props.session.commands.length === 0 ? <p className="workbench-muted">No project check scripts detected from open files. Add the command you want to run.</p> : null}
              <div className="workbench-check-command-list">
                {props.session.commands.map((command) => (
                  <button
                    key={command.id}
                    className={props.selectedCommand === command.command ? 'active' : ''}
                    onClick={() => props.setSelectedCommand(command.command)}
                    title={command.path ?? command.source}
                  >
                    <span>{command.command}</span>
                    <small>{command.source === 'package-script' ? command.label : 'manual'}</small>
                  </button>
                ))}
              </div>
              <div className="workbench-check-add-row">
                <input
                  value={props.commandInput}
                  onChange={(event) => props.setCommandInput(event.target.value)}
                  placeholder="Add manual command to copy"
                />
                <button onClick={props.addCommand} disabled={!props.commandInput.trim()}>Add</button>
              </div>
              <button className="workbench-button-primary" onClick={() => props.copyCommand(props.selectedCommand)} disabled={!props.selectedCommand.trim()}>
                Copy selected command
              </button>
            </section>
            <section>
              <label>Paste result</label>
              <select value={props.status} onChange={(event) => props.setStatus(event.target.value as ManualCheckStatus)}>
                <option value="failed">failed</option>
                <option value="passed">passed</option>
                <option value="pending">pending/manual note</option>
              </select>
              <textarea
                value={props.outputInput}
                onChange={(event) => props.setOutputInput(event.target.value)}
                placeholder="Paste stdout/stderr or a short manual QA note. Nothing runs in Atomek."
                rows={6}
              />
              <div className="workbench-check-actions">
                <button onClick={props.recordResult} disabled={!props.selectedCommand.trim()}>Capture result</button>
                <button className="workbench-button-primary" onClick={props.askAgent} disabled={props.session.results.length === 0}>Ask Atomek to continue</button>
              </div>
            </section>
          </div>
          {props.session.results.length > 0 ? (
            <div className="workbench-check-results">
              <label>Captured results</label>
              {props.session.results.map((result, index) => (
                <article key={`${result.capturedAt}-${index}`}>
                  <strong>{result.command}</strong>
                  <span className={`workbench-check-status ${result.status}`}>{result.status}</span>
                  <pre>{result.output || '(no output pasted)'}</pre>
                </article>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function BottomPanel(props: {
  tab: BottomPanelTab;
  setTab: (tab: BottomPanelTab) => void;
  outputs: OutputArtifact[];
  clearOutputs: () => void;
  deleteArtifact: (id: string) => void;
  runAiSynthesis: () => void;
  captureManualCheck: () => void;
  openOutputAsFile: (output: OutputArtifact) => void;
  manualCheckSession: ManualCheckSession | null;
  manualCheckCommandInput: string;
  setManualCheckCommandInput: (value: string) => void;
  manualCheckOutputInput: string;
  setManualCheckOutputInput: (value: string) => void;
  manualCheckSelectedCommand: string;
  setManualCheckSelectedCommand: (value: string) => void;
  manualCheckStatus: ManualCheckStatus;
  setManualCheckStatus: (value: ManualCheckStatus) => void;
  copyManualCheckCommand: (command: string) => void;
  addManualCheckCommand: () => void;
  recordManualCheckResult: () => void;
  askAgentFromManualChecks: () => void;
  onClose: () => void;
}) {
  return (
    <section className="workbench-bottom-panel" aria-label="Panel">
      <div className="workbench-bottom-tabs">
        <button className={props.tab === 'problems' ? 'active' : ''} onClick={() => props.setTab('problems')}>PROBLEMS</button>
        <button className={props.tab === 'output' ? 'active' : ''} onClick={() => props.setTab('output')}>OUTPUT</button>
        <button className={props.tab === 'terminal' ? 'active' : ''} onClick={() => props.setTab('terminal')}>TERMINAL</button>
        <span />
        <button title="Close Panel" onClick={props.onClose}><X size={14} /></button>
      </div>
      <div className="workbench-bottom-body">
        {props.tab === 'problems' && <p className="workbench-muted">No problems detected in open files. Diagnostics wire in after the base shell is approved.</p>}
        {props.tab === 'terminal' && (
          <ManualCheckPanel
            session={props.manualCheckSession}
            commandInput={props.manualCheckCommandInput}
            setCommandInput={props.setManualCheckCommandInput}
            outputInput={props.manualCheckOutputInput}
            setOutputInput={props.setManualCheckOutputInput}
            selectedCommand={props.manualCheckSelectedCommand}
            setSelectedCommand={props.setManualCheckSelectedCommand}
            status={props.manualCheckStatus}
            setStatus={props.setManualCheckStatus}
            copyCommand={props.copyManualCheckCommand}
            addCommand={props.addManualCheckCommand}
            recordResult={props.recordManualCheckResult}
            askAgent={props.askAgentFromManualChecks}
          />
        )}
        {props.tab === 'output' && (
          <OutputsPane outputs={props.outputs} clearOutputs={props.clearOutputs} deleteArtifact={props.deleteArtifact} runAiSynthesis={props.runAiSynthesis} captureManualCheck={props.captureManualCheck} openOutputAsFile={props.openOutputAsFile} compact />
        )}
      </div>
    </section>
  );
}

function SecondarySidebar(props: {
  tab: SecondaryTab;
  setTab: (tab: SecondaryTab) => void;
  chatInput: string;
  setChatInput: (value: string) => void;
  chatMessages: ChatMessage[];
  chatThread: AiThread | null;
  chatThreads: AiThread[];
  askAgent: () => void;
  stopChat: () => void;
  regenerateMessage: (message: ChatMessage) => void;
  newChat: () => void;
  selectThread: (threadId: string) => void;
  renameThread: (threadId: string, title: string) => void;
  deleteThread: (threadId: string) => void;
  saveMessageAsArtifact: (message: ChatMessage) => void;
  rememberMessage: (message: ChatMessage) => void;
  previewEditFromMessage: (message: ChatMessage) => void;
  runQuickPrompt: (kind: QuickPromptKind) => void;
  pendingPatchPrompt: string | null;
  generatePatchPrompt: () => void;
  workspaceFileCount: number;
  aiStatus: { available: boolean; label: string; reason?: string };
  chatSettings: ChatAiSettings;
  chatTargets: ChatTarget[];
  selectedChatTarget: ChatTarget;
  selectChatTarget: (targetId: string) => void;
  openSettings: () => void;
  busy: boolean;
  memoryHitCount: number;
  outputs: OutputArtifact[];
  runAiSynthesis: () => void;
  captureManualCheck: () => void;
  openOutputAsFile: (output: OutputArtifact) => void;
  previewEditFromOutput: (output: OutputArtifact) => void;
  canPreviewEdit: boolean;
  clearOutputs: () => void;
  deleteArtifact: (id: string) => void;
  host: HostClient;
  setStatus: (status: string) => void;
  activeFile: WorkbenchFile | null;
  openEditors: WorkbenchFile[];
  attachSkillToChat: (skill: AtomekSkillSummary) => Promise<void>;
  saveLocalJobOutput: (title: string, body: string) => void;
  contextScope: ChatContextScope;
  setContextScope: (scope: ChatContextScope) => void;
  contextAttachments: ChatContextAttachment[];
  removeContextAttachment: (attachment: ChatContextAttachment) => void;
  revealContextAttachment: (attachment: ChatContextAttachment) => void;
  projectIndexSummary: string;
  projectIndexStale: boolean;
  refreshProjectIndex: () => void;
  onResizeStart: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onClose: () => void;
}) {
  return (
    <aside className="workbench-secondary">
      <div className="workbench-secondary-resizer" onPointerDown={props.onResizeStart} title="Resize Chat" />
      <div className="workbench-secondary-tabs">
        <div className="workbench-secondary-tab-group">
          <button className={`workbench-secondary-tab ${props.tab === 'chat' ? 'active' : ''}`} onClick={() => props.setTab('chat')}>CHAT</button>
          <button className={`workbench-secondary-tab ${props.tab === 'agents' ? 'active' : ''}`} onClick={() => props.setTab('agents')}>AGENTS</button>
          <button className={`workbench-secondary-tab ${props.tab === 'outputs' ? 'active' : ''}`} onClick={() => props.setTab('outputs')}>OUTPUTS</button>
        </div>
        <div className="workbench-secondary-actions">
          <button title="New Chat" onClick={props.newChat}><Plus size={15} /></button>
          <button title="Chat Settings" onClick={props.openSettings}><MoreHorizontal size={16} /></button>
          <button title="Close Chat" onClick={props.onClose}><X size={15} /></button>
        </div>
      </div>
      {props.tab === 'chat' ? (
        <ChatPane {...props} />
      ) : props.tab === 'agents' ? (
        <ControlTowerPane
          host={props.host}
          setStatus={props.setStatus}
          attachSkillToChat={props.attachSkillToChat}
          saveLocalJobOutput={props.saveLocalJobOutput}
          activeFile={props.activeFile}
          openEditors={props.openEditors}
          variant="dock"
        />
      ) : (
        <OutputsPane outputs={props.outputs} clearOutputs={props.clearOutputs} deleteArtifact={props.deleteArtifact} runAiSynthesis={props.runAiSynthesis} captureManualCheck={props.captureManualCheck} openOutputAsFile={props.openOutputAsFile} previewEditFromOutput={props.previewEditFromOutput} canPreviewEdit={props.canPreviewEdit} />
      )}
    </aside>
  );
}

function RichMessageBody({ body }: { body: string }) {
  const segments = useMemo(() => splitRichBody(body), [body]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = useCallback((key: string, code: string) => {
    void (async () => {
      const ok = await copyTextToClipboard(code);
      if (!ok) return;
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((current) => current === key ? null : current), 1200);
    })();
  }, []);

  return (
    <div className="workbench-rich-body">
      {segments.map((segment) => {
        if (segment.type === 'code') {
          const copied = copiedKey === segment.key;
          return (
            <div className="workbench-rich-code" key={segment.key}>
              <div className="workbench-rich-code-head">
                <span>{segment.language}</span>
                <button onClick={() => copyCode(segment.key, segment.body)} title="Copy code block">
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre><code>{segment.body}</code></pre>
            </div>
          );
        }
        return (
          <div
            key={segment.key}
            className="workbench-rich-markdown"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(segment.body) }}
          />
        );
      })}
    </div>
  );
}

function ChatPane(props: {
  chatInput: string;
  setChatInput: (value: string) => void;
  chatMessages: ChatMessage[];
  chatThread: AiThread | null;
  chatThreads: AiThread[];
  askAgent: () => void;
  stopChat: () => void;
  regenerateMessage: (message: ChatMessage) => void;
  selectThread: (threadId: string) => void;
  renameThread: (threadId: string, title: string) => void;
  deleteThread: (threadId: string) => void;
  saveMessageAsArtifact: (message: ChatMessage) => void;
  rememberMessage: (message: ChatMessage) => void;
  previewEditFromMessage: (message: ChatMessage) => void;
  runQuickPrompt: (kind: QuickPromptKind) => void;
  pendingPatchPrompt: string | null;
  generatePatchPrompt: () => void;
  workspaceFileCount: number;
  activeFile: WorkbenchFile | null;
  contextScope: ChatContextScope;
  setContextScope: (scope: ChatContextScope) => void;
  contextAttachments: ChatContextAttachment[];
  removeContextAttachment: (attachment: ChatContextAttachment) => void;
  revealContextAttachment: (attachment: ChatContextAttachment) => void;
  projectIndexSummary: string;
  projectIndexStale: boolean;
  refreshProjectIndex: () => void;
  aiStatus: { available: boolean; label: string; reason?: string };
  chatSettings: ChatAiSettings;
  chatTargets: ChatTarget[];
  selectedChatTarget: ChatTarget;
  selectChatTarget: (targetId: string) => void;
  openSettings: () => void;
  busy: boolean;
  memoryHitCount: number;
}) {
  const targetReady = props.selectedChatTarget.available;
  const isAtomekTarget = props.selectedChatTarget.kind === 'atomek-ai';
  const canSend = props.chatInput.trim().length > 0 && !props.busy && targetReady;
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const [stickToLatest, setStickToLatest] = useState(true);
  const [hasHiddenNewOutput, setHasHiddenNewOutput] = useState(false);
  const transcriptSignal = useMemo(() => props.chatMessages.map((message) => `${message.id}:${message.status ?? ''}:${message.body.length}`).join('|'), [props.chatMessages]);

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (!transcript) return;
    if (stickToLatest) {
      transcript.scrollTop = transcript.scrollHeight;
      setHasHiddenNewOutput(false);
    } else {
      setHasHiddenNewOutput(true);
    }
  }, [stickToLatest, transcriptSignal]);

  const handleTranscriptScroll = useCallback(() => {
    const transcript = transcriptRef.current;
    if (!transcript) return;
    const distanceFromBottom = transcript.scrollHeight - transcript.scrollTop - transcript.clientHeight;
    const atBottom = distanceFromBottom < 48;
    setStickToLatest(atBottom);
    if (atBottom) setHasHiddenNewOutput(false);
  }, []);

  const jumpToLatest = useCallback(() => {
    const transcript = transcriptRef.current;
    if (!transcript) return;
    transcript.scrollTop = transcript.scrollHeight;
    setStickToLatest(true);
    setHasHiddenNewOutput(false);
  }, []);

  const copyWholeMessage = useCallback((message: ChatMessage) => {
    void copyTextToClipboard(message.body);
  }, []);

  return (
    <div className="workbench-chat-wrap">
      <div className="workbench-chat-threadbar">
        {isAtomekTarget ? (
          <select
            value={props.chatThread?.id ?? ''}
            onChange={(event) => props.selectThread(event.target.value)}
            disabled={props.busy || props.chatThreads.length === 0}
            title="Select chat thread"
          >
            {props.chatThreads.length === 0 ? <option value="">No chats</option> : null}
            {props.chatThreads.map((thread) => (
              <option key={thread.id} value={thread.id}>
                {thread.title} · {formatThreadDate(thread.lastMessageAt ?? thread.updatedAt)}
              </option>
            ))}
          </select>
        ) : (
          <span className="workbench-chat-route-summary">{props.selectedChatTarget.label} session</span>
        )}
        <select
          value={props.selectedChatTarget.id}
          onChange={(event) => props.selectChatTarget(event.target.value)}
          disabled={props.busy}
          title="Select chat target"
        >
          {props.chatTargets.map((target) => (
            <option key={target.id} value={target.id} disabled={!target.available}>
              {target.label}{target.kind === 'pod-agent' && target.status !== 'running' ? ` · ${target.status}` : ''}
            </option>
          ))}
        </select>
        {isAtomekTarget ? (
          <>
            <button
              onClick={() => {
                if (!props.chatThread) return;
                const title = window.prompt('Rename chat', props.chatThread.title);
                if (title !== null) props.renameThread(props.chatThread.id, title);
              }}
              disabled={!props.chatThread || props.busy}
            >
              Rename
            </button>
            <button
              onClick={() => {
                if (!props.chatThread) return;
                if (window.confirm(`Delete chat "${props.chatThread.title}"?`)) props.deleteThread(props.chatThread.id);
              }}
              disabled={!props.chatThread || props.busy}
            >
              Delete
            </button>
          </>
        ) : null}
      </div>
      <div ref={transcriptRef} className="workbench-chat-transcript" onScroll={handleTranscriptScroll}>
        {props.chatMessages.length === 0 ? (
          <div className="workbench-chat-empty">
            <div>
              <MessageSquareText size={48} />
              <h3>Build with {props.selectedChatTarget.label}</h3>
              <p>{props.selectedChatTarget.kind === 'atomek-ai' ? 'Ask about open files, request a plan, or draft an artifact.' : 'Chat with the selected pod agent from this same Atomek panel.'}</p>
              <p className="workbench-chat-empty-link">{props.aiStatus.available ? props.aiStatus.label : props.aiStatus.reason ?? props.aiStatus.label}</p>
            </div>
          </div>
        ) : props.chatMessages.map((msg) => (
          <div key={msg.id} className={`workbench-chat-message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : msg.sourceLabel ?? 'Atomek'}</strong>
            {msg.status === 'streaming' ? <em> streaming</em> : null}
            {msg.status === 'error' ? <em> error</em> : null}
            <br />
            <RichMessageBody body={msg.body} />
            {msg.gatewayLabel ? <><br /><small>{msg.gatewayLabel}</small></> : null}
            {msg.role === 'assistant' && msg.status !== 'streaming' && msg.status !== 'error' ? (
              <div className="workbench-chat-message-actions">
                <button className="workbench-chat-message-action" onClick={() => copyWholeMessage(msg)} title="Copy this answer"><Copy size={12} /> Copy</button>
                <button className="workbench-chat-message-action" onClick={() => props.saveMessageAsArtifact(msg)} title="Save this answer as an output artifact"><FilePlus2 size={12} /> Save</button>
                <button className="workbench-chat-message-action" onClick={() => props.rememberMessage(msg)} title="Store this answer in Atomek memory"><GitBranch size={12} /> Remember</button>
                <button className="workbench-chat-message-action" onClick={() => props.previewEditFromMessage(msg)} disabled={props.workspaceFileCount === 0} title="Preview an editable patch from this answer"><Eye size={12} /> Preview</button>
                <button className="workbench-chat-message-action regen" onClick={() => props.regenerateMessage(msg)} disabled={props.busy} title="Regenerate this answer"><RefreshCcw size={12} /> Regenerate</button>
              </div>
            ) : null}
            {msg.role === 'assistant' && msg.status === 'error' ? (
              <div className="workbench-chat-message-actions">
                <button className="workbench-chat-message-action" onClick={() => copyWholeMessage(msg)} title="Copy this error"><Copy size={12} /> Copy</button>
                <button className="workbench-chat-message-action regen" onClick={() => props.regenerateMessage(msg)} disabled={props.busy}><RefreshCcw size={12} /> Retry</button>
              </div>
            ) : null}
          </div>
        ))}
        {hasHiddenNewOutput ? <button className="workbench-chat-jump" onClick={jumpToLatest}>Jump to latest</button> : null}
      </div>
      <div className="workbench-chat-composer">
        <div className="workbench-chat-tip">
          <span>Target</span>
          <strong>{props.selectedChatTarget.label}</strong>
          <em>{props.selectedChatTarget.kind === 'atomek-ai' ? chatSettingsSummary(props.chatSettings, props.aiStatus.label, props.memoryHitCount) : props.selectedChatTarget.description}</em>
          <span>Context</span>
          <strong>{contextScopeLabel(props.contextScope)}</strong>
        </div>
        <div className="workbench-chat-box">
          <div className="workbench-chat-attachments">
            <select
              className="workbench-chat-context-select"
              value={props.contextScope}
              onChange={(event) => props.setContextScope(event.target.value as ChatContextScope)}
              disabled={props.busy}
              title="Context scope for next message"
            >
              <option value="none">No context</option>
              <option value="active-selection">Selection</option>
              <option value="active-file">Active file</option>
              <option value="open-editors">Open editors</option>
              <option value="indexed-project">Indexed project</option>
            </select>
            {props.contextScope === 'indexed-project' ? (
              <>
                <button className="workbench-chat-chip-button" onClick={props.refreshProjectIndex} disabled={props.busy}>
                  <RefreshCcw size={12} /> Index
                </button>
                <span className={`workbench-chat-chip ${props.projectIndexStale ? 'warn' : 'muted'}`} title="Project index used for query-scoped retrieval">
                  <FileSearch size={13} /> {props.projectIndexSummary}{props.projectIndexStale ? ' · stale' : ''}
                </span>
              </>
            ) : null}
            {props.contextAttachments.length === 0 ? (
              <span className="workbench-chat-chip muted"><Paperclip size={13} /> No file context</span>
            ) : props.contextAttachments.map((attachment) => {
              const score = typeof attachment.score === 'number' ? attachment.score.toFixed(2) : null;
              const vectorScore = typeof attachment.vectorScore === 'number' ? attachment.vectorScore.toFixed(2) : null;
              const keywordScore = typeof attachment.keywordScore === 'number' ? attachment.keywordScore.toFixed(1) : null;
              const title = [
                attachment.path,
                attachment.range ? `${attachment.range.startLineNumber}:${attachment.range.startColumn}-${attachment.range.endLineNumber}:${attachment.range.endColumn}` : null,
                score ? `score ${score}` : null,
                vectorScore ? `vector ${vectorScore}` : null,
                keywordScore ? `keyword ${keywordScore}` : null,
                attachment.snippet,
                attachment.dirty ? 'dirty' : null,
              ].filter(Boolean).join(' · ');
              return (
                <span key={attachment.id} className="workbench-chat-chip" title={title}>
                  <button className="workbench-chat-chip-open" onClick={() => props.revealContextAttachment(attachment)} disabled={!attachment.fileId} title="Reveal context"><Paperclip size={13} /></button>
                  {attachment.label}
                  {score ? <small>{score}</small> : null}
                  {attachment.snippet ? <small>{attachment.snippet.slice(0, 60)}{attachment.snippet.length > 60 ? '…' : ''}</small> : null}
                  {attachment.dirty ? <small>dirty</small> : null}
                  {attachment.removable ? <button className="workbench-chat-chip-remove" onClick={() => props.removeContextAttachment(attachment)} title="Remove context"><X size={11} /></button> : null}
                </span>
              );
            })}
            <button className="workbench-chat-chip-button" onClick={() => props.runQuickPrompt('explain')} disabled={!props.activeFile || props.busy}>Explain</button>
            <button className="workbench-chat-chip-button" onClick={() => props.runQuickPrompt('improve')} disabled={!props.activeFile || props.busy}>Improve</button>
            <button className="workbench-chat-chip-button" onClick={() => props.runQuickPrompt('edit')} disabled={!props.activeFile || props.busy}>Edit</button>
            <button className="workbench-chat-chip-button" onClick={() => props.runQuickPrompt('draft')} disabled={props.busy}>Draft</button>
          </div>
          {props.pendingPatchPrompt ? (
            <button className="workbench-chat-generate-patch" onClick={props.generatePatchPrompt} disabled={props.busy}>
              Generate patch for last edit request
            </button>
          ) : null}
          <textarea
            className="workbench-chat-textarea"
            value={props.chatInput}
            onChange={(event) => props.setChatInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if (!props.busy) props.askAgent();
              }
            }}
            placeholder={props.selectedChatTarget.kind === 'atomek-ai' ? 'Ask Atomek about the open file or describe what to build...' : `Ask ${props.selectedChatTarget.label}…`}
            rows={3}
          />
          <div className="workbench-chat-toolbar compact">
            <span className="workbench-chat-route-summary">{props.selectedChatTarget.kind === 'atomek-ai' ? chatSettingsSummary(props.chatSettings, props.aiStatus.label, props.memoryHitCount) : props.selectedChatTarget.description}</span>
            <span />
            {props.busy ? (
              <button className="workbench-chat-send stop" onClick={props.stopChat} title="Stop"><Square size={14} /></button>
            ) : (
              <button className={`workbench-chat-send ${canSend ? 'ready' : ''}`} onClick={props.askAgent} title="Send" disabled={!canSend} aria-label="Send message"><Send size={16} /></button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function chatGatewayLabel(preference: ChatGatewayPreference): string {
  if (preference === 'remote') return 'Remote AIL';
  if (preference === 'local') return 'Local AIL';
  return 'Auto';
}

function chatSettingsSummary(settings: ChatAiSettings, statusLabel: string, memoryHitCount: number): string {
  void settings.model;
  const routing = settings.gatewayPreference === 'auto'
    ? statusLabel
    : chatGatewayLabel(settings.gatewayPreference);
  const parts = [routing];
  if (memoryHitCount > 0) parts.push(`${memoryHitCount} memories`);
  return parts.join(' · ');
}

function formatThreadDate(ts: number): string {
  if (!Number.isFinite(ts) || ts <= 0) return 'new';
  return new Date(ts).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function looksEditable(body: string): boolean {
  return /```(?:diff|patch)\b/i.test(body)
    || /^diff --git /m.test(body)
    || /^--- .+\n\+\+\+ /m.test(body)
    || /```[\w.+-]*\s*\n[\s\S]{80,}```/.test(body);
}

function looksLikeEditPrompt(prompt: string): boolean {
  return /\b(change|edit|modify|replace|update|rename|fix|rewrite|apply)\b/i.test(prompt)
    && /\b(file|code|author|title|line|function|component|content|text|this|it)\b/i.test(prompt);
}

function editPromptWithPatchInstructions(prompt: string): string {
  return [
    prompt,
    'Atomek edit instruction: if this request should change an open file, return an applicable git-style unified diff in a fenced diff block. Use paths exactly as shown in the attached context. If one whole-file replacement is safer, return a fenced atomek-replace block. Do not claim a file changed unless you provide a patch/replacement Atomek can preview.',
  ].join('\n\n');
}


function AppUpdatePanel({ host, appName, currentVersion }: { host: HostClient & { apps?: AppUpdateApi }; appName: string; currentVersion: string }) {
  const apps = host.apps;
  const [status, setStatus] = useState<AppUpdateStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const check = useCallback(async () => {
    if (!apps?.checkUpdate) {
      setMessage('Update checks need a newer Tytus OS build.');
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const next = await apps.checkUpdate();
      setStatus(next);
      if (next.error) setMessage(next.error);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }, [apps]);

  useEffect(() => {
    void check();
  }, [check]);

  const update = useCallback(async () => {
    if (!apps?.updateSelf) {
      setMessage('Update needs a newer Tytus OS build.');
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const next = await apps.updateSelf();
      setStatus(next);
      setMessage(next.error ?? `${appName} updated. Close and reopen the app to load the new bundle.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }, [apps, appName]);

  const latest = status?.latestVersion ?? currentVersion;
  const updateAvailable = Boolean(status?.updateAvailable);

  return (
    <div className="workbench-settings-section">
      <h3>App version</h3>
      <p>Installed v{status?.currentVersion ?? currentVersion}. Latest available v{latest}.</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="workbench-button-subtle" onClick={() => void check()} disabled={busy}>
          <RefreshCcw size={14} />{busy ? 'Checking…' : 'Check for update'}
        </button>
        {updateAvailable ? (
          <button className="workbench-button-primary" onClick={() => void update()} disabled={busy}>
            {busy ? 'Updating…' : `Update ${appName}`}
          </button>
        ) : null}
      </div>
      <div className="workbench-settings-note">
        {message ?? (status ? (updateAvailable ? 'Update available.' : 'You are running the latest available version.') : 'Checking latest version…')}
      </div>
    </div>
  );
}

function AtomekSettingsPane(props: {
  host: HostClient;
  chatSettings: ChatAiSettings;
  onChange: (settings: ChatAiSettings) => void;
  onClose: () => void;
}) {
  const [models, setModels] = useState<Array<{ id: string; gatewayLabel: string }>>([]);
  const [modelsStatus, setModelsStatus] = useState('Loading gateway models…');
  const [embeddingModels, setEmbeddingModels] = useState<Array<{ id: string; gatewayLabel: string }>>([]);
  const [embeddingStatus, setEmbeddingStatus] = useState('Checking embedding capability…');

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      if (!props.host.ai?.listModels) {
        setModels([]);
        setModelsStatus('This Tytus build does not expose model discovery yet.');
        return;
      }
      setModelsStatus('Loading gateway models…');
      try {
        const found = await props.host.ai.listModels({
          gatewayPreference: props.chatSettings.gatewayPreference,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        setModels(found.map((model) => ({ id: model.id, gatewayLabel: model.gatewayLabel })));
        setModelsStatus(found.length > 0 ? `${found.length} models discovered from AIL.` : 'No models discovered. You can still enter any AIL alias manually.');
      } catch (err) {
        if (controller.signal.aborted) return;
        setModels([]);
        setModelsStatus(`Model discovery failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    void load();
    return () => controller.abort();
  }, [props.chatSettings.gatewayPreference, props.host.ai]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      const unavailable = embeddingUnavailableReason(props.host);
      if (unavailable) {
        setEmbeddingModels([]);
        setEmbeddingStatus(unavailable);
        return;
      }
      setEmbeddingStatus('Loading embedding-capable models from AIL…');
      try {
        const found = await listEmbeddingModels(props.host, {
          gatewayPreference: props.chatSettings.gatewayPreference,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        setEmbeddingModels(found.map((model) => ({ id: model.id, gatewayLabel: model.gatewayLabel ?? model.source ?? 'AIL' })));
        setEmbeddingStatus(found.length > 0 ? `${found.length} embedding models discovered from AIL metadata.` : 'AIL embedding API is present, but no embedding-capable model metadata was returned.');
      } catch (err) {
        if (controller.signal.aborted) return;
        setEmbeddingModels([]);
        setEmbeddingStatus(`Embedding model discovery failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    void load();
    return () => controller.abort();
  }, [props.chatSettings.gatewayPreference, props.host]);

  const setGatewayPreference = (gatewayPreference: ChatGatewayPreference) => {
    props.onChange({ ...props.chatSettings, gatewayPreference });
  };
  const setModel = (model: string) => {
    props.onChange({ ...props.chatSettings, model });
  };
  const setEmbeddingModel = (embeddingModel: string) => {
    props.onChange({ ...props.chatSettings, embeddingModel });
  };

  return (
    <div className="workbench-settings-tab">
      <section className="workbench-settings-page" aria-label="Atomek Settings">
        <header className="workbench-settings-header">
          <SlidersHorizontal size={15} />
          <strong>Atomek Settings</strong>
          <span style={{ fontSize: 11, color: 'var(--accent-primary)', border: '1px solid color-mix(in srgb, var(--accent-primary) 40%, transparent)', borderRadius: 999, padding: '2px 7px', fontWeight: 800 }}>v{APP_VERSION}</span>
          <button onClick={props.onClose} title="Close"><X size={15} /></button>
        </header>
        <div className="workbench-settings-body">
          <AppUpdatePanel host={props.host as HostClient & { apps?: AppUpdateApi }} appName="Atomek" currentVersion={APP_VERSION} />
          <div className="workbench-settings-section">
            <h3>Chat AI routing</h3>
            <p>
              Choose which AIL gateway Atomek uses. Model names are not hardcoded here:
              enter an AIL alias/model from your global gateway config, or leave it empty for the gateway default.
            </p>
            <label className="workbench-settings-label">
              Gateway
              <select
                value={props.chatSettings.gatewayPreference}
                onChange={(event) => setGatewayPreference(event.target.value as ChatGatewayPreference)}
              >
                <option value="auto">Auto failover</option>
                <option value="remote">Remote Tytus AIL only</option>
                <option value="local">Local AIL only</option>
              </select>
            </label>
            <label className="workbench-settings-label">
              Chat model alias
              <input
                value={props.chatSettings.model}
                onChange={(event) => setModel(event.target.value)}
                list="atomek-chat-models"
                placeholder="Empty = AIL default/global alias"
                spellCheck={false}
              />
              <datalist id="atomek-chat-models">
                {models.map((model) => (
                  <option key={`${model.gatewayLabel}:${model.id}`} value={model.id}>{model.gatewayLabel}</option>
                ))}
              </datalist>
            </label>
            <div className="workbench-settings-note">
              Current request: {chatGatewayLabel(props.chatSettings.gatewayPreference)}
              {props.chatSettings.model.trim() ? ` · ${props.chatSettings.model.trim()}` : ' · gateway default'}
            </div>
            <div className="workbench-settings-note">
              {modelsStatus}
            </div>
          </div>
          <div className="workbench-settings-section">
            <h3>Project context / embeddings</h3>
            <p>
              Atomek keeps retrieval model selection dynamic. Leave empty for AIL global defaults, or pin an AIL embedding alias exposed by your gateway.
            </p>
            <label className="workbench-settings-label">
              Embedding model alias
              <input
                value={props.chatSettings.embeddingModel}
                onChange={(event) => setEmbeddingModel(event.target.value)}
                list="atomek-embedding-models"
                placeholder="Empty = AIL embedding default/global alias"
                spellCheck={false}
              />
              <datalist id="atomek-embedding-models">
                {embeddingModels.map((model) => (
                  <option key={`${model.gatewayLabel}:${model.id}`} value={model.id}>{model.gatewayLabel}</option>
                ))}
              </datalist>
            </label>
            <div className="workbench-settings-note">
              {props.chatSettings.embeddingModel.trim() ? `Embedding alias: ${props.chatSettings.embeddingModel.trim()}` : 'Embedding alias: gateway default'}
            </div>
            <div className="workbench-settings-note">
              {embeddingStatus}
            </div>
          </div>
        </div>
        <footer className="workbench-settings-footer">
          <button onClick={() => props.onChange(DEFAULT_CHAT_AI_SETTINGS)}>Reset</button>
          <button onClick={props.onClose}>Close tab</button>
        </footer>
      </section>
    </div>
  );
}

function OutputsPane({ outputs, clearOutputs, deleteArtifact, runAiSynthesis, captureManualCheck, openOutputAsFile, previewEditFromOutput, canPreviewEdit = false, compact = false }: { outputs: OutputArtifact[]; clearOutputs: () => void; deleteArtifact: (id: string) => void; runAiSynthesis: () => void; captureManualCheck: () => void; openOutputAsFile: (output: OutputArtifact) => void; previewEditFromOutput?: (output: OutputArtifact) => void; canPreviewEdit?: boolean; compact?: boolean }) {
  return (
    <div className={`workbench-panel-list ${compact ? 'compact' : ''}`}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <button className="workbench-button-subtle" onClick={runAiSynthesis}><Bot size={14} />AI synthesis</button>
        <button className="workbench-button-subtle" onClick={captureManualCheck}><Bug size={14} />Capture check</button>
        <button className="workbench-button-subtle" onClick={clearOutputs}>Clear</button>
      </div>
      {outputs.length === 0 ? <p className="workbench-muted">No outputs yet. Save an AI answer as an artifact or create an AI synthesis.</p> : outputs.map((output) => (
        <div key={output.id} className="workbench-output-card">
          <div className="workbench-output-head">
            <strong>{output.title}</strong>
            <span>{output.source === 'ai' ? `AI · ${output.kind}` : output.kind}</span>
            <button onClick={() => void copyTextToClipboard(output.body)}>Copy</button>
            <button onClick={() => openOutputAsFile(output)}>Open as file</button>
            {previewEditFromOutput ? (
              <button
                className={looksEditable(output.body) ? 'workbench-output-edit-cta' : undefined}
                onClick={() => previewEditFromOutput(output)}
                disabled={!canPreviewEdit}
              >
                {looksEditable(output.body) ? 'Preview/apply edit' : 'Preview edit'}
              </button>
            ) : null}
            {output.source === 'ai' ? <button onClick={() => deleteArtifact(output.id)}>Delete</button> : null}
          </div>
          <RichMessageBody body={output.body} />
        </div>
      ))}
    </div>
  );
}

function EditReviewDialog({ edit, onApply, onOpenAsFile, onClose }: { edit: PendingEdit; onApply: () => void; onOpenAsFile: () => void; onClose: () => void }) {
  return (
    <div className="workbench-edit-review-overlay" role="dialog" aria-label="Review AI edit">
      <section className="workbench-edit-review">
        <header className="workbench-edit-review-head">
          <div>
            <strong>Review AI edit</strong>
            <span>{edit.fileName}</span>
          </div>
          <button title="Close" onClick={onClose}><X size={16} /></button>
        </header>
        <div className="workbench-edit-review-meta">
          <span>Source: {edit.sourceTitle}</span>
          <span>{edit.extractionLabel}</span>
          <span>+{edit.stats.added} / -{edit.stats.removed} / ~{edit.stats.changed}</span>
        </div>
        <div className="workbench-edit-review-grid">
          <div className="workbench-edit-review-pane">
            <h4>Current</h4>
            <pre>{edit.originalContent}</pre>
          </div>
          <div className="workbench-edit-review-pane proposed">
            <h4>Proposed</h4>
            <pre>{edit.proposedContent}</pre>
          </div>
        </div>
        <footer className="workbench-edit-review-actions">
          <button className="workbench-button-subtle" onClick={onClose}>Cancel</button>
          <button className="workbench-button-subtle" onClick={onOpenAsFile}>Open proposed as file</button>
          <button className="workbench-button-primary" onClick={onApply}>Apply to active file</button>
        </footer>
      </section>
    </div>
  );
}

function WorkspacePatchReviewDialog({ patch, onApply, onOpenAsFiles, onClose }: { patch: PendingWorkspacePatch; onApply: () => void; onOpenAsFiles: () => void; onClose: () => void }) {
  const totals = patch.edits.reduce((acc, edit) => ({
    added: acc.added + edit.stats.added,
    removed: acc.removed + edit.stats.removed,
    changed: acc.changed + edit.stats.changed,
  }), { added: 0, removed: 0, changed: 0 });
  return (
    <div className="workbench-edit-review-overlay" role="dialog" aria-label="Review AI workspace patch">
      <section className="workbench-edit-review workspace">
        <header className="workbench-edit-review-head">
          <div>
            <strong>Review AI workspace patch</strong>
            <span>{patch.sourceTitle}</span>
          </div>
          <button title="Close" onClick={onClose}><X size={16} /></button>
        </header>
        <div className="workbench-edit-review-meta">
          <span>{patch.edits.length} files</span>
          <span>+{totals.added} / -{totals.removed} / ~{totals.changed}</span>
          {patch.skipped.length > 0 ? <span>{patch.skipped.length} skipped</span> : null}
        </div>
        <div className="workbench-workspace-patch-list">
          {patch.edits.map((edit) => (
            <article key={edit.fileId} className="workbench-workspace-patch-card">
              <header>
                <strong>{edit.fileName}</strong>
                <span>{edit.extractionLabel} · +{edit.stats.added} / -{edit.stats.removed} / ~{edit.stats.changed}</span>
              </header>
              <pre>{previewPatchContent(edit.proposedContent)}</pre>
            </article>
          ))}
          {patch.skipped.length > 0 ? (
            <article className="workbench-workspace-patch-card skipped">
              <header>
                <strong>Skipped</strong>
                <span>Paths not open or hunks did not match</span>
              </header>
              <pre>{patch.skipped.join('\n')}</pre>
            </article>
          ) : null}
        </div>
        <footer className="workbench-edit-review-actions">
          <button className="workbench-button-subtle" onClick={onClose}>Cancel</button>
          <button className="workbench-button-subtle" onClick={onOpenAsFiles}>Open proposals as files</button>
          <button className="workbench-button-primary" onClick={onApply}>Apply workspace patch</button>
        </footer>
      </section>
    </div>
  );
}


function clipForLocalAgent(value: string, max = 9_000): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}\n\n[Atomek clipped ${value.length - max} chars for local agent context]`;
}

function buildLocalAgentContext(activeFile: WorkbenchFile | null, openEditors: WorkbenchFile[]): string {
  const lines: string[] = [
    'Atomek local agent context:',
    '- You are being launched from Atomek, the TytusOS workspace/chat app.',
    '- Do not write files directly. Return findings, markdown, unified diffs, or fenced replacement blocks. Atomek previews edits before applying.',
  ];
  if (activeFile) {
    lines.push('', `Active file: ${activeFile.path}`, `Language: ${activeFile.language}`, `Dirty: ${activeFile.dirty ? 'yes' : 'no'}`, '', 'Active file content:', '```' + activeFile.language, clipForLocalAgent(activeFile.content), '```');
  } else if (openEditors.length > 0) {
    lines.push('', `Open editors (${openEditors.length}):`);
    for (const file of openEditors.slice(0, 8)) lines.push(`- ${file.path} (${file.language}, ${file.content.length} chars${file.dirty ? ', dirty' : ''})`);
  } else {
    lines.push('', 'No file is open. Ask clarifying questions only if the prompt cannot be answered safely.');
  }
  return lines.join('\n');
}

function cwdForLocalAgent(activeFile: WorkbenchFile | null): string | undefined {
  if (!activeFile?.path.startsWith('/')) return undefined;
  const slash = activeFile.path.lastIndexOf('/');
  return slash > 0 ? activeFile.path.slice(0, slash) : undefined;
}

function actionLabelForTool(tool: AtomekLocalTool): string {
  if (tool.kind === 'terminal') return 'Open shell';
  return `Open ${tool.label} in Terminal`;
}

function backgroundJobLabelForTool(tool: AtomekLocalTool, runningToolId: string | null): string {
  if (runningToolId === tool.id) return `${tool.label} running…`;
  return 'Background review';
}

function extractOpenAiModelId(payload: unknown): string | null {
  const data = payload as { data?: Array<{ id?: unknown }> };
  const first = data.data?.find((item) => typeof item.id === 'string' && item.id.trim());
  return typeof first?.id === 'string' ? first.id : null;
}

function extractOpenAiAssistantText(payload: unknown): string {
  const value = payload as {
    choices?: Array<{
      message?: { content?: unknown };
      text?: unknown;
      delta?: { content?: unknown };
    }>;
  };
  const choice = value.choices?.[0];
  const content = choice?.message?.content ?? choice?.text ?? choice?.delta?.content;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map((part) => {
      if (typeof part === 'string') return part;
      if (part && typeof part === 'object' && 'text' in part && typeof (part as { text?: unknown }).text === 'string') return (part as { text: string }).text;
      return '';
    }).join('');
  }
  return JSON.stringify(payload, null, 2);
}

function ControlTowerPane({
  host,
  setStatus,
  attachSkillToChat,
  saveLocalJobOutput,
  activeFile,
  openEditors,
  variant = 'sidebar',
}: {
  host: HostClient;
  setStatus: (status: string) => void;
  attachSkillToChat: (skill: AtomekSkillSummary) => Promise<void>;
  saveLocalJobOutput: (title: string, body: string) => void;
  activeFile: WorkbenchFile | null;
  openEditors: WorkbenchFile[];
  variant?: 'sidebar' | 'dock';
}) {
  const [tools, setTools] = useState<AtomekLocalTool[]>([]);
  const [skills, setSkills] = useState<AtomekSkillSummary[]>([]);
  const [resourceGraph, setResourceGraph] = useState<TytusResourceGraph | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobPrompt, setJobPrompt] = useState('Review the active Atomek context. Return concise findings. If you propose edits, output a unified diff or fenced replacement blocks so Atomek can preview before applying.');
  const [runningToolId, setRunningToolId] = useState<string | null>(null);
  const [agentRuns, setAgentRuns] = useState<LocalAgentRunState[]>([]);
  const [mission, setMission] = useState<MissionFolderState | null>(() => readCurrentMission());
  const [missionList, setMissionList] = useState<TytusMissionSummary[]>([]);
  const [missionAudit, setMissionAudit] = useState<MissionAuditEvent[]>([]);
  const [missionRuns, setMissionRuns] = useState<TytusMissionRun[]>([]);
  const missionRunsRef = useRef<TytusMissionRun[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('task-execute');
  const [teamView, setTeamView] = useState<'mission' | 'runs' | 'setup'>('mission');
  const activeRun = agentRuns.find((run) => run.status === 'running' || run.status === 'canceling') ?? agentRuns[0] ?? null;
  const isDock = variant === 'dock';
  const missionPreset = useMemo(() => buildTeamPresetPreview(resourceGraph, pickTeamPresetId(jobPrompt || mission?.goal || '', resourceGraph, mission?.teamPresetId)), [jobPrompt, mission?.goal, mission?.teamPresetId, resourceGraph]);
  const missionTasks = useMemo(() => buildMissionTasks(jobPrompt || mission?.goal || '', resourceGraph, missionPreset.id), [jobPrompt, mission?.goal, missionPreset.id, resourceGraph]);
  const selectedTask = missionTasks.find((task) => task.id === selectedTaskId) ?? missionTasks[1] ?? missionTasks[0] ?? null;
  const dirtyCount = openEditors.filter((file) => file.dirty).length;
  const contextSummary = activeFile
    ? `${activeFile.path} · ${activeFile.language} · ${activeFile.content.length.toLocaleString()} chars${activeFile.dirty ? ' · dirty' : ''}`
    : openEditors.length > 0
      ? `${openEditors.length} open editor${openEditors.length === 1 ? '' : 's'}${dirtyCount ? ` · ${dirtyCount} dirty` : ''}`
      : 'No active file — jobs run with only your typed prompt.';
  const jobPresets = useMemo(() => [
    {
      label: 'Review active file',
      prompt: 'Review the active file for bugs, missing edge cases, confusing UX, and production risks. Return prioritized findings with exact file/line references when possible.',
    },
    {
      label: 'Plan patch',
      prompt: 'Propose the smallest safe patch for the active Atomek context. Output a unified diff only if you are confident; otherwise list the exact files/functions to change.',
    },
    {
      label: 'Explain architecture',
      prompt: 'Explain how the active file/context fits into the TytusOS/Atomek architecture. Point out any integration seams that do not make sense.',
    },
  ], []);

  useEffect(() => {
    missionRunsRef.current = missionRuns;
  }, [missionRuns]);

  const loadMissionRuns = useCallback(async (target: MissionFolderState | null = mission) => {
    if (!target?.rootPath || !host.missions?.listRuns) {
      setMissionRuns([]);
      return [];
    }
    try {
      const runs = await host.missions.listRuns(target.rootPath);
      setMissionRuns(runs);
      missionRunsRef.current = runs;
      return runs;
    } catch (err) {
      setStatus(`Mission run history failed: ${err instanceof Error ? err.message : String(err)}`);
      return [];
    }
  }, [host.missions, mission, setStatus]);

  const writeMissionRunIndex = useCallback(async (target: MissionFolderState | null, runs: TytusMissionRun[]) => {
    if (!target) return;
    const sorted = [...runs].sort((a, b) => missionRunSortValue(b).localeCompare(missionRunSortValue(a))).slice(0, 100);
    const content = sorted.map((run) => JSON.stringify(run)).join('\n') + (sorted.length ? '\n' : '');
    if (target.rootPath && host.missions?.write) {
      await host.missions.write({ rootPath: target.rootPath, files: [{ path: 'RUNS.jsonl', content }] });
    } else if (target.handle) {
      await writeTextToDirectory(target.handle, 'RUNS.jsonl', content);
    }
    setMissionRuns(sorted);
    missionRunsRef.current = sorted;
  }, [host.missions]);

  const upsertMissionRun = useCallback(async (record: TytusMissionRun, target: MissionFolderState | null = mission) => {
    if (!target) return;
    const next = [
      record,
      ...missionRunsRef.current.filter((run) => run.id !== record.id),
    ];
    await writeMissionRunIndex(target, next);
  }, [mission, writeMissionRunIndex]);

  const load = useCallback(async () => {
    if (!host.local?.listTools && !host.skills?.list && !host.resources?.list) {
      setTools([]);
      setSkills([]);
      setResourceGraph(null);
      setError('This Tytus host build does not expose local tools, resource graph, or skill registry yet.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [toolList, skillList, graph, missions] = await Promise.all([
        host.local?.listTools?.().catch((err) => {
          setStatus(`Local tool discovery failed: ${err instanceof Error ? err.message : String(err)}`);
          return [] as AtomekLocalTool[];
        }) ?? Promise.resolve([] as AtomekLocalTool[]),
        host.skills?.list?.().catch((err) => {
          setStatus(`Skill registry discovery failed: ${err instanceof Error ? err.message : String(err)}`);
          return [] as AtomekSkillSummary[];
        }) ?? Promise.resolve([] as AtomekSkillSummary[]),
        host.resources?.list?.().catch((err) => {
          setStatus(`Resource graph discovery failed: ${err instanceof Error ? err.message : String(err)}`);
          return null;
        }) ?? Promise.resolve(null),
        host.missions?.list?.().catch((err) => {
          setStatus(`Mission list failed: ${err instanceof Error ? err.message : String(err)}`);
          return [] as TytusMissionSummary[];
        }) ?? Promise.resolve([] as TytusMissionSummary[]),
      ]);
      setTools(toolList as AtomekLocalTool[]);
      setSkills(skillList as AtomekSkillSummary[]);
      setResourceGraph(graph);
      setMissionList(missions as TytusMissionSummary[]);
      if (mission?.rootPath) void loadMissionRuns(mission);
      setStatus(`Agent team loaded · ${toolList.length} tools · ${skillList.length} skills · ${(missions as TytusMissionSummary[]).length} missions${graph ? ` · ${graph.resources.length} resources` : ''}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [host.local, host.missions, host.resources, host.skills, loadMissionRuns, mission, setStatus]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onMission = (event: Event) => {
      const detail = (event as CustomEvent<MissionFolderState>).detail;
      if (detail?.missionId) {
        setMission(detail);
        void loadMissionRuns(detail);
      }
      void load();
    };
    window.addEventListener(CURRENT_MISSION_EVENT, onMission);
    return () => window.removeEventListener(CURRENT_MISSION_EVENT, onMission);
  }, [load, loadMissionRuns]);

  const resumeMission = useCallback((summary: TytusMissionSummary) => {
    const next = missionStateFromSummary(summary);
    setMission(next);
    saveCurrentMission(next);
    void loadMissionRuns(next);
    setMissionAudit([{
      ts: new Date().toISOString(),
      kind: 'mission.resume',
      message: `Mission resumed from Atomek agent team: ${next.rootPath ?? next.name}`,
      data: { runCount: summary.runCount ?? 0, taskCount: summary.taskCount ?? 0 },
    }]);
    setJobPrompt(summary.goal || `Continue mission ${summary.title}. Review MISSION.md, TASKS.md, RESOURCES.md, and runs/ before acting.`);
    setStatus(`Resumed mission: ${summary.rootPath}`);
  }, [loadMissionRuns, setStatus]);

  const writeMissionPack = useCallback(async (target: MissionFolderState, prompt: string, extraEvents: MissionAuditEvent[] = []) => {
    const nextAudit = [
      ...missionAudit,
      ...extraEvents,
      { ts: new Date().toISOString(), kind: 'mission.pack.write', message: 'Mission context pack written from Atomek' },
    ];
    const selectedPresetId = pickTeamPresetId(prompt || target.goal, resourceGraph, target.teamPresetId);
    const tasks = buildMissionTasks(prompt || target.goal, resourceGraph, selectedPresetId);
    const files = [
      { path: 'MISSION.md', content: buildMissionMarkdown(target, resourceGraph, activeFile, openEditors, prompt, selectedPresetId) },
      { path: 'MISSION.json', content: buildMissionJson(target, resourceGraph, prompt, selectedPresetId) },
      { path: 'RESOURCES.md', content: buildResourcesMarkdown(resourceGraph) },
      { path: 'TASKS.md', content: buildTasksMarkdown(tasks) },
      { path: 'HANDOFF.md', content: buildHandoffMarkdown(target) },
      { path: 'INBOX.md', content: '# Mission inbox\n\nDrop incoming agent notes, pod outputs, and shared-folder discoveries here.\n' },
      { path: 'OUTBOX.md', content: '# Mission outbox\n\nApproved handoffs, final artifacts, and user-ready summaries go here.\n' },
      { path: 'AUDIT.jsonl', content: nextAudit.map((event) => JSON.stringify(event)).join('\n') + '\n' },
      { path: 'RUNS.jsonl', content: missionRunsRef.current.map((run) => JSON.stringify(run)).join('\n') + (missionRunsRef.current.length ? '\n' : '') },
      { path: 'runs/README.md', content: '# Mission runs\n\nLocal, pod, and app run transcripts land here.\n' },
      { path: 'outputs/README.md', content: '# Mission outputs\n\nFinal artifacts and generated files land here before handoff.\n' },
      { path: 'proposals/README.md', content: '# Mission proposals\n\nPatch/write/publish proposals land here before approval.\n' },
      { path: 'approvals/README.md', content: '# Mission approvals\n\nApproval and rejection decisions reference proposal files from here.\n' },
    ];
    if (target.rootPath && host.missions?.write) {
      await host.missions.write({ rootPath: target.rootPath, files });
    } else if (target.handle) {
      await ensureDirectory(target.handle, 'runs');
      await ensureDirectory(target.handle, 'outputs');
      await ensureDirectory(target.handle, 'proposals');
      await ensureDirectory(target.handle, 'approvals');
      for (const file of files) await writeMissionFileToBrowserDirectory(target.handle, file.path, file.content);
    } else {
      throw new Error('Mission has neither tray rootPath nor browser folder handle');
    }
    setMissionAudit(nextAudit);
    saveCurrentMission(target);
  }, [activeFile, host.missions, missionAudit, openEditors, resourceGraph]);

  const ensureMissionPack = useCallback(async (prompt: string, options: { allowBrowserPicker?: boolean } = {}): Promise<MissionFolderState | null> => {
    if (mission) {
      await writeMissionPack(mission, prompt);
      return mission;
    }
    const title = `Atomek mission ${new Date().toLocaleString()}`;
    const goal = prompt.trim() || 'Coordinate Tytus resources for the current Atomek task.';
    let nextMission: MissionFolderState | null = null;
    if (host.missions?.create) {
      const created: TytusMission = await host.missions.create({ title, goal });
      nextMission = {
        missionId: created.missionId,
        title: created.title,
        goal: created.goal,
        rootPath: created.rootPath,
        name: created.rootPath.split('/').pop() || created.missionId,
        source: 'tray',
      };
    } else if (options.allowBrowserPicker) {
      const handle = await pickWritableDirectory();
      if (!handle) {
        setStatus('Mission folder picker unavailable in this browser context');
        return null;
      }
      nextMission = {
        handle,
        name: handle.name,
        missionId: `mission-${Date.now()}-${missionSlug(handle.name)}`,
        title,
        goal,
        source: 'browser',
      };
    }
    if (!nextMission) return null;
    const event = { ts: new Date().toISOString(), kind: 'mission.folder.ready', message: `Mission folder ready: ${nextMission.rootPath ?? nextMission.name}` };
    setMission(nextMission);
    saveCurrentMission(nextMission);
    setMissionAudit([event]);
    await writeMissionPack(nextMission, goal, [event]);
    setStatus(`Mission pack ready in ${nextMission.rootPath ?? nextMission.name}`);
    return nextMission;
  }, [host.missions, mission, setStatus, writeMissionPack]);

  const openToolInTerminal = useCallback(async (tool: AtomekLocalTool) => {
    if (!host.local?.openTerminal) {
      setStatus('Terminal bridge unavailable in this host build');
      return;
    }
    try {
      const prompt = jobPrompt.trim() || `Open ${tool.label} from Atomek with current context.`;
      const launchMission = tool.kind === 'ai-cli'
        ? await ensureMissionPack(prompt)
        : mission;
      await host.local.openTerminal({
        toolId: tool.id,
        command: tool.command,
        cwd: launchMission?.rootPath ?? cwdForLocalAgent(activeFile),
        prompt: launchMission
          ? `Atomek mission pack ready at ${launchMission.rootPath ?? launchMission.name}. Read MISSION.md and RESOURCES.md. ${contextSummary}`
          : `Opened from Atomek. ${contextSummary}`,
      });
      setStatus(tool.kind === 'ai-cli'
        ? `Started ${tool.label} in a fresh Tytus Terminal with mission context.`
        : 'Opened Tytus Terminal');
    } catch (err) {
      setStatus(`Terminal launch failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [activeFile, contextSummary, ensureMissionPack, host.local, jobPrompt, mission, setStatus]);

  const selectMissionFolder = useCallback(async () => {
    try {
      const nextMission = await ensureMissionPack(jobPrompt.trim(), { allowBrowserPicker: true });
      if (!nextMission) setStatus('Mission folder setup skipped.');
    } catch (err) {
      setStatus(`Mission folder setup failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [ensureMissionPack, jobPrompt, setStatus]);

  const saveRunTranscriptToMission = useCallback(async (tool: AtomekLocalTool, body: string, code: number, targetMission: MissionFolderState | null = mission, preferredRelPath?: string) => {
    if (!targetMission) return;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const relPath = preferredRelPath ?? `runs/${stamp}-${tool.id}.md`;
    const fileName = relPath.split('/').pop() || `${stamp}-${tool.id}.md`;
    if (targetMission.rootPath && host.missions?.write) {
      await host.missions.write({ rootPath: targetMission.rootPath, files: [{ path: relPath, content: body }] });
    } else if (targetMission.handle) {
      const runsDir = await ensureDirectory(targetMission.handle, 'runs');
      await writeTextToDirectory(runsDir, fileName, body);
    }
    await writeMissionPack(targetMission, jobPrompt, [{
      ts: new Date().toISOString(),
      kind: 'local-cli.run.complete',
      message: `${tool.label} exited ${code}; transcript saved to ${relPath}`,
      data: { toolId: tool.id, exitCode: code, transcript: relPath },
    }]);
  }, [host.missions, jobPrompt, mission, writeMissionPack]);

  const runLocalJob = useCallback(async (tool: AtomekLocalTool) => {
    if (!host.local?.runJob || !host.local?.streamJob) {
      setStatus('Local job runner unavailable in this host build');
      return;
    }
    const prompt = jobPrompt.trim();
    if (!prompt) {
      setStatus('Local job prompt is empty');
      return;
    }
    let launchMission: MissionFolderState | null = null;
    try {
      launchMission = await ensureMissionPack(prompt);
      if (launchMission) {
        await writeMissionPack(launchMission, prompt, [{
          ts: new Date().toISOString(),
          kind: 'local-cli.run.start',
          message: `${tool.label} background review started`,
          data: { toolId: tool.id, taskId: selectedTask?.id ?? 'manual', taskTitle: selectedTask?.title ?? 'Manual run' },
        }]);
      }
    } catch (err) {
      setStatus(`Mission pack failed before local job start: ${err instanceof Error ? err.message : String(err)}`);
      return;
    }
    setRunningToolId(tool.id);
    const runId = `local-run-${Date.now()}-${tool.id}`;
    const startedAt = isoNow();
    setAgentRuns((runs) => [{
      id: runId,
      toolId: tool.id,
      label: tool.label,
      status: 'running' as const,
      startedAt: Date.now(),
      taskId: selectedTask?.id ?? 'manual',
      taskTitle: selectedTask?.title ?? 'Manual run',
      lines: [`[Atomek] Starting ${tool.label} local job for ${selectedTask?.title ?? 'manual run'}…`],
    }, ...runs].slice(0, 6));
    try {
      const job = await host.local.runJob({
        toolId: tool.id,
        prompt: launchMission
          ? [
            'Tytus mission context pack is active.',
            `Mission: ${launchMission.title}`,
            `Goal: ${launchMission.goal}`,
            launchMission.rootPath ? `Mission folder: ${launchMission.rootPath}` : `Mission folder: ${launchMission.name}`,
            'Read MISSION.md and RESOURCES.md from the mission folder when available.',
            'Use the attached Atomek context as source of truth. If you propose file writes, return a unified diff/replacement only; Atomek approval gate applies it.',
            '',
            prompt,
          ].join('\n')
          : prompt,
        cwd: launchMission?.rootPath ?? cwdForLocalAgent(activeFile),
        mission: launchMission ? {
          missionId: launchMission.missionId,
          rootPath: launchMission.rootPath,
          taskId: selectedTask?.id ?? 'manual',
          taskTitle: selectedTask?.title ?? 'Manual run',
          resourceId: tool.id,
        } : undefined,
        context: [
          launchMission ? buildMissionMarkdown(launchMission, resourceGraph, activeFile, openEditors, prompt) : '', 
          buildLocalAgentContext(activeFile, openEditors),
          resourceGraph ? buildResourcesMarkdown(resourceGraph) : '',
        ].filter(Boolean).join('\n\n---\n\n'),
      });
      const transcriptPath = job.transcriptPath ?? (launchMission?.rootPath ? `runs/${new Date().toISOString().replace(/[:.]/g, '-')}-${tool.id}.md` : undefined);
      const lines: string[] = [
        `[Atomek] Started ${tool.label} local job ${job.id}`,
        selectedTask ? `[Atomek] Task: ${selectedTask.title} (${selectedTask.id})` : '[Atomek] Task: manual',
        launchMission?.rootPath ? `[Atomek] Mission: ${launchMission.rootPath}` : '',
      ].filter(Boolean);
      const baseRecord: TytusMissionRun = {
        id: runId,
        jobId: job.id,
        toolId: tool.id,
        label: tool.label,
        status: 'running',
        startedAt,
        taskId: selectedTask?.id ?? 'manual',
        taskTitle: selectedTask?.title ?? 'Manual run',
        transcriptPath,
        summary: `Started ${tool.label} for ${selectedTask?.title ?? 'manual run'}`,
      };
      void upsertMissionRun(baseRecord, launchMission).catch((err) => {
        setStatus(`Mission run index failed: ${err instanceof Error ? err.message : String(err)}`);
      });
      setAgentRuns((runs) => runs.map((run) => run.id === runId ? { ...run, jobId: job.id, transcriptPath } : run));
      const updateRun = (updater: (run: LocalAgentRunState) => LocalAgentRunState) => {
        setAgentRuns((runs) => runs.map((run) => run.id === runId ? updater(run) : run));
      };
      host.local.streamJob(job.id, {
        onLog: (line) => {
          lines.push(line);
          updateRun((run) => ({ ...run, lines: lines.slice(-500) }));
        },
        onDone: (payload) => {
          if (!payload) return;
          lines.push(payload);
          updateRun((run) => ({ ...run, lines: lines.slice(-500) }));
        },
        onFail: (message) => {
          lines.push(`[FAIL] ${message}`);
          updateRun((run) => ({
            ...run,
            status: 'failed',
            finishedAt: Date.now(),
            lines: lines.slice(-500),
          }));
          void upsertMissionRun({
            ...baseRecord,
            status: 'failed',
            finishedAt: isoNow(),
            exitCode: -1,
            summary: message,
          }, launchMission).catch((err) => {
            setStatus(`Mission run index failed: ${err instanceof Error ? err.message : String(err)}`);
          });
          saveLocalJobOutput(`${tool.label} local job failed`, lines.join('\n'));
          void saveRunTranscriptToMission(tool, lines.join('\n'), -1, launchMission, transcriptPath).catch((err) => {
            setStatus(`Mission transcript save failed: ${err instanceof Error ? err.message : String(err)}`);
          });
          setRunningToolId(null);
        },
        onExit: (code) => {
          const body = [
            `# Local job — ${tool.label}`,
            '',
            `- Tool: ${tool.id}`,
            `- Exit code: ${code}`,
            `- Captured: ${new Date().toISOString()}`,
            '',
            '```text',
            lines.join('\n'),
            '```',
          ].join('\n');
          updateRun((run) => ({
            ...run,
            status: code === 0 ? 'complete' : 'failed',
            exitCode: code,
            finishedAt: Date.now(),
            lines: lines.slice(-500),
          }));
          void upsertMissionRun({
            ...baseRecord,
            status: code === 0 ? 'complete' : 'failed',
            finishedAt: isoNow(),
            exitCode: code,
            summary: `${tool.label} exited ${code}`,
          }, launchMission).catch((err) => {
            setStatus(`Mission run index failed: ${err instanceof Error ? err.message : String(err)}`);
          });
          saveLocalJobOutput(`${tool.label} local job`, body);
          void saveRunTranscriptToMission(tool, body, code, launchMission, transcriptPath).catch((err) => {
            setStatus(`Mission transcript save failed: ${err instanceof Error ? err.message : String(err)}`);
          });
          setRunningToolId(null);
        },
        onError: () => setStatus(`Local job stream issue for ${tool.label}`),
      });
      setStatus(`Started ${tool.label} mission run${selectedTask ? ` · ${selectedTask.title}` : ''}`);
    } catch (err) {
      setRunningToolId(null);
      setAgentRuns((runs) => runs.map((run) => run.id === runId
        ? {
          ...run,
          status: 'failed',
          finishedAt: Date.now(),
          lines: [...run.lines, `[Atomek] Failed to start: ${err instanceof Error ? err.message : String(err)}`],
        }
        : run));
      setStatus(`Local job failed to start: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [activeFile, ensureMissionPack, host.local, jobPrompt, openEditors, resourceGraph, saveLocalJobOutput, saveRunTranscriptToMission, selectedTask, setStatus, upsertMissionRun, writeMissionPack]);

  const runPodTask = useCallback(async (resource: TytusResource) => {
    const podId = resourcePodId(resource);
    if (!podId) {
      setStatus(`Cannot dispatch ${resourceDisplayLabel(resource)}: missing pod id`);
      return;
    }
    const prompt = jobPrompt.trim();
    if (!prompt) {
      setStatus('Pod task prompt is empty');
      return;
    }
    let launchMission: MissionFolderState | null = null;
    const label = resourceDisplayLabel(resource);
    const runId = `pod-run-${Date.now()}-${podId}`;
    const startedAt = isoNow();
    const transcriptPath = `runs/${new Date().toISOString().replace(/[:.]/g, '-')}-${resource.id.replace(/[^a-z0-9_.-]/gi, '-')}.md`;
    try {
      launchMission = await ensureMissionPack(prompt);
      if (launchMission) {
        await writeMissionPack(launchMission, prompt, [{
          ts: new Date().toISOString(),
          kind: 'pod-agent.run.start',
          message: `${label} mission task started`,
          data: { resourceId: resource.id, podId, taskId: selectedTask?.id ?? 'manual', taskTitle: selectedTask?.title ?? 'Manual pod run' },
        }]);
      }
    } catch (err) {
      setStatus(`Mission pack failed before pod task: ${err instanceof Error ? err.message : String(err)}`);
      return;
    }
    const baseRecord: TytusMissionRun = {
      id: runId,
      toolId: resource.id,
      label,
      status: 'running',
      startedAt,
      taskId: selectedTask?.id ?? 'manual',
      taskTitle: selectedTask?.title ?? 'Manual pod run',
      transcriptPath,
      summary: `Started ${label} for ${selectedTask?.title ?? 'manual pod run'}`,
    };
    setAgentRuns((runs) => [{
      id: runId,
      toolId: resource.id,
      label,
      status: 'running' as const,
      startedAt: Date.now(),
      taskId: selectedTask?.id ?? 'manual',
      taskTitle: selectedTask?.title ?? 'Manual pod run',
      transcriptPath,
      lines: [`[Atomek] Dispatching ${label} via Tytus host bridge…`, `[Atomek] Pod: ${podId}`, `[Atomek] Task: ${selectedTask?.title ?? 'manual pod run'}`],
    }, ...runs].slice(0, 6));
    await upsertMissionRun(baseRecord, launchMission).catch((err) => {
      setStatus(`Mission run index failed: ${err instanceof Error ? err.message : String(err)}`);
    });
    const lines: string[] = [];
    const pushLine = (line: string) => {
      lines.push(line);
      setAgentRuns((runs) => runs.map((run) => run.id === runId ? { ...run, lines: [...run.lines, line].slice(-500) } : run));
    };
    try {
      const modelsRes = await host.daemon.callPodEndpoint(podId, '/v1/models', { method: 'GET' });
      if (!modelsRes.ok) {
        throw new Error(`/v1/models ${modelsRes.status}: ${await modelsRes.text()}`);
      }
      const models = await modelsRes.json() as unknown;
      const model = extractOpenAiModelId(models);
      if (!model) {
        throw new Error('pod /v1/models returned no model id');
      }
      pushLine(`[Atomek] Selected pod model from live metadata: ${model}`);
      const res = await host.daemon.callPodEndpoint(podId, '/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          stream: false,
          messages: [
            {
              role: 'system',
              content: [
                'You are a Tytus pod agent working from an Atomek mission pack.',
                'Use only the mission/shared-folder context described by the user.',
                'Return findings, markdown, or patch proposals. Do not claim direct writes.',
                'If you propose edits, output unified diff or fenced replacement blocks for Atomek approval.',
              ].join('\n'),
            },
            {
              role: 'user',
              content: [
                launchMission ? `Mission folder: ${launchMission.rootPath ?? launchMission.name}` : 'Mission folder: not available',
                launchMission ? `Mission: ${launchMission.title}` : '',
                launchMission ? `Goal: ${launchMission.goal}` : '',
                selectedTask ? `Task: ${selectedTask.title} (${selectedTask.id})` : 'Task: manual',
                '',
                'Mission context:',
                launchMission ? buildMissionMarkdown(launchMission, resourceGraph, activeFile, openEditors, prompt) : '',
                resourceGraph ? buildResourcesMarkdown(resourceGraph) : '',
                '',
                'User task:',
                prompt,
              ].filter(Boolean).join('\n'),
            },
          ],
        }),
      });
      const raw = await res.text();
      if (!res.ok) {
        throw new Error(`/v1/chat/completions ${res.status}: ${raw}`);
      }
      let parsed: unknown = raw;
      try {
        parsed = JSON.parse(raw) as unknown;
      } catch {
        // Some pod gateways may return plain text. Keep it.
      }
      const answer = typeof parsed === 'string' ? parsed : extractOpenAiAssistantText(parsed);
      pushLine(answer);
      const body = [
        `# Pod job — ${label}`,
        '',
        `- Resource: ${resource.id}`,
        `- Pod: ${podId}`,
        `- Captured: ${new Date().toISOString()}`,
        `- Task: ${selectedTask?.title ?? 'Manual pod run'}`,
        '',
        answer,
        '',
      ].join('\n');
      setAgentRuns((runs) => runs.map((run) => run.id === runId ? { ...run, status: 'complete', finishedAt: Date.now(), lines: [...run.lines, '[Atomek] Pod task complete.'].slice(-500) } : run));
      await upsertMissionRun({ ...baseRecord, status: 'complete', finishedAt: isoNow(), summary: `${label} completed`, transcriptPath }, launchMission);
      saveLocalJobOutput(`${label} pod job`, body);
      await saveRunTranscriptToMission({ id: resource.id, label, kind: 'pod-agent', status: resource.status }, body, 0, launchMission, transcriptPath);
      setStatus(`${label} completed mission task`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      pushLine(`[FAIL] ${message}`);
      setAgentRuns((runs) => runs.map((run) => run.id === runId ? { ...run, status: 'failed', finishedAt: Date.now(), lines: run.lines.slice(-500) } : run));
      await upsertMissionRun({ ...baseRecord, status: 'failed', finishedAt: isoNow(), exitCode: -1, summary: message, transcriptPath }, launchMission).catch((indexErr) => {
        setStatus(`Mission run index failed: ${indexErr instanceof Error ? indexErr.message : String(indexErr)}`);
      });
      const body = [`# Pod job failed — ${label}`, '', `- Pod: ${podId}`, `- Error: ${message}`, '', '```text', lines.join('\n'), '```', ''].join('\n');
      saveLocalJobOutput(`${label} pod job failed`, body);
      await saveRunTranscriptToMission({ id: resource.id, label, kind: 'pod-agent', status: resource.status }, body, -1, launchMission, transcriptPath).catch((saveErr) => {
        setStatus(`Pod transcript save failed: ${saveErr instanceof Error ? saveErr.message : String(saveErr)}`);
      });
      setStatus(`Pod task failed: ${message}`);
    }
  }, [activeFile, ensureMissionPack, host.daemon, jobPrompt, openEditors, resourceGraph, saveLocalJobOutput, saveRunTranscriptToMission, selectedTask, setStatus, upsertMissionRun, writeMissionPack]);

  const cancelLocalJob = useCallback(async (run: LocalAgentRunState) => {
    if (!run.jobId || !host.local?.cancelJob) {
      setStatus('Local job cancel bridge unavailable in this host build');
      return;
    }
    setAgentRuns((runs) => runs.map((item) => item.id === run.id ? { ...item, status: 'canceling', lines: [...item.lines, '[Atomek] Cancel requested…'] } : item));
    void upsertMissionRun({
      id: run.id,
      jobId: run.jobId,
      toolId: run.toolId,
      label: run.label,
      status: 'canceling',
      startedAt: new Date(run.startedAt).toISOString(),
      taskId: run.taskId,
      taskTitle: run.taskTitle,
      transcriptPath: run.transcriptPath,
      summary: 'Cancel requested from Atomek',
    }).catch((err) => {
      setStatus(`Mission run index failed: ${err instanceof Error ? err.message : String(err)}`);
    });
    try {
      await host.local.cancelJob(run.jobId);
      setStatus(`Cancel requested for ${run.label}`);
    } catch (err) {
      setAgentRuns((runs) => runs.map((item) => item.id === run.id ? { ...item, status: 'running', lines: [...item.lines, `[Atomek] Cancel failed: ${err instanceof Error ? err.message : String(err)}`] } : item));
      setStatus(`Local job cancel failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [host.local, setStatus, upsertMissionRun]);

  const useResourceInMission = useCallback(async (resource: TytusResource) => {
    const prompt = [
      `Use Tytus resource "${resourceDisplayLabel(resource)}" (${resource.kind}) for the next mission step.`,
      `Capabilities: ${resource.capabilities.join(', ') || 'status only'}.`,
      `Sandbox: ${resource.sandbox}. Trust: ${resource.trustTier}.`,
      resource.allowedRoots.length ? `Allowed roots: ${resource.allowedRoots.join(', ')}` : 'No direct roots exposed.',
      'Return transcript/findings/artifacts only; edits require Atomek approval.',
    ].join('\n');
    setJobPrompt(prompt);
    if (mission) {
      await writeMissionPack(mission, prompt, [{
        ts: new Date().toISOString(),
        kind: 'resource.selected',
        message: `Selected resource ${resourceDisplayLabel(resource)}`,
        data: { resourceId: resource.id, kind: resource.kind, status: resource.status },
      }]);
    }
    setStatus(`Selected ${resourceDisplayLabel(resource)} for mission`);
  }, [mission, setStatus, writeMissionPack]);

  const showSetupForResource = useCallback((resource: TytusResource) => {
    const setup = resource.setupAction;
    const message = setup?.commandPreview
      ? `${setup.label}: ${setup.commandPreview}`
      : setup?.deepLink
        ? `${setup.label}: ${setup.deepLink}`
        : setup?.label ?? `${resourceDisplayLabel(resource)} needs setup`;
    setStatus(message);
    void copyTextToClipboard(setup?.commandPreview ?? setup?.deepLink ?? message);
  }, [setStatus]);

  return (
    <aside className={isDock ? 'workbench-agent-dock' : 'workbench-sidebar'}>
      {!isDock ? <div className="workbench-sidebar-title">AGENT TEAM</div> : null}
      <div className={isDock ? 'workbench-agent-dock-scroll' : 'workbench-sidebar-scroll'}>
        <div className="workbench-computer-hero">
          <Bot size={18} />
          <div>
            <strong>{isDock ? 'Mission Runs' : 'OpenClaw + Hermes Team Board'}</strong>
            <p className="workbench-muted">Coordinate OpenClaw pods, Hermes pods, local agents, shared folders, app skills, and AIL routes. Open tools in Terminal when you want hands-on control; run background reviews when you want streamed, approval-gated output.</p>
          </div>
        </div>
        <button className="workbench-button-subtle workbench-computer-refresh" onClick={() => { void load(); }} disabled={loading}>
          <RefreshCcw size={14} /> {loading ? 'Refreshing…' : 'Refresh capabilities'}
        </button>
        {error && <div className="workbench-inline-error">{error}</div>}

        <div className="workbench-team-switcher" role="tablist" aria-label="Atomek agent team views">
          <button className={teamView === 'mission' ? 'active' : ''} onClick={() => setTeamView('mission')}>Mission</button>
          <button className={teamView === 'runs' ? 'active' : ''} onClick={() => setTeamView('runs')}>Runs</button>
          <button className={teamView === 'setup' ? 'active' : ''} onClick={() => setTeamView('setup')}>Setup</button>
        </div>

        {teamView === 'mission' ? (
          <>
        <div className="workbench-section-title">MISSION PACK — SHARED CONTEXT</div>
        <div className="workbench-computer-context-card mission">
          <strong>{mission ? mission.title : 'No mission folder selected'}</strong>
          <span>{mission ? `${mission.rootPath ?? mission.name} · ${mission.source} · ${missionAudit.length} audit events · transcripts saved under runs/` : 'Atomek creates this automatically before launching local agents. It is the shared folder agents read/write transcripts from.'}</span>
          {resourceGraph ? <span>{resourceSummary(resourceGraph.resources)}{resourceGraph.warnings.length ? ` · ${resourceGraph.warnings.length} warnings` : ''}</span> : <span>Resource graph not loaded yet.</span>}
        </div>
        <div className="workbench-section-title">SELECTED TEAM</div>
        <div className="workbench-team-assignment-list">
          <div className={`workbench-team-assignment-summary ${missionPreset.readiness}`}>
            <strong>{missionPreset.label}</strong>
            <span>{missionPreset.readiness} · {missionPreset.bestFor}</span>
          </div>
          {missionPreset.assignments.map((assignment) => (
            <div key={`${assignment.role}-${assignment.resourceId}`} className="workbench-team-assignment-row">
              <div>
                <strong>{assignment.label}</strong>
                <span>{assignment.resourceLabel}</span>
              </div>
              <em>{assignment.status}</em>
            </div>
          ))}
        </div>
        <div className="workbench-computer-actions">
          <button className="workbench-button-subtle workbench-agent-primary-action" onClick={() => { void selectMissionFolder(); }}>
            {mission ? 'Refresh mission pack' : 'Start mission pack'}
          </button>
          <button className="workbench-button-subtle" onClick={() => mission && void writeMissionPack(mission, jobPrompt)} disabled={!mission}>
            Rewrite context files
          </button>
        </div>
        {missionList.length ? (
          <>
            <div className="workbench-section-title">RESUME MISSION</div>
            <div className="workbench-mission-list">
              {missionList.slice(0, isDock ? 3 : 5).map((item) => (
                <button
                  key={item.missionId}
                  className={`workbench-mission-row ${mission?.missionId === item.missionId ? 'active' : ''}`}
                  onClick={() => resumeMission(item)}
                  title={item.rootPath}
                >
                  <strong>{item.title}</strong>
                  <span>{item.status ?? 'active'} · {item.taskCount ?? 0} tasks · {item.runCount ?? 0} runs</span>
                </button>
              ))}
            </div>
          </>
        ) : null}
        {resourceGraph?.warnings.length ? (
          <div className="workbench-resource-warnings">
            {resourceGraph.warnings.slice(0, 3).map((warning) => <span key={`${warning.code}-${warning.resourceId ?? warning.message}`}>{warning.code}: {warning.message}</span>)}
          </div>
        ) : null}

        <div className="workbench-section-title">ACTIVE CONTEXT</div>
        <div className="workbench-computer-context-card">
          <strong>{contextSummary}</strong>
          <span>{activeFile ? 'Local agents receive clipped active-file content and must return previewable edits.' : 'Open a file to give local agents useful context.'}</span>
        </div>

        <div className="workbench-section-title">TASK FOR LOCAL AGENT</div>
        <div className="workbench-computer-presets">
          {jobPresets.map((preset) => (
            <button key={preset.label} className="workbench-button-subtle" onClick={() => setJobPrompt(preset.prompt)}>{preset.label}</button>
          ))}
        </div>
        <textarea
          className="workbench-computer-job-prompt"
          value={jobPrompt}
          onChange={(event) => setJobPrompt(event.target.value)}
          rows={5}
        />
        <div className="workbench-section-title">TASK GRAPH</div>
        <div className="workbench-task-graph">
          {missionTasks.map((task, index) => (
            <button
              key={task.id}
              className={`workbench-task-card ${task.status} ${selectedTask?.id === task.id ? 'active' : ''}`}
              onClick={() => { setSelectedTaskId(task.id); setJobPrompt(task.prompt); }}
              title="Load this task prompt"
            >
              <span>{index + 1}</span>
              <strong>{task.title}</strong>
              <em>{task.resourceHint}</em>
              <small>{task.assignedResourceLabel}</small>
            </button>
          ))}
        </div>
          </>
        ) : null}

        {teamView === 'runs' ? (
          <>
        {activeRun ? (
          <div className="workbench-agent-run">
            <header>
              <div>
                <strong>{activeRun.label}</strong>
                <span>{activeRun.status}{typeof activeRun.exitCode === 'number' ? ` · exit ${activeRun.exitCode}` : ''}{activeRun.taskTitle ? ` · ${activeRun.taskTitle}` : ''}</span>
                {activeRun.transcriptPath ? <span>{activeRun.transcriptPath}</span> : null}
              </div>
              <div className="workbench-agent-run-actions">
                <button className="workbench-button-subtle" onClick={() => saveLocalJobOutput(`${activeRun.label} local job`, activeRun.lines.join('\n'))} disabled={activeRun.lines.length === 0}>
                  Save output
                </button>
                {activeRun.jobId && (activeRun.status === 'running' || activeRun.status === 'canceling') ? (
                  <button className="workbench-button-subtle danger" onClick={() => { void cancelLocalJob(activeRun); }} disabled={activeRun.status === 'canceling'}>
                    <Square size={12} /> {activeRun.status === 'canceling' ? 'Canceling…' : 'Cancel'}
                  </button>
                ) : null}
              </div>
            </header>
            <pre className="workbench-computer-job-log">{activeRun.lines.join('\n') || '[waiting for output]'}</pre>
          </div>
        ) : null}
        {missionRuns.length ? (
          <>
            <div className="workbench-section-title">RUN HISTORY</div>
            <div className="workbench-run-history">
              {missionRuns.slice(0, isDock ? 4 : 8).map((run) => (
                <div key={run.id} className="workbench-run-history-row">
                  <div>
                    <strong>{run.taskTitle || run.label}</strong>
                    <span>{run.label} · {run.status}{typeof run.exitCode === 'number' ? ` · exit ${run.exitCode}` : ''}</span>
                    {run.transcriptPath ? <small>{run.transcriptPath}</small> : null}
                  </div>
                  <button className="workbench-button-subtle" onClick={() => void copyTextToClipboard(run.transcriptPath ?? run.id)} title="Copy transcript path or run id">
                    Copy path
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : null}
          </>
        ) : null}

        {teamView === 'setup' ? (
          <>
        <div className="workbench-section-title">RESOURCE GRAPH</div>
        <div className="workbench-computer-list compact">
          {!resourceGraph && !loading ? <p className="workbench-muted">No resource graph reported yet. Older Tytus host builds need `/api/resources`.</p> : null}
          {resourceGraph?.resources.slice(0, isDock ? 8 : 5).map((resource) => (
            <div key={resource.id} className="workbench-resource-row">
              <div>
                <strong>{resourceDisplayLabel(resource)}</strong>
                <span>{resourceDisplayDetail(resource)}</span>
              </div>
              <div className="workbench-resource-row-actions">
                <span className={`workbench-computer-pill ${resource.status}`}>{resource.status}</span>
                <button className="workbench-button-subtle" onClick={() => { void useResourceInMission(resource); }}>
                  Use
                </button>
                {resource.kind === 'pod-agent' && resourcePodId(resource) ? (
                  <button className="workbench-button-subtle" onClick={() => { void runPodTask(resource); }}>
                    Ask pod
                  </button>
                ) : null}
                {resource.status === 'needs-setup' || resource.setupAction ? (
                  <button className="workbench-button-subtle" onClick={() => showSetupForResource(resource)}>
                    Setup
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="workbench-computer-explainer">
          <strong>How launch works</strong>
          <span><b>Open in Terminal</b>: opens a fresh Tytus Terminal, changes into the mission folder, and starts the selected CLI immediately.</span>
          <span><b>Background review</b>: runs the CLI through the tray in read-only/planning mode, streams output here, saves a transcript under <code>runs/</code>, and never applies edits directly.</span>
        </div>

        <div className="workbench-section-title">LOCAL AGENTS & TERMINAL</div>
        <div className="workbench-computer-list">
          {tools.length === 0 && !loading ? <p className="workbench-muted">No local tools reported yet.</p> : null}
          {tools.map((tool) => (
            <div key={tool.id} className="workbench-computer-card">
              <div className="workbench-computer-card-head">
                <div>
                  <strong>{tool.label}</strong>
                  <span>{tool.kind}{tool.version ? ` · ${tool.version}` : ''}</span>
                </div>
                <span className={`workbench-computer-pill ${tool.status}`}>{tool.status}</span>
              </div>
              {tool.description ? <p className="workbench-muted">{tool.description}</p> : null}
              <div className="workbench-computer-actions">
                <button className="workbench-button-subtle workbench-agent-primary-action" onClick={() => { void openToolInTerminal(tool); }} disabled={tool.status !== 'available'} title="Launch this tool in a fresh Tytus Terminal with mission context and execute it immediately.">
                  {actionLabelForTool(tool)}
                </button>
                {tool.kind === 'ai-cli' ? (
                  <button className="workbench-button-subtle" onClick={() => { void runLocalJob(tool); }} disabled={tool.status !== 'available' || runningToolId !== null} title="Run this local agent as a background read-only review inside Atomek and stream output here. It cannot write files directly.">
                    {backgroundJobLabelForTool(tool, runningToolId)}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="workbench-section-title">AGENTIC APP SKILLS</div>
        <div className="workbench-computer-list">
          {skills.length === 0 && !loading ? <p className="workbench-muted">No skills reported yet.</p> : null}
          {skills.map((skill) => (
            <div key={skill.id} className="workbench-computer-card">
              <div className="workbench-computer-card-head">
                <div>
                  <strong>{skill.title}</strong>
                  <span>{skill.driver} · {skill.source}{skill.appId ? ` · ${skill.appId}` : ''}</span>
                </div>
                <span className={`workbench-computer-pill ${skill.status}`}>{skill.status}</span>
              </div>
              <p className="workbench-muted">{skill.description}</p>
              {skill.triggers?.length ? (
                <div className="workbench-computer-triggers">
                  {skill.triggers.slice(0, 4).map((trigger) => <span key={trigger}>{trigger}</span>)}
                </div>
              ) : null}
              <button className="workbench-button-subtle" onClick={() => { void attachSkillToChat(skill); }} disabled={skill.status === 'missing'} title="Insert this skill's instructions into chat so Atomek can use the app/tool correctly.">
                Use in chat
              </button>
            </div>
          ))}
        </div>
          </>
        ) : null}
      </div>
    </aside>
  );
}

function PlaceholderPane({ title, body }: { title: string; body: string }) {
  return (
    <aside className="workbench-sidebar">
      <div className="workbench-sidebar-title">{title}</div>
      <div className="workbench-empty-pane">{body}</div>
    </aside>
  );
}

function StatusBar({ status, file, cursor, fileCount, dirtyCount }: { status: string; file: WorkbenchFile; cursor: CursorPosition; fileCount: number; dirtyCount: number }) {
  return (
    <footer className="workbench-statusbar">
      <span>main</span>
      <span>{fileCount} files</span>
      {dirtyCount > 0 && <span>{dirtyCount} unsaved</span>}
      <span className="workbench-status-spacer" />
      <span>{status}</span>
      <span>Ln {cursor.lineNumber}, Col {cursor.column}</span>
      <span>Spaces: 2</span>
      <span>UTF-8</span>
      <span>LF</span>
      <span>{labelForLanguage(file.language)}</span>
    </footer>
  );
}

function confirmDiscardDirty(dirtyFiles: WorkbenchFile[], action: string): boolean {
  if (dirtyFiles.length === 0) return true;
  return window.confirm(`${dirtyFiles.length} file${dirtyFiles.length === 1 ? '' : 's'} have unsaved changes. Continue to ${action}?`);
}

function mergeFiles(current: WorkbenchFile[], incoming: WorkbenchFile[]): WorkbenchFile[] {
  const map = new Map(current.map((file) => [file.id, file]));
  incoming.forEach((file) => map.set(file.id, file));
  return Array.from(map.values());
}

function slugFileName(title: string): string {
  const cleaned = title
    .replace(/\.[a-z0-9]+$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 54);
  return cleaned || 'ai-artifact';
}

function nextGeneratedPath(files: WorkbenchFile[], base: string): string {
  const paths = new Set(files.map((file) => file.path));
  let candidate = `${base}.md`;
  let index = 2;
  while (paths.has(candidate)) {
    candidate = `${base}-${index}.md`;
    index += 1;
  }
  return candidate;
}

function toPendingEdit(edit: WorkspaceEditFileCandidate): PendingEdit {
  return {
    fileId: edit.fileId,
    fileName: edit.filePath,
    originalContent: edit.originalContent,
    proposedContent: edit.proposedContent,
    sourceTitle: edit.sourceTitle,
    extractionLabel: edit.extractionLabel,
    stats: edit.stats,
  };
}

function previewPatchContent(content: string): string {
  const lines = content.split('\n');
  return lines.slice(0, 80).join('\n') + (lines.length > 80 ? '\n…' : '');
}

function readRecent(): RecentEntry[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentEntry[];
    return normalizeRecentEntries(parsed);
  } catch {
    return [];
  }
}

function normalizeRecentEntries(entries: unknown): RecentEntry[] {
  if (!Array.isArray(entries)) return [];
  return entries
    .filter((item): item is RecentEntry => Boolean(item) && typeof item.name === 'string' && typeof item.path === 'string')
    .map((item) => ({
      name: item.name,
      path: item.path,
      at: typeof item.at === 'number' ? item.at : 0,
      kind: (item.kind === 'folder' ? 'folder' : 'file') as RecentEntry['kind'],
      handleKey: typeof item.handleKey === 'string' ? item.handleKey : undefined,
    }))
    .sort((a, b) => b.at - a.at)
    .slice(0, 10);
}

function mergeRecentEntries(...groups: Array<unknown>): RecentEntry[] {
  const byKey = new Map<string, RecentEntry>();
  for (const item of groups.flatMap(normalizeRecentEntries)) {
    const key = `${item.kind ?? 'file'}:${item.handleKey ?? item.path}`;
    const existing = byKey.get(key);
    if (!existing || item.at >= existing.at) byKey.set(key, item);
  }
  return [...byKey.values()].sort((a, b) => b.at - a.at).slice(0, 10);
}


function readSessionState(): PersistedSessionState {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PersistedSessionState;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function hydrateSessionFiles(files: PersistedSessionState['files']): WorkbenchFile[] {
  if (!Array.isArray(files)) return [];
  return files
    .filter((file) => file && typeof file.id === 'string' && typeof file.path === 'string' && typeof file.content === 'string')
    .map((file) => ({
      id: file.id,
      name: file.name,
      path: file.path,
      language: file.language,
      content: file.content,
      dirty: Boolean(file.dirty),
      size: file.size,
      source: file.source,
    } satisfies WorkbenchFile));
}

function serializeSessionFiles(files: WorkbenchFile[]): PersistedWorkbenchFile[] {
  let total = 0;
  const maxTotal = 2_000_000;
  return files.slice(0, 160).map((file) => {
    const canPersistContent = total + file.content.length <= maxTotal;
    const content = canPersistContent ? file.content : '';
    total += content.length;
    return {
      id: file.id,
      name: file.name,
      path: file.path,
      language: file.language,
      content,
      dirty: file.dirty,
      size: file.size,
      source: file.source,
    };
  });
}

function writeSessionState(state: PersistedSessionState): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    // Browser storage can be full with large projects. Recent handles still survive in IndexedDB.
  }
}

function mergeRestoredFiles(current: WorkbenchFile[], incoming: WorkbenchFile[]): WorkbenchFile[] {
  const currentById = new Map(current.map((file) => [file.id, file]));
  return incoming.map((file) => {
    const existing = currentById.get(file.id);
    if (!existing) return file;
    return existing.dirty ? { ...file, content: existing.content, dirty: true } : file;
  });
}

function readLayoutPrefs(): LayoutPrefs {
  const fallback: LayoutPrefs = {
    primaryVisible: true,
    primaryWidth: 300,
    secondaryVisible: true,
    secondaryWidth: 520,
    markdownPreviewVisible: true,
  };
  try {
    const raw = localStorage.getItem(LAYOUT_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<LayoutPrefs>;
    return {
      primaryVisible: typeof parsed.primaryVisible === 'boolean' ? parsed.primaryVisible : fallback.primaryVisible,
      primaryWidth: typeof parsed.primaryWidth === 'number' ? Math.max(240, Math.min(460, parsed.primaryWidth)) : fallback.primaryWidth,
      secondaryVisible: typeof parsed.secondaryVisible === 'boolean' ? parsed.secondaryVisible : fallback.secondaryVisible,
      secondaryWidth: typeof parsed.secondaryWidth === 'number' ? Math.max(380, Math.min(760, parsed.secondaryWidth)) : fallback.secondaryWidth,
      markdownPreviewVisible: typeof parsed.markdownPreviewVisible === 'boolean' ? parsed.markdownPreviewVisible : fallback.markdownPreviewVisible,
    };
  } catch {
    return fallback;
  }
}

function readChatAiSettings(): ChatAiSettings {
  try {
    const raw = localStorage.getItem(CHAT_AI_SETTINGS_KEY);
    if (!raw) return DEFAULT_CHAT_AI_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<ChatAiSettings>;
    const gatewayPreference: ChatGatewayPreference =
      parsed.gatewayPreference === 'remote' || parsed.gatewayPreference === 'local' || parsed.gatewayPreference === 'auto'
        ? parsed.gatewayPreference
        : DEFAULT_CHAT_AI_SETTINGS.gatewayPreference;
    return {
      gatewayPreference,
      model: typeof parsed.model === 'string' ? parsed.model : '',
      embeddingModel: typeof parsed.embeddingModel === 'string' ? parsed.embeddingModel : '',
    };
  } catch {
    return DEFAULT_CHAT_AI_SETTINGS;
  }
}
