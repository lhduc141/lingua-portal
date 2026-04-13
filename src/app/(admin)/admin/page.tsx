"use client";
import { useRouter } from "next/navigation";
import { useAdminStats } from "@/hooks/admin";
import { PawSpinner } from "@/components";
import { ROUTES } from "@/config";
import { Users, FileText } from "lucide-react";
import { StatCards, CefrDistribution, OnboardingFunnel, SkillPerformance } from "./_components";

export default function AdminPage() {
  const { data, isLoading } = useAdminStats();
  const router = useRouter();

  if (isLoading) return <PawSpinner fullScreen />;
  if (!data)
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        Failed to load stats
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[32px] text-gray-900">System Overview</h1>
          <p className="mt-1 text-[14px] text-slate-500">Platform health and learning analytics</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push(ROUTES.ADMIN.USERS)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
          >
            <Users className="h-4 w-4" /> Users
          </button>
          <button
            onClick={() => router.push(ROUTES.ADMIN.PLACEMENT)}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-teal-700"
          >
            <FileText className="h-4 w-4" /> Placement Results
          </button>
        </div>
      </div>

      <StatCards stats={data} />

      <div className="grid grid-cols-2 gap-6">
        <CefrDistribution distribution={data.cefrDistribution} totalUsers={data.users.total} />
        <OnboardingFunnel funnel={data.funnel} />
      </div>

      <SkillPerformance skillPerformance={data.skillPerformance} />
    </div>
  );
}
