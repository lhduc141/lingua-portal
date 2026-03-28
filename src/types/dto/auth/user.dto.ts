import type { CefrLevel, OnboardingStatus } from "@/types";

export type User = {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  cefrLevel: CefrLevel | null;
  surveyStatus: OnboardingStatus;
  placementStatus: OnboardingStatus;
  createdAt: string;
};

export type AuthMeResponseDto = {
  user: User;
};
