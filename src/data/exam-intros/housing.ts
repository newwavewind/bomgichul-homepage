import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

export const housingIntro: ExamIntro = {
  id: "housing",
  eyebrow: "주택관리사보 자격시험",
  title: "주택관리사보 시험 안내",
  summary:
    "제29회 시행계획(국토교통부 공고 제2026-412호·한국산업인력공단 공고 제2026-046호) 기준으로 1·2차 과목, 일정, 합격 기준, 수수료를 정리했습니다.",
  hubHref: "/housing",
  hubCta: "주택관리사 학습 시작",
  lastVerified: "2026-08-25",
  disclaimer: EXAM_INTRO_DISCLAIMER,
  administrator: {
    name: "한국산업인력공단 (Q-Net)",
    description:
      "주택관리사보 국가자격시험은 한국산업인력공단이 시행하며, 원서 접수와 합격 발표는 Q-Net 주택관리사보 사이트에서 진행됩니다.",
  },
  tracks: {
    title: "응시 구분",
    description:
      "1차와 2차를 따로 접수·시행합니다. 2025년 제28회 1차 합격자는 2026년 제1차 시험에 한해 1차를 면제받습니다.",
    groups: [
      {
        name: "시험 단계",
        items: [
          { label: "1차 시험", blurb: "회계원리 · 공동주택시설개론 · 민법 (객관식)" },
          {
            label: "2차 시험",
            blurb: "주택관리관계법규 · 공동주택관리실무 (객관식+주관식 단답형)",
          },
          {
            label: "1차 면제",
            blurb: "2025년 제28회 1차 합격 → 2026년 1차만 면제(별도 서류 없음). 결격사유가 있으면 면제되지 않습니다.",
          },
        ],
      },
    ],
  },
  subjects: {
    title: "시험 과목",
    description: "공동주택관리법 시행령 제74조 [별표 7] 기준입니다. 과목별 40문항입니다.",
    groups: [
      {
        name: "1차",
        items: [
          { name: "회계원리", round: "1차", note: "객관식 40문항" },
          { name: "공동주택시설개론", round: "1차", note: "객관식 40문항" },
          { name: "민법", round: "1차", note: "객관식 40문항" },
        ],
      },
      {
        name: "2차",
        items: [
          {
            name: "주택관리관계법규",
            round: "2차",
            note: "객관식 24·주관식 16",
          },
          {
            name: "공동주택관리실무",
            round: "2차",
            note: "객관식 24·주관식 16",
          },
        ],
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "1차는 객관식 5지 택일형, 2차는 객관식 5지 택일형과 주관식 단답형입니다. 2026년 선발예정인원은 1,600명입니다.",
    ],
    bullets: [
      "1차 1교시: 회계원리·공동주택시설개론 09:30～11:10(100분)",
      "1차 2교시: 민법 11:40～12:30(50분)",
      "2차 1교시: 주택관리관계법규·공동주택관리실무 09:30～11:10(100분)",
    ],
  },
  timetable: {
    title: "시험 시간표",
    rows: [
      { label: "1차 1교시", detail: "입실 09:00 · 09:30～11:10 (회계원리·시설개론)" },
      { label: "1차 2교시", detail: "입실 11:30 · 11:40～12:30 (민법)" },
      { label: "2차 1교시", detail: "입실 09:00 · 09:30～11:10 (법규·실무)" },
    ],
  },
  passingCriteria: {
    title: "합격 기준",
    bullets: [
      "1차: 과목당 100점 만점, 모든 과목 40점 이상이고 전 과목 평균 60점 이상",
      "2차: 동일하게 모든 과목 40점 이상·전 과목 평균 60점 이상. 다만 그 인원이 선발예정인원에 미달하면 모든 과목 40점 이상인 사람을 합격으로 할 수 있음",
      "2차 동점자로 선발예정인원을 초과하면 동점자 모두 합격(소수점 둘째자리까지, 반올림 없음)",
    ],
  },
  fees: {
    title: "응시수수료",
    items: [
      { label: "1차", amount: "21,000원" },
      { label: "2차", amount: "14,000원" },
    ],
    note: "공동주택관리법 시행규칙 제32조. 전자결제 이용, 결제수수료는 공단 부담.",
  },
  eligibility: {
    title: "응시자격",
    paragraphs: [
      "응시자격 제한은 없습니다. 다만 시행일 기준 결격사유에 해당하거나 부정행위로 5년이 지나지 않은 자는 응시할 수 없습니다.",
    ],
    bullets: [
      "피성년후견인·피한정후견인, 파산 후 미복권 등 공동주택관리법 제67조 제4항 결격사유",
      "1차 면제: 2025년 제28회 1차 합격자 → 2026년 1차에 한함",
    ],
  },
  schedule: {
    title: "시험 일정",
    items: [
      {
        label: "제29회 1차",
        date: "2026-06-27",
        detail:
          "정기 원서 2026년 5월 11일～5월 15일 · 빈자리 6월 18일～19일 · 합격 발표 7월 29일 (시행 완료)",
      },
      {
        label: "제29회 2차",
        date: "2026-09-19",
        detail:
          "정기 원서 2026년 8월 10일～8월 14일 · 빈자리 9월 10일～11일 · 합격 발표 12월 2일",
      },
    ],
    note: "국토교통부·한국산업인력공단 2026년 제29회 시행계획 공고 기준입니다.",
  },
  application: {
    title: "원서 접수",
    where: "Q-Net 주택관리사보 홈페이지",
    how: [
      "https://www.q-net.or.kr/site/housing 에서 해당 차수 접수 기간을 확인합니다.",
      "온라인으로 원서를 제출하고 응시수수료를 납부합니다(마감일 18:00까지 결제 완료).",
      "수험표를 출력·보관하고, 시험 전일 18:00부터 SMART Q-Finder로 시험실을 확인할 수 있습니다.",
    ],
    links: [
      {
        label: "Q-Net 주택관리사보",
        href: "https://www.q-net.or.kr/site/housing",
        external: true,
      },
    ],
  },
  officialLinks: [
    {
      label: "Q-Net 주택관리사보",
      href: "https://www.q-net.or.kr/site/housing",
      external: true,
    },
    { label: "한국산업인력공단", href: "https://www.hrdkorea.or.kr", external: true },
  ],
  relatedLinks: [
    { label: "FAQ", href: "/housing/faq" },
    { label: "커뮤니티", href: "/housing/community" },
  ],
  sources: [
    {
      label: "2026년도 제29회 주택관리사보 국가자격시험 시행계획 공고",
      href: "https://www.q-net.or.kr/site/housing",
      note: "국토교통부 공고 제2026-412호 · 한국산업인력공단 공고 제2026-046호 (2026.3.27)",
    },
  ],
  seoDescription:
    "제29회 주택관리사보 1·2차 과목·일정·합격 기준·응시수수료·Q-Net 접수 안내. 봄기출에서 기출 학습을 이어가세요.",
};
