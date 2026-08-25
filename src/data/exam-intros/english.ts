import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

export const englishIntro: ExamIntro = {
  id: "english",
  eyebrow: "9급 공무원 영어",
  title: "공무원 영어 시험 안내",
  summary:
    "공무원 영어는 독립 자격이 아니라 9급 공개경쟁채용 필기의 한 과목입니다. 일정·접수는 국가직·지방직 공무원 공고를 따릅니다.",
  hubHref: "/english",
  hubCta: "공무원 영어 학습 시작",
  lastVerified: "2026-08-25",
  disclaimer: EXAM_INTRO_DISCLAIMER,
  administrator: {
    name: "인사혁신처 · 국가공무원채용시스템 (국가직) / 지방자치단체 (지방직)",
    description:
      "영어 과목의 시행·접수는 9급 공무원 채용 공고에 포함됩니다. 별도 ‘영어 시험’ 원서는 없습니다.",
  },
  tracks: {
    title: "응시 맥락",
    groups: [
      {
        name: "채용 구분",
        items: [
          { label: "국가직 9급", blurb: "국가공무원채용시스템·인사혁신처 공고" },
          { label: "지방직 9급", blurb: "해당 지방자치단체 채용 공고" },
        ],
      },
    ],
  },
  subjects: {
    title: "과목",
    groups: [
      {
        name: "필기 과목 중",
        items: [{ name: "영어", round: "필수", note: "9급 공채 필기" }],
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "영어는 9급 필기 필수과목 중 하나로 객관식입니다. 문항 수·배점은 해당 채용 공고의 과목표를 확인하세요.",
    ],
    bullets: [
      "원서·일정은 공무원 채용 공고를 따릅니다.",
      "한국사능력검정 대체 제도와는 별개로, 영어는 통상 필기로 응시합니다.",
      "일부 직렬·채용에서는 과목 구성이 다를 수 있습니다.",
    ],
  },
  timetable: {
    title: "2026년 국가직 9급 필기 (영어 포함)",
    rows: [
      { label: "필기 전체", detail: "10:00～11:50 (110분) · 2026.4.4. 시행 완료" },
    ],
  },
  schedule: {
    title: "시험 일정",
    items: [
      {
        label: "2026년 국가직 9급 필기",
        date: "2026-04-04",
        detail: "원서 2026년 2월 2일～6일 · 영어만 따로 접수하지 않음 (시행 완료)",
      },
      {
        label: "지방직·다음 연도",
        detail: "지역 공고 및 인사혁신처·gongmuwon.gosi.kr 최신 공고를 확인하세요.",
      },
    ],
    note: "영어 단독 시험일이 없습니다. 공무원 필기일을 기준으로 하세요.",
  },
  application: {
    title: "원서 접수",
    where: "국가직 — 국가공무원채용시스템 / 지방직 — 해당 지방 채용 시스템",
    how: [
      "9급 공채(국가직 또는 지방직) 공고에서 직렬·과목·일정을 확인합니다.",
      "해당 접수 사이트에서 원서를 제출합니다.",
      "영어는 필기 과목이므로 별도 영어 시험 원서는 없습니다.",
    ],
    links: [
      {
        label: "국가공무원채용시스템",
        href: "https://gongmuwon.gosi.kr",
        external: true,
      },
      { label: "공무원 시험 안내 보기", href: "/public-service/intro" },
    ],
  },
  officialLinks: [
    {
      label: "국가공무원채용시스템",
      href: "https://gongmuwon.gosi.kr",
      external: true,
    },
    { label: "인사혁신처", href: "https://www.mpm.go.kr", external: true },
  ],
  relatedLinks: [
    { label: "FAQ", href: "/english/faq" },
    { label: "커뮤니티", href: "/english/community" },
    { label: "공무원 시험 안내", href: "/public-service/intro" },
  ],
  sources: [
    {
      label: "공무원(국가직 9급) 시험 안내와 동일 출처",
      href: "/public-service/intro",
      note: "영어는 9급 필기 과목이므로 공고·일정은 공무원 소개 페이지의 근거를 따릅니다.",
    },
  ],
  seoDescription:
    "9급 공무원 영어 과목 안내, 국가직·지방직 일정과 원서 접수처. 봄기출에서 선지별 해설 기출 학습을 이어가세요.",
};
