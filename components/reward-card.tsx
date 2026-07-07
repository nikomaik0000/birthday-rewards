"use client";

import { Heart, Check, Link2 } from "lucide-react";
import { CategoryBadge, TagBadge } from "@/components/tag-badge";
import { StarRating } from "@/components/star-rating";
import { ExpiryBadge } from "@/components/expiry-badge";
import type { RewardWithTags } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RewardCard({
  reward,
  onToggleFavorite,
  onToggleUsed,
}: {
  reward: RewardWithTags;
  onToggleFavorite: (id: string, next: boolean) => void;
  // v2: 已使用 is now admin-only. When this is omitted (general visitor),
  // the card shows a plain read-only status instead of a clickable toggle.
  onToggleUsed?: (id: string, next: boolean) => void;
}) {
  // A labeled pill (not icon-only) — the text makes the status legible at a
  // glance. All colors come from theme tokens (accent-green / border / muted).
  const usedPillClasses = cn(
    "flex shrink-0 items-center gap-1 rounded-pill border px-2.5 py-1 text-xs font-medium transition-colors",
    reward.is_used
      ? "border-accent-green bg-accent-green/15 text-accent-green"
      : "border-border text-muted"
  );

  return (
    <div
      className={cn(
        // v2 spacing pass: p-4 → p-5, gap-3 → gap-4 for more breathing room;
        // border-radius/shadow stay on the shared rounded-card / shadow-soft
        // tokens so every card in the app stays visually consistent.
        // Phase 4B: the card is no longer a click target — no dialog, no
        // detail-page navigation.
        // Phase 4C: fixed min-height (instead of a reserved blank notes
        // line) keeps every card the same height, whether or not a reward
        // has notes — the bottom section is pinned down with mt-auto.
        "group relative flex min-h-card flex-col rounded-card border border-border bg-surface p-5 shadow-soft transition-shadow hover:shadow-pop",
        reward.is_used && "opacity-60"
      )}
    >
      {/* Phase 4C: Link / Favorite / Used live together in the top-right
          corner. Used stays a labeled pill (easier to read at a glance)
          while Link/Favorite stay icon-only, all aligned on one row. */}
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 flex-1 truncate text-lg font-semibold">{reward.store_name}</span>

        <div className="flex shrink-0 items-center gap-1.5">
          {reward.official_url && (
            <a
              href={reward.official_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`前往 ${reward.store_name} 官網`}
              className="shrink-0 rounded-full p-1.5 text-muted hover:bg-bg"
            >
              <Link2 className="h-4 w-4" />
            </a>
          )}

          <button
            type="button"
            onClick={() => onToggleFavorite(reward.id, !reward.is_favorite)}
            aria-label={reward.is_favorite ? "取消收藏" : "加入收藏"}
            aria-pressed={reward.is_favorite}
            className="shrink-0 rounded-full p-1.5 text-muted hover:bg-bg"
          >
            <Heart className={cn("h-4 w-4", reward.is_favorite && "fill-accent-coffee text-accent-coffee")} />
          </button>

          {onToggleUsed ? (
            <button
              type="button"
              onClick={() => onToggleUsed(reward.id, !reward.is_used)}
              aria-pressed={reward.is_used}
              className={usedPillClasses}
            >
              <Check className="h-3 w-3" />
              {reward.is_used ? "已兌換" : "未使用"}
            </button>
          ) : (
            // Read-only status for general visitors (v2: no public write access)
            <span className={usedPillClasses}>
              <Check className="h-3 w-3" />
              {reward.is_used ? "已兌換" : "未使用"}
            </span>
          )}
        </div>
      </div>

      {/* Thin divider under the title — same border token used everywhere
          else in the app (no darker/one-off color). */}
      <div className="mt-3 border-t border-border/70" />

      <p className="mt-3 line-clamp-3 text-sm text-ink/90">{reward.content}</p>

      {/* Notes only render when present — no more reserved blank line.
          Lighter than the description (text-muted/70) so it doesn't compete
          for attention. */}
      {reward.notes && (
        <p className="mt-1 truncate text-xs font-normal text-muted/70">
          <span className="text-muted/50">› </span>
          {reward.notes}
        </p>
      )}

      {/* Badge row: Category → Validity Period → Redemption Method(s), one
          consistently-spaced row, all sharing the same unified badge style —
          now paired with the rating on the same bottom row. */}
      <div className="mt-auto flex items-end justify-between gap-2 pt-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <CategoryBadge category={reward.category} />
          <ExpiryBadge expiryDate={reward.expiry_date} />
          {reward.tags.map((t) => (
            <TagBadge key={t.id} name={t.name} colorHex={t.color_hex} />
          ))}
        </div>
        <StarRating className="shrink-0" score={reward.score} />
      </div>
    </div>
  );
}
