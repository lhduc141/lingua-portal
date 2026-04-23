import {
  AssessedLevel,
  CertificationType,
  ExperienceLevel,
  PrimaryGoal,
  SkillName,
  UsageContext,
} from "@/types";

export type SurveyFormData = {
  // Page 1
  primaryGoal: PrimaryGoal | null;
  targetGoal: string;
  targetCertification: CertificationType | null;
  targetScore: string;
  targetDeadlineDate: string;

  // Page 2
  primaryFocusSkills: SkillName[];
  plannedStudyHoursPerWeek: number | null;
  availableDays: string[];

  // Page 3 (formerly page 2 remainder)
  selfAssessedLevel: AssessedLevel | null;
  usageContext: UsageContext | null;
  previousLearningExperience: ExperienceLevel | null;
  difficulties: string[];
  additionalContext: string;
};

export const INITIAL_SURVEY_DATA: SurveyFormData = {
  primaryGoal: null,
  targetGoal: "",
  targetCertification: null,
  targetScore: "",
  targetDeadlineDate: "",

  primaryFocusSkills: [],
  plannedStudyHoursPerWeek: null,
  availableDays: [],

  selfAssessedLevel: null,
  usageContext: null,
  previousLearningExperience: null,
  difficulties: [],
  additionalContext: "",
};