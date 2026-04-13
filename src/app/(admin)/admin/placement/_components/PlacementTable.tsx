import { cn } from "@/lib";
import type { AdminPlacementSessionDto } from "@/types/dto/admin";
import Image from "next/image";

const CEFR_BADGE: Record<string, string> = {
  A1: "bg-gray-100 text-gray-600",
  A2: "bg-green-50 text-green-700",
  B1: "bg-teal-50 text-teal-700",
  B2: "bg-blue-50 text-blue-700",
  C1: "bg-purple-50 text-purple-700",
};

interface PlacementTableProps {
  sessions: AdminPlacementSessionDto[];
}

export function PlacementTable({ sessions }: PlacementTableProps) {
  const formatDate = (d: string | null) =>
    d
      ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "—";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b border-gray-100 bg-gray-50">
          <tr>
            {["User", "CEFR", "θ (Theta)", "Confidence", "Questions", "Correct", "Date"].map(
              (h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sessions.map((s) => (
            <tr key={s.sessionId} className="hover:bg-gray-50">
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  {s.user.googleAvatarUrl ? (
                    <Image
                      src={s.user.googleAvatarUrl}
                      alt={s.user.googleName ?? ""}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-[11px] font-bold text-teal-700">
                      {(s.user.googleName ?? s.user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-[13px] text-gray-800">
                    {s.user.googleName ?? s.user.email}
                  </span>
                </div>
              </td>
              <td className="px-5 py-3">
                {s.cefrLevel ? (
                  <span
                    className={cn(
                      "rounded-md px-2 py-1 text-[11px] font-bold",
                      CEFR_BADGE[s.cefrLevel] ?? "bg-gray-100 text-gray-600"
                    )}
                  >
                    {s.cefrLevel}
                  </span>
                ) : (
                  <span className="text-[12px] text-slate-300">—</span>
                )}
              </td>
              <td className="px-5 py-3 font-mono text-[13px] text-gray-700">
                {s.finalTheta !== null ? s.finalTheta.toFixed(2) : "—"}
              </td>
              <td className="px-5 py-3">
                {s.confidence !== null ? (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-teal-500"
                        style={{ width: `${Math.round(s.confidence * 100)}%` }}
                      />
                    </div>
                    <span className="text-[12px] text-slate-500">
                      {Math.round(s.confidence * 100)}%
                    </span>
                  </div>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-5 py-3 text-[13px] text-slate-600">
                {s.currentQuestion}/{s.totalQuestions}
              </td>
              <td className="px-5 py-3">
                <span className="text-[13px] font-semibold text-green-600">{s.correctCount}</span>
                <span className="text-[13px] text-slate-400">
                  {" "}
                  / {s.correctCount + s.incorrectCount}
                </span>
              </td>
              <td className="px-5 py-3 text-[13px] text-slate-500">
                {formatDate(s.completedAt ?? s.startedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sessions.length === 0 && (
        <div className="py-12 text-center text-[14px] text-slate-400">
          No placement sessions found
        </div>
      )}
    </div>
  );
}
