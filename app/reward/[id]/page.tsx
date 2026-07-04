import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Clock } from "lucide-react";
import { getRewardWithTags, getRewardHistory } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { StoreLogo } from "@/components/store-logo";
import { CategoryBadge, TagBadge } from "@/components/tag-badge";
import { StarRating } from "@/components/star-rating";
import { ExpiryBadge } from "@/components/expiry-badge";
import { formatDate } from "@/lib/utils";
import { NotesEditor } from "@/components/notes-editor";
import { VisitTracker } from "@/components/visit-tracker";
import { FavoriteUsedControls } from "@/components/favorite-used-controls";
import { ReportDialog } from "@/components/report-dialog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const reward = await getRewardWithTags(id);
  if (!reward) return { title: "找不到優惠" };
  return {
    title: `${reward.store_name} 生日優惠`,
    description: reward.content.slice(0, 120),
  };
}

export default async function RewardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reward = await getRewardWithTags(id);
  if (!reward) notFound();

  const history = await getRewardHistory(id);

  // v2: 已使用 toggle + 使用心得 editing are admin-only now, so we need to
  // know here (server-side) whether the current visitor is signed in.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = Boolean(user);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" />
        返回列表
      </Link>

      <div className="rounded-card border border-border bg-surface p-6">
        <div className="flex items-start gap-4">
          <StoreLogo name={reward.store_name} logoUrl={reward.logo_url} size={56} />
          <div className="min-w-0 flex-1">
            <h1 className="text-title font-semibold">{reward.store_name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <CategoryBadge category={reward.category} />
              <ExpiryBadge expiryDate={reward.expiry_date} />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <ReportDialog rewardId={reward.id} storeName={reward.store_name} />
            <FavoriteUsedControls reward={reward} isAdmin={isAdmin} />
          </div>
        </div>

        <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-ink/90">
          {reward.content}
        </p>

        {reward.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {reward.tags.map((t) => (
              <TagBadge key={t.id} name={t.name} colorHex={t.color_hex} />
            ))}
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
          <InfoRow label="分數" value={<StarRating score={reward.score} />} />
          <InfoRow label="日期分類" value={reward.date_category} />
          <InfoRow label="點擊次數" value={reward.click_count} />
          <InfoRow label="最後更新" value={formatDate(reward.updated_at)} />
        </div>

        {reward.official_url && (
          <VisitTracker rewardId={reward.id} url={reward.official_url} storeName={reward.store_name} />
        )}
      </div>

      {/* v2: general visitors get a read-only view of 使用心得; only a
          signed-in admin sees the editable textarea + save button. */}
      {(isAdmin || reward.notes) && (
        <div className="mt-5 rounded-card border border-border bg-surface p-6">
          <h2 className="mb-3 text-sm font-medium">使用心得</h2>
          {isAdmin ? (
            <NotesEditor rewardId={reward.id} initialNotes={reward.notes} />
          ) : (
            <p className="whitespace-pre-wrap text-sm text-ink/80">{reward.notes}</p>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-5 rounded-card border border-border bg-surface p-6">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium">
            <Clock className="h-4 w-4" />
            歷史更新紀錄
          </h2>
          <ul className="stack-8">
            {history.map((h) => (
              <li key={h.id} className="text-xs text-muted">
                {formatDate(h.changed_at)} — 內容已更新
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
