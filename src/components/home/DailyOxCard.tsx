"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buildAiQuestionPrompt, type DailyOxQuestion } from "@/lib/daily-quiz";
import { trackEvent } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

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

type AiTarget = "chatgpt" | "claude" | "gemini";

const AI_OPTIONS: { id: AiTarget; label: string; icon: string }[] = [
  { id: "chatgpt", label: "ChatGPT", icon: "💬" },
  { id: "claude", label: "Claude", icon: "✳️" },
  { id: "gemini", label: "Gemini", icon: "✨" },
];

function AiQuestionActions({
  question,
  picked,
}: {
  question: DailyOxQuestion;
  picked: "O" | "X";
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const prompt = useMemo(() => buildAiQuestionPrompt(question, picked), [question, picked]);

  const handleSelect = async (target: AiTarget) => {
    setMenuOpen(false);
    trackEvent("ai_question_click", { target, subject: question.subject });

    if (target === "chatgpt") {
      window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`, "_blank", "noopener,noreferrer");
      return;
    }

    if (target === "claude") {
      window.open(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`, "_blank", "noopener,noreferrer");
      return;
    }

    // Gemini는 URL로 질문을 미리 채울 수 없어 클립보드 복사 후 새 탭으로 열어줍니다.
    const ok = await copyToClipboard(prompt);
    window.open("https://gemini.google.com/app", "_blank", "noopener,noreferrer");
    setStatus(ok ? "질문이 복사됐어요! Gemini 채팅창에 붙여넣으세요." : "복사에 실패했어요. Gemini 탭에서 직접 질문해주세요.");
    setTimeout(() => setStatus(null), 3500);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(prompt);
    trackEvent("ai_question_copy", { subject: question.subject });
    setStatus(ok ? "질문이 복사됐어요!" : "복사에 실패했어요.");
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="mt-4 border-t border-mist/60 pt-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-midnight px-4 py-2 font-display text-body-sm font-medium text-paper shadow-[var(--shadow-button)] transition-opacity hover:opacity-90"
          >
            ✨ AI에게 바로 질문하기
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute left-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper shadow-[var(--shadow-card)]">
                {AI_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-display text-body-sm font-medium text-ink transition-colors hover:bg-snow"
                  >
                    <span>{opt.icon}</span>
                    {opt.label}에게 물어보기
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="font-display text-body-sm font-medium text-fog transition-colors hover:text-ink"
        >
          질문 복사
        </button>
      </div>

      {status && (
        <p className="mt-2 font-display text-body-sm text-electric-blue">{status}</p>
      )}
    </div>
  );
}

interface DailyOxCardProps {
  questions: DailyOxQuestion[];
  userId?: string | null;
  dateKey?: string;
  initialStreak?: number;
  alreadyPlayedToday?: boolean;
}

export function DailyOxCard({
  questions,
  userId = null,
  dateKey,
  initialStreak = 0,
  alreadyPlayedToday = false,
}: DailyOxCardProps) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<"O" | "X" | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(initialStreak);

  const total = questions.length;
  const question = questions[index];
  const isCorrect = picked === question?.answer;

  const handlePick = (choice: "O" | "X") => {
    if (picked) return;
    const correct = choice === question.answer;
    setPicked(choice);
    if (correct) setCorrectCount((c) => c + 1);
    trackEvent("daily_ox_answer", { index, subject: question.subject, correct });
  };

  const saveResult = async (correct: number) => {
    if (!userId || !dateKey || !isSupabaseConfigured()) return;

    const supabase = createClient();
    const { error } = await supabase.from("daily_quiz_results").upsert(
      { user_id: userId, quiz_date: dateKey, total, correct },
      { onConflict: "user_id,quiz_date" }
    );

    if (!error && !alreadyPlayedToday) {
      setStreak((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (index + 1 >= total) {
      setFinished(true);
      trackEvent("daily_ox_complete", { total, correct: correctCount });
      saveResult(correctCount);
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
        {userId ? (
          streak > 0 && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-[var(--radius-tags)] bg-midnight px-3 py-1 font-display text-[12px] font-medium text-paper">
              🔥 {streak}일 연속 참여
            </p>
          )
        ) : (
          <p className="mt-3 font-display text-body-sm text-smoke">
            로그인하면 연속 참여 기록이 저장돼요.
          </p>
        )}
        <p className="mt-3 font-display text-body-sm text-smoke">
          연도별로 더 많은 기출은 홈페이지 기출문제에서 풀어보세요.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/exam"
            onClick={() => trackEvent("cta_click", { location: "daily_ox_result", label: "exam_hub" })}
            className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
          >
            기출문제 더 풀어보기
          </Link>
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

          <AiQuestionActions question={question} picked={picked} />

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
