import Link from "next/link";
import { ExamCalendar } from "@/components/platform/ExamCalendar";
import { PastExamPdfSearch } from "@/components/platform/PastExamPdfSearch";
import { PersonalHomeGate } from "@/components/platform/PersonalHomeGate";
import { AdRail } from "@/components/ads/AdRail";
import { isPublicExamPathVisible } from "@/lib/public-exam-visibility";

const exams = [
  {
    href: "/public-service/intro",
    learnHref: "/public-service",
    eyebrow: "9급 공무원",
    title: "공무원",
    accentFrom: "#e8f5ff",
    accentTo: "#f4f8ff",
    cta: "공무원 알아보기",
  },
  {
    href: "/real-estate/intro",
    learnHref: "/real-estate",
    eyebrow: "제37회 공인중개사",
    title: "공인중개사",
    accentFrom: "#e8faf5",
    accentTo: "#f4fbf8",
    cta: "공인중개사 알아보기",
  },
  {
    href: "/police/intro",
    learnHref: "/police",
    eyebrow: "순경 공채",
    title: "경찰공무원",
    accentFrom: "#eef2ff",
    accentTo: "#f7f8ff",
    cta: "경찰 알아보기",
  },
  {
    href: "/firefighter/intro",
    learnHref: "/firefighter",
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
    eyebrow: "주택관리사보",
    title: "주택관리사",
    accentFrom: "#fff4e8",
    accentTo: "#fffaf4",
    cta: "주택관리사 알아보기",
  },
  {
    href: "/social-worker/intro",
    learnHref: "/social-worker",
    eyebrow: "국가전문자격",
    title: "사회복지사 1급",
    accentFrom: "#fff0f5",
    accentTo: "#fff8fb",
    cta: "사회복지사 알아보기",
  },
  {
    href: "/history/intro",
    learnHref: "/history",
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
    eyebrow: "9급 공채 · 국가직 · 지방직",
    title: "공무원 국어",
    accentFrom: "#e8f9ff",
    accentTo: "#f4fcff",
    cta: "공무원 국어 알아보기",
  },
  {
    href: "/haengjeongsa/intro",
    learnHref: "/haengjeongsa",
    eyebrow: "국가전문자격 · 1차",
    title: "행정사",
    accentFrom: "#e8faf7",
    accentTo: "#f4fbf9",
    cta: "행정사 알아보기",
  },
  {
    href: "/semusa/intro",
    learnHref: "/semusa",
    eyebrow: "국가전문자격 · 1차",
    title: "세무사",
    accentFrom: "#fff4e8",
    accentTo: "#fffaf4",
    cta: "세무사 알아보기",
  },
  {
    href: "/sanan/intro",
    learnHref: "/sanan",
    eyebrow: "국가전문자격 · 1차",
    title: "산업안전지도사",
    accentFrom: "#fff7e6",
    accentTo: "#fffbf2",
    cta: "산업안전지도사 알아보기",
  },
  {
    href: "/sonhae/intro",
    learnHref: "/sonhae",
    eyebrow: "국가전문자격 · 1차",
    title: "손해평가사",
    accentFrom: "#eefbe8",
    accentTo: "#f6fcf2",
    cta: "손해평가사 알아보기",
  },
  {
    href: "/nomusa/intro",
    learnHref: "/nomusa",
    eyebrow: "국가전문자격 · 1차",
    title: "공인노무사",
    accentFrom: "#eaf1ff",
    accentTo: "#f5f8ff",
    cta: "공인노무사 알아보기",
  },
  {
    href: "/gyeongbi/intro",
    learnHref: "/gyeongbi",
    eyebrow: "국가전문자격 · 1·2차",
    title: "경비지도사",
    accentFrom: "#eef1fa",
    accentTo: "#f6f8fc",
    cta: "경비지도사 알아보기",
  },
  {
    href: "/gamjeong/intro",
    learnHref: "/gamjeong",
    eyebrow: "국가전문자격 · 1차",
    title: "감정평가사",
    accentFrom: "#fbeef2",
    accentTo: "#fdf6f8",
    cta: "감정평가사 알아보기",
  },
  {
    href: "/mullyu/intro",
    learnHref: "/mullyu",
    eyebrow: "국가전문자격",
    title: "물류관리사",
    accentFrom: "#f7f1e8",
    accentTo: "#fbf8f2",
    cta: "물류관리사 알아보기",
  },
  {
    href: "/youth/intro",
    learnHref: "/youth",
    eyebrow: "국가전문자격 · 1·2·3급",
    title: "청소년상담사",
    accentFrom: "#eef7f3",
    accentTo: "#f6fbf9",
    cta: "청소년상담사 알아보기",
  },
] as const;

const visibleExams = exams.filter((exam) => isPublicExamPathVisible(exam.learnHref));

