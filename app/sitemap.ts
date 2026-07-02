import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();
  const { data: rewards } = await supabase
    .from("rewards")
    .select("id, updated_at")
    .eq("is_active", true);

  const rewardEntries: MetadataRoute.Sitemap = (rewards ?? []).map((r) => ({
    url: `${siteUrl}/reward/${r.id}`,
    lastModified: r.updated_at,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...rewardEntries,
  ];
}
