
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import type { AiThread, HostClient } from '@tytus/host-api';
import {
  Blocks,
  Bot,
  Bug,
  ChevronDown,
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
  UserCircle,
  X,
} from 'lucide-react';
import { hasFileSystemAccessApi, openFiles, openFolder, saveWorkbenchFile } from '../fileAccess';
import { labelForLanguage } from '../language';
import { markdownToHtml } from '../markdown';
import type { ActivityView, ChatAiSettings, ChatGatewayPreference, ChatMessage, CursorPosition, OutputArtifact, SecondaryTab, WorkbenchFile, WorkbenchFolder, WorkbenchRange } from '../types';
import { useConversation } from '../ai/useConversation';
import { buildDocumentRegistry } from '../context/documentRegistry';
import { DEFAULT_CHAT_CONTEXT_SCOPE, contextScopeLabel } from '../context/chatContextStore';
import type { ChatContextAttachment, ChatContextScope, ChatContextState } from '../context/chatContextStore';
import { buildAiContext } from '../context/contextBuilder';

const WorkbenchMonacoEditor = lazy(() => import('../editor/WorkbenchMonacoEditor').then((module) => ({ default: module.WorkbenchMonacoEditor })));

const welcomeFile: WorkbenchFile = {
  id: 'welcome',
  name: 'Welcome',
  path: 'Welcome',
  language: 'text',
  content: '',
  dirty: false,
  source: 'sample',
};

const RECENT_KEY = 'tytus.workspace.recent';
const LAYOUT_KEY = 'tytus.workspace.layout';
const CHAT_AI_SETTINGS_KEY = 'tytus.atomek.chatAiSettings';
const DEFAULT_CHAT_AI_SETTINGS: ChatAiSettings = {
  gatewayPreference: 'auto',
  model: '',
};

type Props = { host: HostClient };

type RecentEntry = { name: string; path: string; at: number };
type LayoutPrefs = { primaryVisible: boolean; primaryWidth: number; secondaryVisible: boolean; secondaryWidth: number; markdownPreviewVisible: boolean };
type PaletteItem = { label: string; detail: string; run: () => void; disabled?: boolean };
type SearchResult = { file: WorkbenchFile; lineNumber: number; line: string };
type BottomPanelTab = 'problems' | 'output' | 'terminal';
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

