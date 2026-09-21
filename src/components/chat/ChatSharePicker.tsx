"use client";

import { useEffect, useState } from "react";

type SubjectOpt = { value: string; label: string };
type QuestionOpt = {
  examId: string;
  subject: string;
  year: number;
  questionNo: number;
  stem: string;
  href?: string;
};

export type PickedShare = {
  mode: "exam" | "wrong" | "mock";
  examId: string;
  subject: string;
  subjectLabel: string;
  year: number | string;
  questionNo?: number | string;
  stem: string;
  href?: string;
  items?: QuestionOpt[];
};

export function ChatSharePicker({
  mode,
  onPick,
}: {
  mode: "exam" | "wrong" | "mock";
  onPick: (picked: PickedShare) => void;
}) {
  const [subjects, setSubjects] = useState<SubjectOpt[]>([]);
  const [subject, setSubject] = useState("");
  const [years, setYears] = useState<number[]>([]);
  const [year, setYear] = useState<number | "">("");
  const [questions, setQuestions] = useState<QuestionOpt[]>([]);
  const [wrongs, setWrongs] = useState<QuestionOpt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subjectLabel =
    subjects.find((s) => s.value === subject)?.label ?? subject;

  useEffect(() => {
    void fetch("/api/chat/share-catalog?kind=subjects")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.subjects ?? []) as SubjectOpt[];
        setSubjects(list);
        if (list[0] && !subject) setSubject(list[0].value);
      })
      .catch(() => setError("과목 목록을 불러오지 못했어요."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!subject) return;
    setYear("");
    setQuestions([]);
    setWrongs([]);
    setLoading(true);
    setError(null);
    const url =
      mode === "wrong"
        ? `/api/chat/share-catalog?kind=wrongs&subject=${encodeURIComponent(subject)}`
        : `/api/chat/share-catalog?kind=years&subject=${encodeURIComponent(subject)}`;
    void fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (mode === "wrong") {
          setWrongs(data.items ?? []);
          if (data.loginRequired) setError("오답 목록은 로그인 후 볼 수 있어요.");
        } else {
          setYears(data.years ?? []);
        }
      })
      .catch(() => setError("목록을 불러오지 못했어요."))
      .finally(() => setLoading(false));
  }, [subject, mode]);

  useEffect(() => {
    if (!subject || !year || mode === "wrong" || mode === "mock") return;
    setLoading(true);
    void fetch(
      `/api/chat/share-catalog?kind=questions&subject=${encodeURIComponent(subject)}&year=${year}`,
    )
      .then((r) => r.json())
      .then((data) => setQuestions(data.questions ?? []))
      .catch(() => setError("문항을 불러오지 못했어요."))
      .finally(() => setLoading(false));
  }, [subject, year, mode]);

  return (
    <div className="mb-2 space-y-2 rounded-xl border border-mist bg-white/90 p-2.5">
      <div className="flex flex-wrap gap-1.5">
        {subjects.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setSubject(s.value)}
            className={`rounded-lg px-2.5 py-1.5 font-display text-[11px] font-medium transition-colors ${
              subject === s.value
                ? "bg-[#007AFF] text-white"
                : "bg-surface text-smoke hover:text-ink"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {mode !== "wrong" ? (
        <div className="flex flex-wrap gap-1.5">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => {
                setYear(y);
                if (mode === "mock") {
                  onPick({
                    mode: "mock",
                    examId: `${subject}-${y}-mock`,
                    subject,
                    subjectLabel,
                    year: y,
                    stem: `${subjectLabel} ${y}년 모의고사`,
                    href: `/exam/${subject}/${y}/mock`,
                  });
                }
              }}
              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${
                year === y
                  ? "bg-[#007AFF] text-white"
                  : "bg-white text-smoke ring-1 ring-mist hover:text-ink"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      ) : null}

      {error ? <p className="chat-meta text-rose-600">{error}</p> : null}
      {loading ? <p className="chat-meta">불러오는 중...</p> : null}

      {mode === "exam" && year ? (
        <div className="max-h-44 space-y-1 overflow-y-auto">
          {questions.map((q) => (
            <button
              key={q.examId}
              type="button"
              onClick={() =>
                onPick({
                  mode: "exam",
                  examId: q.examId,
                  subject: q.subject,
                  subjectLabel,
                  year: q.year,
                  questionNo: q.questionNo,
                  stem: q.stem,
                  href: `/exam/${q.subject}/${q.year}/${q.questionNo}`,
                })
              }
              className="flex w-full flex-col rounded-lg px-2.5 py-2 text-left hover:bg-[#007AFF]/8"
            >
              <span className="text-[11px] font-semibold text-[#0066D6]">
                {q.year}년 {q.questionNo}번
              </span>
              <span className="line-clamp-2 text-[12px] text-ink">{q.stem}</span>
            </button>
          ))}
        </div>
      ) : null}

      {mode === "wrong" ? (
        <div className="max-h-44 space-y-1 overflow-y-auto">
          {wrongs.length ? (
            wrongs.map((q) => (
              <button
                key={q.examId}
                type="button"
                onClick={() =>
                  onPick({
                    mode: "wrong",
                    examId: q.examId,
                    subject: q.subject,
                    subjectLabel,
                    year: q.year,
                    questionNo: q.questionNo,
                    stem: q.stem,
                    href: q.href,
                  })
                }
                className="flex w-full flex-col rounded-lg px-2.5 py-2 text-left hover:bg-[#007AFF]/8"
              >
                <span className="text-[11px] font-semibold text-[#0066D6]">
                  {q.year}년 {q.questionNo}번
                </span>
                <span className="line-clamp-2 text-[12px] text-ink">{q.stem}</span>
              </button>
            ))
          ) : !loading ? (
            <p className="chat-meta py-2 text-center">이 과목 오답이 없어요.</p>
          ) : null}
        </div>
      ) : null}

      {mode === "mock" && !year ? (
        <p className="chat-meta">연도를 고르면 바로 초대가 준비됩니다.</p>
      ) : null}
    </div>
  );
}
