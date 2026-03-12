import type { CefrLevel } from "@/types";

export type User = {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  cefrLevel: CefrLevel | null;
  surveyCompleted: boolean;
  placementCompleted: boolean;
  createdAt: string;
};

export type AuthMeResponseDto = {
  user: User;
};
