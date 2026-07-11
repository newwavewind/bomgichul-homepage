import type { ExamQuestion } from "@/lib/exam-questions";
import { CopyToClipboardButton } from "@/components/ui/CopyToClipboardButton";

function truncateWithEllipsis(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

/**
 * 해설을 서버 HTML에 포함해 검색엔진이 본문을 색인할 수 있게 합니다.
 * - free 문항: 해설 전문 노출
 * - 유료 문항: 해설 일부(요약) 노출 (프리미엄 해제 시 full 로 전환)
 */
export function ExamQuestionSeoExplanations({
  question,
  subjectLabel,
  unlocked,
}: {
  question: ExamQuestion;
  subjectLabel: string;
  unlocked: boolean;
}) {
  const shouldShowFull = question.free || unlocked;
  const EXCERPT_LEN = 40;

  function formatExplanationForSeo(explanation: string) {
    if (shouldShowFull) return explanation;
    const isTruncated = explanation.length > EXCERPT_LEN;
    const excerpt = truncateWithEllipsis(explanation, EXCERPT_LEN);
    if (!isTruncated) return excerpt;
    return `${excerpt} (프리미엄 해제 시 전체 해설)`;
  }

  const summary = question.explanationSummary?.trim() ?? "";
  const comboWithExpl = question.comboChoices.filter(
    (c) => (c.explanation ?? "").trim().length > 0
  );
  const itemsWithExpl = question.items.filter(
    (item) => (item.explanation ?? "").trim().length > 0
  );

  const blocksForCopy: string[] = [];
  if (summary) {
    blocksForCopy.push(`해설 요약\n${formatExplanationForSeo(summary)}`);
  }
  if (comboWithExpl.length > 0) {
    for (const choice of comboWithExpl) {
      blocksForCopy.push(
        [
          `${choice.label} ${choice.text}`,
          choice.isCorrect ? "정답: O" : "정답: X",
          `해설: ${formatExplanationForSeo(choice.explanation!)}`,
        ].join("\n")
      );
    }
  } else {
    for (const item of itemsWithExpl) {
      blocksForCopy.push(
        [
          `${item.label} ${item.text}`,
          `정답: ${item.answer}`,
          `해설: ${formatExplanationForSeo(item.explanation)}`,
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
    <section className="mt-10 border-t border-mist/60 pt-8" aria-label="문항 해설">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h2 className="font-display text-subheading font-semibold text-ink">
          {question.year}년 {subjectLabel} {question.questionNo}번 해설
        </h2>
        <CopyToClipboardButton text={copyText} label="해설 복사" event="exam_explanation_copy" />
      </div>

      {summary ? (
        <div className="mb-6 rounded-[var(--radius-buttons)] border border-mist bg-snow px-4 py-3">
          <p className="font-display text-body-sm font-medium text-ink">해설 요약</p>
          <p className="mt-2 font-display text-body-sm leading-relaxed text-smoke whitespace-pre-wrap">
            {formatExplanationForSeo(summary)}
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
                {formatExplanationForSeo(choice.explanation!)}
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
                {formatExplanationForSeo(item.explanation)}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
