import { api, ENDPOINTS } from "@/lib";
import { ResponseDto } from "@/types";
import {
  PlacementAnswerDto,
  PlacementResultDto,
  PlacementSessionData,
  PlacementStartDto,
  SubmitPlacementAnswerDto,
} from "@/types/dto/placement";

// POST "/placement/start": bắt đầu test, nhận thông tin câu hỏi đầu tiên
export async function startPlacement(): Promise<ResponseDto<PlacementStartDto>> {
  return api.post(ENDPOINTS.PLACEMENT.START);
}

// POST "/placement/answers": gửi đáp án của câu hiện tại
// - assessmentId
// - questionId
// - selectedOptionId
// Nhận thông tin next question hoặc isCompleted
export async function submitAnswer(
  dto: SubmitPlacementAnswerDto
): Promise<ResponseDto<PlacementAnswerDto>> {
  return await api.post(ENDPOINTS.PLACEMENT.ANSWER, dto);
}

// POST "placement/skip": bỏ qua bài test hiện tại
export async function skipPlacement(): Promise<ResponseDto<null>> {
  return await api.post(ENDPOINTS.PLACEMENT.SKIP);
}

// GET "placement/result": lấy kết quả bài test (dùng cho reuslt page)
export async function getPlacementResult(): Promise<ResponseDto<PlacementResultDto>> {
  return await api.get(ENDPOINTS.PLACEMENT.RESULT);
}
// GET "placement/current": lấy thông tin session dang dở để resume
export async function getCurrentSession(): Promise<ResponseDto<PlacementSessionData>> {
  return await api.get(ENDPOINTS.PLACEMENT.CURRENT);
}
