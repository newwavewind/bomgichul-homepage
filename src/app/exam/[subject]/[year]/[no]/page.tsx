import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BookmarkButton } from "@/components/exam/BookmarkButton";
import { ExamOxQuestion } from "@/components/exam/ExamOxQuestion";
import { QuestionConceptLinks } from "@/components/concepts/QuestionConceptLinks";
import {
  ExamQuestionSeoExplanations,
  hasExamQuestionSeoExplanations,
} from "@/components/exam/ExamQuestionSeoExplanations";
import { ExamSeoExplanationDetails } from "@/components/exam/ExamSeoExplanationDetails";
import { ExamQuestionJumpBar } from "@/components/exam/ExamQuestionJumpBar";
import { QuestionStem } from "@/components/exam/QuestionStem";
import { QuestionMemoPanel } from "@/components/exam/QuestionMemoPanel";
import {
  ConceptReturnLoginGate,
  ExamBackLink,
  ReturnAwareNavLink,
} from "@/components/exam/ReturnToClient";
import { SimpleAppInstallStrip } from "@/components/ui/SimpleAppInstallStrip";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import {
  getExamQuestion,
  getExamQuestionsForYear,
  type ExamSubject,
} from "@/lib/exam-questions";
import { findConceptsForExamQuestion } from "@/lib/concepts";
import { getPublicMemosForQuestion } from "@/lib/question-memos";
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
}

// 공개 메모가 실리는 페이지 — 정적(ISR)으로 캐시하되 한 시간마다 다시 굽는다.
export const revalidate = 3600;

export function generateStaticParams() {
  // 전량(1만 쪽 남짓)을 돌려주면 빌드가 그만큼 사전 렌더한다 — 빈 배열로 두고
  // dynamicParams 기본값(true)에 맡겨 첫 방문 때 생성·캐시되게 한다.
  return [];
}

export async function generateMetadata({
  params,
}: ExamQuestionPageProps): Promise<Metadata> {
  const { subject, year: yearParam, no: noParam } = await params;
  if (!isValidSubject(subject)) return {};

  const question = getExamQuestion(subject, Number(yearParam), Number(noParam));
  if (!question) return {};

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const title = `${question.year}년 공인중개사 ${label} ${question.questionNo}번 기출문제 해설`;
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
      // 레이아웃의 og 이미지는 세그먼트 openGraph 정의에 통째로 덮인다 — 다시 넣는다.
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
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

export default async function ExamQuestionPage({ params }: ExamQuestionPageProps) {
  const { subject, year: yearParam, no: noParam } = await params;
  if (!isValidSubject(subject)) notFound();

  const year = Number(yearParam);
  const questionNo = Number(noParam);
  const question = getExamQuestion(subject, year, questionNo);
  if (!question) notFound();
  const relatedConcepts = findConceptsForExamQuestion(subject, question);

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const yearQuestions = getExamQuestionsForYear(subject, year);
  const index = yearQuestions.findIndex((q) => q.questionNo === questionNo);
  const prev = index > 0 ? yearQuestions[index - 1] : null;
  const next = index >= 0 && index < yearQuestions.length - 1 ? yearQuestions[index + 1] : null;

  // 서버는 방문자를 모른다(쿠키를 읽으면 동적 렌더로 떨어진다) — 메모 본문은
  // 공개 데이터라 여기서 그대로 렌더해 SEO 본문으로 남기고, 「내 좋아요」 같은
  // 개인화는 QuestionMemoPanel 이 클라이언트에서 덧입힌다.
  const publicMemos = await getPublicMemosForQuestion(subject, year, questionNo);
  const listBase = `/exam/${subject}/${year}`;
  // 로그인 뒤 이 문항으로는 돌아오지만, ?from=(개념 복귀) 문맥은 잃는다 —
  // 서버가 searchParams 를 읽을 수 없어서다. 개념 복귀 중 로그인이 필요한
  // 경우는 ConceptReturnLoginGate 가 from 을 이어붙여 따로 보낸다.
  const detailPath = `${listBase}/${questionNo}`;

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
      <ConceptReturnLoginGate />
      <article className="mx-auto max-w-4xl">
        <div className="flex items-start justify-between gap-3">
          <ExamBackLink listBase={listBase} listLabel={`${year}년 문항 목록`} />
          <BookmarkButton
            subject={subject}
            year={year}
            questionNo={questionNo}
            loginNext={detailPath}
          />
        </div>

        <ExamQuestionJumpBar
          questionNos={yearQuestions.map((q) => q.questionNo)}
          current={questionNo}
          hrefBase={listBase}
        />

        <header className="mt-4 rounded-2xl border border-mist bg-white p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
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
          </div>
          <div className="mt-5">
            <QuestionStem stem={question.stem} questionNo={questionNo} />
          </div>
        </header>

        <div className="mt-6">
          <ExamOxQuestion
            examId={`${subject}-${year}-${questionNo}`}
            revealEvent={{ subject, year, questionNo }}
            items={question.items}
            correctChoice={Number(question.correctChoice)}
            explanationSummary={question.explanationSummary}
            comboChoices={question.comboChoices}
            renderExplanation={false}
            loginNext={detailPath}
          />
          {hasExamQuestionSeoExplanations(question) ? <ExamSeoExplanationDetails
            subject={subject}
            year={year}
            questionNo={questionNo}
            externallyToggled
          >
            <ExamQuestionSeoExplanations
              question={question}
              subjectLabel={label}
              embedded
            />
          </ExamSeoExplanationDetails> : null}
          <QuestionConceptLinks
            concepts={relatedConcepts.map((concept) => ({
              slug: concept.slug,
              titleKo: concept.titleKo,
              href: `/concepts/${subject}/${concept.slug}`,
            }))}
          />
        </div>

        <nav className="mt-8 grid grid-cols-2 gap-3">
          {prev ? (
            <ReturnAwareNavLink
              href={`${listBase}/${prev.questionNo}`}
              className="rounded-2xl border border-mist px-4 py-3 font-display text-body-sm hover:border-carbon"
            >
              ← {prev.questionNo}번
            </ReturnAwareNavLink>
          ) : (
            <span />
          )}
          {next ? (
            <ReturnAwareNavLink
              href={`${listBase}/${next.questionNo}`}
              className="rounded-2xl border border-mist px-4 py-3 text-right font-display text-body-sm hover:border-carbon"
            >
              {next.questionNo}번 →
            </ReturnAwareNavLink>
          ) : null}
        </nav>

        <div className="mt-8">
          <QuestionMemoPanel
            subject={subject}
            year={year}
            questionNo={questionNo}
            initialMemos={publicMemos}
            loginNext={detailPath}
          />
        </div>
        <SimpleAppInstallStrip scope="real_estate" />
      </article>
    </div>
  );
}
