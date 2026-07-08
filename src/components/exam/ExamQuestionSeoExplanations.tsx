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

  const blocksForCopy = question.items.map((item) => {
    const explanationToCopy = formatExplanationForSeo(item.explanation);

    return [
      `${item.label} ${item.text}`,
      `정답: ${item.answer}`,
      `해설: ${explanationToCopy}`,
    ].join("\n");
  });

  const copyText = [
    `${question.year}년 ${subjectLabel} ${question.questionNo}번 해설`,
    ...blocksForCopy,
  ].join("\n\n");

  return (
    <section className="mt-10 border-t border-mist/60 pt-8" aria-label="문항 해설">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h2 className="font-display text-subheading font-semibold text-ink">
          {question.year}년 {subjectLabel} {question.questionNo}번 해설
        </h2>
        <CopyToClipboardButton text={copyText} label="해설 복사" event="exam_explanation_copy" />
      </div>
      <ol className="space-y-4">
        {question.items.map((item) => (
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
    </section>
  );
}
