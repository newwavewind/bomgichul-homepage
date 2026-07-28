"use client";

import { useEffect, useRef } from "react";

const EVENT_NAME = "exam:answer_revealed";

/**
 * 해설을 항상 HTML에 두고(details), 정답 확인 시 자동으로 연다.
 * max-height:0 숨김 대신 네이티브 details라 크롤러가 본문을 안정적으로 읽는다.
 */
export function ExamSeoExplanationDetails({
  subject,
  year,
  questionNo,
  children,
}: {
  subject: string;
  year: number;
  questionNo: number;
  children: React.ReactNode;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{
        subject: string;
        year: number;
        questionNo: number;
      }>;
      const detail = ce.detail;
      if (!detail) return;
      if (detail.subject !== subject) return;
      if (detail.year !== year) return;
      if (detail.questionNo !== questionNo) return;
      const el = detailsRef.current;
      if (el) el.open = true;
    };

    window.addEventListener(EVENT_NAME, handler as EventListener);
    return () => window.removeEventListener(EVENT_NAME, handler as EventListener);
  }, [questionNo, subject, year]);

  return (
    <details
      ref={detailsRef}
      className="exam-seo-explanations mt-10 border-t border-mist/60 pt-6 open:pb-2"
    >
      <summary className="cursor-pointer list-none font-display text-body font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
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
