export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export const SKILL_NAMES = ['reading', 'writing', 'speaking'] as const;

export const QUESTION_TYPES = {
    MCQ_SINGLE: 'mcq_single',
    MCQ_MULTI: 'mcq_multi',
    FILL_BLANK: 'fill_blank',
    ESSAY: 'essay',
    SPEAKING: 'speaking',
} as const;