"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QuestionStem } from "@/components/exam/QuestionStem";
import { ExamAnswerList } from "@/components/exam/ExamAnswerList";
import { PrimaryButton } from "@/components/ui/Button";
import { PC_APP_URL } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import type { ExamQuestion } from "@/lib/exam-questions";

function formatElapsed(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function MockExamRunner({
  subject,
  subjectLabel,
  year,
  questions,
  userId,
  unlocked,
  totalQuestionCount,
}: {
  subject: string;
  subjectLabel: string;
  year: number;
  questions: ExamQuestion[];
  userId: string | null;
  unlocked: boolean;
  totalQuestionCount: number;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (submitted) return;
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [submitted]);

  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter((q) => answers[q.questionNo] === q.correctChoice).length;

  const handleSubmit = () => {
    setSubmitted(true);
    trackEvent("mock_exam_submit", { subject, year, total, correct: correctCount, unlocked });
  };

  const handleRestart = () => {
    setAnswers({});
    setSubmitted(false);
    setElapsed(0);
  };

  return (
    <div className={submitted ? "" : "pb-24"}>
      {!submitted && !unlocked && (
        <div className="mb-6 rounded-[var(--radius-cards)] border border-dashed border-mist bg-surface px-4 py-2.5">
          <p className="font-display text-body-sm text-smoke">
            🎁 무료 미리보기 · {total}/{totalQuestionCount}문항 (프리미엄 해제 시 전체 문항 이용 가능)
          </p>
        </div>
      )}

      {submitted && (
        <div className="mb-8 rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-paper p-6 text-center shadow-[var(--shadow-card)]">
          <p className="font-display text-body-sm text-smoke">
            {year}년 {unlocked ? "모의고사 결과" : "모의고사 무료 미리보기 결과"}
          </p>
          <p className="mt-2 font-display text-heading-sm font-bold text-ink">
            {total}문제 중 <span className="text-[#6366f1]">{correctCount}개</span> 정답
          </p>
          <p className="mt-1 font-display text-body-sm text-smoke">
            소요 시간 {formatElapsed(elapsed)}
          </p>

          {!unlocked && (
            <div className="mt-6 rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-ice/40 p-5 text-left">
              <p className="font-display text-body-sm font-semibold text-ink">
                🎁 지금은 {total}문항 미리보기였어요
              </p>
              <p className="mt-1 font-display text-body-sm text-smoke">
                {subjectLabel} 프리미엄을 해제하면 {year}년 {totalQuestionCount}문항 전체를 시간 재며 풀고, 제출
                즉시 채점·해설까지 볼 수 있어요. 모바일 앱에서 구매하면 PC 학습 코드가 발급돼요.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <PrimaryButton href={`/exam/${subject}#unlock`}>코드 등록하러 가기</PrimaryButton>
                <a
                  href={PC_APP_URL}
                  className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
                >
                  앱에서 구매하기
                </a>
              </div>
            </div>
          )}

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
          const selectedItem = q.items.find((item) => item.key === selected);

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
              ) : (
                <>
                  <p className="mb-3 font-display text-body-sm text-smoke">
                    내 답:{" "}
                    <span className="font-medium text-ink">
                      {selectedItem ? `${selectedItem.label} ${selectedItem.text}` : "미응답"}
                    </span>
                  </p>
                  <ExamAnswerList
                    items={q.items}
                    correctChoice={q.correctChoice}
                    free
                    subject={q.subject}
                    year={q.year}
                    questionNo={q.questionNo}
                    userId={userId}
                    initialAttemptResult={null}
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
