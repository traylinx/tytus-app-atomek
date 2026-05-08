
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import type { HostClient } from '@tytus/host-api';
import {
  ChevronDown,
  File,
  FileCode2,
  FilePlus2,
  FileSearch,
  Folder,
  FolderOpen,
  Eye,
  Search,
  X,
} from 'lucide-react';
import { hasFileSystemAccessApi, openFiles, openFolder, saveWorkbenchFile } from '../fileAccess';
import { labelForLanguage } from '../language';
import { markdownToHtml } from '../markdown';
import type { ActivityView, CursorPosition, WorkbenchFile, WorkbenchFolder } from '../types';

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

type Props = { host: HostClient };

type RecentEntry = { name: string; path: string; at: number };
type LayoutPrefs = { primaryVisible: boolean; primaryWidth: number; markdownPreviewVisible: boolean };
type PaletteItem = { label: string; detail: string; run: () => void; disabled?: boolean };
type SearchResult = { file: WorkbenchFile; lineNumber: number; line: string };

export function WorkbenchShell({ host }: Props) {
  const initialLayout = useMemo(() => readLayoutPrefs(), []);
  const [activity, setActivity] = useState<ActivityView>('explorer');
  const [primaryVisible, setPrimaryVisible] = useState(initialLayout.primaryVisible);
  const [primaryWidth, setPrimaryWidth] = useState(initialLayout.primaryWidth);
  const [markdownPreviewVisible, setMarkdownPreviewVisible] = useState(initialLayout.markdownPreviewVisible);
  const [welcomeClosed, setWelcomeClosed] = useState(false);
  const [folder, setFolder] = useState<WorkbenchFolder | null>(null);
  const [files, setFiles] = useState<WorkbenchFile[]>([]);
  const [openEditorIds, setOpenEditorIds] = useState<string[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState<CursorPosition>({ lineNumber: 1, column: 1 });
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [revealLine, setRevealLine] = useState<number | null>(null);
  const [status, setStatus] = useState('Ready');
  const [recent, setRecent] = useState<RecentEntry[]>(() => readRecent());

  const openEditors = openEditorIds.map((id) => files.find((file) => file.id === id)).filter(Boolean) as WorkbenchFile[];
  const activeFile = activeFileId ? files.find((file) => file.id === activeFileId) ?? null : null;
  const showWelcome = !activeFile && !welcomeClosed;
  const dirtyFiles = useMemo(() => files.filter((file) => file.dirty), [files]);
  const visibleFiles = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return files;
    return files.filter((file) => file.path.toLowerCase().includes(needle));
  }, [files, query]);


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
    setFiles((current) => current.map((file) => file.id === activeFileId ? { ...file, content, dirty: content !== file.content || file.dirty } : file));
  }, [activeFileId]);

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
      if (activeFileId === id) setActiveFileId(next.at(-1) ?? null);
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

  const reopenRecent = useCallback((entry: RecentEntry) => {
    const existing = files.find((file) => file.path === entry.path || file.name === entry.name);
    if (existing) {
      openWorkbenchFile(existing);
      setStatus(`Opened recent ${existing.name}`);
      return;
    }
    setStatus('Browser security requires permission again — use Open File or Open Folder to reopen local content.');
  }, [files, openWorkbenchFile]);

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
    const prefs: LayoutPrefs = { primaryVisible, primaryWidth, markdownPreviewVisible };
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(prefs));
  }, [markdownPreviewVisible, primaryVisible, primaryWidth]);

  return (
    <div
      className={`workbench-workbench ${primaryVisible ? '' : 'no-primary'}`}
      data-app="workbench"
      style={{ '--workbench-primary-width': `${primaryWidth}px` } as CSSProperties}
    >
      <ActivityBar active={activity} setActive={(view) => { setActivity(view); setPrimaryVisible(true); }} />
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
            canPreview={activeFile?.language === 'markdown'}
            previewVisible={markdownPreviewVisible}
            togglePreview={() => setMarkdownPreviewVisible((value) => !value)}
          />
          <BreadcrumbBar file={activeFile} folder={folder} showWelcome={showWelcome} />
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
                      onSave={() => { void saveActiveFile(); }}
                    />
                  </Suspense>
                </div>
                {activeFile.language === 'markdown' && markdownPreviewVisible && <MarkdownPreviewPane content={activeFile.content} />}
              </div>
            ) : showWelcome ? (
              <WelcomePage openFile={handleOpenFile} openFolder={handleOpenFolder} newFile={newUntitled} recent={recent} reopenRecent={reopenRecent} />
            ) : (
              <div className="workbench-no-editor">
                <FileSearch size={34} />
                <p>No editor open</p>
                <button className="workbench-button-subtle" onClick={() => setWelcomeClosed(false)}>Show start screen</button>
              </div>
            )}
          </div>

        </section>
      </main>

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
            { label: 'Search: Find in Files', detail: 'Search the opened workspace', run: () => { setActivity('search'); setPrimaryVisible(true); } },
            { label: 'Help: Show Start Screen', detail: 'Open the start screen', run: () => { setActiveFileId(null); setWelcomeClosed(false); } },
            { label: 'View: Toggle Primary Side Bar', detail: primaryVisible ? 'Hide Explorer side bar' : 'Show Explorer side bar', run: () => setPrimaryVisible((value) => !value) },
            { label: 'View: Toggle Markdown Preview', detail: activeFile?.language === 'markdown' ? 'Show or hide Markdown preview split' : 'Available for Markdown files', run: () => setMarkdownPreviewVisible((value) => !value), disabled: activeFile?.language !== 'markdown' },
          ]}
          openWorkbenchFile={openWorkbenchFile}
          onClose={() => setCommandPaletteOpen(false)}
        />
      )}
      <StatusBar status={status} file={activeFile ?? welcomeFile} cursor={cursor} fileCount={files.length} dirtyCount={dirtyFiles.length} />
    </div>
  );
}