function ExamCardAction({
  href,
  label,
  examTitle,
  primary = false,
  compact = false,
  fresh = false,
}: {
  href: string;
  label: string;
  examTitle: string;
  primary?: boolean;
  compact?: boolean;
  fresh?: boolean;
}) {
  const tone = primary
    ? "border-[#0066d6]/35 bg-[#007aff] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_2px_8px_rgba(0,102,214,0.18)] hover:bg-[#0066d6] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_5px_14px_rgba(0,102,214,0.22)]"
    : fresh
      ? "z-[1] border-[#f5b7dc] bg-[#ffebf6] text-[#6b1458] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_8px_rgba(232,80,180,0.1)] hover:bg-[#fff3fa] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_5px_14px_rgba(232,80,180,0.16)]"
      : "border-[#007aff]/30 bg-white/80 text-[#0066d6] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,102,214,0.06)] hover:bg-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_5px_14px_rgba(0,102,214,0.12)]";

  return (
    <Link
      href={href}
      aria-label={fresh ? `${examTitle} ${label} (새로 나옴)` : `${examTitle} ${label}`}
      className={`relative inline-flex min-h-10 ${compact ? "min-w-0 px-2" : "min-w-[120px] px-4"} items-center justify-center rounded-[16px] border py-2 text-center font-display text-[13px] font-semibold tracking-tight transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007aff] focus-visible:ring-offset-2 ${tone}`}
    >
      {label}
      {fresh ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-1.5 -top-2 rotate-[-8deg] rounded-full border border-white bg-[#e8ff3a] px-[7px] py-[2px] font-display text-[9px] font-extrabold leading-none tracking-[0.12em] text-[#355000] shadow-[0_1px_5px_rgba(90,120,0,0.28)]"
        >
          NEW
        </span>
      ) : null}
    </Link>
  );
}

export function PlatformHome() {
  return (
    <div className="relative overflow-hidden bg-white px-4 py-10 md:py-16">
      <div className="relative mx-auto max-w-[var(--page-max-width)]">
        <section className="relative isolate mx-auto mb-10 max-w-5xl overflow-hidden rounded-2xl bg-white px-5 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.1)] sm:px-8 sm:py-10 md:px-12 md:py-12" aria-labelledby="platform-home-heading">
          <div className="pointer-events-none absolute -right-14 -top-20 size-56 rounded-full bg-[#c4baff]/45 blur-2xl" aria-hidden />
          <div className="pointer-events-none absolute bottom-0 right-0 h-1.5 w-28 bg-[#4d49fc]" aria-hidden />
          <div className="relative max-w-4xl">
            <p className="font-mono text-xs tracking-[0.05em] text-[#595959]">PAST EXAMS / FREE STUDY</p>
            <h1 id="platform-home-heading" className="mt-5 max-w-3xl text-[clamp(38px,6vw,56px)] font-light leading-[1.08] tracking-[-0.02em] text-black">
              기출문제와 해설,
              <br className="sm:hidden" /> 봄기출
            </h1>
            <p className="mt-6 max-w-4xl text-base font-normal leading-[1.6] tracking-[-0.007em] text-[#595959] sm:text-lg sm:leading-[1.5]">
              {visibleExams.map((exam) => exam.title).join(", ")} 시험의 과목별 기출문제와
              해설을 무료로 학습하세요.
            </p>
          </div>
        </section>

        <section id="exam-selection" className="mx-auto mb-10 grid max-w-5xl gap-5 md:grid-cols-2" aria-label="시험 선택">
          {visibleExams.map((exam) => (
            <article
              key={exam.href}
              data-exam-card={exam.learnHref.slice(1)}
              className="flex flex-col overflow-hidden rounded-[28px] border-[1.5px] border-carbon p-6 shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-1 md:p-7"
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
              <div className={exam.learnHref === "/real-estate" ? "mt-6 grid grid-cols-3 gap-2" : "mt-6 flex flex-wrap gap-2"}>
                <ExamCardAction
                  href={exam.learnHref}
                  label={exam.learnHref === "/real-estate" ? "기출문제" : "학습 시작"}
                  examTitle={exam.title}
                  compact={exam.learnHref === "/real-estate"}
                  primary
                />
                {exam.learnHref === "/real-estate" && (
                  <ExamCardAction
                    href="/real-estate/lectures/realestate"
                    label="강의 보기"
                    examTitle={exam.title}
                    compact
                    fresh
                  />
                )}
                <ExamCardAction
                  href={`${exam.learnHref}/daily`}
                  label="매일 10문제"
                  examTitle={exam.title}
                  compact={exam.learnHref === "/real-estate"}
                />
              </div>
            </article>
          ))}
        </section>

        <AdRail adsense="hub" spacingClassName="mx-auto mb-10 max-w-5xl" />

        {/* 로그인 시에만 「나의 학습 홈」 — 손님 환영판은 제거 */}
        <PersonalHomeGate guest={null} />

        <PastExamPdfSearch />

        <ExamCalendar />
      </div>
    </div>
  );
}
