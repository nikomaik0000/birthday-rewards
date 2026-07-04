"use client";

import { useCallback, useEffect, useState } from "react";

function readIds(storageKey: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function writeIds(storageKey: string, ids: Set<string>) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify([...ids]));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — fail silently,
    // the toggle just won't persist across reloads.
  }
}

/**
 * A personal, browser-local set of reward ids. Used for anonymous visitor
 * favorites and everyone's "used" checklist — this never reads from or
 * writes to Supabase.
 */
function useLocalRewardIds(storageKey: string) {
  const [ids, setIds] = useState<Set<string>>(() => new Set());

  // Hydrate from localStorage after mount to avoid an SSR/client mismatch.
  useEffect(() => {
    setIds(readIds(storageKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const has = useCallback((id: string) => ids.has(id), [ids]);

  const toggle = useCallback(
    (id: string, next?: boolean) => {
      setIds((prev) => {
        const shouldAdd = next ?? !prev.has(id);
        if (shouldAdd === prev.has(id)) return prev;
        const updated = new Set(prev);
        if (shouldAdd) updated.add(id);
        else updated.delete(id);
        writeIds(storageKey, updated);
        return updated;
      });
    },
    [storageKey]
  );

  return { ids, has, toggle };
}

/** Anonymous visitors' favorites, kept entirely in this browser. */
export function useLocalFavorites() {
  return useLocalRewardIds("birthday-rewards:local-favorites");
}

/** Everyone's personal "used" checklist — never stored in Supabase. */
export function useLocalUsedStatus() {
  return useLocalRewardIds("birthday-rewards:local-used");
}
