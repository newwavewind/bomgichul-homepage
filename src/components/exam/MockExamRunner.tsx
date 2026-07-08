"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QuestionStem } from "@/components/exam/QuestionStem";
import { ExamAnswerList } from "@/components/exam/ExamAnswerList";
import { TableComboChoiceRows } from "@/components/exam/TableComboChoiceRows";
import { PrimaryButton } from "@/components/ui/Button";
import { isTableCompositeQuestion } from "@/lib/composite-exam";
import { enrichTableCompositeQuestion } from "@/lib/realestate-table-composites";
import { trackEvent } from "@/lib/analytics";
import { ARCHIVE_SUBJECT_MAP } from "@/lib/constants";
import type { ExamQuestion } from "@/lib/exam-questions";
import { isStatementCompositeQuestion } from "@/lib/exam-questions";

function formatElapsed(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function MockExamRunner({
  subject,
  year,
  questions,
  userId,
  saveSession = false,
  aiUnlocked = false,
}: {
  subject: string;
  year: number;
  questions: ExamQuestion[];
  userId: string | null;
  saveSession?: boolean;
  aiUnlocked?: boolean;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sessionSaved, setSessionSaved] = useState(false);

  useEffect(() => {
    if (submitted) return;
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [submitted]);

  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter((q) => answers[q.questionNo] === q.correctChoice).length;

  const handleSubmit = async () => {
    setSubmitted(true);
    trackEvent("mock_exam_submit", { subject, year, total, correct: correctCount });

    if (saveSession && userId && !sessionSaved) {
      try {
        const res = await fetch("/api/mock-exam-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject,
            year,
            total,
            correct: correctCount,
            elapsedSeconds: elapsed,
          }),
        });
        if (res.ok) setSessionSaved(true);
      } catch {
        // ignore save errors
      }
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setSubmitted(false);
    setElapsed(0);
  };

  return (
    <div className={submitted ? "" : "pb-24"}>
      {submitted && (
        <div className="mb-8 rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-paper p-6 text-center shadow-[var(--shadow-card)]">
          <p className="font-display text-body-sm text-smoke">{year}년 시험 모드 결과</p>
          <p className="mt-2 font-display text-heading-sm font-bold text-ink">
            {total}문제 중 <span className="text-[#6366f1]">{correctCount}개</span> 정답
          </p>
          <p className="mt-1 font-display text-body-sm text-smoke">
            소요 시간 {formatElapsed(elapsed)}
            {sessionSaved && " · 기록 저장됨"}
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
            >
              다시 풀기
            </button>
            <Link
              href={`/exam/${subject}/${year}`}
              className="font-display text-body-sm font-medium text-fog transition-colors hover:text-ink"
            >
              문항 목록으로
            </Link>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q) => {
          const selected = answers[q.questionNo];
          const isCorrect = submitted && selected === q.correctChoice;
          const isWrong = submitted && Boolean(selected) && selected !== q.correctChoice;
          const enriched = enrichTableCompositeQuestion(q);
          const isStatementComposite = isStatementCompositeQuestion(enriched);
          const isTableComposite = isTableCompositeQuestion(enriched);
          const selectedItem = isStatementComposite
            ? q.comboChoices.find((choice) => String(choice.no) === selected)
            : q.items.find((item) => item.key === selected);

          return (
            <div
              key={q.questionNo}
              className="rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper p-5"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-display text-body font-bold text-ink">{q.questionNo}번</span>
                {submitted && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-display text-[11px] font-bold ${
                      isCorrect
                        ? "bg-[#6366f1] text-paper"
                        : isWrong
                          ? "bg-[#ef4444] text-paper"
                          : "bg-mist text-smoke"
                    }`}
                  >
                    {isCorrect ? "정답" : isWrong ? "오답" : "미응답"}
                  </span>
                )}
              </div>

              <QuestionStem stem={q.stem} />

              {!submitted ? (
                isStatementComposite ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {q.items.map((item) => (
                        <div
                          key={item.key}
                          className="rounded-[var(--radius-buttons)] border-[1.5px] border-mist bg-surface px-4 py-2.5 font-display text-body-sm text-ink"
                        >
                          <span className="font-semibold">{item.label}</span> {item.text}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="font-display text-body-sm font-semibold text-smoke">선택지</p>
                      {isTableComposite ? (
                        <TableComboChoiceRows
                          comboChoices={enriched.comboChoices}
                          tableHeader={enriched.tableHeader}
                          stem={enriched.stem}
                          year={enriched.year}
                          questionNo={enriched.questionNo}
                          correctChoice={enriched.correctChoice}
                          revealed={false}
                          interactive
                          selectedNo={selected ? Number(selected) : null}
                          onSelect={(no) =>
                            setAnswers((a) => ({ ...a, [q.questionNo]: String(no) }))
                          }
                        />
                      ) : (
                        q.comboChoices.map((choice) => (
                          <button
                            key={choice.no}
                            type="button"
                            onClick={() =>
                              setAnswers((a) => ({ ...a, [q.questionNo]: String(choice.no) }))
                            }
                            className={`flex w-full items-start gap-2 rounded-[var(--radius-buttons)] border-[1.5px] px-4 py-2.5 text-left font-display text-body-sm transition-colors ${
                              selected === String(choice.no)
                                ? "border-carbon bg-snow text-ink"
                                : "border-mist text-ink hover:bg-snow"
                            }`}
                          >
                            <span className="font-semibold">{choice.label}</span>
                            <span>{choice.text}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {q.items.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setAnswers((a) => ({ ...a, [q.questionNo]: item.key }))}
                        className={`flex w-full items-start gap-2 rounded-[var(--radius-buttons)] border-[1.5px] px-4 py-2.5 text-left font-display text-body-sm transition-colors ${
                          selected === item.key
                            ? "border-carbon bg-snow text-ink"
                            : "border-mist text-ink hover:bg-snow"
                        }`}
                      >
                        <span className="font-semibold">{item.label}</span>
                        <span>{item.text}</span>
                      </button>
                    ))}
                  </div>
                )
              ) : (
                <>
                  <p className="mb-3 font-display text-body-sm text-smoke">
                    내 답:{" "}
                    <span className="font-medium text-ink">
                      {selectedItem
                        ? `${selectedItem.label} ${selectedItem.text}`
                        : "미응답"}
                    </span>
                  </p>
                  <ExamAnswerList
                    items={q.items}
                    correctChoice={q.correctChoice}
                    questionType={q.questionType}
                    comboChoices={enriched.comboChoices}
                    compositeLayout={enriched.compositeLayout}
                    tableHeader={enriched.tableHeader}
                    stem={enriched.stem}
                    free
                    subject={q.subject}
                    year={q.year}
                    questionNo={q.questionNo}
                    userId={userId}
                    initialAttemptResult={null}
                    aiContext={{
                      subject: q.subject,
                      subjectLabel: ARCHIVE_SUBJECT_MAP[q.subject],
                      unlocked: aiUnlocked,
                      year: q.year,
                      round: q.round,
                      questionNo: q.questionNo,
                      category: q.category,
                      stem: q.stem,
                      correctChoice: q.correctChoice,
                    }}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t-[1.5px] border-carbon bg-paper px-4 py-3">
          <div className="mx-auto flex max-w-[var(--page-max-width)] items-center justify-between gap-3">
            <span className="font-display text-body-sm text-ink">
              ⏱ {formatElapsed(elapsed)} · {answeredCount}/{total} 답변
            </span>
            <PrimaryButton onClick={handleSubmit}>제출하기</PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
