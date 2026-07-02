"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackClick } from "@/app/actions/rewards";

export function VisitTracker({
  rewardId,
  url,
  storeName,
}: {
  rewardId: string;
  url: string;
  storeName: string;
}) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(rewardId)}>
      <Button className="mt-5 w-full gap-1.5">
        前往 {storeName} 官方優惠頁
        <ExternalLink className="h-4 w-4" />
      </Button>
    </a>
  );
}
