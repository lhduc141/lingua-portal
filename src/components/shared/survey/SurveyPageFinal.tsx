"use client";

import { SurveyFormData } from "@/types";

import {
  DIFFICULTY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  USAGE_CONTEXT_OPTIONS,
} from "@/types/constants/survey.constants";
import { cn } from "@/lib";
import { Textarea } from "@/components/ui/textarea";

interface SurveyPageFinalProps {
  data: SurveyFormData;
  onChange: (fields: Partial<SurveyFormData>) => void;
}

export function SurveyPageFinal({ data, onChange }: SurveyPageFinalProps) {
  return (
    <section>
      {/*Header */}
      <section className={"space-y-2 pb-8 text-center"}>
        <div className={"font-serif text-[30px] text-text-main"}>A few more details</div>
        <div className={"font-sans text-[14px] text-gray-600"}>
          Almost done! These help us fine-tune your plan
        </div>
        <div className={"font-sans text-[14px] text-gray-400"}>
          All questions on this page are optional
        </div>
      </section>

      {/*Question Lists*/}
      <section className={"front-sans space-y-8 text-text-main"}>
        {/*Question 7: Where do you mainly use English? */}
        <section className={"space-y-4"}>
          <div className="survey-question-one font-semibold">
            07. Where do you mainly use English?
          </div>
          <div className={"grid grid-cols-2 gap-3"}>
            {USAGE_CONTEXT_OPTIONS.map((option) => {
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  onClick={() => onChange({ usageContext: option.value })}
                  className={cn(
                    "flex space-x-2 rounded-lg border py-4 pl-4 text-left",
                    data.usageContext === option.value
                      ? "border-teal-600 bg-teal-50 font-semibold text-teal-700"
                      : "border-gray-200 hover:border-teal-200"
                  )}
                >
                  <Icon />
                  <div>{option.label}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/*Question 8: Previous English Learning*/}
        <section className={"space-y-4"}>
          <div className="font-semibold">08. What's your previous English learning experience?</div>
          <div className={"flex flex-col gap-2"}>
            {EXPERIENCE_LEVEL_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onChange({ previousLearningExperience: option.value })}
                className={cn(
                  "rounded-xl border p-4 text-left text-sm",
                  data.previousLearningExperience === option.value
                    ? "border-teal-600 bg-teal-50 font-semibold text-teal-700"
                    : "border-gray-200 hover:border-teal-200"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {/*Question 8: Most Challenging*/}
        <section className={"space-y-4"}>
          <div className="font-semibold">
            09. What do you find most challenging?
            <span className="font-normal text-gray-400">(optional)</span>
          </div>
          <div className={"flex flex-wrap gap-3"}>
            {DIFFICULTY_OPTIONS.map((option: string) => {
              const isSelected = data.difficulties.includes(option);

              const handleToggle = () => {
                if (isSelected)
                  onChange({
                    difficulties: data.difficulties.filter((s) => s !== option),
                  });
                else onChange({ difficulties: [...data.difficulties, option] });
              };

              return (
                <button
                  key={option}
                  onClick={handleToggle}
                  className={cn(
                    "flex items-center space-x-2 rounded-full border px-4 py-1.5 text-left",
                    isSelected
                      ? "border-teal-600 bg-teal-50 font-semibold text-teal-700"
                      : "border-gray-200 hover:border-teal-200"
                  )}
                >
                  <div>{option}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/*Question 10: Additional Context*/}
        <section className={"space-y-4"}>
          <div className="font-semibold">
            10. Anything else you'd like us to know?{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </div>
          <Textarea
            value={data.additionalContext}
            onChange={(e) => onChange({ additionalContext: e.target.value })}
            placeholder="Tell us more..."
            rows={4}
            className="resize-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
          />
        </section>
      </section>
    </section>
  );
}
