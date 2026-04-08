"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/config";
import { OnboardingStatus } from "@/types";
import { Sidebar } from "@/components/shared/layouts";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(ROUTES.HOME);
      return;
    }
    if (user.surveyStatus === OnboardingStatus.PENDING) {
      router.replace(ROUTES.ONBOARDING.SURVEY);
      return;
    }
    if (user.placementStatus === OnboardingStatus.PENDING) {
      router.replace(ROUTES.ONBOARDING.PLACEMENT);
      return;
    }
  }, [user, isLoading, router]);

  if (
    isLoading ||
    user?.surveyStatus === OnboardingStatus.PENDING ||
    user?.placementStatus === OnboardingStatus.PENDING
  )
    return null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-app-bg">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
