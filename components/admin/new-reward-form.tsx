"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RewardForm } from "@/components/reward-form";
import { createReward } from "@/app/actions/rewards";
import type { RewardFormValues } from "@/lib/schema";

export function NewRewardForm() {
  const router = useRouter();

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

  return <RewardForm onSubmit={handleSubmit} submitLabel="新增優惠" />;
}
