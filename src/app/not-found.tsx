import { PrimaryButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24">
      <EyebrowLabel className="mb-3">404 — 페이지 없음</EyebrowLabel>
      <SectionHeading as="h1" className="mb-3 text-heading-sm">
        페이지를 찾을 수 없어요
      </SectionHeading>
      <p className="mb-8 max-w-sm text-center font-display text-body-sm text-smoke">
        요청하신 페이지가 존재하지 않거나 삭제되었습니다.
      </p>
      <div className="flex gap-3">
        <PrimaryButton href="/">홈으로</PrimaryButton>
        <PrimaryButton href="/">시험 선택</PrimaryButton>
      </div>
    </div>
  );
}
