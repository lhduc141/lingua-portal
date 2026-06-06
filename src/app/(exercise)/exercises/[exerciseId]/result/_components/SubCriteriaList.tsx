import type { SubCriterionItem } from "@/types";

function getBandColor(score: number | null): string {
  if (score === null) return "text-slate-400";
  if (score >= 7) return "text-green-600";
  if (score >= 5) return "text-amber-500";
  return "text-red-500";
}

export function SubCriteriaList({ subCriteria }: { subCriteria: SubCriterionItem[] }) {
  return (
    <div className="mt-3 space-y-3 border-t pt-3">
      {subCriteria.map((sub, idx) => (
        <div key={sub.name ?? idx} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">{sub.name}</span>
            <span className={`text-xs font-semibold ${getBandColor(sub.score)}`}>
              {sub.score.toFixed(1)}/10
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${
                sub.score >= 7 ? "bg-green-500" : sub.score >= 5 ? "bg-amber-500" : "bg-red-500"
              }`}
              style={{ width: `${(sub.score / 10) * 100}%` }}
            />
          </div>
          {(sub.evidence ?? []).length > 0 && (
            <p className="rounded bg-slate-50 px-2 py-1 text-xs italic text-slate-500">
              &quot;{sub.evidence[0]}&quot;
            </p>
          )}
          <p className="text-xs text-slate-500">{sub.diagnosis}</p>
          <p className="text-xs font-medium text-teal-700">→ {sub.howToImprove}</p>
        </div>
      ))}
    </div>
  );
}
