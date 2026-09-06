"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { useMe } from "@/lib/client-session";

/**
 * 로그인 여부는 서버에서 받지 않고 스스로 묻는다(useMe). 페이지가 서버에서
 * getUser() 를 부르면 쿠키 때문에 전체가 동적 렌더로 떨어지기 때문이다.
 */
export function PdfDownloadButton({
  subject,
  year,
}: {
  subject: string;
  year: number;
}) {
  const { pending, user } = useMe();
  const loginHref = `/login?next=${encodeURIComponent(`/exam/${subject}/${year}`)}`;
  const buttonClass = "inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow";

  // 묻는 동안은 중립 문구의 자리 유지 — 로그인 사용자에게 「(로그인)」 유도가
  // 깜빡 보이면 안 되고, 링크를 잘못 태워 보내서도 안 된다.
  if (pending) {
    return <span className={buttonClass}>⬇ PDF 다운로드</span>;
  }

  if (user) {
    return (
      <a
        href={`/api/exam-pdf/${subject}/${year}`}
        onClick={() => trackEvent("exam_pdf_download", { subject, year })}
        className={buttonClass}
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
      className={buttonClass}
    >
      ⬇ 무료 PDF (로그인)
    </Link>
  );
}
