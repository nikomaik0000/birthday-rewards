import { CategoryBadge, TagBadge } from "@/components/tag-badge";
import { ExpiryBadge } from "@/components/expiry-badge";
import { StarRating } from "@/components/star-rating";
import type { RewardWithTags } from "@/lib/types";
import { cn } from "@/lib/utils";

// Phase 4D: description, notes, badges, and rating — the part of a reward's
// display that's identical whether you're looking at the Card grid or the
// Table's expanded row. Pulled out once so Grid and Table can never drift
// out of sync with each other; each caller only owns its own outer chrome
// (card border/shadow/padding vs. table row background).
export function RewardCardBody({
  reward,
  clampDescription = true,
  pinBadgesToBottom = false,
}: {
  reward: RewardWithTags;
  // Card grid clips the description to 2 lines to keep every card the same
  // height; the Table's expand panel isn't height-constrained, so it shows
  // the full description instead.
  clampDescription?: boolean;
  // Card grid pins the badge/rating row to the bottom of the fixed-height
  // card (via the parent's flex column) so every card in a row lines up.
  // The Table's expand panel isn't a fixed-height flex container, so it
  // just flows normally there.
  pinBadgesToBottom?: boolean;
}) {
  return (
    <>
      <p className={cn("text-sm leading-6 text-ink/90", clampDescription && "line-clamp-2")}>
        {reward.content}
      </p>

      {/* Notes only render when present. The gap above them is deliberately
          larger than the description's own line-height, so they read as a
          clearly separate, secondary line rather than a continuation.
          Phase 5C: clamped to 2 lines (instead of a single truncated line)
          so longer notes stay readable within the same fixed card height.
          `leading-relaxed` gives the two lines breathing room, and the
          pl-3/-indent-3 pair is a hanging indent — the "›" marker sits in
          the indent on line one, and the wrapped second line lines up with
          the start of the note text instead of the marker. */}
         {reward.notes && (
        <div className="mt-4 flex items-start gap-1">
          <span className="shrink-0 text-muted/50">›</span>

          <p className="line-clamp-2 text-xs font-normal leading-6 text-muted/70">
            {reward.notes}
          </p>
        </div>
      )}

      {/* Badge row: Category → Validity Period → Redemption Method(s), one
          consistently-spaced row, all sharing the same unified badge style —
          paired with the rating on the same row. */}
      <div
        className={cn(
          "flex flex-wrap items-end justify-between gap-2",
          pinBadgesToBottom ? "mt-auto" : "mt-5"
        )}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <CategoryBadge category={reward.category} />
          <ExpiryBadge expiryDate={reward.expiry_date} />
          {reward.tags.map((t) => (
            <TagBadge key={t.id} name={t.name} colorHex={t.color_hex} />
          ))}
        </div>
        <StarRating className="shrink-0" score={reward.score} />
      </div>
    </>
  );
}