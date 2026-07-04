"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, Search } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/tag-badge";
import { StarRating } from "@/components/star-rating";
import { bulkDeleteRewards, bulkUpdateCategory, deleteReward } from "@/app/actions/rewards";
import { CATEGORIES } from "@/lib/constants";
import type { RewardWithTags, Category } from "@/lib/types";

export function AdminTable({ rewards }: { rewards: RewardWithTags[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return rewards;
    const q = query.trim().toLowerCase();
    return rewards.filter((r) => r.store_name.toLowerCase().includes(q) || r.content.toLowerCase().includes(q));
  }, [rewards, query]);

  const allSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.id));

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((r) => r.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleBulkDelete() {
    if (!selected.size) return;
    if (!confirm(`確定要刪除 ${selected.size} 筆優惠嗎？此動作無法復原。`)) return;
    setBusy(true);
    try {
      await bulkDeleteRewards([...selected]);
      toast.success("已刪除選取的優惠");
      setSelected(new Set());
      router.refresh();
    } catch {
      toast.error("刪除失敗");
    } finally {
      setBusy(false);
    }
  }

  async function handleBulkCategory(category: Category) {
    if (!selected.size) return;
    setBusy(true);
    try {
      await bulkUpdateCategory([...selected], category);
      toast.success(`已將 ${selected.size} 筆優惠設為「${category}」`);
      setSelected(new Set());
      router.refresh();
    } catch {
      toast.error("更新失敗");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteOne(id: string, name: string) {
    if (!confirm(`確定要刪除「${name}」嗎？`)) return;
    try {
      await deleteReward(id);
      toast.success("已刪除");
      router.refresh();
    } catch {
      toast.error("刪除失敗");
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜尋店家或內容" className="pl-9" />
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">已選取 {selected.size} 筆</span>
            <select
              disabled={busy}
              onChange={(e) => e.target.value && handleBulkCategory(e.target.value as Category)}
              defaultValue=""
              className="h-8 rounded-lg border border-border bg-surface px-2 text-xs"
            >
              <option value="" disabled>
                批次設定類別
              </option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Button size="sm" variant="destructive" disabled={busy} onClick={handleBulkDelete} className="gap-1">
              <Trash2 className="h-3.5 w-3.5" />
              批次刪除
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-card border border-border">
        <table className="w-full min-w-[760px] border-collapse text-list">
          <thead>
            <tr className="border-b border-border bg-bg/60">
              <th className="w-10 px-4 py-3">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="全選" />
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted">店家</th>
              <th className="px-4 py-3 text-left font-medium text-muted">類別</th>
              <th className="px-4 py-3 text-left font-medium text-muted">分數</th>
              <th className="px-4 py-3 text-left font-medium text-muted">狀態</th>
              <th className="w-20 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggleOne(r.id)} aria-label={`選取 ${r.store_name}`} />
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium">{r.store_name}</span>
                </td>
                <td className="px-4 py-3">
                  <CategoryBadge category={r.category} />
                </td>
                <td className="px-4 py-3">
                  <StarRating score={r.score} />
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {r.is_favorite ? "★ 收藏" : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/rewards/${r.id}/edit`}
                      className="rounded-full p-1.5 text-muted hover:bg-bg"
                      aria-label={`編輯 ${r.store_name}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteOne(r.id, r.store_name)}
                      className="rounded-full p-1.5 text-muted hover:bg-bg"
                      aria-label={`刪除 ${r.store_name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
