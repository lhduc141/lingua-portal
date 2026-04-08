// Base Roots
const AUTH_ROOT = "/auth";
const ONBOARDING_ROOT = "/onboarding";
const PLACEMENT_ROOT = "/placement";
const LEARN_ROOT = "/learn";
const PLAN_ROOT = "/learning-plan";
const DASHBOARD_ROOT = "/dashboard";
const DICTIONARY_ROOT = "/dictionary";
const VOCABULARY_ROOT = "/vocabulary";
const EXERCISE_ROOT = "/assessments";

const SKILLS_ROOT = "/skills";
const LESSONS_ROOT = "/lessons";
const PRACTICE_ROOT = "/practice-sessions";

// Endpoints
export const ENDPOINTS = {
  AUTH: {
    GOOGLE: `${AUTH_ROOT}/google`,
    REFRESH: `${AUTH_ROOT}/refresh`,
    LOGOUT: `${AUTH_ROOT}/logout`,
    ME: `${AUTH_ROOT}/me`,
  },

  ONBOARDING: {
    SUBMIT_SURVEY: `${ONBOARDING_ROOT}/survey`,
    SURVEY_HISTORY: `${ONBOARDING_ROOT}/survey/history`,
    SKIP: `${ONBOARDING_ROOT}/skip`,
  },

  PLACEMENT: {
    START: `${PLACEMENT_ROOT}/start`,
    ANSWER: `${PLACEMENT_ROOT}/answers`,
    COMPLETE: `${PLACEMENT_ROOT}/complete`,
    RESULT: `${PLACEMENT_ROOT}/result`,
    SKIP: `${PLACEMENT_ROOT}/skip`,
    CURRENT: `${PLACEMENT_ROOT}/current`,
  },

  LEARN: {
    SKILLS: SKILLS_ROOT,
    LESSONS: LESSONS_ROOT,
    LESSON_DETAIL: (id: string) => `${LESSONS_ROOT}/${id}`,
    PRACTICE_SESSIONS: PRACTICE_ROOT,
    PRACTICE_SESSION_DETAIL: (id: string) => `${PRACTICE_ROOT}/${id}`,
  },

  EXERCISE: {
    START_LESSON: `${EXERCISE_ROOT}/lesson/start`,
    START_PRACTICE: `${EXERCISE_ROOT}/question-set/start`,
    SUBMIT_ANSWER: (id: string) => `${EXERCISE_ROOT}/${id}/answers`,
    COMPLETE: (id: string) => `${EXERCISE_ROOT}/${id}/complete`,
    RESULT: (id: string) => `${EXERCISE_ROOT}/${id}/result`,
    HISTORY: `${EXERCISE_ROOT}/history`,
  },

  PLAN: {
    CURRENT: `${PLAN_ROOT}/current`,
    GENERATE: `${PLAN_ROOT}/generate`,
    HISTORY: `${PLAN_ROOT}/history`,
    UPDATE_ITEM: (id: string) => `${PLAN_ROOT}/items/${id}`, // đổi từ COMPLETE_ITEM
    REVIEW_FEEDBACK: (id: string) => `${PLAN_ROOT}/review/${id}/feedback`, // đổi path
    RESET: `${PLAN_ROOT}/reset`,
  },

  DASHBOARD: {
    OVERVIEW: `${DASHBOARD_ROOT}/overview`,
    STREAK: `${DASHBOARD_ROOT}/streak`,
    STUDY_TIME: `${DASHBOARD_ROOT}/study-time`,
    SKILL_PROGRESS: (skillName: string) => `${DASHBOARD_ROOT}/skills/${skillName}/progress`,
  },

  VOCABULARY: {
    SAVE: `${VOCABULARY_ROOT}/save`,
    LIST: VOCABULARY_ROOT,
    UPDATE: (id: string) => `${VOCABULARY_ROOT}/${id}`,
    DELETE: (id: string) => `${VOCABULARY_ROOT}/${id}`,
  },
} as const;
