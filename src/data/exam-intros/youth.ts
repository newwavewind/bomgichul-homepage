import manifest from "@/data/youth/manifest.json";
import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

/*
 * 근거: 앱(~/youthbomgichul)의 과목 등록부 src/subjects/registry.js(급수·교시·필수/선택 — 앱이 청소년기본법
 * 시행령 [별표 4]·큐넷 시행계획 공고에서 옮긴 값)와 기출 데이터 src/data/exam/*.json(회차·문항 수),
 * 앱 등록 문안 docs/STORE_LISTING_1.0.md(큐넷 gSite=L·gId=67, 성평등가족부 소관·한국산업인력공단 시행).
 * 합격 기준·응시료·일정은 여기에 적지 않고 큐넷 공고를 가리킨다.
 */
const QNET_URL = "https://www.q-net.or.kr/cst003.do?id=cst00301&gSite=L&gId=67";

// 문항 수·회차는 manifest 에서 센다 — 변환기를 다시 돌리면 이 글도 따라온다.
const examTotal = manifest.reduce((sum, subject) => sum + subject.examCount, 0);
const years = manifest.flatMap((subject) => subject.years ?? []);
const sources = manifest.flatMap((subject) => subject.sources ?? []);
const roundNo = (code: string) => Number(code.replace(/[^\d]/g, "")) || 0;
const firstYear = years.length ? Math.min(...years) : 0;
const lastYear = years.length ? Math.max(...years) : 0;
const firstRound = sources.length ? Math.min(...sources.map(roundNo)) : 0;
const lastRound = sources.length ? Math.max(...sources.map(roundNo)) : 0;
const coverage =
  examTotal > 0 && firstYear && lastYear
    ? `제${firstRound}회 ${firstYear}년 ~ 제${lastRound}회 ${lastYear}년, ${examTotal.toLocaleString("ko-KR")}문항`
    : "";

