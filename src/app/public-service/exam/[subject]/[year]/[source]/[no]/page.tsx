import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicServiceQuestion } from "@/components/public-service/PublicServiceQuestion";
import { QuestionStem } from "@/components/exam/QuestionStem";
import { ExamQuestionJumpBar } from "@/components/exam/ExamQuestionJumpBar";
import { BackLink } from "@/components/ui/BackLink";
import { QuestionMemoPanel } from "@/components/exam/QuestionMemoPanel";
import { BookmarkButton } from "@/components/exam/BookmarkButton";
import { getUser } from "@/lib/auth";
import { getAttemptResult } from "@/lib/attempts";
import { isQuestionBookmarked } from "@/lib/bookmarks";
import { examMemoSubjectKey, getPublicMemosForQuestion } from "@/lib/question-memos";
import { getPublicServiceExam, getPublicServiceSubject } from "@/lib/public-service-content";
import {
  buildBreadcrumbJsonLd,
  buildExamPageDescription,
  buildExamQuizJsonLd,
  buildPageMetadata,
} from "@/lib/seo";

type Props = { params: Promise<{ subject: string; year: string; source: string; no: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: subjectId, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  const data = getPublicServiceSubject(subjectId);
  const exam = getPublicServiceExam(subjectId, Number(year), source, Number(no));
  if (!data || !exam) return {};
  return buildPageMetadata({
    title: `${year}년 ${source} ${data.subject.label} ${no}번 기출문제 해설`,
    description: buildExamPageDescription({
      category: exam.category,
      stem: exam.stem,
      correctChoice: exam.correctChoice,
      explanationSummary: exam.explanationSummary,
      items: exam.items,
    }),
    path: `/public-service/exam/${subjectId}/${year}/${source}/${no}`,
  });
}

export default async function PublicServiceExamDetailPage({ params }: Props) {
  const { subject: subjectId, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  const data = getPublicServiceSubject(subjectId);
  const exam = getPublicServiceExam(subjectId, Number(year), source, Number(no));
  if (!data || !exam) notFound();
  const session = data.exams
    .filter((item) => item.year === Number(year) && item.sourceCode === source)
    .sort((a, b) => a.questionNo - b.questionNo);
  const position = session.findIndex((item) => item.questionNo === exam.questionNo);
  const previous = position > 0 ? session[position - 1] : null;
  const next = position >= 0 && position < session.length - 1 ? session[position + 1] : null;
  const listBase = `/public-service/exam/${subjectId}/${year}/${encodeURIComponent(source)}`;
  const detailPath = `${listBase}/${exam.questionNo}`;
  const user = await getUser();
  const storageSubject = `public_service:${subjectId}:${source}`;
  const [bookmarked, initialAttemptResult] = user
    ? await Promise.all([
        isQuestionBookmarked(user.id, storageSubject, exam.year, exam.questionNo),
        getAttemptResult(user.id, storageSubject, exam.year, exam.questionNo),
      ])
    : [false, null];
  const memoSubject = examMemoSubjectKey("public_service", subjectId, source);
  const publicMemos = await getPublicMemosForQuestion(
    memoSubject,
    exam.year,
    exam.questionNo,
    user?.id,
  );
  const title = `${year}년 ${source} ${data.subject.label} ${exam.questionNo}번 기출문제 해설`;
  const canonicalPath = `/public-service/exam/${subjectId}/${year}/${source}/${exam.questionNo}`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "홈", path: "/" },
    { name: "공무원", path: "/public-service" },
    { name: data.subject.label, path: `/public-service/exam/${subjectId}` },
    { name: `${year}년 ${source}`, path: `/public-service/exam/${subjectId}/${year}/${source}` },
    { name: `${exam.questionNo}번`, path: canonicalPath },
  ]);
  const quizJsonLd = buildExamQuizJsonLd({
    title,
    description: exam.stem,
    path: canonicalPath,
    subjectLabel: data.subject.label,
    year: exam.year,
    questionNo: exam.questionNo,
    stem: exam.stem,
    choices: exam.items.map((item) => ({
      label: item.label || item.key,
      text: item.text,
      key: item.key,
    })),
    correctChoice: String(exam.correctChoice ?? ""),
    educationalLevel: "9급 공무원 시험",
    aboutName: `9급 공무원 ${data.subject.label}`,
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
        <div className="flex items-start justify-between gap-3">
          <BackLink href={listBase}>{year}년 {source} 목록</BackLink>
          <BookmarkButton subject={storageSubject} year={exam.year} questionNo={exam.questionNo} userId={user?.id ?? null} initialBookmarked={bookmarked} loginNext={detailPath} />
        </div>
        <ExamQuestionJumpBar
          questionNos={session.map((item) => item.questionNo)}
          current={exam.questionNo}
          hrefBase={listBase}
        />
        <header className="mt-4 rounded-2xl border border-mist bg-paper p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <p className="font-display text-[13px] font-semibold text-electric-blue">
              {data.subject.label} · {year}년 {source}
            </p>
            {exam.category ? (
              <span className="rounded-full bg-snow px-2.5 py-0.5 font-display text-[12px] text-smoke">
                {exam.category}
              </span>
            ) : null}
            {exam.subcategory && exam.subcategory !== exam.category ? (
              <span className="rounded-full bg-snow px-2.5 py-0.5 font-display text-[12px] text-smoke">
                {exam.subcategory}
              </span>
            ) : null}
            </div>
          </div>
          <div className="mt-5">
            <QuestionStem stem={exam.stem} questionNo={exam.questionNo} />
          </div>
        </header>
        <div className="mt-6">
          <PublicServiceQuestion exam={exam} subjectLabel={data.subject.label} userId={user?.id ?? null} storageSubject={storageSubject} initialAttemptResult={initialAttemptResult} />
        </div>
        <nav className="mt-8 grid grid-cols-2 gap-3">
          {previous ? (
            <Link
              href={`${listBase}/${previous.questionNo}`}
              className="rounded-2xl border border-mist px-4 py-3 font-display text-body-sm hover:border-carbon"
            >
              ← {previous.questionNo}번
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`${listBase}/${next.questionNo}`}
              className="rounded-2xl border border-mist px-4 py-3 text-right font-display text-body-sm hover:border-carbon"
            >
              {next.questionNo}번 →
            </Link>
          ) : null}
        </nav>
        <div className="mt-8">
          <QuestionMemoPanel
            subject={memoSubject}
            year={exam.year}
            questionNo={exam.questionNo}
            userId={user?.id ?? null}
            initialMemos={publicMemos}
            loginNext={detailPath}
          />
        </div>
      </article>
    </div>
  );
}
