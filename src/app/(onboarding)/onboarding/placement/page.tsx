"use client";

import { PlacementIntroView, PlacementTestView } from "./_components";
import { ROUTES } from "@/config";
import { SESSION_KEYS } from "@/lib";
import { getCurrentSession, skipPlacement, startPlacement, submitAnswer } from "@/services";
import { useAuthStore } from "@/stores";
import { OnboardingStatus } from "@/types";
import { PlacementSessionData, PlacementStartDto } from "@/types/dto/placement";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlacementPage() {
  const router = useRouter();
  const { user, isLoading, setUser } = useAuthStore();

  const [testStarted, setTestStarted] = useState<boolean>(false); // Start placement
  const [isStarting, setIsStarting] = useState<boolean>(false);

  const [session, setSession] = useState<PlacementSessionData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSkipping, setIsSkipping] = useState<boolean>(false); // Skip placement

  //  Bypass placement test (logic)
  useEffect(() => {
    if (isLoading || !user) return;
    if (
      user.placementStatus === OnboardingStatus.COMPLETED ||
      user.placementStatus === OnboardingStatus.SKIPPED
    ) {
      router.replace(ROUTES.DASHBOARD);
      return;
    }
    if (user.surveyStatus === OnboardingStatus.PENDING) {
      router.replace(ROUTES.ONBOARDING.SURVEY);
      return;
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.placementStatus !== OnboardingStatus.PENDING) return;
    const save = sessionStorage.getItem(SESSION_KEYS.PLACEMENT); // Check session storage before
    if (save)
      try {
        setSession(JSON.parse(save) as PlacementSessionData);
        setTestStarted(true);
        return;
      } catch {
        sessionStorage.removeItem(SESSION_KEYS.PLACEMENT); // Remove invalid session - corrupt
      }
    void handleResume();
  }, [user]);

  //TODO:  HANDLE FUNCTION
  const handleStartTest = async () => {
    setIsStarting(true);
    try {
      const res = await startPlacement();
      const data = res.data as PlacementStartDto;
      const sessionData: PlacementSessionData = {
        exerciseRecordId: data.exerciseRecordId,
        sessionId: data.sessionId,
        currentQuestion: data.firstQuestion,
        questionOrder: 1,
        progress: {
          questionsAnswered: 0,
          minQuestions: data.config.minQuestions,
          maxQuestions: data.config.maxQuestions,
        },
      };
      sessionStorage.setItem(SESSION_KEYS.PLACEMENT, JSON.stringify(sessionData));
      setSession(sessionData);
      setTestStarted(true);
    } catch (err: any) {
      // 409 = đã có session in-progress
      // hết session nhưng trong backend vẫn có => resume

      if (err?.response?.status === 409) {
        try {
          const res = await getCurrentSession();
          const data = res.data as PlacementSessionData;
          const sessionData: PlacementSessionData = {
            exerciseRecordId: data.exerciseRecordId,
            sessionId: data.sessionId,
            currentQuestion: res.data.currentQuestion,
            questionOrder: res.data.questionOrder,
            progress: res.data.progress,
          };
          sessionStorage.setItem(SESSION_KEYS.PLACEMENT, JSON.stringify(sessionData));
          setSession(sessionData);
          setTestStarted(true);
        } catch {
          console.log("Fail to resume existing session");
        }
      }
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitAnswer = async (optionId: string) => {
    if (!session || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await submitAnswer({
        exerciseRecordId: session.exerciseRecordId,
        questionId: session.currentQuestion.questionId,
        selectedOptionId: optionId,
      });

      if (res.data.isCompleted) {
        // End of this test
        sessionStorage.removeItem(SESSION_KEYS.PLACEMENT);
        router.push(ROUTES.ONBOARDING.PLACEMENT_RESULT);
        if (user) setUser({ ...user, placementStatus: OnboardingStatus.COMPLETED });
        return;
      }

      if (res.data.nextQuestion) {
        // Continue test with next question
        const updatedNextQuestionData: PlacementSessionData = {
          ...session,
          currentQuestion: res.data.nextQuestion,
          questionOrder: session.questionOrder + 1,
          progress: res.data.progress,
        };

        sessionStorage.setItem(SESSION_KEYS.PLACEMENT, JSON.stringify(updatedNextQuestionData));
        setSession(updatedNextQuestionData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setIsSkipping(true);
    try {
      await skipPlacement();
      sessionStorage.removeItem(SESSION_KEYS.PLACEMENT);
      if (user) setUser({ ...user, placementStatus: OnboardingStatus.SKIPPED });
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSkipping(false);
    }
    return;
  };

  const handleResume = async () => {
    try {
      const res = await getCurrentSession();
      const sessionData: PlacementSessionData = {
        exerciseRecordId: res.data.exerciseRecordId,
        sessionId: res.data.sessionId,
        currentQuestion: res.data.currentQuestion,
        questionOrder: res.data.questionOrder,
        progress: res.data.progress,
      };

      sessionStorage.setItem(SESSION_KEYS.PLACEMENT, JSON.stringify(sessionData));
      setSession(sessionData);
      setTestStarted(true);
    } catch {}
  };

  if (isLoading || !user) return null;
  if (
    user.placementStatus === OnboardingStatus.COMPLETED ||
    user.placementStatus === OnboardingStatus.SKIPPED ||
    user.surveyStatus === OnboardingStatus.PENDING
  ) {
    return null; // đang redirect
  }

  // MAIN UI:
  // 1. Continue Pending Test sesssion
  if (testStarted && session)
    return (
      <PlacementTestView
        session={session}
        handleSubmitAnswer={handleSubmitAnswer}
        isSubmitting={isSubmitting}
        handleSkip={handleSkip}
      />
    );

  // 2. Intro view
  return <PlacementIntroView handleStartTest={handleStartTest} handleSkip={handleSkip} />;
}
