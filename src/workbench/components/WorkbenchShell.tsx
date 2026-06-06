
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  ArrowUp,
  Clock,
  FilePlus2,
  FileSearch,
  Folder,
  FolderOpen,
  GitBranch,
  Eye,
  MessageSquareText,
  Mic,
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
  Trash2,
  X,
} from 'lucide-react';
import { ensureHandlePermission, filesFromHandles, folderFromHandle, hasFileSystemAccessApi, openFiles, openFolder, saveWorkbenchFile } from '../fileAccess';
import { labelForLanguage } from '../language';
import { markdownToHtml } from '../markdown';
import type { ActivityView, BrowserDirectoryHandleLike, BrowserFileHandleLike, ChatAiSettings, ChatGatewayPreference, ChatMessage, ChatTarget, CursorPosition, OutputArtifact, SecondaryTab, WorkbenchFile, WorkbenchFolder, WorkbenchRange } from '../types';
import {
  CURRENT_MISSION_EVENT,
  buildMissionMarkdown,
  buildMissionPackFiles,
  buildMissionTasks,
  buildResourcesMarkdown,
  buildTeamPresetPreview,
  buildTeamPresetPreviews,
  ensureDirectory,
  isoNow,
  missionRunSortValue,
  missionSlug,
  missionWorkbenchFiles,
  normalizeMissionTitle,
  missionStateFromSummary,
  pickTeamPresetId,
  pickWritableDirectory,
  PRIMARY_MISSION_FILE_PATHS,
  readCurrentMission,
  resourceDisplayDetail,
  resourceDisplayLabel,
  resourcePodId,
  resourceRouteId,
  resourceSummary,
  saveCurrentMission,
  primaryMissionFiles,
  summarizeAgentTeam,
  summarizeResourceFabric,
  writeMissionFileToBrowserDirectory,
  writeTextToDirectory,
} from '../missions';
import type {
  AtomekLocalTool,
  AtomekSkillPack,
  AtomekSkillSummary,
  LocalAgentRunState,
  MissionAuditEvent,
  MissionFolderState,
  MissionGeneratedFile,
  TeamPresetId,
} from '../missions';
import { useConversation } from '../ai/useConversation';
import { ATOMEK_CHAT_TARGET, buildChatTargets, friendlyAgentError, readSelectedChatTargetId, sanitizeVisibleAgentText, writeSelectedChatTargetId } from '../ai/chatTargets';
import { listAgentTranscripts, clearAgentTranscriptForTarget } from '../ai/useConversation';
import type { AgentTranscriptSummary } from '../ai/useConversation';
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
import { useAtomekT } from '../../i18n';
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
const APP_VERSION = '0.4.35';
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
type PersistedWorkbenchFile = Pick<WorkbenchFile, 'id' | 'name' | 'path' | 'language' | 'content' | 'dirty' | 'size' | 'source' | 'mission'>;
type OpenMissionFilesOptions = { primaryOnly?: boolean; activatePath?: string; openTabs?: boolean; activate?: boolean; quiet?: boolean };
type WriteMissionPackOptions = { openFiles?: boolean; activate?: boolean };
type LegacyActivityView = ActivityView | 'source-control' | 'run';
type LegacyBottomPanelTab = BottomPanelTab | 'problems';
type PersistedSessionState = { activity?: LegacyActivityView; folder?: { name: string; handleKey?: string | null } | null; files?: PersistedWorkbenchFile[]; openEditorIds?: string[]; activeFileId?: string | null; query?: string; chatInput?: string; welcomeClosed?: boolean; secondaryTab?: SecondaryTab; bottomPanelVisible?: boolean; bottomPanelTab?: LegacyBottomPanelTab; recent?: RecentEntry[]; };
type PaletteItem = { label: string; detail: string; run: () => void; disabled?: boolean };
type SearchResult = { file: WorkbenchFile; lineNumber: number; line: string };
type BottomPanelTab = 'output' | 'terminal';
type QuickPromptKind = 'explain' | 'improve' | 'plan' | 'draft' | 'edit';
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

function normalizeActivityView(activity: PersistedSessionState['activity']): ActivityView {
  if (activity === 'search' || activity === 'computer') return activity;
  return 'explorer';
}

function normalizeBottomPanelTab(tab: PersistedSessionState['bottomPanelTab']): BottomPanelTab {
  if (tab === 'terminal') return 'terminal';
  return 'output';
}



function clampWidth(value: number, min: number, max: number): number {
  return Math.round(Math.max(min, Math.min(max, value)));
}

function assertSafeMissionRelPath(relPath: string): void {
  const parts = relPath.split('/').filter(Boolean);
  if (
    parts.length === 0 ||
    relPath.startsWith('/') ||
    relPath.includes('\\') ||
    parts.some((part) => part === '.' || part === '..')
  ) {
    throw new Error(`Unsafe mission file path: ${relPath}`);
  }
}

