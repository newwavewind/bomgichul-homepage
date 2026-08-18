import type { PostCategory } from "@/types/database";

export const SITE_NAME = "봄기출";
export const SITE_URL = "https://www.bomgichul.com";
/** 핵심 슬로건 */
export const SITE_TAGLINE = "질문은 봄기출이 작성합니다.";
/** 커뮤니티 아이덴티티 */
export const SITE_IDENTITY = "수험생 커뮤니티";
/** 플랫폼 포지셔닝 */
export const SITE_PLATFORM = "기출 AI 학습 플랫폼";
/** 전체 브랜딩 문구 */
export const SITE_BRAND_LINE = `${SITE_NAME} | ${SITE_IDENTITY} | ${SITE_TAGLINE}`;
/** SEO / Open Graph / Twitter 기본 제목 */
export const SITE_TITLE = "봄기출 | 종합 기출 학습 플랫폼";
export const SITE_DESCRIPTION =
  "공무원·공인중개사·경찰·주택관리사·사회복지사 1급·한국사능력검정 종합 기출 학습 플랫폼. 시험별 기출문제와 핵심 개념, 수험생 커뮤니티를 한곳에서.";


export const GA_MEASUREMENT_ID = "G-ET80RLKKXQ";

/** 앱 스토어 링크 — 공인중개사(기본) */
export const APP_LINKS = {
  /** Google Play — 봄기출 공인중개사 */
  android:
    "https://play.google.com/store/apps/details?id=com.sanghyun.civillaw",
  /** App Store — 봄기출 공인중개사 */
  ios: "https://apps.apple.com/kr/app/id6784651251",
} as const;

/** null 은 「아직 그 스토어에 없음」 — 화면에서는 「출시 예정」으로 보인다. */
export type AppStoreLinks = {
  android: string | null;
  ios: string | null;
};

/**
 * 시험별 스토어 링크.
 *
 * 2026-08-18 기준 실제 등록 상태를 그대로 적었다(App Store 는 iTunes lookup,
 * Google Play 는 스토어 페이지 응답으로 확인).
 *   · App Store — 5개 전부 출시
 *   · Google Play — 공인중개사·공무원만 출시. 경찰·주택관리사·사회복지사는 404.
 *   · 한국사 — 아직 앱 자체가 스토어에 없다.
 * 없는 곳을 링크로 걸면 사용자가 눌렀을 때 「찾을 수 없는 페이지」로 떨어지므로
 * null 로 두어 「출시 예정」이 보이게 한다. 스토어에 올라가면 여기만 채우면 된다.
 */
export function appStoreLinksForScope(
  scope: "real_estate" | "public_service" | "police" | "housing" | "social_worker" | "history",
): AppStoreLinks {
  switch (scope) {
    case "police":
      return {
        android: null,
        ios: "https://apps.apple.com/kr/app/id6798675892",
      };
    case "public_service":
      return {
        android:
          "https://play.google.com/store/apps/details?id=com.sanghyun.publicofficial",
        ios: "https://apps.apple.com/kr/app/id6790764010",
      };
    case "housing":
      return {
        android: null,
        ios: "https://apps.apple.com/kr/app/id6799456199",
      };
    case "social_worker":
      return {
        android: null,
        ios: "https://apps.apple.com/kr/app/id6801141200",
      };
    // 한국사 앱은 아직 어느 스토어에도 없다(2026-08-19 확인). 출시하면 여기만 채우면 된다.
    case "history":
      return { android: null, ios: null };
    default:
      return { android: APP_LINKS.android, ios: APP_LINKS.ios };
  }
}

export const POSTS_PER_PAGE = 10;

export const CATEGORIES: {
  value: PostCategory | "all";
  label: string;
  description: string;
}[] = [
  { value: "all", label: "전체", description: "모든 게시글" },
  { value: "free", label: "자유게시판", description: "주제 제한 없이 자유롭게" },
  { value: "question", label: "질문", description: "공부 관련 질문" },
  { value: "resource", label: "자료공유", description: "기출, 노트, 팁 공유" },
  { value: "info", label: "수험정보", description: "시험 일정, 공고 등" },
  { value: "law_update", label: "법령정보", description: "시험 관련 법령·제도 개정 소식" },
  { value: "review", label: "합격후기", description: "합격 수기, 공부법 공유" },
  { value: "bug", label: "오류신고", description: "앱 문항·기능 오류 제보" },
  { value: "feedback", label: "피드백", description: "앱 개선 의견" },
];

