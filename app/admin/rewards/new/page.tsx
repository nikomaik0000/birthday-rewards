import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewRewardForm } from "@/components/admin/new-reward-form";

export const metadata = { title: "新增優惠" };

export default function NewRewardPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6 sm:px-6">
      <Link href="/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" />
        返回後台
      </Link>
      <h1 className="mb-6 text-title font-semibold">新增優惠</h1>
      <NewRewardForm />
    </div>
  );
}