export function WorkbenchShell({ host }: Props) {
  const initialLayout = useMemo(() => readLayoutPrefs(), []);
  const [activity, setActivity] = useState<ActivityView>('explorer');
  const [primaryVisible, setPrimaryVisible] = useState(initialLayout.primaryVisible);
  const [primaryWidth, setPrimaryWidth] = useState(initialLayout.primaryWidth);
  const [secondaryTab, setSecondaryTab] = useState<SecondaryTab>('chat');
  const [secondaryVisible, setSecondaryVisible] = useState(initialLayout.secondaryVisible);
  const [secondaryWidth, setSecondaryWidth] = useState(initialLayout.secondaryWidth);
  const [bottomPanelVisible, setBottomPanelVisible] = useState(false);
  const [bottomPanelTab, setBottomPanelTab] = useState<BottomPanelTab>('problems');
  const [markdownPreviewVisible, setMarkdownPreviewVisible] = useState(initialLayout.markdownPreviewVisible);
  const [welcomeClosed, setWelcomeClosed] = useState(false);
  const [folder, setFolder] = useState<WorkbenchFolder | null>(null);
  const [files, setFiles] = useState<WorkbenchFile[]>([]);
  const [openEditorIds, setOpenEditorIds] = useState<string[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState<CursorPosition>({ lineNumber: 1, column: 1 });
  const [activeSelection, setActiveSelection] = useState<WorkbenchRange | null>(null);
  const [documentVersions, setDocumentVersions] = useState<Record<string, number>>({});
  const [chatContextScope, setChatContextScope] = useState<ChatContextScope>(DEFAULT_CHAT_CONTEXT_SCOPE);
  const [removedContextAttachmentIds, setRemovedContextAttachmentIds] = useState<string[]>([]);
  const [pendingPatchPrompt, setPendingPatchPrompt] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [outputs, setOutputs] = useState<OutputArtifact[]>([]);
  const [pendingEdit, setPendingEdit] = useState<PendingEdit | null>(null);
  const [pendingWorkspacePatch, setPendingWorkspacePatch] = useState<PendingWorkspacePatch | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chatSettings, setChatSettings] = useState<ChatAiSettings>(() => readChatAiSettings());
  const [aiDirtyNotice, setAiDirtyNotice] = useState<string | null>(null);
  const [revealLine, setRevealLine] = useState<number | null>(null);
  const [status, setStatus] = useState('Ready');
  const [recent, setRecent] = useState<RecentEntry[]>(() => readRecent());

  const openEditors = openEditorIds.map((id) => files.find((file) => file.id === id)).filter(Boolean) as WorkbenchFile[];
  const activeFile = activeFileId ? files.find((file) => file.id === activeFileId) ?? null : null;
  const documentRegistry = useMemo(() => buildDocumentRegistry({ files, openEditorIds, activeFileId, versions: documentVersions, activeSelection }), [activeFileId, activeSelection, documentVersions, files, openEditorIds]);
  const chatContextState = useMemo<ChatContextState>(() => ({
    scope: chatContextScope,
    removedAttachmentIds: removedContextAttachmentIds,
    selectedFileIds: [],
  }), [chatContextScope, removedContextAttachmentIds]);
  const builtChatContext = useMemo(() => buildAiContext(documentRegistry, files, chatContextState), [chatContextState, documentRegistry, files]);
  const ai = useConversation({ host, requestContext: builtChatContext.parts, chatSettings, setStatus });
  const combinedOutputs = useMemo(
    () => [...ai.artifacts, ...outputs].sort((a, b) => b.createdAt - a.createdAt),
    [ai.artifacts, outputs],
  );
  const showWelcome = !activeFile && !welcomeClosed;
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
  }, [activeFileId, chatContextScope, openEditorIds]);

  const removeContextAttachment = useCallback((attachment: ChatContextAttachment) => {
    setRemovedContextAttachmentIds((ids) => ids.includes(attachment.id) ? ids : [...ids, attachment.id]);
    setStatus(`Removed chat context: ${attachment.label}`);
  }, []);


  const bumpDocumentVersion = useCallback((fileId: string) => {
    setDocumentVersions((current) => ({ ...current, [fileId]: (current[fileId] ?? 1) + 1 }));
  }, []);

  const beginSecondaryResize = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = secondaryWidth;
    const onMove = (moveEvent: PointerEvent) => {
      const next = startWidth + (startX - moveEvent.clientX);
      setSecondaryWidth(Math.max(380, Math.min(760, next)));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [secondaryWidth]);

  const beginPrimaryResize = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = primaryWidth;
    const onMove = (moveEvent: PointerEvent) => {
      const next = startWidth + (moveEvent.clientX - startX);
      setPrimaryWidth(Math.max(240, Math.min(460, next)));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [primaryWidth]);

  const remember = useCallback((entry: RecentEntry) => {
    const next = [entry, ...recent.filter((item) => item.path !== entry.path)].slice(0, 6);
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  }, [recent]);

  const openWorkbenchFile = useCallback((file: WorkbenchFile, lineNumber?: number) => {
    setOpenEditorIds((ids) => ids.includes(file.id) ? ids : [...ids, file.id]);
    setActiveFileId(file.id);
    setWelcomeClosed(false);
    setRevealLine(lineNumber ?? null);
    setCursor({ lineNumber: lineNumber ?? 1, column: 1 });
  }, []);

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
      picked.forEach((file) => remember({ name: file.name, path: file.path, at: Date.now() }));
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
      setFolder(picked);
      setFiles(picked.files);
      setOpenEditorIds([]);
      setActiveFileId(null);
      setWelcomeClosed(false);
      remember({ name: picked.name, path: picked.name, at: Date.now() });
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
    void ai.askAgent(prompt).then((message) => {
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
    });
  }, [activeFile, ai, openEditors.length]);

  const reopenRecent = useCallback((entry: RecentEntry) => {
    const existing = files.find((file) => file.path === entry.path || file.name === entry.name);
    if (existing) {
      openWorkbenchFile(existing);
      setStatus(`Opened recent ${existing.name}`);
      return;
    }
    setStatus('Browser security requires permission again — use Open File or Open Folder to reopen local content.');
  }, [files, openWorkbenchFile]);

  const askAiWithPrompt = useCallback((prompt: string) => {
    setSecondaryVisible(true);
    setSecondaryTab('chat');
    setChatInput('');
    void ai.askAgent(prompt);
  }, [ai]);

  const regenerateMessage = useCallback((message: ChatMessage) => {
    const index = ai.messages.findIndex((candidate) => candidate.id === message.id);
    const previousUser = ai.messages.slice(0, index < 0 ? undefined : index).reverse().find((candidate) => candidate.role === 'user');
    if (!previousUser?.body.trim()) {
      setStatus('No previous user prompt to regenerate from');
      return;
    }
    void ai.askAgent(previousUser.body);
  }, [ai]);

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

  const previewEditFromText = useCallback((sourceTitle: string, body: string): boolean => {
    const workspacePatch = extractWorkspacePatch(body, files, sourceTitle);
    if (workspacePatch.edits.length > 1) {
      setPendingWorkspacePatch(workspacePatch);
      setPendingEdit(null);
      setStatus(`Previewing AI workspace patch for ${workspacePatch.edits.length} files`);
      return true;
    }
    if (workspacePatch.edits.length === 1) {
      setPendingEdit(workspacePatch.edits[0]);
      setPendingWorkspacePatch(null);
      setStatus(`Previewing AI patch for ${workspacePatch.edits[0].fileName}`);
      return true;
    }
    if (!activeFile) {
      setStatus('Open a file before previewing an AI edit, or ask Atomek for a git-style diff against opened files.');
      return false;
    }
    const extracted = extractEditableSuggestion(body, activeFile);
    if (!extracted) {
      setStatus('No fenced replacement block or applicable unified diff found. Ask Atomek for an edit again.');
      return false;
    }
    setPendingWorkspacePatch(null);
    setPendingEdit({
      fileId: activeFile.id,
      fileName: activeFile.path,
      originalContent: activeFile.content,
      proposedContent: extracted.content,
      sourceTitle,
      extractionLabel: extracted.label,
      stats: diffStats(activeFile.content, extracted.content),
    });
    setStatus(`Previewing AI edit for ${activeFile.name}`);
    return true;
  }, [activeFile, files]);

  const askAgent = useCallback(() => {
    const prompt = chatInput.trim();
    if (!prompt) return;
    setChatInput('');
    const shouldAutoPreviewEdit = looksLikeEditPrompt(prompt);
    void ai.askAgent(prompt).then((message) => {
      if (!shouldAutoPreviewEdit || !message || message.status === 'error') return;
      const ok = previewEditFromText(message.body.split('\n').find(Boolean)?.replace(/^#+\s*/, '').slice(0, 80) || 'Atomek edit', message.body);
      if (!ok) setStatus('Edit request answered without a patch. Use Generate patch / Edit to request an applicable diff.');
    });
  }, [ai, chatInput, previewEditFromText]);

  const generatePatchPrompt = useCallback(() => {
    if (!pendingPatchPrompt) return;
    setPendingPatchPrompt(null);
    askAiWithPrompt(editPromptWithPatchInstructions(pendingPatchPrompt));
  }, [askAiWithPrompt, pendingPatchPrompt]);

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
    setStatus(`Applied AI edit to ${current.name} — unsaved`);
  }, [bumpDocumentVersion, files, pendingEdit]);

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
    setStatus(`Applied AI workspace patch to ${editsById.size} file${editsById.size === 1 ? '' : 's'} — unsaved`);
  }, [bumpDocumentVersion, files, pendingWorkspacePatch]);

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
    const prefs: LayoutPrefs = { primaryVisible, primaryWidth, secondaryVisible, secondaryWidth, markdownPreviewVisible };
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(prefs));
  }, [markdownPreviewVisible, primaryVisible, primaryWidth, secondaryVisible, secondaryWidth]);

  useEffect(() => {
    localStorage.setItem(CHAT_AI_SETTINGS_KEY, JSON.stringify(chatSettings));
  }, [chatSettings]);

  return (
    <div
      className={`workbench-workbench ${primaryVisible ? '' : 'no-primary'} ${secondaryVisible ? '' : 'no-secondary'} ${bottomPanelVisible ? 'has-bottom-panel' : ''}`}
      data-app="workbench-vscode-base"
      style={{ '--workbench-primary-width': `${primaryWidth}px`, '--workbench-secondary-width': `${secondaryWidth}px` } as CSSProperties}
    >
      <ActivityBar active={activity} setActive={(view) => { setActivity(view); setPrimaryVisible(true); }} openSettings={() => setSettingsOpen(true)} />
      {primaryVisible && (
        <div className="workbench-primary-region">
          <PrimarySidebar
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
            setActiveFileId={setActiveFileId}
            closeEditor={closeEditor}
            saveFile={(id) => { void saveFileById(id); }}
            closeWelcome={() => setWelcomeClosed(true)}
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
            ) : showWelcome ? (
              <WelcomePage openFile={handleOpenFile} openFolder={handleOpenFolder} newFile={newUntitled} recent={recent} reopenRecent={reopenRecent} setStatus={setStatus} />
            ) : (
              <div className="workbench-no-editor">
                <FileSearch size={34} />
                <p>No editor open</p>
                <button className="workbench-button-subtle" onClick={() => setWelcomeClosed(false)}>Show Welcome</button>
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
              openOutputAsFile={openOutputAsFile}
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
          openSettings={() => setSettingsOpen(true)}
          busy={ai.busy}
          memoryHitCount={ai.memoryHits.length}
          outputs={combinedOutputs}
          runAiSynthesis={runAiSynthesis}
          openOutputAsFile={openOutputAsFile}
          previewEditFromOutput={(output) => previewEditFromText(output.title, output.body)}
          canPreviewEdit={files.length > 0}
          clearOutputs={() => setOutputs([])}
          deleteArtifact={(id) => { void ai.deleteArtifact(id); }}
          host={host}
          activeFile={activeFile}
          contextScope={chatContextScope}
          setContextScope={setChatContextScope}
          contextAttachments={builtChatContext.attachments}
          removeContextAttachment={removeContextAttachment}
          revealContextAttachment={revealContextAttachment}
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
            ...recent.map((item) => ({ label: `File: Open Recent — ${item.name}`, detail: item.path, run: () => reopenRecent(item) })),
            { label: 'File: Save All', detail: `${dirtyFiles.length} dirty file${dirtyFiles.length === 1 ? '' : 's'}`, run: () => { void saveAllDirty(); }, disabled: dirtyFiles.length === 0 },
            { label: 'File: Close All Editors', detail: `${openEditors.length} open editor${openEditors.length === 1 ? '' : 's'}`, run: closeAllEditors, disabled: openEditors.length === 0 },
            { label: 'Search: Find in Files', detail: 'Open the VS Code-style search side bar', run: () => { setActivity('search'); setPrimaryVisible(true); } },
            { label: 'Help: Show Welcome', detail: 'Open the workbench welcome page', run: () => { setActiveFileId(null); setWelcomeClosed(false); } },
            { label: 'View: Toggle Primary Side Bar', detail: primaryVisible ? 'Hide Explorer side bar' : 'Show Explorer side bar', run: () => setPrimaryVisible((value) => !value) },
            { label: 'View: Toggle Chat Panel', detail: secondaryVisible ? 'Hide right AI side bar' : 'Show right AI side bar', run: () => setSecondaryVisible((value) => !value) },
            { label: 'View: Toggle Bottom Panel', detail: bottomPanelVisible ? 'Hide Problems/Output/Terminal panel' : 'Show Problems/Output/Terminal panel', run: () => setBottomPanelVisible((value) => !value) },
            { label: 'View: Toggle Markdown Preview', detail: activeFile?.language === 'markdown' ? 'Show or hide Markdown preview split' : 'Available for Markdown files', run: () => setMarkdownPreviewVisible((value) => !value), disabled: activeFile?.language !== 'markdown' },
            { label: 'Atomek: Create AI Synthesis', detail: activeFile || openEditors.length > 0 ? 'Ask AIL to produce a saved Markdown artifact' : 'Open a file first', run: runAiSynthesis, disabled: !activeFile && openEditors.length === 0 },
            { label: 'AI: Explain Active File', detail: activeFile ? `Ask Cortex to explain ${activeFile.path}` : 'Open a file first', run: () => askAiWithPrompt('Explain the active file. Focus on purpose, structure, risks, and next useful edits.'), disabled: !activeFile },
            { label: 'AI: Improve Active File', detail: activeFile ? `Ask Cortex for concrete edits to ${activeFile.path}` : 'Open a file first', run: () => askAiWithPrompt('Review the active file and propose the smallest concrete improvements. Include exact snippets if useful.'), disabled: !activeFile },
            { label: 'AI: Draft Editable Replacement', detail: activeFile ? `Ask Cortex for a full-file replacement for ${activeFile.path}` : 'Open a file first', run: () => runQuickPrompt('edit'), disabled: !activeFile },
            { label: 'AI: Plan Workspace Work', detail: openEditors.length > 0 ? 'Use open editors as bounded context' : 'Open files first', run: () => askAiWithPrompt('Create an implementation plan from the open editor context. Be specific and sequence the work.'), disabled: openEditors.length === 0 },
            { label: 'AI: Save Active File as Artifact', detail: activeFile ? 'Persist active file in host.ai artifacts' : 'Open a file first', run: saveActiveFileAsArtifact, disabled: !activeFile },
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
      {settingsOpen && (
        <AtomekSettingsDialog
          host={host}
          chatSettings={chatSettings}
          onChange={setChatSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      <StatusBar status={status} file={activeFile ?? welcomeFile} cursor={cursor} fileCount={files.length} dirtyCount={dirtyFiles.length} />
    </div>
  );
}

function ActivityBar({ active, setActive, openSettings }: { active: ActivityView; setActive: (view: ActivityView) => void; openSettings: () => void }) {
  return (
    <aside className="workbench-activity-bar" aria-label="Activity Bar">
      <ActivityButton icon={<File size={25} />} label="Explorer" active={active === 'explorer'} onClick={() => setActive('explorer')} />
      <ActivityButton icon={<Search size={25} />} label="Search" active={active === 'search'} onClick={() => setActive('search')} />
      <ActivityButton icon={<GitBranch size={25} />} label="Source Control" active={active === 'source-control'} onClick={() => setActive('source-control')} />
      <ActivityButton icon={<Bug size={25} />} label="Run and Debug" active={active === 'run'} onClick={() => setActive('run')} />
      <ActivityButton icon={<Blocks size={25} />} label="Extensions" active={active === 'extensions'} onClick={() => setActive('extensions')} />
      <div className="workbench-activity-spacer" />
      <ActivityButton icon={<UserCircle size={23} />} label="Accounts" active={false} onClick={() => undefined} />
      <ActivityButton icon={<Settings size={23} />} label="Manage" active={false} onClick={openSettings} />
    </aside>
  );
}

function ActivityButton({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return <button className={`workbench-activity-button ${active ? 'active' : ''}`} title={label} aria-label={label} onClick={onClick}>{icon}</button>;
}

function PrimarySidebar(props: {
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
}) {
  if (props.activity === 'search') return <SearchPane files={props.files} query={props.query} setQuery={props.setQuery} openWorkbenchFile={props.openWorkbenchFile} activeFileId={props.activeFileId} />;
  if (props.activity === 'source-control') return <PlaceholderPane title="SOURCE CONTROL" body="No source control provider registered. Git belongs here, not as a fake demo." />;
  if (props.activity === 'run') return <PlaceholderPane title="RUN AND DEBUG" body="Run configurations, terminals, and recipe execution will plug into this surface later." />;
  if (props.activity === 'extensions') return <ExtensionsPane />;
  return <ExplorerPane {...props} />;
}

function ExplorerPane(props: Omit<Parameters<typeof PrimarySidebar>[0], 'activity'>) {
  const noFolder = !props.folder;
  const tree = useMemo(() => buildFileTree(props.files, props.folder?.name), [props.files, props.folder?.name]);
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
            <button className="workbench-button-blue" onClick={() => props.recent[0] ? props.reopenRecent(props.recent[0]) : props.setStatus('No recent local workspace yet.')}>Open Recent</button>
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
              <FileRow key={file.id} file={file} active={file.id === props.activeFileId} onOpen={() => props.openWorkbenchFile(file)} />
            ))}
            <div className="workbench-section-title"><ChevronDown size={12} /> {props.folder?.name ?? 'Workspace'}</div>
            {tree.length === 0 ? <p className="workbench-muted">No readable text files found.</p> : renderTreeNodes(tree, props.activeFileId, props.openWorkbenchFile)}
          </>
        )}
        <div className="workbench-section-title">Recent</div>
        {props.recent.length === 0 ? <p className="workbench-muted">No recent folders yet.</p> : props.recent.map((item) => <button key={`${item.path}-${item.at}`} className="workbench-tree-row" onClick={() => props.reopenRecent(item)}><Folder size={14} /><span className="workbench-row-name">{item.name}</span></button>)}
      </div>
    </aside>
  );
}

