import Link from "next/link";
import { PrimaryButton } from "@/components/ui/Button";

export function PremiumFeatureGate({
  subject,
  subjectLabel,
  userId,
  featureLabel,
}: {
  subject: string;
  subjectLabel: string;
  userId: string | null;
  featureLabel: string;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-paper p-8 text-center shadow-[var(--shadow-card)]">
      <p className="font-display text-heading-sm font-bold text-ink">
        🔒 {subjectLabel} 프리미엄 전용 기능이에요
      </p>
      <p className="mt-3 font-display text-body-sm text-smoke">
        {featureLabel}은 {subjectLabel} 프리미엄을 해제한 계정만 이용할 수 있어요. 모바일 앱에서
        구매 후 발급받은 코드를 등록하면 바로 이용할 수 있어요.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <PrimaryButton href={`/exam/${subject}#unlock`}>코드 등록하러 가기</PrimaryButton>
        {!userId && (
          <Link
            href={`/login?next=/exam/${subject}`}
            className="font-display text-body-sm font-medium text-fog transition-colors hover:text-ink"
          >
            로그인하기
          </Link>
        )}
      </div>
    </div>
  );
}
