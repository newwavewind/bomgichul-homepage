import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicServiceQuestion } from "@/components/public-service/PublicServiceQuestion";
import { PublicServiceExamMaterials } from "@/components/public-service/PublicServiceExamMaterials";
import { QuestionConceptLinks } from "@/components/concepts/QuestionConceptLinks";
import {
  ExamQuestionSeoExplanations,
  hasExamQuestionSeoExplanations,
} from "@/components/exam/ExamQuestionSeoExplanations";
import { ExamSeoExplanationDetails } from "@/components/exam/ExamSeoExplanationDetails";
import { QuestionStem } from "@/components/exam/QuestionStem";
import { ExamQuestionJumpBar } from "@/components/exam/ExamQuestionJumpBar";
import { ExamMaterialFigure } from "@/components/exam/ExamMaterialFigure";
import { BackLink } from "@/components/ui/BackLink";
import { QuestionMemoPanel } from "@/components/exam/QuestionMemoPanel";
import { BookmarkButton } from "@/components/exam/BookmarkButton";
import { SimpleAppInstallStrip } from "@/components/ui/SimpleAppInstallStrip";
import { examMemoSubjectKey, getPublicMemosForQuestion } from "@/lib/question-memos";
import { getPublicServiceExam, getPublicServiceSubject } from "@/lib/public-service-content";
import { findTrackConceptsForExamQuestion } from "@/lib/exam-track/concept-matches";
import {
  buildBreadcrumbJsonLd,
  buildExamPageDescription,
  buildExamQuizJsonLd,
  buildPageMetadata,
} from "@/lib/seo";

type Props = { params: Promise<{ subject: string; year: string; source: string; no: string }> };

// 문항 페이지는 수천 쪽이라 빌드 때는 하나도 만들지 않고, 첫 방문 때 생성해
// 캐시한다(빈 배열이라도 있어야 정적 렌더가 된다 — 이 판 Next 규칙).
export function generateStaticParams() {
  return [];
}

// 공개 메모가 실리는 페이지 — 한 시간마다 다시 그린다.
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: subjectId, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  const data = getPublicServiceSubject(subjectId);
  const exam = getPublicServiceExam(subjectId, Number(year), source, Number(no));
  if (!data || !exam) return {};
  return buildPageMetadata({
    title: `${year}년 9급 공무원 ${source} ${data.subject.label} ${no}번 기출문제 해설`,
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
  const storageSubject = `public_service:${subjectId}:${source}`;
  const memoSubject = examMemoSubjectKey("public_service", subjectId, source);
  // 공개 메모는 SEO 본문이라 서버에서 그대로 그린다. 내 북마크·풀이기록 같은
  // 개인화는 쿠키를 걷어내려고 클라이언트(각 컴포넌트의 자체 조회)로 옮겼다.
  const publicMemos = await getPublicMemosForQuestion(
    memoSubject,
    exam.year,
    exam.questionNo,
    null,
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
  const relatedConcepts = findTrackConceptsForExamQuestion(data, exam);

  return (
    <div className="bg-white px-4 py-8 md:py-12">
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
          <BookmarkButton subject={storageSubject} year={exam.year} questionNo={exam.questionNo} loginNext={detailPath} />
        </div>
        <ExamQuestionJumpBar
          questionNos={session.map((item) => item.questionNo)}
          current={exam.questionNo}
          hrefBase={listBase}
        />
        <header className="mt-4 rounded-2xl border border-mist bg-white p-5 md:p-6">
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
          {exam.material?.figureFirst ? <ExamMaterialFigure material={exam.material} questionNo={exam.questionNo} /> : null}
          <PublicServiceExamMaterials table={exam.table} tAccounts={exam.tAccounts} stemTail={exam.stemTail} />
        </header>
        <div className="mt-6">
          {!exam.material?.figureFirst ? (
            <ExamMaterialFigure material={exam.material} questionNo={exam.questionNo} />
          ) : null}
          <PublicServiceQuestion
            exam={exam}
            subjectLabel={data.subject.label}
            storageSubject={storageSubject}
            revealSubject={storageSubject}
          />
          {hasExamQuestionSeoExplanations({ ...exam, comboChoices: [] }) ? <ExamSeoExplanationDetails
            subject={storageSubject}
            year={exam.year}
            questionNo={exam.questionNo}
            externallyToggled
          >
            <ExamQuestionSeoExplanations
              question={{ ...exam, comboChoices: [] }}
              subjectLabel={data.subject.label}
              embedded
            />
          </ExamSeoExplanationDetails> : null}
          <QuestionConceptLinks
            concepts={relatedConcepts.map((concept) => ({
              slug: concept.slug,
              titleKo: concept.titleKo,
              href: `/public-service/concepts/${subjectId}/${concept.slug}`,
            }))}
          />
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
            initialMemos={publicMemos}
            loginNext={detailPath}
          />
        </div>
        <SimpleAppInstallStrip scope="public_service" />
      </article>
    </div>
  );
}
