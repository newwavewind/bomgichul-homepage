import { examPrintHref } from "@/lib/exam-print";

export function ExamPrintLink({
  track,
  subject,
  year,
  session,
}: {
  track: string;
  subject: string;
  year: number;
  session: string;
}) {
  const href = examPrintHref(track, subject, year, session);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-mist bg-paper py-1.5 pl-1.5 pr-3.5 font-display text-reading-detail font-semibold leading-tight text-ink shadow-[var(--shadow-button)] transition-colors hover:border-ios-blue/40 hover:bg-ios-blue/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ios-blue"
    >
      <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-ios-blue/10 text-[color:light-dark(#0066d6,#a5ceff)]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-4">
          <path d="M6 9V4h12v5M6 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M6 14h12v7H6zM17 11.5h1" />
        </svg>
      </span>
      기출문제·해설 출력
    </a>
  );
}
