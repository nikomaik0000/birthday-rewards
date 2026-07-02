import { Suspense } from "react";
import { getRewardsWithTags, getAllTags } from "@/lib/queries";
import { RewardExplorer } from "@/components/reward-explorer";
import { RewardListSkeleton } from "@/components/reward-list-skeleton";

export const revalidate = 0;

export default async function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const [rewards, tags] = await Promise.all([getRewardsWithTags(), getAllTags()]);
  return <RewardExplorer initialRewards={rewards} allTags={tags} />;
}

function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <RewardListSkeleton />
    </div>
  );
}
