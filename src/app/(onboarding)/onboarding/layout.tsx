import onboardingBg from "@/assets/svgs/pending-onboarding-bg.svg";
import Image from "next/image";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src={onboardingBg}
        alt="onboarding background"
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center">{children}</div>
    </div>
  );
}
