"use client";

import { WarningIcon } from "@/components";
import { ROUTES } from "@/config";
import { getPlacementResult } from "@/services";
import { useAuthStore } from "@/stores";
import {
  CEFR_DESCRIPTIONS,
  CEFR_LABELS,
  CEFR_LEVELS,
  OnboardingStatus,
  PlacementResultDto,
} from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlacementResultPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  const [result, setResult] = useState<PlacementResultDto | null>(null);

  useEffect(() => {
    if (!user) return;
    if (user.placementStatus === OnboardingStatus.PENDING) {
      router.replace(ROUTES.ONBOARDING.PLACEMENT);
      return;
    }

    const fetchResult = async () => {
      try {
        const res = await getPlacementResult();
        setResult(res.data);
      } catch {
        router.replace(ROUTES.DASHBOARD);
      }
    };

    void fetchResult();
  }, [user, router]);
  if (!result) return null;

  const level = result.cefrAssignment.level; // "B1"
  const currentIndex = CEFR_LEVELS.indexOf(level as (typeof CEFR_LEVELS)[number]);
  const fillPercent = (currentIndex / (CEFR_LEVELS.length - 1)) * 100; // 40%

  return (
    <div className="flex max-w-[480px] flex-col items-center justify-between space-y-6 rounded-xl border bg-white p-8 shadow-2xl">
      {/*Result*/}
      <div className="flex h-32 w-32 items-center justify-center rounded-full border-[6px] border-teal-700 bg-teal-50">
        <span className="font-serif text-[32px] text-teal-700">{result.cefrAssignment.level}</span>
      </div>

      {/*Level*/}
      <div className="font-serif text-[28px] text-black">
        <span>{CEFR_LABELS[result.cefrAssignment.level]}</span>
      </div>

      {/*Description*/}
      <div className="px-auto mx-auto text-center text-body-m font-normal text-gray-400">
        {CEFR_DESCRIPTIONS[result.cefrAssignment.level]}
      </div>

      {/*Level Bar */}
      <div className="w-full space-y-2">
        <div className="flex justify-between text-[10px] text-xs text-gray-400">
          {CEFR_LEVELS.map((l) => (
            <span key={l} className={l === level ? "font-bold text-teal-600" : ""}>
              {l}
            </span>
          ))}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-500"
            style={{ width: `${fillPercent}%` }}
          />
        </div>
      </div>

      {/*Estimated Range */}
      <div className="flex space-x-1 rounded-full border px-4 py-2 text-[14px]">
        <div className="flex items-center">
          <WarningIcon className="h-4 w-4" />
          <span>Estimated range:</span>
        </div>
        <span className="font-semibold">
          {result.cefrAssignment.confidence.lower}-{result.cefrAssignment.confidence.upper}
        </span>
      </div>

      <div className="flex w-full items-center justify-between">
        {[
          { label: "QUESTIONS", value: result.questionsAdministered },
          { label: "CORRECT", value: result.correctAnswers },
          { label: "ACCURACY", value: `${result.accuracyRate}%` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-xl bg-gray-100 px-4 py-3"
          >
            <span className="text-[10px] text-xs font-semibold uppercase tracking-widest text-gray-400">
              {stat.label}
            </span>
            <span className="mt-1 text-xl font-bold text-gray-800">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex w-full flex-col items-center space-y-3">
        <button
          onClick={() => router.push(ROUTES.PLAN)}
          className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white hover:bg-teal-700"
        >
          View My Learning Plan →
        </button>
        <button
          onClick={() => router.push(ROUTES.DASHBOARD)}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
