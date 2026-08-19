import type { ExamTrackConfig } from "./types";

export const POLICE_TRACK: ExamTrackConfig = {
  id: "police",
  label: "경찰공무원",
  shortLabel: "경찰",
  basePath: "/police",
  eyebrow: "봄기출 · 경찰공무원",
  hubTitle: "경찰공무원 기출 학습의 모든 것",
  hubDescription:
    "순경 공채 헌법·형사법·경찰학 기출을 회차별로 확인하세요. 웹에서는 개념과 공개 기출 중심으로 제공하고, 포켓 오디오·회독 관리 등 전체 기능은 앱에서 제공합니다.",
  communityScope: "police",
  communityTitle: "경찰공무원 수험생 커뮤니티",
  sessionEyebrow: "순경 공채 기출",
  educationalLevel: "경찰공무원 순경 공채",
  aboutName: "경찰공무원 순경 공개채용 필기시험",
};

export const HOUSING_TRACK: ExamTrackConfig = {
  id: "housing",
  label: "주택관리사",
  shortLabel: "주택관리사",
  basePath: "/housing",
  eyebrow: "봄기출 · 주택관리사",
  hubTitle: "주택관리사 기출 학습의 모든 것",
  hubDescription:
    "주택관리사보 1·2차 전 과목 기출을 회차별로 확인하세요. 웹에서는 개념과 공개 기출 중심으로 제공하고, 앱의 학습 모드·오디오 등은 웹에 복제하지 않습니다.",
  communityScope: "housing",
  communityTitle: "주택관리사 수험생 커뮤니티",
  sessionEyebrow: "주택관리사보 기출",
  educationalLevel: "주택관리사보",
  aboutName: "주택관리사보 1·2차 시험",
};

export const SOCIAL_WORKER_TRACK: ExamTrackConfig = {
  id: "social_worker",
  label: "사회복지사 1급",
  shortLabel: "사회복지사",
  basePath: "/social-worker",
  eyebrow: "봄기출 · 사회복지사 1급",
  hubTitle: "사회복지사 1급 기출 학습의 모든 것",
  hubDescription:
    "사회복지사 1급 8개 영역의 10개년 기출과 핵심 개념을 과목별·회차별로 학습하세요.",
  communityScope: "social_worker",
  communityTitle: "사회복지사 1급 수험생 커뮤니티",
  sessionEyebrow: "사회복지사 1급 국가시험 기출",
  educationalLevel: "사회복지사 1급 국가시험",
  aboutName: "사회복지사 1급 국가시험",
};

export const HISTORY_TRACK: ExamTrackConfig = {
  id: "history",
  label: "한국사능력검정",
  shortLabel: "한국사",
  basePath: "/history",
  eyebrow: "봄기출 · 한국사능력검정",
  hubTitle: "한국사능력검정 기출 학습의 모든 것",
  hubDescription:
    "심화 최근 5회차 250문항을 선지마다 해설과 함께 봅니다. 문항마다 그 시대를 통째로 정리한 핵심 개념 카드가 붙어 있어, 문제를 풀고 바로 개념을 굳힐 수 있습니다.",
  communityScope: "history",
  communityTitle: "한국사능력검정 수험생 커뮤니티",
  sessionEyebrow: "한국사능력검정 심화 기출",
  educationalLevel: "한국사능력검정시험 심화",
  aboutName: "한국사능력검정시험 심화",
};

/*
 * 9급 영어는 공무원 트랙 안의 한 과목으로 넣을 수도 있었다(그 트랙은 이미
 * 2017~2026년 국가직·지방직 구조를 똑같이 쓴다). 별도 트랙으로 세운 것은
 * 앱이 「봄기출 공무원영어」라는 독립 상품으로 나가 있기 때문이다.
 */
export const ENGLISH_TRACK: ExamTrackConfig = {
  id: "english",
  label: "공무원 영어",
  shortLabel: "영어",
  basePath: "/english",
  eyebrow: "봄기출 · 공무원 영어",
  hubTitle: "9급 공무원 영어 기출 학습의 모든 것",
  hubDescription:
    "국가직·지방직 9급 영어 기출을 2017년부터 2026년까지, 20회차 400문항 담았습니다. 선지마다 왜 맞고 틀리는지 적었고, 지문 해석과 그 문항에서 챙길 어휘를 함께 봅니다.",
  communityScope: "english",
  communityTitle: "공무원 영어 수험생 커뮤니티",
  sessionEyebrow: "9급 공무원 영어 기출",
  educationalLevel: "9급 공무원 공개경쟁채용시험 영어",
  aboutName: "9급 공무원 공개경쟁채용시험 영어",
};

export const EXAM_TRACKS = [
  POLICE_TRACK,
  HOUSING_TRACK,
  SOCIAL_WORKER_TRACK,
  HISTORY_TRACK,
  ENGLISH_TRACK,
] as const;

export function getTrackByBasePath(pathname: string): ExamTrackConfig | null {
  if (pathname.startsWith("/police")) return POLICE_TRACK;
  if (pathname.startsWith("/housing")) return HOUSING_TRACK;
  if (pathname.startsWith("/social-worker")) return SOCIAL_WORKER_TRACK;
  if (pathname.startsWith("/history")) return HISTORY_TRACK;
  if (pathname.startsWith("/english")) return ENGLISH_TRACK;
  return null;
}
