"use client";

import { motion } from "framer-motion";
import { BookOpen, CalendarDays, CheckCircle2 } from "lucide-react";

interface LearnStatsBarProps {
  total: number;
  completed: number;
  inPlan: number;
}

export function LearnStatsBar({ total, completed, inPlan }: LearnStatsBarProps) {
  if (total === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-4 rounded-xl border border-teal-100 bg-teal-50/60 px-5 py-3 text-[13px]"
    >
      <span className="flex items-center gap-1.5 text-slate-600">
        <BookOpen className="h-3.5 w-3.5 text-slate-400" />
        Showing <strong className="text-gray-800">{total}</strong> lessons
      </span>

      {completed > 0 && (
        <>
          <span className="text-teal-200">•</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-1.5 font-medium text-green-700"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            <strong>{completed}</strong> completed
          </motion.span>
        </>
      )}

      {inPlan > 0 && (
        <>
          <span className="text-teal-200">•</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-1.5 font-medium text-teal-700"
          >
            <CalendarDays className="h-3.5 w-3.5 text-teal-500" />
            <strong>{inPlan}</strong> in your plan this week
          </motion.span>
        </>
      )}
    </motion.div>
  );
}
