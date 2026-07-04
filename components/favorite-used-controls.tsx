"use client";

import { useState } from "react";
import { Heart, Check } from "lucide-react";
import { toast } from "sonner";
import { toggleFavorite } from "@/app/actions/rewards";
import { useLocalFavorites, useLocalUsedStatus } from "@/hooks/use-local-reward-flags";
import type { RewardWithTags } from "@/lib/types";
import { cn } from "@/lib/utils";

// Favorites: admins keep the existing Supabase-backed toggle. Everyone
// else favorites locally in their own browser — never written to Supabase.
// Used status is a personal checklist for every visitor (including
// admins), so it always lives in localStorage and is always interactive.
export function FavoriteUsedControls({ reward, isAdmin }: { reward: RewardWithTags; isAdmin: boolean }) {
  const localFavorites = useLocalFavorites();
  const localUsed = useLocalUsedStatus();

  const [supabaseFavorite, setSupabaseFavorite] = useState(reward.is_favorite);
  const isFavorite = isAdmin ? supabaseFavorite : localFavorites.has(reward.id);
  const isUsed = localUsed.has(reward.id);

  const usedBadgeClasses = cn(
    "flex items-center gap-1 rounded-pill border px-2.5 py-1 text-xs font-medium",
    isUsed
      ? "border-accent-green bg-accent-green/15 text-accent-green"
      : "border-border text-muted"
  );

  return (
    <div className="flex shrink-0 flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => {
          const next = !isFavorite;
          if (isAdmin) {
            setSupabaseFavorite(next);
            toggleFavorite(reward.id, next).catch(() => {
              setSupabaseFavorite(!next);
              toast.error("更新失敗，請稍後再試");
            });
          } else {
            localFavorites.toggle(reward.id, next);
          }
        }}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "取消收藏" : "加入收藏"}
        className="rounded-full p-2 text-muted hover:bg-bg"
      >
        <Heart className={cn("h-5 w-5", isFavorite && "fill-accent-coffee text-accent-coffee")} />
      </button>

      <button
        type="button"
        onClick={() => localUsed.toggle(reward.id, !isUsed)}
        aria-pressed={isUsed}
        aria-label={isUsed ? "取消標記為已兌換" : "標記為已兌換"}
        className={usedBadgeClasses}
      >
        <Check className="h-3 w-3" />
        {isUsed ? "已兌換" : "未使用"}
      </button>
    </div>
  );
}
