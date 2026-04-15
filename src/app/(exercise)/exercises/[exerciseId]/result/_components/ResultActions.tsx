"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config";

type ResultActionsProps = {
  onRetry?: () => void;
  showRetry?: boolean;
};

export function ResultActions({ onRetry, showRetry = true }: ResultActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between border-t pt-6">
      <Button variant="outline" onClick={() => router.push(ROUTES.LEARN.LESSONS)} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Lessons
      </Button>

      {showRetry && onRetry && (
        <Button onClick={onRetry} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
