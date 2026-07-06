import { getExpiryInfo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BADGE_CLASSES } from "@/lib/constants";

// Phase 4B: unified with CategoryBadge/TagBadge — no more per-state colors
// (expired/urgent/upcoming/ok all used to render differently). The label
// text itself (e.g. "還有 7 天") is unchanged.
export function ExpiryBadge({ expiryDate }: { expiryDate: string | null }) {
  const info = getExpiryInfo(expiryDate);
  if (info.state === "none") return null;

  return <Badge className={BADGE_CLASSES}>{info.label}</Badge>;
}
