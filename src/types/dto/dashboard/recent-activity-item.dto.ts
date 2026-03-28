export type RecentActivityItem = {
  type: "assessment" | "plan_item";
  title: string;
  skillName: string | null;
  score: number | null;
  status: string;
  date: string;
};
