"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/config/routes";
import { OnboardingStatus } from "@/types";
import { PawSpinner } from "@/components";

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(ROUTES.LOGIN);
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

  if (isLoading) return <PawSpinner fullScreen />;
  if (!user) return null;

  return <>{children}</>;
}