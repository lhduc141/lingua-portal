import { BookOpen, Mic, PenLine } from 'lucide-react';

export const SKILL_STYLE: Record<string, { bar: string; badge: string; icon: React.ReactNode }> = {
  reading: { bar: 'bg-teal-600', badge: 'bg-teal-50 text-teal-700', icon: <BookOpen className="h-3 w-3" /> },
  writing: { bar: 'bg-violet-600', badge: 'bg-violet-50 text-violet-700', icon: <PenLine className="h-3 w-3" /> },
  speaking: { bar: 'bg-vermilion-500', badge: 'bg-vermilion-50 text-vermilion-500', icon: <Mic className="h-3 w-3" /> },
};