import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

export const socialWorkerIntro: ExamIntro = {
  id: "social-worker",
  eyebrow: "사회복지사 1급 국가시험",
  title: "사회복지사 1급 시험 안내",
  summary:
    "제24회 시행계획(한국산업인력공단 공고 제2025-178호) 기준으로 8영역·3교시 구성, 합격 기준, 수수료, 서류심사를 정리했습니다. 제24회 필기는 2026년 1월 17일 시행이 완료되었습니다.",
  hubHref: "/social-worker",
  hubCta: "사회복지사 학습 시작",
  lastVerified: "2026-08-25",
  disclaimer: EXAM_INTRO_DISCLAIMER,
  administrator: {
    name: "한국산업인력공단 (Q-Net) · 한국사회복지사협회(응시자격 서류심사)",
    description:
      "사회복지사 1급 국가시험은 한국산업인력공단이 시행하고 Q-Net에서 원서를 받습니다. 필기 합격예정자는 한국사회복지사협회에서 응시자격 서류심사를 받습니다.",
  },
  subjects: {
    title: "시험 과목 (3과목·8영역)",
    description: "객관식 5지 택1형, 총 200문항(문항당 1점).",
    groups: [
      {
        name: "1교시 사회복지기초 (50문항)",
        items: [
          { name: "인간행동과 사회환경", note: "25문항" },
          { name: "사회복지조사론", note: "25문항" },
        ],
      },
      {
        name: "2교시 사회복지실천 (75문항)",
        items: [
          { name: "사회복지실천론", note: "25문항" },
          { name: "사회복지실천기술론", note: "25문항" },
          { name: "지역사회복지론", note: "25문항" },
        ],
      },
      {
        name: "3교시 사회복지정책과 제도 (75문항)",
        items: [
          { name: "사회복지정책론", note: "25문항" },
          { name: "사회복지행정론", note: "25문항" },
          { name: "사회복지법제론", note: "25문항" },
        ],
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "1회 필기시험 후 합격예정자를 대상으로 협회 서류심사를 거쳐 최종합격자를 발표합니다. 서류 미제출·부적격 시 합격 예정이 취소됩니다.",
    ],
    bullets: [
      "시행지역: 전국 13개 지역(충남 추가)",
      "법령 적용 기준일: 시험 시행일(2026.1.17.) 현재 시행 중인 법령",
    ],
  },
  timetable: {
    title: "시험 시간표 (일반 수험자)",
    rows: [
      { label: "1교시", detail: "입실 09:00 · 09:30～10:20 (사회복지기초·50분)" },
      { label: "휴식", detail: "10:20～10:40 (20분)" },
      { label: "2교시", detail: "입실 10:40 · 10:50～12:05 (사회복지실천·75분)" },
      { label: "휴식", detail: "12:05～12:25 (20분)" },
      { label: "3교시", detail: "입실 12:25 · 12:35～13:50 (정책과 제도·75분)" },
    ],
  },
  passingCriteria: {
    title: "합격 기준",
    bullets: [
      "매 과목 4할 이상, 전 과목 총점의 6할 이상 득점 → 합격예정자",
      "합격예정자는 한국사회복지사협회 응시자격 서류심사 통과 후 최종합격",
      "최종합격 후에도 서류 허위·부적격이 확인되면 합격 취소",
    ],
  },
  fees: {
    title: "응시수수료",
    items: [{ label: "응시료", amount: "25,000원" }],
    note: "전자결제. 결제수수료는 공단 부담. 환불 기준은 공고(사회복지사업법 시행규칙 제4조의4)를 따릅니다.",
  },
  eligibility: {
    title: "응시자격",
    paragraphs: [
      "사회복지사업법 시행령 제4조 제1항 및 [별표 3]에 해당하는 자(대학원·대학 이수, 동등학력, 외국 학위, 2급+실무경력 등). 세부 유형·제출서류는 공고와 협회 안내를 확인하세요.",
    ],
    bullets: [
      "학위·학점 등은 원칙적으로 2026년 2월 28일까지 취득·등록분까지 인정(유형별 공고 확인)",
      "원서 접수 시에는 응시자격 서류를 제출하지 않음(합격예정자만 서류심사)",
      "결격사유: 사회복지사업법 제11조의2 등",
    ],
  },
  schedule: {
    title: "시험 일정 (제24회)",
    items: [
      {
        label: "제24회 필기시험",
        date: "2026-01-17",
        detail:
          "정기 원서 2025년 12월 8일～12월 12일 · 빈자리 2026년 1월 8일～9일 · 합격예정 2월 19일 · 서류제출 2월 19일～3월 11일 · 최종합격 3월 25일 (시행 완료)",
      },
      {
        label: "다음 회차",
        detail: "제25회 일정은 Q-Net 사회복지사1급 공고를 확인하세요.",
      },
    ],
    note: "한국산업인력공단 공고 제2025-178호(2025.10.17) 기준입니다.",
  },
  application: {
    title: "원서 접수",
    where: "Q-Net 사회복지사1급 홈페이지",
    how: [
      "https://www.q-net.or.kr/site/welfare 에서 회차 공고를 확인합니다.",
      "인터넷으로만 접수하며, 마감 시각까지 수수료 결제·수험표 출력이 완료되어야 합니다.",
      "합격예정자 발표 후 협회(https://www.welfare.net/lic)에 응시자격 서류를 기한 내 제출합니다.",
    ],
    links: [
      {
        label: "Q-Net 사회복지사1급",
        href: "https://www.q-net.or.kr/site/welfare",
        external: true,
      },
      {
        label: "한국사회복지사협회 자격",
        href: "https://www.welfare.net/lic",
        external: true,
      },
    ],
  },
  officialLinks: [
    {
      label: "Q-Net 사회복지사1급",
      href: "https://www.q-net.or.kr/site/welfare",
      external: true,
    },
    { label: "한국사회복지사협회", href: "https://www.welfare.net", external: true },
  ],
  relatedLinks: [
    { label: "FAQ", href: "/social-worker/faq" },
    { label: "커뮤니티", href: "/social-worker/community" },
  ],
  sources: [
    {
      label: "2026년도 제24회 사회복지사 1급 국가시험 시행계획 공고 (제2025-178호)",
      href: "https://www.q-net.or.kr/site/welfare",
      note: "2025.10.17 공고 · 과목·시간표·합격기준·수수료·응시자격·서류심사",
    },
  ],
  seoDescription:
    "제24회 사회복지사 1급 8영역·합격 기준·응시료·Q-Net 접수·협회 서류심사 안내. 봄기출에서 기출 학습을 이어가세요.",
};
