import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { MockExamRunner } from "@/components/exam/MockExamRunner";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import { getExamQuestionsForYear, type ExamSubject } from "@/lib/exam-questions";
import { getUser } from "@/lib/auth";
import { isSubjectUnlocked } from "@/lib/premium";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);
const PREVIEW_SET_SIZE = 5;

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
  const allQuestions = getExamQuestionsForYear(subject, year);
  if (allQuestions.length === 0) notFound();

  const user = await getUser();
  const unlocked = user ? await isSubjectUnlocked(user.id, subject) : false;
  const questions = unlocked ? allQuestions : allQuestions.slice(0, PREVIEW_SET_SIZE);

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
          <EyebrowLabel className="mb-2">
            모의고사 · {unlocked ? "프리미엄" : "무료 미리보기"}
          </EyebrowLabel>
          <SectionHeading as="h1">
            {year}년 {label} 모의고사
          </SectionHeading>
          <p className="mt-3 max-w-2xl font-display text-body text-smoke">
            {unlocked
              ? `${allQuestions.length}문항을 시간 재며 풀고, 제출하면 한 번에 채점·해설을 확인해요.`
              : `지금은 ${PREVIEW_SET_SIZE}문항 무료 미리보기예요. 프리미엄을 해제하면 ${allQuestions.length}문항 전체를 시간 재며 풀 수 있어요.`}
          </p>
        </div>

        <MockExamRunner
          subject={subject}
          subjectLabel={label}
          year={year}
          questions={questions}
          userId={user?.id ?? null}
          unlocked={unlocked}
          totalQuestionCount={allQuestions.length}
        />
      </div>
    </div>
  );
}
