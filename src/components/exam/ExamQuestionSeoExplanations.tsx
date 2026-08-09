import type { ExamQuestion } from "@/lib/exam-questions";
import { CopyToClipboardButton } from "@/components/ui/CopyToClipboardButton";

const REVISION_MARKER_RE = /【\s*개정반영\s*】|\[\s*개정반영\s*\]/;

function hasRevisionMarker(text: string | null | undefined) {
  return typeof text === "string" && REVISION_MARKER_RE.test(text);
}

function RevisionBadge() {
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full border border-[#007AFF]/55 bg-[#007AFF]/14 px-2.5 py-0.5 text-[0.6875rem] font-extrabold tracking-tight text-[#0066D6]"
      title="법령 개정이 반영된 해설입니다"
    >
      개정반영
    </span>
  );
}

/**
 * 해설을 서버 HTML에 포함해 검색엔진이 본문을 색인할 수 있게 합니다.
 */
export function ExamQuestionSeoExplanations({
  question,
  subjectLabel,
  embedded = false,
}: {
  question: ExamQuestion;
  subjectLabel: string;
  /** details 등 상위 래퍼 안에 넣을 때 바깥 여백·구분선 제거 */
  embedded?: boolean;
}) {
  const summary = question.explanationSummary?.trim() ?? "";
  const comboWithExpl = question.comboChoices.filter(
    (c) => (c.explanation ?? "").trim().length > 0
  );
  const itemsWithExpl = question.items.filter(
    (item) => (item.explanation ?? "").trim().length > 0
  );
  const showRevisionBadge =
    hasRevisionMarker(summary) ||
    comboWithExpl.some((c) => hasRevisionMarker(c.explanation)) ||
    itemsWithExpl.some((item) => hasRevisionMarker(item.explanation));

  const blocksForCopy: string[] = [];
  if (summary) {
    blocksForCopy.push(`해설 요약\n${summary}`);
  }
  if (comboWithExpl.length > 0) {
    for (const choice of comboWithExpl) {
      blocksForCopy.push(
        [
          `${choice.label} ${choice.text}`,
          choice.isCorrect ? "정답: O" : "정답: X",
          `해설: ${choice.explanation!}`,
        ].join("\n")
      );
    }
  } else {
    for (const item of itemsWithExpl) {
      blocksForCopy.push(
        [
          `${item.label} ${item.text}`,
          `정답: ${item.answer}`,
          `해설: ${item.explanation}`,
        ].join("\n")
      );
    }
  }

  const copyText = [
    `${question.year}년 ${subjectLabel} ${question.questionNo}번 해설`,
    ...blocksForCopy,
  ].join("\n\n");

  if (!summary && comboWithExpl.length === 0 && itemsWithExpl.length === 0) {
    return null;
  }

  return (
    <section
      className={
        embedded
          ? "pt-4"
          : "mt-10 border-t border-mist/60 pt-8"
      }
      aria-label="문항 해설"
    >      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h2 className="font-display text-subheading font-semibold text-ink">
            {question.year}년 {subjectLabel} {question.questionNo}번 해설
          </h2>
          {showRevisionBadge ? <RevisionBadge /> : null}
        </div>
        <CopyToClipboardButton text={copyText} label="해설 복사" event="exam_explanation_copy" />
      </div>

      {summary ? (
        <div className="mb-6 rounded-[var(--radius-buttons)] border border-mist bg-snow px-4 py-3">
          <p className="font-display text-body-sm font-medium text-ink">해설 요약</p>
          <p className="mt-2 font-display text-body-sm leading-relaxed text-smoke whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      ) : null}

      {comboWithExpl.length > 0 ? (
        <ol className="space-y-4">
          {comboWithExpl.map((choice) => (
            <li
              key={choice.no}
              className="rounded-[var(--radius-buttons)] border border-mist bg-snow px-4 py-3"
            >
              <p className="font-display text-body-sm font-medium text-ink">
                {choice.label} {choice.text}
              </p>
              <p className="mt-1 font-display text-body-sm text-smoke">
                {choice.isCorrect ? "정답" : "오답"}
              </p>
              <p className="mt-2 font-display text-body-sm leading-relaxed text-smoke">
                {choice.explanation}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <ol className="space-y-4">
          {itemsWithExpl.map((item) => (
            <li
              key={item.key}
              className="rounded-[var(--radius-buttons)] border border-mist bg-snow px-4 py-3"
            >
              <p className="font-display text-body-sm font-medium text-ink">
                {item.label} {item.text}
              </p>
              <p className="mt-1 font-display text-body-sm text-smoke">
                정답: {item.answer}
              </p>
              <p className="mt-2 font-display text-body-sm leading-relaxed text-smoke">
                {item.explanation}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
