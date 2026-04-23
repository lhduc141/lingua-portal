"use client";

import { ArrowRight, CheckCircle2, ClipboardList } from "lucide-react";
import { cn } from "@/lib/cn";
import type { PlanTaskDto } from "@/types/dto/plan";

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

interface ReviewCardProps {
  planDay: { date: string; tasks?: PlanTaskDto[] };
  onReviewClick: (task: PlanTaskDto) => void;
  todayStr: string;
}

export function ReviewCard({ planDay, onReviewClick, todayStr }: ReviewCardProps) {
  const reviewTask = planDay.tasks?.find((t) => t.itemType === "weekly_review");
  if (!reviewTask) return null;

  const dateObj = new Date(planDay.date + "T12:00:00");
  const dayLabel = DAY_NAMES[dateObj.getDay()];
  const dateNum = dateObj.getDate();
  const isToday = planDay.date === todayStr;
  const isReviewReady = !!reviewTask.description;
  const alreadySubmitted = !!reviewTask.feedbackSubmittedAt;

  const state = alreadySubmitted ? "done" : isReviewReady ? "ready" : "pending";

  const headerCls = {
    done: "bg-teal-600",
    ready: "bg-teal-500",
    pending: "bg-teal-400", // warm brown — không quá lạc quẻ
  }[state];

  const cardCls = {
    done: "border-teal-200 bg-teal-50/30",
    ready: "border-teal-200 bg-teal-50/20",
    pending: "border-teal-100 bg-teal-50/20", // warm cream
  }[state];

  return (
    <div
      onClick={() => onReviewClick(reviewTask)}
      className={cn(
        "flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md",
        cardCls
      )}
    >
      <div className={cn("flex items-center justify-between px-4 py-3", headerCls)}>
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">{dayLabel}</p>
          <p className="font-serif text-[22px] font-bold leading-none text-white">{dateNum}</p>
        </div>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold text-white">
          REVIEW
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              state === "done" ? "bg-teal-100" : state === "ready" ? "bg-teal-100" : "bg-gray-100"
            )}
          >
            {state === "done" ? (
              <CheckCircle2 className="h-4 w-4 text-teal-600" />
            ) : (
              <ClipboardList
                className={cn("h-4 w-4", state === "ready" ? "text-teal-600" : "text-teal-600")}
              />
            )}
          </div>
          <p
            className={cn(
              "font-serif text-[15px] font-semibold",
              state === "done"
                ? "text-teal-800"
                : state === "ready"
                  ? "text-teal-700"
                  : "text-teal-800"
            )}
          >
            {reviewTask.title}
          </p>
        </div>

        <p
          className={cn(
            "text-[11px] leading-relaxed",
            state === "done"
              ? "text-teal-700"
              : state === "ready"
                ? "text-teal-600"
                : "text-teal-600"
          )}
        >
          {state === "done"
            ? "✓ Feedback submitted. Ready to generate Week 2."
            : state === "ready"
              ? "Your weekly review is ready. Tap to read and submit feedback."
              : "Complete the week to unlock your AI review."}
        </p>

        {state === "pending" && (
          <div className="mt-1 space-y-1.5">
            {[
              "Review your week's progress",
              "See AI feedback on skills",
              "Unlock next week's plan",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-200" />
                <p className="text-[10px] text-teal-500">{item}</p>
              </div>
            ))}
          </div>
        )}

        {state === "ready" && (
          <button className="mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-teal-500 py-2 text-[11px] font-bold text-white hover:bg-teal-700">
            Open Review <ArrowRight className="h-3 w-3" />
          </button>
        )}

        {state === "done" && (
          <div className="mt-auto rounded-xl border border-teal-200 bg-teal-50 p-2 text-center text-[10px] font-medium text-teal-700">
            Week 2 unlocked ✓
          </div>
        )}
      </div>
    </div>
  );
}
