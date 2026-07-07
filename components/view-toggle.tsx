"use client";

import { LayoutGrid, Rows3 } from "lucide-react";
import type { ViewMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div className="flex items-center rounded-pill border border-border p-0.5">
      <button
        type="button"
        onClick={() => onChange("card")}
        aria-label="卡片檢視"
        aria-pressed={mode === "card"}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-pill transition-colors",
          mode === "card" ? "bg-accent-coffee/20 text-accent-coffee" : "text-muted"
        )}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange("table")}
        aria-label="表格檢視"
        aria-pressed={mode === "table"}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-pill transition-colors",
          mode === "table" ? "bg-accent-coffee/20 text-accent-coffee" : "text-muted"
        )}
      >
        <Rows3 className="h-4 w-4" />
      </button>
    </div>
  );
}
