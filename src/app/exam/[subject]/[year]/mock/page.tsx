import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { MockExamRunner } from "@/components/exam/MockExamRunner";
import { PremiumFeatureGate } from "@/components/exam/PremiumFeatureGate";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import { getExamQuestionsForYear, type ExamSubject } from "@/lib/exam-questions";
import { getUser } from "@/lib/auth";
import { isSubjectUnlocked } from "@/lib/premium";

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
  const title = `${year}년 ${label} 모의고사`;
  return { title, openGraph: { title: `${title} | ${SITE_NAME}` } };
}

export default async function MockExamPage({ params }: MockExamPageProps) {
  const { subject, year: yearParam } = await params;
  if (!isValidSubject(subject)) notFound();

  const year = Number(yearParam);
  const label = ARCHIVE_SUBJECT_MAP[subject];
  const questions = getExamQuestionsForYear(subject, year);
  if (questions.length === 0) notFound();

  const user = await getUser();
  const unlocked = user ? await isSubjectUnlocked(user.id, subject) : false;

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <Link
          href={`/exam/${subject}/${year}`}
          className="mb-4 inline-block font-display text-body-sm text-fog transition-colors hover:text-ink"
        >
          ← {year}년 문항 목록으로
        </Link>

        <div className="mb-8">
          <EyebrowLabel className="mb-2">모의고사 · 프리미엄</EyebrowLabel>
          <SectionHeading as="h1">
            {year}년 {label} 모의고사
          </SectionHeading>
          <p className="mt-3 max-w-2xl font-display text-body text-smoke">
            {questions.length}문항을 시간 재며 풀고, 제출하면 한 번에 채점·해설을 확인해요.
          </p>
        </div>

        {!unlocked ? (
          <PremiumFeatureGate
            subject={subject}
            subjectLabel={label}
            userId={user?.id ?? null}
            featureLabel="모의고사 모드"
          />
        ) : (
          <MockExamRunner
            subject={subject}
            year={year}
            questions={questions}
            userId={user?.id ?? null}
          />
        )}
      </div>
    </div>
  );
}
