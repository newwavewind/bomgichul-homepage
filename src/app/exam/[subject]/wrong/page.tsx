import Link from "next/link";
import { BackLink } from "@/components/ui/BackLink";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { RandomPracticeRunner } from "@/components/exam/RandomPracticeRunner";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import { ROBOTS_NOINDEX } from "@/lib/seo";
import { shuffleQuestions, type ExamSubject } from "@/lib/exam-questions";
import { getWrongQuestionsForSubject } from "@/lib/attempts";
import { getUser } from "@/lib/auth";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

interface WrongPracticePageProps {
  params: Promise<{ subject: string }>;
}

export async function generateMetadata({ params }: WrongPracticePageProps): Promise<Metadata> {
  const { subject } = await params;
  if (!isValidSubject(subject)) return {};
  const label = ARCHIVE_SUBJECT_MAP[subject];
  const title = `${label} 오답노트 연습`;
  return {
    title,
    description: "틀린 문제를 모아 다시 풀어보는 연습 화면입니다. 로그인·학습권 전용입니다.",
    robots: ROBOTS_NOINDEX,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: "틀린 문제를 모아 다시 풀어보는 연습 화면입니다. 로그인·학습권 전용입니다.",
    },
  };
}

export default async function WrongPracticePage({ params }: WrongPracticePageProps) {
  const { subject } = await params;
  if (!isValidSubject(subject)) notFound();

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const user = await getUser();
  const wrongQuestions = user ? await getWrongQuestionsForSubject(user.id, subject) : [];
  const questions = shuffleQuestions(wrongQuestions);

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <BackLink href={`/exam/${subject}`}>{label} 과목으로</BackLink>

        <div className="mb-8">
          <EyebrowLabel className="mb-2">오답노트</EyebrowLabel>
          <SectionHeading as="h1">{label} 오답노트 연습</SectionHeading>
          <p className="mt-3 max-w-2xl font-display text-body text-smoke">
            틀렸다고 표시한 문제만 모아 다시 풀어봅니다.
          </p>
        </div>

        {!user ? (
          <div className="rounded-[var(--radius-cards)] border border-carbon bg-paper p-8 text-center">
            <p className="font-display text-body text-smoke">로그인 후 이용할 수 있어요.</p>
            <Link href="/login" className="mt-4 inline-block font-display text-body-sm font-medium text-electric-blue">
              로그인하기 →
            </Link>
          </div>
        ) : questions.length === 0 ? (
          <div className="rounded-[var(--radius-cards)] border border-carbon bg-paper p-8 text-center">
            <p className="font-display text-body text-smoke">
              {label}에서 틀렸다고 표시한 문제가 없어요.
            </p>
            <Link
              href={`/exam/${subject}/random`}
              className="mt-4 inline-block font-display text-body-sm font-medium text-electric-blue"
            >
              랜덤 문제 풀러 가기 →
            </Link>
          </div>
        ) : (
          <RandomPracticeRunner
            subject={subject}
            questions={questions}
            userId={user.id}
          />
        )}
      </div>
    </div>
  );
}
