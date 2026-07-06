import { Badge } from "@/components/ui/badge";
import { BADGE_CLASSES } from "@/lib/constants";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  return <Badge className={cn(BADGE_CLASSES, className)}>{category}</Badge>;
}

// Phase 4B: tags now share the same unified badge style as CategoryBadge and
// ExpiryBadge — colorHex is kept in the signature so existing callers don't
// need to change, but it's no longer used to color the badge.
export function TagBadge({
  name,
  className,
}: {
  name: string;
  colorHex: string;
  className?: string;
}) {
  return <Badge className={cn(BADGE_CLASSES, className)}>{name}</Badge>;
}
