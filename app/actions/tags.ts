"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { colorForTagName } from "@/lib/constants";

export async function createTag(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("標籤名稱不可為空");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .insert({ name: trimmed, color_hex: colorForTagName(trimmed) })
    .select("id, name, color_hex")
    .single();

  if (error) throw error;
  revalidatePath("/");
  return data;
}

export async function deleteTag(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
}

export async function createCollection(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("請先登入");

  const { data, error } = await supabase
    .from("collections")
    .insert({ name: name.trim(), owner_id: user.id })
    .select("*")
    .single();

  if (error) throw error;
  revalidatePath("/");
  return data;
}

export async function addRewardToCollection(collectionId: string, rewardId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("collection_rewards")
    .insert({ collection_id: collectionId, reward_id: rewardId });
  if (error) throw error;
  revalidatePath("/");
}

export async function removeRewardFromCollection(collectionId: string, rewardId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("collection_rewards")
    .delete()
    .eq("collection_id", collectionId)
    .eq("reward_id", rewardId);
  if (error) throw error;
  revalidatePath("/");
}
