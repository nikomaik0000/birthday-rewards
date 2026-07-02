import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill text-[13px] font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "bg-ink text-bg hover:opacity-90 dark:bg-ink-dark dark:text-bg-dark",
        outline:
          "border border-border bg-transparent hover:bg-surface text-ink dark:border-border-dark dark:text-ink-dark dark:hover:bg-surface-dark",
        ghost: "bg-transparent hover:bg-surface text-ink dark:text-ink-dark dark:hover:bg-surface-dark",
        accent: "bg-accent-green text-white hover:opacity-90",
        destructive: "bg-red-400/90 text-white hover:bg-red-500",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3 text-xs",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
