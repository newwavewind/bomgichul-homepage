import { CopyToClipboardButton } from "@/components/ui/CopyToClipboardButton";
import { plainStudyText } from "@/lib/study-text";

type SeoExplanationQuestion = {
  year: number;
  questionNo: number;
  correctChoice?: string | number;
  explanationSummary?: string;
  items: {
    key: string;
    label?: string;
    text: string;
    answer?: string;
    explanation?: string;
  }[];
  comboChoices?: {
    no: number;
    label: string;
    text: string;
    isCorrect?: boolean;
    explanation?: string;
  }[];
};

export function hasExamQuestionSeoExplanations(question: SeoExplanationQuestion) {
  return Boolean(
    String(question.correctChoice ?? "").trim() ||
    question.explanationSummary?.trim() ||
    question.items.some(
      (item) =>
        (item.answer ?? "").trim() ||
        (item.explanation ?? "").trim()
    ) ||
    (question.comboChoices ?? []).some(
      (choice) =>
        typeof choice.isCorrect === "boolean" ||
        (choice.explanation ?? "").trim()
    )
  );
}

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
  question: SeoExplanationQuestion;
  subjectLabel: string;
  /** details 등 상위 래퍼 안에 넣을 때 바깥 여백·구분선 제거 */
  embedded?: boolean;
}) {
  const summary = question.explanationSummary?.trim() ?? "";
  const comboChoices = question.comboChoices ?? [];
  const comboWithAnswerOrExpl = comboChoices.filter(
    (choice) =>
      typeof choice.isCorrect === "boolean" ||
      (choice.explanation ?? "").trim().length > 0
  );
  const itemsWithAnswerOrExpl = question.items.filter(
    (item) =>
      (item.answer ?? "").trim().length > 0 ||
      (item.explanation ?? "").trim().length > 0
  );
  const showRevisionBadge =
    hasRevisionMarker(summary) ||
    comboWithAnswerOrExpl.some((c) => hasRevisionMarker(c.explanation)) ||
    itemsWithAnswerOrExpl.some((item) => hasRevisionMarker(item.explanation));

  const blocksForCopy: string[] = [];
  if (summary) {
    blocksForCopy.push(`해설 요약\n${summary}`);
  }
  const correctChoice = String(question.correctChoice ?? "").trim();
  if (correctChoice) {
    blocksForCopy.push(`정답\n${correctChoice}번`);
  }
  if (comboWithAnswerOrExpl.length > 0) {
    for (const choice of comboWithAnswerOrExpl) {
      blocksForCopy.push(
        [
          `${choice.label} ${plainStudyText(choice.text)}`,
          typeof choice.isCorrect === "boolean"
            ? choice.isCorrect
              ? "정답: O"
              : "정답: X"
            : "",
          choice.explanation
            ? `해설: ${plainStudyText(choice.explanation)}`
            : "",
        ].filter(Boolean).join("\n")
      );
    }
  } else {
    for (const item of itemsWithAnswerOrExpl) {
      blocksForCopy.push(
        [
          `${item.label ?? item.key} ${plainStudyText(item.text)}`,
          item.answer ? `정답: ${item.answer}` : "",
          item.explanation
            ? `해설: ${plainStudyText(item.explanation)}`
            : "",
        ].filter(Boolean).join("\n")
      );
    }
  }

  if (!hasExamQuestionSeoExplanations(question)) {
    return null;
  }

  const copyText = [
    `${question.year}년 ${subjectLabel} ${question.questionNo}번 해설`,
    ...blocksForCopy,
  ].join("\n\n");

  return (
    <section
      className={
        embedded
          ? "pt-4"
          : "mt-10 border-t border-mist/60 pt-8"
      }
      aria-label="문항 해설"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h2 className="font-display text-subheading font-semibold text-ink">
            {question.year}년 {subjectLabel} {question.questionNo}번 해설
          </h2>
          {showRevisionBadge ? <RevisionBadge /> : null}
        </div>
        <CopyToClipboardButton text={copyText} label="해설 복사" event="exam_explanation_copy" />
      </div>

      {correctChoice ? (
        <div className="mb-4 rounded-[var(--radius-buttons)] border border-mist bg-snow px-4 py-3">
          <p className="font-display text-body-sm font-semibold text-ink">
            정답: {correctChoice}번
          </p>
        </div>
      ) : null}

      {summary ? (
        <div className="mb-6 rounded-[var(--radius-buttons)] border border-mist bg-snow px-4 py-3">
          <p className="font-display text-body-sm font-medium text-ink">해설 요약</p>
          <p className="mt-2 whitespace-pre-wrap font-display text-body-sm leading-relaxed text-smoke">
            {plainStudyText(summary)}
          </p>
        </div>
      ) : null}

      {comboWithAnswerOrExpl.length > 0 ? (
        <ol className="space-y-4">
          {comboWithAnswerOrExpl.map((choice) => (
            <li
              key={choice.no}
              className="rounded-[var(--radius-buttons)] border border-mist bg-snow px-4 py-3"
            >
              <p className="font-display text-body-sm font-medium text-ink">
                {choice.label} {plainStudyText(choice.text)}
              </p>
              {typeof choice.isCorrect === "boolean" ? (
                <p className="mt-1 font-display text-body-sm text-smoke">
                  {choice.isCorrect ? "정답: O" : "정답: X"}
                </p>
              ) : null}
              {choice.explanation ? (
                <p className="mt-2 font-display text-body-sm leading-relaxed text-smoke">
                  {plainStudyText(choice.explanation)}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      ) : itemsWithAnswerOrExpl.length > 0 ? (
        <ol className="space-y-4">
          {itemsWithAnswerOrExpl.map((item) => (
            <li
              key={item.key}
              className="rounded-[var(--radius-buttons)] border border-mist bg-snow px-4 py-3"
            >
              <p className="font-display text-body-sm font-medium text-ink">
                {item.label ?? item.key} {plainStudyText(item.text)}
              </p>
              {item.answer ? (
                <p className="mt-1 font-display text-body-sm text-smoke">
                  정답: {item.answer}
                </p>
              ) : null}
              {item.explanation ? (
                <p className="mt-2 font-display text-body-sm leading-relaxed text-smoke">
                  {plainStudyText(item.explanation)}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
