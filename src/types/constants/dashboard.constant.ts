export const SKILL_CONFIG = {
  reading: { bar: "#3b82f6", label: "Reading" },
  writing: { bar: "#a022d7", label: "Writing" },
  speaking: { bar: "#f97316", label: "Speaking" },
  // listening: { bar: "#10b981", label: "Listening" },
} as const;

export const TREND_CONFIG = {
  up: { bg: "bg-teal-50", text: "text-[#125f53]", symbol: "↑" },
  down: { bg: "bg-[#fee7d6]", text: "text-[#bd2a11]", symbol: "↓" },
  stable: { bg: "bg-transparent", text: "text-slate-400", symbol: "Steadily" },
  new: { bg: "bg-transparent", text: "text-slate-400", symbol: "New" },
} as const;

export const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
