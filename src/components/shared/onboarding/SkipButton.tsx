"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SkipButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
              onClick={() => router.push(ROUTES.DASHBOARD)}
              className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
            >
              Yes, skip for now
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
