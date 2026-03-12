"use client";

import { useState } from "react";
import { Direction } from "node:tty";
import { AnimatePresence, motion } from "framer-motion";
import { SurveyPageOne } from "@/components/shared/survey";
import { INITIAL_SURVEY_DATA, SurveyFormData } from "@/types";

const TOTAL_PAGES = 3;

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function SurveyMainPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState<Direction>(1);

  const [formData, setFormData] = useState<SurveyFormData>(INITIAL_SURVEY_DATA);

  const updateForm = (fields: Partial<SurveyFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSubmit = () => {
    // TODO: gọi API submit survey
    console.log("Submit survey");
  };

  const goNext = () => {
    setDirection(1);
    setCurrentPage((p) => Math.min(p + 1, TOTAL_PAGES));
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentPage((p) => Math.max(p - 1, 1));
  };

  const pages = [
    <SurveyPageOne key="page1" data={formData} onChange={updateForm} />,
    // <SurveyPageSeconds key="page2" data={formData} onChange={updateForm} />,
    // <SurveyPageFinal key="page3" data={formData} onChange={updateForm} />,
  ];

  return (
    <div className="flex h-[95vh] w-[40vw] flex-col items-center justify-between space-y-6 overflow-y-hidden rounded-2xl bg-white p-8 shadow-lg">
      {/* Progress bar */}
      <div className="flex w-full items-center justify-between space-x-2">
        <div className="flex items-center justify-between text-xs uppercase text-[#94A3B8]">
          Step {currentPage} of {TOTAL_PAGES}
        </div>
        <div className="flex justify-between font-serif text-[24px] text-text-main">
          <span>LinguaPanda</span>
        </div>
        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i + 1 === currentPage ? "bg-teal-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slide content */}
      <div className="scrollbar-hide h-full w-full flex-1 overflow-y-scroll">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {pages[currentPage - 1]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex w-full items-center justify-between gap-2">
        {currentPage > 1 && (
          <button
            onClick={goBack}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
          >
            ← Back
          </button>
        )}

        {currentPage < TOTAL_PAGES ? (
          <button
            onClick={goNext}
            className="flex-1 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Complete ✓
          </button>
        )}
      </div>
    </div>
  );
}
