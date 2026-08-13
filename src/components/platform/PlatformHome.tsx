import Link from "next/link";

const exams = [
  {
    href: "/public-service",
    eyebrow: "9급 공무원",
    title: "공무원",
    description: "국가직·지방직 기출을 과목별로 이어 공부하세요.",
    meta: "16개 과목 · 국가직·지방직",
    accent: "from-[#e8f5ff] to-[#f4f8ff]",
    cta: "공무원 학습 시작",
  },
  {
    href: "/real-estate",
    eyebrow: "제37회 공인중개사",
    title: "공인중개사",
    description: "1·2차 전 과목의 개념과 10년 기출을 한곳에서 학습하세요.",
    meta: "6개 과목 · 2016~2025",
    accent: "from-[#e8faf5] to-[#f4fbf8]",
    cta: "공인중개사 학습 시작",
  },
  {
    href: "/police",
    eyebrow: "순경 공채",
    title: "경찰공무원",
    description: "헌법·형사법·경찰학 기출을 회차별로 이어 공부하세요.",
    meta: "3개 과목 · 2022~2026",
    accent: "from-[#eef2ff] to-[#f7f8ff]",
    cta: "경찰 학습 시작",
  },
  {
    href: "/housing",
    eyebrow: "주택관리사보",
    title: "주택관리사",
    description: "1·2차 전 과목 기출과 개념을 한곳에서 학습하세요.",
    meta: "5개 과목 · 2020~2025",
    accent: "from-[#fff4e8] to-[#fffaf4]",
    cta: "주택관리사 학습 시작",
  },
  {
    href: "/social-worker",
    eyebrow: "국가전문자격",
    title: "사회복지사 1급",
    description: "8개 영역의 핵심 개념과 10개년 기출을 한곳에서 학습하세요.",
    meta: "8개 과목 · 2017~2026 · 2,000문항",
    accent: "from-[#fff0f5] to-[#fff8fb]",
    cta: "사회복지사 학습 시작",
  },
] as const;

export function PlatformHome() {
  return (
    <div className="relative overflow-hidden px-4 py-10 md:py-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[68rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(15,118,110,0.09),transparent_65%)]" />
      <div className="relative mx-auto max-w-[var(--page-max-width)]">
        <h1 className="sr-only">공무원·공인중개사·경찰·주택관리사·사회복지사 1급 기출 학습</h1>
        <p className="sr-only">
          9급 공무원, 공인중개사, 경찰공무원, 주택관리사, 사회복지사 1급 시험의 과목별 기출문제와 핵심 개념을 무료로 학습하세요.
        </p>

        <section className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2" aria-label="시험 선택">
          {exams.map((exam) => (
            <Link
              key={exam.href}
              href={exam.href}
              className={`group flex min-h-[300px] flex-col overflow-hidden rounded-[28px] border-[1.5px] border-carbon bg-gradient-to-br ${exam.accent} p-7 shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-1 md:p-9`}
            >
              <div>
                <p className="font-display text-[13px] font-semibold tracking-[0.04em] text-fog">
                  {exam.eyebrow}
                </p>
                <h2 className="mt-2 font-display text-[34px] font-semibold tracking-tight text-ink md:text-[40px]">
                  {exam.title}
                </h2>
              </div>
              <p className="mt-8 max-w-sm font-display text-body text-smoke">{exam.description}</p>
              <p className="mt-3 font-display text-body-sm font-semibold text-ink">{exam.meta}</p>
              <div className="mt-auto pt-8">
                <div className="flex items-center justify-between rounded-2xl bg-carbon px-5 py-3.5 text-paper">
                  <span className="font-display text-body-sm font-semibold">{exam.cta}</span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
