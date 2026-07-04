import type { PostCategory } from "@/types/database";

export const SITE_NAME = "봄기출";
export const SITE_URL = "https://www.bomgichul.com";
/** 핵심 슬로건 */
export const SITE_TAGLINE = "질문은 봄기출이 작성합니다.";
/** 커뮤니티 아이덴티티 */
export const SITE_IDENTITY = "공인중개사 커뮤니티";
/** 플랫폼 포지셔닝 */
export const SITE_PLATFORM = "공인중개사 AI 학습 플랫폼";
/** 전체 브랜딩 문구 */
export const SITE_BRAND_LINE = `${SITE_NAME} | ${SITE_IDENTITY} | ${SITE_TAGLINE}`;
/** SEO / Open Graph / Twitter 기본 제목 */
export const SITE_TITLE = "봄기출 | 공인중개사 커뮤니티";
export const SITE_DESCRIPTION =
  "공인중개사 수험생을 위한 커뮤니티. 기출자료 공유, 수험일기, AI 학습, 정보 교류를 한 곳에서.";


export const GA_MEASUREMENT_ID = "G-ET80RLKKXQ";

/** 앱 스토어 링크 (ox-quiz-app 기준) */
export const APP_LINKS = {
  /** Google Play — 봄기출 공인중개사 */
  android:
    "https://play.google.com/store/apps/details?id=com.sanghyun.civillaw",
  /** App Store — 봄기출 공인중개사 */
  ios: "https://apps.apple.com/kr/app/id6784651251",
} as const;

export const POSTS_PER_PAGE = 10;

export const CATEGORIES: {
  value: PostCategory | "all";
  label: string;
  description: string;
}[] = [
  { value: "all", label: "전체", description: "모든 게시글" },
  { value: "question", label: "질문", description: "공부 관련 질문" },
  { value: "resource", label: "자료공유", description: "기출, 노트, 팁 공유" },
  { value: "chat", label: "수다", description: "자유로운 수험생 수다" },
  { value: "info", label: "수험정보", description: "시험 일정, 합격 후기 등" },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.filter((c) => c.value !== "all").map((c) => [c.value, c.label])
) as Record<PostCategory, string>;

/** 봄기출 앱 실제 기능 (ox-quiz-app 기준) */
export const APP_FEATURES = [
  {
    title: "AI 질문 작성",
    description:
      "막힌 문항의 지문·보기·해설을 분석해 ChatGPT·Gemini·Claude에 바로 물을 질문을 자동으로 만듭니다. 질문은 봄기출이 작성합니다.",
    icon: "✨",
    tag: "AI",
  },
  {
    title: "기출 O/X 학습",
    description:
      "연도별·목차별로 기출 O/X를 풀며 진도를 관리하세요. 실제 시험지 문장으로 빠르게 반복 학습합니다.",
    icon: "📚",
    tag: "학습",
  },
  {
    title: "시험 모드",
    description:
      "기출문제 일괄 채점, 출제 빈도 반영 랜덤 5~40문항으로 실전처럼 연습할 수 있어요.",
    icon: "📝",
    tag: "시험",
  },
  {
    title: "개념카드",
    description:
      "10년치 기출 해설에서 뽑은 주제별 O/X 카드. 시험이 반복해서 묻는 쟁점만 압축해 암기하세요.",
    icon: "🃏",
    tag: "개념카드",
  },
  {
    title: "빈칸 채우기",
    description:
      "핵심 용어와 문장을 빈칸으로 채우며 암기합니다. 연도별·목차별로 선택해 학습할 수 있어요.",
    icon: "✏️",
    tag: "학습",
  },
  {
    title: "출제 통계",
    description:
      "PART·장·소분류별 출제 빈도, 연도별 히트맵, TOP 10 토픽. 약한 단원을 탭하면 바로 학습으로 이동합니다.",
    icon: "📊",
    tag: "통계",
  },
  {
    title: "암기노트 · 용어집",
    description:
      "학습 중 메모한 암기노트와 과목별 용어집을 한곳에서 확인하세요. 헷갈리는 용어를 빠르게 찾을 수 있어요.",
    icon: "📖",
    tag: "암기노트",
  },
  {
    title: "다과목 지원",
    description:
      "부동산학개론, 민법, 공인중개사법 등 1·2차 과목을 선택해 학습. 과목별 기출과 커리큘럼이 준비되어 있어요.",
    icon: "🎯",
    tag: "과목",
  },
];

