"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui/Button";
import { PC_APP_URL } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

export function PdfDownloadButton({
  subject,
  subjectLabel,
  year,
  unlocked,
}: {
  subject: string;
  subjectLabel: string;
  year: number;
  unlocked: boolean;
}) {
  const [showUpsell, setShowUpsell] = useState(false);

  if (unlocked) {
    return (
      <a
        href={`/api/exam-pdf/${subject}/${year}`}
        onClick={() => trackEvent("exam_pdf_download", { subject, year })}
        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
      >
        ⬇ PDF 다운로드
      </a>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setShowUpsell((v) => !v);
          trackEvent("exam_pdf_upsell_click", { subject, year });
        }}
        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
      >
        ⬇ PDF 다운로드
      </button>
      {showUpsell && (
        <div className="mt-3 max-w-md rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-ice/40 p-4">
          <p className="font-display text-body-sm font-semibold text-ink">
            🎁 PDF 다운로드는 프리미엄 전용이에요
          </p>
          <p className="mt-1 font-display text-body-sm text-smoke">
            {subjectLabel} 프리미엄을 해제하면 {year}년을 포함한 전체 연도의 문항과 해설이 담긴 PDF를 내려받을
            수 있어요. 모바일 앱에서 구매하면 PC 학습 코드가 발급돼요.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <PrimaryButton href={`/exam/${subject}#unlock`} size="sm">
              코드 등록하러 가기
            </PrimaryButton>
            <a
              href={PC_APP_URL}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-4 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
            >
              앱에서 구매하기
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