export const youthIntro: ExamIntro = {
  id: "youth",
  eyebrow: "국가전문자격",
  title: "청소년상담사 시험 안내",
  summary:
    "청소년상담사 필기는 1급·2급·3급마다 과목이 다르고, 모든 과목을 객관식 5지선다 25문항으로 치릅니다. 봄기출 웹은 세 급수 22과목 기출과 선지별 해설을 앱과 같이 싣습니다. 원서·일정은 Q-Net 공고를 확인하세요.",
  hubHref: "/youth",
  hubCta: "청소년상담사 학습 시작",
  lastVerified: "2026-10-20",
  disclaimer: EXAM_INTRO_DISCLAIMER,
  administrator: {
    name: "성평등가족부 · 한국산업인력공단 (Q-Net)",
    description:
      "청소년 기본법에 따른 자격으로 성평등가족부 소관입니다. 원서 접수와 시험 시행은 해마다 나오는 큐넷(Q-Net) 시행계획 공고를 따릅니다.",
  },
  tracks: {
    title: "급수별 구성",
    description: "급수마다 1교시는 필수 과목, 2교시는 선택 과목을 치릅니다. 3급은 2교시에 필수 과목인 학습이론도 함께 치릅니다.",
    groups: [
      {
        name: "급수",
        items: [
          { label: "1급", blurb: "필수 3과목 · 선택 4과목 중 2과목" },
          { label: "2급", blurb: "필수 4과목 · 선택 4과목 중 2과목" },
          { label: "3급", blurb: "필수 5과목(학습이론은 2교시) · 선택 2과목 중 1과목" },
        ],
      },
    ],
  },
  subjects: {
    title: "필기 과목",
    description: "모든 과목이 25문항입니다. 2교시 선택 과목은 급수마다 정해진 수만큼 골라 치릅니다.",
    // 안내 화면은 과목 이름만 그리므로 교시·필수/선택을 묶음 이름에 담는다(앱 registry.js 의 sitting·isElective).
    groups: [
      {
        name: "1급 · 1교시 필수",
        items: [
          { name: "상담사 교육 및 사례지도", round: "1교시", note: "필수" },
          { name: "청소년 관련 법과 행정", round: "1교시", note: "필수" },
          { name: "상담연구방법론의 실제", round: "1교시", note: "필수" },
        ],
      },
      {
        name: "1급 · 2교시 선택 (넷 중 둘)",
        items: [
          { name: "비행상담", round: "2교시", note: "선택" },
          { name: "성상담", round: "2교시", note: "선택" },
          { name: "약물상담", round: "2교시", note: "선택" },
          { name: "위기상담", round: "2교시", note: "선택" },
        ],
      },
      {
        name: "2급 · 1교시 필수",
        items: [
          { name: "청소년 상담의 이론과 실제", round: "1교시", note: "필수" },
          { name: "상담연구방법론의 기초", round: "1교시", note: "필수" },
          { name: "심리측정 평가의 활용", round: "1교시", note: "필수" },
          { name: "이상심리", round: "1교시", note: "필수" },
        ],
      },
      {
        name: "2급 · 2교시 선택 (넷 중 둘)",
        items: [
          { name: "진로상담", round: "2교시", note: "선택" },
          { name: "집단상담", round: "2교시", note: "선택" },
          { name: "가족상담", round: "2교시", note: "선택" },
          { name: "학업상담", round: "2교시", note: "선택" },
        ],
      },
      {
        name: "3급 · 1교시 필수",
        items: [
          { name: "발달심리", round: "1교시", note: "필수" },
          { name: "집단상담의 기초", round: "1교시", note: "필수" },
          { name: "심리측정 및 평가", round: "1교시", note: "필수" },
          { name: "상담이론", round: "1교시", note: "필수" },
        ],
      },
      {
        name: "3급 · 2교시 필수",
        items: [{ name: "학습이론", round: "2교시", note: "필수" }],
      },
      {
        name: "3급 · 2교시 선택 (둘 중 하나)",
        items: [
          { name: "청소년이해론", round: "2교시", note: "선택" },
          { name: "청소년수련활동론", round: "2교시", note: "선택" },
        ],
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "필기는 과목마다 25문항, 5지선다 객관식입니다. 급수 사이에 같은 이름의 과목은 없습니다.",
      "합격 기준과 배점은 해당 회차 Q-Net 공고를 확인하세요.",
    ],
    bullets: [
      coverage
        ? `봄기출 웹은 세 급수 22과목 기출과 선지별 해설을 앱과 같이 싣습니다(${coverage}).`
        : "봄기출 웹은 세 급수 22과목 기출과 선지별 해설을 앱과 같이 싣습니다.",
      "학습 홈에서 과목을 1급·2급·3급으로 나누어 보여 줍니다.",
    ],
  },
  timetable: {
    title: "시험 시간",
    rows: [
      { label: "1교시", detail: "필수 과목. 시작 시각과 시험 시간은 해당 회차 Q-Net 공고를 확인하세요." },
      { label: "2교시", detail: "선택 과목(3급은 학습이론과 선택 과목 하나)." },
    ],
  },
  schedule: {
    title: "시험 일정",
    items: [
      {
        label: "회차별 일정",
        detail: "Q-Net 청소년상담사 시행계획 공고에서 원서·필기·합격 발표일을 확인하세요.",
      },
    ],
    note: "미확정 일정은 홈 카운트다운에 넣지 않습니다. 최신 공고를 기준으로 하세요.",
  },
  application: {
    title: "원서 접수",
    where: "Q-Net (한국산업인력공단)",
    how: [
      "Q-Net에서 청소년상담사 자격시험 시행계획 공고를 확인합니다.",
      "온라인으로 원서를 내고 응시료를 납부합니다.",
    ],
    links: [{ label: "Q-Net", href: QNET_URL, external: true }],
  },
  officialLinks: [{ label: "Q-Net", href: QNET_URL, external: true }],
  relatedLinks: [
    { label: "FAQ", href: "/youth/faq" },
    { label: "커뮤니티", href: "/youth/community" },
  ],
  sources: [
    {
      label: "Q-Net 청소년상담사 자격시험",
      href: QNET_URL,
      note: "원서·일정·합격 기준은 해당 회차 시행계획 공고를 확인하세요.",
    },
    {
      label: "청소년 기본법 시행령 [별표 4] 청소년상담사 자격검정의 과목 및 방법",
      href: "https://www.law.go.kr/법령/청소년기본법시행령",
    },
  ],
  seoDescription:
    "청소년상담사 1급·2급·3급 필기 22과목 시험 안내와 기출 학습. 봄기출 청소년상담사.",
};
