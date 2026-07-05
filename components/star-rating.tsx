import { cn } from "@/lib/utils";

export function StarRating({ score, className }: { score: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)} aria-label={`評分 ${score} / 5`}>
      ⭐ {score}/5
    </span>
  );
}
