import { cn } from "@/lib";

interface OnboardingFunnelProps {
  funnel: {
    totalUsers: number;
    surveyDone: number;
    placementDone: number;
  };
}

export function OnboardingFunnel({ funnel }: OnboardingFunnelProps) {
  const steps = [
    { label: "Registered", count: funnel.totalUsers, pct: 100, color: "bg-teal-500" },
    {
      label: "Survey Done",
      count: funnel.surveyDone,
      pct: funnel.totalUsers > 0 ? Math.round((funnel.surveyDone / funnel.totalUsers) * 100) : 0,
      color: "bg-blue-500",
    },
    {
      label: "Placement Done",
      count: funnel.placementDone,
      pct: funnel.totalUsers > 0 ? Math.round((funnel.placementDone / funnel.totalUsers) * 100) : 0,
      color: "bg-violet-500",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-1 font-serif text-[18px] text-gray-900">Onboarding Funnel</h3>
      <p className="mb-5 text-[12px] text-slate-400">Dropout rate at each onboarding step</p>
      <div className="space-y-4">
        {steps.map((s) => (
          <div key={s.label}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[13px] font-medium text-gray-700">{s.label}</span>
              <span className="text-[13px] font-bold text-gray-900">
                {s.count} <span className="font-normal text-slate-400">({s.pct}%)</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={cn("h-full rounded-full transition-all duration-700", s.color)}
                style={{ width: `${s.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
