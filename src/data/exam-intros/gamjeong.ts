import manifest from "@/data/gamjeong/manifest.json";
import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

/*
 * 근거: 「감정평가 및 감정평가사에 관한 법률 시행령」 제9조·제10조·[별표 1](2024-09-26 시행판),
 * 2023~2025 시행계획 공고(한국산업인력공단 공고 제2023-002호·제2024-005호·제2025-003호).
 * 앱(~/gamjeongbomgichul) README·docs/이식-자리.md·data/exam_days.json 에 정리한 값과 같다.
 */
const QNET_URL = "https://www.q-net.or.kr/cst003.do?id=cst00301&gSite=L&gId=60";

// 문항 수는 manifest 에서 센다 — 변환기를 다시 돌리면 이 글도 따라온다.
const examTotal = manifest.reduce((sum, subject) => sum + subject.examCount, 0);

export const gamjeongIntro: ExamIntro = {
  id: "gamjeong",
  eyebrow: "국가전문자격",
  title: "감정평가사 시험 안내",
  summary:
    "감정평가사 국가자격시험은 1차(객관식 5지선다, 영어는 공인어학성적으로 대체)와 2차(논문형 세 과목)로 치릅니다. 봄기출 웹은 1차 다섯 과목 기출과 선지별 해설을 앱과 같이 싣습니다. 원서·일정은 Q-Net 공고를 확인하세요.",
  hubHref: "/gamjeong",
  hubCta: "감정평가사 학습 시작",
  lastVerified: "2026-10-12",
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
        items: [
          { label: "1차", blurb: "객관식 5지선다 · 다섯 과목(영어는 공인어학성적으로 대체)" },
          { label: "2차", blurb: "논문형 세 과목 · 확정답안이 없어 웹에서는 1차만 제공" },
        ],
      },
    ],
  },
  subjects: {
    title: "시험 과목",
    description: "1차는 과목마다 40문항입니다.",
    groups: [
      {
        name: "1차 1교시 (120분)",
        items: [
          { name: "민법", round: "1차", note: "총칙·물권 · 1~40번" },
          { name: "경제학원론", round: "1차", note: "41~80번" },
          { name: "부동산학원론", round: "1차", note: "81~120번" },
        ],
      },
      {
        name: "1차 2교시 (80분)",
        items: [
          { name: "감정평가관계법규", round: "1차", note: "1~40번" },
          { name: "회계학", round: "1차", note: "한국채택국제회계기준(K-IFRS) · 41~80번" },
        ],
      },
      {
        name: "2차 (교시마다 100분)",
        items: [
          { name: "감정평가실무", round: "2차", note: "1교시" },
          { name: "감정평가이론", round: "2차", note: "2교시" },
          { name: "감정평가 및 보상법규", round: "2차", note: "3교시" },
        ],
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "1차는 과목마다 40문항, 5지선다 객관식입니다. 영어는 시험을 치르지 않고 기준 점수 이상의 공인어학성적으로 대신합니다.",
      "회계학 시험지는 과목 첫머리에 공통 전제(회계기간, K-IFRS 적용, 법인세 효과 등)를 한 번 적습니다. 봄기출은 회계학 문항마다 「과목 공통 전제 보기」로 함께 싣습니다.",
    ],
    bullets: [
      examTotal > 0
        ? `봄기출 웹은 1차 객관식 기출과 선지별 해설을 앱과 같이 싣습니다(제28회 2017년 ~ 제37회 2026년, ${examTotal.toLocaleString("ko-KR")}문항).`
        : "봄기출 웹은 1차 객관식 기출과 선지별 해설을 앱과 같이 싣습니다.",
      "2차는 논문형이라 확정답안이 없어 웹 트랙에는 싣지 않았습니다. 앱에서는 2차 기출을 문제마다 AI 답안 예시와 함께 봅니다.",
    ],
  },
  passingCriteria: {
    title: "합격 기준",
    bullets: [
      "1차: 영어를 뺀 과목마다 100점 만점에 40점 이상, 전 과목 평균 60점 이상",
      "2차: 과목마다 40점 이상, 전 과목 평균 60점 이상. 그 인원이 최소합격인원에 못 미치면 과목마다 40점 이상인 사람 가운데 평균이 높은 순으로 최소합격인원까지",
    ],
  },
  timetable: {
    title: "시험 시간",
    rows: [
      { label: "1차", detail: "1교시 120분(민법·경제학원론·부동산학원론), 2교시 80분(감정평가관계법규·회계학)" },
      { label: "2차", detail: "1·2·3교시 각 100분. 시작 시각은 해당 회차 공고를 확인하세요." },
    ],
  },
  schedule: {
    title: "시험 일정",
    items: [
      {
        label: "제37회(2026년)",
        detail: "1차 4월 4일, 2차 7월 4일에 치렀습니다.",
      },
      {
        label: "다음 회차",
        detail: "Q-Net 감정평가사 시행계획 공고에서 원서·시험·합격 발표일을 확인하세요.",
      },
    ],
    note: "해마다 1차는 봄, 2차는 여름에 한 번 치릅니다. 미확정 일정은 홈 카운트다운에 넣지 않습니다.",
  },
  application: {
    title: "원서 접수",
    where: "Q-Net (한국산업인력공단)",
    how: [
      "Q-Net에서 감정평가사 시행계획 공고를 확인합니다.",
      "1차 영어를 대신할 공인어학성적은 Q-Net에서 제출합니다(인정 시험·기준 점수·기한은 공고 확인).",
      "온라인으로 원서를 내고 응시료를 납부합니다.",
    ],
    links: [{ label: "Q-Net", href: QNET_URL, external: true }],
  },
  officialLinks: [{ label: "Q-Net", href: QNET_URL, external: true }],
  relatedLinks: [
    { label: "FAQ", href: "/gamjeong/faq" },
    { label: "커뮤니티", href: "/gamjeong/community" },
  ],
  sources: [
    {
      label: "Q-Net 감정평가사 자격시험",
      href: QNET_URL,
      note: "원서·일정·합격 기준·어학 기준 점수는 해당 회차 시행계획 공고를 확인하세요.",
    },
    {
      label: "감정평가 및 감정평가사에 관한 법률 시행령 제9조·제10조·[별표 1]",
      href: "https://www.law.go.kr/법령/감정평가및감정평가사에관한법률시행령",
    },
  ],
  seoDescription:
    "감정평가사 1차 민법·경제학원론·부동산학원론·감정평가관계법규·회계학 시험 안내와 기출 학습. 봄기출 감정평가사.",
};
