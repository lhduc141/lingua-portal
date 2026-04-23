"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, LogOut, User, X } from "lucide-react";
import { cn } from "@/lib";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/config";
import { useSurvey, useUpdateSurvey } from "@/hooks/survey";
import { INITIAL_SURVEY_DATA, type SurveyFormData } from "@/types";
import {
  SurveyPageFinal,
  SurveyPageOne,
  SurveyPageSeconds,
} from "@/app/(onboarding)/onboarding/survey/_components";
import { PawSpinner } from "@/components/shared/spinner";

type Tab = "profile" | "survey";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const TOTAL_PAGES = 3;

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const router = useRouter();
  const { user, clearUser } = useAuthStore();

  const [tab, setTab] = useState<Tab>("profile");
  const [surveyPage, setSurveyPage] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<SurveyFormData>(INITIAL_SURVEY_DATA);
  const [saved, setSaved] = useState(false);
  const [askRegenerate, setAskRegenerate] = useState(false);

  const { data: surveyData, isLoading: surveyLoading } = useSurvey();
  const updateSurveyMutation = useUpdateSurvey();

  useEffect(() => {
    if (surveyData?.data) {
      const raw = surveyData.data;
      const availableDays = (raw.availableDays ?? []).filter((d: string) =>
        ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"].includes(d)
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({ ...INITIAL_SURVEY_DATA, ...raw, availableDays });
    }
  }, [surveyData]);

  const updateForm = (fields: Partial<SurveyFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const goNext = () => {
    setDirection(1);
    setSurveyPage((p) => Math.min(p + 1, TOTAL_PAGES));
  };
  const goBack = () => {
    setDirection(-1);
    setSurveyPage((p) => Math.max(p - 1, 1));
  };

  const handleSaveSurvey = async () => {
    const payload: SurveyFormData = {
      primaryGoal: formData.primaryGoal,
      targetGoal: formData.targetGoal,
      targetCertification: formData.targetCertification,
      targetScore: formData.targetScore,
      targetDeadlineDate: formData.targetDeadlineDate,
      primaryFocusSkills: formData.primaryFocusSkills,
      plannedStudyHoursPerWeek: formData.plannedStudyHoursPerWeek,
      availableDays: formData.availableDays.filter((d) =>
        ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"].includes(d)
      ),
      selfAssessedLevel: formData.selfAssessedLevel,
      usageContext: formData.usageContext,
      previousLearningExperience: formData.previousLearningExperience,
      difficulties: formData.difficulties,
      additionalContext: formData.additionalContext,
    };
    await updateSurveyMutation.mutateAsync(payload);
    setSaved(true);
    setAskRegenerate(true);
  };

  const handleLogout = () => {
    clearUser();
    onClose();
    router.replace(ROUTES.LOGIN);
  };

  const handleClose = () => {
    setSaved(false);
    setAskRegenerate(false);
    setSurveyPage(1);
    setTab("profile");
    onClose();
  };

  const surveyPages = [
    <SurveyPageOne key="p1" data={formData} onChange={updateForm} />,
    <SurveyPageSeconds key="p2" data={formData} onChange={updateForm} />,
    <SurveyPageFinal key="p3" data={formData} onChange={updateForm} />,
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 flex min-w-[520px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                className="h-10 w-10 rounded-full object-cover"
                alt="avatar"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-[16px] font-bold text-teal-700">
                {user?.displayName?.[0] ?? "U"}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{user?.displayName ?? "User"}</p>
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700">
                  {user?.cefrLevel ?? "—"}
                </span>
                <span className="text-[11px] text-slate-400">{user?.email}</span>
              </div>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 hover:bg-gray-100">
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {(
            [
              { key: "profile", label: "Profile", icon: User },
              { key: "survey", label: "Survey", icon: BookOpen },
            ] as { key: Tab; label: string; icon: any }[]
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-colors",
                tab === key
                  ? "border-b-2 border-teal-600 text-teal-700"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === "profile" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Account
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">Name</span>
                    <span className="text-[13px] font-medium text-gray-900">
                      {user?.displayName ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">Email</span>
                    <span className="text-[13px] font-medium text-gray-900">
                      {user?.email ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">CEFR Level</span>
                    <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[12px] font-bold text-teal-700">
                      {user?.cefrLevel ?? "Not set"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "survey" && (
            <div className="space-y-4">
              {/* Ask regenerate banner */}
              {askRegenerate && (
                <div className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 p-4">
                  <p className="text-[13px] text-teal-700">
                    Saved! Regenerate your plan to apply changes?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setAskRegenerate(false);
                        handleClose();
                        router.push(ROUTES.PLAN);
                      }}
                      className="rounded-lg bg-teal-600 px-3 py-1.5 text-[12px] font-bold text-white hover:bg-teal-700"
                    >
                      Go to Plan
                    </button>
                    <button
                      onClick={() => setAskRegenerate(false)}
                      className="rounded-lg border px-3 py-1.5 text-[12px] text-slate-500 hover:bg-gray-50"
                    >
                      Later
                    </button>
                  </div>
                </div>
              )}

              {/* Progress dots */}
              <div className="flex items-center justify-between">
                <p className="text-[12px] text-slate-400">
                  Step {surveyPage} of {TOTAL_PAGES}
                </p>
                <div className="flex gap-1.5">
                  {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-2 w-2 rounded-full transition-all",
                        i + 1 === surveyPage ? "w-4 bg-teal-600" : "bg-gray-200"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Survey page content */}
              {surveyLoading ? (
                <div className="flex justify-center py-8">
                  <PawSpinner />
                </div>
              ) : (
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={surveyPage}
                    custom={direction}
                    initial={{ x: direction > 0 ? 200 : -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction > 0 ? -200 : 200, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {surveyPages[surveyPage - 1]}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-4">
          {tab === "survey" ? (
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={goBack}
                disabled={surveyPage === 1}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-[13px] font-medium text-slate-500 hover:bg-gray-50 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>

              {surveyPage < TOTAL_PAGES ? (
                <button
                  onClick={goNext}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-teal-600 px-4 py-2 text-[13px] font-bold text-white hover:bg-teal-700"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => void handleSaveSurvey()}
                  disabled={updateSurveyMutation.isPending}
                  className="flex flex-1 items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-[13px] font-bold text-white hover:bg-teal-700 disabled:opacity-60"
                >
                  {updateSurveyMutation.isPending
                    ? "Saving..."
                    : saved
                      ? "Saved ✓"
                      : "Save Changes"}
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
