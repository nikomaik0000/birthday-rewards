"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { importRowSchema, type ImportRow } from "@/lib/schema";
import { colorForTagName } from "@/lib/constants";

export type DuplicateStrategy = "overwrite" | "skip" | "create";

export interface ImportResult {
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
}

/**
 * Bulk-imports rows parsed client-side from CSV / Excel / JSON.
 * Duplicate detection is by store_name (case-insensitive).
 */
export async function importRewards(
  rawRows: unknown[],
  duplicateStrategy: DuplicateStrategy
): Promise<ImportResult> {
  const supabase = await createClient();
  const result: ImportResult = { inserted: 0, updated: 0, skipped: 0, errors: [] };

  const rows: ImportRow[] = [];
  rawRows.forEach((raw, i) => {
    const parsed = importRowSchema.safeParse(raw);
    if (parsed.success) {
      rows.push(parsed.data);
    } else {
      result.errors.push(`第 ${i + 1} 筆資料格式錯誤：${parsed.error.issues[0]?.message ?? "未知錯誤"}`);
    }
  });

  if (!rows.length) return result;

  const { data: existingRewards } = await supabase.from("rewards").select("id, store_name");
  const existingByName = new Map(
    (existingRewards ?? []).map((r) => [r.store_name.trim().toLowerCase(), r.id])
  );

  for (const row of rows) {
    const key = row.store_name.trim().toLowerCase();
    const existingId = existingByName.get(key);

    const payload = {
      store_name: row.store_name,
      category: row.category,
      content: row.content,
      date_category: row.date_category,
      score: row.score,
      official_url: row.official_url || null,
      expiry_date: row.expiry_date || null,
      notes: row.notes || "",
    };

    if (existingId) {
      if (duplicateStrategy === "skip") {
        result.skipped += 1;
        continue;
      }
      if (duplicateStrategy === "overwrite") {
        const { error } = await supabase.from("rewards").update(payload).eq("id", existingId);
        if (error) {
          result.errors.push(`更新 ${row.store_name} 失敗：${error.message}`);
        } else {
          result.updated += 1;
          await linkTags(supabase, existingId, row.tags);
        }
        continue;
      }
      // duplicateStrategy === "create" falls through to insert a new row
    }

    const { data: inserted, error } = await supabase
      .from("rewards")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      result.errors.push(`新增 ${row.store_name} 失敗：${error.message}`);
    } else {
      result.inserted += 1;
      await linkTags(supabase, inserted.id, row.tags);
    }
  }

  revalidatePath("/");
  return result;
}

async function linkTags(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rewardId: string,
  tagsCsv: string
) {
  const names = tagsCsv
    .split(/[,、]/)
    .map((n) => n.trim())
    .filter(Boolean);
  if (!names.length) return;

  const { data: existing } = await supabase.from("tags").select("id, name").in("name", names);
  const existingNames = new Set((existing ?? []).map((t) => t.name));
  const toCreate = names.filter((n) => !existingNames.has(n));

  let created: { id: string }[] = [];
  if (toCreate.length) {
    const { data } = await supabase
      .from("tags")
      .insert(toCreate.map((name) => ({ name, color_hex: colorForTagName(name) })))
      .select("id");
    created = data ?? [];
  }

  const allIds = [...(existing ?? []).map((t) => t.id), ...created.map((t) => t.id)];
  await supabase.from("reward_tags").delete().eq("reward_id", rewardId);
  if (allIds.length) {
    await supabase
      .from("reward_tags")
      .insert(allIds.map((tag_id) => ({ reward_id: rewardId, tag_id })));
  }
}

/** Returns all rewards (with tag names flattened) for CSV/Excel/JSON export. */
export async function exportRewardsData() {
  const supabase = await createClient();
  const { data: rewards, error } = await supabase
    .from("rewards")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const { data: links } = await supabase.from("reward_tags").select("reward_id, tag_id");
  const { data: tags } = await supabase.from("tags").select("id, name");
  const tagNameById = new Map((tags ?? []).map((t) => [t.id, t.name]));
  const tagsByReward = new Map<string, string[]>();
  for (const link of links ?? []) {
    const name = tagNameById.get(link.tag_id);
    if (!name) continue;
    const list = tagsByReward.get(link.reward_id) ?? [];
    list.push(name);
    tagsByReward.set(link.reward_id, list);
  }

  return (rewards ?? []).map((r) => ({
    store_name: r.store_name,
    category: r.category,
    content: r.content,
    date_category: r.date_category,
    score: r.score,
    official_url: r.official_url ?? "",
    expiry_date: r.expiry_date ?? "",
    notes: r.notes,
    is_favorite: r.is_favorite,
    is_used: r.is_used,
    click_count: r.click_count,
    tags: (tagsByReward.get(r.id) ?? []).join(", "),
    created_at: r.created_at,
    updated_at: r.updated_at,
  }));
}
