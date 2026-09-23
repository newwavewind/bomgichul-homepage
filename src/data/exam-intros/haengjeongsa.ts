import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

export const haengjeongsaIntro: ExamIntro = {
  id: "haengjeongsa",
  eyebrow: "국가전문자격",
  title: "행정사 시험 안내",
  summary:
    "행정사 자격시험 1차(객관식) 민법·행정법·행정학개론 기출을 앱과 같이 제공합니다. 원서·일정은 Q-Net 공고를 확인하세요.",
  hubHref: "/haengjeongsa",
  hubCta: "행정사 학습 시작",
  lastVerified: "2026-09-23",
  disclaimer: EXAM_INTRO_DISCLAIMER,
  administrator: {
    name: "한국산업인력공단 (Q-Net)",
    description: "행정사 자격시험의 시행·접수는 큐넷(Q-Net) 공고를 따릅니다.",
  },
  tracks: {
    title: "시험 구성",
    groups: [
      {
        name: "차수",
        items: [
          { label: "1차", blurb: "객관식 · 민법·행정법·행정학개론" },
          { label: "2차", blurb: "주관식 · 웹 OX 트랙에서는 1차만 제공" },
        ],
      },
    ],
  },
  subjects: {
    title: "1차 과목",
    groups: [
      {
        name: "필기",
        items: [
          { name: "민법", round: "1차", note: "총칙 관련" },
          { name: "행정법", round: "1차", note: "기출 OX · 해설" },
          { name: "행정학개론", round: "1차", note: "지방자치행정 포함" },
        ],
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "1차는 객관식입니다. 회차별 문항 수·배점은 해당 연도 공고를 확인하세요.",
    ],
    bullets: [
      "봄기출 웹은 1차 객관식 기출·해설을 제공합니다.",
      "2차는 주관식이라 확정답안이 없어 이번 웹 트랙에는 싣지 않았습니다.",
    ],
  },
  timetable: {
    title: "시험 시간",
    rows: [{ label: "1차", detail: "해당 회차 Q-Net 공고의 시험시간표를 확인하세요." }],
  },
  schedule: {
    title: "시험 일정",
    items: [
      {
        label: "회차별 일정",
        detail: "Q-Net 행정사 자격시험 공고에서 원서·필기·합격 발표일을 확인하세요.",
      },
    ],
    note: "미확정 일정은 홈 카운트다운에 넣지 않습니다. 최신 공고를 기준으로 하세요.",
  },
  application: {
    title: "원서 접수",
    where: "Q-Net (한국산업인력공단)",
    how: [
      "Q-Net에서 행정사 자격시험 공고를 확인합니다.",
      "온라인으로 원서를 제출하고 응시료를 납부합니다.",
    ],
    links: [{ label: "Q-Net", href: "https://www.q-net.or.kr/", external: true }],
  },
  officialLinks: [
    { label: "Q-Net", href: "https://www.q-net.or.kr/", external: true },
  ],
  relatedLinks: [
    { label: "FAQ", href: "/haengjeongsa/faq" },
    { label: "커뮤니티", href: "/haengjeongsa/community" },
  ],
  sources: [
    {
      label: "Q-Net 행정사 자격시험",
      href: "https://www.q-net.or.kr/",
      note: "원서·일정·합격 기준은 해당 회차 공고를 확인하세요.",
    },
  ],
  seoDescription:
    "행정사 1차 민법·행정법·행정학개론 시험 안내와 기출 학습. 봄기출 행정사.",
};
