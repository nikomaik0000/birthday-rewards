"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { rewardFormSchema, type RewardFormValues } from "@/lib/schema";
import { colorForTagName } from "@/lib/constants";

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
  const { error } = await supabase.from("rewards").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
}

export async function bulkDeleteRewards(ids: string[]) {
  const supabase = await createClient();
  const { error } = await supabase.from("rewards").delete().in("id", ids);
  if (error) throw error;
  revalidatePath("/");
}

export async function bulkUpdateCategory(ids: string[], category: RewardFormValues["category"]) {
  const supabase = await createClient();
  const { error } = await supabase.from("rewards").update({ category }).in("id", ids);
  if (error) throw error;
  revalidatePath("/");
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("rewards").update({ is_favorite: isFavorite }).eq("id", id);
  if (error) throw error;
  revalidatePath("/");
}

export async function toggleUsed(id: string, isUsed: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("rewards").update({ is_used: isUsed }).eq("id", id);
  if (error) throw error;
  revalidatePath("/");
}

export async function trackClick(id: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_click", { reward_id: id });
}

export async function updateNotes(id: string, notes: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("rewards").update({ notes }).eq("id", id);
  if (error) throw error;
  revalidatePath(`/reward/${id}`);
}
