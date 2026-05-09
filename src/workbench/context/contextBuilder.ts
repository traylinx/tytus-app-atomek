import type { AiContextPart } from '@tytus/host-api';
import type { WorkbenchFile, WorkbenchRange } from '../types';
import type { ChatContextAttachment, ChatContextState } from './chatContextStore';
import { buildContextAttachments } from './chatContextStore';
import type { DocumentRegistrySnapshot } from './documentRegistry';

const MAX_SELECTION_CHARS = 4_000;
const MAX_FILE_CHARS = 8_000;
const MAX_OPEN_EDITOR_CHARS = 4_000;

export type BuiltChatContext = {
  parts: AiContextPart[];
  attachments: ChatContextAttachment[];
};

const clip = (text: string, max: number): string => {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n\n[...clipped ${text.length - max} chars...]`;
};

export const buildAiContext = (
  registry: DocumentRegistrySnapshot,
  files: readonly WorkbenchFile[],
  state: ChatContextState,
): BuiltChatContext => {
  const attachments = buildContextAttachments(registry, state);
  const parts: AiContextPart[] = [];
  const filesById = new Map(files.map((file) => [file.id, file]));

  for (const attachment of attachments) {
    if (!attachment.fileId) continue;
    const file = filesById.get(attachment.fileId);
    const document = registry.byId.get(attachment.fileId);
    if (!file || !document || !attachment.includeBody) continue;
    const metadata = [
      `Path: ${file.path}`,
      `Language: ${file.language}`,
      `Version: ${document.version}`,
      `Hash: ${document.contentHash}`,
      `Dirty: ${document.dirty ? 'yes' : 'no'}`,
      attachment.range ? `Range: ${formatRange(attachment.range)}` : null,
    ].filter(Boolean).join('\n');
    const body = attachment.kind === 'selection' && attachment.range
      ? selectedText(file.content, attachment.range)
      : file.content;
    const max = attachment.kind === 'selection'
      ? MAX_SELECTION_CHARS
      : attachment.label.startsWith('Open editor') ? MAX_OPEN_EDITOR_CHARS : MAX_FILE_CHARS;
    parts.push({
      kind: attachment.kind === 'selection' ? 'selection' : 'file',
      title: attachment.kind === 'selection' ? `Active selection: ${file.path}` : attachment.label,
      text: `${metadata}\n\n${clip(body, max)}`,
    });
  }

  if (attachments.length > 0) {
    parts.push({
      kind: 'workspace',
      title: 'Atomek chat context manifest',
      text: attachments.map((attachment, index) => [
        `${index + 1}. ${attachment.label}`,
        attachment.path ? `   path: ${attachment.path}` : null,
        attachment.range ? `   range: ${formatRange(attachment.range)}` : null,
        attachment.version ? `   version: ${attachment.version}` : null,
        attachment.dirty ? '   dirty: yes' : null,
      ].filter(Boolean).join('\n')).join('\n'),
    });
  }

  return { parts, attachments };
};

export const selectedText = (content: string, range: WorkbenchRange): string => {
  const lines = content.split('\n');
  const startLine = Math.max(1, range.startLineNumber);
  const endLine = Math.max(startLine, range.endLineNumber);
  const selected = lines.slice(startLine - 1, endLine);
  if (selected.length === 0) return '';
  if (selected.length === 1) return selected[0].slice(Math.max(0, range.startColumn - 1), Math.max(0, range.endColumn - 1));
  selected[0] = selected[0].slice(Math.max(0, range.startColumn - 1));
  selected[selected.length - 1] = selected[selected.length - 1].slice(0, Math.max(0, range.endColumn - 1));
  return selected.join('\n');
};

export const formatRange = (range: WorkbenchRange): string => `${range.startLineNumber}:${range.startColumn}-${range.endLineNumber}:${range.endColumn}`;
