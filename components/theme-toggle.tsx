"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const CYCLE = ["light", "dark", "system"] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />;

  const current = (theme as (typeof CYCLE)[number]) ?? "system";
  const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];

  const Icon = current === "light" ? Sun : current === "dark" ? Moon : Monitor;
  const label = current === "light" ? "淺色" : current === "dark" ? "深色" : "跟隨系統";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`目前主題：${label}，點擊切換`}
      title={`目前主題：${label}`}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full",
        "border border-border text-muted hover:text-ink hover:bg-surface transition-colors",
        "dark:border-border-dark dark:text-ink-dark/70 dark:hover:bg-surface-dark"
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}
