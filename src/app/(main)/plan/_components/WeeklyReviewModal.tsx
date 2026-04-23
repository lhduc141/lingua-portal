"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Lightbulb, TrendingUp, X } from "lucide-react";
import { cn } from "@/lib";
import { useSubmitReviewFeedback } from "@/hooks/plan";
import type { PlanTaskDto } from "@/types/dto/plan";

interface WeeklyReviewData {
  summary: {
    completedTasks: number;
    totalTasks: number;
    completionRate: number;
    totalStudyMinutes: number;
    averageTaskScore: number;
  };
  skillBreakdown: Record<
    string,
    {
      avgScore: number;
      tasksCompleted: number;
      trend: "strong" | "improving" | "needs_improvement";
    }
  >;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface WeeklyReviewModalProps {
  task: PlanTaskDto;
  onClose: () => void;
}

const TREND_CONFIG = {
  strong: { label: "Strong", color: "text-teal-600 bg-teal-50" },
  improving: { label: "Improving", color: "text-blue-600 bg-blue-50" },
  needs_improvement: { label: "Needs work", color: "text-amber-600 bg-amber-50" },
};

const SKILL_COLORS: Record<string, string> = {
  reading: "bg-teal-500",
  writing: "bg-violet-500",
  speaking: "bg-orange-500",
};

export function WeeklyReviewModal({ task, onClose }: WeeklyReviewModalProps) {
  const [feedback, setFeedback] = useState("");
  const submitMutation = useSubmitReviewFeedback();

  // Parse review data từ task.description (JSON string)
  let reviewData: WeeklyReviewData | null = null;
  const isReviewReady = !!task.description;

  if (isReviewReady) {
    try {
      reviewData = JSON.parse(task.description!) as WeeklyReviewData;
    } catch {
      reviewData = null;
    }
  }

  const alreadySubmitted = !!task.feedbackSubmittedAt;

  const handleSubmit = () => {
    submitMutation.mutate(
      { itemId: task.itemId, dto: { userFeedback: feedback || null } },
      { onSuccess: onClose }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <div>
            <h2 className="font-serif text-[22px] text-gray-900">{task.title}</h2>
            <p className="text-[13px] text-slate-400">Weekly Learning Review</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {!isReviewReady && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-12 text-center">
              <AlertTriangle className="h-10 w-10 text-amber-400" />
              <p className="mt-3 text-[15px] font-medium text-gray-700">Review not ready yet</p>
              <p className="mt-1 text-[13px] text-slate-400">
                Your weekly review will be generated at the end of the week.
              </p>
            </div>
          )}

          {reviewData && (
            <>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Completion",
                    value: `${reviewData.summary.completionRate?.toFixed(0) ?? 0}%`,
                    sub: `${reviewData.summary.completedTasks}/${reviewData.summary.totalTasks} tasks`,
                  },
                  {
                    label: "Study Time",
                    value: `${reviewData.summary.totalStudyMinutes ?? 0}`,
                    sub: "minutes",
                  },
                  {
                    label: "Avg Score",
                    value: reviewData.summary.averageTaskScore
                      ? `${reviewData.summary.averageTaskScore}/10`
                      : "—",
                    sub: "across exercises",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      {s.label}
                    </p>
                    <p className="mt-1 font-serif text-[26px] font-bold text-gray-900">{s.value}</p>
                    <p className="text-[11px] text-slate-400">{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Skill breakdown */}
              {reviewData.skillBreakdown && (
                <div className="rounded-xl border border-gray-100 p-5">
                  <h3 className="mb-4 font-serif text-[16px] text-gray-900">Skills This Week</h3>
                  <div className="space-y-3">
                    {Object.entries(reviewData.skillBreakdown).map(([skill, data]) => {
                      const trend = TREND_CONFIG[data.trend] ?? TREND_CONFIG.improving;
                      const pct = Math.min(100, data.avgScore ?? 0);
                      return (
                        <div key={skill}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-[14px] font-medium capitalize text-gray-700">
                              {skill}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] text-gray-500">
                                {data.tasksCompleted} tasks
                              </span>
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                  trend.color
                                )}
                              >
                                {trend.label}
                              </span>
                            </div>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-700",
                                SKILL_COLORS[skill] ?? "bg-gray-400"
                              )}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {reviewData.strengths?.length > 0 && (
                <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-600" />
                    <h3 className="text-[14px] font-semibold text-teal-800">Strengths</h3>
                  </div>
                  <ul className="space-y-2">
                    {reviewData.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-[13px] text-teal-700">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {reviewData.weaknesses?.length > 0 && (
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-amber-600" />
                    <h3 className="text-[14px] font-semibold text-amber-800">Areas to Improve</h3>
                  </div>
                  <ul className="space-y-2">
                    {reviewData.weaknesses.map((w, i) => (
                      <li key={i} className="flex gap-2 text-[13px] text-amber-700">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {reviewData.recommendations?.length > 0 && (
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <h3 className="text-[14px] font-semibold text-blue-800">
                      Next Week Recommendations
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {reviewData.recommendations.map((r, i) => (
                      <li key={i} className="flex gap-2 text-[13px] text-blue-700">
                        <span className="mt-0.5 shrink-0 font-bold">{i + 1}.</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Feedback form */}
          {isReviewReady && !alreadySubmitted && (
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <label className="text-[14px] font-semibold text-gray-700">
                Your feedback <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                placeholder="How was your week? Any thoughts for next week..."
                className="w-full resize-none rounded-lg border border-gray-200 p-3 text-[14px] text-gray-700 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100"
              />
              <button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="w-full rounded-xl bg-teal-600 py-3 text-[14px] font-bold text-white hover:bg-teal-700 disabled:opacity-60"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit & Unlock Next Week"}
              </button>
            </div>
          )}

          {/* Already submitted */}
          {alreadySubmitted && (
            <div className="flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" />
              <div>
                <p className="text-[14px] font-semibold text-teal-800">Feedback submitted</p>
                <p className="text-[12px] text-teal-600">
                  You can now generate the next week&apos;s plan.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
