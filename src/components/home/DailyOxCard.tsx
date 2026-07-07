"use client";

import { useMemo, useState } from "react";
import { PC_APP_URL } from "@/lib/constants";
import { buildAiQuestionPrompt, type DailyOxQuestion } from "@/lib/daily-quiz";

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}

function AiQuestionActions({ question }: { question: DailyOxQuestion }) {
  const [copied, setCopied] = useState(false);
  const prompt = useMemo(() => buildAiQuestionPrompt(question), [question]);

  const handleAskChatGPT = () => {
    window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`, "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(prompt);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-mist/60 pt-4">
      <button
        type="button"
        onClick={handleAskChatGPT}
        className="inline-flex items-center gap-1.5 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-midnight px-4 py-2 font-display text-body-sm font-medium text-paper shadow-[var(--shadow-button)] transition-opacity hover:opacity-90"
      >
        ✨ AI에게 바로 질문하기
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="font-display text-body-sm font-medium text-fog transition-colors hover:text-ink"
      >
        {copied ? "질문이 복사됐어요!" : "질문 복사 (Gemini·Claude용)"}
      </button>
    </div>
  );
}

export function DailyOxCard({ questions }: { questions: DailyOxQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<"O" | "X" | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const question = questions[index];
  const isCorrect = picked === question?.answer;

  const handlePick = (choice: "O" | "X") => {
    if (picked) return;
    setPicked(choice);
    if (choice === question.answer) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  const handleRestart = () => {
    setIndex(0);
    setPicked(null);
    setCorrectCount(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="mx-auto max-w-xl rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-paper p-8 text-center shadow-[var(--shadow-card)]">
        <p className="font-display text-body-sm text-smoke">오늘의 기출 O/X 결과</p>
        <p className="mt-2 font-display text-heading-sm font-bold text-ink">
          {total}문제 중 <span className="text-electric-blue">{correctCount}개</span> 정답
        </p>
        <p className="mt-3 font-display text-body-sm text-smoke">
          연도별·목차별로 더 많은 기출을 앱에서 풀어보세요.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={PC_APP_URL}
            className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
          >
            앱에서 더 풀어보기
          </a>
          <button
            type="button"
            onClick={handleRestart}
            className="font-display text-body-sm font-medium text-fog transition-colors hover:text-ink"
          >
            다시 풀기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-paper p-6 text-left shadow-[var(--shadow-card)] md:p-8">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-[var(--radius-tags)] bg-ice/60 px-2.5 py-0.5 font-display text-[12px] font-medium text-electric-blue">
            {question.subject}
          </span>
          <span className="font-display text-[12px] text-fog">{question.year}년 기출</span>
        </div>
        <span className="font-display text-[12px] font-medium text-fog">
          {index + 1} / {total}
        </span>
      </div>

      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-mist">
        <div
          className="h-full rounded-full bg-electric-blue transition-all"
          style={{ width: `${((index + (picked ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <p className="font-display text-body font-medium leading-relaxed text-ink">
        {question.statement}
      </p>

      <div className="mt-5 flex gap-3">
        {(["O", "X"] as const).map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => handlePick(choice)}
            className={`flex h-14 flex-1 items-center justify-center rounded-[var(--radius-buttons)] border-[1.5px] border-carbon font-display text-heading-sm font-bold transition-colors ${
              picked === choice
                ? choice === question.answer
                  ? "bg-electric-blue text-paper"
                  : "bg-carbon text-paper"
                : "bg-surface text-ink hover:bg-snow"
            }`}
          >
            {choice}
          </button>
        ))}
      </div>

      {picked && (
        <>
          <div className="mt-4 rounded-[var(--radius-cards)] bg-snow px-4 py-3">
            <p className="font-display text-body-sm font-semibold text-ink">
              {isCorrect ? "정답이에요! 🎉" : `아쉬워요, 정답은 ${question.answer}예요.`}
            </p>
            <p className="mt-1 font-display text-body-sm text-smoke">{question.explanation}</p>
          </div>

          <AiQuestionActions question={question} />

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
            >
              {index + 1 >= total ? "결과 보기" : "다음 문제"} →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
