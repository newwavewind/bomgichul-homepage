import Link from "next/link";
import subjects from "@/data/public-service/manifest.json";
import { PublicServiceSubjectBrowser } from "@/components/study/PublicServiceSubjectBrowser";

export function PublicServiceHub() {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)] space-y-14">
        <header className="space-y-5">
          <Link href="/" className="group inline-flex items-center gap-2.5 rounded-full border border-mist bg-paper py-2 pl-2 pr-4 font-display text-body-sm font-semibold text-ink shadow-[var(--shadow-button)] transition-all hover:-translate-y-0.5 hover:border-carbon hover:bg-snow">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-carbon text-paper transition-transform group-hover:-translate-x-0.5" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11.5 7H2.5M6 3.5L2.5 7L6 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            시험 다시 선택
          </Link>
          <div>
            <p className="mb-2 font-display text-[13px] font-semibold tracking-[0.04em] text-electric-blue">봄기출 · 공무원</p>
            <h1 className="font-display text-heading font-semibold tracking-tight text-ink md:text-heading-lg">
              공무원 기출 학습의 모든 것
            </h1>
            <p className="mt-3 max-w-2xl font-display text-body text-smoke">
              국가직·지방직 기출의 핵심 쟁점을 과목별로 확인하세요. 웹에서는 개념과 공개 기출 중심으로 제공하고,
              반복학습·오디오·시험 모드 등 전체 기능은 앱에서 제공합니다.
            </p>
          </div>
          <dl className="flex flex-wrap gap-x-6 gap-y-2 font-display text-body-sm text-fog">
            <div className="flex items-baseline gap-1.5"><dt>과목</dt><dd className="font-semibold text-ink">16개</dd></div>
            <div className="flex items-baseline gap-1.5"><dt>기출</dt><dd className="font-semibold text-ink">국가직·지방직</dd></div>
            <div className="flex items-baseline gap-1.5"><dt>연도</dt><dd className="font-semibold text-ink">2017~2026</dd></div>
          </dl>
        </header>

        <PublicServiceSubjectBrowser subjects={subjects} />

        <section className="rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-carbon px-6 py-8 text-paper md:px-9">
          <p className="font-display text-[13px] font-semibold tracking-[0.05em] text-white/60">무료 웹 · 유료 앱 구분</p>
          <div className="mt-3 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h2 className="font-display text-[26px] font-semibold">웹에는 필요한 만큼, 앱에는 완전한 학습 경험을</h2>
              <p className="mt-2 max-w-2xl font-display text-body-sm text-white/70">
                홈페이지는 과목 탐색과 공개 기출·개념 학습에 집중합니다. 앱의 포켓 오디오, 랜덤 시험,
                전체 회독 관리와 같은 유료 기능은 웹에 복제하지 않습니다.
              </p>
            </div>
            <span className="rounded-full border border-white/25 px-4 py-2 font-display text-[13px] text-white/80">공무원 앱 연동 준비</span>
          </div>
        </section>
      </div>
    </div>
  );
}
