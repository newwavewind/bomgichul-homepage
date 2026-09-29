import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

export const sananIntro: ExamIntro = {
  id: "sanan",
  eyebrow: "국가전문자격",
  title: "산업안전지도사 시험 안내",
  summary:
    "산업안전지도사 국가자격시험 1차(객관식) 산업안전보건법령·산업안전일반·기업진단·지도 기출을 앱과 같이 제공합니다. 원서·일정은 Q-Net 공고를 확인하세요.",
  hubHref: "/sanan",
  hubCta: "산업안전지도사 학습 시작",
  lastVerified: "2026-09-29",
  disclaimer: EXAM_INTRO_DISCLAIMER,
  administrator: {
    name: "한국산업인력공단 (Q-Net)",
    description: "산업안전지도사 자격시험의 시행·접수는 큐넷(Q-Net) 공고를 따릅니다.",
  },
  tracks: {
    title: "시험 구성",
    groups: [
      {
        name: "차수",
        items: [
          { label: "1차", blurb: "객관식 5지선다 · 3과목" },
          { label: "2차", blurb: "분야별 논술·단답 · 웹 OX 트랙에서는 1차만 제공" },
          { label: "3차", blurb: "면접" },
        ],
      },
    ],
  },
  subjects: {
    title: "1차 과목",
    groups: [
      {
        name: "공통필수",
        items: [
          { name: "산업안전보건법령", round: "1차", note: "25문항" },
          { name: "산업안전일반", round: "1차", note: "25문항" },
          { name: "기업진단·지도", round: "1차", note: "25문항" },
        ],
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "1차는 과목마다 25문항, 5지선다 객관식입니다. 합격 기준과 배점은 해당 회차 공고를 확인하세요.",
    ],
    bullets: [
      "봄기출 웹은 1차 객관식 기출·해설을 제공합니다. (제7회 2017년 ~ 제16회 2026년, 750문항)",
      "2차는 기계·전기·화공·건설안전 분야 논술·단답이라 확정답안이 없어 이번 웹 트랙에는 싣지 않았습니다.",
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
        detail: "Q-Net 산업안전지도사 자격시험 공고에서 원서·필기·합격 발표일을 확인하세요.",
      },
    ],
    note: "미확정 일정은 홈 카운트다운에 넣지 않습니다. 최신 공고를 기준으로 하세요.",
  },
  application: {
    title: "원서 접수",
    where: "Q-Net (한국산업인력공단)",
    how: [
      "Q-Net에서 산업안전지도사 자격시험 공고를 확인합니다.",
      "온라인으로 원서를 제출하고 응시료를 납부합니다.",
    ],
    links: [{ label: "Q-Net", href: "https://www.q-net.or.kr/cst003.do?id=cst00301&gSite=L&gId=56", external: true }],
  },
  officialLinks: [
    { label: "Q-Net", href: "https://www.q-net.or.kr/cst003.do?id=cst00301&gSite=L&gId=56", external: true },
  ],
  relatedLinks: [
    { label: "FAQ", href: "/sanan/faq" },
    { label: "커뮤니티", href: "/sanan/community" },
  ],
  sources: [
    {
      label: "Q-Net 산업안전지도사 자격시험",
      href: "https://www.q-net.or.kr/cst003.do?id=cst00301&gSite=L&gId=56",
      note: "원서·일정·합격 기준은 해당 회차 공고를 확인하세요.",
    },
  ],
  seoDescription:
    "산업안전지도사 1차 산업안전보건법령·산업안전일반·기업진단·지도 시험 안내와 기출 학습. 봄기출 산업안전지도사.",
};