/** 앱 학습 모드 요약 */
export const STUDY_MODES = [
  { label: "연도별 기출", description: "2016~2025년 기출 O/X" },
  { label: "목차별 학습", description: "편·장·소분류 커리큘럼" },
  { label: "랜덤 시험", description: "출제 빈도 반영 5~40문항" },
  { label: "빈칸 채우기", description: "핵심 문장 암기" },
];

/** 지원 과목 */
export const SUBJECTS = [
  { name: "부동산학개론", round: "1차", status: "available" as const },
  { name: "민법 및 민사특별법", round: "1차", status: "available" as const },
  { name: "공인중개사법령 및 실무", round: "2차", status: "available" as const },
  { name: "부동산공시법령", round: "2차", status: "available" as const },
  { name: "부동산세법", round: "2차", status: "available" as const },
  { name: "부동산공법", round: "2차", status: "available" as const },
];

export const STATS = [
  { label: "지원 과목", value: "6" },
  { label: "기출 연도", value: "10년+" },
  { label: "학습 모드", value: "5가지" },
];

export const HIGHLIGHTS = [
  { label: "AI 질문", value: "자동 작성" },
  { label: "기출 O/X", value: "연도·목차별" },
  { label: "개념카드", value: "주제별" },
];

export const TESTIMONIALS = [
  {
    quote:
      "출제 통계에서 자주 나오는 장만 골라 학습하니 효율이 확 올랐어요. 랜덤 시험도 실전 같아요.",
    author: "공시생 김○○",
    rating: 5,
  },
  {
    quote:
      "개념카드로 X 패턴만 반복하니 민법 O/X가 훨씬 빨라졌습니다. 빈칸 채우기도 암기에 좋아요.",
    author: "1차 합격 박○○",
    rating: 5,
  },
  {
    quote:
      "앱에서 풀다 막히면 커뮤니티에 질문하고, 다른 수험생 팁도 많이 얻고 있어요.",
    author: "2차 준비 이○○",
    rating: 5,
  },
];

export const FAQ_ITEMS = [
  {
    question: "「질문은 봄기출이 작성합니다」는 무슨 뜻인가요?",
    answer:
      "AI는 답을 잘하지만, 무엇을 물어야 할지 모르는 순간이 있습니다. 봄기출은 기출을 풀다 막히면 지문·보기·해설을 바탕으로 ChatGPT·Gemini·Claude에 바로 붙여 넣을 수 있는 질문을 자동으로 만들어 줍니다. AI 수험생 학습 플랫폼으로서, 이해하는 공부에 집중하도록 설계했습니다.",
  },
  {
    question: "봄기출은 어떤 시험을 준비할 수 있나요?",
    answer:
      "공인중개사 1차(부동산학개론, 민법 및 민사특별법)와 2차(공인중개사법령 및 실무, 부동산공시법령, 부동산세법, 부동산공법) 전 과목을 지원합니다.",
  },
  {
    question: "앱에서 어떤 방식으로 공부하나요?",
    answer:
      "연도별·목차별 O/X 학습, 빈칸 채우기, 시험 모드(기출·랜덤), 개념카드, 출제 통계, 암기노트, 용어집을 제공합니다. 하단 탭에서 학습·개념카드·시험·암기노트·용어집으로 이동할 수 있어요.",
  },
  {
    question: "개념카드는 일반 요약과 뭐가 다른가요?",
    answer:
      "10년치 기출 해설을 분석해 「시험이 실제로 묻는 쟁점」 단위로 O/X 선지를 주제별로 모았습니다. 교재 목차가 아니라 출제 패턴 기준으로 정리된 카드입니다.",
  },
  {
    question: "커뮤니티는 어떻게 이용하나요?",
    answer:
      "홈페이지 커뮤니티에서 질문, 수다, 수험정보 카테고리로 글을 작성할 수 있습니다. 기출 PDF·노트·요약 자료는 자료실에서 등록하고 다운로드할 수 있어요. 게시글은 누구나 볼 수 있고, 글쓰기·댓글·자료 업로드는 로그인 후 이용 가능합니다.",
  },
  {
    question: "자료실에는 어떤 자료를 올릴 수 있나요?",
    answer:
      "기출, 노트, 요약 등 수험에 도움이 되는 PDF·이미지·문서·CSV·MP4 파일을 과목별로 올릴 수 있습니다. 일반 파일은 최대 20MB, MP4는 최대 100MB, 게시글당 5개까지 첨부 가능합니다.",
  },
  {
    question: "앱은 어디서 다운로드하나요?",
    answer:
      "iOS App Store와 Google Play에서 「봄기출 공인중개사」를 검색해 설치할 수 있습니다. 일부 과목·연도는 무료로 이용 가능하며, 전체 기출은 과목별 프리미엄으로 잠금 해제할 수 있습니다.",
  },
];

