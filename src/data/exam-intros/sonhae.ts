import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

export const sonhaeIntro: ExamIntro = {
  id: "sonhae",
  eyebrow: "국가전문자격",
  title: "손해평가사 시험 안내",
  summary:
    "손해평가사 국가자격시험 1차(객관식) 「상법」 보험편·농어업재해보험법령·농학개론 기출을 앱과 같이 제공합니다. 원서·일정은 Q-Net 공고를 확인하세요.",
  hubHref: "/sonhae",
  hubCta: "손해평가사 학습 시작",
  lastVerified: "2026-09-29",
  disclaimer: EXAM_INTRO_DISCLAIMER,
  administrator: {
    name: "한국산업인력공단 (Q-Net)",
    description: "손해평가사 자격시험의 시행·접수는 큐넷(Q-Net) 공고를 따릅니다.",
  },
  tracks: {
    title: "시험 구성",
    groups: [
      {
        name: "차수",
        items: [
          { label: "1차", blurb: "객관식 4지선다 · 3과목" },
          { label: "2차", blurb: "서술·계산 · 웹 OX 트랙에서는 1차만 제공" },
        ],
      },
    ],
  },
  subjects: {
    title: "1차 과목",
    groups: [
      {
        name: "1차 과목",
        items: [
          { name: "「상법」 보험편", round: "1차", note: "25문항" },
          { name: "농어업재해보험법령", round: "1차", note: "25문항" },
          { name: "농학개론", round: "1차", note: "재배학·원예작물학 · 25문항" },
        ],
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "1차는 과목마다 25문항, 4지선다 객관식입니다. 합격 기준과 배점은 해당 회차 공고를 확인하세요.",
    ],
    bullets: [
      "봄기출 웹은 1차 객관식 기출·해설을 제공합니다. (제3회 2017년 ~ 제12회 2026년, 750문항)",
      "2차는 서술·계산형이라 확정답안이 없어 이번 웹 트랙에는 싣지 않았습니다.",
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
        detail: "Q-Net 손해평가사 자격시험 공고에서 원서·필기·합격 발표일을 확인하세요.",
      },
    ],
    note: "미확정 일정은 홈 카운트다운에 넣지 않습니다. 최신 공고를 기준으로 하세요.",
  },
  application: {
    title: "원서 접수",
    where: "Q-Net (한국산업인력공단)",
    how: [
      "Q-Net에서 손해평가사 자격시험 공고를 확인합니다.",
      "온라인으로 원서를 제출하고 응시료를 납부합니다.",
    ],
    links: [{ label: "Q-Net", href: "https://www.q-net.or.kr/cst003.do?id=cst00301&gSite=L&gId=73", external: true }],
  },
  officialLinks: [
    { label: "Q-Net", href: "https://www.q-net.or.kr/cst003.do?id=cst00301&gSite=L&gId=73", external: true },
  ],
  relatedLinks: [
    { label: "FAQ", href: "/sonhae/faq" },
    { label: "커뮤니티", href: "/sonhae/community" },
  ],
  sources: [
    {
      label: "Q-Net 손해평가사 자격시험",
      href: "https://www.q-net.or.kr/cst003.do?id=cst00301&gSite=L&gId=73",
      note: "원서·일정·합격 기준은 해당 회차 공고를 확인하세요.",
    },
  ],
  seoDescription:
    "손해평가사 1차 「상법」 보험편·농어업재해보험법령·농학개론 시험 안내와 기출 학습. 봄기출 손해평가사.",
};
