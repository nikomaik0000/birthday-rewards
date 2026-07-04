"use client";

import Link from "next/link";
import { Heart, Check, ExternalLink, MousePointerClick } from "lucide-react";
import { StoreLogo } from "@/components/store-logo";
import { CategoryBadge, TagBadge } from "@/components/tag-badge";
import { StarRating } from "@/components/star-rating";
import { ExpiryBadge } from "@/components/expiry-badge";
import { ReportDialog } from "@/components/report-dialog";
import type { RewardWithTags } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RewardCard({
  reward,
  onToggleFavorite,
  onToggleUsed,
  onVisit,
}: {
  reward: RewardWithTags;
  onToggleFavorite: (id: string, next: boolean) => void;
  // v2: 已使用 is now admin-only. When this is omitted (general visitor),
  // the card shows a plain read-only status instead of a clickable toggle.
  onToggleUsed?: (id: string, next: boolean) => void;
  onVisit: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        // v2 spacing pass: p-4 → p-5, gap-3 → gap-4 for more breathing room;
        // border-radius/shadow stay on the shared rounded-card / shadow-soft
        // tokens so every card in the app stays visually consistent.
        "group relative flex flex-col gap-4 rounded-card border border-border bg-surface p-5 shadow-soft transition-shadow hover:shadow-pop",
        reward.is_used && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <StoreLogo name={reward.store_name} logoUrl={reward.logo_url} size={36} />
          <div className="min-w-0">
            {reward.official_url ? (
              <a
                href={reward.official_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onVisit(reward.id)}
                className="relative z-10 flex items-center gap-1 truncate font-medium text-ink hover:underline"
              >
                <span className="truncate">{reward.store_name}</span>
                <ExternalLink className="h-3 w-3 shrink-0 text-muted" />
              </a>
            ) : (
              <span className="truncate font-medium">{reward.store_name}</span>
            )}
            <div className="mt-1.5 flex items-center gap-2">
              <CategoryBadge category={reward.category} />
              <ExpiryBadge expiryDate={reward.expiry_date} />
            </div>
          </div>
        </div>

        {/* Icon-button row: favorite + report, both sized/styled the same
            (h-4 w-4 icon in a p-1.5 hit target) for visual consistency. */}
        <div className="flex shrink-0 items-center gap-1">
          <ReportDialog rewardId={reward.id} storeName={reward.store_name} />
          <button
            type="button"
            onClick={() => onToggleFavorite(reward.id, !reward.is_favorite)}
            aria-label={reward.is_favorite ? "取消收藏" : "加入收藏"}
            aria-pressed={reward.is_favorite}
            className="relative z-10 rounded-full p-1.5 text-muted hover:bg-bg"
          >
            <Heart className={cn("h-4 w-4", reward.is_favorite && "fill-accent-coffee text-accent-coffee")} />
          </button>
        </div>
      </div>

      <p className="line-clamp-3 text-sm text-ink/90">{reward.content}</p>

      {reward.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {reward.tags.map((t) => (
            <TagBadge key={t.id} name={t.name} colorHex={t.color_hex} />
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-1">
        <StarRating score={reward.score} />
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-muted">
            <MousePointerClick className="h-3.5 w-3.5" />
            {reward.click_count}
          </span>
          {onToggleUsed ? (
            <button
              type="button"
              onClick={() => onToggleUsed(reward.id, !reward.is_used)}
              aria-pressed={reward.is_used}
              className={cn(
                "relative z-10 flex items-center gap-1 rounded-pill border px-2.5 py-1 text-xs font-medium transition-colors",
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

      <Link
        href={`/reward/${reward.id}`}
        className="absolute inset-0"
        aria-label={`查看 ${reward.store_name} 詳情`}
        tabIndex={-1}
      />
    </div>
  );
}
