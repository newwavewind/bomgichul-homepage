import { CitedText } from "@/components/exam/CitedText";
import { ExplanationAiAction, ExplanationAppFeatures, ExplanationAppTools } from "@/components/exam/ExplanationAppFeatures";
import { ExamExplanationGlossary } from "@/components/exam/ExamExplanationGlossary";
import { appStoreLinksForScope } from "@/lib/constants";
import { buildExamItemAiPrompt } from "@/lib/ai-links";
import { communityScopeLabel } from "@/lib/exam-track/community";
import type { ChoiceGlossary } from "@/lib/exam-glossary";
import { ExplanationChoiceBadge } from "@/components/exam/ExamSeoExplanationDetails";
import { ExplanationSourceLinks, prepareExplanationSources, type ExplanationSource } from "@/components/exam/ExamExplanationSources";
import type { CommunityScope } from "@/types/database";
import { CopyToClipboardButton } from "@/components/ui/CopyToClipboardButton";
import { plainStudyText } from "@/lib/study-text";
import { renderStudyText, type UnderlineRange } from "@/lib/underlined-text";

export type SeoExplanationQuestion = {
  year: number;
  questionNo: number;
  stem?: string;
  round?: number;
  sourceCode?: string;
  category?: string;
  correctChoice?: string | number;
  /** 복수정답·전항정답 */
  correctChoices?: number[];
  examDate?: string;
  lawVersions?: Record<string, string>;
  explanationSummary?: string;
  items: {
    key: string;
    label?: string;
    text: string;
    answer?: string;
    explanation?: string;
    sources?: ExplanationSource[];
    /** 선지 글 안 밑줄 자리 — 「밑줄 친 부분이 …」 문항(국어·영어) */
    underlines?: readonly UnderlineRange[];
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
    question.correctChoices?.length ||
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
      className="inline-flex shrink-0 items-center rounded-full border border-[#007AFF]/55 bg-[#007AFF]/14 px-2.5 py-0.5 text-[0.6875rem] font-extrabold tracking-tight text-[color:light-dark(#0066D6,var(--color-carbon))] dark:text-carbon"
      title="법령 개정이 반영된 해설입니다"
    >
      개정반영
    </span>
  );
}