/** 웹에서 직접 작성 가능한 카테고리 (앱 전용 제외) */
export const USER_WRITABLE_CATEGORIES = CATEGORIES.filter(
  (c) => c.value !== "all" && c.value !== "bug" && c.value !== "feedback"
);

/** 앱 전용 카테고리 (오류신고·피드백) — 게시판에서는 낮은 우선순위로 노출 */
export const APP_ONLY_CATEGORIES = CATEGORIES.filter(
  (c) => c.value === "bug" || c.value === "feedback"
);

/** 카테고리별 배지 색상 (Tailwind 클래스, 정적 문자열이어야 JIT가 인식함) */
export const CATEGORY_BADGE_CLASS: Record<PostCategory, string> = {
  question: "bg-iris/10 text-iris",
  resource: "bg-leaf/10 text-leaf",
  chat: "bg-magenta/10 text-magenta",
  free: "bg-burnt/10 text-burnt",
  info: "bg-electric-blue/10 text-electric-blue",
  law_update: "bg-coral/10 text-coral",
  review: "bg-amber/10 text-amber",
  bug: "bg-mist text-fog",
  feedback: "bg-mist text-fog",
};

/** 베스트 글 최소 조회수 (이상이면 베스트 탭에 노출) */
export const BEST_POST_MIN_VIEWS = 2;

/** 베스트 글에 포함되는 카테고리 (앱 전용 제외) */
export const BEST_BOARD_CATEGORIES: PostCategory[] = [
  "question",
  "resource",
  "free",
  "info",
  "law_update",
  "review",
  "chat",
];

/** 카테고리별 강조 이모지 (있는 것만) */
export const CATEGORY_EMOJI: Partial<Record<PostCategory, string>> = {
  review: "🏆",
  law_update: "⚖️",
};

export const CATEGORY_MAP = {
  ...Object.fromEntries(
    CATEGORIES.filter((c) => c.value !== "all").map((c) => [c.value, c.label])
  ),
  chat: "자유게시판",
} as Record<PostCategory, string>;

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
  { label: "학습 모드", value: "4가지" },
];

export const HIGHLIGHTS = [
  { label: "AI 질문", value: "자동 작성" },
  { label: "기출 O/X", value: "연도·목차별" },
  { label: "개념카드", value: "주제별" },
];

export const FAQ_ITEMS = [
  {
    question: "홈페이지에서 가장 먼저 뭘 하면 되나요?",
    answer:
      "학습 홈(/)에서 「기출 올인원」이나 「기출문제」 중 한 과목을 고르면 됩니다. 로그인 없이도 무료 범위까지 바로 볼 수 있어요.",
  },
  {
    question: "기출 올인원과 기출문제는 어떻게 다른가요?",
    answer:
      "기출 올인원은 주제(개념) 단위로 정리·학습맵·기출 지문을 보는 곳이고, 기출문제는 연도·문항 단위로 O/X를 푸는 곳입니다. 같은 과목을 두 방식으로 이어 공부할 수 있어요.",
  },
  {
    question: "무엇을 무료로 쓸 수 있나요?",
    answer:
      "홈페이지는 전부 무료입니다. 6과목 기출 전 연도 해설, 기출 올인원 개념, 랜덤·오답노트·복습·시험 모드, 북마크, 복습 PDF를 모두 쓸 수 있어요. 커뮤니티·자료실·뉴스 읽기는 로그인 없이도 가능합니다.",
  },
  {
    question: "로그인하면 뭐가 달라지나요?",
    answer:
      "커뮤니티·자료실 글쓰기와, 북마크·풀이 기록·오답 저장처럼 기록이 남는 기능, 알림을 쓸 수 있어요. Google 계정만 있으면 됩니다.",
  },
  {
    question: "돈을 내야 하는 건 뭔가요?",
    answer:
      "홈페이지에서는 없습니다. 과목을 구매해야 하는 것은 PC앱(app.bomgichul.com)과 「봄기출 공인중개사」 모바일 앱(App Store·Google Play)뿐이에요.",
  },
  {
    question: "PC앱은 뭐고 주소는 어디인가요?",
    answer:
      "큰 화면용 학습 앱입니다. https://app.bomgichul.com 으로 들어가며, 모바일 앱에서 구매한 과목을 코드로 등록해 이용합니다.",
  },
  {
    question: "AI 질문 버튼은 무엇을 하나요?",
    answer:
      "기출 문항의 지문·보기·해설을 바탕으로 ChatGPT·Gemini·Claude에 바로 물어볼 문장을 만들어 줍니다. AI에게 ‘뭘 물어봐야 할지’를 대신 정리해 주는 기능이에요.",
  },
  {
    question: "커뮤니티와 자료실의 차이는요?",
    answer:
      "커뮤니티는 글·댓글로 질문과 정보를 나누는 게시판이고, 자료실은 PDF·노트·요약 같은 파일을 올리거나 받는 공간입니다. 둘 다 읽기는 열려 있고, 작성·업로드는 로그인이 필요합니다.",
  },
];
export const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

