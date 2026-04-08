interface LearnStatsBarProps {
  count: number;
  label: string;
}

export function LearnStatsBar({ count, label }: LearnStatsBarProps) {
  if (count === 0) return null;

  return (
    <div className="mb-4 flex items-center gap-6 rounded-xl border border-gray-200 bg-slate-50 px-6 py-3 text-[14px] text-slate-500">
      <span>
        Showing {count} {label}
      </span>
    </div>
  );
}