function EvidenceCheck() {
  return (
    <svg aria-hidden className="size-[1em] shrink-0" viewBox="0 0 16 16" fill="none">
      <path d="m3.5 8.4 2.9 2.9 6.1-6.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExplanationCard({
  label,
  choiceNumber,
  text,
  underlines,
  answer,
  explanation,
  sources = [],
  glossary,
  examDate,
  lawVersions,
  aiPrompt,
  hasApp,
}: {
  label: string;
  choiceNumber?: number;
  text: string;
  underlines?: readonly UnderlineRange[];
  answer?: string;
  explanation?: string;
  sources?: ExplanationSource[];
  glossary?: ChoiceGlossary;
  examDate?: string;
  lawVersions?: Record<string, string>;
  aiPrompt: string;
  hasApp: boolean;
}) {
  const { body, links, hasEvidence } = prepareExplanationSources(explanation, sources, lawVersions);

  return (
    <li className="exam-explanation-card">
      <div className="mb-3 flex items-start gap-3">
        <ExplanationChoiceBadge label={label} choiceNumber={choiceNumber} />
        <p className="min-w-0 flex-1 font-display text-body-sm font-medium leading-relaxed text-ink">
          {renderStudyText(text, underlines)}
        </p>
        {answer ? (
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 font-display text-body-sm font-semibold ${
            answer === "O"
              ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
              : "bg-rose-500/10 text-rose-800 dark:text-rose-300"
          }`}>
            <span className="sr-only">정오 </span>{answer}
          </span>
        ) : null}
      </div>
      {explanation?.trim() ? (
        <>
          <div className="exam-explanation-eyebrow">
            {hasEvidence ? (
              <span className="exam-explanation-source-badge">
                <EvidenceCheck /> 확실한 근거가 있는 해설
              </span>
            ) : (
              <span className="text-smoke">해설</span>
            )}
          </div>
          {body ? (
            <p className="exam-explanation-copy">
              <CitedText text={body} examDate={examDate} lawVersions={lawVersions} glossaryTerms={glossary?.terms} />
            </p>
          ) : null}
        </>
      ) : null}
      {links.length > 0 ? <ExplanationSourceLinks sources={links} /> : null}
      <ExamExplanationGlossary glossary={glossary} hasApp={hasApp} />
      <div className="exam-explanation-actions"><ExplanationAiAction prompt={aiPrompt} /></div>
    </li>
  );
}

/** 해설 본문은 채점 전에도 서버 HTML에 포함한다. */
export function ExamQuestionSeoExplanations({
  question,
  subjectLabel,
  embedded = false,
  scope = "real_estate",
  glossaryByChoice = {},
  pickedChoice,
}: {
  question: SeoExplanationQuestion;
  subjectLabel: string;
  /** details 등 상위 래퍼 안에 넣을 때 바깥 여백·구분선 제거 */
  embedded?: boolean;
  scope?: CommunityScope;
  glossaryByChoice?: Record<string, ChoiceGlossary>;
  pickedChoice?: string;
}) {
  const links = appStoreLinksForScope(scope);
  const hasApp = Boolean(links.ios || links.android);
  const summary = question.explanationSummary?.trim() ?? "";
  const comboChoices = question.comboChoices ?? [];
  /*
   * 「모두 몇 개인가」 유형에서 ①0개·②1개… 자체에는 배울 것이 없다. 어느 것이
   * 답인지는 위의 「정답: N번」이 이미 말한다. 정작 읽어야 할 것은 지문 ㉠~㉣의
   * 해설이므로 **자기 해설을 가진 선택지만** 덧붙인다.
   * (선택지에 해설을 달아 둔 문항이 86개 있어 목록 자체를 버리지는 않는다.)
   */
  const comboWithExplanation = comboChoices.filter(
    (choice) => (choice.explanation ?? "").trim().length > 0
  );
  const itemsWithAnswerOrExpl = question.items.filter(
    (item) =>
      (item.answer ?? "").trim().length > 0 ||
      (item.explanation ?? "").trim().length > 0
  );
  const showRevisionBadge =
    hasRevisionMarker(summary) ||
    comboWithExplanation.some((c) => hasRevisionMarker(c.explanation)) ||
    itemsWithAnswerOrExpl.some((item) => hasRevisionMarker(item.explanation));

  const blocksForCopy: string[] = [];
  if (summary) {
    blocksForCopy.push(`해설 요약\n${summary}`);
  }
  const choiceNos = question.correctChoices?.length ? question.correctChoices : null;
  const single = String(question.correctChoice ?? "").trim();
  const correctChoice = choiceNos
    ? choiceNos.length > 1 && choiceNos.length === (comboChoices.length || question.items.length)
      ? "모든 번호(전항정답)"
      : `${choiceNos.join("·")}번`
    : single
      ? `${single}번`
      : "";
  const promptContext = {
    examLabel: communityScopeLabel(scope),
    subjectLabel,
    year: question.year,
    round: question.round,
    sessionLabel: question.sourceCode,
    questionNo: question.questionNo,
    category: question.category ?? "",
    stem: [question.stem, ...(comboChoices.length ? question.items.map((item) => `${item.label ?? item.key} ${item.text}`) : [])]
      .filter(Boolean).map((text) => plainStudyText(text!)).join("\n"),
    correctChoice: choiceNos?.join("·") ?? single,
  };
  if (correctChoice) {
    blocksForCopy.push(`정답\n${correctChoice}`);
  }
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
  for (const choice of comboWithExplanation) {
    blocksForCopy.push(
      [
        `${choice.label} ${plainStudyText(choice.text)}`,
        typeof choice.isCorrect === "boolean"
          ? choice.isCorrect
            ? "정답: O"
            : "정답: X"
          : "",
        `해설: ${plainStudyText(choice.explanation ?? "")}`,
      ].filter(Boolean).join("\n")
    );
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

      <ExplanationAppFeatures links={links}>
        {correctChoice || pickedChoice ? (
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-display text-body-sm text-smoke">
            {correctChoice ? (
              <p className="flex items-center gap-2">
                정답 <strong className="rounded-full bg-snow px-3 py-1 font-semibold text-ink">{correctChoice}</strong>
              </p>
            ) : null}
            {pickedChoice ? (
              <p className="flex items-center gap-2">
                내 선택 <strong className="rounded-full bg-snow px-3 py-1 font-semibold text-ink">{pickedChoice}</strong>
              </p>
            ) : null}
          </div>
        ) : null}

        {summary ? (
          <div className="exam-explanation-notebook mb-5 px-4 py-3">
            <p className="font-display text-body-sm font-semibold text-ink">해설 요약</p>
            <p className="exam-explanation-copy mt-2">
              <CitedText text={summary} examDate={question.examDate} lawVersions={question.lawVersions} />
            </p>
          </div>
        ) : null}

        {itemsWithAnswerOrExpl.length > 0 ? (
          <ol className="space-y-4">
            {itemsWithAnswerOrExpl.map((item) => (
              <ExplanationCard
                key={item.key}
                label={item.label ?? item.key}
                choiceNumber={comboChoices.length ? undefined : Number(item.key)}
                text={item.text}
                underlines={item.underlines}
                answer={item.answer}
                explanation={item.explanation}
                sources={item.sources}
                glossary={glossaryByChoice[item.key]}
                aiPrompt={buildExamItemAiPrompt({
                  ...promptContext,
                  item: { ...item, label: item.label ?? item.key, answer: item.answer ?? "" },
                })}
                examDate={question.examDate}
                lawVersions={question.lawVersions}
                hasApp={hasApp}
              />
            ))}
          </ol>
        ) : null}

        {comboWithExplanation.length > 0 ? (
          <ol className={`space-y-4 ${itemsWithAnswerOrExpl.length > 0 ? "mt-4" : ""}`}>
            {comboWithExplanation.map((choice) => (
              <ExplanationCard
                key={choice.no}
                label={choice.label}
                choiceNumber={choice.no}
                text={choice.text}
                answer={typeof choice.isCorrect === "boolean" ? (choice.isCorrect ? "O" : "X") : undefined}
                explanation={choice.explanation}
                glossary={glossaryByChoice[String(choice.no)]}
                aiPrompt={buildExamItemAiPrompt({
                  ...promptContext,
                  item: { ...choice, key: String(choice.no), answer: typeof choice.isCorrect === "boolean" ? (choice.isCorrect ? "O" : "X") : "" },
                })}
                examDate={question.examDate}
                lawVersions={question.lawVersions}
                hasApp={hasApp}
              />
            ))}
          </ol>
        ) : null}
        <ExplanationAppTools questionPrompt={itemsWithAnswerOrExpl.length + comboWithExplanation.length === 0
          ? [`${subjectLabel} ${question.year}년 ${question.questionNo}번 기출을 설명해 주세요.`, question.stem, summary].filter(Boolean).join("\n\n")
          : undefined} />
      </ExplanationAppFeatures>
    </section>
  );
}
