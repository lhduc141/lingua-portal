import { SurveyFormData } from "@/types";

interface SurveyPageOneProps {
  data: SurveyFormData;
  onChange: (fields: Partial<SurveyFormData>) => void;
}

export function SurveyPageOne({ data, onChange }: SurveyPageOneProps) {
  return <div>Page 1</div>;
}
