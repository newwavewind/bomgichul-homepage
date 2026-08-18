import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { MockExamRunner } from "@/components/exam/MockExamRunner";
import { BackLink } from "@/components/ui/BackLink";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import { ROBOTS_NOINDEX } from "@/lib/seo";
import { getExamQuestionsForYear, type ExamSubject } from "@/lib/exam-questions";
import { getUser } from "@/lib/auth";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

interface MockExamPageProps {
  params: Promise<{ subject: string; year: string }>;
}

export async function generateMetadata({ params }: MockExamPageProps): Promise<Metadata> {
  const { subject, year } = await params;
  if (!isValidSubject(subject)) return {};
  const label = ARCHIVE_SUBJECT_MAP[subject];
  const title = `${year}년 ${label} 시험 모드`;
  return {
    title,
    description: "연도별 시험 모드로 시간 재며 푸는 화면입니다. 로그인·학습권 전용입니다.",
    robots: ROBOTS_NOINDEX,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: "연도별 시험 모드로 시간 재며 푸는 화면입니다. 로그인·학습권 전용입니다.",
    },
  };
}

export default async function MockExamPage({ params }: MockExamPageProps) {
  const { subject, year: yearParam } = await params;
  if (!isValidSubject(subject)) notFound();

  const year = Number(yearParam);
  const label = ARCHIVE_SUBJECT_MAP[subject];
  const questions = getExamQuestionsForYear(subject, year);
  if (questions.length === 0) notFound();

  const user = await getUser();

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <BackLink href={`/exam/${subject}/${year}`}>{year}년 문항 목록으로</BackLink>

        <div className="mb-8">
          <EyebrowLabel className="mb-2">시험 모드</EyebrowLabel>
          <SectionHeading as="h1">
            {year}년 {label} 시험 모드
          </SectionHeading>
          <p className="mt-3 max-w-2xl font-display text-body text-smoke">
            {questions.length}문항을 시간 재며 풀고, 제출하면 한 번에 채점·해설을 확인해요.
          </p>
        </div>

        <MockExamRunner
          subject={subject}
          year={year}
          questions={questions}
          userId={user?.id ?? null}
          saveSession
        />
      </div>
    </div>
  );
}
