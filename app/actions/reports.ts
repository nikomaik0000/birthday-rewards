"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { reportSchema, type ReportFormValues } from "@/lib/schema";

/**
 * Public action — anyone can flag a problem with a reward. This is the
 * replacement for the old front-end "quick add" feature: instead of
 * editing data directly, visitors submit a report for the admin to review.
 */
export async function submitReport(values: ReportFormValues) {
  const parsed = reportSchema.parse(values);
  const supabase = await createClient();

  const { error } = await supabase.from("reward_reports").insert({
    reward_id: parsed.reward_id,
    message: parsed.message,
    contact: parsed.contact || null,
  });

  if (error) throw error;
}

/** Admin-only: list pending reports (with store name) for the /admin dashboard. */
export async function getPendingReports() {
  const supabase = await createClient();
  const { data: reports, error } = await supabase
    .from("reward_reports")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!reports?.length) return [];

  // Our hand-authored Database types don't declare table relationships, so
  // embedded-resource selects (`reward_reports.select("*, rewards(...)")`)
  // wouldn't type-check cleanly. A second lookup keeps things simple.
  const { data: rewards } = await supabase
    .from("rewards")
    .select("id, store_name")
    .in("id", reports.map((r) => r.reward_id));
  const storeNameById = new Map((rewards ?? []).map((r) => [r.id, r.store_name]));

  return reports.map((r) => ({ ...r, store_name: storeNameById.get(r.reward_id) ?? "（已刪除的優惠）" }));
}

/** Admin-only: mark a report as resolved. RLS enforces the admin check. */
export async function resolveReport(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("reward_reports").update({ status: "resolved" }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
}

/** Admin-only: delete a report outright. RLS enforces the admin check. */
export async function deleteReport(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("reward_reports").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
}
