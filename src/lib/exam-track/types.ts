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
  /** 공무원 영어 — 그 선지 낱말의 뜻 */
  translation?: string;
}

/** 주관식(단답형) 문항의 빈칸 하나 — 지문의 ( ㄱ ) 자리와 그 정답 */
export interface ExamTrackExamBlank {
  label: string;
  answer: string;
  type?: string;
}

/**
 * 한국사능력검정의 「핵심 개념」 카드.
 *
 * 문항마다 한 장씩 붙는 독립 카드다. 다른 시험의 개념(ExamTrackConcept)이 단원 단위로
 * 따로 존재하는 것과 달리, 이쪽은 그 문항이 묻는 것을 그 자리에서 풀어 준다.
 * 블록 유형은 앱과 같다 — p(문단) · stack(카드) · timeline(연표) · compare(대조) · callout(강조).
 * 표(table)는 모바일에서 읽기 어려워 앱에서 이미 걷어냈으므로 여기에도 없다.
 */
export type HistoryConceptBlock =
  | { 유형: "p"; 글: string }
  | { 유형: "callout"; 글: string }
  | { 유형: "timeline"; 사건: { 때: string; 일: string }[] }
  | { 유형: "compare"; 묶음: { 이름: string; 항목: string[] }[] }
  | { 유형: "stack"; 카드: { 이름: string; 행: { 라벨: string; 값: string }[] }[] };

export interface HistoryConceptNote {
  제목: string;
  블록: HistoryConceptBlock[];
}

/** 문항에 딸린 자료 이미지 (한국사 사료·지도·사진) */
export interface ExamTrackMaterial {
  image: string;
  width?: number;
  height?: number;
}

export interface ExamTrackExam {
  id: string;
  year: number;
  sourceCode: string;
  source?: string;
  questionNo: number;
  /** 한국사 — 문항 자료 이미지 */
  material?: ExamTrackMaterial;
  /** 한국사 — 문항별 핵심 개념 카드 */
  concept?: HistoryConceptNote;
  /** 한국사 — 회차·배점 */
  round?: number;
  points?: number;
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
  /**
   * 공무원 영어 전용 — 지문 해석과 그 문항에서 챙길 어휘.
   *
   * 영어 기출에서 이 둘은 곁다리가 아니다. 선지 해설만 읽으면 「왜 답이
   * 이건지」는 알아도 지문이 무슨 말이었는지는 끝내 모른 채 넘어간다.
   */
  translation?: string;
  vocab?: ExamTrackVocabEntry[];
  /** 안내문·도표처럼 글이 아닌 지문을 글로 옮겨 둔 것 */
  passageText?: string;
}

/** 공무원 영어 — 문항에 딸린 어휘 한 항목 */
export interface ExamTrackVocabEntry {
  term: string;
  meaning: string;
  level?: string;
  kind?: string;
  otherMeanings?: string;
  example?: string;
  exampleTranslation?: string;
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
  id: "police" | "housing" | "social_worker" | "history" | "english";
  label: string;
  shortLabel: string;
  basePath: string;
  eyebrow: string;
  hubTitle: string;
  hubDescription: string;
  communityScope: "police" | "housing" | "social_worker" | "history" | "english";
  communityTitle: string;
  sessionEyebrow: string;
  educationalLevel: string;
  aboutName: string;
}
