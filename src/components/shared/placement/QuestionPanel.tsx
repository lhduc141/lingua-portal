import { cn } from "@/lib";
import { PlacementQuestionDto } from "@/types";

// Đặt bên ngoài PlacementTestView, trong cùng file
interface QuestionPanelProps {
  currentQuestion: PlacementQuestionDto;
  questionOrder: number;
  selectedOptionId: string | null;
  showError: boolean;
  isSubmitting: boolean;
  onOptionClick: (optionId: string) => void;
  onConfirm: () => void;
}

export function QuestionPanel({
  currentQuestion,
  questionOrder,
  selectedOptionId,
  showError,
  isSubmitting,
  onOptionClick,
  onConfirm,
}: QuestionPanelProps) {
  return (
    <div className="h-full border border-gray-100 bg-white p-6 shadow-sm">
      <p className="mb-2 w-fit rounded-lg bg-teal-50 px-[10px] py-[4px] text-[10px] font-semibold text-teal-700">
        Question {questionOrder}
      </p>
      <p className="mb-4 text-base font-semibold text-gray-900">
        {currentQuestion.content.stemText}
      </p>

      <div className="space-y-3">
        {currentQuestion.options.map((opt, i) => (
          <button
            key={opt.optionId}
            onClick={() => onOptionClick(opt.optionId)}
            disabled={isSubmitting}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all",
              opt.optionId === selectedOptionId
                ? "border-teal-600 bg-teal-50"
                : "border-gray-100 hover:border-teal-200 hover:bg-gray-50"
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                opt.optionId === selectedOptionId
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              {["A", "B", "C", "D"][i]}
            </span>
            <span className="text-sm">{opt.text}</span>
          </button>
        ))}
      </div>

      {showError && (
        <p className="mt-3 text-sm text-red-500">Please select an answer before continuing.</p>
      )}

      <button
        onClick={onConfirm}
        disabled={isSubmitting}
        className={cn(
          "mt-6 w-full rounded-xl py-3 text-sm font-semibold transition-colors",
          selectedOptionId && !isSubmitting
            ? "bg-teal-600 text-white hover:bg-teal-700"
            : "bg-gray-100 text-gray-400"
        )}
      >
        {isSubmitting ? "Submitting..." : "Confirm Answer →"}
      </button>
    </div>
  );
}
