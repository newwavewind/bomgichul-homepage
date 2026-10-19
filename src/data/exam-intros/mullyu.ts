import manifest from "@/data/mullyu/manifest.json";
import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

/*
 * 근거: 「물류정책기본법 시행령」 제36조(선택형)·제37조제2항·[별표 2](시험과목)·제41조(합격자 결정)와
 * 큐넷 물류관리사 시험정보(gSite=L, gId=61). 앱(~/mullyubomgichul) README·data/exam_days.json 에 정리한 값과 같다.
 */
const QNET_URL = "https://www.q-net.or.kr/cst003.do?id=cst00301&gSite=L&gId=61";

// 문항 수는 manifest 에서 센다 — 변환기를 다시 돌리면 이 글도 따라온다.
const examTotal = manifest.reduce((sum, subject) => sum + subject.examCount, 0);

export const mullyuIntro: ExamIntro = {
  id: "mullyu",
  eyebrow: "국가전문자격",
  title: "물류관리사 시험 안내",
  summary:
    "물류관리사 국가자격시험은 다섯 과목을 객관식 5지선다로 한 번에 치르며 2차 시험이 없습니다. 봄기출 웹은 다섯 과목 기출과 선지별 해설을 앱과 같이 싣습니다. 원서·일정은 Q-Net 공고를 확인하세요.",
  hubHref: "/mullyu",
  hubCta: "물류관리사 학습 시작",
  lastVerified: "2026-10-19",
  disclaimer: EXAM_INTRO_DISCLAIMER,
  administrator: {
    name: "국토교통부 · 한국산업인력공단 (Q-Net)",
    description:
      "국토교통부가 시험을 주관하고, 해마다 나오는 시행계획 공고에 따라 원서 접수와 시험 시행은 큐넷(Q-Net)에서 합니다.",
  },
  tracks: {
    title: "시험 구성",
    groups: [
      {
        name: "차수",
        items: [{ label: "단일 시험", blurb: "객관식 5지선다 · 다섯 과목 · 2차 시험 없음" }],
      },
    ],
  },
  subjects: {
    title: "시험 과목",
    description: "과목마다 40문항입니다.",
    groups: [
      {
        name: "1교시 (120분)",
        items: [
          { name: "물류관리론", note: "1~40번" },
          { name: "화물운송론", note: "41~80번" },
          { name: "국제물류론", note: "81~120번" },
        ],
      },
      {
        name: "2교시 (80분)",
        items: [
          { name: "보관하역론", note: "1~40번" },
          { name: "물류관련법규", note: "물류정책기본법 등 물류 관련 법령 · 41~80번" },
        ],
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "과목마다 40문항, 5지선다 객관식입니다.",
      "물류관련법규는 물류정책기본법·물류시설의 개발 및 운영에 관한 법률·화물자동차 운수사업법·항만운송사업법·유통산업발전법·철도사업법·농수산물 유통 및 가격안정에 관한 법률의 물류 관련 규정에서 나오며, 시험 시행일 현재 시행 중인 법령이 기준입니다.",
    ],
    bullets: [
      examTotal > 0
        ? `봄기출 웹은 기출과 선지별 해설을 앱과 같이 싣습니다(제21회 2017년 ~ 제30회 2026년, ${examTotal.toLocaleString("ko-KR")}문항).`
        : "봄기출 웹은 기출과 선지별 해설을 앱과 같이 싣습니다.",
      "A·B 책형이 있던 해(2017~2021년)는 A형 문항 번호로 싣습니다.",
    ],
  },
  passingCriteria: {
    title: "합격 기준",
    bullets: ["매 과목 100점 만점에 40점 이상, 전 과목 평균 60점 이상"],
  },
  timetable: {
    title: "시험 시간",
    rows: [
      { label: "1교시", detail: "120분(물류관리론·화물운송론·국제물류론)" },
      { label: "2교시", detail: "80분(보관하역론·물류관련법규). 시작 시각은 해당 회차 공고를 확인하세요." },
    ],
  },
  schedule: {
    title: "시험 일정",
    items: [
      {
        label: "제30회(2026년)",
        detail: "7월 25일에 치렀습니다.",
      },
      {
        label: "다음 회차",
        detail: "Q-Net 물류관리사 시행계획 공고에서 원서·시험·합격 발표일을 확인하세요.",
      },
    ],
    note: "해마다 여름에 한 번 치릅니다. 미확정 일정은 홈 카운트다운에 넣지 않습니다.",
  },
  application: {
    title: "원서 접수",
    where: "Q-Net (한국산업인력공단)",
    how: [
      "Q-Net에서 물류관리사 시행계획 공고를 확인합니다.",
      "온라인으로 원서를 내고 응시료를 납부합니다.",
    ],
    links: [{ label: "Q-Net", href: QNET_URL, external: true }],
  },
  officialLinks: [{ label: "Q-Net", href: QNET_URL, external: true }],
  relatedLinks: [
    { label: "FAQ", href: "/mullyu/faq" },
    { label: "커뮤니티", href: "/mullyu/community" },
  ],
  sources: [
    {
      label: "Q-Net 물류관리사 자격시험",
      href: QNET_URL,
      note: "원서·일정·합격 기준은 해당 회차 시행계획 공고를 확인하세요.",
    },
    {
      label: "물류정책기본법 시행령 제36조·제37조·제41조·[별표 2]",
      href: "https://www.law.go.kr/법령/물류정책기본법시행령",
    },
  ],
  seoDescription:
    "물류관리사 물류관리론·화물운송론·국제물류론·보관하역론·물류관련법규 시험 안내와 기출 학습. 봄기출 물류관리사.",
};
