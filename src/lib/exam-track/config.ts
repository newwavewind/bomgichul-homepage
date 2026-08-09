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

export const EXAM_TRACKS = [POLICE_TRACK, HOUSING_TRACK] as const;

export function getTrackByBasePath(pathname: string): ExamTrackConfig | null {
  if (pathname.startsWith("/police")) return POLICE_TRACK;
  if (pathname.startsWith("/housing")) return HOUSING_TRACK;
  return null;
}