function workbenchLayoutLimits(width: number): { primaryMin: number; primaryMax: number; secondaryMin: number; secondaryMax: number } {
  const safeWidth = Math.max(width || 1400, 760);
  const usable = Math.max(0, safeWidth - ACTIVITY_BAR_WIDTH);
  const compact = usable < 1180;
  const primaryMin = compact ? 200 : 240;
  const secondaryMin = compact ? 280 : 300;
  const editorTargetMin = compact ? 360 : 420;
  const primaryMax = Math.max(primaryMin, Math.min(compact ? 340 : 420, Math.floor(usable * 0.28)));
  const assumedPrimary = Math.min(300, primaryMax);
  // Antigravity-style wide resize: let the chat column take up to ~half (compact)
  // / ~two-thirds (regular) of the usable width. The real ceiling is
  // secondaryByEditor, which only guarantees the editor keeps editorTargetMin —
  // so the splitter drags across a big range instead of snapping to a narrow band.
  const secondaryByRatio = Math.floor(usable * (compact ? 0.5 : 0.62));
  const secondaryByEditor = usable - assumedPrimary - editorTargetMin;
  const secondaryMax = Math.max(secondaryMin, Math.min(compact ? 1000 : 1400, secondaryByRatio, secondaryByEditor));
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


export function WorkbenchShell({ host }: Props) {
  const t = useAtomekT();
  const workbenchRef = useRef<HTMLDivElement | null>(null);
  const [workbenchWidth, setWorkbenchWidth] = useState(0);
  const initialLayout = useMemo(() => readLayoutPrefs(), []);
  const initialSession = useMemo(() => readSessionState(), []);
  const initialRecent = useMemo(() => mergeRecentEntries(readRecent(), initialSession.recent), [initialSession.recent]);
  const [activity, setActivity] = useState<ActivityView>(() => normalizeActivityView(initialSession.activity) || 'explorer');
  const [primaryVisible, setPrimaryVisible] = useState(initialLayout.primaryVisible);
  const [primaryWidth, setPrimaryWidth] = useState(initialLayout.primaryWidth);
  const [secondaryTab, setSecondaryTab] = useState<SecondaryTab>(initialSession.secondaryTab ?? 'chat');
  const [secondaryVisible, setSecondaryVisible] = useState(initialLayout.secondaryVisible);
  const [secondaryWidth, setSecondaryWidth] = useState(initialLayout.secondaryWidth);
  const [bottomPanelVisible, setBottomPanelVisible] = useState(Boolean(initialSession.bottomPanelVisible));
  const [bottomPanelTab, setBottomPanelTab] = useState<BottomPanelTab>(() => normalizeBottomPanelTab(initialSession.bottomPanelTab));
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

  const openMissionFiles = useCallback((mission: MissionFolderState, generatedFiles: MissionGeneratedFile[], opts: OpenMissionFilesOptions = {}) => {
    const selectedFiles = opts.primaryOnly === false ? generatedFiles : primaryMissionFiles(generatedFiles);
    const incoming = missionWorkbenchFiles(mission, selectedFiles);
    if (incoming.length === 0) return;

    const dirtyMissionPaths = new Set(
      files
        .filter((file) => file.source === 'mission' && file.dirty && file.mission?.missionId === mission.missionId)
        .map((file) => file.mission?.relPath)
        .filter(Boolean) as string[],
    );
    const safeIncoming = incoming.filter((file) => !dirtyMissionPaths.has(file.mission?.relPath ?? ''));
    const skipped = incoming.length - safeIncoming.length;
    if (safeIncoming.length > 0) {
      setFiles((current) => mergeFiles(current, safeIncoming));
      if (opts.openTabs !== false) {
        setOpenEditorIds((ids) => Array.from(new Set([...ids, ...safeIncoming.map((file) => file.id)])));
        if (opts.activate !== false) {
          const target = safeIncoming.find((file) => file.mission?.relPath === opts.activatePath) ?? safeIncoming[0];
          setActiveFileId(target.id);
          setWelcomeClosed(false);
          setMarkdownPreviewVisible(true);
          setRevealLine(null);
          setCursor({ lineNumber: 1, column: 1 });
        }
      }
    }
    if (!opts.quiet) {
      const verb = opts.openTabs === false ? 'Updated' : 'Opened';
      setStatus(`${safeIncoming.length ? `${verb} ${safeIncoming.length} mission file${safeIncoming.length === 1 ? '' : 's'}` : 'Mission files already open'}${skipped ? ` · skipped ${skipped} dirty tab${skipped === 1 ? '' : 's'}` : ''}`);
    }
  }, [files]);

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

  const saveWorkbenchFileWithHost = useCallback(async (file: WorkbenchFile): Promise<WorkbenchFile> => {
    if (file.source !== 'mission') return saveWorkbenchFile(file);
    const relPath = file.mission?.relPath;
    const rootPath = file.mission?.rootPath;
    if (!relPath) {
      throw new Error('Mission file save requires mission metadata. Recreate or refresh the mission pack.');
    }
    assertSafeMissionRelPath(relPath);
    if (rootPath && host.missions?.write) {
      await host.missions.write({ rootPath, files: [{ path: relPath, content: file.content }] });
      return { ...file, dirty: false };
    }
    if (file.mission?.handle) {
      await writeMissionFileToBrowserDirectory(file.mission.handle, relPath, file.content);
      return { ...file, dirty: false };
    }
    throw new Error('Mission file save requires a tray mission path. Recreate or refresh the mission pack.');
  }, [host.missions]);

  const saveActiveFile = useCallback(async () => {
    if (!activeFile) return;
    try {
      const saved = await saveWorkbenchFileWithHost(activeFile);
      setFiles((current) => current.map((file) => file.id === saved.id ? saved : file));
      setStatus(`Saved ${saved.name}`);
    } catch (err) {
      setStatus(`Save failed: ${(err as Error).message}`);
    }
  }, [activeFile, saveWorkbenchFileWithHost]);

  const saveFileById = useCallback(async (id: string) => {
    const file = files.find((candidate) => candidate.id === id);
    if (!file) return null;
    const saved = await saveWorkbenchFileWithHost(file);
    setFiles((current) => current.map((candidate) => candidate.id === saved.id ? saved : candidate));
    return saved;
  }, [files, saveWorkbenchFileWithHost]);

  const saveAllDirty = useCallback(async () => {
    const targets = files.filter((file) => file.dirty);
    if (targets.length === 0) {
      setStatus('No dirty files to save');
      return;
    }
    try {
      const saved = await Promise.all(targets.map((file) => saveWorkbenchFileWithHost(file)));
      const savedMap = new Map(saved.map((file) => [file.id, file]));
      setFiles((current) => current.map((file) => savedMap.get(file.id) ?? file));
      setAiDirtyNotice(null);
      setStatus(`Saved ${saved.length} dirty file${saved.length === 1 ? '' : 's'}`);
    } catch (err) {
      setStatus(`Save all failed: ${(err as Error).message}`);
    }
  }, [files, saveWorkbenchFileWithHost]);

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
            openMissionFiles={openMissionFiles}
          />
          <div className="workbench-primary-resizer" onPointerDown={beginPrimaryResize} title={t('shell.resizeExplorer')} />
        </div>
      )}
      <main className="workbench-editor-area">
        <button className="workbench-command-center" onClick={() => setCommandPaletteOpen(true)}>{t('app.workspace')}</button>
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
              <button onClick={() => { void saveAllDirty(); }}>{t('shell.saveAll')}</button>
              <button onClick={() => setAiDirtyNotice(null)} title={t('shell.dismiss')}><X size={13} /></button>
            </div>
          ) : null}
          <div className="workbench-editor-content">
            {activeFile ? (
              <div className={activeFile.language === 'markdown' && markdownPreviewVisible ? 'workbench-editor-split' : 'workbench-editor-single'}>
                <div className="workbench-editor-pane">
                  <Suspense fallback={<div className="workbench-empty-pane">{t('shell.loadingEditor')}</div>}>
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
              <MissionControlHome host={host} openFile={handleOpenFile} openFolder={handleOpenFolder} newFile={newUntitled} recent={recent} reopenRecent={reopenRecent} setStatus={setStatus} openControlTower={() => { setActivity('computer'); setPrimaryVisible(true); }} openChat={() => { setSecondaryTab('chat'); setSecondaryVisible(true); }} openEmbeddedDoc={openEmbeddedDoc} openMissionFiles={openMissionFiles} />
            ) : (
              <div className="workbench-no-editor">
                <FileSearch size={34} />
                <p>{t('shell.noEditor')}</p>
                <button className="workbench-button-subtle" onClick={() => setWelcomeClosed(false)}>{t('shell.showAgentTeam')}</button>
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
          openMissionFiles={openMissionFiles}
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
  const t = useAtomekT();
  return (
    <aside className="workbench-activity-bar" aria-label={t('activity.aria')}>
      <button className="workbench-activity-brand" title={t('activity.toggleSidebar')} aria-label={t('activity.toggleSidebar')} onClick={togglePrimary}><AtomekBrandMark size={30} variant="cream" /></button>
      <ActivityButton icon={<File size={25} />} label={t('activity.explorer')} active={active === 'explorer'} onClick={() => setActive('explorer')} />
      <ActivityButton icon={<Search size={25} />} label={t('activity.search')} active={active === 'search'} onClick={() => setActive('search')} />
      <ActivityButton icon={<Bot size={25} />} label={t('app.agentTeam')} active={active === 'computer'} onClick={() => setActive('computer')} />
      <div className="workbench-activity-spacer" />
      <ActivityButton icon={<Settings size={23} />} label={t('app.settings')} active={settingsActive} onClick={openSettings} />
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
  openMissionFiles: (mission: MissionFolderState, files: MissionGeneratedFile[], opts?: OpenMissionFilesOptions) => void;
  activeFile: WorkbenchFile | null;
}) {
  if (props.activity === 'search') return <SearchPane files={props.files} query={props.query} setQuery={props.setQuery} openWorkbenchFile={props.openWorkbenchFile} activeFileId={props.activeFileId} />;
  if (props.activity === 'computer') return <ControlTowerPane host={props.host} setStatus={props.setStatus} attachSkillToChat={props.attachSkillToChat} saveLocalJobOutput={props.saveLocalJobOutput} openMissionFiles={props.openMissionFiles} activeFile={props.activeFile} openEditors={props.openEditors} />;
  return <ExplorerPane {...props} />;
}

function ExplorerPane(props: Omit<Parameters<typeof PrimarySidebar>[0], 'activity'>) {
  const t = useAtomekT();
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
      <div className="workbench-sidebar-title">{t('explorer.title')}</div>
      <div className="workbench-sidebar-scroll">
        {noFolder ? (
          <>
            <p style={{ fontWeight: 600, margin: '10px 0' }}>{t('explorer.noFolder')}</p>
            <p className="workbench-muted">{t('explorer.noFolderBody')}</p>
            <button className="workbench-button-blue" onClick={props.openFolder}>{t('explorer.openFolder')}</button>
            <button className="workbench-button-blue" onClick={props.openFile}>{t('explorer.openFile')}</button>
            <button className="workbench-button-blue" onClick={() => props.recent[0] ? void props.reopenRecent(props.recent[0]) : props.setStatus(t('explorer.noRecentWorkspace'))}>{t('explorer.openRecent')}</button>
            <p className="workbench-muted">{props.hasFsAccess ? t('explorer.fsAccess') : t('explorer.browserFallback')}</p>
          </>
        ) : (
          <>
            <div className="workbench-sidebar-actions">
              <button className="workbench-button-subtle" onClick={props.openFile}><FilePlus2 size={14} />{t('explorer.openFile')}</button>
              <button className="workbench-button-subtle" onClick={props.openFolder}><FolderOpen size={14} />{t('explorer.openFolder')}</button>
            </div>
            <input className="workbench-input" value={props.query} onChange={(event) => props.setQuery(event.target.value)} placeholder={t('explorer.searchFiles')} />
            <div className="workbench-section-title"><ChevronDown size={12} /> {t('explorer.openEditors')}</div>
            {props.openEditors.length === 0 ? <p className="workbench-muted">{t('explorer.noOpenEditors')}</p> : props.openEditors.map((file) => (
              <FileRow key={file.id} file={file} active={file.id === props.activeFileId} onOpen={() => props.openWorkbenchFile(file)} label={file.name} detail={file.path} />
            ))}
            <div className="workbench-section-title"><ChevronDown size={12} /> {props.folder?.name ?? t('app.workspace')}</div>
            {tree.length === 0 ? <p className="workbench-muted">{t('explorer.noReadableFiles')}</p> : renderTreeNodes(tree, props.activeFileId, props.openWorkbenchFile, expandedDirs, toggleDir)}
          </>
        )}
        <div className="workbench-section-title">{t('explorer.recent')}</div>
        {props.recent.length === 0 ? <p className="workbench-muted">{t('explorer.noRecentFolders')}</p> : props.recent.map((item) => <button key={`${item.path}-${item.at}`} className="workbench-tree-row" onClick={() => { void props.reopenRecent(item); }} title={item.path}>{item.kind === 'file' ? <FileCode2 size={14} /> : <Folder size={14} />}<span className="workbench-row-name">{item.name}</span></button>)}
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
  const t = useAtomekT();
  const parts = showWelcome ? [t('app.agentTeam')] : (file?.path.split('/').filter(Boolean) ?? []);
  const normalized = folder && parts[0] === folder.name ? parts.slice(1) : parts;
  return (
    <div className="workbench-breadcrumb">
      {normalized.length === 0 ? <span>{t('app.workspace')}</span> : normalized.map((part, index) => (
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
  const t = useAtomekT();
  return (
    <div className="workbench-tabs">
      {props.showWelcome && (
        <button className="workbench-tab active">
          <FileSearch size={15} />
          <span className="workbench-tab-name">{t('app.agentTeam')}</span>
          <span className="workbench-tab-close" role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); props.closeWelcome(); }}><X size={13} /></span>
        </button>
      )}
      {props.settingsOpen && (
        <button className={`workbench-tab ${props.settingsActive ? 'active' : ''}`} onClick={props.openSettings} title={t('tabs.atomekSettings')}>
          <SlidersHorizontal size={15} />
          <span className="workbench-tab-name">{t('tabs.atomekSettings')}</span>
          <span className="workbench-tab-close" role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); props.closeSettings(); }}><X size={13} /></span>
        </button>
      )}
      {props.openEditors.map((file) => (
        <button key={file.id} className={`workbench-tab ${file.id === props.activeFileId ? 'active' : ''}`} onClick={() => props.setActiveFileId(file.id)} title={file.path}>
          <FileCode2 size={15} />
          <span className="workbench-tab-name">{file.dirty && <span className="workbench-dirty-dot">●</span>}{file.name}</span>
          {file.dirty && <span className="workbench-tab-save" role="button" tabIndex={0} title={t('tabs.save')} onClick={(event) => { event.stopPropagation(); props.saveFile(file.id); }}>{t('tabs.save')}</span>}
          <span className="workbench-tab-close" role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); props.closeEditor(file.id); }}><X size={13} /></span>
        </button>
      ))}
      <div style={{ flex: 1 }} />
      {props.canPreview && <button className={`workbench-editor-action ${props.previewVisible ? 'active' : ''}`} title={t('tabs.toggleMarkdownPreview')} onClick={props.togglePreview}><Eye size={16} /></button>}
      <button className={`workbench-editor-action ${props.secondaryVisible ? 'active' : ''}`} title={t('tabs.toggleChat')} onClick={props.toggleSecondary}><PanelRight size={16} /></button>
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
  openMissionFiles,
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
  openMissionFiles: (mission: MissionFolderState, files: MissionGeneratedFile[], opts?: OpenMissionFilesOptions) => void;
}) {
  const t = useAtomekT();
  const presetDefaults = useMemo<Record<TeamPresetId, { name: string; goal: string }>>(() => ({
    'repo-repair': {
      name: t('mission.default.repoRepair.name'),
      goal: t('mission.default.repoRepair.goal'),
    },
    'pod-local': {
      name: t('mission.default.podLocal.name'),
      goal: t('mission.default.podLocal.goal'),
    },
    'creative-production': {
      name: t('mission.default.creativeProduction.name'),
      goal: t('mission.default.creativeProduction.goal'),
    },
    'research-watch': {
      name: t('mission.default.researchWatch.name'),
      goal: t('mission.default.researchWatch.goal'),
    },
  }), [t]);
  const [missionName, setMissionName] = useState(() => t('mission.default.podLocal.name'));
  const [goal, setGoal] = useState(() => t('mission.default.podLocal.goal'));
  const [missionNameTouched, setMissionNameTouched] = useState(false);
  const [goalTouched, setGoalTouched] = useState(false);
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
    const missionTitle = normalizeMissionTitle(missionName, trimmedGoal);
    const selectedPresetId = pickTeamPresetId(trimmedGoal, graph, teamPresetId);
    setLoading(true);
    try {
      const created = await host.missions.create({
        title: missionTitle,
        goal: trimmedGoal,
      });
      const missionState: MissionFolderState = {
        missionId: created.missionId,
        title: created.title || missionTitle,
        goal: created.goal || trimmedGoal,
        rootPath: created.rootPath,
        name: created.rootPath.split('/').pop() || created.missionId,
        source: 'tray',
        teamPresetId: selectedPresetId,
      };
      const audit: MissionAuditEvent = {
        ts: new Date().toISOString(),
        kind: 'mission.control.created',
        message: 'Mission created from Atomek agent-team home',
        data: { resourceCount: graph?.resources.length ?? 0, missionTitle },
      };
      const files = buildMissionPackFiles(
        missionState,
        graph,
        null,
        [],
        trimmedGoal,
        selectedPresetId,
        [`${JSON.stringify(audit)}\n`],
      );
      await host.missions.write({
        rootPath: created.rootPath,
        files,
      });
      setMission(created);
      saveCurrentMission(missionState);
      openMissionFiles(missionState, files);
      setStatus(`Mission created: ${created.rootPath}`);
      openControlTower();
    } catch (err) {
      setStatus(`Mission create failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }, [goal, graph, host.missions, missionName, openControlTower, openMissionFiles, setStatus, teamPresetId]);

  const selectTeamPreset = useCallback((presetId: TeamPresetId) => {
    setTeamPresetId(presetId);
    const defaults = presetDefaults[presetId];
    if (!missionNameTouched) setMissionName(defaults.name);
    if (!goalTouched) setGoal(defaults.goal);
  }, [goalTouched, missionNameTouched, presetDefaults]);

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
          <div className="workbench-control-mission-fields">
            <label className="workbench-control-field">
              <span>{t('mission.name')}</span>
              <input
                value={missionName}
                onChange={(event) => { setMissionNameTouched(true); setMissionName(event.target.value); }}
                maxLength={80}
                placeholder={t('mission.namePlaceholder')}
              />
            </label>
            <label className="workbench-control-field">
              <span>{t('mission.goal')}</span>
              <textarea
                value={goal}
                onChange={(event) => { setGoalTouched(true); setGoal(event.target.value); }}
                rows={3}
                aria-label={t('mission.goal')}
                placeholder={t('mission.goalPlaceholder')}
              />
            </label>
          </div>
          <div className="workbench-control-hero-actions">
            <button className="workbench-button-primary" onClick={() => { void startMission(); }} disabled={loading}>{t('mission.start')}</button>
            <button className="workbench-button-subtle" onClick={openControlTower}>{t('mission.openBoard')}</button>
            <button className="workbench-button-subtle" onClick={openChat}>{t('mission.openChat')}</button>
          </div>
        </div>
        <div className="workbench-team-preset-strip" aria-label="Team presets">
          {teamPresets.map((preset) => (
            <button
              key={preset.id}
              className={`workbench-team-preset-card ${preset.id === selectedTeamPreset.id ? 'active' : ''} ${preset.readiness}`}
              onClick={() => selectTeamPreset(preset.id)}
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
  const t = useAtomekT();
  const results = useMemo(() => buildSearchResults(files, query), [files, query]);
  const grouped = useMemo(() => {
    const byFile = new Map<string, SearchResult[]>();
    results.forEach((result) => byFile.set(result.file.id, [...(byFile.get(result.file.id) ?? []), result]));
    return Array.from(byFile.values()).slice(0, 50);
  }, [results]);
  return (
    <aside className="workbench-sidebar">
      <div className="workbench-sidebar-title">{t('search.title')}</div>
      <div className="workbench-sidebar-scroll">
        <input className="workbench-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('search.placeholder')} autoFocus />
        <div className="workbench-section-title"><FileSearch size={12} /> {t('search.results')}</div>
        {!query.trim() ? <p className="workbench-muted">{t('search.help')}</p> : grouped.length === 0 ? <p className="workbench-muted">{t('search.noMatches')}</p> : grouped.map((group) => {
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
              {group.length > 5 && <div className="workbench-search-more">{t('search.moreMatches', { count: group.length - 5 })}</div>}
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
      <p className="workbench-muted">Manual checks never execute host commands. Copy a command, run it yourself, then paste the result.</p>
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
        <button className={props.tab === 'output' ? 'active' : ''} onClick={() => props.setTab('output')}>OUTPUT</button>
        <button className={props.tab === 'terminal' ? 'active' : ''} onClick={() => props.setTab('terminal')}>MANUAL CHECKS</button>
        <span />
        <button title="Close Panel" onClick={props.onClose}><X size={14} /></button>
      </div>
      <div className="workbench-bottom-body">
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
  openMissionFiles: (mission: MissionFolderState, files: MissionGeneratedFile[], opts?: OpenMissionFilesOptions) => void;
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
  const t = useAtomekT();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyQuery, setHistoryQuery] = useState('');
  const [agentTranscripts, setAgentTranscripts] = useState<AgentTranscriptSummary[]>([]);
  const historyButtonRef = useRef<HTMLButtonElement | null>(null);
  const historyPopRef = useRef<HTMLDivElement | null>(null);
  const historyInputRef = useRef<HTMLInputElement | null>(null);
  const [historyPos, setHistoryPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });

  type AtomekHistoryItem = { kind: 'atomek-thread'; id: string; title: string; lastActivityAt: number; thread: AiThread };
  type AgentHistoryItem = { kind: 'pod-agent'; id: string; title: string; subtitle: string; lastActivityAt: number; targetId: string };
  type HistoryItem = AtomekHistoryItem | AgentHistoryItem;

  const atomekHistoryItems = useMemo<AtomekHistoryItem[]>(
    () => props.chatThreads.map((thread) => ({
      kind: 'atomek-thread' as const,
      id: `thread:${thread.id}`,
      title: thread.title,
      lastActivityAt: thread.lastMessageAt ?? thread.updatedAt ?? 0,
      thread,
    })),
    [props.chatThreads],
  );
  const agentHistoryItems = useMemo<AgentHistoryItem[]>(() => {
    return agentTranscripts
      .map((summary): AgentHistoryItem | null => {
        const target = props.chatTargets.find((t) => t.id === summary.targetId);
        if (!target) return null;
        return {
          kind: 'pod-agent' as const,
          id: `agent:${summary.targetId}`,
          title: target.label,
          subtitle: summary.preview || target.description || `${summary.messageCount} messages`,
          lastActivityAt: summary.lastActivityAt,
          targetId: summary.targetId,
        };
      })
      .filter((item): item is AgentHistoryItem => item !== null);
  }, [agentTranscripts, props.chatTargets]);
  const allHistoryItems = useMemo<HistoryItem[]>(() => {
    return [...atomekHistoryItems, ...agentHistoryItems].sort((a, b) => b.lastActivityAt - a.lastActivityAt);
  }, [atomekHistoryItems, agentHistoryItems]);

  const currentItem = useMemo<HistoryItem | null>(() => {
    if (props.selectedChatTarget.kind === 'atomek-ai' && props.chatThread) {
      return allHistoryItems.find((item) => item.kind === 'atomek-thread' && item.thread.id === props.chatThread?.id) ?? null;
    }
    if (props.selectedChatTarget.kind !== 'atomek-ai') {
      return allHistoryItems.find((item) => item.kind === 'pod-agent' && item.targetId === props.selectedChatTarget.id) ?? null;
    }
    return null;
  }, [allHistoryItems, props.selectedChatTarget, props.chatThread]);

  const matches = useCallback((item: HistoryItem, q: string): boolean => {
    if (!q) return true;
    const haystack = `${item.title} ${(item.kind === 'pod-agent' ? item.subtitle : '')}`.toLowerCase();
    return haystack.includes(q);
  }, []);
  const historyQueryLower = historyQuery.trim().toLowerCase();
  const currentMatches = currentItem ? matches(currentItem, historyQueryLower) : false;
  const recentItems = useMemo(() => {
    return allHistoryItems
      .filter((item) => item.id !== currentItem?.id)
      .filter((item) => matches(item, historyQueryLower));
  }, [allHistoryItems, currentItem, historyQueryLower, matches]);

  const refreshAgentTranscripts = useCallback(() => {
    setAgentTranscripts(listAgentTranscripts());
  }, []);

  const pickItem = useCallback((item: HistoryItem) => {
    setHistoryOpen(false);
    if (item.kind === 'atomek-thread') {
      if (props.selectedChatTarget.kind !== 'atomek-ai') {
        props.selectChatTarget(ATOMEK_CHAT_TARGET.id);
      }
      props.selectThread(item.thread.id);
    } else {
      props.selectChatTarget(item.targetId);
    }
    if (props.tab !== 'chat') props.setTab('chat');
  }, [props]);

  const deleteItem = useCallback((item: HistoryItem) => {
    if (!window.confirm(`Delete conversation "${item.title}"?`)) return;
    if (item.kind === 'atomek-thread') {
      props.deleteThread(item.thread.id);
    } else {
      clearAgentTranscriptForTarget(item.targetId);
      refreshAgentTranscripts();
    }
  }, [props, refreshAgentTranscripts]);

  useEffect(() => {
    if (!historyOpen) {
      setHistoryQuery('');
      return;
    }
    refreshAgentTranscripts();
    const reposition = () => {
      const btn = historyButtonRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      setHistoryPos({
        top: rect.bottom + 6,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    };
    reposition();
    window.setTimeout(() => historyInputRef.current?.focus(), 0);
    const onDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (historyPopRef.current?.contains(target)) return;
      if (historyButtonRef.current?.contains(target)) return;
      setHistoryOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setHistoryOpen(false);
    };
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [historyOpen]);

  return (
    <aside className="workbench-secondary">
      <div className="workbench-secondary-resizer" onPointerDown={props.onResizeStart} title={t('shell.resizeChat')} />
      <div className="workbench-secondary-tabs">
        <div className="workbench-secondary-tab-group">
          <button className={`workbench-secondary-tab ${props.tab === 'chat' ? 'active' : ''}`} onClick={() => props.setTab('chat')}>{t('secondary.chat')}</button>
          <button className={`workbench-secondary-tab ${props.tab === 'agents' ? 'active' : ''}`} onClick={() => props.setTab('agents')}>{t('secondary.agents')}</button>
          <button className={`workbench-secondary-tab ${props.tab === 'outputs' ? 'active' : ''}`} onClick={() => props.setTab('outputs')}>{t('secondary.outputs')}</button>
        </div>
        <div className="workbench-secondary-actions">
          <button title={t('secondary.newChat')} onClick={props.newChat}><Plus size={15} /></button>
          <button
            ref={historyButtonRef}
            title={t('secondary.pastConversations')}
            aria-label={t('secondary.pastConversations')}
            aria-expanded={historyOpen}
            onClick={() => { refreshAgentTranscripts(); setHistoryOpen((open) => !open); }}
            className={historyOpen ? 'is-active' : ''}
          >
            <Clock size={15} />
          </button>
          <button title={t('secondary.chatSettings')} onClick={props.openSettings}><MoreHorizontal size={16} /></button>
          <button title={t('secondary.closeChat')} onClick={props.onClose}><X size={15} /></button>
        </div>
      </div>
      {historyOpen && typeof document !== 'undefined' ? createPortal(
        <div
          ref={historyPopRef}
          className="workbench-history-portal"
          style={{ top: historyPos.top, right: historyPos.right }}
          role="menu"
        >
          <div className="workbench-history-portal-search">
            <Search size={14} />
            <input
              ref={historyInputRef}
              type="text"
              placeholder={t('history.search')}
              value={historyQuery}
              onChange={(event) => setHistoryQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  const firstHit = (currentMatches && currentItem) ? currentItem : recentItems[0];
                  if (firstHit) pickItem(firstHit);
                }
              }}
            />
          </div>
          <div className="workbench-history-portal-list">
            {currentItem && currentMatches ? (
              <>
                <div className="workbench-history-portal-group">{t('history.current')}</div>
                <div
                  className="workbench-history-portal-item active"
                  role="menuitem"
                  onClick={() => pickItem(currentItem)}
                  title={currentItem.title}
                >
                  <span className="workbench-history-portal-title">
                    {currentItem.kind === 'pod-agent' ? <span className="workbench-history-portal-badge">{t('history.agent')}</span> : null}
                    {currentItem.title}
                  </span>
                  <small>{formatThreadDate(currentItem.lastActivityAt)}</small>
                  <button
                    className="workbench-history-portal-delete"
                    onClick={(event) => { event.stopPropagation(); deleteItem(currentItem); }}
                    title={t('history.deleteConversation')}
                    aria-label={t('history.deleteConversation')}
                  ><Trash2 size={13} /></button>
                </div>
              </>
            ) : null}
            {recentItems.length > 0 ? (
              <>
                <div className="workbench-history-portal-group">{t('history.recent')}</div>
                {recentItems.map((item) => (
                  <div
                    key={item.id}
                    className="workbench-history-portal-item"
                    role="menuitem"
                    onClick={() => pickItem(item)}
                    title={item.title}
                  >
                    <span className="workbench-history-portal-title">
                      {item.kind === 'pod-agent' ? <span className="workbench-history-portal-badge">{t('history.agent')}</span> : null}
                      {item.title}
                    </span>
                    <small>{formatThreadDate(item.lastActivityAt)}</small>
                    <button
                      className="workbench-history-portal-delete"
                      onClick={(event) => { event.stopPropagation(); deleteItem(item); }}
                      title={t('history.deleteConversation')}
                      aria-label={t('history.deleteConversation')}
                    ><Trash2 size={13} /></button>
                  </div>
                ))}
              </>
            ) : null}
            {!currentMatches && recentItems.length === 0 ? (
              <div className="workbench-history-portal-empty">
                {historyQuery.trim() ? t('history.noMatches') : t('history.empty')}
              </div>
            ) : null}
          </div>
          <div className="workbench-history-portal-footer">
            <span><kbd>↩</kbd> {t('history.open')}</span>
            <span><kbd>Esc</kbd> {t('history.close')}</span>
          </div>
        </div>,
        document.body
      ) : null}
      {props.tab === 'chat' ? (
        <ChatPane {...props} />
      ) : props.tab === 'agents' ? (
        <ControlTowerPane
          host={props.host}
          setStatus={props.setStatus}
          attachSkillToChat={props.attachSkillToChat}
          saveLocalJobOutput={props.saveLocalJobOutput}
          openMissionFiles={props.openMissionFiles}
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
  newChat: () => void;
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
  const t = useAtomekT();
  const targetReady = props.selectedChatTarget.available;
  const isAtomekTarget = props.selectedChatTarget.kind === 'atomek-ai';
  const canSend = props.chatInput.trim().length > 0 && !props.busy && targetReady;
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const [stickToLatest, setStickToLatest] = useState(true);
  const [hasHiddenNewOutput, setHasHiddenNewOutput] = useState(false);
  const attachMenuRef = useRef<HTMLDetailsElement | null>(null);
  const targetMenuRef = useRef<HTMLDetailsElement | null>(null);
  const recognitionRef = useRef<unknown>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const voiceSupported = typeof window !== 'undefined' && Boolean((window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition || (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).webkitSpeechRecognition);

  const stopRecording = useCallback(() => {
    const rec = recognitionRef.current as { stop?: () => void } | null;
    try { rec?.stop?.(); } catch { /* ignore */ }
    recognitionRef.current = null;
    if (recordingTimerRef.current !== null) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordingTime(0);
  }, []);

  const startRecording = useCallback(() => {
    if (!voiceSupported || isRecording) return;
    const Ctor = (window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown }).SpeechRecognition
      || (window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor() as {
      lang?: string;
      interimResults?: boolean;
      continuous?: boolean;
      start: () => void;
      stop?: () => void;
      onresult?: (event: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>; resultIndex: number }) => void;
      onerror?: (event: unknown) => void;
      onend?: () => void;
    };
    rec.lang = navigator.language || 'en-US';
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const r = event.results[i];
        if (r.isFinal) transcript += r[0].transcript;
      }
      if (transcript) {
        const next = props.chatInput.trim().length > 0 ? `${props.chatInput} ${transcript}` : transcript;
        props.setChatInput(next);
      }
    };
    rec.onerror = () => { stopRecording(); };
    rec.onend = () => { stopRecording(); };
    recognitionRef.current = rec;
    try {
      rec.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = window.setInterval(() => setRecordingTime((s) => s + 1), 1000) as unknown as number;
    } catch {
      stopRecording();
    }
  }, [voiceSupported, isRecording, props, stopRecording]);

  useEffect(() => () => {
    if (recordingTimerRef.current !== null) window.clearInterval(recordingTimerRef.current);
    const rec = recognitionRef.current as { stop?: () => void } | null;
    try { rec?.stop?.(); } catch { /* ignore */ }
  }, []);

  const formatRecordingTime = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(1, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const closeAttachMenu = () => attachMenuRef.current?.removeAttribute('open');
  const closeTargetMenu = () => targetMenuRef.current?.removeAttribute('open');
  const pickScope = (scope: ChatContextScope) => {
    props.setContextScope(scope);
    if (scope === 'indexed-project') props.refreshProjectIndex();
    closeAttachMenu();
  };
  const pickTarget = (id: string) => {
    props.selectChatTarget(id);
    closeTargetMenu();
  };
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

  const historyMenuRef = useRef<HTMLDetailsElement | null>(null);
  const closeHistoryMenu = () => historyMenuRef.current?.removeAttribute('open');
  return (
    <div className="workbench-chat-wrap">
      <div className="workbench-chat-threadbar">
        <span className="workbench-chat-thread-title" title={props.chatThread?.title ?? props.selectedChatTarget.label}>
          {isAtomekTarget ? (props.chatThread?.title ?? t('chat.atomekChat')) : t('chat.session', { name: props.selectedChatTarget.label })}
        </span>
        <span className="workbench-chat-thread-actions">
          <button
            className="workbench-chat-iconbtn"
            onClick={() => { void props.newChat(); }}
            disabled={props.busy}
            title={isAtomekTarget ? t('chat.newConversation') : t('chat.clearConversation')}
            aria-label={t('chat.newConversation')}
          ><Plus size={15} /></button>
          {isAtomekTarget && props.chatThreads.length > 0 ? (
            <details ref={historyMenuRef} className="workbench-chat-iconmenu">
              <summary className="workbench-chat-iconbtn" title={t('chat.history')} aria-label={t('chat.history')}>
                <Clock size={15} />
              </summary>
              <div className="workbench-chat-history-pop" role="menu">
                <div className="workbench-chat-history-header">{t('chat.chats', { count: props.chatThreads.length })}</div>
                {props.chatThreads.map((thread) => (
                  <button
                    key={thread.id}
                    className={thread.id === props.chatThread?.id ? 'active' : ''}
                    onClick={() => { props.selectThread(thread.id); closeHistoryMenu(); }}
                    title={thread.title}
                  >
                    <span className="workbench-chat-history-title">{thread.title}</span>
                    <small>{formatThreadDate(thread.lastMessageAt ?? thread.updatedAt)}</small>
                  </button>
                ))}
              </div>
            </details>
          ) : null}
          {isAtomekTarget ? (
            <details className="workbench-chat-iconmenu">
              <summary className="workbench-chat-iconbtn" title={t('chat.actions')} aria-label={t('chat.actions')}>
                <MoreHorizontal size={15} />
              </summary>
              <div className="workbench-chat-threadmenu-pop">
                <button
                  onClick={(event) => {
                    event.currentTarget.closest('details')?.removeAttribute('open');
                    if (!props.chatThread) return;
                    const title = window.prompt(t('chat.renamePrompt'), props.chatThread.title);
                    if (title !== null) props.renameThread(props.chatThread.id, title);
                  }}
                  disabled={!props.chatThread || props.busy}
                >
                  Rename
                </button>
                <button
                  className="danger"
                  onClick={(event) => {
                    event.currentTarget.closest('details')?.removeAttribute('open');
                    if (!props.chatThread) return;
                    if (window.confirm(`Delete chat "${props.chatThread.title}"?`)) props.deleteThread(props.chatThread.id);
                  }}
                  disabled={!props.chatThread || props.busy}
                >
                  Delete
                </button>
              </div>
            </details>
          ) : null}
        </span>
      </div>
      <div ref={transcriptRef} className="workbench-chat-transcript" onScroll={handleTranscriptScroll}>
        {props.chatMessages.length === 0 ? (
          <div className="workbench-chat-empty">
            <div>
              <MessageSquareText size={48} />
              <h3>{t('chat.buildWith', { name: props.selectedChatTarget.label })}</h3>
              <p>{props.selectedChatTarget.kind === 'atomek-ai' ? t('chat.emptyAtomek') : t('chat.emptyPod')}</p>
              <p className="workbench-chat-empty-link">{props.aiStatus.available ? props.aiStatus.label : props.aiStatus.reason ?? props.aiStatus.label}</p>
            </div>
          </div>
        ) : props.chatMessages.map((msg) => (
          <div key={msg.id} className={`workbench-chat-message ${msg.role}`}>
            <strong>{msg.role === 'user' ? t('chat.you') : msg.sourceLabel ?? 'Atomek'}</strong>
            {msg.status === 'streaming' ? <em> {t('chat.streaming')}</em> : null}
            {msg.status === 'error' ? <em> {t('chat.error')}</em> : null}
            <br />
            <RichMessageBody body={msg.body} />
            {msg.gatewayLabel ? <><br /><small>{msg.gatewayLabel}</small></> : null}
            {msg.role === 'assistant' && msg.status !== 'streaming' && msg.status !== 'error' ? (
              <div className="workbench-chat-message-actions">
                <button className="workbench-chat-message-action" onClick={() => copyWholeMessage(msg)} title={t('chat.copyAnswer')} aria-label={t('chat.copyAnswer')}><Copy size={14} /></button>
                <button className="workbench-chat-message-action" onClick={() => props.saveMessageAsArtifact(msg)} title={t('chat.saveArtifact')} aria-label={t('chat.saveArtifact')}><FilePlus2 size={14} /></button>
                <button className="workbench-chat-message-action" onClick={() => props.rememberMessage(msg)} title="Store in Atomek memory" aria-label={t('chat.remember')}><GitBranch size={14} /></button>
                <button className="workbench-chat-message-action" onClick={() => props.previewEditFromMessage(msg)} disabled={props.workspaceFileCount === 0} title={t('chat.previewPatch')} aria-label={t('chat.previewPatch')}><Eye size={14} /></button>
                <button className="workbench-chat-message-action regen" onClick={() => props.regenerateMessage(msg)} disabled={props.busy} title={t('chat.regenerate')} aria-label={t('chat.regenerate')}><RefreshCcw size={14} /></button>
              </div>
            ) : null}
            {msg.role === 'assistant' && msg.status === 'error' ? (
              <div className="workbench-chat-message-actions">
                <button className="workbench-chat-message-action" onClick={() => copyWholeMessage(msg)} title={t('chat.copyError')} aria-label={t('chat.copyError')}><Copy size={14} /></button>
                <button className="workbench-chat-message-action regen" onClick={() => props.regenerateMessage(msg)} disabled={props.busy} title={t('chat.retry')} aria-label={t('chat.retry')}><RefreshCcw size={14} /></button>
              </div>
            ) : null}
          </div>
        ))}
        {hasHiddenNewOutput ? <button className="workbench-chat-jump" onClick={jumpToLatest}>{t('chat.jumpLatest')}</button> : null}
      </div>
      <div className="workbench-chat-composer">
        <div className="workbench-chat-tip">
          <span>{t('chat.target')}</span>
          <strong>{props.selectedChatTarget.label}</strong>
          <span className="workbench-chat-tip-sep">·</span>
          <span>{t('chat.context')}</span>
          <strong>{contextScopeLabel(props.contextScope)}</strong>
          <em>{props.selectedChatTarget.kind === 'atomek-ai' ? chatSettingsSummary(props.chatSettings, props.aiStatus.label, props.memoryHitCount) : props.selectedChatTarget.description}</em>
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
              <option value="none">{t('chat.noContext')}</option>
              <option value="active-selection">{t('chat.selection')}</option>
              <option value="active-file">{t('chat.activeFile')}</option>
              <option value="open-editors">{t('chat.openEditors')}</option>
              <option value="indexed-project">{t('chat.indexedProject')}</option>
            </select>
            {props.contextScope === 'indexed-project' ? (
              <>
                <button className="workbench-chat-chip-button" onClick={props.refreshProjectIndex} disabled={props.busy}>
                  <RefreshCcw size={12} /> {t('chat.index')}
                </button>
                <span className={`workbench-chat-chip ${props.projectIndexStale ? 'warn' : 'muted'}`} title="Project index used for query-scoped retrieval">
                  <FileSearch size={13} /> {props.projectIndexSummary}{props.projectIndexStale ? ` · ${t('chat.stale')}` : ''}
                </span>
              </>
            ) : null}
            {props.contextAttachments.length === 0 ? (
              <span className="workbench-chat-chip muted"><Paperclip size={13} /> {t('chat.noFileContext')}</span>
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
                  <button className="workbench-chat-chip-open" onClick={() => props.revealContextAttachment(attachment)} disabled={!attachment.fileId} title={t('chat.revealContext')}><Paperclip size={13} /></button>
                  {attachment.label}
                  {score ? <small>{score}</small> : null}
                  {attachment.snippet ? <small>{attachment.snippet.slice(0, 60)}{attachment.snippet.length > 60 ? '…' : ''}</small> : null}
                  {attachment.dirty ? <small>{t('chat.dirty')}</small> : null}
                  {attachment.removable ? <button className="workbench-chat-chip-remove" onClick={() => props.removeContextAttachment(attachment)} title={t('chat.removeContext')}><X size={11} /></button> : null}
                </span>
              );
            })}
            <button className="workbench-chat-chip-button" onClick={() => props.runQuickPrompt('explain')} disabled={!props.activeFile || props.busy}>{t('chat.explain')}</button>
            <button className="workbench-chat-chip-button" onClick={() => props.runQuickPrompt('improve')} disabled={!props.activeFile || props.busy}>{t('chat.improve')}</button>
            <button className="workbench-chat-chip-button" onClick={() => props.runQuickPrompt('edit')} disabled={!props.activeFile || props.busy}>{t('chat.edit')}</button>
            <button className="workbench-chat-chip-button" onClick={() => props.runQuickPrompt('draft')} disabled={props.busy}>{t('chat.draft')}</button>
          </div>
          {props.pendingPatchPrompt ? (
            <button className="workbench-chat-generate-patch" onClick={props.generatePatchPrompt} disabled={props.busy}>
              {t('chat.generatePatch')}
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
            placeholder={props.selectedChatTarget.kind === 'atomek-ai' ? t('chat.askAtomek') : t('chat.askTarget', { name: props.selectedChatTarget.label })}
            rows={3}
          />
          <div className="workbench-chat-toolbar atomek-input">
            <details ref={attachMenuRef} className="workbench-chat-attach">
              <summary title={t('chat.addContext')} aria-label={t('chat.addContext')}><Plus size={16} /></summary>
              <div className="workbench-chat-attach-menu" role="menu">
                <button onClick={() => pickScope('active-file')} disabled={!props.activeFile} title={t('chat.useActiveFile')}>{t('chat.activeFile')}</button>
                <button onClick={() => pickScope('active-selection')} disabled={!props.activeFile} title={t('chat.useSelection')}>{t('chat.selection')}</button>
                <button onClick={() => pickScope('open-editors')} title={t('chat.useOpenEditors')}>{t('chat.openEditors')}</button>
                <button onClick={() => pickScope('indexed-project')} title={t('chat.useIndexedProject')}>{t('chat.indexedProject')}</button>
                <button onClick={() => pickScope('none')} title={t('chat.noContext')}>{t('chat.noContext')}</button>
              </div>
            </details>

            {isRecording ? (
              <div className="workbench-chat-recording">
                <button className="workbench-chat-recording-cancel" onClick={stopRecording} title={t('chat.cancelRecording')} aria-label={t('chat.cancelRecording')}><X size={14} /></button>
                <span className="workbench-chat-recording-wave" aria-hidden="true">
                  {Array.from({ length: 14 }).map((_, i) => <span key={i} style={{ animationDelay: `${i * 0.05}s` }} />)}
                </span>
                <span className="workbench-chat-recording-dot" aria-hidden="true" />
                <span className="workbench-chat-recording-time">{formatRecordingTime(recordingTime)}</span>
              </div>
            ) : (
              <span className="workbench-chat-route-summary">{props.selectedChatTarget.kind === 'atomek-ai' ? chatSettingsSummary(props.chatSettings, props.aiStatus.label, props.memoryHitCount) : props.selectedChatTarget.description}</span>
            )}

            <div className="workbench-chat-toolbar-right">
              {!isRecording ? (
                <button
                  className="workbench-chat-mic"
                  onClick={startRecording}
                  disabled={!voiceSupported || props.busy}
                  title={voiceSupported ? t('chat.voiceInput') : t('chat.voiceUnsupported')}
                  aria-label={t('chat.voiceInput')}
                >
                  <Mic size={16} />
                </button>
              ) : null}

              <details ref={targetMenuRef} className="workbench-chat-target">
                <summary title={t('chat.chooseTarget')} aria-label={t('chat.chooseTarget')}>
                  <span className="workbench-chat-target-label">{props.selectedChatTarget.label}</span>
                  <ChevronDown size={14} />
                </summary>
                <div className="workbench-chat-target-menu" role="menu">
                  {props.chatTargets.map((target) => (
                    <button
                      key={target.id}
                      onClick={() => pickTarget(target.id)}
                      disabled={!target.available}
                      className={target.id === props.selectedChatTarget.id ? 'active' : ''}
                      title={target.description}
                    >
                      <span className="workbench-chat-target-row-label">{target.label}</span>
                      {target.kind === 'pod-agent' && target.status !== 'running' ? <small>{target.status}</small> : null}
                    </button>
                  ))}
                </div>
              </details>

              {props.busy ? (
                <button className="workbench-chat-send stop" onClick={props.stopChat} title={t('chat.stop')} aria-label={t('chat.stop')}><Square size={14} /></button>
              ) : (
                <button className={`workbench-chat-send ${canSend ? 'ready' : ''}`} onClick={props.askAgent} title={t('chat.send')} disabled={!canSend} aria-label={t('chat.sendMessage')}><ArrowUp size={18} /></button>
              )}
            </div>
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
  const t = useAtomekT();
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
            {output.source === 'ai' ? <button onClick={() => deleteArtifact(output.id)}>{t('chat.delete')}</button> : null}
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

function ControlTowerPane({
  host,
  setStatus,
  attachSkillToChat,
  saveLocalJobOutput,
  openMissionFiles,
  activeFile,
  openEditors,
  variant = 'sidebar',
}: {
  host: HostClient;
  setStatus: (status: string) => void;
  attachSkillToChat: (skill: AtomekSkillSummary) => Promise<void>;
  saveLocalJobOutput: (title: string, body: string) => void;
  openMissionFiles: (mission: MissionFolderState, files: MissionGeneratedFile[], opts?: OpenMissionFilesOptions) => void;
  activeFile: WorkbenchFile | null;
  openEditors: WorkbenchFile[];
  variant?: 'sidebar' | 'dock';
}) {
  const t = useAtomekT();
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
  const [missionFiles, setMissionFiles] = useState<MissionGeneratedFile[]>([]);
  const missionRunsRef = useRef<TytusMissionRun[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('task-execute');
  const [teamView, setTeamView] = useState<'mission' | 'runs' | 'setup'>('mission');
  const activeRun = agentRuns.find((run) => run.status === 'running' || run.status === 'canceling') ?? agentRuns[0] ?? null;
  const hasRunningAgentRun = agentRuns.some((run) => run.status === 'running' || run.status === 'canceling');
  const isDock = variant === 'dock';
  const missionPlanPrompt = mission?.goal || jobPrompt || '';
  const missionPreset = useMemo(() => buildTeamPresetPreview(resourceGraph, pickTeamPresetId(missionPlanPrompt, resourceGraph, mission?.teamPresetId)), [mission?.teamPresetId, missionPlanPrompt, resourceGraph]);
  const missionTasks = useMemo(() => buildMissionTasks(missionPlanPrompt, resourceGraph, missionPreset.id), [missionPlanPrompt, missionPreset.id, resourceGraph]);
  const selectedTask = missionTasks.find((task) => task.id === selectedTaskId) ?? missionTasks[1] ?? missionTasks[0] ?? null;
  const selectedAssignment = useMemo(() => {
    if (!selectedTask) return null;
    return missionPreset.assignments.find((assignment) => assignment.role === selectedTask.role)
      ?? missionPreset.assignments.find((assignment) => assignment.role === 'implementer')
      ?? missionPreset.assignments[0]
      ?? null;
  }, [missionPreset.assignments, selectedTask]);
  const selectedResource = useMemo(() => {
    if (!selectedAssignment || !resourceGraph) return null;
    return resourceGraph.resources.find((resource) => resource.id === selectedAssignment.resourceId) ?? null;
  }, [resourceGraph, selectedAssignment]);
  const missionFilesByPath = useMemo(() => new Map(missionFiles.map((file) => [file.path, file])), [missionFiles]);
  const openMissionFile = useCallback((relPath: string) => {
    if (!mission) {
      setStatus('Start or resume a mission first');
      return;
    }
    const file = missionFilesByPath.get(relPath);
    if (!file) {
      setStatus('Refresh mission pack before opening generated files');
      return;
    }
    openMissionFiles(mission, [file], { primaryOnly: false, activatePath: relPath });
  }, [mission, missionFilesByPath, openMissionFiles, setStatus]);
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
    setMissionFiles([]);
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

  const writeMissionPack = useCallback(async (target: MissionFolderState, prompt: string, extraEvents: MissionAuditEvent[] = [], options: WriteMissionPackOptions = {}) => {
    const nextAudit = [
      ...missionAudit,
      ...extraEvents,
      { ts: new Date().toISOString(), kind: 'mission.pack.write', message: 'Mission context pack written from Atomek' },
    ];
    const selectedPresetId = pickTeamPresetId(prompt || target.goal, resourceGraph, target.teamPresetId);
    const files = buildMissionPackFiles(target, resourceGraph, activeFile, openEditors, prompt, selectedPresetId, [
      nextAudit.map((event) => JSON.stringify(event)).join('\n') + '\n',
    ]).map((file) => file.path === 'RUNS.jsonl'
      ? { ...file, content: missionRunsRef.current.map((run) => JSON.stringify(run)).join('\n') + (missionRunsRef.current.length ? '\n' : '') }
      : file);
    const dirtyMissionPaths = new Set(openEditors
      .filter((file) => file.source === 'mission' && file.dirty && file.mission?.missionId === target.missionId)
      .map((file) => file.mission?.relPath)
      .filter(Boolean) as string[]);
    const filesToWrite = files.filter((file) => !dirtyMissionPaths.has(file.path));
    if (target.rootPath && host.missions?.write) {
      await host.missions.write({ rootPath: target.rootPath, files: filesToWrite });
    } else if (target.handle) {
      await ensureDirectory(target.handle, 'runs');
      await ensureDirectory(target.handle, 'outputs');
      await ensureDirectory(target.handle, 'proposals');
      await ensureDirectory(target.handle, 'approvals');
      for (const file of filesToWrite) await writeMissionFileToBrowserDirectory(target.handle, file.path, file.content);
    } else {
      throw new Error('Mission has neither tray rootPath nor browser folder handle');
    }
    setMissionAudit(nextAudit);
    setMissionFiles(files);
    openMissionFiles(target, files, options.openFiles
      ? { activate: options.activate }
      : { openTabs: false, activate: false, quiet: true });
    saveCurrentMission(target);
  }, [activeFile, host.missions, missionAudit, openEditors, openMissionFiles, resourceGraph]);

  const ensureMissionPack = useCallback(async (prompt: string, options: { allowBrowserPicker?: boolean; openFiles?: boolean; activate?: boolean } = {}): Promise<MissionFolderState | null> => {
    if (mission) {
      await writeMissionPack(mission, prompt, [], { openFiles: Boolean(options.openFiles), activate: options.activate });
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
    await writeMissionPack(nextMission, goal, [event], { openFiles: options.openFiles ?? true, activate: options.activate ?? true });
    setStatus(`Mission pack ready in ${nextMission.rootPath ?? nextMission.name}`);
    return nextMission;
  }, [host.missions, mission, setStatus, writeMissionPack]);

  const openToolInTerminal = useCallback(async (tool: AtomekLocalTool, promptOverride?: string) => {
    if (!host.local?.openTerminal) {
      setStatus('Terminal bridge unavailable in this host build');
      return;
    }
    try {
      const prompt = (promptOverride ?? jobPrompt).trim() || `Open ${tool.label} from Atomek with current context.`;
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
      const nextMission = await ensureMissionPack(jobPrompt.trim(), { allowBrowserPicker: true, openFiles: true, activate: true });
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

  const runLocalJob = useCallback(async (tool: AtomekLocalTool, promptOverride?: string) => {
    if (!host.local?.runJob || !host.local?.streamJob) {
      setStatus('Local job runner unavailable in this host build');
      return;
    }
    const prompt = (promptOverride ?? jobPrompt).trim();
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

  const runPodTask = useCallback(async (resource: TytusResource, promptOverride?: string) => {
    const podId = resourcePodId(resource);
    const routeId = resourceRouteId(resource);
    if (!podId) {
      setStatus(`Cannot dispatch ${resourceDisplayLabel(resource)}: missing pod id`);
      return;
    }
    const prompt = (promptOverride ?? jobPrompt).trim();
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
          data: { resourceId: resource.id, podId, routeId: routeId ?? undefined, taskId: selectedTask?.id ?? 'manual', taskTitle: selectedTask?.title ?? 'Manual pod run' },
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
      pushLine('[Atomek] Routing through pod-agent chat bridge.');
      const message = [
        'You are a Tytus pod agent working from an Atomek mission pack.',
        'Use only the mission/shared-folder context described by the user.',
        'Return findings, markdown, or patch proposals. Do not claim direct writes.',
        'If you propose edits, output unified diff or fenced replacement blocks for Atomek approval.',
        '',
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
      ].filter(Boolean).join('\n');
      let answer = '';
      let sawToken = false;
      for await (const event of host.daemon.chatAgent({
        podId,
        routeId,
        message,
        mode: 'operator',
        target: 'agent',
        modelPreference: 'balanced',
      })) {
        if (event.type === 'profile') {
          pushLine(`[Atomek] ${event.profile === 'local' ? 'Local Cortex' : 'Cloud Cortex'} route selected.`);
        }
        if (event.type === 'session') {
          pushLine('[Atomek] Pod-agent session established.');
        }
        if (event.type === 'token') {
          if (!sawToken) {
            pushLine('[Atomek] Pod agent is responding…');
            sawToken = true;
          }
          answer = sanitizeVisibleAgentText(`${answer}${event.text}`);
        }
        if (event.type === 'error') {
          const safe = friendlyAgentError(event.message);
          throw new Error(safe.message);
        }
        if (event.type === 'done') break;
      }
      answer = answer.trim();
      if (!answer) throw new Error('Pod agent returned no text.');
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

  const runSelectedTask = useCallback(async () => {
    try {
      if (hasRunningAgentRun) {
        setStatus('A mission task is already running. Open Runs or wait for it to finish.');
        setTeamView('runs');
        return;
      }
      if (!selectedTask) {
        setStatus('Select a mission task first');
        return;
      }
      const prompt = selectedTask.prompt;
      setJobPrompt(prompt);
      if (!selectedAssignment) {
        setStatus(`No resource assignment for ${selectedTask.title}`);
        return;
      }
      if (!selectedResource) {
        setStatus(`${selectedAssignment.label} is not ready: ${selectedAssignment.resourceLabel}`);
        return;
      }
      if (selectedResource.status === 'needs-setup' || selectedResource.setupAction) {
        showSetupForResource(selectedResource);
        return;
      }
      if (selectedResource.kind === 'local-cli') {
        const metadataId = typeof selectedResource.metadata?.id === 'string' ? selectedResource.metadata.id : '';
        const toolId = metadataId || selectedResource.id.replace(/^local-cli\./, '');
        const tool = tools.find((candidate) => candidate.id === toolId || candidate.command === toolId || candidate.label.toLowerCase() === selectedResource.label.toLowerCase());
        if (!tool) {
          setStatus(`Local tool not found for ${selectedResource.label}`);
          return;
        }
        if (tool.status !== 'available') {
          setStatus(`${tool.label} is ${tool.status}; open Setup for install/repair`);
          return;
        }
        if (tool.kind === 'ai-cli') {
          await runLocalJob(tool, prompt);
          setTeamView('runs');
          return;
        }
        await openToolInTerminal(tool, prompt);
        return;
      }
      if (selectedResource.kind === 'pod-agent') {
        await runPodTask(selectedResource, prompt);
        setTeamView('runs');
        return;
      }
      if (selectedResource.kind === 'app-skill') {
        const metadataId = typeof selectedResource.metadata?.id === 'string' ? selectedResource.metadata.id : selectedResource.id.replace(/^app-skill\./, '');
        const skill = skills.find((candidate) => candidate.id === metadataId || candidate.id === selectedResource.id.replace(/^app-skill\./, '') || candidate.title === selectedResource.label);
        if (!skill) {
          setStatus(`App skill not found for ${selectedResource.label}`);
          return;
        }
        await attachSkillToChat(skill);
        if (mission) {
          await writeMissionPack(mission, prompt, [{
            ts: new Date().toISOString(),
            kind: 'app-skill.selected',
            message: `Attached app skill ${skill.title} for task ${selectedTask.title}`,
            data: { skillId: skill.id, taskId: selectedTask.id },
          }]);
        }
        setStatus(`Attached ${skill.title} to chat for ${selectedTask.title}`);
        return;
      }
      if (selectedResource.kind === 'shared-folder' || selectedResource.kind === 'workspace') {
        await useResourceInMission(selectedResource);
        setStatus(`${selectedResource.label} selected as mission context. Pick an executable local/pod task to run.`);
        return;
      }
      await useResourceInMission(selectedResource);
    } catch (err) {
      setStatus(`Run task failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [attachSkillToChat, hasRunningAgentRun, mission, openToolInTerminal, runLocalJob, runPodTask, selectedAssignment, selectedResource, selectedTask, setStatus, showSetupForResource, skills, tools, useResourceInMission, writeMissionPack]);

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
        <div className="workbench-section-title">{t('mission.files')}</div>
        <div className="workbench-mission-file-tree">
          {PRIMARY_MISSION_FILE_PATHS.map((relPath) => {
            const file = missionFilesByPath.get(relPath);
            return (
              <button
                key={relPath}
                className="workbench-mission-file-row"
                onClick={() => openMissionFile(relPath)}
                disabled={!mission || !file}
                title={file ? t('mission.files.openFile', { path: relPath }) : t('mission.files.refreshToOpen')}
              >
                <File size={13} />
                <span>{relPath}</span>
                <em>{file ? t('mission.files.generated') : t('mission.files.needsRefresh')}</em>
              </button>
            );
          })}
          <button
            className="workbench-button-subtle"
            onClick={() => mission && openMissionFiles(mission, missionFiles, { primaryOnly: false, activatePath: 'MISSION.md' })}
            disabled={!mission || missionFiles.length === 0}
          >
            {t('mission.files.openGenerated')}
          </button>
          {!missionFiles.length ? <p className="workbench-muted">{t('mission.files.refreshToOpen')}</p> : null}
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
          <button className="workbench-button-subtle" onClick={() => mission && void writeMissionPack(mission, jobPrompt, [], { openFiles: true, activate: true })} disabled={!mission}>
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
        {selectedTask ? (
          <div className="workbench-task-detail">
            <header>
              <div>
                <strong>{t('mission.taskDetail')}</strong>
                <span>{selectedTask.title}</span>
              </div>
              <span className={`workbench-computer-pill ${selectedResource?.status ?? selectedTask.status}`}>{selectedResource?.status ?? selectedTask.status}</span>
            </header>
            <div className="workbench-task-detail-grid">
              <span>{t('mission.assignedResource')}</span>
              <strong>{selectedResource ? resourceDisplayLabel(selectedResource) : selectedTask.assignedResourceLabel}</strong>
              <span>{t('mission.role')}</span>
              <strong>{selectedAssignment?.label ?? selectedTask.role}</strong>
              <span>{t('mission.route')}</span>
              <strong>{selectedResource ? `${selectedResource.kind} · ${selectedResource.sandbox} · ${selectedResource.trustTier}` : selectedTask.resourceHint}</strong>
            </div>
            <div className="workbench-task-output-list">
              <span>{t('mission.expectedOutputs')}</span>
              <ul>
                {selectedTask.expectedOutputs.map((output) => <li key={output}>{output}</li>)}
              </ul>
            </div>
            <div className="workbench-task-detail-actions">
              <button
                className="workbench-button-subtle workbench-agent-primary-action"
                onClick={() => { void runSelectedTask(); }}
                disabled={!selectedTask || hasRunningAgentRun}
              >
                {hasRunningAgentRun ? t('mission.taskRunning') : t('mission.runTask')}
              </button>
              <button className="workbench-button-subtle" onClick={() => setTeamView('runs')}>
                {t('mission.openRuns')}
              </button>
            </div>
          </div>
        ) : null}
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

function StatusBar({ status, file, cursor, fileCount, dirtyCount }: { status: string; file: WorkbenchFile; cursor: CursorPosition; fileCount: number; dirtyCount: number }) {
  const t = useAtomekT();
  const shownStatus = status === 'Ready' ? t('app.ready') : status;
  return (
    <footer className="workbench-statusbar">
      <span>main</span>
      <span>{t('status.files', { count: fileCount })}</span>
      {dirtyCount > 0 && <span>{t('status.unsaved', { count: dirtyCount })}</span>}
      <span className="workbench-status-spacer" />
      <span>{shownStatus}</span>
      <span>{t('status.lineColumn', { line: cursor.lineNumber, column: cursor.column })}</span>
      <span>{t('status.spaces')}</span>
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
      mission: file.mission,
    } satisfies WorkbenchFile));
}

function serializeSessionFiles(files: WorkbenchFile[]): PersistedWorkbenchFile[] {
  let total = 0;
  const maxTotal = 2_000_000;
  return files.slice(0, 160).map((file) => {
    const canPersistContent = total + file.content.length <= maxTotal;
    const content = canPersistContent ? file.content : '';
    total += content.length;
    const mission = file.mission
      ? {
        missionId: file.mission.missionId,
        rootPath: file.mission.rootPath,
        relPath: file.mission.relPath,
        title: file.mission.title,
      }
      : undefined;
    return {
      id: file.id,
      name: file.name,
      path: file.path,
      language: file.language,
      content,
      dirty: file.dirty,
      size: file.size,
      source: file.source,
      mission,
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
