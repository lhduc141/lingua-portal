import { Zap } from "lucide-react";

interface EmptyPlanProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

export function EmptyPlan({ onGenerate, isGenerating }: EmptyPlanProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-xl border border-dashed border-teal-200 bg-teal-50/40 py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
        <Zap className="h-8 w-8 text-teal-600" />
      </div>
      <div className="text-center">
        <h3 className="font-serif text-[24px] text-gray-900">No Plan Yet</h3>
        <p className="mt-1 text-[14px] text-slate-500">
          Generate your personalized AI learning plan to get started.
        </p>
      </div>
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-3 text-[14px] font-bold text-white hover:bg-teal-700 disabled:opacity-60"
      >
        <Zap className="h-4 w-4" />
        {isGenerating ? "Generating..." : "Generate My Plan"}
      </button>
    </div>
  );
}
