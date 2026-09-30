import Link from "next/link";
import { ExamCalendar } from "@/components/platform/ExamCalendar";
import { PastExamPdfSearch } from "@/components/platform/PastExamPdfSearch";
import { PersonalHomeGate } from "@/components/platform/PersonalHomeGate";

const exams = [
  {
    href: "/public-service/intro",
    learnHref: "/public-service",
    conceptsHref: "/public-service/concepts/hangjunghak",
    conceptsLabel: "행정학 핵심 개념",
    eyebrow: "9급 공무원",
    title: "공무원",
    accentFrom: "#e8f5ff",
    accentTo: "#f4f8ff",
    cta: "공무원 알아보기",
  },
  {
    href: "/real-estate/intro",
    learnHref: "/real-estate",
    conceptsHref: "/concepts/broker-law",
    conceptsLabel: "중개사법 핵심 개념",
    eyebrow: "제37회 공인중개사",
    title: "공인중개사",
    accentFrom: "#e8faf5",
    accentTo: "#f4fbf8",
    cta: "공인중개사 알아보기",
  },
  {
    href: "/police/intro",
    learnHref: "/police",
    conceptsHref: "/police/concepts/constitution",
    conceptsLabel: "헌법 핵심 개념",
    eyebrow: "순경 공채",
    title: "경찰공무원",
    accentFrom: "#eef2ff",
    accentTo: "#f7f8ff",
    cta: "경찰 알아보기",
  },
  {
    href: "/firefighter/intro",
    learnHref: "/firefighter",
    conceptsHref: "/firefighter/concepts/sobang",
    conceptsLabel: "소방학개론 핵심 개념",
    eyebrow: "소방 공채",
    title: "소방공무원",
    // 경찰(226°) 다음 칸 — 따뜻한 앰버로 구분
    accentFrom: "#fff7e8",
    accentTo: "#fffbf2",
    cta: "소방 알아보기",
  },
  {
    href: "/housing/intro",
    learnHref: "/housing",
    conceptsHref: "/housing/concepts/accounting",
    conceptsLabel: "회계원리 핵심 개념",
    eyebrow: "주택관리사보",
    title: "주택관리사",
    accentFrom: "#fff4e8",
    accentTo: "#fffaf4",
    cta: "주택관리사 알아보기",
  },
  {
    href: "/social-worker/intro",
    learnHref: "/social-worker",
    conceptsHref: "/social-worker/concepts/human-behavior",
    conceptsLabel: "인간행동 핵심 개념",
    eyebrow: "국가전문자격",
    title: "사회복지사 1급",
    accentFrom: "#fff0f5",
    accentTo: "#fff8fb",
    cta: "사회복지사 알아보기",
  },
  {
    href: "/history/intro",
    learnHref: "/history",
    conceptsHref: "/history/concepts",
    conceptsLabel: "핵심 개념 모아보기",
    eyebrow: "국가공인 · 심화",
    title: "한국사능력검정",
    // 앞 다섯 카드가 파랑(206°)·민트(163°)·남보라(226°)·주황(31°)·분홍(340°)을 쓰고 있어
    // 색상환에서 가장 비어 있던 연둣빛(95°)을 골랐다 — 어느 카드와도 60° 넘게 떨어진다.
    accentFrom: "#f0ffe5",
    accentTo: "#f8fff2",
    cta: "한국사 알아보기",
  },
  {
    href: "/english/intro",
    learnHref: "/english",
    conceptsHref: "/english",
    conceptsLabel: "영어 기출 허브",
    eyebrow: "9급 공채 · 국가직 · 지방직",
    title: "공무원 영어",
    // 앞 여섯이 31°·95°·163°·206°·226°·340° 를 쓰고 있어, 일곱 번째는 60° 규칙을
    // 지킬 수가 없다 — 가장 벌어진 틈이 226°~340° 인데 그 한가운데도 57° 다.
    // 그래서 규칙을 지키는 대신 최소 간격이 가장 큰 자리(283°)를 골랐다.
    accentFrom: "#f6f0ff",
    accentTo: "#fbf8ff",
    cta: "공무원 영어 알아보기",
  },
  {
    href: "/gugeo/intro",
    learnHref: "/gugeo",
    conceptsHref: "/gugeo",
    conceptsLabel: "국어 기출 허브",
    eyebrow: "9급 공채 · 국가직 · 지방직",
    title: "공무원 국어",
    accentFrom: "#e8f9ff",
    accentTo: "#f4fcff",
    cta: "공무원 국어 알아보기",
  },
  {
    href: "/haengjeongsa/intro",
    learnHref: "/haengjeongsa",
    conceptsHref: "/haengjeongsa",
    conceptsLabel: "행정사 기출 허브",
    eyebrow: "국가전문자격 · 1차",
    title: "행정사",
    accentFrom: "#e8faf7",
    accentTo: "#f4fbf9",
    cta: "행정사 알아보기",
  },
  {
    href: "/semusa/intro",
    learnHref: "/semusa",
    conceptsHref: "/semusa",
    conceptsLabel: "세무사 기출 허브",
    eyebrow: "국가전문자격 · 1차",
    title: "세무사",
    accentFrom: "#fff4e8",
    accentTo: "#fffaf4",
    cta: "세무사 알아보기",
  },
  {
    href: "/sanan/intro",
    learnHref: "/sanan",
    conceptsHref: "/sanan",
    conceptsLabel: "산업안전지도사 기출 허브",
    eyebrow: "국가전문자격 · 1차",
    title: "산업안전지도사",
    accentFrom: "#fff7e6",
    accentTo: "#fffbf2",
    cta: "산업안전지도사 알아보기",
  },
  {
    href: "/sonhae/intro",
    learnHref: "/sonhae",
    conceptsHref: "/sonhae",
    conceptsLabel: "손해평가사 기출 허브",
    eyebrow: "국가전문자격 · 1차",
    title: "손해평가사",
    accentFrom: "#eefbe8",
    accentTo: "#f6fcf2",
    cta: "손해평가사 알아보기",
  },
  {
    href: "/nomusa/intro",
    learnHref: "/nomusa",
    conceptsHref: "/nomusa",
    conceptsLabel: "공인노무사 기출 허브",
    eyebrow: "국가전문자격 · 1차",
    title: "공인노무사",
    accentFrom: "#eaf1ff",
    accentTo: "#f5f8ff",
    cta: "공인노무사 알아보기",
  },
] as const;

