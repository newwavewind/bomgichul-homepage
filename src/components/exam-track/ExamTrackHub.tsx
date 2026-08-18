import Link from "next/link";
import { ExamTrackSubjectBrowser } from "@/components/exam-track/ExamTrackSubjectBrowser";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { appStoreLinksForScope } from "@/lib/constants";
import type { ExamTrackConfig, ExamTrackManifestItem } from "@/lib/exam-track/types";

export function ExamTrackHub({
  track,
  subjects,
}: {
  track: ExamTrackConfig;
  subjects: ExamTrackManifestItem[];
}) {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)] space-y-14">
        <h1 className="font-display text-heading font-semibold text-ink">{track.label} 기출문제</h1>

        {/* 핵심 개념 모아보기는 한국사에만 있다 — 문항마다 개념 카드가 붙는 시험이라
            그것만 이어 읽으면 개념서가 되기 때문이다. */}
        {track.id === "history" ? (
          <Link
            href="/history/concepts"
            className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-lavender px-5 py-4 transition-colors hover:bg-lavender/70 md:px-6"
          >
            <span>
              <span className="block font-display text-[12px] font-semibold tracking-[0.05em] text-ios-blue">
                한국사 전용
              </span>
              <span className="mt-1 block font-display text-subheading font-semibold text-ink">
                핵심 개념 모아보기
              </span>
              <span className="mt-1 block font-display text-body-sm text-smoke">
                문항마다 붙는 개념 카드 250장을 회차·시대별로 골라 이어 읽어요.
              </span>
            </span>
            <span className="shrink-0 rounded-full border border-carbon bg-paper px-4 py-2 font-display text-body-sm font-semibold text-ink">
              열기 →
            </span>
          </Link>
        ) : null}

        <ExamTrackSubjectBrowser track={track} subjects={subjects} />

        <section className="rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-carbon px-6 py-8 text-paper md:px-9">
          <p className="font-display text-[13px] font-semibold tracking-[0.05em] text-white/60">
            무료 웹 · 유료 앱 구분
          </p>
          <div className="mt-3 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h2 className="font-display text-[26px] font-semibold">
                웹에는 필요한 만큼, 앱에는 완전한 학습 경험을
              </h2>
              <p className="mt-2 max-w-2xl font-display text-body-sm text-white/70">
                홈페이지는 과목 탐색과 공개 기출·개념 학습에 집중합니다. 앱의 포켓 오디오, 랜덤 시험,
                전체 회독 관리와 같은 기능은 웹에 복제하지 않습니다.
              </p>
            </div>
            <span className="rounded-full border border-white/25 px-4 py-2 font-display text-[13px] text-white/80">
              {track.label} 앱 연동
            </span>
          </div>
        </section>

        <section
          aria-label="앱 설치 안내"
          className="flex flex-col items-center gap-4 border-t border-mist pt-10 text-center"
        >
          <p className="font-display text-body-sm text-smoke">
            전체 기능은 앱에서 · 웹은 공개 기출·개념 위주예요.
          </p>
          <AppStoreButtons
            size="sm"
            className="justify-center"
            links={appStoreLinksForScope(track.communityScope)}
          />
        </section>
      </div>
    </div>
  );
}
