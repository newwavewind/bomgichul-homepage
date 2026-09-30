import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { appStoreLinksForScope } from "@/lib/constants";
import type { CommunityScope } from "@/types/database";

export function SimpleAppInstallStrip({
  scope,
  message = "이 기출이 도움이 됐다면, 봄기출 앱에서도 공부해 보세요.",
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