function FileRow({ file, active, onOpen, basePath, depth = 0, label }: { file: WorkbenchFile; active: boolean; onOpen: () => void; basePath?: string; depth?: number; label?: string }) {
  const displayPath = basePath && file.path.startsWith(`${basePath}/`) ? file.path.slice(basePath.length + 1) : file.path;
  const displayDepth = depth || Math.max(0, displayPath.split('/').length - 1);
  return (
    <button className={`workbench-file-row ${active ? 'active' : ''}`} style={{ '--workbench-depth': displayDepth } as CSSProperties} onClick={onOpen} title={file.path}>
      <FileCode2 size={14} />
      <span className="workbench-row-name">{label ?? displayPath}</span>
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

function renderTreeNodes(nodes: TreeNode[], activeFileId: string | null, openWorkbenchFile: (file: WorkbenchFile) => void, depth = 0): ReactNode {
  return nodes.map((node) => {
    if (node.file) {
      return <FileRow key={node.file.id} file={node.file} active={node.file.id === activeFileId} onOpen={() => openWorkbenchFile(node.file as WorkbenchFile)} depth={depth} label={node.name} />;
    }
    return (
      <div key={node.path}>
        <div className="workbench-folder-row" style={{ '--workbench-depth': depth } as CSSProperties}>
          <ChevronDown size={12} />
          <FolderOpen size={14} />
          <span className="workbench-row-name">{node.name}</span>
        </div>
        {renderTreeNodes(node.children, activeFileId, openWorkbenchFile, depth + 1)}
      </div>
    );
  });
}

function BreadcrumbBar({ file, folder, showWelcome }: { file: WorkbenchFile | null; folder: WorkbenchFolder | null; showWelcome: boolean }) {
  const parts = showWelcome ? ['Welcome'] : (file?.path.split('/').filter(Boolean) ?? []);
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
  setActiveFileId: (id: string | null) => void;
  closeEditor: (id: string) => void;
  saveFile: (id: string) => void;
  closeWelcome: () => void;
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
          <span className="workbench-tab-name">Welcome</span>
          <span className="workbench-tab-close" role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); props.closeWelcome(); }}><X size={13} /></span>
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

