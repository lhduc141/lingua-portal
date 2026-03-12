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
  targetCertification: CertificationType | null;
  targetScore: string;
  targetDeadlineDate: string;

  //Page 2
  primaryFocusSkills: SkillName[];
  plannedStudyHoursPerWeek: number | null;
  selfAssessedLevel: AssessedLevel | null;

  // Page 3
  usageContext: UsageContext | null;
  previousLearningExperience: ExperienceLevel | null;
  difficulties: string[];
  additionalContext: string;
};

export const INITIAL_SURVEY_DATA: SurveyFormData = {
  primaryGoal: null,
  targetCertification: null,
  targetScore: "",
  targetDeadlineDate: "",

  primaryFocusSkills: [],
  plannedStudyHoursPerWeek: null,
  selfAssessedLevel: null,

  usageContext: null,
  previousLearningExperience: null,
  difficulties: [],
  additionalContext: "",
};
