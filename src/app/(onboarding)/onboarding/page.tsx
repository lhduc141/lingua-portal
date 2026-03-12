import Image from "next/image";
import pandaLogo from "@/assets/svgs/panda-paw.svg";
import linguaPandaAim from "@/assets/svgs/lingua-target-help.svg";
import linguaPandaStudyPlan from "@/assets/svgs/lingua-study-plan.svg";
import { LetStartedButton, SkipButton } from "@/components/shared";

export default function OnboardingPage() {
  return (
    <div className="flex w-fit flex-col items-center justify-center space-y-6 rounded-2xl bg-white p-8 shadow-lg">
      {/* Icon */}
      <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-teal-100">
        <Image src={pandaLogo} alt="lingua panda" height={40} width={40} />
      </div>

      {/* Title */}
      <div className="font-serif text-[36px]">Welcome to Lingua Panda</div>
      <div className="text-center font-sans text-body-m text-[#475569]">
        Let&apos;s personalize your learning journey to help you
        <br />
        achieve your English goals faster.
      </div>

      {/* Features */}
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

      {/* Buttons */}
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        <LetStartedButton />
        <SkipButton />
      </div>
    </div>
  );
}
