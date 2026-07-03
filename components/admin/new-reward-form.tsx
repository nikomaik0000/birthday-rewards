"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";
import { RewardForm } from "@/components/reward-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createReward } from "@/app/actions/rewards";
import type { RewardFormValues } from "@/lib/schema";

/**
 * v2: the "貼上網址自動擷取" convenience that used to live on the public
 * homepage's quick-add dialog now lives here instead, since only admins
 * can add rewards anymore. Same /api/extract endpoint, just relocated.
 */
export function NewRewardForm() {
  const router = useRouter();
  const [prefill, setPrefill] = useState<Partial<RewardFormValues> | undefined>();
  const [extractUrl, setExtractUrl] = useState("");
  const [extracting, setExtracting] = useState(false);

  async function handleExtract() {
    if (!extractUrl.trim()) return;
    setExtracting(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: extractUrl.trim() }),
      });
      const json = await res.json();
      if (json.data) {
        setPrefill({
          store_name: json.data.store_name,
          content: json.data.content,
          logo_url: json.data.logo_url ?? "",
          official_url: json.data.official_url,
        });
        toast.success("已自動擷取，請確認資料是否正確");
      } else {
        toast.info(json.error ?? "自動擷取失敗，請手動輸入");
        setPrefill({ official_url: extractUrl.trim() });
      }
    } catch {
      toast.error("自動擷取失敗，請手動輸入");
    } finally {
      setExtracting(false);
    }
  }

  async function handleSubmit(values: RewardFormValues) {
    try {
      await createReward(values);
      toast.success(`已新增「${values.store_name}」`);
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("新增失敗，請稍後再試");
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Input
          value={extractUrl}
          onChange={(e) => setExtractUrl(e.target.value)}
          placeholder="貼上官方優惠網址，自動帶入資料"
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={handleExtract} disabled={extracting} className="gap-1.5">
          <Wand2 className="h-3.5 w-3.5" />
          {extracting ? "擷取中..." : "自動擷取"}
        </Button>
      </div>
      <RewardForm key={JSON.stringify(prefill)} defaultValues={prefill} onSubmit={handleSubmit} submitLabel="新增優惠" />
    </div>
  );
}
