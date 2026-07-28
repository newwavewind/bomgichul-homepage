import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { EyebrowLabel } from "@/components/ui/Typography";
import { Tag } from "@/components/ui/Tag";
import { BackLink } from "@/components/ui/BackLink";
import { ExamAnswerList } from "@/components/exam/ExamAnswerList";
import { BookmarkButton } from "@/components/exam/BookmarkButton";
import { QuestionStem } from "@/components/exam/QuestionStem";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SUBJECT_LANDING_INFO, SITE_NAME } from "@/lib/constants";
import {
  getAllExamParams,
  getExamQuestion,
  getExamQuestionsForYear,
  type ExamSubject,
} from "@/lib/exam-questions";
import { findConceptForExamQuestion, getConcept } from "@/lib/concepts";
import { appendReturnTo, isValidReturnTo, parseConceptReturnTo } from "@/lib/return-to";
import { getUser } from "@/lib/auth";
import { isQuestionBookmarked } from "@/lib/bookmarks";
import { getAttemptResult } from "@/lib/attempts";
import { getPublicMemosForQuestion } from "@/lib/question-memos";
import { isSubjectUnlocked } from "@/lib/premium";
import { QuestionMemoPanel } from "@/components/exam/QuestionMemoPanel";
import { ExamQuestionSeoExplanations } from "@/components/exam/ExamQuestionSeoExplanations";
import { ExamSeoExplanationDetails } from "@/components/exam/ExamSeoExplanationDetails";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildExamQuizJsonLd,
  truncateDescription,
} from "@/lib/seo";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

interface ExamQuestionPageProps {
  params: Promise<{ subject: string; year: string; no: string }>;
  searchParams: Promise<{ from?: string }>;
}

export function generateStaticParams() {
  return getAllExamParams();
}

