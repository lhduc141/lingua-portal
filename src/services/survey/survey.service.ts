import { SurveyFormData } from "@/types";
import { api, ENDPOINTS } from "@/lib";

export async function submitSurvey(data: SurveyFormData): Promise<void> {
  return await api.post(ENDPOINTS.ONBOARDING.SUBMIT_SURVEY, data);
}
