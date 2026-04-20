"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useExerciseResult } from "@/hooks/exercise";
import { QuestionResultCard, ResultActions, ResultHeader } from "./_components";

export default function ExerciseResultPage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params?.exerciseId as string;

  const { data, isLoading, error, refetch } = useExerciseResult(exerciseId);

  // Handle retry
  const handleRetry = () => {
    // Navigate back to lesson or practice session
    // You might want to store refType/refId in localStorage or query params
    router.push("/learn/lessons");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="space-y-4 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading Result...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data?.data) {
    return (
      <div className="container max-w-4xl py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Could not load exercise results. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const result = data.data;
  const isStillGrading = result.status !== "scored";

  return (
    <div className="container max-w-4xl space-y-8 py-8">
      <ResultHeader result={result} />

      {isStillGrading && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Some questions are still being graded by AI. Results will update automatically.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Question Details</h2>
        {result.answers.map((answer, index) => (
          <QuestionResultCard key={answer.questionId} answer={answer} index={index} />
        ))}
      </div>

      <ResultActions onRetry={handleRetry} showRetry={!isStillGrading} />
    </div>
  );
}
