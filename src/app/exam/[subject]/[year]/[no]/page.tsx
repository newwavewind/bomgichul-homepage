import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { BackLink } from "@/components/ui/BackLink";
import { BookmarkButton } from "@/components/exam/BookmarkButton";
import { ExamOxQuestion } from "@/components/exam/ExamOxQuestion";
import { ExamQuestionJumpBar } from "@/components/exam/ExamQuestionJumpBar";
import { PremiumFeatureLocked } from "@/components/exam/PremiumFeatureLocked";
import { QuestionStem } from "@/components/exam/QuestionStem";
import { QuestionMemoPanel } from "@/components/exam/QuestionMemoPanel";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import {
  getAllExamParams,
  getExamQuestion,
  getExamQuestionsForYear,
  type ExamSubject,
} from "@/lib/exam-questions";
import { getConcept } from "@/lib/concepts";
import { appendReturnTo, isValidReturnTo, parseConceptReturnTo } from "@/lib/return-to";
import { getUser } from "@/lib/auth";
import { isQuestionBookmarked } from "@/lib/bookmarks";
import { getPublicMemosForQuestion } from "@/lib/question-memos";
import { isSubjectUnlocked } from "@/lib/premium";
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
  const yearQuestions = getExamQuestionsForYear(subject, year);
  const index = yearQuestions.findIndex((q) => q.questionNo === questionNo);
  const prev = index > 0 ? yearQuestions[index - 1] : null;
  const next = index >= 0 && index < yearQuestions.length - 1 ? yearQuestions[index + 1] : null;

  const bookmarked = user ? await isQuestionBookmarked(user.id, subject, year, questionNo) : false;
  const publicMemos = await getPublicMemosForQuestion(subject, year, questionNo, user?.id);
  const subjectUnlocked = await isSubjectUnlocked(user?.id ?? null, subject);
  const accessible = question.free || subjectUnlocked;
  const listBase = `/exam/${subject}/${year}`;
  const detailPath = appendReturnTo(`${listBase}/${questionNo}`, returnTo ?? undefined);

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
      <article className="mx-auto max-w-4xl">
        {returnTo ? (
          <BackLink href={returnTo} emphasized>
            {returnConcept ? `${returnConcept.titleKo}으로 돌아가기` : "개념으로 돌아가기"}
          </BackLink>
        ) : (
          <Link href={listBase} className="font-display text-body-sm text-fog hover:text-ink">
            ← {year}년 문항 목록
          </Link>
        )}

        <ExamQuestionJumpBar
          questionNos={yearQuestions.map((q) => q.questionNo)}
          current={questionNo}
          hrefBase={listBase}
        />

        <header className="mt-4 rounded-2xl border border-mist bg-paper p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
              <p className="font-display text-[13px] font-semibold text-electric-blue">
                {label} · {year}년 제{question.round}회
              </p>
              {question.category ? (
                <span className="rounded-full bg-snow px-2.5 py-0.5 font-display text-[12px] text-smoke">
                  {question.category}
                </span>
              ) : null}
              {question.subcategory && question.subcategory !== question.category ? (
                <span className="rounded-full bg-snow px-2.5 py-0.5 font-display text-[12px] text-smoke">
                  {question.subcategory}
                </span>
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
          <div className="mt-5">
            <QuestionStem stem={question.stem} questionNo={questionNo} />
          </div>
        </header>

        <div className="mt-6">
          {accessible ? (
            <ExamOxQuestion
              examId={`${subject}-${year}-${questionNo}`}
              items={question.items}
              correctChoice={Number(question.correctChoice)}
              explanationSummary={question.explanationSummary}
              comboChoices={question.comboChoices}
            />
          ) : (
            <PremiumFeatureLocked
              subject={subject}
              subjectLabel={label}
              featureLabel="전체 해설"
              description={`${year}년 ${questionNo}번 문항의 정답·해설은 프리미엄에서 확인할 수 있어요.`}
            />
          )}
        </div>

        <nav className="mt-8 grid grid-cols-2 gap-3">
          {prev ? (
            <Link
              href={appendReturnTo(`${listBase}/${prev.questionNo}`, returnTo ?? undefined)}
              className="rounded-2xl border border-mist px-4 py-3 font-display text-body-sm hover:border-carbon"
            >
              ← {prev.questionNo}번
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={appendReturnTo(`${listBase}/${next.questionNo}`, returnTo ?? undefined)}
              className="rounded-2xl border border-mist px-4 py-3 text-right font-display text-body-sm hover:border-carbon"
            >
              {next.questionNo}번 →
            </Link>
          ) : null}
        </nav>

        <div className="mt-8">
          <QuestionMemoPanel
            subject={subject}
            year={year}
            questionNo={questionNo}
            userId={user?.id ?? null}
            initialMemos={publicMemos}
            loginNext={detailPath}
          />
        </div>
      </article>
    </div>
  );
}