/** 봄기출 PC앱 (ox-quiz-app 웹 배포) */
export const PC_APP_URL = "https://app.bomgichul.com";
export const PUBLIC_SERVICE_PC_APP_URL = "https://ox-admin-quiz-app.vercel.app";

export type NavChildLink = { href: string; label: string };

export type NavGroupLink = {
  label: string;
  href?: string;
  children: NavChildLink[];
};

export type NavLinkItem = NavChildLink | NavGroupLink;

export function isNavGroup(link: NavLinkItem): link is NavGroupLink {
  return "children" in link;
}

export function navGroupKey(link: NavGroupLink): string {
  return link.href ?? link.label;
}

export function flattenNavLinks(links: NavLinkItem[]): NavChildLink[] {
  return links.flatMap((link) =>
    isNavGroup(link)
      ? [
          ...(link.href ? [{ href: link.href, label: link.label }] : []),
          ...link.children,
        ]
      : [link]
  );
}

export const NAV_LINKS: NavLinkItem[] = [
  { href: "/", label: "시험 선택" },
  {
    label: "학습",
    children: [
      { href: "/public-service", label: "공무원" },
      { href: "/real-estate", label: "공인중개사" },
      { href: "/police", label: "경찰공무원" },
      { href: "/housing", label: "주택관리사" },
      { href: "/social-worker", label: "사회복지사 1급" },
    ],
  },
  {
    href: "/community",
    label: "커뮤니티",
    children: [
      { href: "/community", label: "게시판" },
      { href: "/community?category=law_update", label: "법령정보" },
      { href: "/archive", label: "자료실" },
      { href: "/faq", label: "FAQ" },
      { href: "/ranks", label: "바다 레벨" },
      { href: "/news", label: "뉴스" },
    ],
  },
  { href: PC_APP_URL, label: "공인중개사 PC앱" },
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

export const ARCHIVE_SUBJECTS_POLICE = [
  { value: "all", label: "전체 과목" },
  { value: "constitution", label: "헌법" },
  { value: "criminal-law", label: "형사법" },
  { value: "police-science", label: "경찰학" },
  { value: "other", label: "기타" },
] as const;

export const ARCHIVE_SUBJECTS_HOUSING = [
  { value: "all", label: "전체 과목" },
  { value: "accounting", label: "회계원리" },
  { value: "facilities", label: "공동주택시설개론" },
  { value: "civil-law", label: "민법" },
  { value: "housing-law", label: "주택관리관계법규" },
  { value: "housing-admin", label: "공동주택관리실무" },
  { value: "other", label: "기타" },
] as const;

export const ARCHIVE_SUBJECTS_PUBLIC_SERVICE = [
  { value: "all", label: "전체 과목" },
  { value: "hangjunghak", label: "행정학개론" },
  { value: "haengjeongbeop", label: "행정법총론" },
  { value: "hyeongbeop", label: "형법" },
  { value: "hyeongso", label: "형사소송법" },
  { value: "sebeop", label: "세법개론" },
  { value: "bokji", label: "사회복지학개론" },
  { value: "sobang", label: "소방학개론" },
  { value: "other", label: "기타" },
] as const;

export const ARCHIVE_SUBJECTS_SOCIAL_WORKER = [
  { value: "all", label: "전체 과목" },
  { value: "human-behavior", label: "인간행동과 사회환경" },
  { value: "research", label: "사회복지조사론" },
  { value: "practice", label: "사회복지실천론" },
  { value: "practice-skills", label: "사회복지실천기술론" },
  { value: "community", label: "지역사회복지론" },
  { value: "policy", label: "사회복지정책론" },
  { value: "administration", label: "사회복지행정론" },
  { value: "law", label: "사회복지법제론" },
  { value: "other", label: "기타" },
] as const;

export const ARCHIVE_RESOURCE_TYPE_MAP: Record<string, string> = {
  past_exam: "기출",
  note: "노트",
  summary: "요약",
  other: "기타",
};

export const ARCHIVE_SUBJECT_MAP: Record<string, string> = Object.fromEntries([
  ...ARCHIVE_SUBJECTS.filter((s) => s.value !== "all").map((s) => [s.value, s.label]),
  ...ARCHIVE_SUBJECTS_POLICE.filter((s) => s.value !== "all").map((s) => [s.value, s.label]),
  ...ARCHIVE_SUBJECTS_HOUSING.filter((s) => s.value !== "all").map((s) => [s.value, s.label]),
  ...ARCHIVE_SUBJECTS_PUBLIC_SERVICE.filter((s) => s.value !== "all").map((s) => [s.value, s.label]),
  ...ARCHIVE_SUBJECTS_SOCIAL_WORKER.filter((s) => s.value !== "all").map((s) => [s.value, s.label]),
]);

export function archiveSubjectsForScope(scope: string) {
  switch (scope) {
    case "police":
      return [...ARCHIVE_SUBJECTS_POLICE];
    case "housing":
      return [...ARCHIVE_SUBJECTS_HOUSING];
    case "public_service":
      return [...ARCHIVE_SUBJECTS_PUBLIC_SERVICE];
    case "social_worker":
      return [...ARCHIVE_SUBJECTS_SOCIAL_WORKER];
    default:
      return [...ARCHIVE_SUBJECTS];
  }
}

export function defaultArchiveSubject(scope: string) {
  switch (scope) {
    case "police":
      return "constitution";
    case "housing":
      return "accounting";
    case "public_service":
      return "hangjunghak";
    case "social_worker":
      return "human-behavior";
    default:
      return "realestate";
  }
}

/** 기출문제 해설 페이지(/exam)에서 다루는 실제 시험 과목 — ARCHIVE_SUBJECTS 중 "all"/"other" 제외 */
export const EXAM_SUBJECTS = ARCHIVE_SUBJECTS.filter(
  (s) => s.value !== "all" && s.value !== "other"
) as { value: Exclude<ArchiveSubject, "all" | "other">; label: string }[];

/** 과목별 랜딩 페이지(/subjects/[subject]) 소개 문구 */
export const SUBJECT_LANDING_INFO: Record<
  Exclude<ArchiveSubject, "all">,
  { round: "1차" | "2차"; description: string }
> = {
  realestate: {
    round: "1차",
    description:
      "부동산학개론 기출 O/X와 자료를 연도별·목차별로 모아뒀습니다. 부동산 시장론·정책론·투자론까지 한 번에 학습하세요.",
  },
  civillaw: {
    round: "1차",
    description:
      "민법 및 민사특별법 기출 O/X와 판례 요약. 의사표시·대리·물권변동 등 자주 출제되는 쟁점 위주로 정리했습니다.",
  },
  "broker-law": {
    round: "2차",
    description:
      "공인중개사법령 및 실무 기출과 자료. 중개계약·중개보수·행정처분 등 실무 관련 조문을 집중적으로 학습하세요.",
  },
  "registry-law": {
    round: "2차",
    description: "부동산공시법령(부동산등기법·공간정보관리법) 기출 O/X와 자료를 모아뒀습니다.",
  },
  "realestate-tax": {
    round: "2차",
    description: "부동산세법 기출 O/X와 자료. 취득세·재산세·양도소득세 등 세목별로 정리했습니다.",
  },
  "realestate-public-law": {
    round: "2차",
    description:
      "부동산공법(국토계획법·도시개발법 등) 기출 O/X와 자료를 목차별로 확인하세요.",
  },
  other: {
    round: "2차",
    description: "기타 공인중개사 수험 자료를 모아뒀습니다.",
  },
};

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
