"use client";

import { Fragment, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from "@tanstack/react-table";
import { Heart, Square, SquareCheck, ChevronRight } from "lucide-react";
import { CategoryBadge } from "@/components/tag-badge";
import { StarRating } from "@/components/star-rating";
import { RewardExtraInfo } from "@/components/reward-extra-info";
import type { RewardWithTags } from "@/lib/types";
import { cn } from "@/lib/utils";

// Columns hidden on mobile (< md). Phase 3C keeps 收藏 / 店家 / 優惠內容(preview) visible
// there; 日期 moves into the expanded accordion instead of showing as its own column.
const MOBILE_HIDDEN_COLUMN_IDS = new Set(["category", "content", "date_category", "score", "used"]);

// Phase 4E (final polish, mockup-aligned): only the fixed-shape "utility"
// columns and Store get an explicit width (see COLUMN_WIDTH_CLASSES
// below), sized compactly. Reward Content is left completely unconstrained,
// so under `table-fixed` it absorbs effectively all the remaining space —
// making it the clear primary/dominant column (~50% in the reference
// mockup), which matches real data: store names are usually short, reward
// descriptions are usually the longest text in the table.
//
// Note: Store previously used a `min-width` floor (so it could flex for
// longer names) rather than a hard `width`. The latest mockup calls for a
// fixed smaller Store width specifically, so it's now a true `width` like
// the other utility columns — Store text still truncates with an ellipsis
// if a name is longer than the column, so nothing is lost.
const CENTERED_COLUMN_IDS = new Set(["category", "date_category", "score", "favorite", "used"]);

// Phase 4E (revised): Category gets a reduced left padding so it visually
// sits closer to Store, without touching any other column's spacing.
// Phase 4E (rendering fix): Favorite gets its own compact, symmetric
// padding — the shared default (px-2/md:px-4) was generous enough,
// relative to Favorite's narrow fixed column, that combined with the
// heart button's own internal padding it read as extra empty space
// around the icon. A tighter dedicated value keeps the icon visually
// centered with no surrounding "gap."
const COLUMN_PADDING: Record<string, string> = {
  store: "pl-2 pr-1 md:pl-4 md:pr-2",
  category: "pl-1 pr-2 md:pl-2 md:pr-4",
  favorite: "px-1",
};

// Phase 4E (final polish, mockup-aligned): utility-column + Store widths,
// applied as Tailwind classes on <col>. Category/Date/Score/Used/Store are
// `md:`-scoped (desktop only) since Category/Date/Score/Used are hidden on
// mobile — an unscoped width there previously caused a mobile regression
// (some browsers reserve width for a "hidden" column) — and Store has no
// width constraint at all on mobile (pure auto-sizing, unchanged there).
// Favorite is different: it's visible on *both* mobile and desktop, so it
// always gets an explicit width — a small, fixed footprint that Store/
// Content can never push or affect, on mobile or desktop alike.
//
// Phase 4E (mobile-only refinement): Favorite is intentionally narrower on
// mobile (44px) than on desktop (56px, matching the agreed spec: Store
// 136 / Category 80 / Date 72 / Rating 72 / Favorite 56 / Used 56). This
// is purely a column-width change — Favorite's header/icon are still
// centered by the same symmetric padding + `text-center` regardless of
// width (see COLUMN_PADDING/CENTERED_COLUMN_IDS), so the icon itself never
// shifts within its own column. Shrinking the column just hands the freed
// mobile space to Store (the only other unconstrained visible column
// there), which moves Favorite's whole column — icon still centered
// inside it — further toward the right edge.
const COLUMN_WIDTH_CLASSES: Record<string, string> = {
  store: "md:w-[200px]",
  category: "md:w-[80px]",
  date_category: "md:w-[72px]",
  score: "md:w-[72px]",
  favorite: "w-[44px] md:w-[56px]",
  used: "md:w-[56px]",
};

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
        // Phase 4E: on desktop, expanding only ever reveals notes/tags/link
        // (everything else is already a column) — dim the chevron when a
        // reward has none of those, so it doesn't promise content that
        // isn't there. Mobile always has something to show, so it keeps
        // full visibility regardless.
        const hasExtra = Boolean(r.notes) || r.tags.length > 0 || Boolean(r.official_url);
        return (
          // Phase 4D: no longer a Link to /reward/[id] — clicking anywhere
          // on the row (see the <tr onClick> below) expands/collapses this
          // row inline instead, on every screen size. The route itself
          // still exists for direct URL access / SEO (see sitemap.ts).
          <div className="flex min-w-0 items-center gap-2">
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0 text-muted transition-transform duration-200",
                isExpanded && "rotate-90",
                !hasExtra && "md:invisible"
              )}
            />
            {/* Phase 4E (rendering fix): `flex-1 min-w-0` at every
                breakpoint (previously `md:flex-none` on desktop) — flex-none
                disables shrinking, which silently defeated the `truncate`
                below and let long store names render at their natural
                width past the fixed 136px column instead of ellipsing.
                `md:flex-none` made sense under the old min-width-based
                Store column (meant to flex for longer names); now that
                Store is a true fixed width, it needs to always shrink to
                fit, so the rendered width actually matches 136px. */}
            <div className="min-w-0 flex-1">
              <span className="block truncate font-medium">{r.store_name}</span>
              {/* Phase 4E (rendering fix): dropped the hardcoded `pr-2` —
                  it added a fixed buffer regardless of text length, which
                  stacked with Favorite's own padding to look like an
                  unnecessary gap on mobile. */}
              <span className="mt-0.5 block truncate text-xs text-muted md:hidden">{r.content}</span>
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
        // Phase 4E: single-line truncate at every breakpoint (previously
        // 2-line clamp on desktop) — keeps every collapsed row the same
        // height regardless of description length. The full text is still
        // reachable by expanding the row.
        <span className="block min-w-0 w-full truncate text-ink/90">
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
        // Phase 4E (UI refinements): icon-only now that the column header
        // already says 使用 — a text pill was redundant. Colored the same
        // neutral palette as the Favorite heart (text-muted / accent-coffee)
        // rather than green, so it doesn't read as a separate accent.
        const icon = r.is_used ? (
          <SquareCheck className="h-4 w-4 text-accent-coffee" />
        ) : (
          <Square className="h-4 w-4 text-muted" />
        );
        if (!onToggleUsed) {
          // Read-only for general visitors (v2: no public write access)
          return (
            <span aria-label={r.is_used ? "已兌換" : "未使用"}>
              {icon}
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
            aria-label={r.is_used ? "已兌換" : "未使用"}
            className="shrink-0 rounded-full p-1 hover:bg-bg"
          >
            {icon}
          </button>
        );
      },
    },
  ];

  const table = useReactTable({ data: rewards, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-x-auto rounded-card border border-border">
      {/* Phase 4E (final polish, mockup-aligned): `table-fixed` (desktop
          only) still keeps columns stable across widths instead of
          reflowing — Store and the utility columns each get an explicit
          width via `md:`-scoped classes on <col> (Favorite excepted — see
          COLUMN_WIDTH_CLASSES); Content is unconstrained and absorbs the
          rest. `min-w` covers Store (136px) + the utility columns' total
          (~336px) + a reasonable minimum for Content. */}
      <table className="w-full border-collapse text-list md:min-w-[682px] md:table-fixed">
        <colgroup>
          {table.getAllLeafColumns().map((column) => (
            <col key={column.id} className={COLUMN_WIDTH_CLASSES[column.id]} />
          ))}
        </colgroup>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-border bg-bg/60">
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    "whitespace-nowrap py-3 font-medium text-muted",
                    COLUMN_PADDING[header.column.id] ?? "px-2 md:px-4",
                    CENTERED_COLUMN_IDS.has(header.column.id) ? "text-center" : "text-left",
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
            // Phase 4E: on desktop, every field is already a column, so the
            // expand panel only ever adds notes/tags/link. When a reward has
            // none of those, expanding would just reveal an empty padded
            // box — so we detect that case and collapse it to true zero
            // height, and dim the chevron so it doesn't promise content
            // that isn't there. Mobile always has something (rating/
            // category/expiry aren't columns there), so it's unaffected.
            const hasExtra = Boolean(r.notes) || r.tags.length > 0 || Boolean(r.official_url);
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
                        // Phase 4E: `min-h` (rather than a fixed `h`) keeps
                        // every collapsed row the same minimum height while
                        // still letting a cell grow if it ever needs to.
                        // `text-center` on the cell itself (rather than a
                        // flex wrapper) is enough to center these columns'
                        // inline content (badges, star rating, icon
                        // buttons). Unscoped (not `md:text-center`) so
                        // Favorite — the one centered column still visible
                        // on mobile — centers there too; the others are
                        // hidden on mobile so this has no visible effect
                        // for them.
                        "min-h-[52px] py-3 align-middle",
                        COLUMN_PADDING[cell.column.id] ?? "px-2 md:px-4",
                        CENTERED_COLUMN_IDS.has(cell.column.id) && "text-center",
                        MOBILE_HIDDEN_COLUMN_IDS.has(cell.column.id) && "hidden md:table-cell",
                        cell.column.id === "content" && "min-w-0"
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {/* Phase 4D: expand/collapse works at every breakpoint, same
                    smooth grid-template-rows animation.
                    Phase 4E: Desktop's row already shows every remaining
                    column (category/content/date/score/favorite/used), so
                    its expand panel only shows what's genuinely missing —
                    notes, tags, official link (RewardExtraInfo). Expiry date
                    is no longer shown on desktop at all (its dedicated
                    column was removed this phase; it still drives filtering/
                    sorting and still appears on the Card view). Mobile hides
                    most of those columns, so its panel additionally repeats
                    the full description plus rating/category — the only
                    place they're visible there. Spacing kept tight/compact
                    throughout, and the panel collapses to zero on desktop
                    when there's nothing extra to show. */}
                <tr>
                  <td colSpan={row.getVisibleCells().length} className="p-0">
                    <div
                      className="grid transition-all duration-200 ease-in-out"
                      style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div
                          className={cn(
                            "border-t border-divider bg-bg/40 px-4 py-3",
                            !hasExtra && "md:border-t-0 md:bg-transparent md:py-0"
                          )}
                        >
                
                          {hasExtra && (
                            <div className="mt-2 space-y-2 md:mt-0">
                              <RewardExtraInfo reward={r} />
                            </div>
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
