import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getRewardWithTags } from "@/lib/queries";
import { EditRewardForm } from "@/components/admin/edit-reward-form";

export const metadata = { title: "編輯優惠" };

export default async function EditRewardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reward = await getRewardWithTags(id);
  if (!reward) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-6 sm:px-6">
      <Link href="/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink dark:hover:text-ink-dark">
        <ArrowLeft className="h-4 w-4" />
        返回後台
      </Link>
      <h1 className="mb-6 text-title font-semibold">編輯優惠</h1>
      <EditRewardForm
        rewardId={reward.id}
        defaultValues={{
          store_name: reward.store_name,
          category: reward.category,
          content: reward.content,
          date_category: reward.date_category,
          score: reward.score,
          official_url: reward.official_url ?? "",
          logo_url: reward.logo_url ?? "",
          expiry_date: reward.expiry_date ?? "",
          notes: reward.notes,
          tagNames: reward.tags.map((t) => t.name),
        }}
      />
    </div>
  );
}
