"use client";

import { useState } from "react";
import { Heart, Check } from "lucide-react";
import { toast } from "sonner";
import { toggleFavorite, toggleUsed } from "@/app/actions/rewards";
import type { RewardWithTags } from "@/lib/types";
import { cn } from "@/lib/utils";

// v2: 收藏 stays public; 已使用 is admin-only, so we render it read-only
// (no onClick, no aria-pressed) for general visitors instead of hiding it
// entirely — the status is still useful information to see.
export function FavoriteUsedControls({ reward, isAdmin }: { reward: RewardWithTags; isAdmin: boolean }) {
  const [isFavorite, setIsFavorite] = useState(reward.is_favorite);
  const [isUsed, setIsUsed] = useState(reward.is_used);

  const usedBadgeClasses = cn(
    "flex items-center gap-1 rounded-pill border px-2.5 py-1 text-xs font-medium",
    isUsed
      ? "border-accent-green bg-accent-green/15 text-accent-green"
      : "border-border text-muted dark:border-border-dark"
  );

  return (
    <div className="flex shrink-0 flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => {
          const next = !isFavorite;
          setIsFavorite(next);
          toggleFavorite(reward.id, next).catch(() => {
            setIsFavorite(!next);
            toast.error("更新失敗，請稍後再試");
          });
        }}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "取消收藏" : "加入收藏"}
        className="rounded-full p-2 text-muted hover:bg-bg dark:hover:bg-bg-dark"
      >
        <Heart className={cn("h-5 w-5", isFavorite && "fill-accent-coffee text-accent-coffee")} />
      </button>

      {isAdmin ? (
        <button
          type="button"
          onClick={() => {
            const next = !isUsed;
            setIsUsed(next);
            toggleUsed(reward.id, next).catch(() => {
              setIsUsed(!next);
              toast.error("更新失敗，請稍後再試");
            });
          }}
          aria-pressed={isUsed}
          className={usedBadgeClasses}
        >
          <Check className="h-3 w-3" />
          {isUsed ? "已兌換" : "未使用"}
        </button>
      ) : (
        <span className={usedBadgeClasses}>
          <Check className="h-3 w-3" />
          {isUsed ? "已兌換" : "未使用"}
        </span>
      )}
    </div>
  );
}
