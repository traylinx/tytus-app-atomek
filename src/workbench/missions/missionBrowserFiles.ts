import type { BrowserDirectoryHandleLike } from '../types';

export async function pickWritableDirectory(): Promise<BrowserDirectoryHandleLike | null> {
  const host = window as Window & { showDirectoryPicker?: (options?: unknown) => Promise<BrowserDirectoryHandleLike> };
  if (typeof host.showDirectoryPicker !== 'function') return null;
  return host.showDirectoryPicker({ mode: 'readwrite' });
}

export async function writeTextToDirectory(dir: BrowserDirectoryHandleLike, fileName: string, content: string): Promise<void> {
  const getFileHandle = dir.getFileHandle;
  if (!getFileHandle) throw new Error('Selected mission folder is read-only in this browser context');
  const file = await getFileHandle.call(dir, fileName, { create: true });
  if (!file.createWritable) throw new Error(`Cannot write ${fileName}; File System Access write handle unavailable`);
  const writable = await file.createWritable();
  await writable.write(content);
  await writable.close();
}

export async function ensureDirectory(dir: BrowserDirectoryHandleLike, name: string): Promise<BrowserDirectoryHandleLike> {
  const getDirectoryHandle = dir.getDirectoryHandle;
  if (!getDirectoryHandle) throw new Error('Selected mission folder cannot create subfolders in this browser context');
  return getDirectoryHandle.call(dir, name, { create: true });
}

export async function writeMissionFileToBrowserDirectory(dir: BrowserDirectoryHandleLike, relPath: string, content: string): Promise<void> {
  const parts = relPath.split('/').filter(Boolean);
  if (parts.length === 0) return;
  let current = dir;
  for (const part of parts.slice(0, -1)) {
    current = await ensureDirectory(current, part);
  }
  await writeTextToDirectory(current, parts[parts.length - 1], content);
}
