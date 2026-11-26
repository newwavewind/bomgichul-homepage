"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ExamMaterialFigure } from "@/components/exam/ExamMaterialFigure";
import { ExamOxQuestion, type ExamAnswerState } from "@/components/exam/ExamOxQuestion";
import { NavigationChevron } from "@/components/ui/backLinkShared";
import type { ExamTrackExam } from "@/lib/exam-track/types";

type RelatedExam = Pick<ExamTrackExam,
  "id" | "questionNo" | "material" | "items" | "correctChoice" | "correctChoices" | "explanationSummary" | "translation">;

export function EnglishSyntaxDetailStudyLinks({ practiceHref, examHref, examLabel, exam, stem }: {
  practiceHref: string;
  examHref: string;
  examLabel: string;
  exam?: RelatedExam;
  stem?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<ExamAnswerState>({ selected: null, revealed: false });
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const panelId = useId();
  const headingId = useId();

  useEffect(() => {
    if (open) panel.current?.focus();
  }, [open]);

  return (
    <>
      <div className="es-detail-main-action">
        <Link href={practiceHref} prefetch={false} className="es-button es-primary es-detail-action">
          <span>암기 연습</span><NavigationChevron direction="right" />
        </Link>
        {exam && <button type="button" ref={trigger} aria-expanded={open} aria-controls={panelId}
          className="es-button es-detail-action es-detail-exam-trigger" onClick={() => setOpen(!open)}>
          <span>{examLabel}</span><NavigationChevron direction="right" />
        </button>}
      </div>
      {exam && <article ref={panel} id={panelId} aria-labelledby={headingId} hidden={!open} tabIndex={-1}
        className="es-detail-exam" onKeyDown={(event) => {
          if (event.key === "Escape" && !event.defaultPrevented &&
            !document.querySelector('dialog[open], [aria-modal="true"]')) {
            event.preventDefault();
            setOpen(false);
            trigger.current?.focus();
          }
        }}>
        {open && <>
          <h2 id={headingId} className="es-detail-exam-label">{examLabel}</h2>
          {stem}
          <ExamMaterialFigure material={exam.material} questionNo={exam.questionNo} />
          <ExamOxQuestion examId={exam.id} items={exam.items} correctChoice={exam.correctChoice}
            correctChoices={exam.correctChoices} explanationSummary={exam.explanationSummary}
            embedded keyboardShortcuts answerState={answer} onAnswerStateChange={setAnswer} />
          {answer.revealed && exam.translation && <section className="es-section">
            <h2>지문 해석</h2><p className="whitespace-pre-line">{exam.translation}</p>
          </section>}
          <Link href={examHref} prefetch={false} className="es-link es-detail-exam-link">기출문제 상세 보기 ↗</Link>
        </>}
      </article>}
    </>
  );
}
