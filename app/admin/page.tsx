import Link from "next/link";
import { Plus, LogOut } from "lucide-react";
import { getRewardsWithTags } from "@/lib/queries";
import { AdminTable } from "@/components/admin-table";
import { ImportExportDialog } from "@/components/import-export-dialog";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";

export const metadata = { title: "後台管理" };
export const revalidate = 0;

export default async function AdminPage() {
  const rewards = await getRewardsWithTags();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-title font-semibold">後台管理</h1>
          <p className="mt-1 text-sm text-muted">共 {rewards.length} 筆優惠</p>
        </div>
        <div className="flex items-center gap-2">
          <ImportExportDialog />
          <Link href="/admin/rewards/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              新增優惠
            </Button>
          </Link>
          <form action={logout}>
            <Button type="submit" variant="ghost" size="sm" className="gap-1.5">
              <LogOut className="h-4 w-4" />
              登出
            </Button>
          </form>
        </div>
      </div>

      <AdminTable rewards={rewards} />
    </div>
  );
}
