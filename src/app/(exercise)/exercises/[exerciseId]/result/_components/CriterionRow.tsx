import type { CriterionBandItem } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CriterionRowProps {
  criterion: CriterionBandItem;
  isExpanded: boolean;
  onToggle: () => void;
}

export function CriterionRow({ criterion, isExpanded, onToggle }: CriterionRowProps) {
  const isPronunciation = criterion.name === "Pronunciation";

  const bandColor = (band: number | null) => {
    if (band === null) return "text-gray-400";
    if (band >= 7) return "text-green-600";
    if (band >= 5) return "text-yellow-600";
    return "text-red-500";
  };

  return (
    <div className="rounded-lg border border-gray-100 bg-white">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-gray-800">{criterion.name}</span>
          {isPronunciation && (
            <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-semibold text-orange-600">
              Azure
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[18px] font-bold ${bandColor(criterion.bandEstimate)}`}>
            {criterion.bandEstimate !== null && criterion.bandEstimate !== undefined
              ? criterion.bandEstimate.toFixed(1)
              : criterion.name === "Pronunciation"
                ? "N/A"
                : "—"}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          <p className="mb-3 text-[13px] text-gray-600">{criterion.summary}</p>

          {criterion.strengths.length > 0 && (
            <div className="mb-2">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-600">
                Strengths
              </p>
              <ul className="space-y-1">
                {criterion.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-[13px] text-gray-700">
                    <span className="text-green-500">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {criterion.weaknesses.length > 0 && (
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-red-500">
                Weaknesses
              </p>
              <ul className="space-y-1">
                {criterion.weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-2 text-[13px] text-gray-700">
                    <span className="text-red-400">✗</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}