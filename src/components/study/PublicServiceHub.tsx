import subjects from "@/data/public-service/manifest.json";
import { PublicServiceSubjectBrowser } from "@/components/study/PublicServiceSubjectBrowser";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { appStoreLinksForScope } from "@/lib/constants";

export function PublicServiceHub() {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)] space-y-14">
        <header>
          <p className="mb-2 font-display text-[13px] font-semibold tracking-[0.04em] text-electric-blue">봄기출 · 공무원</p>
          <h1 className="font-display text-heading font-semibold tracking-tight text-ink md:text-heading-lg">
            공무원 기출 학습의 모든 것
          </h1>
        </header>

        <PublicServiceSubjectBrowser subjects={subjects} />

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
            links={appStoreLinksForScope("public_service")}
          />
        </section>
      </div>
    </div>
  );
}
