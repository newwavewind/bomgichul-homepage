"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function PracticeQuestionFrame({
  index,
  total,
  onPrevious,
  onNext,
  children,
}: {
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLElement>(null);
  const previousIndex = useRef(index);

  useEffect(() => {
    frameRef.current?.focus({ preventScroll: true });
    if (previousIndex.current !== index) {
      frameRef.current?.scrollIntoView({ block: "start" });
      previousIndex.current = index;
    }
  }, [index]);

  return (
    <article ref={frameRef} tabIndex={-1} className="scroll-mt-24 focus:outline-none">
      {children}
      <nav aria-label="이전·다음 연습 문제" className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={index === 0}
          aria-keyshortcuts={index > 0 ? "ArrowLeft" : undefined}
          className="rounded-full border border-mist bg-paper px-5 py-2.5 font-display text-body-sm font-semibold text-ink hover:bg-snow disabled:invisible"
        >
          ← 이전 문제
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-keyshortcuts="ArrowRight"
          className="rounded-full bg-carbon px-5 py-2.5 font-display text-body-sm font-semibold text-paper"
        >
          {index + 1 >= total ? "결과 보기" : "다음 문제"} →
        </button>
      </nav>
    </article>
  );
}
