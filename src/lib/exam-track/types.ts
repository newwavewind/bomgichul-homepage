export interface ExamTrackConcept {
  slug: string;
  chapterKo?: string;
  sectionKo?: string;
  category: string;
  subcategory: string;
  titleKo: string;
  titleEn?: string;
  definition: string;
  intuition?: string;
  keyPoints?: string[];
  pitfalls?: string;
  example?: string;
  pitfallCards?: { wrong: string; correct: string }[];
  questionRefs?: { examId?: string; year: number; sourceCode?: string; questionNo: number }[];
}

export interface ExamTrackExamItem {
  key: string;
  label?: string;
  text: string;
  answer?: "O" | "X" | string;
  explanation?: string;
}

export interface ExamTrackExam {
  id: string;
  year: number;
  sourceCode: string;
  source?: string;
  questionNo: number;
  stem: string;
  questionType?: string;
  correctChoice?: number;
  category?: string;
  subcategory?: string;
  explanationTopic?: string;
  explanationSummary?: string;
  items: ExamTrackExamItem[];
  comboChoices?: unknown[];
}

export interface ExamTrackSubjectContent {
  subject: { id: string; label: string; track: string };
  years: number[];
  sources: string[];
  concepts: ExamTrackConcept[];
  exams: ExamTrackExam[];
}

export interface ExamTrackManifestItem {
  id: string;
  label: string;
  track: string;
  conceptCount: number;
  examCount: number;
  years?: number[];
  sources?: string[];
}

export interface ExamTrackConfig {
  id: "police" | "housing";
  label: string;
  shortLabel: string;
  basePath: string;
  eyebrow: string;
  hubTitle: string;
  hubDescription: string;
  communityScope: "police" | "housing";
  communityTitle: string;
  sessionEyebrow: string;
  educationalLevel: string;
  aboutName: string;
}
