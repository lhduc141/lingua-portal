export type SkillSummaryItem = {
  avgScore: number | null;
  assessmentCount: number;
  trend: "up" | "down" | "stable" | "new";
};
