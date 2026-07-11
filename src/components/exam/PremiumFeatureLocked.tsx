import { PrimaryButton } from "@/components/ui/Button";
import { StorePurchaseLinks } from "@/components/exam/StorePurchaseLinks";

export function PremiumFeatureLocked({
  subject,
  subjectLabel,
  featureLabel,
  description,
}: {
  subject: string;
  subjectLabel: string;
  featureLabel: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-[var(--radius-largecards)] border border-carbon bg-paper p-8 text-center shadow-[var(--shadow-card)]">
      <p className="font-display text-heading-sm font-bold text-ink">
        🔒 {featureLabel}은 {subjectLabel} 프리미엄 전용이에요
      </p>
      <p className="mt-3 font-display text-body-sm text-smoke">{description}</p>
      <p className="mt-2 font-display text-body-sm text-smoke">
        모바일 앱(Google Play·App Store)에서 {subjectLabel}을 구매하면 PC 학습 코드가 발급돼요. 이
        홈페이지에서 코드를 등록하면 바로 이용할 수 있어요.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <PrimaryButton href={`/exam/${subject}#unlock`}>코드 등록하러 가기</PrimaryButton>
        <StorePurchaseLinks />
      </div>
    </div>
  );
}
