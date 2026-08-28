import { BROKER_EXAM_SCHEDULE } from "@/lib/constants";
import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

function formatBrokerDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

const nextSchedule = BROKER_EXAM_SCHEDULE[0];

export const realEstateIntro: ExamIntro = {
  id: "real-estate",
  eyebrow: "공인중개사 자격시험",
  title: "공인중개사 시험 안내",
  summary:
    "제37회 시행계획(공고 제2026-117호) 기준으로 1·2차 과목, 시간표, 합격 기준, 응시수수료, Q-Net 원서 접수를 정리했습니다.",
  hubHref: "/real-estate",
  hubCta: "공인중개사 학습 시작",
  conceptsHref: "/concepts/broker-law",
  conceptsCta: "중개사법 올인원 보기",
  lastVerified: "2026-08-25",
  disclaimer: EXAM_INTRO_DISCLAIMER,
  administrator: {
    name: "한국산업인력공단 (Q-Net)",
    description:
      "공인중개사 자격시험은 한국산업인력공단이 시행하며, 원서 접수·합격 발표 등 시험 행정은 Q-Net에서 진행됩니다. 자격 관련 법령은 국토교통부 소관입니다.",
  },
  tracks: {
    title: "응시 구분",
    description:
      "제37회는 1·2차 시험을 같은 날 동시 접수·시행합니다. 2025년 제36회 1차 합격자는 제37회 1차를 면제받을 수 있습니다.",
    groups: [
      {
        name: "시험 단계",
        items: [
          { label: "1차 시험", blurb: "부동산학개론 · 민법 및 민사특별법 (과목당 40문제)" },
          {
            label: "2차 시험",
            blurb: "중개사법령·중개실무 · 공시법령·세법(한 시험) · 공법 (과목당 40문제)",
          },
          {
            label: "1차 면제 응시",
            blurb:
              "2025년 제36회 1차 합격자는 제37회 1차 면제. 면제 대상자가 1·2차 동시 접수로 접수하면 면제 포기로 처리됩니다.",
          },
        ],
      },
    ],
  },
  subjects: {
    title: "시험 과목",
    description:
      "공고상 과목당 40문제입니다. 2차의 부동산공시법령과 부동산 관련 세법은 한 시험으로 함께 치르며, 봄기출에서는 학습을 위해 공시법·세법을 나눠 제공합니다.",
    groups: [
      {
        name: "1차",
        items: [
          { name: "부동산학개론", round: "1차", note: "40문제" },
          { name: "민법 및 민사특별법", round: "1차", note: "40문제" },
        ],
      },
      {
        name: "2차",
        items: [
          { name: "공인중개사법령 및 중개실무", round: "2차", note: "40문제" },
          {
            name: "부동산공시법령 및 부동산 관련 세법",
            round: "2차",
            note: "한 시험 · 40문제",
          },
          { name: "부동산공법", round: "2차", note: "40문제" },
        ],
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "제37회는 1·2차를 같은 날 오전·오후로 나눠 동시 시행합니다. 객관식이며, 매 과목 40점 이상·전 과목 평균 60점 이상을 충족해야 합니다.",
      "1·2차 동시 응시자 중 1차에 불합격하면 2차 성적은 무효입니다(공인중개사법 시행령 제5조 제3항).",
    ],
    bullets: [
      "1차: 1교시 2과목, 09:30～11:10(100분), 입실 09:00까지",
      "2차: 1교시 2과목 13:00～14:40(100분), 2교시 1과목 15:30～16:20(50분)",
      "시험 시작 이후 입실 불가",
    ],
  },
  timetable: {
    title: "시험 시간표 (일반 응시자)",
    rows: [
      { label: "1차 1교시", detail: "입실 09:00까지 · 09:30～11:10 (2과목·100분)" },
      { label: "2차 1교시", detail: "입실 12:30까지 · 13:00～14:40 (2과목·100분)" },
      { label: "2차 2교시", detail: "입실 15:10까지 · 15:30～16:20 (1과목·50분)" },
    ],
  },
  passingCriteria: {
    title: "합격 기준",
    bullets: [
      "1차: 매 과목 100점 만점 기준 매 과목 40점 이상, 전 과목 평균 60점 이상",
      "2차: 매 과목 100점 만점 기준 매 과목 40점 이상, 전 과목 평균 60점 이상",
      "1·2차 동시 응시자 중 1차 불합격 시 2차 시험은 무효",
    ],
  },
  fees: {
    title: "응시수수료",
    items: [
      { label: "제1차만", amount: "13,700원" },
      { label: "제2차만", amount: "14,300원" },
      { label: "제1·2차 동시", amount: "28,000원" },
    ],
    note: "전자결제(신용카드, 계좌이체, 가상계좌, 퀵계좌이체, 간편결제). 인터넷 결제대행 수수료는 공단 부담.",
  },
  eligibility: {
    title: "응시자격",
    paragraphs: ["응시자격 제한은 없으나, 아래 결격 등에 해당하면 응시할 수 없습니다."],
    bullets: [
      "부정행위자로 처분받은 날부터 시험시행일 전일(2026.10.30)까지 5년이 지나지 않은 자",
      "공인중개사 자격이 취소된 후 합격자발표일(2026.12.2)까지 3년이 지나지 않은 자",
      "이미 공인중개사 자격을 취득한 자",
    ],
  },
  schedule: {
    title: "시험 일정",
    items: [
      {
        label: nextSchedule.label,
        date: nextSchedule.examDate,
        detail: `정기 원서 ${formatBrokerDate(nextSchedule.registrationStart)} 09:00 ~ ${formatBrokerDate(nextSchedule.registrationEnd)} 18:00 · 빈자리 원서 2026년 10월 1일～10월 2일 · 합격 발표 ${formatBrokerDate(nextSchedule.resultDate)} · ${nextSchedule.note}`,
      },
    ],
    note: "일정은 한국산업인력공단 공고 제2026-117호(2026.7.24) 기준입니다. 변경될 수 있으니 원서 접수 전 Q-Net 공고를 다시 확인하세요.",
  },
  application: {
    title: "원서 접수",
    where: "Q-Net 공인중개사 홈페이지 또는 큐넷 모바일 앱",
    how: [
      "https://www.q-net.or.kr/site/junggae 에서 제37회 시행계획을 확인합니다.",
      "정기 접수 기간에 인터넷·모바일로 응시 구분(1·2차 동시 / 2차만 등)을 선택합니다.",
      "최근 6개월 이내 여권용 사진(JPG)을 등록하고 응시수수료를 납부한 뒤 수험표를 출력합니다.",
      "시험 당일 신분증과 수험표를 지참하고, 교시별 입실 시각을 지킵니다.",
    ],
    links: [
      {
        label: "Q-Net 공인중개사",
        href: "https://www.q-net.or.kr/site/junggae",
        external: true,
      },
    ],
  },
  officialLinks: [
    {
      label: "Q-Net 공인중개사",
      href: "https://www.q-net.or.kr/site/junggae",
      external: true,
    },
    { label: "한국산업인력공단", href: "https://www.hrdkorea.or.kr", external: true },
  ],
  relatedLinks: [
    { label: "FAQ", href: "/faq" },
    { label: "커뮤니티", href: "/community" },
  ],
  sources: [
    {
      label: "2026년도 제37회 공인중개사 자격시험 시행계획 공고 (제2026-117호, 2026.7.24)",
      href: "https://www.q-net.or.kr/site/junggae",
      note: "시험일정·시간표·합격기준·수수료·1차 면제·응시결격 근거",
    },
  ],
  seoDescription:
    "제37회 공인중개사 1·2차 과목·시간표·합격 기준(40점·평균 60점)·응시수수료·Q-Net 원서 접수 안내. 봄기출에서 기출 학습을 이어가세요.",
};
