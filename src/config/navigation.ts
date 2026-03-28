import { ROUTES } from "@/config/routes";
import type { LucideIcon } from "lucide-react";
import {
  BarChart2,
  BookMarked,
  BookOpen,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  label: string | null;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: null,
    items: [
      { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      { label: "Learning Plan", href: ROUTES.PLAN, icon: CalendarDays },
    ],
  },
  {
    label: "LEARNING",
    items: [
      { label: "Practice", href: ROUTES.LEARN.PRACTICE, icon: BookOpen },
      { label: "Lessons", href: ROUTES.LEARN.LESSONS, icon: GraduationCap },
    ],
  },
  {
    label: "RESOURCE",
    items: [
      { label: "Progress", href: ROUTES.ASSESSMENT.HISTORY, icon: BarChart2 },
      { label: "Dictionary", href: ROUTES.DICTIONARY.ROOT, icon: BookMarked },
    ],
  },
];

export const BOTTOM_NAV: NavItem = {
  label: "Setting",
  href: ROUTES.PROFILE,
  icon: Settings,
};
