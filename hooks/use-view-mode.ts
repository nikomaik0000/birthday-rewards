"use client";

import { useEffect, useState } from "react";
import type { ViewMode } from "@/lib/types";

const STORAGE_KEY = "birthday-rewards:view-mode";

export function useViewMode(defaultMode: ViewMode = "card") {
  const [mode, setMode] = useState<ViewMode>(defaultMode);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "table" || stored === "card") setMode(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode, hydrated]);

  return [mode, setMode] as const;
}
