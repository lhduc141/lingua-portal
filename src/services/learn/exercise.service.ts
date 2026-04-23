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

//TODO: Lesson Exercise Service
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

//TODO: Exercise Service
export async function submitExerciseAnswer(
  exerciseId: string,
  dto: SubmitExerciseAnswerDto
): Promise<ResponseDto<SubmitAnswerResponseDto>> {
  return api.post(ENDPOINTS.EXERCISE.SUBMIT_ANSWER(exerciseId), dto);
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

export async function transcribeAudio(audioBlob: Blob): Promise<{ transcript: string }> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  const res = await api.post(ENDPOINTS.EXERCISE.TRANSCRIBE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data
}
