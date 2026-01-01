export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    LESSONS: '/lessons',
    LESSON_DETAIL: (id: string) => `/lessons/${id}`,
    PRACTICE: '/practice',
    PRACTICE_SESSION: (id: string) => `/practice/${id}`,
    DICTIONARY: '/dictionary',
    LEARNING_PLAN: '/learning-plan',
    ONBOARDING: {
        SURVEY: '/survey',
        PLACEMENT_TEST: '/placement-test',
    },
} as const;