export const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const NAV_LINKS = [
  { href: "/", label: "홈" },
  { href: "/community", label: "커뮤니티" },
  { href: "/archive", label: "자료실" },
  { href: "/diary", label: "수험일기" },
  { href: "/#faq", label: "FAQ" },
];

/** 공인중개사 시험 일정 (한국산업인력공단·Q-Net 공고 기준) */
export const BROKER_EXAM_SCHEDULE = [
  {
    round: 37,
    year: 2026,
    label: "2026년 제37회",
    examDate: "2026-10-31",
    registrationStart: "2026-08-03",
    registrationEnd: "2026-08-07",
    resultDate: "2026-12-02",
    note: "1·2차 동시 시행 · 1차 09:30 / 2차 13:00·15:30",
  },
] as const;

export const DIARY_MOODS = [
  { value: "great", label: "최고", emoji: "🔥" },
  { value: "good", label: "좋음", emoji: "😊" },
  { value: "okay", label: "보통", emoji: "😐" },
  { value: "tired", label: "피곤", emoji: "😴" },
  { value: "hard", label: "힘듦", emoji: "😓" },
] as const;

export type DiaryMood = (typeof DIARY_MOODS)[number]["value"];

export const DIARY_MOOD_MAP = Object.fromEntries(
  DIARY_MOODS.map((m) => [m.value, m.label])
) as Record<DiaryMood, string>;

export const ARCHIVE_RESOURCE_TYPES = [
  { value: "all", label: "전체" },
  { value: "past_exam", label: "기출" },
  { value: "note", label: "노트" },
  { value: "summary", label: "요약" },
  { value: "other", label: "기타" },
] as const;

export type ArchiveResourceType = (typeof ARCHIVE_RESOURCE_TYPES)[number]["value"];

export const ARCHIVE_SUBJECTS = [
  { value: "all", label: "전체 과목" },
  { value: "realestate", label: "부동산학개론" },
  { value: "civillaw", label: "민법" },
  { value: "broker-law", label: "공인중개사법" },
  { value: "registry-law", label: "부동산공시법" },
  { value: "realestate-tax", label: "부동산세법" },
  { value: "realestate-public-law", label: "부동산공법" },
  { value: "other", label: "기타" },
] as const;

export type ArchiveSubject = (typeof ARCHIVE_SUBJECTS)[number]["value"];

export const ARCHIVE_RESOURCE_TYPE_MAP: Record<string, string> = {
  past_exam: "기출",
  note: "노트",
  summary: "요약",
  other: "기타",
};

export const ARCHIVE_SUBJECT_MAP: Record<string, string> = Object.fromEntries(
  ARCHIVE_SUBJECTS.filter((s) => s.value !== "all").map((s) => [s.value, s.label])
);

export const MAX_FILE_SIZE_MB = 20;
/** MP4만 별도 용량 제한 */
export const MAX_MP4_FILE_SIZE_MB = 100;
export const MAX_FILES_PER_POST = 5;
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "text/plain",
  "text/csv",
  "application/csv",
  "application/hwp",
  "application/x-hwp",
  "video/mp4",
];
