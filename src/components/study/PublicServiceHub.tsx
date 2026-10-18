import subjects from "@/data/public-service/manifest.json";
import {
  HubBackButton,
  HubExamIntroLink,
} from "@/components/exam-intro/HubExamIntroLink";
import { PublicServiceSubjectBrowser } from "@/components/study/PublicServiceSubjectBrowser";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { appStoreLinksForScope } from "@/lib/constants";

export function PublicServiceHub() {
  return (
    <div className="px-4 py-6 sm:px-5 md:py-10">
      <div className="mx-auto max-w-[1120px] space-y-10 md:space-y-12">
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <HubBackButton />
            <h1 className="font-display text-[30px] font-semibold leading-tight text-ink md:text-[34px]">9급 공무원 기출문제</h1>
          </div>
          <HubExamIntroLink href="/public-service/intro" label="공무원" />
        </div>

        <PublicServiceSubjectBrowser subjects={subjects} />

        <section
          aria-label="앱 설치 안내"
          className="flex flex-col items-center gap-4 border-t border-mist pt-10 text-center"
        >
          <p className="font-display text-body-sm text-smoke">
            웹에서 익힌 기출을 앱에서도 자연스럽게 이어가세요.
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
