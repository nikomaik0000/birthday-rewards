"use client";

import { useState, useRef } from "react";
import { Upload, Download } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { importRewards, exportRewardsData, type DuplicateStrategy } from "@/app/actions/import-export";

export function ImportExportDialog() {
  const [open, setOpen] = useState(false);
  const [duplicateStrategy, setDuplicateStrategy] = useState<DuplicateStrategy>("skip");
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setBusy(true);
    try {
      const rows = await parseFile(file);
      const result = await importRewards(rows, duplicateStrategy);
      toast.success(
        `匯入完成：新增 ${result.inserted} 筆、更新 ${result.updated} 筆、略過 ${result.skipped} 筆`
      );
      if (result.errors.length) {
        toast.error(`${result.errors.length} 筆資料有誤，請檢查格式`);
      }
    } catch (e) {
      toast.error("匯入失敗，請確認檔案格式");
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleExport(format: "csv" | "xlsx" | "json") {
    setBusy(true);
    try {
      const data = await exportRewardsData();
      downloadExport(data, format);
    } catch {
      toast.error("匯出失敗");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm" className="gap-1.5">
          <Upload className="h-3.5 w-3.5" />
          匯入 / 匯出
        </Button>
      </DialogTrigger>
      <DialogContent title="匯入 / 匯出資料">
        <div className="stack-16">
          <div>
            <h3 className="mb-2 text-sm font-medium">匯入</h3>
            <p className="mb-2 text-xs text-muted">支援 CSV、Excel (.xlsx)、JSON。欄位需包含 store_name。</p>
            <div className="mb-3 flex items-center gap-2 text-xs">
              <span className="text-muted">若店家重複：</span>
              {(["overwrite", "skip", "create"] as const).map((s) => (
                <label key={s} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="dup"
                    checked={duplicateStrategy === s}
                    onChange={() => setDuplicateStrategy(s)}
                  />
                  {s === "overwrite" ? "覆蓋" : s === "skip" ? "略過" : "新增"}
                </label>
              ))}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.json"
              disabled={busy}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="text-xs"
            />
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="mb-2 text-sm font-medium">匯出</h3>
            <div className="flex flex-wrap gap-2">
              {(["csv", "xlsx", "json"] as const).map((f) => (
                <Button key={f} variant="primary" size="sm" disabled={busy} onClick={() => handleExport(f)} className="gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  {f.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

async function parseFile(file: File): Promise<unknown[]> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "json") {
    const text = await file.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [parsed];
  }

  if (ext === "csv") {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data as unknown[]),
        error: reject,
      });
    });
  }

  // xlsx / xls
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
}

function downloadExport(data: Record<string, unknown>[], format: "csv" | "xlsx" | "json") {
  const filename = `birthday-rewards-export.${format}`;

  if (format === "json") {
    triggerDownload(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), filename);
    return;
  }

  if (format === "csv") {
    // Phase 5A-2: CSV is meant for editing in Excel, so it only includes
    // user-facing fields (no expiry_date / is_favorite / is_used /
    // click_count / created_at / updated_at) with Traditional Chinese
    // headers, in a fixed column order. JSON/XLSX export are unchanged.
    const csvRows = data.map((r) => ({
      店家: r.store_name,
      類別: r.category,
      優惠內容: r.content,
      日期: r.date_category,
      分數: r.score,
      官方網址: r.official_url,
      備註: r.notes,
      標籤: r.tags,
    }));
    const csv = "\uFEFF" + Papa.unparse(csvRows);
    triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8;" }), filename);
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rewards");
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  triggerDownload(new Blob([buffer], { type: "application/octet-stream" }), filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
