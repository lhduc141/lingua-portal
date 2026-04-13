export type AdminPlacementSessionDto = {
  sessionId: string;
  status: string;
  cefrLevel: string | null;
  confidence: number | null;
  finalTheta: number | null;
  currentQuestion: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  startedAt: string;
  completedAt: string | null;
  user: {
    userId: string;
    email: string;
    googleName: string | null;
    googleAvatarUrl: string | null;
  };
};