function WelcomePage({ openFile, openFolder, newFile, recent, reopenRecent, setStatus }: { openFile: () => void; openFolder: () => void; newFile: () => void; recent: RecentEntry[]; reopenRecent: (entry: RecentEntry) => void; setStatus: (status: string) => void }) {
  return (
    <div className="workbench-welcome">
      <div className="workbench-welcome-grid">
        <section>
          <h1>Atomek</h1>
          <div className="workbench-welcome-subtitle">Shape files into working artifacts</div>
          <h2>Start</h2>
          <button className="workbench-start-link" onClick={newFile}><FilePlus2 size={18} />New File...</button>
          <button className="workbench-start-link" onClick={openFile}><File size={18} />Open File...</button>
          <button className="workbench-start-link" onClick={openFolder}><FolderOpen size={18} />Open Folder...</button>
          <h2>Recent</h2>
          {recent.length === 0 ? <p className="workbench-muted">No recent folders, open a folder to start.</p> : recent.map((item) => <button key={`${item.path}-${item.at}`} className="workbench-start-link" onClick={() => reopenRecent(item)}>{item.name}<span className="workbench-muted">~</span></button>)}
        </section>
        <section>
          <h2>Walkthroughs</h2>
          <div className="workbench-walkthrough-card"><strong>Get Started with Atomek</strong><span className="workbench-muted">Open local files, edit with Monaco, then wire Tytus agents and Cortex next.</span></div>
          <div className="workbench-walkthrough-card"><strong>Browse & Edit Local Workspaces</strong><span className="workbench-muted">Uses browser-native File System Access API on supported Chromium builds.</span></div>
          <div className="workbench-walkthrough-card"><strong>Learn the Fundamentals</strong><span className="workbench-muted">Explorer, tabs, editor, status bar, chat surface.</span></div>
        </section>
      </div>
      <label className="workbench-welcome-checkbox"><input type="checkbox" defaultChecked /> Show welcome page on startup</label>
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

function BottomPanel(props: {
  tab: BottomPanelTab;
  setTab: (tab: BottomPanelTab) => void;
  outputs: OutputArtifact[];
  clearOutputs: () => void;
  deleteArtifact: (id: string) => void;
  runAiSynthesis: () => void;
  openOutputAsFile: (output: OutputArtifact) => void;
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
          <div>
            <p className="workbench-muted">Terminal is parked. Native command execution belongs to the pod/daemon integration sprint.</p>
            <pre className="workbench-terminal-placeholder">$ atomek --local-first</pre>
          </div>
        )}
        {props.tab === 'output' && (
          <OutputsPane outputs={props.outputs} clearOutputs={props.clearOutputs} deleteArtifact={props.deleteArtifact} runAiSynthesis={props.runAiSynthesis} openOutputAsFile={props.openOutputAsFile} compact />
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
  openSettings: () => void;
  busy: boolean;
  memoryHitCount: number;
  outputs: OutputArtifact[];
  runAiSynthesis: () => void;
  openOutputAsFile: (output: OutputArtifact) => void;
  previewEditFromOutput: (output: OutputArtifact) => void;
  canPreviewEdit: boolean;
  clearOutputs: () => void;
  deleteArtifact: (id: string) => void;
  host: HostClient;
  activeFile: WorkbenchFile | null;
  contextScope: ChatContextScope;
  setContextScope: (scope: ChatContextScope) => void;
  contextAttachments: ChatContextAttachment[];
  removeContextAttachment: (attachment: ChatContextAttachment) => void;
  revealContextAttachment: (attachment: ChatContextAttachment) => void;
  onResizeStart: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onClose: () => void;
}) {
  return (
    <aside className="workbench-secondary">
      <div className="workbench-secondary-resizer" onPointerDown={props.onResizeStart} title="Resize Chat" />
      <div className="workbench-secondary-tabs">
        <div className="workbench-secondary-tab-group">
          <button className={`workbench-secondary-tab ${props.tab === 'chat' ? 'active' : ''}`} onClick={() => props.setTab('chat')}>CHAT</button>
          <button className={`workbench-secondary-tab ${props.tab === 'outputs' ? 'active' : ''}`} onClick={() => props.setTab('outputs')}>OUTPUTS</button>
        </div>
        <div className="workbench-secondary-actions">
          <button title="New Chat" onClick={props.newChat}><Plus size={15} /></button>
          <button title="Chat Settings" onClick={props.openSettings}><MoreHorizontal size={16} /></button>
          <button title="Close Chat" onClick={props.onClose}><X size={15} /></button>
        </div>
      </div>
      {props.tab === 'chat' ? <ChatPane {...props} /> : <OutputsPane outputs={props.outputs} clearOutputs={props.clearOutputs} deleteArtifact={props.deleteArtifact} runAiSynthesis={props.runAiSynthesis} openOutputAsFile={props.openOutputAsFile} previewEditFromOutput={props.previewEditFromOutput} canPreviewEdit={props.canPreviewEdit} />}
    </aside>
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
  aiStatus: { available: boolean; label: string; reason?: string };
  chatSettings: ChatAiSettings;
  openSettings: () => void;
  busy: boolean;
  memoryHitCount: number;
}) {
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

  return (
    <div className="workbench-chat-wrap">
      <div className="workbench-chat-threadbar">
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
      </div>
      <div ref={transcriptRef} className="workbench-chat-transcript" onScroll={handleTranscriptScroll}>
        {props.chatMessages.length === 0 ? (
          <div className="workbench-chat-empty">
            <div>
              <MessageSquareText size={48} />
              <h3>Build with Agent</h3>
              <p>Ask about open files, request a plan, or draft an artifact.</p>
              <p className="workbench-chat-empty-link">{props.aiStatus.available ? props.aiStatus.label : props.aiStatus.reason ?? props.aiStatus.label}</p>
            </div>
          </div>
        ) : props.chatMessages.map((msg) => (
          <div key={msg.id} className={`workbench-chat-message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'Atomek'}</strong>
            {msg.status === 'streaming' ? <em> streaming</em> : null}
            {msg.status === 'error' ? <em> error</em> : null}
            <br />
            {msg.body}
            {msg.gatewayLabel ? <><br /><small>{msg.gatewayLabel}</small></> : null}
            {msg.role === 'assistant' && msg.status !== 'streaming' && msg.status !== 'error' ? (
              <div className="workbench-chat-message-actions">
                <button onClick={() => props.saveMessageAsArtifact(msg)}>Save artifact</button>
                <button onClick={() => props.rememberMessage(msg)}>Remember</button>
                <button onClick={() => props.previewEditFromMessage(msg)} disabled={props.workspaceFileCount === 0}>Preview edit</button>
                <button onClick={() => props.regenerateMessage(msg)} disabled={props.busy}><RefreshCcw size={11} /> Regenerate</button>
              </div>
            ) : null}
            {msg.role === 'assistant' && msg.status === 'error' ? (
              <div className="workbench-chat-message-actions">
                <button onClick={() => props.regenerateMessage(msg)} disabled={props.busy}>Retry</button>
              </div>
            ) : null}
          </div>
        ))}
        {hasHiddenNewOutput ? <button className="workbench-chat-jump" onClick={jumpToLatest}>Jump to latest</button> : null}
      </div>
      <div className="workbench-chat-composer">
        <div className="workbench-chat-tip">
          <span>Context</span>
          <strong>{contextScopeLabel(props.contextScope)}</strong>
          <em>{chatSettingsSummary(props.chatSettings, props.aiStatus.label, props.memoryHitCount)}</em>
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
            </select>
            {props.contextAttachments.length === 0 ? (
              <span className="workbench-chat-chip muted"><Paperclip size={13} /> No file context</span>
            ) : props.contextAttachments.map((attachment) => (
              <span key={attachment.id} className="workbench-chat-chip" title={[attachment.path, attachment.range ? `${attachment.range.startLineNumber}:${attachment.range.startColumn}-${attachment.range.endLineNumber}:${attachment.range.endColumn}` : null, attachment.dirty ? 'dirty' : null].filter(Boolean).join(' · ')}>
                <button className="workbench-chat-chip-open" onClick={() => props.revealContextAttachment(attachment)} disabled={!attachment.fileId} title="Reveal context"><Paperclip size={13} /></button>
                {attachment.label}
                {attachment.dirty ? <small>dirty</small> : null}
                {attachment.removable ? <button className="workbench-chat-chip-remove" onClick={() => props.removeContextAttachment(attachment)} title="Remove context"><X size={11} /></button> : null}
              </span>
            ))}
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
            placeholder="Ask Atomek about the open file or describe what to build..."
            rows={3}
          />
          <div className="workbench-chat-toolbar">
            <button className="workbench-chat-mode" onClick={props.openSettings} title="Chat AI settings">
              {chatGatewayLabel(props.chatSettings.gatewayPreference)} <ChevronDown size={12} />
            </button>
            <button className="workbench-chat-mode" onClick={() => props.runQuickPrompt('plan')} disabled={props.busy}>Plan</button>
            <span />
            {props.busy ? (
              <button className="workbench-chat-send stop" onClick={props.stopChat} title="Stop"><Square size={14} /></button>
            ) : (
              <button className="workbench-chat-send" onClick={props.askAgent} title="Send"><Send size={16} /></button>
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
  const model = settings.model.trim();
  const routing = settings.gatewayPreference === 'auto'
    ? statusLabel
    : chatGatewayLabel(settings.gatewayPreference);
  const parts = [routing];
  if (model) parts.push(model);
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
  return /(change|edit|modify|replace|update|rename|fix|rewrite|apply)/i.test(prompt)
    && /(file|code|author|title|line|function|component|content|text|this|it)/i.test(prompt);
}

function editPromptWithPatchInstructions(prompt: string): string {
  return [
    prompt,
    'Atomek edit instruction: if this request should change an open file, return an applicable git-style unified diff in a fenced diff block. Use paths exactly as shown in the attached context. If one whole-file replacement is safer, return a fenced atomek-replace block. Do not claim a file changed unless you provide a patch/replacement Atomek can preview.',
  ].join('\n\n');
}

function AtomekSettingsDialog(props: {
  host: HostClient;
  chatSettings: ChatAiSettings;
  onChange: (settings: ChatAiSettings) => void;
  onClose: () => void;
}) {
  const [models, setModels] = useState<Array<{ id: string; gatewayLabel: string }>>([]);
  const [modelsStatus, setModelsStatus] = useState('Loading gateway models…');

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

  const setGatewayPreference = (gatewayPreference: ChatGatewayPreference) => {
    props.onChange({ ...props.chatSettings, gatewayPreference });
  };
  const setModel = (model: string) => {
    props.onChange({ ...props.chatSettings, model });
  };

  return (
    <div className="workbench-settings-backdrop" onClick={props.onClose}>
      <section className="workbench-settings-dialog" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Atomek Settings">
        <header className="workbench-settings-header">
          <SlidersHorizontal size={15} />
          <strong>Atomek Settings</strong>
          <button onClick={props.onClose} title="Close"><X size={15} /></button>
        </header>
        <div className="workbench-settings-body">
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
        </div>
        <footer className="workbench-settings-footer">
          <button onClick={() => props.onChange(DEFAULT_CHAT_AI_SETTINGS)}>Reset</button>
          <button onClick={props.onClose}>Done</button>
        </footer>
      </section>
    </div>
  );
}

function OutputsPane({ outputs, clearOutputs, deleteArtifact, runAiSynthesis, openOutputAsFile, previewEditFromOutput, canPreviewEdit = false, compact = false }: { outputs: OutputArtifact[]; clearOutputs: () => void; deleteArtifact: (id: string) => void; runAiSynthesis: () => void; openOutputAsFile: (output: OutputArtifact) => void; previewEditFromOutput?: (output: OutputArtifact) => void; canPreviewEdit?: boolean; compact?: boolean }) {
  return (
    <div className={`workbench-panel-list ${compact ? 'compact' : ''}`}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <button className="workbench-button-subtle" onClick={runAiSynthesis}><Bot size={14} />AI synthesis</button>
        <button className="workbench-button-subtle" onClick={clearOutputs}>Clear</button>
      </div>
      {outputs.length === 0 ? <p className="workbench-muted">No outputs yet. Save an AI answer as an artifact or create an AI synthesis.</p> : outputs.map((output) => (
        <div key={output.id} className="workbench-output-card">
          <div className="workbench-output-head">
            <strong>{output.title}</strong>
            <span>{output.source === 'ai' ? `AI · ${output.kind}` : output.kind}</span>
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
          {output.body}
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

function ExtensionsPane() {
  const items = [
    { name: 'Agents', detail: 'chat, planning, repo edits' },
    { name: 'Pods', detail: 'allocated pod tools + local gateway' },
    { name: 'local AIL', detail: 'local/private model routing' },
    { name: 'Swarm', detail: 'parallel specialist workers' },
    { name: 'Remotion', detail: 'video render recipes' },
    { name: 'Hyperframes', detail: 'interactive app frames and tool connectors' },
    { name: 'Blender', detail: '3D scene generation' },
    { name: 'Media tools', detail: 'image/video/audio source cards' },
    { name: 'Artifact recipes', detail: 'briefing, quiz, plan, report' },
  ];
  return (
    <aside className="workbench-sidebar">
      <div className="workbench-sidebar-title">EXTENSIONS</div>
      <div className="workbench-sidebar-scroll">
        <div className="workbench-extension-card">
          <strong>TYTUS EXTENSIONS</strong>
          <p className="workbench-muted">Connector surface kept intentionally. Chat, agents, pods, Hyperframes, Blender, and media tools wire in from here.</p>
        </div>
        {items.map((item) => (
          <div key={item.name} className="workbench-extension-row">
            <Blocks size={16} />
            <div>
              <strong>{item.name}</strong>
              <span>{item.detail}</span>
            </div>
            <em>coming soon</em>
          </div>
        ))}
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

function extractWorkspacePatch(body: string, files: WorkbenchFile[], sourceTitle: string): PendingWorkspacePatch {
  const blocks = Array.from(body.matchAll(/```([^\n`]*)\n([\s\S]*?)```/g)).map((match) => ({
    lang: match[1].trim().toLowerCase(),
    content: trimCodeBlock(match[2]),
  })).filter((block) => block.content.trim().length > 0);
  const candidates = [
    ...blocks.filter((block) => hasFenceFlag(block.lang, 'diff') || hasFenceFlag(block.lang, 'patch')).map((block) => block.content),
    body,
  ];
  const byFileId = new Map<string, PendingEdit>();
  const skipped: string[] = [];

  for (const candidate of candidates) {
    for (const section of splitUnifiedDiffByFile(candidate)) {
      const path = diffSectionPath(section);
      if (!path) continue;
      const file = findFileForPatchPath(files, path);
      if (!file) {
        skipped.push(`${path}: no opened file`);
        continue;
      }
      const proposed = applyUnifiedDiff(file.content, section);
      if (!proposed || proposed === file.content) {
        skipped.push(`${path}: patch did not match or produced no change`);
        continue;
      }
      byFileId.set(file.id, {
        fileId: file.id,
        fileName: file.path,
        originalContent: file.content,
        proposedContent: proposed,
        sourceTitle,
        extractionLabel: `workspace diff (${path})`,
        stats: diffStats(file.content, proposed),
      });
    }
  }

  return { sourceTitle, edits: Array.from(byFileId.values()), skipped: Array.from(new Set(skipped)) };
}

function splitUnifiedDiffByFile(diff: string): string[] {
  const normalized = diff.replace(/\r\n/g, '\n');
  if (!/^@@\s+-\d+/m.test(normalized)) return [];
  const lines = normalized.split('\n');
  const starts: number[] = [];
  lines.forEach((line, index) => {
    if (line.startsWith('diff --git ') || line.startsWith('--- ')) starts.push(index);
  });
  if (starts.length === 0) return [normalized];
  const uniqueStarts = Array.from(new Set(starts)).sort((a, b) => a - b);
  const sections: string[] = [];
  for (let index = 0; index < uniqueStarts.length; index += 1) {
    const start = uniqueStarts[index];
    const next = uniqueStarts.find((candidate) => candidate > start && lines[candidate].startsWith('diff --git '));
    const end = next ?? lines.length;
    const section = lines.slice(start, end).join('\n');
    if (/^@@\s+-\d+/m.test(section)) sections.push(section);
  }
  return sections.length > 0 ? sections : [normalized];
}

function diffSectionPath(section: string): string | null {
  const gitHeader = section.match(/^diff --git\s+(?:"?a\/(.+?)"?|(\S+))\s+(?:"?b\/(.+?)"?|(\S+))/m);
  if (gitHeader) return normalizePatchPath(gitHeader[3] || gitHeader[4] || gitHeader[1] || gitHeader[2] || '');
  const plusHeader = section.match(/^\+\+\+\s+(?:"?b\/(.+?)"?|(\S+))/m);
  if (plusHeader) return normalizePatchPath(plusHeader[1] || plusHeader[2] || '');
  const minusHeader = section.match(/^---\s+(?:"?a\/(.+?)"?|(\S+))/m);
  if (minusHeader) return normalizePatchPath(minusHeader[1] || minusHeader[2] || '');
  return null;
}

function normalizePatchPath(path: string): string {
  return path.replace(/^["']|["']$/g, '').replace(/\\/g, '/').replace(/^[ab]\//, '').replace(/^\.\//, '');
}

function findFileForPatchPath(files: WorkbenchFile[], patchPath: string): WorkbenchFile | null {
  const normalized = normalizePatchPath(patchPath);
  const base = normalized.split('/').at(-1) ?? normalized;
  return files.find((file) => {
    const filePath = normalizePatchPath(file.path);
    return filePath === normalized || filePath.endsWith(`/${normalized}`) || file.name === base || filePath.endsWith(`/${base}`);
  }) ?? null;
}

function previewPatchContent(content: string): string {
  const lines = content.split('\n');
  return lines.slice(0, 80).join('\n') + (lines.length > 80 ? '\n…' : '');
}

function extractEditableSuggestion(body: string, file: WorkbenchFile): { content: string; label: string } | null {
  const blocks = Array.from(body.matchAll(/```([^\n`]*)\n([\s\S]*?)```/g)).map((match) => ({
    lang: match[1].trim().toLowerCase(),
    content: trimCodeBlock(match[2]),
  })).filter((block) => block.content.trim().length > 0);
  const diffCandidates = [
    ...blocks.filter((block) => hasFenceFlag(block.lang, 'diff') || hasFenceFlag(block.lang, 'patch')).map((block) => block.content),
    body,
  ];
  for (const candidate of diffCandidates) {
    const patched = applyUnifiedDiff(file.content, candidate);
    if (patched) return { content: patched, label: 'unified diff patch' };
  }
  if (blocks.length === 0) return null;

  const wanted = languageAliases(file);
  const fullReplacement = blocks.find((block) => hasFenceFlag(block.lang, 'atomek-replace') || hasFenceFlag(block.lang, 'replace'));
  if (fullReplacement) return { content: fullReplacement.content, label: `replacement block (${fullReplacement.lang || 'plain'})` };

  const languageMatch = blocks.find((block) => wanted.some((alias) => hasFenceFlag(block.lang, alias)) && !hasFenceFlag(block.lang, 'diff') && !hasFenceFlag(block.lang, 'patch'));
  if (languageMatch) return { content: languageMatch.content, label: `matched ${languageMatch.lang || file.language} block` };

  const nonDiffBlocks = blocks.filter((block) => !hasFenceFlag(block.lang, 'diff') && !hasFenceFlag(block.lang, 'patch'));
  const fallback = nonDiffBlocks.sort((a, b) => b.content.length - a.content.length)[0];
  if (!fallback) return null;
  return { content: fallback.content, label: `largest fenced block (${fallback.lang || 'plain'})` };
}

function applyUnifiedDiff(original: string, diff: string): string | null {
  if (!/^@@\s+-\d+/m.test(diff)) return null;
  const originalLines = original.split('\n');
  const diffLines = diff.replace(/\r\n/g, '\n').split('\n');
  const output: string[] = [];
  let originalIndex = 0;
  let sawHunk = false;

  for (let index = 0; index < diffLines.length; index += 1) {
    const header = diffLines[index].match(/^@@\s+-(\d+)(?:,\d+)?\s+\+(\d+)(?:,\d+)?\s+@@/);
    if (!header) continue;
    sawHunk = true;
    const oldStart = Number(header[1]);
    const hunkStart = Math.max(0, oldStart - 1);
    if (hunkStart < originalIndex) return null;
    output.push(...originalLines.slice(originalIndex, hunkStart));
    originalIndex = hunkStart;

    index += 1;
    for (; index < diffLines.length; index += 1) {
      const line = diffLines[index];
      if (line.startsWith('@@ ')) {
        index -= 1;
        break;
      }
      if (line.startsWith('diff --git ') || line.startsWith('--- ') || line.startsWith('+++ ')) continue;
      if (line.startsWith('\\ No newline at end of file')) continue;
      const marker = line[0];
      const content = line.slice(1);
      if (marker === ' ') {
        if (originalLines[originalIndex] !== content) return null;
        output.push(content);
        originalIndex += 1;
        continue;
      }
      if (marker === '-') {
        if (originalLines[originalIndex] !== content) return null;
        originalIndex += 1;
        continue;
      }
      if (marker === '+') {
        output.push(content);
        continue;
      }
      if (line === '') {
        continue;
      }
      return null;
    }
  }

  if (!sawHunk) return null;
  output.push(...originalLines.slice(originalIndex));
  return output.join('\n');
}

function trimCodeBlock(content: string): string {
  return content.replace(/^\n+/, '').replace(/\n+$/, '');
}

function hasFenceFlag(lang: string, flag: string): boolean {
  return lang.split(/[\s,]+/).filter(Boolean).includes(flag);
}

function languageAliases(file: WorkbenchFile): string[] {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return Array.from(new Set([
    file.language,
    ext,
    file.language === 'typescript' ? 'ts' : '',
    file.language === 'javascript' ? 'js' : '',
    file.language === 'markdown' ? 'md' : '',
    file.language === 'shell' ? 'sh' : '',
    file.language === 'yaml' ? 'yml' : '',
  ].filter(Boolean)));
}

function diffStats(original: string, proposed: string): EditStats {
  const before = original.split('\n');
  const after = proposed.split('\n');
  const max = Math.max(before.length, after.length);
  let added = 0;
  let removed = 0;
  let changed = 0;
  for (let index = 0; index < max; index += 1) {
    if (before[index] === after[index]) continue;
    if (before[index] === undefined) added += 1;
    else if (after[index] === undefined) removed += 1;
    else changed += 1;
  }
  return { added, removed, changed };
}

function readRecent(): RecentEntry[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentEntry[];
    return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
  } catch {
    return [];
  }
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
    };
  } catch {
    return DEFAULT_CHAT_AI_SETTINGS;
  }
}
