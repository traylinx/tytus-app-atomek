export type ActivityView = 'explorer' | 'search';
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

export type BrowserFileHandleLike = {
  kind?: 'file';
  name: string;
  getFile: () => Promise<File>;
  createWritable?: () => Promise<{ write: (data: string | Blob) => Promise<void>; close: () => Promise<void> }>;
};

export type BrowserDirectoryHandleLike = {
  kind?: 'directory';
  name: string;
  values: () => AsyncIterable<BrowserFileHandleLike | BrowserDirectoryHandleLike>;
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


export type CursorPosition = { lineNumber: number; column: number };
