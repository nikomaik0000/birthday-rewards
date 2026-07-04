import { getExpiryInfo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ExpiryBadge({ expiryDate }: { expiryDate: string | null }) {
  const info = getExpiryInfo(expiryDate);
  if (info.state === "none") return null;

  const classes: Record<string, string> = {
    expired: "bg-border text-muted",
    urgent: "bg-tag-expiring text-tag-expiring-fg",
    upcoming: "bg-tag-drink text-tag-drink-fg",
    ok: "bg-tag-other text-tag-other-fg",
  };

  return <Badge className={cn(classes[info.state])}>{info.label}</Badge>;
}
