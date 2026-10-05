import manifest from "@/data/gyeongbi/manifest.json";
import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

/*
 * 근거: 경비업법 시행령 [별표 2](경비지도사의 시험과목), 경찰청 경비지도사 시행계획 공고
 * (2016~2025, 앱 원본 폴더 ~/Desktop/경비지도사_기출_10개년/공고_경찰청/),
 * 2026년도 제28회 시행계획 공고(한국산업인력공단 공고 제2026-135호).
 * 앱(~/gyeongbibomgichul) README·목록.md 에 정리한 값과 같다.
 */
const QNET_URL = "https://www.q-net.or.kr/cst003.do?id=cst00301&gSite=L&gId=09";

// 문항 수는 manifest 에서 센다 — 기출을 뒤에 싣는 트랙이라 글을 손으로 고치지 않게.
const examTotal = manifest.reduce((sum, subject) => sum + subject.examCount, 0);

export const gyeongbiIntro: ExamIntro = {
  id: "gyeongbi",
  eyebrow: "국가전문자격",
  title: "경비지도사 시험 안내",
  summary:
    "경비지도사 국가자격시험은 1차(법학개론·민간경비론)와 2차(경비업법 + 선택 1과목)를 같은 날 치르며, 두 차수 모두 4지선다 객관식입니다. 원서·일정은 Q-Net 공고를 확인하세요.",
  hubHref: "/gyeongbi",
  hubCta: "경비지도사 학습 시작",
  lastVerified: "2026-10-05",
  disclaimer: EXAM_INTRO_DISCLAIMER,
  administrator: {
    name: "경찰청 · 한국산업인력공단 (Q-Net)",
    description:
      "해마다 경비지도사 시행계획 공고가 나오고, 원서 접수와 시험 안내는 큐넷(Q-Net)에서 합니다.",
  },
  tracks: {
    title: "자격 구분",
    description: "1차는 두 자격이 같은 시험지를 쓰고, 2차 선택과목이 자격에 따라 갈립니다.",
    groups: [
      {
        name: "자격",
        items: [
          { label: "일반경비지도사", blurb: "2차 선택", subjects: ["소방학", "범죄학", "경호학"] },
          { label: "기계경비지도사", blurb: "2차 선택", subjects: ["기계경비개론", "기계경비기획 및 설계"] },
        ],
      },
    ],
  },
  subjects: {
    title: "시험 과목",
    description: "과목마다 40문항, 4지선다 객관식입니다.",
    groups: [
      {
        name: "1차 (일반·기계 공통)",
        items: [
          { name: "법학개론", round: "1차", note: "1~40번" },
          { name: "민간경비론", round: "1차", note: "41~80번" },
        ],
      },
      {
        name: "2차 필수",
        items: [{ name: "경비업법(청원경찰법 포함)", round: "2차", note: "1~40번" }],
      },
      {
        name: "2차 선택 (1과목)",
        items: [
          { name: "소방학", round: "2차", note: "일반경비지도사 · 41~80번" },
          { name: "범죄학", round: "2차", note: "일반경비지도사 · 41~80번" },
          { name: "경호학", round: "2차", note: "일반경비지도사 · 41~80번" },
          { name: "기계경비개론", round: "2차", note: "기계경비지도사 · 41~80번" },
          { name: "기계경비기획 및 설계", round: "2차", note: "기계경비지도사 · 41~80번" },
        ],
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "1차와 2차를 같은 날 잇달아 치릅니다. 차수마다 두 과목 80문항, 4지선다 객관식입니다.",
      "2차 시험지는 선택과목마다 한 권이고, 앞 40문항(경비업법)은 같은 회차의 다섯 권이 모두 같습니다.",
    ],
    bullets: [
      examTotal > 0
        ? `봄기출 웹은 1·2차 객관식 기출과 선지별 해설을 앱과 같이 싣습니다(${examTotal.toLocaleString("ko-KR")}문항).`
        : "봄기출 웹은 1·2차 객관식 기출과 선지별 해설을 앱과 같이 싣습니다. 지금은 제18회(2016년)~제27회(2025년) 10개년을 앱에서 옮겨 싣는 중입니다.",
      "2차도 객관식이고 확정답안이 있어 2차 과목(경비업법·선택과목)까지 함께 담습니다.",
    ],
  },
  passingCriteria: {
    title: "합격 기준",
    bullets: [
      "1차: 과목마다 100점 만점에 40점 이상, 전 과목 평균 60점 이상",
      "2차: 선발예정인원 범위에서 60점 이상 받은 사람 가운데 고득점 순(과락 없음)",
    ],
  },
  timetable: {
    title: "시험 시간",
    rows: [
      { label: "1차", detail: "09:30~10:50 (80분) — 최근 공고 기준" },
      { label: "2차", detail: "11:40~13:00 (80분) — 2022~2025년 공고 기준. 해당 회차 공고를 확인하세요." },
    ],
  },
  schedule: {
    title: "시험 일정",
    items: [
      {
        label: "제28회 1·2차 시험",
        date: "2026-11-21",
        detail: "1차와 2차를 같은 날 치릅니다.",
      },
      {
        label: "원서 접수·합격 발표",
        detail: "Q-Net 경비지도사 시행계획 공고에서 확인하세요.",
      },
    ],
    note: "해마다 11월 토요일에 한 번 치릅니다. 최신 공고를 기준으로 하세요.",
  },
  application: {
    title: "원서 접수",
    where: "Q-Net (한국산업인력공단)",
    how: [
      "Q-Net에서 경비지도사 시행계획 공고를 확인합니다.",
      "일반·기계 가운데 응시할 자격과 2차 선택과목을 정해 온라인으로 원서를 내고 응시료를 납부합니다.",
    ],
    links: [{ label: "Q-Net", href: QNET_URL, external: true }],
  },
  officialLinks: [{ label: "Q-Net", href: QNET_URL, external: true }],
  relatedLinks: [
    { label: "FAQ", href: "/gyeongbi/faq" },
    { label: "커뮤니티", href: "/gyeongbi/community" },
  ],
  sources: [
    {
      label: "Q-Net 경비지도사 자격시험",
      href: QNET_URL,
      note: "원서·일정·합격 기준은 해당 회차 시행계획 공고를 확인하세요.",
    },
    {
      label: "경비업법 시행령 [별표 2] 경비지도사의 시험과목",
      href: "https://www.law.go.kr/법령/경비업법시행령",
    },
  ],
  seoDescription:
    "경비지도사 1차 법학개론·민간경비론, 2차 경비업법·소방학·범죄학·경호학·기계경비개론·기계경비기획 및 설계 시험 안내와 기출 학습. 봄기출 경비지도사.",
};
