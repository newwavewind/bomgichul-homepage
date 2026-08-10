/** 앱 taxonomy 레지스트리의 단원 하나 — 지문의 taxonomy_unit_id 가 가리키는 곳 */
export interface ExamTrackTaxonomyUnit {
  unitId: string;
  category: string;
  subcategory: string;
}

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
  taxonomy_unit_id?: string;
}

/** 주관식(단답형) 문항의 빈칸 하나 — 지문의 ( ㄱ ) 자리와 그 정답 */
export interface ExamTrackExamBlank {
  label: string;
  answer: string;
  type?: string;
}

export interface ExamTrackExam {
  id: string;
  year: number;
  sourceCode: string;
  source?: string;
  questionNo: number;
  /** 주택관리사 2차는 객관식(objective)과 단답형 주관식(subjective)이 한 회차에 섞여 있다. */
  kind?: "objective" | "subjective";
  /** 주관식 전용 — 객관식의 stem/items 자리를 대신한다 */
  prompt?: string;
  passage?: string;
  blanks?: ExamTrackExamBlank[];
  explanation?: string;
  legalSources?: string[];
  /** 객관식 전용. 주관식 레코드에는 없다. */
  stem?: string;
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
  /** 공무원 트랙만 보유. 지문의 taxonomy_unit_id 를 단원으로 해석하는 표. */
  taxonomyUnits?: ExamTrackTaxonomyUnit[];
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
