import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink placeholder:text-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/40",
        "dark:border-border-dark dark:bg-surface-dark dark:text-ink-dark",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/40",
      "dark:border-border-dark dark:bg-surface-dark dark:text-ink-dark",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
