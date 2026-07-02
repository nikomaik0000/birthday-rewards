import type { RewardWithTags, DashboardStats, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";

export function computeDashboardStats(rewards: RewardWithTags[]): DashboardStats {
  const categoryCounts = CATEGORIES.reduce((acc, c) => {
    acc[c] = 0;
    return acc;
  }, {} as Record<Category, number>);

  let scoreSum = 0;
  let topScore = { name: null as string | null, score: -1 };
  let topClicks = { name: null as string | null, clicks: -1 };
  let favoriteCount = 0;
  let usedCount = 0;

  const stores = new Set<string>();

  for (const r of rewards) {
    stores.add(r.store_name);
    categoryCounts[r.category] += 1;
    scoreSum += r.score;
    if (r.is_favorite) favoriteCount += 1;
    if (r.is_used) usedCount += 1;
    if (r.score > topScore.score) topScore = { name: r.store_name, score: r.score };
    if (r.click_count > topClicks.clicks) topClicks = { name: r.store_name, clicks: r.click_count };
  }

  return {
    totalStores: stores.size,
    totalRewards: rewards.length,
    favoriteCount,
    usedCount,
    unusedCount: rewards.length - usedCount,
    averageScore: rewards.length ? Number((scoreSum / rewards.length).toFixed(1)) : 0,
    topScoreStore: topScore.name,
    topClickedStore: topClicks.name,
    categoryCounts,
  };
}
