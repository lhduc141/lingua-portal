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

  const handleBack = () => {
    router.push(ROUTES.LEARN.LESSONS);
  };

  return (
    <div className="flex items-center justify-between border-t pt-6">
      <Button variant="outline" onClick={handleBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách bài học
      </Button>

      {showRetry && onRetry && (
        <Button onClick={onRetry} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Làm lại bài tập
        </Button>
      )}
    </div>
  );
}
