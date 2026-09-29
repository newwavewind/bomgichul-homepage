import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

export const nomusaIntro: ExamIntro = {
  id: "nomusa",
  eyebrow: "국가전문자격",
  title: "공인노무사 시험 안내",
  summary:
    "공인노무사 국가자격시험 1차(객관식) 노동법(1)·노동법(2)·민법·사회보험법·경영학개론·경제학원론 기출을 앱과 같이 제공합니다. 원서·일정은 Q-Net 공고를 확인하세요.",
  hubHref: "/nomusa",
  hubCta: "공인노무사 학습 시작",
  lastVerified: "2026-09-29",
  disclaimer: EXAM_INTRO_DISCLAIMER,
  administrator: {
    name: "한국산업인력공단 (Q-Net)",
    description: "공인노무사 자격시험의 시행·접수는 큐넷(Q-Net) 공고를 따릅니다.",
  },
  tracks: {
    title: "시험 구성",
    groups: [
      {
        name: "차수",
        items: [
          { label: "1차", blurb: "객관식 5지선다" },
          { label: "2차", blurb: "논술 · 웹 OX 트랙에서는 1차만 제공" },
          { label: "3차", blurb: "면접" },
        ],
      },
    ],
  },
  subjects: {
    title: "1차 과목",
    groups: [
      {
        name: "필수",
        items: [
          { name: "노동법(1)", round: "1차", note: "필수" },
          { name: "노동법(2)", round: "1차", note: "필수" },
          { name: "민법", round: "1차", note: "필수" },
          { name: "사회보험법", round: "1차", note: "필수" },
        ],
      },
      {
        name: "선택 (1)",
        items: [
          { name: "경영학개론", round: "1차", note: "선택" },
          { name: "경제학원론", round: "1차", note: "선택" },
        ],
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "1차는 5지선다 객관식입니다. 과목당 문항 수는 2023년까지 25문항, 2024년부터 40문항입니다. 합격 기준과 배점은 해당 회차 공고를 확인하세요.",
    ],
    bullets: [
      "봄기출 웹은 1차 객관식 기출·해설을 제공합니다. (제26회 2017년 ~ 제34회 2025년, 1,530문항)",
      "2차는 논술이라 확정답안이 없어 이번 웹 트랙에는 싣지 않았습니다.",
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
        detail: "Q-Net 공인노무사 자격시험 공고에서 원서·필기·합격 발표일을 확인하세요.",
      },
    ],
    note: "미확정 일정은 홈 카운트다운에 넣지 않습니다. 최신 공고를 기준으로 하세요.",
  },
  application: {
    title: "원서 접수",
    where: "Q-Net (한국산업인력공단)",
    how: [
      "Q-Net에서 공인노무사 자격시험 공고를 확인합니다.",
      "온라인으로 원서를 제출하고 응시료를 납부합니다.",
    ],
    links: [{ label: "Q-Net", href: "https://www.q-net.or.kr/cst003.do?id=cst00301&gSite=L&gId=05", external: true }],
  },
  officialLinks: [
    { label: "Q-Net", href: "https://www.q-net.or.kr/cst003.do?id=cst00301&gSite=L&gId=05", external: true },
  ],
  relatedLinks: [
    { label: "FAQ", href: "/nomusa/faq" },
    { label: "커뮤니티", href: "/nomusa/community" },
  ],
  sources: [
    {
      label: "Q-Net 공인노무사 자격시험",
      href: "https://www.q-net.or.kr/cst003.do?id=cst00301&gSite=L&gId=05",
      note: "원서·일정·합격 기준은 해당 회차 공고를 확인하세요.",
    },
  ],
  seoDescription:
    "공인노무사 1차 노동법·민법·사회보험법·경영학개론·경제학원론 시험 안내와 기출 학습. 봄기출 공인노무사.",
};
