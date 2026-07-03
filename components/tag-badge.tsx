import { Badge } from "@/components/ui/badge";
import { CATEGORY_TAG_CLASSES } from "@/lib/constants";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  return (
    <Badge
      className={cn(
        "bg-[#F9F9F9] text-[#666666] border border-[#EFEFEF] shadow-sm",
        className
      )}
    >
      {category}
    </Badge>
  );
}
export function TagBadge({
  name,
  colorHex,
  className,
}: {
  name: string;
  colorHex: string;
  className?: string;
}) {
  return (
    <Badge
      className={cn("text-[#5A544C]", className)}
      style={{ backgroundColor: colorHex }}
    >
      {name}
    </Badge>
  );
}