/** 학습 시작 — 차분한 블루(대비 유지, 채도↓) */
const learnCtaClass =
  "group/cta flex min-h-12 flex-1 items-center justify-center gap-1 rounded-[18px] border border-black/[0.04] bg-[#3b6fd4] px-3 py-3 text-center font-display text-[14px] font-semibold tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_2px_8px_rgba(36,59,83,0.1)] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#3463be] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_12px_rgba(36,59,83,0.12)] active:translate-y-0";

/** 알아보기 — 맑은 글래스 */
const introCtaClass =
  "group/cta flex min-h-12 flex-1 items-center justify-center gap-1 rounded-[18px] border border-black/[0.06] bg-white/70 px-3 py-3 text-center font-display text-[14px] font-semibold tracking-tight text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_8px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_6px_16px_rgba(15,23,42,0.07)] active:translate-y-0";

export function PlatformHome() {
  return (
    <div className="relative overflow-hidden bg-white px-4 py-10 md:py-16">
      <div className="relative mx-auto max-w-[var(--page-max-width)]">
        <h1 className="mx-auto max-w-5xl text-2xl font-semibold mb-3">기출문제와 핵심 개념, 봄기출</h1>
        <p className="mx-auto max-w-5xl text-sm text-smoke mb-8">
          9급 공무원, 공인중개사, 경찰공무원, 소방공무원, 주택관리사, 사회복지사 1급, 한국사능력검정, 공무원 영어, 공무원 국어, 행정사, 세무사, 공인노무사, 손해평가사, 산업안전지도사 시험의 과목별 기출문제와 핵심 개념을 무료로 학습하세요.
        </p>

        <section id="exam-selection" className="mx-auto mb-10 grid max-w-5xl gap-5 md:grid-cols-2" aria-label="시험 선택">
          {exams.map((exam) => (
            <article
              key={exam.href}
              data-exam-card={exam.learnHref.slice(1)}
              className="flex flex-col overflow-hidden rounded-[28px] border-[1.5px] border-carbon p-7 shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-1 md:p-9"
              style={{
                backgroundImage: `linear-gradient(to bottom right, ${exam.accentFrom}, ${exam.accentTo})`,
              }}
            >
              <div>
                <p className="font-display text-[13px] font-semibold tracking-[0.04em] text-fog">
                  {exam.eyebrow}
                </p>
                <h2 className="mt-2 font-display text-[34px] font-semibold tracking-tight text-ink md:text-[40px]">
                  {exam.title}
                </h2>
              </div>
              <div className="mt-10 flex gap-2.5">
                <Link href={exam.learnHref} className={learnCtaClass} aria-label={`${exam.title} 학습 시작`}>
                  학습 시작
                  <span aria-hidden className="opacity-80 transition-transform group-hover/cta:translate-x-0.5">
                    →
                  </span>
                </Link>
                <Link href={exam.href} className={introCtaClass} aria-label={exam.cta}>
                  알아보기
                  <span aria-hidden className="opacity-55 transition-transform group-hover/cta:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
              <p className="mt-3 font-display text-[13px] text-smoke">
                <Link
                  href={exam.conceptsHref}
                  className="font-semibold text-ink underline decoration-mist underline-offset-4 transition-colors hover:decoration-carbon"
                >
                  {exam.conceptsLabel}
                </Link>
                <span className="text-fog"> · 핵심 개념·과목 허브로 바로 이동</span>
              </p>
            </article>
          ))}
        </section>

        {/* 로그인 시에만 「나의 학습 홈」 — 손님 환영판은 제거 */}
        <PersonalHomeGate guest={null} />

        <PastExamPdfSearch />

        <ExamCalendar />
      </div>
    </div>
  );
}
