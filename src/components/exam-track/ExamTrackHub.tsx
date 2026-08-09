import { ExamTrackSubjectBrowser } from "@/components/exam-track/ExamTrackSubjectBrowser";
import type { ExamTrackConfig, ExamTrackManifestItem } from "@/lib/exam-track/types";

export function ExamTrackHub({
  track,
  subjects,
  meta,
}: {
  track: ExamTrackConfig;
  subjects: ExamTrackManifestItem[];
  meta: { subjectLabel: string; examLabel: string; yearLabel: string };
}) {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)] space-y-14">
        <header className="space-y-5">
          <div>
            <p className="mb-2 font-display text-[13px] font-semibold tracking-[0.04em] text-electric-blue">
              {track.eyebrow}
            </p>
            <h1 className="font-display text-heading font-semibold tracking-tight text-ink md:text-heading-lg">
              {track.hubTitle}
            </h1>
            <p className="mt-3 max-w-2xl font-display text-body text-smoke">{track.hubDescription}</p>
          </div>
          <dl className="flex flex-wrap gap-x-6 gap-y-2 font-display text-body-sm text-fog">
            <div className="flex items-baseline gap-1.5">
              <dt>과목</dt>
              <dd className="font-semibold text-ink">{meta.subjectLabel}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt>기출</dt>
              <dd className="font-semibold text-ink">{meta.examLabel}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt>연도</dt>
              <dd className="font-semibold text-ink">{meta.yearLabel}</dd>
            </div>
          </dl>
        </header>

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
      </div>
    </div>
  );
}
