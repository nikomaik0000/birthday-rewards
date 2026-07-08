"use client";

import { Fragment, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from "@tanstack/react-table";
import { Heart, Check, ExternalLink, ChevronRight } from "lucide-react";
import { CategoryBadge } from "@/components/tag-badge";
import { StarRating } from "@/components/star-rating";
import { ExpiryBadge } from "@/components/expiry-badge";
import { RewardCardBody } from "@/components/reward-card-body";
import type { RewardWithTags } from "@/lib/types";
import { cn } from "@/lib/utils";

// Columns hidden on mobile (< md). Phase 3C keeps 收藏 / 店家 / 優惠內容(preview) visible
// there; 日期 moves into the expanded accordion instead of showing as its own column.
const MOBILE_HIDDEN_COLUMN_IDS = new Set(["category","content","date_category", "score", "expiry", "used", "link"]);

export function RewardTable({
  rewards,
  onToggleFavorite,
  onToggleUsed,
}: {
  rewards: RewardWithTags[];
  onToggleFavorite: (id: string, next: boolean) => void;
  // v2: 已使用 is admin-only now — omit this prop to render a read-only badge.
  onToggleUsed?: (id: string, next: boolean) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const columns: ColumnDef<RewardWithTags>[] = [
    {
      id: "store",
      header: "店家",
      cell: ({ row }) => {
        const r = row.original;
        const isExpanded = expandedId === r.id;
        return (
          // Phase 4D: no longer a Link to /reward/[id] — clicking anywhere
          // on the row (see the <tr onClick> below) expands/collapses this
          // row inline instead, on every screen size. The route itself
          // still exists for direct URL access / SEO (see sitemap.ts).
          <div className="flex min-w-0 items-center gap-2">
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0 text-muted transition-transform duration-200",
                isExpanded && "rotate-90"
              )}
            />
           <div className="min-w-0 flex-1 md:flex-none">
  <span className="block truncate font-medium">
    {r.store_name}
  </span>

  <span className="mt-0.5 block truncate text-xs text-muted md:hidden">
    {r.content}
  </span>
</div>
          </div>
        );
      },
    },
    {
      id: "category",
      header: "類別",
      cell: ({ row }) => <CategoryBadge category={row.original.category} />,
    },
    {
      id: "content",
      header: "優惠內容",
      cell: ({ row }) => (
        <span className="block min-w-0 w-full truncate text-ink/90 md:line-clamp-2 md:w-auto md:max-w-[320px] md:whitespace-normal">
          {row.original.content}
        </span>
      ),
    },
    {
      id: "date_category",
      header: "日期",
      cell: ({ row }) => row.original.date_category,
    },
    {
      id: "score",
      header: "分數",
      cell: ({ row }) => <StarRating score={row.original.score} />,
    },
    {
      id: "expiry",
      header: "截止",
      cell: ({ row }) => {
        const info = row.original.expiry_date;
        return info ? <ExpiryBadge expiryDate={info} /> : <span className="text-muted">—</span>;
      },
    },
    {
      id: "favorite",
      header: "收藏",
      cell: ({ row }) => {
        const r = row.original;
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(r.id, !r.is_favorite);
            }}
            aria-pressed={r.is_favorite}
            aria-label={r.is_favorite ? "取消收藏" : "加入收藏"}
            className="shrink-0 rounded-full p-1 text-muted hover:bg-bg"
          >
            <Heart className={cn("h-4 w-4", r.is_favorite && "fill-accent-coffee text-accent-coffee")} />
          </button>
        );
      },
    },
    {
      id: "used",
      header: "使用",
      cell: ({ row }) => {
        const r = row.original;
        const statusClasses = cn(
          "flex items-center gap-1 rounded-pill border px-2 py-0.5 text-xs",
          r.is_used
            ? "border-accent-green bg-accent-green/15 text-accent-green"
            : "border-border text-muted"
        );
        if (!onToggleUsed) {
          // Read-only for general visitors (v2: no public write access)
          return (
            <span className={statusClasses}>
              <Check className="h-3 w-3" />
              {r.is_used ? "已兌換" : "未使用"}
            </span>
          );
        }
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleUsed(r.id, !r.is_used);
            }}
            aria-pressed={r.is_used}
            className={statusClasses}
          >
            <Check className="h-3 w-3" />
            {r.is_used ? "已兌換" : "未使用"}
          </button>
        );
      },
    },
    {
      id: "link",
      header: "",
     cell: ({ row }) => {
  const r = row.original;

  if (!r.official_url) {
    return null;
  }

  return (
    <a
      href={r.official_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`前往 ${r.store_name} 官網`}
            className="rounded-full p-1 text-muted hover:bg-bg"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        );
      },
    },
  ];

  const table = useReactTable({ data: rewards, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-x-auto rounded-card border border-border">
      <table className="w-full border-collapse text-list md:min-w-[880px]">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-border bg-bg/60">
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    "px-2 md:px-4 py-3 text-left font-medium text-muted",
                    MOBILE_HIDDEN_COLUMN_IDS.has(header.column.id) && "hidden md:table-cell"
                  )}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const r = row.original;
            const isExpanded = expandedId === r.id;
            return (
              <Fragment key={row.id}>
                <tr
                  onClick={() => setExpandedId(isExpanded ? null : r.id)}
                  className={cn(
                    "cursor-pointer border-b border-border last:border-0 hover:bg-bg/40",
                    row.original.is_used && "opacity-60"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-2 md:px-4 py-3 align-middle",
                        MOBILE_HIDDEN_COLUMN_IDS.has(cell.column.id) && "hidden md:table-cell",
                        cell.column.id === "content" && "min-w-0",
                        cell.column.id === "favorite" && "pl-2 md:pl-4"
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {/* Phase 4D: expand/collapse now works at every breakpoint
                    (previously mobile-only) — same smooth grid-template-rows
                    animation as before. Content reuses RewardCardBody, the
                    same component the Card grid uses, so Grid and Table
                    show identical reward details. */}
                <tr>
                  <td colSpan={row.getVisibleCells().length} className="p-0">
                    <div
                      className="grid transition-all duration-200 ease-in-out"
                      style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-divider bg-bg/40 px-4 py-4">
                          <RewardCardBody reward={r} clampDescription={false} />
                          {r.official_url && (
                            <a
                              href={r.official_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2.5 text-center font-medium text-ink/90 hover:bg-bg"
                            >
                              前往官網
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}