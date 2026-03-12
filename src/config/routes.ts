export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",

  ONBOARDING: {
    ROOT: "/onboarding",
    SURVEY: "/onboarding/survey",
    PLACEMENT: "/onboarding/placement",
    PLACEMENT_RESULT: "/onboarding/placement/result",
  },

  DASHBOARD: "/dashboard",
  PLAN: "/plan",

  LEARN: {
    ROOT: "/learn",
    LESSON: (id: string) => `/learn/lessons/${id}`,
    PRACTICE: (id: string) => `/learn/practice-sessions/${id}`,
  },

  ASSESSMENT: {
    DETAIL: (id: string) => `/assessments/${id}`,
    RESULT: (id: string) => `/assessments/${id}/result`,
    HISTORY: "/assessments/history",
  },

  DICTIONARY: {
    ROOT: "/dictionary",
    DETAIL: (id: string) => `/dictionary/${id}`,
  },

  VOCABULARY: "/vocabulary",
  PROFILE: "/profile",
} as const;
