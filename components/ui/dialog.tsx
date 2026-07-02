"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({
  className,
  children,
  title,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { title: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/30 animate-fadeIn" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2",
          "rounded-card bg-surface p-6 shadow-pop animate-slideUp",
          "dark:bg-surface-dark",
          "max-h-[85vh] overflow-y-auto",
          className
        )}
        {...props}
      >
        <div className="mb-4 flex items-center justify-between">
          <DialogPrimitive.Title className="text-title font-semibold">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Close className="rounded-full p-1 text-muted hover:bg-bg dark:hover:bg-bg-dark">
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        </div>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
