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
    LESSONS: "/learn/lessons",
    PRACTICE: "/learn/practice-sessions",
    LESSON: (id: string) => `/learn/lessons/${id}`,
    PRACTICE_SESSION: (id: string) => `/learn/practice-sessions/${id}`,
  },

  EXERCISE: {
    DETAIL: (id: string) => `/exercises/${id}`,
    RESULT: (id: string) => `/exercises/${id}/result`,
    HISTORY: "/exercises/history",
  },

  DICTIONARY: {
    ROOT: "/dictionary",
    DETAIL: (id: string) => `/dictionary/${id}`,
  },

  VOCABULARY: "/vocabulary",
  PROFILE: "/profile",

  ADMIN: {
    ROOT: "/admin",
    USERS: "/admin/users",
    PLACEMENT: "/admin/placement",
  },
} as const;
