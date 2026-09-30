import { HubExamIntroLink } from "@/components/exam-intro/HubExamIntroLink";
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
        <div className="space-y-3">
          <h1 className="font-display text-heading font-semibold text-ink">{track.label} 기출문제</h1>
          <HubExamIntroLink href={`${track.basePath}/intro`} label={track.label} />
        </div>

        <ExamTrackSubjectBrowser track={track} subjects={subjects} />

        <section className="rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-carbon px-6 py-8 text-paper md:px-9">
          <p className="font-display text-[13px] font-semibold tracking-[0.05em] text-white/60">
            웹과 앱으로 이어지는 학습
          </p>
          <div className="mt-3 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h2 className="font-display text-[26px] font-semibold">
                웹에서 시작하고, 앱에서 학습 루틴을 더 넓혀보세요
              </h2>
              <p className="mt-2 max-w-2xl font-display text-body-sm text-white/70">
                웹에서는 공개 기출과 핵심 개념을 바로 학습하고, 앱에서는 포켓 오디오·랜덤 시험·회독 관리로
                같은 공부를 더 다양한 방식으로 이어갈 수 있어요.
              </p>
            </div>
            <span className="rounded-full border border-white/25 px-4 py-2 font-display text-[13px] text-white/80">
              {track.label} 앱 안내
            </span>
          </div>
        </section>

        <section
          aria-label="앱 설치 안내"
          className="flex flex-col items-center gap-4 border-t border-mist pt-10 text-center"
        >
          <p className="font-display text-body-sm text-smoke">
            웹에서 익힌 기출과 개념을 앱에서도 자연스럽게 이어가세요.
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
