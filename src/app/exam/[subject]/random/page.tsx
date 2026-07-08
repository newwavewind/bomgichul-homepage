import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { RandomPracticeRunner } from "@/components/exam/RandomPracticeRunner";
import { PremiumFeatureLocked } from "@/components/exam/PremiumFeatureLocked";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import { getExamQuestionsForSubject, type ExamSubject } from "@/lib/exam-questions";
import { getUser } from "@/lib/auth";
import { isSubjectUnlocked } from "@/lib/premium";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);
const RANDOM_SET_SIZE = 20;

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface RandomPageProps {
  params: Promise<{ subject: string }>;
}

export async function generateMetadata({ params }: RandomPageProps): Promise<Metadata> {
  const { subject } = await params;
  if (!isValidSubject(subject)) return {};
  const label = ARCHIVE_SUBJECT_MAP[subject];
  const title = `${label} 랜덤 문제 연습`;
  return { title, openGraph: { title: `${title} | ${SITE_NAME}` } };
}

export default async function RandomPracticePage({ params }: RandomPageProps) {
  const { subject } = await params;
  if (!isValidSubject(subject)) notFound();

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const user = await getUser();
  const unlocked = user ? await isSubjectUnlocked(user.id, subject) : false;

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <Link
          href={`/exam/${subject}`}
          className="mb-4 inline-block font-display text-body-sm text-fog transition-colors hover:text-ink"
        >
          ← {label} 과목으로
        </Link>

        <div className="mb-8">
          <EyebrowLabel className="mb-2">랜덤 문제 · 프리미엄</EyebrowLabel>
          <SectionHeading as="h1">{label} 랜덤 문제</SectionHeading>
          <p className="mt-3 max-w-2xl font-display text-body text-smoke">
            전체 연도 기출 중 {RANDOM_SET_SIZE}문제를 무작위로 뽑아 풀어봅니다.
          </p>
        </div>

        {unlocked ? (
          <RandomPracticeRunner
            subject={subject}
            questions={shuffle(getExamQuestionsForSubject(subject)).slice(0, RANDOM_SET_SIZE)}
            userId={user?.id ?? null}
          />
        ) : (
          <PremiumFeatureLocked
            subject={subject}
            subjectLabel={label}
            featureLabel="랜덤 문제"
            description={`전체 연도 기출 중 ${RANDOM_SET_SIZE}문제를 무작위로 뽑아 풀고, 문제마다 바로 채점·해설을 확인할 수 있어요.`}
          />
        )}
      </div>
    </div>
  );
}
