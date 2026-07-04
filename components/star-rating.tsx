import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ score, className }: { score: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`評分 ${score} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < score ? "fill-accent-coffee text-accent-coffee" : "fill-none text-border"
          )}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
