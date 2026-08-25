"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export function PdfDownloadButton({
  subject,
  year,
  canDownload,
}: {
  subject: string;
  year: number;
  canDownload: boolean;
}) {
  const loginHref = `/login?next=${encodeURIComponent(`/exam/${subject}/${year}`)}`;

  if (canDownload) {
    return (
      <a
        href={`/api/exam-pdf/${subject}/${year}`}
        onClick={() => trackEvent("exam_pdf_download", { subject, year })}
        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
      >
        ⬇ PDF 다운로드
      </a>
    );
  }

  return (
    <Link
      href={loginHref}
      prefetch={false}
      onClick={() => trackEvent("exam_pdf_login_click", { subject, year })}
      className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
    >
      ⬇ 무료 PDF (로그인)
    </Link>
  );
}
