"use client";

import { useEffect, useRef } from "react";

const EVENT_NAME = "exam:answer_revealed";

/**
 * 해설을 항상 HTML에 두고(details), 정답 확인 시 자동으로 여닫는다.
 * max-height:0 숨김 대신 네이티브 details라 크롤러가 본문을 안정적으로 읽는다.
 *
 * `externallyToggled` 는 위쪽 「정답·해설 보기」 버튼이 이 details 를 대신 여닫는 경우다.
 * 그때만 자체 summary 를 감춰 같은 말을 하는 버튼이 둘로 보이지 않게 한다.
 * 감추는 일을 effect(=클라이언트)에서 하는 이유 — 서버 HTML 에는 summary 가 남아 있어야
 * JS 가 아직/영영 안 뜬 사용자도 해설을 펼칠 수 있다. 크롤러가 읽는 본문은 어느 쪽이든
 * details 안에 그대로 있다.
 */
export function ExamSeoExplanationDetails({
  subject,
  year,
  questionNo,
  externallyToggled = false,
  children,
}: {
  subject: string;
  year: number;
  questionNo: number;
  externallyToggled?: boolean;
  children: React.ReactNode;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!externallyToggled) return;
    const summary = summaryRef.current;
    if (!summary) return;
    summary.classList.add("hidden");
    return () => summary.classList.remove("hidden");
  }, [externallyToggled]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{
        subject: string;
        year: number;
        questionNo: number;
        open?: boolean;
      }>;
      const detail = ce.detail;
      if (!detail) return;
      if (detail.subject !== subject) return;
      if (detail.year !== year) return;
      if (detail.questionNo !== questionNo) return;
      const el = detailsRef.current;
      if (el) el.open = detail.open ?? true;
    };

    window.addEventListener(EVENT_NAME, handler as EventListener);
    return () => window.removeEventListener(EVENT_NAME, handler as EventListener);
  }, [questionNo, subject, year]);

  return (
    <details
      ref={detailsRef}
      className="exam-seo-explanations mt-10 border-t border-mist/60 pt-6 open:pb-2"
    >
      <summary
        ref={summaryRef}
        className="cursor-pointer list-none font-display text-body font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden"
      >
        <span className="inline-flex items-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-paper px-4 py-2.5 shadow-[var(--shadow-button)] transition-colors hover:bg-snow">
          해설 보기
          <span aria-hidden className="text-fog">
            ▾
          </span>
        </span>
      </summary>
      <div className="pt-2">{children}</div>
    </details>
  );
}
