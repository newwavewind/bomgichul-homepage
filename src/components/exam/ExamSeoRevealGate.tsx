"use client";

import { useEffect, useState } from "react";

const EVENT_NAME = "exam:answer_revealed";

export function ExamSeoRevealGate({
  targetId,
  subject,
  year,
  questionNo,
}: {
  targetId: string;
  subject: string;
  year: number;
  questionNo: number;
}) {
  const [revealedByUser, setRevealedByUser] = useState(false);

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
      setRevealedByUser(true);
    };

    window.addEventListener(EVENT_NAME, handler as EventListener);
    return () => window.removeEventListener(EVENT_NAME, handler as EventListener);
  }, [questionNo, subject, year]);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.style.maxHeight = revealedByUser ? "2000px" : "0px";
    el.style.overflow = "hidden";
  }, [revealedByUser, targetId]);

  return null;
}

