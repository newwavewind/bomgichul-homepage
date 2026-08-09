import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { appStoreLinksForScope } from "@/lib/constants";
import type { CommunityScope } from "@/types/database";

export function SimpleAppInstallStrip({
  scope,
  message = "앱에서 기출을 풀고, 막히면 AI 질문으로 이어 가세요.",
}: {
  scope: CommunityScope;
  message?: string;
}) {
  return (
    <section
      aria-label="앱 설치 안내"
      className="mt-12 flex flex-col items-center gap-4 border-t border-mist pt-10 text-center"
    >
      <p className="font-display text-body-sm text-smoke">{message}</p>
      <AppStoreButtons
        className="justify-center"
        size="sm"
        links={appStoreLinksForScope(scope)}
      />
    </section>
  );
}
