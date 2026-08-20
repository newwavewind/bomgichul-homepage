import subjects from "@/data/public-service/manifest.json";
import { PublicServiceSubjectBrowser } from "@/components/study/PublicServiceSubjectBrowser";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { appStoreLinksForScope } from "@/lib/constants";

export function PublicServiceHub() {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)] space-y-14">
        <h1 className="font-display text-heading font-semibold text-ink">9급 공무원 기출문제</h1>
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
