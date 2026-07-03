"use client";

import Link from "next/link";
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from "@tanstack/react-table";
import { Heart, Check, ExternalLink } from "lucide-react";
import { StoreLogo } from "@/components/store-logo";
import { CategoryBadge } from "@/components/tag-badge";
import { StarRating } from "@/components/star-rating";
import { ExpiryBadge } from "@/components/expiry-badge";
import { ReportDialog } from "@/components/report-dialog";
import type { RewardWithTags } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RewardTable({
  rewards,
  onToggleFavorite,
  onToggleUsed,
  onVisit,
}: {
  rewards: RewardWithTags[];
  onToggleFavorite: (id: string, next: boolean) => void;
  // v2: 已使用 is admin-only now — omit this prop to render a read-only badge.
  onToggleUsed?: (id: string, next: boolean) => void;
  onVisit: (id: string) => void;
}) {
  const columns: ColumnDef<RewardWithTags>[] = [
    {
      id: "store",
      header: "店家",
      cell: ({ row }) => {
        const r = row.original;
        return (
          <Link href={`/reward/${r.id}`} className="flex min-w-0 items-center gap-2.5">
            <StoreLogo name={r.store_name} logoUrl={r.logo_url} size={26} />
            <span className="truncate font-medium">{r.store_name}</span>
          </Link>
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
        <span className="line-clamp-2 max-w-[320px] text-ink/90 dark:text-ink-dark/90">
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
      id: "clicks",
      header: "點擊",
      cell: ({ row }) => <span className="tabular-nums text-muted">{row.original.click_count}</span>,
    },
    {
      id: "favorite",
      header: "收藏",
      cell: ({ row }) => {
        const r = row.original;
        return (
          <button
            type="button"
            onClick={() => onToggleFavorite(r.id, !r.is_favorite)}
            aria-pressed={r.is_favorite}
            aria-label={r.is_favorite ? "取消收藏" : "加入收藏"}
            className="rounded-full p-1 text-muted hover:bg-bg dark:hover:bg-bg-dark"
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
            : "border-border text-muted dark:border-border-dark"
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
          <button type="button" onClick={() => onToggleUsed(r.id, !r.is_used)} aria-pressed={r.is_used} className={statusClasses}>
            <Check className="h-3 w-3" />
            {r.is_used ? "已兌換" : "未使用"}
          </button>
        );
      },
    },
    {
      id: "report",
      header: "",
      cell: ({ row }) => <ReportDialog rewardId={row.original.id} storeName={row.original.store_name} />,
    },
    {
      id: "link",
      header: "",
      cell: ({ row }) => {
        const r = row.original;
        if (!r.official_url) return null;
        return (
          <a
            href={r.official_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onVisit(r.id)}
            aria-label={`前往 ${r.store_name} 官網`}
            className="rounded-full p-1 text-muted hover:bg-bg dark:hover:bg-bg-dark"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        );
      },
    },
  ];

  const table = useReactTable({ data: rewards, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-x-auto rounded-card border border-border dark:border-border-dark">
      <table className="w-full min-w-[880px] border-collapse text-list">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-border bg-bg/60 dark:border-border-dark dark:bg-bg-dark/60">
              {hg.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 text-left font-medium text-muted">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={cn(
                "border-b border-border last:border-0 hover:bg-bg/40 dark:border-border-dark dark:hover:bg-bg-dark/40",
                row.original.is_used && "opacity-60"
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 align-middle">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
