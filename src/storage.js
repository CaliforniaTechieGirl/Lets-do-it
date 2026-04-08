/**
 * storage.js
 *
 * Thin adapter that uses window.storage (Claude artifacts) when available,
 * falling back to localStorage (Vercel / local dev).
 *
 * API mirrors window.storage:
 *   get(key, shared?)   → { value: string } | null
 *   set(key, value, shared?)
 *   del(key, shared?)
 */

const useClaudeStorage =
  typeof window !== "undefined" &&
  typeof window.storage?.get === "function";

export async function storageGet(key, shared = false) {
  if (useClaudeStorage) {
    try { return await window.storage.get(key, shared); }
    catch { return null; }
  }
  const value = localStorage.getItem(key);
  return value != null ? { value } : null;
}

export async function storageSet(key, value, shared = false) {
  if (useClaudeStorage) {
    try { return await window.storage.set(key, value, shared); }
    catch { return null; }
  }
  localStorage.setItem(key, value);
  return { key, value };
}

export async function storageDel(key, shared = false) {
  if (useClaudeStorage) {
    try { return await window.storage.delete(key, shared); }
    catch { return null; }
  }
  localStorage.removeItem(key);
  return { key, deleted: true };
}
