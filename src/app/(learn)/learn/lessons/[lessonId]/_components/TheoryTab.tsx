import type { TheoryContent } from "@/types/dto/learn";

interface TheoryTabProps {
  theoryContent: TheoryContent | null;
}

export function TheoryTab({ theoryContent }: TheoryTabProps) {
  if (!theoryContent || theoryContent.sections.length === 0) {
    return <div className="py-12 text-center text-slate-400">No theory content available.</div>;
  }

  return (
    <div className="flex flex-col gap-10">
      {theoryContent.sections.map((section, idx) => (
        <div key={idx} className="flex flex-col gap-4">
          {/* Section heading */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50">
              <span className="text-[12px] font-bold text-teal-600">
                {String(idx + 1).padStart(2, "0")}
              </span>
            </div>
            <h2 className="font-serif text-[24px] text-gray-900">{section.heading}</h2>
          </div>

          {/* Section content — render theo type */}
          {section.type === "rule" && (
            <p className="max-w-3xl text-[16px] leading-relaxed text-slate-600">
              {section.content}
            </p>
          )}

          {section.type === "example" && (
            <div className="rounded-lg border-l-4 border-teal-500 bg-slate-50 px-5 py-4">
              <p className="text-[15px] leading-relaxed text-slate-700">{section.content}</p>
            </div>
          )}

          {section.type === "tip" && (
            <div className="rounded-lg bg-amber-50 px-5 py-4">
              <p className="text-[15px] leading-relaxed text-amber-800">
                <span className="font-bold">💡 Tip: </span>
                {section.content}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Bottom CTA */}
      <div className="relative overflow-hidden rounded-xl bg-teal-600 p-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-[30px] text-white">Ready to practice?</h3>
            <p className="mt-2 text-[18px] text-white/80">
              Test your knowledge with the lesson quiz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
