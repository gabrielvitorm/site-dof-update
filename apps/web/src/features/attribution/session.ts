export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const SESSION_ID_KEY = 'dofupdate.sessionId';

export function getOrCreateSessionId(
  storage: StorageLike,
  createSessionId: () => string = createBrowserSessionId
): string {
  const existing = readStorageValue(storage, SESSION_ID_KEY);

  if (existing) {
    return existing;
  }

  const sessionId = createSessionId();
  writeStorageValue(storage, SESSION_ID_KEY, sessionId);

  return sessionId;
}

function createBrowserSessionId(): string {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (character) => {
    const randomValue =
      globalThis.crypto?.getRandomValues?.(new Uint8Array(1))[0] ?? Math.floor(Math.random() * 256);
    return (Number(character) ^ (randomValue & (15 >> (Number(character) / 4)))).toString(16);
  });
}

export function readStorageValue(storage: StorageLike, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorageValue(storage: StorageLike, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    // Browsers can block storage. Attribution should still work for the current submission.
  }
}
