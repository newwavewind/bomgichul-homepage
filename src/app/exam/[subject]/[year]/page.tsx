import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/Typography";
import { BackLink } from "@/components/ui/BackLink";
import { ExamQuestionListCard } from "@/components/exam/ExamQuestionListCard";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import {
  getExamYears,
  getExamQuestionsForYear,
  type ExamSubject,
} from "@/lib/exam-questions";
import { PdfDownloadButton } from "@/components/exam/PdfDownloadButton";
import { MockExamHistoryLoader } from "@/components/exam/MockExamHistoryLoader";
import { absoluteUrl } from "@/lib/seo";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

interface ExamYearPageProps {
  params: Promise<{ subject: string; year: string }>;
}

export function generateStaticParams() {
  // 전량(과목 6 × 연도 10 = 약 60쪽)을 빌드에 다 구울 필요는 없다 — 방문이
  // 몰리는 최신 1개년만 사전 렌더하고, 나머지 연도는 dynamicParams 기본값
  // (true)대로 첫 방문 때 생성·캐시된다.
  return VALID_SUBJECTS.flatMap((subject) => {
    const latest = getExamYears(subject)[0];
    return latest != null ? [{ subject, year: String(latest) }] : [];
  });
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
            <PdfDownloadButton subject={subject} year={year} />
          </div>
        </div>

        <MockExamHistoryLoader subject={subject} year={year} />

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
