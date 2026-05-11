import type { BrowserDirectoryHandleLike, BrowserFileHandleLike } from './types';

type PersistedHandle = BrowserFileHandleLike | BrowserDirectoryHandleLike;

const DB_NAME = 'tytus-atomek-handles';
const STORE_NAME = 'handles';
const DB_VERSION = 1;

const openDb = (): Promise<IDBDatabase> => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onupgradeneeded = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error ?? new Error('Failed to open Atomek handle store'));
});

export async function savePersistedHandle(key: string, handle: PersistedHandle): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(handle, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to persist file handle'));
  });
  db.close();
}

export async function getPersistedHandle<T extends PersistedHandle>(key: string): Promise<T | null> {
  const db = await openDb();
  const handle = await new Promise<T | null>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve((request.result as T | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error('Failed to read file handle'));
  });
  db.close();
  return handle;
}
