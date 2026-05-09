import type { WorkbenchFile, WorkbenchRange } from '../types';

export type WorkbenchDocument = {
  id: string;
  uri: string;
  path: string;
  name: string;
  language: WorkbenchFile['language'];
  version: number;
  contentHash: string;
  dirty: boolean;
  source: WorkbenchFile['source'];
  selection?: WorkbenchRange;
  updatedAt: number;
  open: boolean;
  active: boolean;
};

export type DocumentRegistrySnapshot = {
  documents: WorkbenchDocument[];
  byId: Map<string, WorkbenchDocument>;
  activeDocumentId: string | null;
  openDocumentIds: string[];
};

export type BuildDocumentRegistryInput = {
  files: readonly WorkbenchFile[];
  openEditorIds: readonly string[];
  activeFileId: string | null;
  versions: Readonly<Record<string, number>>;
  activeSelection: WorkbenchRange | null;
};

export const documentUriForFile = (file: Pick<WorkbenchFile, 'path'>): string => `tytus-workbench:///${encodeURI(file.path)}`;

export const contentHash = (text: string): string => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const buildDocumentRegistry = ({ files, openEditorIds, activeFileId, versions, activeSelection }: BuildDocumentRegistryInput): DocumentRegistrySnapshot => {
  const openIds = new Set(openEditorIds);
  const documents = files.map((file) => {
    const active = file.id === activeFileId;
    return {
      id: file.id,
      uri: documentUriForFile(file),
      path: file.path,
      name: file.name,
      language: file.language,
      version: versions[file.id] ?? 1,
      contentHash: contentHash(file.content),
      dirty: file.dirty,
      source: file.source,
      selection: active && activeSelection ? activeSelection : undefined,
      updatedAt: Date.now(),
      open: openIds.has(file.id),
      active,
    } satisfies WorkbenchDocument;
  });
  return {
    documents,
    byId: new Map(documents.map((document) => [document.id, document])),
    activeDocumentId: activeFileId,
    openDocumentIds: openEditorIds.filter((id) => documents.some((document) => document.id === id)),
  };
};
