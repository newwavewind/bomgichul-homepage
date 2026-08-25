import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

export const historyIntro: ExamIntro = {
  id: "history",
  eyebrow: "한국사능력검정시험 심화",
  title: "한국사능력검정 시험 안내",
  summary:
    "국사편찬위원회 한국사능력검정시험 누리집의 2026년 시험일정·기본 정보 기준으로 회차, 수수료, 시험 구성을 정리했습니다. 봄기출은 심화 기출을 중심으로 제공합니다.",
  hubHref: "/history",
  hubCta: "한국사 학습 시작",
  lastVerified: "2026-08-25",
  disclaimer: EXAM_INTRO_DISCLAIMER,
  administrator: {
    name: "국사편찬위원회",
    description:
      "한국사능력검정시험은 국사편찬위원회가 시행합니다. 원서 접수·성적 조회·인증서 출력은 historyexam.go.kr에서 진행합니다.",
  },
  tracks: {
    title: "등급·구분",
    description:
      "심화는 1·2·3급, 기본은 4·5·6급 인증입니다. 2026년 제78·80·81회는 심화만 시행합니다.",
    groups: [
      {
        name: "시험 구분",
        items: [
          { label: "심화", blurb: "인증등급 1·2·3급 · 50문항 · 80분" },
          { label: "기본", blurb: "인증등급 4·5·6급 · 50문항 · 70분" },
        ],
      },
    ],
  },
  subjects: {
    title: "출제 범위",
    description: "한국사 전 시대를 다루는 객관식 시험입니다.",
    groups: [
      {
        name: "심화",
        items: [{ name: "한국사 (전 시대)", round: "심화", note: "50문항 · 80분" }],
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "한 해에 여러 회차가 있습니다. 2026년에는 9급 공무원 한국사 대체 예정에 따른 수요 대응으로 1회가 증회되었습니다. 급수 구간(점수대) 등 세부 요강은 누리집 시험 안내를 확인하세요.",
    ],
    bullets: [
      "제79회(8.9.)는 일요일 시행(토요근무자 편의)",
      "합격자 발표: 홈페이지·정부24에서 성적 조회 및 인증서 출력",
      "수험표·신분증·컴퓨터용 수성사인펜 등 준비",
    ],
  },
  timetable: {
    title: "시험 시간 (기본 정보)",
    rows: [
      { label: "심화", detail: "50문항 · 80분" },
      { label: "기본", detail: "50문항 · 70분" },
    ],
  },
  fees: {
    title: "응시수수료",
    items: [
      { label: "심화", amount: "27,000원" },
      { label: "기본", amount: "22,000원" },
    ],
    note: "historyexam.go.kr 기본 정보(응시수수료) 기준.",
  },
  eligibility: {
    title: "응시 대상",
    bullets: [
      "한국사에 관심 있는 대한민국 국민(외국인도 가능)",
      "한국사 학습자, 상급 학교 진학·취업·유학 희망자 등",
    ],
  },
  schedule: {
    title: "2026년 시험 일정",
    items: [
      {
        label: "제77회",
        date: "2026-02-07",
        detail: "정기 원서 1.6.～1.13. · 취소좌석 1.20.～1.23. · 발표 2.20. (기본·심화)",
      },
      {
        label: "제78회",
        date: "2026-05-23",
        detail: "정기 원서 4.21.～4.28. · 취소좌석 5.5.～5.8. · 발표 6.5. (심화만)",
      },
      {
        label: "제79회",
        date: "2026-08-09",
        detail: "정기 원서 7.7.～7.14. · 취소좌석 7.21.～7.24. · 발표 8.21. (기본·심화·일요일)",
      },
      {
        label: "제80회 (다음 시행)",
        date: "2026-10-17",
        detail:
          "정기 원서 9.15. 10:00～9.22. 17:00 · 취소좌석 9.29.～10.2. · 발표 10.30. (심화만)",
      },
      {
        label: "제81회",
        date: "2026-11-28",
        detail:
          "정기 원서 11.3.～11.10. · 취소좌석 11.11. 13:00～11.13. · 발표 12.11. (심화만)",
      },
    ],
    note: "https://www.historyexam.go.kr/pageLink.do?link=examSchedule 기준. 취소좌석 접수는 잔여석에 한합니다.",
  },
  application: {
    title: "원서 접수",
    where: "한국사능력검정시험 누리집",
    how: [
      "historyexam.go.kr에서 해당 회차 접수 기간·권역별 접수 안내를 확인합니다.",
      "온라인으로 원서를 제출하고 응시료를 납부합니다.",
      "수험표를 출력하고, 시험 당일 신분증과 함께 지참합니다.",
    ],
    links: [
      {
        label: "한국사능력검정시험",
        href: "https://www.historyexam.go.kr",
        external: true,
      },
      {
        label: "시험 일정",
        href: "https://www.historyexam.go.kr/pageLink.do?link=examSchedule",
        external: true,
      },
    ],
  },
  officialLinks: [
    {
      label: "한국사능력검정시험",
      href: "https://www.historyexam.go.kr",
      external: true,
    },
    { label: "국사편찬위원회", href: "https://www.history.go.kr", external: true },
  ],
  relatedLinks: [
    { label: "FAQ", href: "/history/faq" },
    { label: "커뮤니티", href: "/history/community" },
  ],
  sources: [
    {
      label: "시험 일정 (examSchedule)",
      href: "https://www.historyexam.go.kr/pageLink.do?link=examSchedule",
      note: "2026년 제77～81회 원서·시험·발표일",
    },
    {
      label: "기본 정보 (응시료·시험시간·응시대상)",
      href: "https://www.historyexam.go.kr/pageLink.do?link=apyexmInfo",
      note: "심화 27,000원 · 기본 22,000원 · 심화 50문항 80분",
    },
  ],
  seoDescription:
    "한국사능력검정 2026년 회차 일정, 심화·기본 구성, 응시료, 원서 접수 안내. 봄기출에서 심화 기출을 학습하세요.",
};
