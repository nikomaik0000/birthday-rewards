"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { submitReport } from "@/app/actions/reports";

/**
 * v2: general visitors can no longer edit reward data directly. This is
 * the replacement — a simple "something's wrong" report that lands in the
 * admin's report queue instead of writing to the reward itself.
 */
export function ReportDialog({ rewardId, storeName }: { rewardId: string; storeName: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      await submitReport({ reward_id: rewardId, message: message.trim(), contact: contact.trim() });
      toast.success("感謝回報，我們會盡快確認");
      setOpen(false);
      setMessage("");
      setContact("");
    } catch {
      toast.error("回報失敗，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          aria-label={`回報 ${storeName} 資料問題`}
          title="回報資料問題"
          className="relative z-10 rounded-full p-1.5 text-muted hover:bg-bg dark:hover:bg-bg-dark"
        >
          <Flag className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent title={`回報「${storeName}」的資料問題`}>
        <form onSubmit={handleSubmit} className="stack-16">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">問題描述</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="例如：優惠已過期、連結失效、內容不正確..."
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">聯絡 Email（選填，方便我們回覆）</label>
            <Input value={contact} onChange={(e) => setContact(e.target.value)} type="email" placeholder="you@example.com" />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "送出中..." : "送出回報"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
