"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getMe, googleLogin } from "@/services/auth";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/config/routes";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, setCookie } from "@/lib";

import { OnboardingStatus } from "@/types";

export function useGoogleLoginMutation() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (idToken: string) => {
      const authRes = await googleLogin(idToken);
      setCookie(ACCESS_TOKEN_COOKIE, authRes.data.accessToken);
      setCookie(REFRESH_TOKEN_COOKIE, authRes.data.refreshToken);
      const meRes = await getMe();
      return meRes.data;
    },
    onSuccess: (user) => {
      setUser(user);
      if (user.surveyStatus === OnboardingStatus.PENDING) {
        router.push(ROUTES.ONBOARDING.ROOT);
      } else if (user.placementStatus === OnboardingStatus.PENDING) {
        router.push(ROUTES.ONBOARDING.PLACEMENT);
      } else {
        router.push(ROUTES.DASHBOARD);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  return {
    handleCredential: mutation.mutate,
    isPending: mutation.isPending,
  };
}
