export type PlacementResultDto = {
  sessionId: string;

  cefrAssignment: {
    level: string;
    confidence: {
      lower: string;
      upper: string;
    };
    thetaBounds: {
      lower: number;
      estimate: number;
      upper: number;
    };
    description: string;
  };
  finalTheta: number;
  finalSe: number;

  questionsAdministered: number;
  correctAnswers: number;
  accuracyRate: number;

  startedAt: string;
  completedAt: string;
};
