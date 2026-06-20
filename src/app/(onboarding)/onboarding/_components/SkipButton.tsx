"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { useAuthStore } from "@/stores";
import { OnboardingStatus } from "@/types";
import { api, ENDPOINTS } from "@/lib/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog";

export function SkipButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuthStore();

  const handleSkip = async () => {
    try {
      setLoading(true);
      await api.post(ENDPOINTS.ONBOARDING.SKIP);
      if (user) {
        setUser({
          ...user,
          surveyStatus: OnboardingStatus.SKIPPED,
          placementStatus: OnboardingStatus.SKIPPED,
        });
      }
      router.push(ROUTES.DASHBOARD);
    } catch {
      // Nếu API fail: vẫn update store để không bị loop
      if (user) {
        setUser({
          ...user,
          surveyStatus: OnboardingStatus.SKIPPED,
          placementStatus: OnboardingStatus.SKIPPED,
        });
      }
      router.push(ROUTES.DASHBOARD);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-[#475569] bg-transparent py-3 text-center font-sans font-bold text-[#475569] transition-colors hover:bg-gray-50"
      >
        Skip for now
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="items-center space-y-2 text-center">
            <DialogTitle className="font-sans text-xl">Skip onboarding?</DialogTitle>
            <DialogDescription>
              You&apos;ll go straight to your dashboard. You can always complete the survey and
              placement test later from your profile.
            </DialogDescription>
          </DialogHeader>

          <div className="flex space-x-4 pt-2">
            <button
              onClick={handleSkip}
              disabled={loading}
              className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
            >
              {loading ? "Skipping..." : "Yes, skip for now"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              Go back
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
