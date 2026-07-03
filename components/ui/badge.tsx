import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  style,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        // v2: "bg-tag-other" is a safety-net default so a Badge can never
        // render with a transparent/white background — every caller either
        // overrides this with a category class or an inline colorHex style.
        "inline-flex items-center rounded-pill bg-tag-other px-2.5 py-1 text-[11px] font-medium leading-none text-tag-other-fg",
        className
      )}
      style={style}
      {...props}
    />
  );
}
