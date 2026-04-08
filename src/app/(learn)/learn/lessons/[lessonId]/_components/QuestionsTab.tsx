import type { QuestionItemDto } from "@/types/dto/learn";

interface QuestionsTabProps {
  questions: QuestionItemDto[];
}

const TYPE_LABEL: Record<string, string> = {
  mcq_single: "Multiple Choice",
  mcq_multi: "Multiple Select",
  fill_blank: "Fill in the Blank",
  essay: "Essay",
  speaking: "Speaking",
};

export function QuestionsTab({ questions }: QuestionsTabProps) {
  if (questions.length === 0) {
    return <div className="py-12 text-center text-slate-400">No questions available.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {questions.map((q, idx) => (
        <div
          key={q.questionId}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-[12px] font-bold text-teal-600">
                {idx + 1}
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase text-slate-500">
                {TYPE_LABEL[q.type] ?? q.type}
              </span>
            </div>
            <span className="text-[12px] text-slate-400">{q.maxScore} pts</span>
          </div>

          {/* Passage nếu có */}
          {q.passage && (
            <div className="mb-4 rounded-lg bg-slate-50 p-4 text-[14px] leading-relaxed text-slate-600">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                {q.passage.title}
              </p>
              <p className="line-clamp-3">{q.passage.content}</p>
            </div>
          )}

          {/* Stem */}
          {q.stemText && (
            <p className="mb-4 text-[16px] leading-relaxed text-gray-800">{q.stemText}</p>
          )}

          {/* Options — chỉ hiện với mcq */}
          {q.options.length > 0 && (
            <div className="flex flex-col gap-2">
              {q.options.map((opt, oi) => (
                <div
                  key={opt.optionId}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-slate-50 px-4 py-2.5 text-[14px] text-slate-700"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[11px] font-bold text-slate-400">
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt.optionText ?? "—"}
                </div>
              ))}
            </div>
          )}

          {/* Essay / Speaking / Fill blank placeholder */}
          {(q.type === "essay" || q.type === "speaking" || q.type === "fill_blank") &&
            q.options.length === 0 && (
              <div className="rounded-lg border border-dashed border-gray-200 bg-slate-50 px-4 py-3 text-[13px] italic text-slate-400">
                {q.type === "essay" && "Write your answer here..."}
                {q.type === "speaking" && "Record your spoken answer..."}
                {q.type === "fill_blank" && "Fill in the blank..."}
              </div>
            )}
        </div>
      ))}
    </div>
  );
}
