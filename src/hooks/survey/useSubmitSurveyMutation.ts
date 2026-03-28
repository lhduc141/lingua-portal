import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { useMutation } from "@tanstack/react-query";
import { submitSurvey } from "@/services";
import { OnboardingStatus, SurveyFormData } from "@/types";
import { ROUTES } from "@/config";

export function useSubmitSurveyMutation() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (data: SurveyFormData) => submitSurvey(data),
    onSuccess: () => {
      if (user) setUser({ ...user, surveyStatus: OnboardingStatus.COMPLETED });
      router.push(ROUTES.ONBOARDING.PLACEMENT);
    },
    onError: () => {
      console.error("Unable to submit survey");
    },
  });

  return {
    handleSubmit: mutation.mutate,
    isPending: mutation.isPending,
  };
}
