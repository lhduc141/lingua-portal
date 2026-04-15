import { api, ENDPOINTS } from "@/lib";

export type LearnListParams = {
  skill?: string;
  cefrLevel?: string;
  keyword?:string;
  pageIndex?: number;
  pageSize?: number;
};

export async function getLessons(params?: LearnListParams) {
  return api.get(ENDPOINTS.LEARN.LESSONS, { params });
}

export async function getLessonById(lessonId: string) {
  return api.get(ENDPOINTS.LEARN.LESSON_DETAIL(lessonId));
}

export async function getPracticeSessions(params?: LearnListParams) {
  return api.get(ENDPOINTS.LEARN.PRACTICE_SESSIONS, { params });
}

export async function getPracticeSessionById(sessionId: string) {
  return api.get(ENDPOINTS.LEARN.PRACTICE_SESSION_DETAIL(sessionId));
}
