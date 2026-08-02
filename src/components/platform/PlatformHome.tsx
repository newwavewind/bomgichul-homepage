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
] as const;

export function PlatformHome() {
  return (
    <div className="relative overflow-hidden px-4 py-10 md:py-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[68rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(15,118,110,0.09),transparent_65%)]" />
      <div className="relative mx-auto max-w-[var(--page-max-width)]">
        <h1 className="sr-only">공무원·공인중개사 기출 학습</h1>
        <p className="sr-only">
          국가직·지방직 9급 공무원과 공인중개사 시험의 과목별 기출문제와 핵심 개념을 무료로 학습하세요.
        </p>

        <section className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2" aria-label="시험 선택">
          {exams.map((exam) => (
            <Link
              key={exam.href}
              href={exam.href}
              className={`group relative min-h-[320px] overflow-hidden rounded-[28px] border-[1.5px] border-carbon bg-gradient-to-br ${exam.accent} p-7 shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-1 md:p-9`}
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
              <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between rounded-2xl bg-carbon px-5 py-3.5 text-paper md:bottom-9 md:left-9 md:right-9">
                <span className="font-display text-body-sm font-semibold">{exam.cta}</span>
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
