"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/config/routes";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return; // Chờ rehydrate xong
    if (!user) {
      router.replace(ROUTES.HOME);
      return;
    }
    if (!user.surveyCompleted) {
      router.replace(ROUTES.ONBOARDING.SURVEY);
      return;
    }
    if (!user.placementCompleted) {
      router.replace(ROUTES.ONBOARDING.PLACEMENT);
      return;
    }
  }, [user, isLoading, router]);

  if (isLoading || !user?.surveyCompleted || !user?.placementCompleted) return null;

  return <>{children}</>;
}