export async function generateMetadata({
  params,
}: ExamQuestionPageProps): Promise<Metadata> {
  const { subject, year: yearParam, no: noParam } = await params;
  if (!isValidSubject(subject)) return {};

  const question = getExamQuestion(subject, Number(yearParam), Number(noParam));
  if (!question) return {};

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const title = `${question.year}년 ${label} ${question.questionNo}번 기출문제 해설`;
  const description = truncateDescription(
    `${question.category} · ${question.stem}${
      question.explanationSummary ? ` ${question.explanationSummary}` : ""
    }`
  );
  const canonicalPath = `/exam/${subject}/${yearParam}/${question.questionNo}`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(canonicalPath) },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(canonicalPath),
      type: "article",
      locale: "ko_KR",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function ExamQuestionPage({ params, searchParams }: ExamQuestionPageProps) {
  const { subject, year: yearParam, no: noParam } = await params;
  const { from } = await searchParams;
  if (!isValidSubject(subject)) notFound();

  const returnTo = isValidReturnTo(from) ? from : null;
  const conceptReturn = returnTo ? parseConceptReturnTo(returnTo) : null;

  const user = await getUser();
  if (conceptReturn && !user) {
    const examPath = appendReturnTo(
      `/exam/${subject}/${yearParam}/${noParam}`,
      returnTo ?? undefined
    );
    redirect(`/login?next=${encodeURIComponent(examPath)}`);
  }

  const returnConcept =
    conceptReturn && isValidSubject(conceptReturn.subject)
      ? getConcept(conceptReturn.subject, conceptReturn.slug)
      : undefined;

  const year = Number(yearParam);
  const questionNo = Number(noParam);
  const question = getExamQuestion(subject, year, questionNo);
  if (!question) notFound();

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const info = SUBJECT_LANDING_INFO[subject];
  const yearQuestions = getExamQuestionsForYear(subject, year);
  const index = yearQuestions.findIndex((q) => q.questionNo === questionNo);
  const prev = index > 0 ? yearQuestions[index - 1] : null;
  const next = index >= 0 && index < yearQuestions.length - 1 ? yearQuestions[index + 1] : null;

  const bookmarked = user ? await isQuestionBookmarked(user.id, subject, year, questionNo) : false;
  const attemptResult = user ? await getAttemptResult(user.id, subject, year, questionNo) : null;
  const publicMemos = await getPublicMemosForQuestion(subject, year, questionNo, user?.id);
  const subjectUnlocked = await isSubjectUnlocked(user?.id ?? null, subject);
  const accessible = question.free || subjectUnlocked;
  const relatedConcept = findConceptForExamQuestion(
    subject,
    question.category,
    question.subcategory
  );

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "기출문제 해설", path: "/" },
    { name: label, path: `/exam/${subject}` },
    { name: `${year}년`, path: `/exam/${subject}/${year}` },
    { name: `${questionNo}번`, path: `/exam/${subject}/${year}/${questionNo}` },
  ]);
  const quizChoices =
    question.comboChoices.length > 0
      ? question.comboChoices.map((choice) => ({
          label: choice.label,
          text: choice.text,
          key: String(choice.no),
        }))
      : question.items.map((item) => ({
          label: item.label,
          text: item.text,
          key: item.key,
        }));
  const quizJsonLd = buildExamQuizJsonLd({
    title: `${year}년 ${label} ${questionNo}번 기출문제 해설`,
    description: question.stem,
    path: `/exam/${subject}/${year}/${questionNo}`,
    subjectLabel: label,
    year,
    questionNo,
    stem: question.stem,
    choices: quizChoices,
    correctChoice: question.correctChoice,
  });

  return (
    <div className="px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {quizJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
        />
      ) : null}
      <div className="mx-auto max-w-[var(--page-max-width)]">
        {returnTo ? (
          <BackLink href={returnTo} emphasized>
            {returnConcept ? `${returnConcept.titleKo}으로 돌아가기` : "개념으로 돌아가기"}
          </BackLink>
        ) : (
          <BackLink href={`/exam/${subject}/${year}`}>{year}년 문항 목록으로</BackLink>
        )}

        <p className="mb-4 font-display text-body-sm text-fog">
          <Link href="/#exam" className="hover:text-ink">
            기출문제 해설
          </Link>{" "}
          /{" "}
          <Link href={`/exam/${subject}`} className="hover:text-ink">
            {label}
          </Link>{" "}
          /{" "}
          <Link href={`/exam/${subject}/${year}`} className="hover:text-ink">
            {year}년
          </Link>{" "}
          / {questionNo}번
        </p>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <EyebrowLabel>
              {info.round} · {label}
            </EyebrowLabel>
            <Tag className="!px-2.5 !py-0.5 !text-[12px]">
              제{question.round}회 · {year}년
            </Tag>
            <Tag className="!px-2.5 !py-0.5 !text-[12px]">{question.category}</Tag>
            {relatedConcept ? (
              <Link
                href={`/concepts/${subject}/${relatedConcept.slug}`}
                className="inline-flex items-center rounded-[var(--radius-tags)] border border-ios-blue/30 bg-ios-blue/[0.08] px-2.5 py-0.5 font-display text-[12px] font-medium text-ios-blue transition-colors hover:bg-ios-blue/[0.14]"
              >
                기출 all-in-one: {relatedConcept.titleKo}
              </Link>
            ) : null}
          </div>
          <BookmarkButton
            subject={subject}
            year={year}
            questionNo={questionNo}
            userId={user?.id ?? null}
            initialBookmarked={bookmarked}
          />
        </div>

        <QuestionStem stem={question.stem} questionNo={questionNo} />

        <ExamAnswerList
          items={question.items}
          correctChoice={question.correctChoice}
          questionType={question.questionType}
          comboChoices={question.comboChoices}
          compositeLayout={question.compositeLayout}
          tableHeader={question.tableHeader}
          stem={question.stem}
          free={accessible}
          subject={subject}
          year={year}
          questionNo={questionNo}
          userId={user?.id ?? null}
          initialAttemptResult={attemptResult}
        />

        <ExamSeoExplanationDetails
          subject={subject}
          year={year}
          questionNo={questionNo}
        >
          <ExamQuestionSeoExplanations
            question={question}
            subjectLabel={label}
            embedded
          />
        </ExamSeoExplanationDetails>

        <div className="mt-8 flex items-stretch gap-3">
          {prev ? (
            <Link
              href={appendReturnTo(`/exam/${subject}/${year}/${prev.questionNo}`, returnTo ?? undefined)}
              className="group flex flex-1 items-center gap-3 rounded-[var(--radius-cards)] border border-carbon bg-paper px-5 py-4 shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-carbon font-display text-body font-bold text-ink transition-colors group-hover:bg-carbon group-hover:text-paper">
                ←
              </span>
              <span className="flex flex-col">
                <span className="font-display text-[11px] font-semibold uppercase tracking-wide text-fog">
                  이전 문제
                </span>
                <span className="font-display text-body-sm font-bold text-ink">
                  {prev.questionNo}번
                </span>
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              href={appendReturnTo(`/exam/${subject}/${year}/${next.questionNo}`, returnTo ?? undefined)}
              className="group flex flex-1 items-center justify-end gap-3 rounded-[var(--radius-cards)] border border-carbon bg-paper px-5 py-4 text-right shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
            >
              <span className="flex flex-col items-end">
                <span className="font-display text-[11px] font-semibold uppercase tracking-wide text-fog">
                  다음 문제
                </span>
                <span className="font-display text-body-sm font-bold text-ink">
                  {next.questionNo}번
                </span>
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-carbon font-display text-body font-bold text-ink transition-colors group-hover:bg-carbon group-hover:text-paper">
                →
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        <QuestionMemoPanel
          subject={subject}
          year={year}
          questionNo={questionNo}
          userId={user?.id ?? null}
          initialMemos={publicMemos}
        />
      </div>
    </div>
  );
}
