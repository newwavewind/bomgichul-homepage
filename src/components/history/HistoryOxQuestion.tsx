"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { ExamTrackExam, ExamTrackExamItem } from "@/lib/exam-track/types";
import { HistoryConceptNote } from "@/components/history/HistoryConceptNote";

/**
 * 한국사능력검정 전용 문항 화면.
 *
 * 다른 시험은 「정답 번호 하나를 고르고 해설을 편다」인데, 한국사는 앱과 마찬가지로
 * **선지마다 O/X 를 매기고 한 번에 채점**한다. 다섯 문장을 하나씩 판단해야 하는
 * 시험이라 이 방식이 실제 푸는 방법에 가깝다.
 *
 * 앱 화면을 그대로 옮기지는 않았다. 앱은 한 손에 들어오는 폭을 전제로 O/X 를 오른쪽
 * 끝에 몰아 두지만, 여기서는 PC 폭을 살려 선지 글과 O/X 를 나란히 두고 채점 뒤
 * 해설이 선지 바로 아래에서 펼쳐지게 했다.
 */
type Verdict = "O" | "X";

function normalize(answer?: string): Verdict | null {
  if (answer === "O" || answer === "X") return answer;
  return null;
}

export function HistoryOxQuestion({ exam }: { exam: ExamTrackExam }) {
  const [picks, setPicks] = useState<Record<string, Verdict>>({});
  const [graded, setGraded] = useState(false);

  const items = exam.items ?? [];
  const answered = Object.keys(picks).length;
  const allAnswered = answered === items.length && items.length > 0;

  const score = useMemo(() => {
    if (!graded) return null;
    let right = 0;
    for (const item of items) {
      if (normalize(item.answer) && picks[item.key] === normalize(item.answer)) right += 1;
    }
    return { right, total: items.length };
  }, [graded, items, picks]);

  const pick = (key: string, verdict: Verdict) => {
    if (graded) return;
    setPicks((prev) => ({ ...prev, [key]: verdict }));
  };

  const reset = () => {
    setPicks({});
    setGraded(false);
  };

  return (
    <div>
      {exam.material?.image ? (
        <figure className="mb-6 overflow-hidden rounded-[var(--radius-cards)] border border-mist bg-snow">
          <Image
            src={exam.material.image}
            alt={`${exam.questionNo}번 문항 자료`}
            width={exam.material.width ?? 1200}
            height={exam.material.height ?? 900}
            className="h-auto w-full"
            sizes="(max-width: 900px) 100vw, 860px"
            priority={exam.questionNo <= 2}
          />
        </figure>
      ) : null}

      <ol className="space-y-2.5">
        {items.map((item) => (
          <ChoiceRow
            key={item.key}
            item={item}
            picked={picks[item.key] ?? null}
            graded={graded}
            onPick={(verdict) => pick(item.key, verdict)}
          />
        ))}
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!graded ? (
          <>
            <button
              type="button"
              onClick={() => setGraded(true)}
              disabled={!allAnswered}
              className="inline-flex items-center justify-center rounded-[var(--radius-buttons)] border border-carbon bg-[#6366f1] px-5 py-2.5 font-display text-body-sm font-semibold text-paper shadow-[var(--shadow-button)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:border-mist disabled:bg-mist disabled:text-fog disabled:shadow-none"
            >
              정답 확인
            </button>
            <p className="font-display text-body-sm text-fog">
              {allAnswered
                ? "다섯 선지를 모두 골랐어요"
                : `선지마다 O/X를 고르세요 · ${answered}/${items.length}`}
            </p>
          </>
        ) : (
          <>
            <span className="inline-flex items-center gap-2 rounded-full border border-carbon bg-paper px-4 py-2 font-display text-body-sm font-semibold text-ink">
              {score?.right}/{score?.total} 맞음
            </span>
            {exam.correctChoice ? (
              <span className="font-display text-body-sm text-smoke">
                정답은 <strong className="text-ink">{exam.correctChoice}번</strong>
              </span>
            ) : null}
            <button
              type="button"
              onClick={reset}
              className="font-display text-body-sm font-medium text-electric-blue hover:underline"
            >
              다시 풀기
            </button>
          </>
        )}
      </div>

      {graded ? <HistoryConceptNote concept={exam.concept} /> : null}
    </div>
  );
}

function ChoiceRow({
  item,
  picked,
  graded,
  onPick,
}: {
  item: ExamTrackExamItem;
  picked: Verdict | null;
  graded: boolean;
  onPick: (verdict: Verdict) => void;
}) {
  const answer = normalize(item.answer);
  const right = graded && answer !== null && picked === answer;
  const wrong = graded && answer !== null && picked !== answer;

  const frame = graded
    ? right
      ? "border-leaf/45 bg-leaf/[0.05]"
      : wrong
        ? "border-coral/45 bg-coral/[0.05]"
        : "border-mist bg-paper"
    : "border-mist bg-paper";

  return (
    <li className={`rounded-2xl border px-4 py-3.5 transition-colors ${frame}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-grid size-6 shrink-0 place-items-center rounded-full border border-carbon/30 bg-snow font-display text-[12px] font-semibold text-ink">
          {item.key}
        </span>
        <p className="min-w-0 flex-1 font-system text-[15px] leading-[1.65] text-ink">
          {item.text}
        </p>
        <span className="flex shrink-0 gap-1.5">
          <OxButton
            verdict="O"
            picked={picked === "O"}
            isAnswer={graded && answer === "O"}
            graded={graded}
            onClick={() => onPick("O")}
          />
          <OxButton
            verdict="X"
            picked={picked === "X"}
            isAnswer={graded && answer === "X"}
            graded={graded}
            onClick={() => onPick("X")}
          />
        </span>
      </div>

      {graded ? (
        <div className="mt-3 border-t border-mist/70 pt-3 pl-9">
          <p className="mb-1.5 font-display text-[12px] font-semibold">
            {right ? (
              <span className="text-leaf">맞았어요</span>
            ) : (
              <span className="text-coral">
                틀렸어요 · 정답은 {answer}
              </span>
            )}
          </p>
          {item.explanation ? (
            <p className="font-system text-[14px] leading-[1.7] text-smoke">{item.explanation}</p>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

function OxButton({
  verdict,
  picked,
  isAnswer,
  graded,
  onClick,
}: {
  verdict: Verdict;
  picked: boolean;
  isAnswer: boolean;
  graded: boolean;
  onClick: () => void;
}) {
  const tone = verdict === "O" ? "ios-blue" : "coral";
  // 채점 뒤에는 「내가 고른 것」과 「정답」이 한눈에 갈려야 한다.
  const style = picked
    ? verdict === "O"
      ? "border-ios-blue bg-ios-blue text-paper"
      : "border-coral bg-coral text-paper"
    : graded && isAnswer
      ? verdict === "O"
        ? "border-ios-blue bg-ios-blue/12 text-ios-blue"
        : "border-coral bg-coral/12 text-coral"
      : `border-mist bg-paper text-fog ${graded ? "" : `hover:border-${tone} hover:text-${tone}`}`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={graded}
      aria-label={verdict === "O" ? "맞음" : "틀림"}
      aria-pressed={picked}
      className={`inline-grid size-11 place-items-center rounded-full border-[1.5px] font-display text-[14px] font-bold transition-colors disabled:cursor-default ${style}`}
    >
      {verdict}
    </button>
  );
}
