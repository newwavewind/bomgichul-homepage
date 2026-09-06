import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/Typography";
import { BackLink } from "@/components/ui/BackLink";
import { ExamQuestionListCard } from "@/components/exam/ExamQuestionListCard";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import {
  getExamYearParams,
  getExamQuestionsForYear,
  type ExamSubject,
} from "@/lib/exam-questions";
import { getUser } from "@/lib/auth";
import { PdfDownloadButton } from "@/components/exam/PdfDownloadButton";
import { MockExamHistory } from "@/components/exam/MockExamHistory";
import { getMockExamSessions } from "@/lib/mock-exam-sessions";
import { absoluteUrl } from "@/lib/seo";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

interface ExamYearPageProps {
  params: Promise<{ subject: string; year: string }>;
}

export function generateStaticParams() {
  return getExamYearParams();
}

export async function generateMetadata({
  params,
}: ExamYearPageProps): Promise<Metadata> {
  const { subject, year } = await params;
  if (!isValidSubject(subject)) return {};

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const title = `${year}년 공인중개사 ${label} 기출문제`;
  const description = `${year}년 공인중개사 ${label} 기출문제 전체 문항의 정답과 해설을 확인하세요.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/exam/${subject}/${year}`) },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(`/exam/${subject}/${year}`),
      // 레이아웃의 og 이미지는 세그먼트 openGraph 정의에 통째로 덮인다 — 다시 넣는다.
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function ExamYearPage({ params }: ExamYearPageProps) {
  const { subject, year: yearParam } = await params;
  if (!isValidSubject(subject)) notFound();

  const year = Number(yearParam);
  const label = ARCHIVE_SUBJECT_MAP[subject];
  const questions = getExamQuestionsForYear(subject, year);
  if (questions.length === 0) notFound();

  const user = await getUser();
  const mockSessions = user ? await getMockExamSessions(user.id, subject, year) : [];

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <BackLink href={`/exam/${subject}`}>{label} 과목으로</BackLink>

        <div className="mb-10">
          <SectionHeading as="h1">
            {year}년 {label} 기출문제 해설
          </SectionHeading>

          <div className="mt-6 flex flex-wrap items-start gap-3">
            <Link
              href={`/exam/${subject}/${year}/mock`}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-[#6366f1] px-5 py-2 font-display text-body-sm font-medium text-paper shadow-[var(--shadow-button)] transition-opacity hover:opacity-90"
            >
              📝 시험 모드
            </Link>
            <PdfDownloadButton
              subject={subject}
              year={year}
              canDownload={Boolean(user)}
            />
          </div>
        </div>

        <MockExamHistory sessions={mockSessions} />

        <div className="grid gap-3 sm:grid-cols-2">
          {questions.map((q) => (
            <ExamQuestionListCard
              key={q.questionNo}
              href={`/exam/${subject}/${year}/${q.questionNo}`}
              questionNo={q.questionNo}
              stem={q.stem}
              category={q.category}
              subcategory={q.subcategory}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
