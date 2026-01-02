export const ENDPOINTS = {
    AUTH: {
        GOOGLE: '/auth/google',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
    },
    LESSONS: {
        LIST: '/lessons',
        DETAIL: (id: string) => `/lessons/${id}`,
    },
    PRACTICE: {
        LIST: '/practice-sessions',
        DETAIL: (id: string) => `/practice-sessions/${id}`,
    },
    DICTIONARY: {
        LOOKUP: '/dictionary/lookup',
    },
} as const;