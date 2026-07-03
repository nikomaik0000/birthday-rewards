import { Suspense } from "react";
import { getRewardsWithTags, getAllTags } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();
  const [rewards, tags, userResult] = await Promise.all([
    getRewardsWithTags(),
    getAllTags(),
    supabase.auth.getUser(),
  ]);
  const isAdmin = Boolean(userResult.data.user);
  return <RewardExplorer initialRewards={rewards} allTags={tags} isAdmin={isAdmin} />;
}

function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <RewardListSkeleton />
    </div>
  );
}
