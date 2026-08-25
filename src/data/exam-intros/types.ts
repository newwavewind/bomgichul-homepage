export type ExamIntroLink = {
  label: string;
  href: string;
  /** 외부 공식 사이트면 true */
  external?: boolean;
};

export type ExamIntroSubject = {
  name: string;
  /** 예: 1차, 2차, 공통, 전문 */
  round?: string;
  note?: string;
};

export type ExamIntroTrackItem = {
  label: string;
  blurb?: string;
  /** 해당 직렬·구분에서 보는 전문과목 등 */
  subjects?: string[];
};

export type ExamIntroScheduleItem = {
  label: string;
  date?: string;
  detail?: string;
};

export type ExamIntroSource = {
  label: string;
  href?: string;
  note?: string;
};

export type ExamIntro = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  hubHref: string;
  hubCta: string;
  administrator: {
    name: string;
    description: string;
  };
  /** 직렬·응시 구분 등 (없으면 섹션 생략) */
  tracks?: {
    title: string;
    description?: string;
    groups: { name: string; items: ExamIntroTrackItem[] }[];
  };
  subjects: {
    title: string;
    description?: string;
    groups: { name: string; items: ExamIntroSubject[] }[];
  };
  format: {
    title: string;
    paragraphs: string[];
    bullets?: string[];
  };
  schedule: {
    title: string;
    items: ExamIntroScheduleItem[];
    note: string;
  };
  application: {
    title: string;
    where: string;
    how: string[];
    links: ExamIntroLink[];
  };
  /** 합격 기준 (공고·법령 문구 기준) */
  passingCriteria?: {
    title: string;
    bullets: string[];
  };
  /** 응시수수료 */
  fees?: {
    title: string;
    items: { label: string; amount: string }[];
    note?: string;
  };
  /** 응시자격·결격 요약 */
  eligibility?: {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
  };
  /** 시험 당일 시간표 */
  timetable?: {
    title: string;
    rows: { label: string; detail: string }[];
  };
  officialLinks: ExamIntroLink[];
  /** FAQ·커뮤니티·앱 등 봄기출 내부 링크 */
  relatedLinks?: ExamIntroLink[];
  /** 근거 공고·공식 페이지 */
  sources: ExamIntroSource[];
  /** 공고 대조일 (YYYY-MM-DD) */
  lastVerified: string;
  disclaimer: string;
  seoDescription: string;
};

export const EXAM_INTRO_DISCLAIMER =
  "본 안내는 공식 시행계획·공고를 요약했을 뿐입니다. 일정·수수료·합격 기준·응시자격은 변경될 수 있으니, 원서 접수 전 반드시 해당 기관의 최신 공고문을 확인하세요.";
