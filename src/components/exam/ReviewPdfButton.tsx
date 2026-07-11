"use client";

import { trackEvent } from "@/lib/analytics";

export function ReviewPdfButton({
  subject,
  subjectLabel,
  unlocked,
  bookmarkCount,
  noteCount,
}: {
  subject: string;
  subjectLabel: string;
  unlocked: boolean;
  bookmarkCount: number;
  noteCount: number;
}) {
  const total = bookmarkCount + noteCount;

  if (!unlocked) {
    return (
      <button
        type="button"
        onClick={() => trackEvent("review_pdf_upsell_click", { subject })}
        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-mist bg-paper px-5 py-2 font-display text-body-sm font-medium text-fog"
      >
        📒 복습 PDF (프리미엄)
      </button>
    );
  }

  if (total === 0) {
    return (
      <span className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-mist bg-paper px-5 py-2 font-display text-body-sm text-fog">
        📒 복습 PDF (북마크·메모 없음)
      </span>
    );
  }

  return (
    <a
      href={`/api/review-pdf/${subject}`}
      onClick={() => trackEvent("review_pdf_download", { subject })}
      className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
    >
      📒 {subjectLabel} 복습 PDF
    </a>
  );
}
