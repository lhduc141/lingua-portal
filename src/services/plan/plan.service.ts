import { api, ENDPOINTS } from "@/lib";
import { ReviewFeedbackDto, UpdatePlanItemDto } from "@/types";

export async function getCurrentPlan() {
  return api.get(ENDPOINTS.PLAN.CURRENT);
}

export async function generatePlan(phase?: "week1" | "week2") {
  return api.post(ENDPOINTS.PLAN.GENERATE);
}

export async function updatePlanItem(itemId: string, dto: UpdatePlanItemDto) {
  return api.patch(ENDPOINTS.PLAN.UPDATE_ITEM(itemId), dto);
}

export async function submitReviewFeedback(itemId: string, dto: ReviewFeedbackDto) {
  return api.post(ENDPOINTS.PLAN.REVIEW_FEEDBACK(itemId), dto);
}

export async function getPlanHistory(params?: { pageIndex?: number; pageSize?: number }) {
  return api.get(ENDPOINTS.PLAN.HISTORY, { params });
}

export async function resetPlan() {
  return api.delete(ENDPOINTS.PLAN.RESET);
}
