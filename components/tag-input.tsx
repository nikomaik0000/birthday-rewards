"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TagBadge } from "@/components/tag-badge";
import { colorForTagName, SUGGESTED_TAGS } from "@/lib/constants";

export function TagInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function addTag(name: string) {
    const trimmed = name.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  const suggestions = SUGGESTED_TAGS.filter(
    (t) => !value.includes(t) && (draft ? t.includes(draft) : true)
  ).slice(0, 8);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-2 dark:border-border-dark dark:bg-surface-dark">
        {value.map((name) => (
          <span key={name} className="flex items-center gap-1">
            <TagBadge name={name} colorHex={colorForTagName(name)} />
            <button
              type="button"
              onClick={() => onChange(value.filter((v) => v !== name))}
              aria-label={`移除標籤 ${name}`}
              className="text-muted hover:text-ink dark:hover:text-ink-dark"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(draft);
            } else if (e.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          placeholder="輸入標籤後按 Enter"
          className="h-7 w-40 flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="rounded-pill border border-dashed border-border px-2.5 py-1 text-[11px] text-muted hover:border-solid hover:text-ink dark:border-border-dark dark:hover:text-ink-dark"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
