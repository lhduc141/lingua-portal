export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export const CEFR_LABELS: Record<string, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper Intermediate",
  C1: "Advanced",
  C2: "Proficient",
};

export const CEFR_DESCRIPTIONS: Record<string, string> = {
  A1: "You're just starting out! You can understand and use basic phrases for everyday situations.",
  A2: "You can communicate in simple tasks and describe aspects of your background and immediate needs.",
  B1: "Great job! You have a solid foundation for everyday conversations and clear writing.",
  B2: "Well done! You can interact fluently with native speakers and produce clear, detailed text.",
  C1: "Excellent! You can express yourself fluently and spontaneously in complex academic and professional contexts.",
  C2: "Outstanding! You have mastered English at a near-native level with exceptional precision.",
};