function ActivityBar({ active, setActive }: { active: ActivityView; setActive: (view: ActivityView) => void }) {
  return (
    <aside className="workbench-activity-bar" aria-label="Activity Bar">
      <ActivityButton icon={<File size={25} />} label="Explorer" active={active === 'explorer'} onClick={() => setActive('explorer')} />
      <ActivityButton icon={<Search size={25} />} label="Search" active={active === 'search'} onClick={() => setActive('search')} />
      <div className="workbench-activity-spacer" />
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
    </div>
  );
}

function WelcomePage({ openFile, openFolder, newFile, recent, reopenRecent }: { openFile: () => void; openFolder: () => void; newFile: () => void; recent: RecentEntry[]; reopenRecent: (entry: RecentEntry) => void }) {
  return (
    <div className="workbench-welcome">
      <div className="workbench-welcome-grid">
        <section>
          <h1>Atomek</h1>
          <div className="workbench-welcome-subtitle">Small, clean workspace for files and notes.</div>
          <h2>Start</h2>
          <button className="workbench-start-link" onClick={newFile}><FilePlus2 size={18} />New File...</button>
          <button className="workbench-start-link" onClick={openFile}><File size={18} />Open File...</button>
          <button className="workbench-start-link" onClick={openFolder}><FolderOpen size={18} />Open Folder...</button>
          <h2>Recent</h2>
          {recent.length === 0 ? <p className="workbench-muted">No recent folders, open a folder to start.</p> : recent.map((item) => <button key={`${item.path}-${item.at}`} className="workbench-start-link" onClick={() => reopenRecent(item)}>{item.name}<span className="workbench-muted">~</span></button>)}
        </section>
        <section>
          <h2>Walkthroughs</h2>
          <div className="workbench-walkthrough-card"><strong>Get Started with Atomek</strong><span className="workbench-muted">Open local files, edit with Monaco, and keep the interface honest.</span></div>
          <div className="workbench-walkthrough-card"><strong>Browse & Edit Local Workspaces</strong><span className="workbench-muted">Uses browser-native File System Access API on supported Chromium builds.</span></div>
          <div className="workbench-walkthrough-card"><strong>Learn the Fundamentals</strong><span className="workbench-muted">Explorer, tabs, editor, search, status bar.</span></div>
        </section>
      </div>

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

function StatusBar({ status, file, cursor, fileCount, dirtyCount }: { status: string; file: WorkbenchFile; cursor: CursorPosition; fileCount: number; dirtyCount: number }) {
  return (
    <footer className="workbench-statusbar">
      <span>$(branch) main</span>
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
    markdownPreviewVisible: true,
  };
  try {
    const raw = localStorage.getItem(LAYOUT_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<LayoutPrefs>;
    return {
      primaryVisible: typeof parsed.primaryVisible === 'boolean' ? parsed.primaryVisible : fallback.primaryVisible,
      primaryWidth: typeof parsed.primaryWidth === 'number' ? Math.max(240, Math.min(460, parsed.primaryWidth)) : fallback.primaryWidth,
      markdownPreviewVisible: typeof parsed.markdownPreviewVisible === 'boolean' ? parsed.markdownPreviewVisible : fallback.markdownPreviewVisible,
    };
  } catch {
    return fallback;
  }
}
