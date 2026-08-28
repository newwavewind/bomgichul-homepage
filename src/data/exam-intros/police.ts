import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

export const policeIntro: ExamIntro = {
  id: "police",
  eyebrow: "경찰공무원 순경 공개채용",
  title: "경찰공무원 시험 안내",
  summary:
    "중앙경찰학교 공고 제2026-11호(2026년 제2차 순경 공채) 기준으로 필기 과목, 전형 일정, 합격 결정, 응시수수료를 정리했습니다. 제2차 필기는 2026년 8월 22일 시행이 완료되었습니다.",
  hubHref: "/police",
  hubCta: "경찰 학습 시작",
  conceptsHref: "/police/concepts/constitution",
  conceptsCta: "헌법 올인원 보기",
  lastVerified: "2026-08-25",
  disclaimer: EXAM_INTRO_DISCLAIMER,
  administrator: {
    name: "경찰청 · 중앙경찰학교 (원서: 경찰청 인터넷 원서접수)",
    description:
      "순경 공개경쟁채용은 경찰청·중앙경찰학교가 공고합니다. 원서는 경찰청 인터넷 원서접수 사이트(gosi.police.go.kr → public.jinhakapply.com)에서 받습니다.",
  },
  tracks: {
    title: "채용·응시 구분",
    description:
      "제2차 공채는 일반 3,031명·101경비단(남자) 90명 등 총 3,121명을 선발합니다. 거주지와 관계없이 근무 희망 시·도경찰청에 지원할 수 있습니다. 봄기출은 순경 공채 필기(헌법·형사법·경찰학) 기출을 중심으로 제공합니다.",
    groups: [
      {
        name: "전형 단계",
        items: [
          { label: "1차 필기", blurb: "2026.8.22. 10:00～11:40 · 합격 발표 8.28. 17:00" },
          { label: "2차 신체검사", blurb: "2026.9.7.～10.23." },
          { label: "3차 체력검사", blurb: "순환식 체력검사 · 신체검사와 같은 기간대" },
          {
            label: "4차 종합적성·면접",
            blurb: "적성 10.24. · 면접 11.9.～12.8. · 최종합격 12.11. 17:00",
          },
        ],
      },
    ],
  },
  subjects: {
    title: "필기 과목",
    description:
      "필수과목 필기와 한국사·영어 능력검정시험 성적 제출이 함께 요구됩니다.",
    groups: [
      {
        name: "필수과목 (필기)",
        items: [
          { name: "헌법", round: "필기", note: "20문항 · 50점" },
          { name: "형사법", round: "필기", note: "40문항 · 100점" },
          { name: "경찰학", round: "필기", note: "40문항 · 100점" },
        ],
      },
      {
        name: "능력검정 (성적 제출)",
        items: [
          {
            name: "한국사능력검정시험",
            note: "3급 이상 · 필기 전날(8.21.)까지 발표된 성적",
          },
          {
            name: "영어능력검정시험",
            note: "TOEIC·TOEFL·TEPS·G-TELP·FLEX·TOSEL 등 · 공고의 기준점수 표 확인",
          },
        ],
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "필기 → 신체검사 → 체력검사 → 종합적성검사·면접 순입니다. 최종합격은 필기 50%, 체력검사 25%(무도 자격증 점수 포함), 면접 25%를 합산해 고득점자 순으로 결정합니다.",
    ],
    bullets: [
      "필기 합격: 시·도경찰청별 최종 선발예정인원의 2배수(동점 시 전원 합격)",
      "필기 결정: 한능검·영어 기준 충족 + 필수과목별 만점의 40% 이상 득점자 중 고득점 순",
      "시험 당일 09:20까지 입실",
    ],
  },
  timetable: {
    title: "필기 시간표 (제2차)",
    rows: [
      { label: "입실", detail: "09:20까지" },
      { label: "필기시험", detail: "10:00～11:40 (2026.8.22.)" },
    ],
  },
  passingCriteria: {
    title: "합격·선발 기준",
    bullets: [
      "필기: 한국사·영어 능력검정 기준 충족 + 헌법·형사법·경찰학 각 과목 만점의 40% 이상 득점자 중 고득점 순(선발예정 인원 2배수)",
      "최종: 필기 50% + 체력 25% + 면접 25% 합산 고득점 순",
      "면접: 평가 총점 40% 이상(위원 과반수가 한 요소를 2점 이하로 평가하면 불합격)",
    ],
  },
  fees: {
    title: "응시수수료",
    items: [{ label: "순경 공채(경장 이하)", amount: "5,000원" }],
    note: "경찰공무원 임용령 제44조. 국민기초생활수급자·차상위·한부모가족 보호대상자·미성년 자녀 2명 이상 등은 면제(공고 확인). 결제수수료는 별도.",
  },
  eligibility: {
    title: "응시자격 요약",
    paragraphs: [
      "세부 연령·신체 기준·결격사유는 공고 붙임과 「경찰공무원 임용령」을 확인하세요.",
    ],
    bullets: [
      "제1종 대형 또는 보통 운전면허 보유(최종시험예정일 2026.12.8.까지 유효)",
      "병역: 제한 없음",
      "한국사능력검정 3급 이상 · 영어능력검정 기준점수 이상(필기 전날까지 발표분)",
      "복수국적·자격정지 이상 형 등 결격, 부정행위로 응시 제한된 자는 불가",
    ],
  },
  schedule: {
    title: "시험 일정 (2026년 제2차)",
    items: [
      {
        label: "원서 접수",
        detail: "2026년 7월 10일～7월 20일 18:00 (접수 마감)",
      },
      {
        label: "필기시험",
        date: "2026-08-22",
        detail: "10:00～11:40 · 합격 발표 8월 28일 17:00 (시행 완료)",
      },
      {
        label: "신체·체력검사",
        detail: "2026년 9월 7일～10월 23일",
      },
      {
        label: "종합적성검사 · 면접 · 최종합격",
        date: "2026-12-11",
        detail: "적성 10월 24일 · 면접 11월 9일～12월 8일 · 최종 발표 12월 11일 17:00",
      },
    ],
    note: "중앙경찰학교 공고 제2026-11호(2026.7.10) 기준. 장소·세부 일정은 접수한 시·도경찰청 홈페이지 공지를 따릅니다.",
  },
  application: {
    title: "원서 접수",
    where: "경찰청 인터넷 원서접수 사이트",
    how: [
      "https://public.jinhakapply.com/PoliceV2/Main.aspx (또는 gosi.police.go.kr)에서 해당 회차 공고·첨부 공고문을 확인합니다.",
      "접수 마감 시각까지 응시수수료 결제와 접수번호 확인이 되어야 정상 접수입니다.",
      "한국사·영어 성적은 원서에 정확히 기재하고, 미발표 성적 등은 공고의 추가 등록 기간을 확인합니다.",
    ],
    links: [
      {
        label: "경찰청 인터넷 원서접수",
        href: "https://public.jinhakapply.com/PoliceV2/Main.aspx",
        external: true,
      },
      { label: "경찰청", href: "https://www.police.go.kr", external: true },
      { label: "중앙경찰학교", href: "https://www.cpa.go.kr", external: true },
    ],
  },
  officialLinks: [
    {
      label: "경찰청 인터넷 원서접수",
      href: "https://public.jinhakapply.com/PoliceV2/Main.aspx",
      external: true,
    },
    { label: "경찰청", href: "https://www.police.go.kr", external: true },
  ],
  relatedLinks: [
    { label: "FAQ", href: "/police/faq" },
    { label: "커뮤니티", href: "/police/community" },
  ],
  sources: [
    {
      label: "2026년 제2차 경찰공무원(순경) 공개경쟁채용시험 공고 (중앙경찰학교 공고 제2026-11호)",
      href: "https://public.jinhakapply.com/PoliceV2/Notice/View.aspx?CategoryID=11&CurrentPage=1&QANdx=141027",
      note: "2026.7.10 공고 · 첨부 HWP 공고문 기준 (일정·과목·합격·수수료·응시자격)",
    },
    {
      label: "응시수수료 안내 (경장 이하 5,000원)",
      href: "https://public.jinhakapply.com/PoliceV2/useinfo/useinfo03.aspx",
    },
  ],
  seoDescription:
    "2026년 제2차 순경 공채 필기 과목(헌법·형사법·경찰학), 전형 일정, 합격 기준, 응시료 안내. 봄기출에서 기출 학습을 이어가세요.",
};
