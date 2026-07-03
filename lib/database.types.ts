// Hand-authored to match supabase/schema.sql.
// Once your project is live, regenerate with:
//   npx supabase gen types typescript --project-id <id> > lib/database.types.ts

export type Category = "飲料" | "食物" | "美妝" | "其他";
export type DateCategory = "月底" | "次月底" | "其他";

export interface RewardRow {
  id: string;
  store_name: string;
  category: Category;
  content: string;
  date_category: DateCategory;
  score: number;
  official_url: string | null;
  logo_url: string | null;
  is_favorite: boolean;
  is_used: boolean;
  click_count: number;
  expiry_date: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_featured: boolean;
  reward_type: string | null;
  region: string | null;
  city: string | null;
  country: string | null;
  brand: string | null;
  source: string | null;
  last_verified_at: string | null;
  verified_by: string | null;
  ai_summary: string | null;
  ai_tags: string[] | null;
  ai_score: number | null;
  metadata: Record<string, unknown>;
}

export interface TagRow {
  id: string;
  name: string;
  color_hex: string;
  created_at: string;
}

export interface RewardTagRow {
  reward_id: string;
  tag_id: string;
}

export interface CollectionRow {
  id: string;
  owner_id: string | null;
  name: string;
  created_at: string;
}

export interface CollectionRewardRow {
  collection_id: string;
  reward_id: string;
  added_at: string;
}

export interface RewardHistoryRow {
  id: string;
  reward_id: string;
  changed_at: string;
  changed_by: string | null;
  field_changed: string;
  old_value: string | null;
  new_value: string | null;
}

// v2: added for the "資料回報" (report an issue) feature — see
// supabase/migrations/002_reward_reports.sql
export type ReportStatus = "pending" | "resolved";

export interface ReportRow {
  id: string;
  reward_id: string;
  message: string;
  contact: string | null;
  status: ReportStatus;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      rewards: {
        Row: RewardRow;
        Insert: Partial<RewardRow> & {
          store_name: string;
          category: Category;
        };
        Update: Partial<RewardRow>;
        Relationships: [];
      };
      tags: {
        Row: TagRow;
        Insert: Partial<TagRow> & { name: string };
        Update: Partial<TagRow>;
        Relationships: [];
      };
      reward_tags: {
        Row: RewardTagRow;
        Insert: RewardTagRow;
        Update: Partial<RewardTagRow>;
        Relationships: [];
      };
      collections: {
        Row: CollectionRow;
        Insert: Partial<CollectionRow> & { name: string };
        Update: Partial<CollectionRow>;
        Relationships: [];
      };
      collection_rewards: {
        Row: CollectionRewardRow;
        Insert: CollectionRewardRow;
        Update: Partial<CollectionRewardRow>;
        Relationships: [];
      };
      reward_history: {
        Row: RewardHistoryRow;
        Insert: Partial<RewardHistoryRow> & { reward_id: string; field_changed: string };
        Update: Partial<RewardHistoryRow>;
        Relationships: [];
      };
      // v2: 資料回報 feature
      reward_reports: {
        Row: ReportRow;
        Insert: Partial<ReportRow> & { reward_id: string; message: string };
        Update: Partial<ReportRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_click: {
        Args: { reward_id: string };
        Returns: void;
      };
      // v2: narrow, column-scoped RPC that replaces the old broad anon
      // UPDATE policy — see migrations/003_tighten_rls.sql
      toggle_reward_favorite: {
        Args: { reward_id: string; favorite: boolean };
        Returns: void;
      };
    };
  };
}
