"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateNotes } from "@/app/actions/rewards";

export function NotesEditor({ rewardId, initialNotes }: { rewardId: string; initialNotes: string }) {
  const [value, setValue] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const dirty = value !== initialNotes;

  async function handleSave() {
    setSaving(true);
    try {
      await updateNotes(rewardId, value);
      toast.success("心得已儲存");
    } catch {
      toast.error("儲存失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        placeholder="例如：今年成功兌換、需要先加入會員、店員沒有主動提醒..."
      />
      {dirty && (
        <Button size="sm" onClick={handleSave} disabled={saving} className="mt-2">
          {saving ? "儲存中..." : "儲存心得"}
        </Button>
      )}
    </div>
  );
}
