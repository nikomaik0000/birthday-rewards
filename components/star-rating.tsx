import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ score, className }: { score: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-label={`評分 ${score} / 5`}>
      <Star className="h-3.5 w-3.5 text-accent-coffee" aria-hidden="true" />
      {score}/5
    </span>
  );
}
