export const ENDPOINTS = {
  AUTH: {
    GOOGLE: "/auth/google",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  ONBOARDING: {
    QUESTIONS: "/onboarding/questions",
    SUBMIT_SURVEY: "/onboarding/survey",
    SURVEY_HISTORY: "/onboarding/survey/history",
  },

  PLACEMENT: {
    START: "/placement/start",
    ANSWER: "/placement/answers",
    COMPLETE: "/placement/complete",
    RESULT: "/placement/result",
  },

  LEARN: {
    SKILLS: "/learn/skills",
    LESSONS: "/learn/lessons",
    LESSON_DETAIL: (id: string) => `/learn/lessons/${id}`,
    PRACTICE_SESSIONS: "/learn/practice-sessions",
    PRACTICE_SESSION_DETAIL: (id: string) => `/learn/practice-sessions/${id}`,
  },

  ASSESSMENT: {
    START_LESSON: "/assessments/lesson/start",
    START_PRACTICE: "/assessments/practice/start",
    DETAIL: (id: string) => `/assessments/${id}`,
    COMPLETE: (id: string) => `/assessments/${id}/complete`,
    RESULT: (id: string) => `/assessments/${id}/result`,
    HISTORY: "/assessments/history",
  },

  PLAN: {
    CURRENT: "/learning-plan/current",
    GENERATE: "/learning-plan/generate",
    HISTORY: "/learning-plan/history",
    COMPLETE_ITEM: (id: string) => `/learning-plan/items/${id}/complete`,
    SUBMIT_FEEDBACK: (id: string) => `/learning-plan/items/${id}/feedback`,
    WEEKLY_REVIEW: "/learning-plan/weekly-review",
  },

  DASHBOARD: {
    OVERVIEW: "/dashboard/overview",
    SKILL_PROGRESS: "/dashboard/skill-progress",
    ACTIVITY_HEATMAP: "/dashboard/activity-heatmap",
    SCORE_TRENDS: "/dashboard/score-trends",
  },

  DICTIONARY: {
    LOOKUP: "/dictionary/lookup",
    DETAIL: (id: string) => `/dictionary/${id}`,
    COLLOCATIONS: (id: string) => `/dictionary/${id}/collocations`,
  },

  VOCABULARY: {
    LIST: "/vocabulary",
    SAVE: "/vocabulary",
    DELETE: (id: string) => `/vocabulary/${id}`,
  },
} as const;
