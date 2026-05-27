interface ScoreBarProps {
  label: string;
  value: number;
}

const accuracyColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-500";
};

export function ScoreBar({ label, value }: ScoreBarProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-orange-700">{label}</p>
        <p className={`text-[12px] font-semibold ${accuracyColor(value)}`}>{value}%</p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-orange-200">
        <div
          className={`h-full rounded-full ${
            value >= 80 ? "bg-green-500" : value >= 60 ? "bg-yellow-500" : "bg-red-400"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
