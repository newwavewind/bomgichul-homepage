import Link from "next/link";
import { ExamCalendar } from "@/components/platform/ExamCalendar";
import { PersonalStudyHome } from "@/components/platform/PersonalStudyHome";
import type { PersonalHomeData } from "@/lib/personal-home";

const exams = [
  {
    href: "/public-service/intro",
    eyebrow: "9급 공무원",
    title: "공무원",
    description: "직렬·과목·일정·원서 접수를 먼저 보고, 기출 학습으로 이어가세요.",
    meta: "16개 과목 · 국가직·지방직",
    accent: "from-[#e8f5ff] to-[#f4f8ff]",
    cta: "공무원 알아보기",
  },
  {
    href: "/real-estate/intro",
    eyebrow: "제37회 공인중개사",
    title: "공인중개사",
    description: "1·2차 형식과 면제, Q-Net 일정까지 시험 안내를 확인하세요.",
    meta: "6개 과목 · 2016~2025",
    accent: "from-[#e8faf5] to-[#f4fbf8]",
    cta: "공인중개사 알아보기",
  },
  {
    href: "/police/intro",
    eyebrow: "순경 공채",
    title: "경찰공무원",
    description: "필기 과목과 전형 흐름, 경찰청 원서접수를 정리해 두었습니다.",
    meta: "3개 과목 · 2022~2026",
    accent: "from-[#eef2ff] to-[#f7f8ff]",
    cta: "경찰 알아보기",
  },
  {
    href: "/housing/intro",
    eyebrow: "주택관리사보",
    title: "주택관리사",
    description: "1·2차 과목과 Q-Net 일정·접수를 먼저 살펴보세요.",
    meta: "5개 과목 · 2020~2025",
    accent: "from-[#fff4e8] to-[#fffaf4]",
    cta: "주택관리사 알아보기",
  },
  {
    href: "/social-worker/intro",
    eyebrow: "국가전문자격",
    title: "사회복지사 1급",
    description: "8개 영역 과목과 국가시험 형식·접수를 안내합니다.",
    meta: "8개 과목 · 2017~2026 · 2,000문항",
    accent: "from-[#fff0f5] to-[#fff8fb]",
    cta: "사회복지사 알아보기",
  },
  {
    href: "/history/intro",
    eyebrow: "국가공인 · 심화",
    title: "한국사능력검정",
    description: "심화 등급과 회차 일정, 접수처를 확인한 뒤 기출로 이어가세요.",
    meta: "심화 · 75~79회 · 250문항",
    // 앞 다섯 카드가 파랑(206°)·민트(163°)·남보라(226°)·주황(31°)·분홍(340°)을 쓰고 있어
    // 색상환에서 가장 비어 있던 연둣빛(95°)을 골랐다 — 어느 카드와도 60° 넘게 떨어진다.
    accent: "from-[#f0ffe5] to-[#f8fff2]",
    cta: "한국사 알아보기",
  },
  {
    href: "/english/intro",
    eyebrow: "9급 공채 · 국가직 · 지방직",
    title: "공무원 영어",
    description: "9급 필기 영어 과목의 위치와 채용 일정·접수를 안내합니다.",
    meta: "9급 영어 · 2017~2026 · 400문항",
    // 앞 여섯이 31°·95°·163°·206°·226°·340° 를 쓰고 있어, 일곱 번째는 60° 규칙을
    // 지킬 수가 없다 — 가장 벌어진 틈이 226°~340° 인데 그 한가운데도 57° 다.
    // 그래서 규칙을 지키는 대신 최소 간격이 가장 큰 자리(283°)를 골랐다.
    accent: "from-[#f6f0ff] to-[#fbf8ff]",
    cta: "공무원 영어 알아보기",
  },
] as const;

export function PlatformHome({ user, personalHome }: { user?: { nickname: string } | null; personalHome?: PersonalHomeData | null }) {
  return (
    <div className="relative overflow-hidden bg-white px-4 py-10 md:py-16">
      <div className="relative mx-auto max-w-[var(--page-max-width)]">
        {user && personalHome ? <PersonalStudyHome nickname={user.nickname} data={personalHome} /> : (
          <section className="mx-auto mb-10 max-w-5xl text-center">
            <p className="font-display text-[13px] font-semibold tracking-[0.05em] text-[#087f6d]">시험을 고르고, 안내부터 확인하세요</p>
            <h1 className="mt-3 font-display text-[34px] font-semibold tracking-tight text-ink md:text-[48px]">직렬·과목·일정까지 보고 나서 기출로</h1>
            <p className="mx-auto mt-3 max-w-2xl font-display text-body text-smoke">아래에서 시험을 고르면 시행처·과목·원서 접수를 먼저 볼 수 있어요. 로그인하면 오답·북마크·최근 학습이 자동으로 모입니다.</p>
            <Link href="/login" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-carbon px-6 font-display text-body-sm font-semibold text-paper">Google로 시작하기</Link>
          </section>
        )}
        <h1 className="sr-only">공무원·공인중개사·경찰·주택관리사·사회복지사 1급·한국사능력검정·공무원 영어 기출 학습</h1>
        <p className="sr-only">
          9급 공무원, 공인중개사, 경찰공무원, 주택관리사, 사회복지사 1급, 한국사능력검정, 공무원 영어 시험의 과목별 기출문제와 핵심 개념을 무료로 학습하세요.
        </p>

        <ExamCalendar />

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
