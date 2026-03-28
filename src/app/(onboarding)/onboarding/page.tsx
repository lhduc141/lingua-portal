"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import pandaLogo from "@/assets/svgs/panda-paw.svg";
import linguaPandaAim from "@/assets/svgs/lingua-target-help.svg";
import linguaPandaStudyPlan from "@/assets/svgs/lingua-study-plan.svg";
import { LetStartedButton, SkipButton } from "@/components/shared";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/config/routes";
import { OnboardingStatus } from "@/types";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    const surveyDone = user.surveyStatus !== OnboardingStatus.PENDING;
    const placementDone = user.placementStatus !== OnboardingStatus.PENDING;

    if (surveyDone && placementDone) {
      router.replace(ROUTES.DASHBOARD);
      return;
    }
    if (surveyDone && !placementDone) {
      router.replace(ROUTES.ONBOARDING.PLACEMENT);
      return;
    }
  }, [user, router]);

  return (
    <div className="flex w-fit flex-col items-center justify-center space-y-6 rounded-2xl bg-white p-8 shadow-lg">
      <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-teal-100">
        <Image src={pandaLogo} alt="lingua panda" height={40} width={40} />
      </div>
      <div className="font-serif text-[36px]">Welcome to Lingua Panda</div>
      <div className="text-center font-sans text-body-m text-[#475569]">
        Let&apos;s personalize your learning journey to help you
        <br />
        achieve your English goals faster.
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-start space-x-4 rounded-lg bg-teal-50 p-4">
          <Image src={linguaPandaAim} alt="lingua panda" height={48} width={48} />
          <div>
            <div className="text-body-m font-semibold text-[#0F172A]">Accurate Assessment</div>
            <div className="text-[14px] text-[#0F172A]">
              Get your CEFR level assessed accurately in minutes.
            </div>
          </div>
        </div>
        <div className="flex items-center justify-start space-x-4 rounded-lg bg-teal-50 p-4">
          <Image src={linguaPandaStudyPlan} alt="lingua panda" height={48} width={48} />
          <div>
            <div className="text-body-m font-semibold text-[#0F172A]">Tailored Study Plan</div>
            <div className="text-[14px] text-[#0F172A]">
              Receive an AI-generated study plan tailored to your goals.
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        <LetStartedButton />
        <SkipButton />
      </div>
    </div>
  );
}
