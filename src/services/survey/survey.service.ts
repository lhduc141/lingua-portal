import { ResponseDto, SurveyFormData } from "@/types";
import { api, ENDPOINTS } from "@/lib";

export async function submitSurvey(data: SurveyFormData): Promise<void> {
  return await api.post(ENDPOINTS.ONBOARDING.SUBMIT_SURVEY, data);
}

export async function getSurvey(): Promise<ResponseDto<SurveyFormData>> {
  return api.get(ENDPOINTS.ONBOARDING.SUBMIT_SURVEY);
}

export async function updateSurvey(data: SurveyFormData): Promise<void> {
  return api.post(ENDPOINTS.ONBOARDING.SUBMIT_SURVEY, data);
}
 