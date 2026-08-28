import Link from "next/link";
import subjects from "@/data/public-service/manifest.json";
import { HubExamIntroLink } from "@/components/exam-intro/HubExamIntroLink";
import { PublicServiceSubjectBrowser } from "@/components/study/PublicServiceSubjectBrowser";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { appStoreLinksForScope } from "@/lib/constants";

export function PublicServiceHub() {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)] space-y-14">
        <div className="space-y-3">
          <h1 className="font-display text-heading font-semibold text-ink">9급 공무원 기출문제</h1>
          <HubExamIntroLink href="/public-service/intro" label="공무원" />
        </div>

        <section
          aria-label="공무원 기출 올인원"
          className="rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-[#f4f8ff] px-5 py-5 md:px-6"
        >
          <h2 className="font-display text-subheading font-semibold text-ink">기출 올인원</h2>
          <p className="mt-1 font-display text-body-sm text-smoke">
            과목별 개념 허브로 바로 들어가 핵심만 이어 읽어요.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {subjects
              .filter((s) => s.conceptCount > 0)
              .map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/public-service/concepts/${s.id}`}
                    className="inline-flex min-h-10 items-center rounded-full border border-carbon/25 bg-paper px-3.5 font-display text-[13px] font-semibold text-ink transition-colors hover:border-carbon hover:bg-white"
                  >
                    {s.label}
                    <span className="ml-1.5 text-fog">{s.conceptCount}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>

        <PublicServiceSubjectBrowser subjects={subjects} />

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
            links={appStoreLinksForScope("public_service")}
          />
        </section>
      </div>
    </div>
  );
}
