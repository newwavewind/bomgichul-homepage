import Link from "next/link";
import { ExamCalendar } from "@/components/platform/ExamCalendar";
import { PersonalStudyHome } from "@/components/platform/PersonalStudyHome";
import type { PersonalHomeData } from "@/lib/personal-home";

const exams = [
  {
    href: "/public-service/intro",
    learnHref: "/public-service",
    eyebrow: "9급 공무원",
    title: "공무원",
    accent: "from-[#e8f5ff] to-[#f4f8ff]",
    cta: "공무원 알아보기",
  },
  {
    href: "/real-estate/intro",
    learnHref: "/real-estate",
    eyebrow: "제37회 공인중개사",
    title: "공인중개사",
    accent: "from-[#e8faf5] to-[#f4fbf8]",
    cta: "공인중개사 알아보기",
  },
  {
    href: "/police/intro",
    learnHref: "/police",
    eyebrow: "순경 공채",
    title: "경찰공무원",
    accent: "from-[#eef2ff] to-[#f7f8ff]",
    cta: "경찰 알아보기",
  },
  {
    href: "/housing/intro",
    learnHref: "/housing",
    eyebrow: "주택관리사보",
    title: "주택관리사",
    accent: "from-[#fff4e8] to-[#fffaf4]",
    cta: "주택관리사 알아보기",
  },
  {
    href: "/social-worker/intro",
    learnHref: "/social-worker",
    eyebrow: "국가전문자격",
    title: "사회복지사 1급",
    accent: "from-[#fff0f5] to-[#fff8fb]",
    cta: "사회복지사 알아보기",
  },
  {
    href: "/history/intro",
    learnHref: "/history",
    eyebrow: "국가공인 · 심화",
    title: "한국사능력검정",
    // 앞 다섯 카드가 파랑(206°)·민트(163°)·남보라(226°)·주황(31°)·분홍(340°)을 쓰고 있어
    // 색상환에서 가장 비어 있던 연둣빛(95°)을 골랐다 — 어느 카드와도 60° 넘게 떨어진다.
    accent: "from-[#f0ffe5] to-[#f8fff2]",
    cta: "한국사 알아보기",
  },
  {
    href: "/english/intro",
    learnHref: "/english",
    eyebrow: "9급 공채 · 국가직 · 지방직",
    title: "공무원 영어",
    // 앞 여섯이 31°·95°·163°·206°·226°·340° 를 쓰고 있어, 일곱 번째는 60° 규칙을
    // 지킬 수가 없다 — 가장 벌어진 틈이 226°~340° 인데 그 한가운데도 57° 다.
    // 그래서 규칙을 지키는 대신 최소 간격이 가장 큰 자리(283°)를 골랐다.
    accent: "from-[#f6f0ff] to-[#fbf8ff]",
    cta: "공무원 영어 알아보기",
  },
] as const;

/** 학습 시작 — 차분한 블루(대비 유지, 채도↓) */
const learnCtaClass =
  "group/cta flex min-h-12 flex-1 items-center justify-center gap-1 rounded-[18px] border border-black/[0.04] bg-[#3b6fd4] px-3 py-3 text-center font-display text-[14px] font-semibold tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_2px_8px_rgba(36,59,83,0.1)] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#3463be] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_12px_rgba(36,59,83,0.12)] active:translate-y-0";

/** 알아보기 — 맑은 글래스 */
const introCtaClass =
  "group/cta flex min-h-12 flex-1 items-center justify-center gap-1 rounded-[18px] border border-black/[0.06] bg-white/70 px-3 py-3 text-center font-display text-[14px] font-semibold tracking-tight text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_8px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_6px_16px_rgba(15,23,42,0.07)] active:translate-y-0";

export function PlatformHome({ user, personalHome }: { user?: { nickname: string } | null; personalHome?: PersonalHomeData | null }) {
  return (
    <div className="relative overflow-hidden bg-white px-4 py-10 md:py-16">
      <div className="relative mx-auto max-w-[var(--page-max-width)]">
        {user && personalHome ? <PersonalStudyHome nickname={user.nickname} data={personalHome} /> : (
          <section className="mx-auto mb-10 max-w-5xl text-center">
            <p className="font-display text-[13px] font-semibold tracking-[0.05em] text-[#087f6d]">시험을 고르고, 안내부터 확인하세요</p>
            <h1 className="mt-3 font-display text-[34px] font-semibold tracking-tight text-ink md:text-[48px]">직렬·과목·일정까지 보고 나서 기출로</h1>
            <p className="mx-auto mt-3 max-w-2xl font-display text-body text-smoke">
              아래에서 시험을 고르면 시행처·과목·원서 접수를 먼저 볼 수 있어요. 홈페이지 기능은 전부
              무료입니다. 로그인만 하면 오답노트·북마크·랜덤·복습·해설·PDF 다운로드까지 결제 없이
              쓸 수 있어요.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-carbon px-6 font-display text-body-sm font-semibold text-paper"
            >
              무료로 시작하기
            </Link>
          </section>
        )}
        <h1 className="sr-only">공무원·공인중개사·경찰·주택관리사·사회복지사 1급·한국사능력검정·공무원 영어 기출 학습</h1>
        <p className="sr-only">
          9급 공무원, 공인중개사, 경찰공무원, 주택관리사, 사회복지사 1급, 한국사능력검정, 공무원 영어 시험의 과목별 기출문제와 핵심 개념을 무료로 학습하세요.
        </p>

        <ExamCalendar loggedIn={Boolean(user)} />

        <section className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2" aria-label="시험 선택">
          {exams.map((exam) => (
            <article
              key={exam.href}
              className={`flex flex-col overflow-hidden rounded-[28px] border-[1.5px] border-carbon bg-gradient-to-br ${exam.accent} p-7 shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-1 md:p-9`}
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
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
