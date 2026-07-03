"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flag, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { resolveReport, deleteReport } from "@/app/actions/reports";
import { formatDate } from "@/lib/utils";
import type { ReportRow } from "@/lib/database.types";

type ReportWithStoreName = ReportRow & { store_name: string };

/**
 * v2: shows the queue fed by the front-end "資料回報" button. General
 * visitors can only submit into this queue — resolving/deleting happens
 * here, admin-only (also enforced by RLS on reward_reports).
 */
export function ReportsPanel({ reports }: { reports: ReportWithStoreName[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  if (!reports.length) return null;

  async function handleResolve(id: string) {
    setBusyId(id);
    try {
      await resolveReport(id);
      toast.success("已標記為已處理");
      router.refresh();
    } catch {
      toast.error("操作失敗");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    try {
      await deleteReport(id);
      toast.success("已刪除回報");
      router.refresh();
    } catch {
      toast.error("操作失敗");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mb-6 rounded-card border border-border bg-surface p-5 dark:border-border-dark dark:bg-surface-dark">
      <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium">
        <Flag className="h-4 w-4" />
        資料回報（{reports.length} 筆待處理）
      </h2>
      <ul className="stack-8">
        {reports.map((r) => (
          <li key={r.id} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3 text-sm dark:border-border-dark">
            <div className="min-w-0">
              <Link href={`/reward/${r.reward_id}`} className="font-medium hover:underline">
                {r.store_name}
              </Link>
              <p className="mt-1 text-ink/80 dark:text-ink-dark/80">{r.message}</p>
              <p className="mt-1 text-xs text-muted">
                {formatDate(r.created_at)}
                {r.contact ? ` · ${r.contact}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                disabled={busyId === r.id}
                onClick={() => handleResolve(r.id)}
                aria-label="標記為已處理"
                title="標記為已處理"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={busyId === r.id}
                onClick={() => handleDelete(r.id)}
                aria-label="刪除回報"
                title="刪除回報"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
