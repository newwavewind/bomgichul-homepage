import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

export const firefighterIntro: ExamIntro = {
  id: "firefighter",
  eyebrow: "소방공무원 공개경쟁채용",
  title: "소방공무원 시험 안내",
  summary:
    "소방공무원 공개경쟁채용 필기(소방학개론·소방관계법규·행정법총론) 기출을 앱과 같이 세 과목으로 제공합니다. 최신 공고·원서는 사이버국가고시센터에서 확인하세요.",
  hubHref: "/firefighter",
  hubCta: "소방 학습 시작",
  conceptsHref: "/firefighter/concepts/sobang",
  conceptsCta: "소방학개론 올인원 보기",
  lastVerified: "2026-09-23",
  disclaimer: EXAM_INTRO_DISCLAIMER,
  administrator: {
    name: "인사혁신처 · 소방청 (원서: 사이버국가고시센터)",
    description:
      "국가직 소방공무원 공개경쟁채용은 인사혁신처·소방청 소관이며, 원서·공고·기출 원본은 사이버국가고시센터에서 확인합니다. 본 사이트·앱은 정부와 제휴·파트너십이 없는 민간 학습 보조 도구입니다.",
  },
  tracks: {
    title: "채용·응시 구분",
    description:
      "소방공무원 공개경쟁채용은 공채·경채 등으로 나뉘며, 필기 과목 구성은 공고에 따릅니다. 봄기출 소방공무원 앱·웹은 소방학개론·소방관계법규·행정법총론 기출을 제공합니다.",
    groups: [
      {
        name: "필기 과목 (봄기출 소방 = 앱과 동일 3과목)",
        items: [
          { label: "소방학개론", blurb: "소방 공채 필기 기출 · 해설" },
          { label: "소방관계법규", blurb: "소방 관련 법령 기출 · 해설" },
          { label: "행정법총론", blurb: "공통 필기 과목 · 공무원 트랙과 동일 원본" },
        ],
      },
    ],
  },
  subjects: {
    title: "필기 과목",
    description:
      "앱(봄기출 소방공무원)과 같은 세 과목입니다. 실제 응시 과목·배점은 해당 연도 공고를 확인하세요.",
    groups: [
      {
        name: "봄기출 소방공무원 (3과목)",
        items: [
          { name: "소방학개론", round: "필기", note: "기출 OX · 개념" },
          { name: "소방관계법규", round: "필기", note: "기출 OX · 개념" },
          { name: "행정법총론", round: "필기", note: "기출 OX · 개념" },
        ],
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "국가직 소방 공채 필기는 객관식 형태로 시행되며, 과목·문항 수·배점은 공고마다 달라질 수 있습니다. 봄기출은 공개된 기출 지문을 O·X와 해설로 풀어 보는 학습 도구입니다.",
    ],
    bullets: [
      "최신 공고·원서: 사이버국가고시센터 https://www.gosi.kr",
      "인사혁신처 https://www.mpm.go.kr",
      "본 서비스는 정부 공식 앱이 아닙니다",
    ],
  },
  schedule: {
    title: "시험 일정",
    items: [
      {
        label: "공고·원서",
        detail: "해당 연도 사이버국가고시센터 공고 기준",
      },
      {
        label: "필기",
        detail: "공고에 명시된 일시·과목 구성",
      },
    ],
    note: "일정·과목·수수료는 공고마다 달라질 수 있습니다. 원서 접수 전 최신 공고문을 확인하세요.",
  },
  application: {
    title: "원서 접수",
    where: "사이버국가고시센터",
    how: [
      "https://www.gosi.kr 에서 해당 회차 소방공무원 공고를 확인합니다.",
      "공고에 안내된 접수 기간·방법·수수료를 따릅니다.",
      "필기 과목·가산점·응시자격은 공고와 관련 법령을 기준으로 합니다.",
    ],
    links: [
      { label: "사이버국가고시센터", href: "https://www.gosi.kr", external: true },
      { label: "인사혁신처", href: "https://www.mpm.go.kr", external: true },
    ],
  },
  fees: {
    title: "응시수수료",
    items: [{ label: "해당 연도 공고 기준", amount: "공고 확인" }],
    note: "면제·감면 대상은 공고를 확인하세요.",
  },
  officialLinks: [
    { label: "사이버국가고시센터", href: "https://www.gosi.kr", external: true },
    { label: "인사혁신처", href: "https://www.mpm.go.kr", external: true },
  ],
  relatedLinks: [
    { label: "FAQ", href: "/firefighter/faq" },
    { label: "커뮤니티", href: "/firefighter/community" },
    { label: "공무원(공통 과목)", href: "/public-service" },
  ],
  sources: [
    {
      label: "사이버국가고시센터",
      href: "https://www.gosi.kr",
      note: "공고·원서·기출 원본",
    },
    {
      label: "인사혁신처",
      href: "https://www.mpm.go.kr",
    },
  ],
  seoDescription:
    "소방공무원 공개경쟁채용 소방학개론·소방관계법규·행정법총론 기출과 해설, 시험 안내. 봄기출 소방공무원.",
};
