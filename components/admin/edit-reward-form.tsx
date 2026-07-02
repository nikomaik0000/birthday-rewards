"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RewardForm } from "@/components/reward-form";
import { updateReward } from "@/app/actions/rewards";
import type { RewardFormValues } from "@/lib/schema";

export function EditRewardForm({
  rewardId,
  defaultValues,
}: {
  rewardId: string;
  defaultValues: Partial<RewardFormValues>;
}) {
  const router = useRouter();

  async function handleSubmit(values: RewardFormValues) {
    try {
      await updateReward(rewardId, values);
      toast.success("已儲存變更");
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("儲存失敗，請稍後再試");
    }
  }

  return <RewardForm defaultValues={defaultValues} onSubmit={handleSubmit} submitLabel="儲存變更" />;
}
