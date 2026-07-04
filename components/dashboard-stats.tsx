import type { DashboardStats } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { StarRating } from "@/components/star-rating";

export function DashboardStatsPanel({ stats }: { stats: DashboardStats }) {
  const cards: { label: string; value: React.ReactNode }[] = [
    { label: "店家數", value: stats.totalStores },
    { label: "優惠總數", value: stats.totalRewards },
    { label: "收藏", value: stats.favoriteCount },
    { label: "已使用", value: stats.usedCount },
    { label: "未使用", value: stats.unusedCount },
    { label: "平均分數", value: <StarRating score={Math.round(stats.averageScore)} /> },
    { label: "最高分店家", value: stats.topScoreStore ?? "—" },
    { label: "最多點擊", value: stats.topClickedStore ?? "—" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-card border border-border bg-surface px-4 py-3"
          >
            <div className="text-xs text-muted">{c.label}</div>
            <div className="mt-1 text-title font-semibold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-card border border-border bg-surface px-4 py-3">
        <div className="mb-2 text-xs text-muted">各類別數量</div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {CATEGORIES.map((c) => (
            <div key={c} className="flex items-center gap-2 text-sm">
              <span className="text-muted">{c}</span>
              <span className="font-medium">{stats.categoryCounts[c]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
