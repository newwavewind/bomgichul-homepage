"use client";

import { trackEvent } from "@/lib/analytics";
import { useSubjectExtras } from "@/components/exam/SubjectExtras";

/**
 * 북마크·메모 수는 서버에서 받지 않고 스스로 묻는다(useSubjectExtras).
 * 페이지가 서버에서 세면 쿠키 때문에 전체가 동적 렌더로 떨어지기 때문이다.
 */
export function ReviewPdfButton({
  subject,
  subjectLabel,
  toolbar = false,
}: {
  subject: string;
  subjectLabel: string;
  toolbar?: boolean;
}) {
  const { pending, bookmarkCount, noteCount } = useSubjectExtras(subject);
  const total = bookmarkCount + noteCount;
  const toolbarClass = "inline-flex items-center justify-center gap-2 rounded-full border border-carbon bg-paper px-4 py-2 font-display text-body-sm font-semibold text-ink";
  const emptyClass = toolbar ? toolbarClass : "inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-mist bg-paper px-5 py-2 font-display text-body-sm text-fog";

  // 묻는 동안은 「없음」이라고 단정하지 않는다 — 로그인 사용자에게
  // 빈 상태가 깜빡 보였다가 링크로 바뀌는 것을 막는 자리 유지다.
  if (pending) {
    return <span className={emptyClass}>📒 복습 PDF</span>;
  }

  if (total === 0) {
    return <span className={emptyClass}>📒 복습 PDF (북마크·메모 없음)</span>;
  }

  return (
    <a
      href={`/api/review-pdf/${subject}`}
      onClick={() => trackEvent("review_pdf_download", { subject })}
      className={toolbar ? `${toolbarClass} transition-colors hover:bg-snow` : "inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"}
    >
      📒 {subjectLabel} 복습 PDF
    </a>
  );
}
