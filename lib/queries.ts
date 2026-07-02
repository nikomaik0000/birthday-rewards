import { createClient } from "@/lib/supabase/server";
import type { RewardWithTags } from "@/lib/types";
import type { TagRow } from "@/lib/database.types";

/** Fetch all active rewards with their joined tags, newest first. */
export async function getRewardsWithTags(): Promise<RewardWithTags[]> {
  const supabase = await createClient();

  const { data: rewards, error } = await supabase
    .from("rewards")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!rewards?.length) return [];

  const { data: links } = await supabase
    .from("reward_tags")
    .select("reward_id, tag_id")
    .in("reward_id", rewards.map((r) => r.id));

  const { data: tags } = await supabase.from("tags").select("*");
  const tagById = new Map((tags ?? []).map((t) => [t.id, t]));

  const tagsByReward = new Map<string, TagRow[]>();
  for (const link of links ?? []) {
    const tag = tagById.get(link.tag_id);
    if (!tag) continue;
    const list = tagsByReward.get(link.reward_id) ?? [];
    list.push(tag);
    tagsByReward.set(link.reward_id, list);
  }

  return rewards.map((r) => ({ ...r, tags: tagsByReward.get(r.id) ?? [] }));
}

export async function getAllTags(): Promise<TagRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tags").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getRewardWithTags(id: string): Promise<RewardWithTags | null> {
  const supabase = await createClient();
  const { data: reward, error } = await supabase.from("rewards").select("*").eq("id", id).single();
  if (error || !reward) return null;

  const { data: links } = await supabase.from("reward_tags").select("tag_id").eq("reward_id", id);
  const tagIds = (links ?? []).map((l) => l.tag_id);
  const { data: tags } = tagIds.length
    ? await supabase.from("tags").select("*").in("id", tagIds)
    : { data: [] as TagRow[] };

  return { ...reward, tags: tags ?? [] };
}

export async function getRewardHistory(rewardId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reward_history")
    .select("*")
    .eq("reward_id", rewardId)
    .order("changed_at", { ascending: false })
    .limit(50);
  return data ?? [];
}

// Pure stats calculation lives in lib/stats.ts (no server-only imports) so it
// can also be used directly from client components without pulling in
// next/headers via this file's Supabase server client.
export { computeDashboardStats } from "@/lib/stats";
