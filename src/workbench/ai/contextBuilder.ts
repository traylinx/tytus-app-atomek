import type { AiContextPart } from '@tytus/host-api';
import type { WorkbenchFile } from '../types';

const MAX_FILE_CHARS = 8_000;
const MAX_EDITORS = 5;

const clip = (text: string, max = MAX_FILE_CHARS): string => {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n\n[...clipped ${text.length - max} chars...]`;
};

export const buildAiContext = (
  activeFile: WorkbenchFile | null,
  openEditors: readonly WorkbenchFile[],
): AiContextPart[] => {
  const parts: AiContextPart[] = [];
  if (activeFile) {
    parts.push({
      kind: 'file',
      title: `Active file: ${activeFile.path}`,
      text: clip(activeFile.content),
    });
  }
  for (const file of openEditors.slice(0, MAX_EDITORS)) {
    if (activeFile && file.id === activeFile.id) continue;
    parts.push({
      kind: 'file',
      title: `Open editor: ${file.path}`,
      text: clip(file.content, 4_000),
    });
  }
  if (openEditors.length > 0) {
    parts.push({
      kind: 'workspace',
      title: 'Open editors',
      text: openEditors.map((file) => `- ${file.path} (${file.language})`).join('\n'),
    });
  }
  return parts;
};
