import Link from "next/link";
import { PersonalStudyHome } from "@/components/platform/PersonalStudyHome";
import type { PersonalHomeData } from "@/lib/personal-home";

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
  {
    href: "/history",
    eyebrow: "국가공인 · 심화",
    title: "한국사능력검정",
    description: "문항마다 그 시대를 통째로 정리한 핵심 개념 카드가 함께 붙습니다.",
    meta: "심화 · 75~79회 · 250문항",
    // 앞 다섯 카드가 파랑(206°)·민트(163°)·남보라(226°)·주황(31°)·분홍(340°)을 쓰고 있어
    // 색상환에서 가장 비어 있던 연둣빛(95°)을 골랐다 — 어느 카드와도 60° 넘게 떨어진다.
    accent: "from-[#f0ffe5] to-[#f8fff2]",
    cta: "한국사 학습 시작",
  },
  {
    href: "/english",
    eyebrow: "9급 공채 · 국가직 · 지방직",
    title: "공무원 영어",
    description: "선지마다 왜 맞고 틀리는지 적었고, 지문 해석과 챙길 어휘가 같은 화면에 붙습니다.",
    meta: "9급 영어 · 2017~2026 · 400문항",
    // 앞 여섯이 31°·95°·163°·206°·226°·340° 를 쓰고 있어, 일곱 번째는 60° 규칙을
    // 지킬 수가 없다 — 가장 벌어진 틈이 226°~340° 인데 그 한가운데도 57° 다.
    // 그래서 규칙을 지키는 대신 최소 간격이 가장 큰 자리(283°)를 골랐다.
    accent: "from-[#f6f0ff] to-[#fbf8ff]",
    cta: "공무원 영어 학습 시작",
  },
] as const;

export function PlatformHome({ user, personalHome }: { user?: { nickname: string } | null; personalHome?: PersonalHomeData | null }) {
  return (
    <div className="relative overflow-hidden bg-white px-4 py-10 md:py-16">
      <div className="relative mx-auto max-w-[var(--page-max-width)]">
        {user && personalHome ? <PersonalStudyHome nickname={user.nickname} data={personalHome} /> : (
          <section className="mx-auto mb-10 max-w-5xl text-center">
            <p className="font-display text-[13px] font-semibold tracking-[0.05em] text-[#087f6d]">기출에서 시작하는 합격 루틴</p>
            <h1 className="mt-3 font-display text-[34px] font-semibold tracking-tight text-ink md:text-[48px]">한 번 푼 문제도, 다음 학습으로 이어지게</h1>
            <p className="mx-auto mt-3 max-w-2xl font-display text-body text-smoke">로그인하면 오답·북마크·최근 학습이 자동으로 모이고, 연속 학습일과 함께 나만의 학습 흐름을 이어갈 수 있어요.</p>
            <Link href="/login" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-carbon px-6 font-display text-body-sm font-semibold text-paper">Google로 시작하기</Link>
          </section>
        )}
        <h1 className="sr-only">공무원·공인중개사·경찰·주택관리사·사회복지사 1급·한국사능력검정·공무원 영어 기출 학습</h1>
        <p className="sr-only">
          9급 공무원, 공인중개사, 경찰공무원, 주택관리사, 사회복지사 1급, 한국사능력검정, 공무원 영어 시험의 과목별 기출문제와 핵심 개념을 무료로 학습하세요.
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
