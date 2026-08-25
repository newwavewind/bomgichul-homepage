import Link from "next/link";
import { BackLink } from "@/components/ui/BackLink";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { RandomPracticeRunner } from "@/components/exam/RandomPracticeRunner";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import { ROBOTS_NOINDEX } from "@/lib/seo";
import type { ExamSubject } from "@/lib/exam-questions";
import { getWrongAttemptsForSubject } from "@/lib/attempts";
import { getBookmarksForUser } from "@/lib/bookmarks";
import { buildDailyReviewQueue } from "@/lib/daily-review";
import { getTodayDiary } from "@/lib/diary";
import { getKSTDateString } from "@/lib/exam";
import { getAttemptsForSubject, buildSubjectStudyStats } from "@/lib/study-analytics";
import { getUser } from "@/lib/auth";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

interface ReviewPageProps {
  params: Promise<{ subject: string }>;
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { subject } = await params;
  if (!isValidSubject(subject)) return {};
  const label = ARCHIVE_SUBJECT_MAP[subject];
  const title = `${label} 오늘의 복습`;
  return {
    title,
    description: "학습 통계와 복습 자료를 확인하는 화면입니다. 로그인·학습권 전용입니다.",
    robots: ROBOTS_NOINDEX,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: "학습 통계와 복습 자료를 확인하는 화면입니다. 로그인·학습권 전용입니다.",
    },
  };
}

export default async function DailyReviewPage({ params }: ReviewPageProps) {
  const { subject } = await params;
  if (!isValidSubject(subject)) notFound();

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const user = await getUser();

  let questions: ReturnType<typeof buildDailyReviewQueue> = [];
  let daysUntilExam: number | null = null;

  if (user) {
    const [todayDiary, bookmarks, wrongAttempts, attempts] = await Promise.all([
      getTodayDiary(user.id),
      getBookmarksForUser(user.id),
      getWrongAttemptsForSubject(user.id, subject),
      getAttemptsForSubject(user.id, subject),
    ]);

    daysUntilExam = todayDiary?.days_until_exam ?? null;
    const stats = buildSubjectStudyStats(subject, attempts);
    const subjectBookmarks = bookmarks.filter((b) => b.subject === subject);

    questions = buildDailyReviewQueue({
      subject,
      dateKey: getKSTDateString(),
      daysUntilExam,
      wrongAttempts,
      bookmarks: subjectBookmarks,
      stats,
    });
  }

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <BackLink href={`/exam/${subject}`}>{label} 과목으로</BackLink>

        <div className="mb-8">
          <EyebrowLabel className="mb-2">오늘의 복습</EyebrowLabel>
          <SectionHeading as="h1">{label} 오늘의 복습</SectionHeading>
          <p className="mt-3 max-w-2xl font-display text-body text-smoke">
            오답·북마크·약점 단원을 반영해 오늘 풀 문제 {questions.length || 10}개를 추천해요.
            {daysUntilExam != null && (
              <span className="mt-1 block text-body-sm">
                시험 D-{daysUntilExam} 기준으로 구성했어요.
              </span>
            )}
          </p>
        </div>

        {!user ? (
          <div className="rounded-[var(--radius-cards)] border border-carbon bg-paper p-8 text-center">
            <p className="font-display text-body text-smoke">
              복습·랜덤 연습은 무료예요. 로그인만 하면 바로 이용할 수 있어요.
            </p>
            <Link href="/login" className="mt-4 inline-block font-display text-body-sm font-medium text-electric-blue">
              무료로 로그인 →
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
