import {
  AssessedLevel,
  CertificationType,
  ExperienceLevel,
  PrimaryGoal,
  UsageContext,
} from "@/types/enums/survey.enum";
import { SkillName } from "@/types/enums/skill.enum";

export const PRIMARY_GOAL_OPTIONS = [
  { value: PrimaryGoal.COMMUNICATION, label: "Everyday Communication", icon: "🗣" },
  { value: PrimaryGoal.WORK, label: "Work & Career", icon: "💼" },
  { value: PrimaryGoal.CERTIFICATE, label: "Certification", icon: "🏆" },
  { value: PrimaryGoal.STUDY_ABROAD, label: "Study Abroad", icon: "🎓" },
  { value: PrimaryGoal.TRAVEL, label: "Travel", icon: "✈️" },
  { value: PrimaryGoal.OTHER, label: "Other", icon: "⚙️" },
];

export const CERTIFICATION_OPTIONS = [
  { value: CertificationType.IELTS, label: "IELTS" },
  { value: CertificationType.TOEIC, label: "TOEIC" },
  { value: CertificationType.TOEFL, label: "TOEFL" },
  { value: CertificationType.CAMBRIDGE, label: "Cambridge" },
  { value: CertificationType.OTHER, label: "Other" },
];

export const SKILL_OPTIONS = [
  { value: SkillName.READING, label: "Reading", icon: "📖" },
  { value: SkillName.WRITING, label: "Writing", icon: "✍️" },
  { value: SkillName.SPEAKING, label: "Speaking", icon: "🎤" },
  { value: SkillName.ALL, label: "All Skills", icon: "⚡" },
];

export const STUDY_HOURS_OPTIONS = [
  { value: 2, label: "1–2h / week" },
  { value: 4, label: "3–5h / week" },
  { value: 7, label: "6–10h / week" },
  { value: 14, label: "10h+ / week" },
];

export const ASSESSED_LEVEL_OPTIONS = [
  { value: AssessedLevel.BEGINNER, label: "Beginner", desc: "Biết rất ít", icon: "🌱" },
  { value: AssessedLevel.ELEMENTARY, label: "Elementary", desc: "Cơ bản", icon: "📗" },
  { value: AssessedLevel.INTERMEDIATE, label: "Intermediate", desc: "Giao tiếp được", icon: "📘" },
  { value: AssessedLevel.ADVANCED, label: "Advanced", desc: "Khá thành thạo", icon: "📙" },
];

export const USAGE_CONTEXT_OPTIONS = [
  { value: UsageContext.WORK_MEETINGS, label: "Work Meetings", icon: "💼" },
  { value: UsageContext.WORK_EMAILS, label: "Work Emails", icon: "📧" },
  { value: UsageContext.ACADEMIC, label: "Academic", icon: "🎓" },
  { value: UsageContext.CASUAL, label: "Casual / Social", icon: "💬" },
  { value: UsageContext.TRAVEL, label: "Travel", icon: "✈️" },
  { value: UsageContext.EXAM_PREP, label: "Exam Prep", icon: "📝" },
];

export const EXPERIENCE_LEVEL_OPTIONS = [
  { value: ExperienceLevel.NEVER, label: "Never studied", icon: "❌" },
  { value: ExperienceLevel.SCHOOL, label: "School only", icon: "🏫" },
  { value: ExperienceLevel.SELF_STUDY, label: "Self-study", icon: "📚" },
  { value: ExperienceLevel.CLASSES, label: "Took classes", icon: "👨‍🏫" },
  { value: ExperienceLevel.ONLINE_COURSES, label: "Online courses", icon: "💻" },
];

export const DIFFICULTY_OPTIONS = [
  "Grammar",
  "Vocabulary",
  "Pronunciation",
  "Listening",
  "Writing",
  "Speaking",
];
