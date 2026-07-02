"use client";

import { forwardRef } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "h-5 w-9 shrink-0 rounded-pill bg-border transition-colors",
      "data-[state=checked]:bg-accent-green dark:bg-border-dark",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/40",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow-soft transition-transform",
        "data-[state=checked]:translate-x-[18px]"
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";
