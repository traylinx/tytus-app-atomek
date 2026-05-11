export type ActivityView = 'explorer' | 'search' | 'source-control' | 'run' | 'computer';
export type SecondaryTab = 'chat' | 'agents' | 'outputs';

export type ChatGatewayPreference = 'auto' | 'remote' | 'local';

export type ChatAiSettings = {
  gatewayPreference: ChatGatewayPreference;
  model: string;
  embeddingModel: string;
};

export type WorkbenchLanguage =
  | 'markdown'
  | 'json'
  | 'typescript'
  | 'javascript'
  | 'css'
  | 'html'
  | 'xml'
  | 'yaml'
  | 'python'
  | 'shell'
  | 'csv'
  | 'text';

export type BrowserHandlePermissionMode = 'read' | 'readwrite';

export type BrowserPermissionState = 'granted' | 'denied' | 'prompt';

export type BrowserFileHandleLike = {
  kind?: 'file';
  name: string;
  getFile: () => Promise<File>;
  createWritable?: () => Promise<{ write: (data: string | Blob) => Promise<void>; close: () => Promise<void> }>;
  queryPermission?: (descriptor?: { mode?: BrowserHandlePermissionMode }) => Promise<BrowserPermissionState>;
  requestPermission?: (descriptor?: { mode?: BrowserHandlePermissionMode }) => Promise<BrowserPermissionState>;
};

export type BrowserDirectoryHandleLike = {
  kind?: 'directory';
  name: string;
  values: () => AsyncIterable<BrowserFileHandleLike | BrowserDirectoryHandleLike>;
  getFileHandle?: (name: string, opts?: { create?: boolean }) => Promise<BrowserFileHandleLike>;
  getDirectoryHandle?: (name: string, opts?: { create?: boolean }) => Promise<BrowserDirectoryHandleLike>;
  queryPermission?: (descriptor?: { mode?: BrowserHandlePermissionMode }) => Promise<BrowserPermissionState>;
  requestPermission?: (descriptor?: { mode?: BrowserHandlePermissionMode }) => Promise<BrowserPermissionState>;
};

export type WorkbenchFile = {
  id: string;
  name: string;
  path: string;
  language: WorkbenchLanguage;
  content: string;
  dirty: boolean;
  handle?: BrowserFileHandleLike;
  size?: number;
  source: 'local-file' | 'local-folder' | 'sample' | 'generated';
};

export type WorkbenchFolder = {
  name: string;
  handle?: BrowserDirectoryHandleLike;
  files: WorkbenchFile[];
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  body: string;
  status?: 'pending' | 'streaming' | 'complete' | 'error';
  gatewayLabel?: string;
  error?: string;
  createdAt?: number;
};

export type OutputArtifact = {
  id: string;
  title: string;
  kind: 'briefing' | 'action-list' | 'quiz' | 'plan' | 'storyboard' | 'report' | 'local-draft' | 'markdown' | 'memory';
  body: string;
  createdAt: number;
  source?: 'local' | 'ai';
};

export type CursorPosition = { lineNumber: number; column: number };

export type WorkbenchRange = {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
};
