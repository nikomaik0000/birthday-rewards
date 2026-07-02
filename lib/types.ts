import type { Category, DateCategory, RewardRow, TagRow } from "@/lib/database.types";

export type { Category, DateCategory };

export interface RewardWithTags extends RewardRow {
  tags: TagRow[];
}

export type ViewMode = "table" | "card";

export type SortKey =
  | "expiry_asc"
  | "score_desc"
  | "clicks_desc"
  | "store_name_asc"
  | "created_desc"
  | "updated_desc";

export interface RewardFilters {
  query: string;
  categories: Category[];
  dateCategories: DateCategory[];
  scores: number[];
  favoriteOnly: boolean;
  usedFilter: "all" | "used" | "unused";
  tagIds: string[];
  hideExpired: boolean;
}

export const DEFAULT_FILTERS: RewardFilters = {
  query: "",
  categories: [],
  dateCategories: [],
  scores: [],
  favoriteOnly: false,
  usedFilter: "all",
  tagIds: [],
  hideExpired: false,
};

export interface DashboardStats {
  totalStores: number;
  totalRewards: number;
  favoriteCount: number;
  usedCount: number;
  unusedCount: number;
  averageScore: number;
  topScoreStore: string | null;
  topClickedStore: string | null;
  categoryCounts: Record<Category, number>;
}
