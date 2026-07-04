"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { rewardFormSchema, type RewardFormValues } from "@/lib/schema";
import { colorForTagName } from "@/lib/constants";

// --- v2 security: every data-mutating action below (except favorite /
// click, which stay public) now requires a signed-in admin. This mirrors
// the RLS policies in supabase/migrations/003_tighten_rls.sql — the guard
// here gives an early, friendly error, while RLS is the real enforcement
// boundary in case someone calls Supabase directly with the anon key. ---
async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("請先登入後台才能執行此操作");
  }
  return user;
}

async function ensureTags(supabase: Awaited<ReturnType<typeof createClient>>, names: string[]) {
  const cleaned = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
  if (!cleaned.length) return [] as string[];

  const { data: existing } = await supabase.from("tags").select("id, name").in("name", cleaned);
  const existingNames = new Set((existing ?? []).map((t) => t.name));
  const toCreate = cleaned.filter((n) => !existingNames.has(n));

  let created: { id: string; name: string }[] = [];
  if (toCreate.length) {
    const { data, error } = await supabase
      .from("tags")
      .insert(toCreate.map((name) => ({ name, color_hex: colorForTagName(name) })))
      .select("id, name");
    if (error) throw error;
    created = data ?? [];
  }

  return [...(existing ?? []), ...created].map((t) => t.id);
}

export async function createReward(values: RewardFormValues) {
  const parsed = rewardFormSchema.parse(values);
  const supabase = await createClient();
  await requireAdmin(supabase); // v2: front-end "quick add" removed, admin only

  const { data: reward, error } = await supabase
    .from("rewards")
    .insert({
      store_name: parsed.store_name,
      category: parsed.category,
      content: parsed.content,
      date_category: parsed.date_category,
      score: parsed.score,
      official_url: parsed.official_url || null,
      logo_url: parsed.logo_url || null,
      expiry_date: parsed.expiry_date || null,
      notes: parsed.notes || "",
    })
    .select("id")
    .single();

  if (error) throw error;

  const tagIds = await ensureTags(supabase, parsed.tagNames);
  if (tagIds.length) {
    await supabase.from("reward_tags").insert(tagIds.map((tag_id) => ({ reward_id: reward.id, tag_id })));
  }

  revalidatePath("/");
  return reward.id as string;
}

export async function updateReward(id: string, values: RewardFormValues) {
  const parsed = rewardFormSchema.parse(values);
  const supabase = await createClient();
  await requireAdmin(supabase); // v2: admin only

  const { data: before } = await supabase.from("rewards").select("*").eq("id", id).single();

  const { error } = await supabase
    .from("rewards")
    .update({
      store_name: parsed.store_name,
      category: parsed.category,
      content: parsed.content,
      date_category: parsed.date_category,
      score: parsed.score,
      official_url: parsed.official_url || null,
      logo_url: parsed.logo_url || null,
      expiry_date: parsed.expiry_date || null,
      notes: parsed.notes || "",
    })
    .eq("id", id);

  if (error) throw error;

  // Replace tag links
  await supabase.from("reward_tags").delete().eq("reward_id", id);
  const tagIds = await ensureTags(supabase, parsed.tagNames);
  if (tagIds.length) {
    await supabase.from("reward_tags").insert(tagIds.map((tag_id) => ({ reward_id: id, tag_id })));
  }

  if (before) {
    await supabase.from("reward_history").insert({
      reward_id: id,
      field_changed: "reward",
      old_value: JSON.stringify({ content: before.content, score: before.score }),
      new_value: JSON.stringify({ content: parsed.content, score: parsed.score }),
    });
  }

  revalidatePath("/");
  revalidatePath(`/reward/${id}`);
}

export async function deleteReward(id: string) {
  const supabase = await createClient();
  await requireAdmin(supabase); // v2: admin only

  const { error } = await supabase.from("rewards").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
}

export async function bulkDeleteRewards(ids: string[]) {
  const supabase = await createClient();
  await requireAdmin(supabase); // v2: admin only

  const { error } = await supabase.from("rewards").delete().in("id", ids);
  if (error) throw error;
  revalidatePath("/");
}

export async function bulkUpdateCategory(ids: string[], category: RewardFormValues["category"]) {
  const supabase = await createClient();
  await requireAdmin(supabase); // v2: admin only

  const { error } = await supabase.from("rewards").update({ category }).in("id", ids);
  if (error) throw error;
  revalidatePath("/");
}

// v2: this is the ONE write action general visitors keep. It now calls a
// narrow SECURITY DEFINER RPC (see migrations/003_tighten_rls.sql) instead
// of a raw `.update()`, because the broad anon UPDATE policy on `rewards`
// was removed — the RPC can only ever touch is_favorite, nothing else.
export async function toggleFavorite(id: string, isFavorite: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("toggle_reward_favorite", {
    reward_id: id,
    favorite: isFavorite,
  });
  if (error) throw error;
  revalidatePath("/");
}

// Click tracking stays public — it's just a popularity counter, and it
// already goes through the increment_click() SECURITY DEFINER RPC from
// schema.sql, which is column-scoped the same way toggle_reward_favorite is.
export async function trackClick(id: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_click", { reward_id: id });
}

export async function updateNotes(id: string, notes: string) {
  const supabase = await createClient();
  await requireAdmin(supabase); // v2: moved from public to admin-only

  const { error } = await supabase.from("rewards").update({ notes }).eq("id", id);
  if (error) throw error;
  revalidatePath(`/reward/${id}`);
}
