import { SurveyFormData } from "@/types";

import { ASSESSED_LEVEL_OPTIONS, SKILL_OPTIONS } from "@/types/constants/survey.constants";
import { cn } from "@/lib";
import { Slider } from "@/components/ui/slider";

interface SurveyPageSecondsProps {
  data: SurveyFormData;
  onChange: (fields: Partial<SurveyFormData>) => void;
}

export function SurveyPageSeconds({ data, onChange }: SurveyPageSecondsProps) {
  return (
    <section>
      {/*Header */}
      <section className={"pb-8 text-center"}>
        <div className={"font-serif text-[30px] text-text-main"}>Customize your learning</div>
        <div className={"font-sans text-[14px] text-gray-600"}>
          Help us understand your schedule and focus
        </div>
      </section>

      {/*Question Lists*/}
      <section className={"front-sans space-y-8 text-text-main"}>
        {/*Question 4: Primary Focus Skills*/}
        <section className={"space-y-4"}>
          <div className="survey-question-one font-semibold">
            04. Which skills do you want to focus on?
          </div>
          <div className={"flex gap-3"}>
            {SKILL_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = data.primaryFocusSkills.includes(option.value);

              const handleToggle = () => {
                if (isSelected)
                  onChange({
                    primaryFocusSkills: data.primaryFocusSkills.filter((s) => s !== option.value),
                  });
                else onChange({ primaryFocusSkills: [...data.primaryFocusSkills, option.value] });
              };

              return (
                <button
                  key={option.value}
                  onClick={handleToggle}
                  className={cn(
                    "flex items-center space-x-2 rounded-full border px-4 py-1.5 text-left",
                    isSelected
                      ? "border-teal-600 bg-teal-50 font-semibold text-teal-700"
                      : "border-gray-200 hover:border-teal-200"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <div>{option.label}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/*Question 5: Study hours per weeks*/}
        <section className="space-y-4">
          <div className="font-semibold">05. How many hours can you study per week?</div>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Slider
                min={0}
                max={168}
                step={1}
                value={[data.plannedStudyHoursPerWeek ?? 0]}
                onValueChange={([val]) => onChange({ plannedStudyHoursPerWeek: val })}
                className="flex-1"
              />
              <input
                type="number"
                min={0}
                max={168}
                value={data.plannedStudyHoursPerWeek ?? ""}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 0 && val <= 168) {
                    onChange({ plannedStudyHoursPerWeek: val });
                  }
                }}
                placeholder="0"
                className="w-16 rounded-lg border border-gray-200 px-2 py-2 text-center text-sm outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              />
              <span className="text-sm text-gray-400">h / week</span>
            </div>
          </div>
        </section>


        {/*Question 6: Available Days*/}
        <section className={"space-y-4"}>
          <div className="font-semibold">06. Which days are you available to study?</div>
          <div className={"flex gap-2"}>
            {(["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"] as const).map((day) => {
              const isSelected = (data.availableDays ?? []).includes(day);
              return (
                <button
                  key={day.slice(0, 3)}
                  onClick={() => {
                    const current = data.availableDays ?? [];
                    const updated = isSelected
                      ? current.filter((d) => d !== day)
                      : [...current, day];
                    onChange({ availableDays: updated });
                  }}
                  className={cn(
                    "flex-1 rounded-xl border py-2.5 text-[12px] font-semibold transition-all",
                    isSelected
                      ? "border-teal-600 bg-teal-50 text-teal-700"
                      : "border-gray-200 text-gray-500 hover:border-teal-200"
                  )}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>
          <p className="text-[12px] text-gray-400">Rest days will be scheduled on unselected days</p>
        </section>

        {/*Question 7: selfAssessedLevel*/}
        <section className={"space-y-4"}>
          <div className="font-semibold">
            07. How would you rate your current English level?
            <span className="font-normal text-gray-400"> (optional)</span>
          </div>
          <div className={"grid grid-cols-2 gap-4"}>
            {ASSESSED_LEVEL_OPTIONS.map((option) => {
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  onClick={() => onChange({ selfAssessedLevel: option.value })}
                  className={cn(
                    "flex items-center space-x-4 rounded-2xl border p-4",
                    data.selfAssessedLevel === option.value
                      ? "border-teal-600 bg-teal-50 font-semibold text-teal-700"
                      : "border-gray-200 hover:border-teal-200"
                  )}
                >
                  <Icon className="h-8 w-8" />
                  <div className={"text-left"}>
                    <div className={"text-[14px] font-semibold"}>{option.label}</div>
                    <div className={"text-[12px]"}>{option.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </section>
    </section>
  );
}