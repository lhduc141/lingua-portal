import type { CorrectionItem } from "@/types";

type AnnotatedSegment = {
  text: string;
  correction?: CorrectionItem;
};

function buildAnnotatedSegments(
  text: string,
  corrections: CorrectionItem[],
): AnnotatedSegment[] {
  const segments: AnnotatedSegment[] = [];
  let processed = 0;

  const placed: { start: number; end: number }[] = [];
  const validCorrections = corrections
    .filter((c) => c.original && text.includes(c.original))
    .sort((a, b) => text.indexOf(a.original) - text.indexOf(b.original))
    .filter((c) => {
      const start = text.indexOf(c.original);
      const end = start + c.original.length;
      const overlaps = placed.some((p) => start < p.end && end > p.start);
      if (!overlaps) {
        placed.push({ start, end });
        return true;
      }
      return false;
    });

  for (const correction of validCorrections) {
    const idx = text.indexOf(correction.original, processed);
    if (idx === -1 || idx < processed) continue;
    if (idx > processed) {
      segments.push({ text: text.slice(processed, idx) });
    }
    segments.push({ text: correction.original, correction });
    processed = idx + correction.original.length;
  }
  if (processed < text.length) {
    segments.push({ text: text.slice(processed) });
  }
  return segments;
}

export function AnnotatedEssay({
                                 text,
                                 corrections,
                               }: {
  text: string;
  corrections: CorrectionItem[];
}) {
  const segments = buildAnnotatedSegments(text, corrections);

  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
      {segments.map((seg, idx) =>
        seg.correction ? (
          <span key={idx} className="group relative inline">
            <span className="text-red-500 line-through">{seg.correction.original}</span>
            <span className="ml-1 font-semibold text-green-600">
              {seg.correction.corrected}
            </span>
          </span>
        ) : (
          <span key={idx}>{seg.text}</span>
        ),
      )}
    </p>
  );
}