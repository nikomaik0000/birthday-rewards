import { ExternalLink } from "lucide-react";
import { TagBadge } from "@/components/tag-badge";
import type { RewardWithTags } from "@/lib/types";

// Phase 4E: the part of the Table's expanded row that's genuinely NOT
// visible anywhere else — notes, tags, and the official link. Shared
// identically between the Desktop and Mobile expand panels (see
// reward-table.tsx), since this content doesn't differ between them.
export function RewardExtraInfo({ reward }: { reward: RewardWithTags }) {
  return (
    <>
      {reward.notes && (
        <p className="text-xs font-normal text-muted/70">
          <span className="text-muted/50">› </span>
          {reward.notes}
        </p>
      )}

      {reward.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {reward.tags.map((t) => (
            <TagBadge key={t.id} name={t.name} colorHex={t.color_hex} />
          ))}
        </div>
      )}

      {reward.official_url && (
        <a
          href={reward.official_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2.5 text-center font-medium text-ink/90 hover:bg-bg"
        >
          前往官網
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </>
  );
}
