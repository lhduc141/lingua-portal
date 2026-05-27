import { api, ENDPOINTS } from "@/lib";
import {
  ExerciseCompleteDto,
  ExerciseHistoryItemDto,
  ExerciseResultDto,
  ExerciseStartDto,
  ResponseDto,
  ResponsePagingDto,
  SubmitAnswerResponseDto,
  SubmitExerciseAnswerDto,
} from "@/types";

export async function startLessonExercise(
  lessonId: string
): Promise<ResponseDto<ExerciseStartDto>> {
  return api.post(ENDPOINTS.EXERCISE.START_LESSON, { lessonId });
}

export async function startPracticeExercise(
  questionSetId: string
): Promise<ResponseDto<ExerciseStartDto>> {
  return api.post(ENDPOINTS.EXERCISE.START_PRACTICE, { questionSetId });
}

export async function submitExerciseAnswer(
  exerciseId: string,
  dto: SubmitExerciseAnswerDto
): Promise<ResponseDto<SubmitAnswerResponseDto>> {
  return api.post(ENDPOINTS.EXERCISE.SUBMIT_ANSWER(exerciseId), dto);
}

/**
 * Fire-and-forget speaking answer.
 * Gửi audio blob lên backend → backend tự chạy Whisper + Azure + Groq async.
 * FE không cần chờ — redirect sang result page ở chế độ pending.
 */
export async function submitSpeakingAnswer(
  exerciseId: string,
  questionId: string,
  audioBlob: Blob
): Promise<ResponseDto<SubmitAnswerResponseDto>> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  formData.append("questionId", questionId);
  const res = await api.post(ENDPOINTS.EXERCISE.SUBMIT_SPEAKING_ANSWER(exerciseId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function completeExercise(
  exerciseId: string
): Promise<ResponseDto<ExerciseCompleteDto>> {
  return api.post(ENDPOINTS.EXERCISE.COMPLETE(exerciseId));
}

export async function getExerciseResult(
  exerciseId: string
): Promise<ResponseDto<ExerciseResultDto>> {
  return api.get(ENDPOINTS.EXERCISE.RESULT(exerciseId));
}

export async function getExerciseHistory(params: {
  pageIndex?: number;
  pageSize?: number;
}): Promise<ResponsePagingDto<ExerciseHistoryItemDto>> {
  return api.get(ENDPOINTS.EXERCISE.HISTORY, { params });
}
