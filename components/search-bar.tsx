"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜尋店家、優惠內容、標籤、心得..."
        className="h-11 rounded-pill pl-10 pr-9 text-sm shadow-soft"
        aria-label="搜尋優惠"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="清除搜尋"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink dark:hover:text-ink-dark"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
