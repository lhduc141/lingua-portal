"use client";

import { SurveyFormData } from "@/types";

import { CERTIFICATION_OPTIONS, PRIMARY_GOAL_OPTIONS } from "@/types/constants/survey.constants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib";
import { useState } from "react";

interface SurveyPageOneProps {
  data: SurveyFormData;
  onChange: (fields: Partial<SurveyFormData>) => void;
}

export function SurveyPageOne({ data, onChange }: SurveyPageOneProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <section>
      {/*Header */}
      <section className={"pb-8 text-center"}>
        <div className={"font-serif text-[30px] text-text-main"}>Tell us about your goals</div>
        <div className={"font-sans text-[14px] text-gray-600"}>
          This helps our AI build your perfect plan
        </div>
      </section>

      {/*Question Lists*/}
      <section className={"front-sans space-y-8 text-text-main"}>
        {/*Question 1: Primary Goals*/}
        <section className={"space-y-4"}>
          <div className="survey-question-one font-semibold">
            01. What is your primary goal for learning English?
          </div>
          <div className={"grid grid-cols-2 gap-3"}>
            {PRIMARY_GOAL_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onChange({ primaryGoal: option.value })}
                className={cn(
                  "rounded-lg border py-4 pl-4 text-left",
                  data.primaryGoal === option.value
                    ? "border-teal-600 bg-teal-50 font-semibold text-teal-700"
                    : "border-gray-200 hover:border-teal-200"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>


        {/*Question 2: Target Goal*/}
        <section className={"space-y-4"}>
          <div className="font-semibold">
            02. What is your specific learning goal?{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </div>
          <input
            type="text"
            value={data.targetGoal ?? ""}
            onChange={(e) => onChange({ targetGoal: e.target.value })}
            placeholder="e.g. IELTS 7.0, pass job interview, travel abroad..."
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
          />
        </section>

        {/*Question 3: Target Certification*/}
        <section className={"space-y-4"}>
          <div className="font-semibold">03. Which certification are you targeting?</div>
          <div className={"flex flex-wrap gap-2"}>
            {CERTIFICATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onChange({ targetCertification: option.value })}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm",
                  data.targetCertification === option.value
                    ? "border-teal-600 bg-teal-50 font-semibold text-teal-700"
                    : "border-gray-200 hover:border-teal-200"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={data.targetScore}
            onChange={(e) => onChange({ targetScore: e.target.value })}
            placeholder="Target score (optional)"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
          />
        </section>

        {/*Question 3: Target Deadline*/}
        <section className={"space-y-4"}>
          <div className="font-semibold">
            04. When is your target deadline?{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </div>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg border px-4 py-3 text-sm",
                  data.targetDeadlineDate ? "text-gray-900" : "text-gray-400",
                  "border-gray-200 hover:border-teal-600 focus:outline-none"
                )}
              >
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                {data.targetDeadlineDate
                  ? format(new Date(data.targetDeadlineDate), "dd/MM/yyyy")
                  : "Pick a date"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.targetDeadlineDate ? new Date(data.targetDeadlineDate) : undefined}
                onSelect={(date) => {
                  onChange({
                    targetDeadlineDate: date ? format(date, "yyyy-MM-dd") : "",
                  });
                  setCalendarOpen(false);
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </section>
      </section>
    </section>
  );
}