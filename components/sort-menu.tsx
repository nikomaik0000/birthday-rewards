"use client";

import { ArrowUpDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SORT_OPTIONS } from "@/lib/constants";
import type { SortKey } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SortMenu({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const current = SORT_OPTIONS.find((o) => o.value === value);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-pill border border-border px-3 text-xs font-medium text-ink",
            "dark:border-border-dark dark:text-ink-dark hover:bg-surface dark:hover:bg-surface-dark"
          )}
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          {current?.label ?? "排序"}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[200px] rounded-lg border border-border bg-surface p-1 shadow-pop dark:border-border-dark dark:bg-surface-dark"
        >
          {SORT_OPTIONS.map((opt) => (
            <DropdownMenu.Item
              key={opt.value}
              onSelect={() => onChange(opt.value as SortKey)}
              className={cn(
                "cursor-pointer rounded-md px-3 py-2 text-sm outline-none",
                "data-[highlighted]:bg-bg dark:data-[highlighted]:bg-bg-dark",
                opt.value === value && "font-medium text-accent-coffee"
              )}
            >
              {opt.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
