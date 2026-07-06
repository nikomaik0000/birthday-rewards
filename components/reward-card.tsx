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
  return (
    <div
      className={cn(
        // v2 spacing pass: p-4 → p-5, gap-3 → gap-4 for more breathing room;
        // border-radius/shadow stay on the shared rounded-card / shadow-soft
        // tokens so every card in the app stays visually consistent.
        // Phase 4B: the card is no longer a click target — no dialog, no
        // detail-page navigation. Every row below is either fixed-height or
        // single-line-clamped so every card renders at the same height.
        "group relative flex flex-col gap-4 rounded-card border border-border bg-surface p-5 shadow-soft transition-shadow hover:shadow-pop",
        reward.is_used && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="block truncate text-base font-semibold">{reward.store_name}</span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
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
        </div>
      </div>

      {/* Badge row: Category → Validity Period → Redemption Method(s), one
          consistently-spaced row, all sharing the same unified badge style. */}
      <div className="flex flex-wrap items-center gap-1.5">
        <CategoryBadge category={reward.category} />
        <ExpiryBadge expiryDate={reward.expiry_date} />
        {reward.tags.map((t) => (
          <TagBadge key={t.id} name={t.name} colorHex={t.color_hex} />
        ))}
      </div>

      <p className="-mt-1 line-clamp-3 text-sm text-ink/90">{reward.content}</p>

      {/* One line is always reserved for notes so every card renders at the
          same height, whether or not this reward has a note. The "›" prefix
          is lighter than the note text — a subtle cue, not competing for
          attention with the actual note. */}
      <p className="mt-1 truncate text-xs font-normal text-muted">
        {reward.notes ? (
          <>
            <span className="text-muted/50">› </span>
            {reward.notes}
          </>
        ) : (
          "\u00A0"
        )}
      </p>

      <div className="mt-auto flex items-center justify-between pt-1">
        <StarRating score={reward.score} />
        {onToggleUsed ? (
          <button
            type="button"
            onClick={() => onToggleUsed(reward.id, !reward.is_used)}
            aria-pressed={reward.is_used}
            className={cn(
              "flex items-center gap-1 rounded-pill border px-2.5 py-1 text-xs font-medium transition-colors",
              reward.is_used
                ? "border-accent-green bg-accent-green/15 text-accent-green"
                : "border-border text-muted"
            )}
          >
            <Check className="h-3 w-3" />
            {reward.is_used ? "已兌換" : "未使用"}
          </button>
        ) : (
          // Read-only status for general visitors (v2: no public write access)
          <span
            className={cn(
              "flex items-center gap-1 rounded-pill border px-2.5 py-1 text-xs font-medium",
              reward.is_used
                ? "border-accent-green bg-accent-green/15 text-accent-green"
                : "border-border text-muted"
            )}
          >
            <Check className="h-3 w-3" />
            {reward.is_used ? "已兌換" : "未使用"}
          </span>
        )}
      </div>
    </div>
  );
}
