import {
  AssessedLevel,
  CertificationType,
  ExperienceLevel,
  PrimaryGoal,
  UsageContext,
} from "@/types/enums/survey.enum";
import { SkillName } from "@/types/enums/skill.enum";
import {
  BookMarked,
  BookOpen,
  Briefcase,
  ClipboardList,
  GraduationCap,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Mic,
  MonitorPlay,
  PenLine,
  Plane,
  School,
  Settings,
  Sprout,
  Trophy,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

export const PRIMARY_GOAL_OPTIONS = [
  { value: PrimaryGoal.COMMUNICATION, label: "Everyday Communication", icon: MessageSquare },
  { value: PrimaryGoal.WORK, label: "Work & Career", icon: Briefcase },
  { value: PrimaryGoal.CERTIFICATE, label: "Certification", icon: Trophy },
  { value: PrimaryGoal.STUDY_ABROAD, label: "Study Abroad", icon: GraduationCap },
  { value: PrimaryGoal.TRAVEL, label: "Travel", icon: Plane },
  { value: PrimaryGoal.OTHER, label: "Other", icon: Settings },
];

export const CERTIFICATION_OPTIONS = [
  { value: CertificationType.IELTS, label: "IELTS" },
  { value: CertificationType.TOEIC, label: "TOEIC" },
  { value: CertificationType.TOEFL, label: "TOEFL" },
  { value: CertificationType.CAMBRIDGE, label: "Cambridge" },
  { value: CertificationType.OTHER, label: "Other" },
];

export const SKILL_OPTIONS = [
  { value: SkillName.READING, label: "Reading", icon: BookOpen },
  { value: SkillName.WRITING, label: "Writing", icon: PenLine },
  { value: SkillName.SPEAKING, label: "Speaking", icon: Mic },
  { value: SkillName.LISTENING, label: "Listening", icon: Headphones },
  { value: SkillName.ALL, label: "All Skills", icon: Zap },
];

export const ASSESSED_LEVEL_OPTIONS = [
  {
    value: AssessedLevel.BEGINNER,
    label: "Beginner",
    desc: "Starting from zero or know basic words.",
    icon: Sprout,
  },
  {
    value: AssessedLevel.ELEMENTARY,
    label: "Elementary",
    desc: "Can form simple sentences for daily use.",
    icon: BookOpen,
  },
  {
    value: AssessedLevel.INTERMEDIATE,
    label: "Intermediate",
    desc: "Comfortable with most conversations.",
    icon: MessageCircle,
  },
  {
    value: AssessedLevel.ADVANCED,
    label: "Advanced",
    desc: "Fluently communicate in professional settings.",
    icon: Zap,
  },
];

export const USAGE_CONTEXT_OPTIONS = [
  { value: UsageContext.WORK_MEETINGS, label: "Work Meetings", icon: Users },
  { value: UsageContext.WORK_EMAILS, label: "Work Emails", icon: Mail },
  { value: UsageContext.ACADEMIC, label: "Academic", icon: GraduationCap },
  { value: UsageContext.CASUAL, label: "Casual / Social", icon: MessageSquare },
  { value: UsageContext.TRAVEL, label: "Travel", icon: MapPin },
  { value: UsageContext.EXAM_PREP, label: "Exam Prep", icon: ClipboardList },
];

export const EXPERIENCE_LEVEL_OPTIONS = [
  { value: ExperienceLevel.NEVER, label: "Never studied", icon: XCircle },
  { value: ExperienceLevel.SCHOOL, label: "School only", icon: School },
  { value: ExperienceLevel.SELF_STUDY, label: "Self-study", icon: BookMarked },
  { value: ExperienceLevel.CLASSES, label: "Took classes", icon: Users },
  { value: ExperienceLevel.ONLINE_COURSES, label: "Online courses", icon: MonitorPlay },
];

export const DIFFICULTY_OPTIONS = [
  "Grammar",
  "Vocabulary",
  "Pronunciation",
  "Listening",
  "Writing",
  "Speaking",
];
