"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/config";

export function LetStartedButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.push(ROUTES.ONBOARDING.SURVEY);
      }}
      className={
        "w-full rounded-xl bg-teal-600 py-3 text-center font-sans font-bold text-white hover:bg-teal-700"
      }
    >
      Let's Started
    </button>
  );
}
