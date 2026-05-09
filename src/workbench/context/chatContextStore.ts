import type { WorkbenchRange } from '../types';
import type { DocumentRegistrySnapshot, WorkbenchDocument } from './documentRegistry';

export type ChatContextScope = 'none' | 'active-selection' | 'active-file' | 'open-editors' | 'selected-files' | 'indexed-project';

export type ChatContextAttachmentKind = 'file' | 'selection' | 'open-editors' | 'memory' | 'index-hit';

export type ChatContextAttachment = {
  id: string;
  kind: ChatContextAttachmentKind;
  label: string;
  fileId?: string;
  path?: string;
  range?: WorkbenchRange;
  version?: number;
  contentHash?: string;
  language?: string;
  dirty?: boolean;
  includeBody: boolean;
  removable: boolean;
  implicit: boolean;
  stale?: boolean;
  charCount?: number;
  score?: number;
  keywordScore?: number;
  vectorScore?: number;
  snippet?: string;
};

export type ChatContextState = {
  scope: ChatContextScope;
  removedAttachmentIds: readonly string[];
  selectedFileIds: readonly string[];
};

export const DEFAULT_CHAT_CONTEXT_SCOPE: ChatContextScope = 'active-file';

export const contextScopeLabel = (scope: ChatContextScope): string => {
  if (scope === 'none') return 'No context';
  if (scope === 'active-selection') return 'Active selection';
  if (scope === 'active-file') return 'Active file';
  if (scope === 'open-editors') return 'Open editors';
  if (scope === 'selected-files') return 'Selected files';
  return 'Indexed project';
};

export const attachmentIdForDocument = (document: WorkbenchDocument, kind: ChatContextAttachmentKind = 'file'): string => `${kind}:${document.id}`;

export const attachmentIdForSelection = (document: WorkbenchDocument, range: WorkbenchRange): string => [
  'selection',
  document.id,
  range.startLineNumber,
  range.startColumn,
  range.endLineNumber,
  range.endColumn,
].join(':');

const toFileAttachment = (document: WorkbenchDocument, implicit: boolean, labelPrefix?: string): ChatContextAttachment => ({
  id: attachmentIdForDocument(document),
  kind: 'file',
  label: labelPrefix ? `${labelPrefix}: ${document.name}` : document.name,
  fileId: document.id,
  path: document.path,
  version: document.version,
  contentHash: document.contentHash,
  language: document.language,
  dirty: document.dirty,
  includeBody: true,
  removable: true,
  implicit,
});

const toSelectionAttachment = (document: WorkbenchDocument, range: WorkbenchRange, implicit: boolean): ChatContextAttachment => ({
  id: attachmentIdForSelection(document, range),
  kind: 'selection',
  label: `Selection: ${document.name}:${range.startLineNumber}-${range.endLineNumber}`,
  fileId: document.id,
  path: document.path,
  range,
  version: document.version,
  contentHash: document.contentHash,
  language: document.language,
  dirty: document.dirty,
  includeBody: true,
  removable: true,
  implicit,
});

export const buildContextAttachments = (registry: DocumentRegistrySnapshot, state: ChatContextState): ChatContextAttachment[] => {
  const removed = new Set(state.removedAttachmentIds);
  const active = registry.activeDocumentId ? registry.byId.get(registry.activeDocumentId) ?? null : null;
  let attachments: ChatContextAttachment[] = [];

  if (state.scope === 'active-selection') {
    if (active?.selection) attachments = [toSelectionAttachment(active, active.selection, true)];
    else if (active) attachments = [toFileAttachment(active, true, 'Active file')];
  } else if (state.scope === 'active-file') {
    if (active) attachments = [toFileAttachment(active, true, 'Active file')];
  } else if (state.scope === 'open-editors') {
    attachments = registry.openDocumentIds
      .map((id) => registry.byId.get(id))
      .filter(Boolean)
      .map((document) => toFileAttachment(document as WorkbenchDocument, true, 'Open editor'));
  } else if (state.scope === 'selected-files') {
    attachments = state.selectedFileIds
      .map((id) => registry.byId.get(id))
      .filter(Boolean)
      .map((document) => toFileAttachment(document as WorkbenchDocument, false, 'Selected file'));
  }

  return dedupeAttachments(attachments).filter((attachment) => !removed.has(attachment.id));
};

export const removeAttachment = (state: ChatContextState, attachmentId: string): ChatContextState => ({
  ...state,
  removedAttachmentIds: Array.from(new Set([...state.removedAttachmentIds, attachmentId])),
});

export const resetRemovedAttachments = (state: ChatContextState): ChatContextState => ({ ...state, removedAttachmentIds: [] });

const dedupeAttachments = (attachments: ChatContextAttachment[]): ChatContextAttachment[] => {
  const seen = new Set<string>();
  return attachments.filter((attachment) => {
    if (seen.has(attachment.id)) return false;
    seen.add(attachment.id);
    return true;
  });
};
