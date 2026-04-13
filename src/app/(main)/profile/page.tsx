"use client";

import { useDashboardOverview } from "@/hooks";
import { useAuthStore } from "@/stores";
import { PawSpinner } from "@/components";
import { ProfileHeader, SkillSummarySection, StatsRow } from "./_components";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useDashboardOverview();

  if (isLoading) return <PawSpinner fullScreen />;
  if (!user || !data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        Unable to load profile. Please try again.
      </div>
    );
  }

  const { skillSummary, streak, vocabularyCount, planProgress } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[32px] text-gray-900">My Profile</h1>
        <p className="mt-1 text-[14px] text-slate-500">
          Your learning identity and progress overview
        </p>
      </div>

      <ProfileHeader user={user} />

      <StatsRow
        streak={streak.currentDays}
        vocabularyCount={vocabularyCount}
        planCompleted={planProgress?.completedItems ?? 0}
        planTotal={planProgress?.totalItems ?? 0}
      />

      <SkillSummarySection skillSummary={skillSummary} />
    </div>
  );
}
