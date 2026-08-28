import {
  PUBLIC_SERVICE_SERIES,
  PUBLIC_SERVICE_SUBJECT_LABELS,
} from "@/data/public-service/series";
import { EXAM_INTRO_DISCLAIMER, type ExamIntro } from "./types";

function seriesSubjects(subjectIds: string[]): string[] {
  return subjectIds.map((id) => PUBLIC_SERVICE_SUBJECT_LABELS[id] ?? id);
}

const seriesGroups = (() => {
  const grouped = new Map<string, typeof PUBLIC_SERVICE_SERIES>();
  for (const series of PUBLIC_SERVICE_SERIES) {
    const current = grouped.get(series.group) ?? [];
    grouped.set(series.group, [...current, series]);
  }
  return [...grouped.entries()].map(([name, items]) => ({
    name,
    items: items.map((series) => ({
      label: series.label,
      blurb: series.blurb,
      subjects: seriesSubjects(series.subjectIds),
    })),
  }));
})();

export const publicServiceIntro: ExamIntro = {
  id: "public-service",
  eyebrow: "9급 공무원 공개경쟁채용",
  title: "공무원 시험 안내",
  summary:
    "2026년 국가직 9급 공채는 필기(2026.4.4.)까지 진행되었습니다. 인사혁신처·국가공무원채용시스템 공고 기준으로 직렬·과목·일정을 정리했습니다. 다음 연도 일정은 최신 공고를 확인하세요.",
  hubHref: "/public-service",
  hubCta: "공무원 학습 시작",
  conceptsHref: "/public-service/concepts/hangjunghak",
  conceptsCta: "행정학 올인원 보기",
  lastVerified: "2026-08-25",
  disclaimer: EXAM_INTRO_DISCLAIMER,
  administrator: {
    name: "인사혁신처 · 국가공무원채용시스템 (국가직) / 지방자치단체 (지방직)",
    description:
      "국가직 9급 공개경쟁채용은 인사혁신처가 주관합니다. 2026년부터 원서·시험장소 안내는 국가공무원채용시스템(gongmuwon.gosi.kr)을 중심으로 안내되었습니다. 지방직은 시·도 등 지방자치단체 공고·접수를 따릅니다.",
  },
  tracks: {
    title: "주요 직렬",
    description:
      "직렬마다 전문과목 2과목이 달라집니다. 아래는 봄기출에서 다루는 대표 직렬이며, 실제 공고의 직렬·과목 표기를 함께 확인하세요.",
    groups: seriesGroups,
  },
  subjects: {
    title: "시험 과목",
    description:
      "9급 공채 필기는 필수과목과 직렬 전문과목으로 구성됩니다. 필수과목·배점·문항 수는 해당 연도 공고의 과목표를 기준으로 하세요.",
    groups: [
      {
        name: "필수과목 (일반)",
        items: [
          { name: "국어", round: "필수", note: "공고 과목표 확인" },
          { name: "영어", round: "필수", note: "공고 과목표 확인" },
          {
            name: "한국사",
            round: "필수",
            note: "능력검정 대체는 연도·공고 확인(’27년 대체 예정 안내 있음)",
          },
        ],
      },
      {
        name: "봄기출에서 다루는 전문·관련 과목",
        items: Object.values(PUBLIC_SERVICE_SUBJECT_LABELS).map((name) => ({
          name,
          round: "전문",
        })),
      },
    ],
  },
  format: {
    title: "시험 형식",
    paragraphs: [
      "국가직 9급은 필기 후 면접 등 후속 전형으로 이어집니다. 2026년 필기는 오전 10시～11시 50분(110분)으로 공고되었습니다.",
      "국가직과 지방직은 접수 창구·일정이 다르므로, 지원 공고의 과목표·응시자격을 기준으로 준비하세요.",
    ],
    bullets: [
      "필기 → 면접(및 공고상 기타 전형)",
      "시험 당일 응시표·실물 신분증 지참(모바일 신분증 불인정으로 안내된 바 있음 — 최신 공고 확인)",
      "직렬마다 전문과목 조합이 다르므로 응시 직렬을 먼저 정하세요",
    ],
  },
  timetable: {
    title: "2026년 국가직 9급 필기 시간",
    rows: [
      { label: "입실", detail: "09:20까지 (시험실 08:00 이후 개방)" },
      { label: "필기", detail: "10:00～11:50 (110분) · 2026.4.4." },
    ],
  },
  eligibility: {
    title: "응시자격",
    paragraphs: [
      "응시자격·결격·연령 등은 「공무원임용시험령」과 해당 연도 공고를 따릅니다. 직렬별 가산·자격증 요건도 공고를 확인하세요.",
    ],
  },
  schedule: {
    title: "시험 일정 (2026년 국가직 9급)",
    items: [
      {
        label: "원서 접수",
        detail: "2026년 2월 2일 09:00 ～ 2월 6일 21:00 (접수 완료)",
      },
      {
        label: "필기시험",
        date: "2026-04-04",
        detail: "합격자 발표 2026년 5월 8일 (시행 완료)",
      },
      {
        label: "면접시험",
        detail: "2026년 5월 28일～6월 2일 · 면접 합격 발표 6월 19일",
      },
      {
        label: "지방직 9급",
        detail: "시·도별 공고 시기가 다릅니다. 지원 지역 지방공무원 채용 공고를 확인하세요.",
      },
      {
        label: "다음 연도",
        detail: "2027년 일정은 인사혁신처·국가공무원채용시스템 공고를 확인하세요.",
      },
    ],
    note: "2026년 일정은 인사혁신처 공개 안내(정부24·정책브리핑 등) 및 필기 일시·장소 공고 보도 기준입니다. 원서·장소는 gongmuwon.gosi.kr 공지를 우선하세요.",
  },
  application: {
    title: "원서 접수",
    where: "국가직 — 국가공무원채용시스템(gongmuwon.gosi.kr) / 지방직 — 해당 지방 채용 시스템",
    how: [
      "지원할 채용 구분(국가직·지방직)과 직렬을 정합니다.",
      "공고에서 응시자격·과목·접수 기간·수수료를 확인합니다.",
      "국가직은 국가공무원채용시스템에서 온라인 원서를 제출합니다.",
      "지방직은 공고에 안내된 접수 사이트에서 원서를 제출합니다.",
    ],
    links: [
      {
        label: "국가공무원채용시스템",
        href: "https://gongmuwon.gosi.kr",
        external: true,
      },
      {
        label: "사이버국가고시센터",
        href: "https://www.gosi.kr",
        external: true,
      },
      {
        label: "인사혁신처",
        href: "https://www.mpm.go.kr",
        external: true,
      },
    ],
  },
  officialLinks: [
    {
      label: "국가공무원채용시스템",
      href: "https://gongmuwon.gosi.kr",
      external: true,
    },
    { label: "사이버국가고시센터", href: "https://www.gosi.kr", external: true },
    { label: "인사혁신처", href: "https://www.mpm.go.kr", external: true },
  ],
  relatedLinks: [
    { label: "FAQ", href: "/public-service/faq" },
    { label: "커뮤니티", href: "/public-service/community" },
  ],
  sources: [
    {
      label: "국가공무원 9급 공채 경쟁률 안내 (정부24 · 인사혁신처)",
      href: "https://www.gov.kr/portal/ntnadmNews/4637259",
      note: "원서 접수 결과·필기일(4.4.)·시험장소 안내 채널(gongmuwon.gosi.kr)",
    },
    {
      label: "2026년 국가공무원 채용 규모·일정 (정책브리핑)",
      href: "https://www.korea.kr/multi/visualNewsView.do?newsId=148957959",
      note: "원서 2.2～2.6 · 필기 4.4 · 필기합격 5.8 · 면접 5.28～6.2 · 면접합격 6.19",
    },
  ],
  seoDescription:
    "9급 공무원 국가직·지방직 직렬, 필수·전문과목, 2026년 일정과 국가공무원채용시스템 원서 안내. 봄기출에서 과목별 기출 학습으로 이어가세요.",
};
