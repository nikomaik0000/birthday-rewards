"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CATEGORIES, DATE_CATEGORIES } from "@/lib/constants";
import type { RewardFilters } from "@/lib/types";
import type { TagRow } from "@/lib/database.types";
import { TagBadge } from "@/components/tag-badge";
import { cn } from "@/lib/utils";

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function FilterPanel({
  filters,
  onChange,
  allTags,
  activeCount,
}: {
  filters: RewardFilters;
  onChange: (filters: RewardFilters) => void;
  allTags: TagRow[];
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-card border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <SlidersHorizontal className="h-4 w-4" />
          篩選
          {activeCount > 0 && (
            <span className="rounded-pill bg-accent-coffee/20 px-2 py-0.5 text-[11px] text-accent-coffee">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="stack-16 border-t border-border px-4 py-4">
          {/* Category */}
          <FilterGroup label="類別">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <label key={c} className="flex items-center gap-1.5 text-sm">
                  <Checkbox
                    checked={filters.categories.includes(c)}
                    onCheckedChange={() =>
                      onChange({ ...filters, categories: toggleInArray(filters.categories, c) })
                    }
                  />
                  {c}
                </label>
              ))}
            </div>
          </FilterGroup>

          {/* Date category */}
          <FilterGroup label="日期">
            <div className="flex flex-wrap gap-2">
              {DATE_CATEGORIES.map((d) => (
                <label key={d} className="flex items-center gap-1.5 text-sm">
                  <Checkbox
                    checked={filters.dateCategories.includes(d)}
                    onCheckedChange={() =>
                      onChange({ ...filters, dateCategories: toggleInArray(filters.dateCategories, d) })
                    }
                  />
                  {d}
                </label>
              ))}
            </div>
          </FilterGroup>

          {/* Score */}
          <FilterGroup label="分數">
            <div className="flex flex-wrap gap-2">
              {[5, 4, 3, 2, 1].map((s) => (
                <label key={s} className="flex items-center gap-1.5 text-sm">
                  <Checkbox
                    checked={filters.scores.includes(s)}
                    onCheckedChange={() => onChange({ ...filters, scores: toggleInArray(filters.scores, s) })}
                  />
                  ⭐ {s}/5
                </label>
              ))}
            </div>
          </FilterGroup>

          {/* Tags */}
          {allTags.length > 0 && (
            <FilterGroup label="標籤">
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => onChange({ ...filters, tagIds: toggleInArray(filters.tagIds, tag.id) })}
                    className={cn(
                      "rounded-pill transition-opacity",
                      filters.tagIds.includes(tag.id) ? "opacity-100 ring-2 ring-accent-coffee/50" : "opacity-70"
                    )}
                  >
                    <TagBadge name={tag.name} colorHex={tag.color_hex} />
                  </button>
                ))}
              </div>
            </FilterGroup>
          )}

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={filters.favoriteOnly}
                onCheckedChange={(v) => onChange({ ...filters, favoriteOnly: v })}
              />
              只看收藏
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={filters.hideExpired}
                onCheckedChange={(v) => onChange({ ...filters, hideExpired: v })}
              />
              隱藏已截止
            </label>
            <div className="flex items-center gap-2 text-sm">
              <span>使用狀態</span>
              <div className="flex overflow-hidden rounded-pill border border-border">
                {(["all", "unused", "used"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => onChange({ ...filters, usedFilter: v })}
                    className={cn(
                      "px-3 py-1 text-xs",
                      filters.usedFilter === v
                        ? "bg-ink text-bg"
                        : "text-muted"
                    )}
                  >
                    {v === "all" ? "全部" : v === "used" ? "已使用" : "未使用"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activeCount > 0 && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onChange({
                    query: filters.query,
                    categories: [],
                    dateCategories: [],
                    scores: [],
                    favoriteOnly: false,
                    usedFilter: "all",
                    tagIds: [],
                    hideExpired: false,
                  })
                }
              >
                清除篩選
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium text-muted">{label}</div>
      {children}
    </div>
  );
}
