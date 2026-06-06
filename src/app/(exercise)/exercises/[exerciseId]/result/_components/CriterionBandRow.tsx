"use client";

import type { CriterionBandItem } from "@/types";
import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, XCircle } from "lucide-react";
import { SubCriteriaList } from "@/app/(exercise)/exercises/[exerciseId]/result/_components/SubCriteriaList";

function getBandColor(band: number | null): string {
  if (band === null) return "text-slate-400";
  if (band >= 7) return "text-green-600";
  if (band >= 5) return "text-amber-500";
  return "text-red-500";
}

export function CriterionBandRow({ criterion }: { criterion: CriterionBandItem }) {
  const [expanded, setExpanded] = useState(false);
  const band = criterion.bandEstimate;

  return (
    <div className="rounded-lg border border-slate-100 bg-white p-4">
      <button
        className="flex w-full items-start justify-between gap-3 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">{criterion.name}</span>
            <div className="flex items-center gap-2">
              {band !== null && (
                <span className={`font-mono text-sm font-bold ${getBandColor(band)}`}>
                  {band.toFixed(1)}
                </span>
              )}
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </div>
          </div>
          {expanded && <p className="text-xs text-slate-500">{criterion.summary}</p>}
        </div>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {(criterion.strengths ?? []).length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                Strengths
              </p>
              {criterion.strengths.map((s, i) => (
                <p key={i} className="flex gap-1.5 text-xs text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                  {s}
                </p>
              ))}
            </div>
          )}
          {(criterion.weaknesses ?? []).length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-500">
                Weaknesses
              </p>
              {criterion.weaknesses.map((w, i) => (
                <p key={i} className="flex gap-1.5 text-xs text-slate-600">
                  <XCircle className="mt-0.5 h-3 w-3 shrink-0 text-red-400" />
                  {w}
                </p>
              ))}
            </div>
          )}
          {(criterion.subCriteria ?? []).length > 0 && (
            <SubCriteriaList subCriteria={criterion.subCriteria ?? []} />
          )}
        </div>
      )}
    </div>
  );
}
