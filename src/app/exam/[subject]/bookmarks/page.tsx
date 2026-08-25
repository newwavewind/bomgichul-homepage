import Link from "next/link";
import { BackLink } from "@/components/ui/BackLink";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ElevatedCard } from "@/components/ui/Card";
import { RandomPracticeRunner } from "@/components/exam/RandomPracticeRunner";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import { ROBOTS_NOINDEX } from "@/lib/seo";
import { shuffleQuestions, type ExamSubject } from "@/lib/exam-questions";
import { getBookmarkedQuestionsForSubject } from "@/lib/bookmarks";
import { getUser } from "@/lib/auth";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

interface BookmarksPageProps {
  params: Promise<{ subject: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export async function generateMetadata({ params }: BookmarksPageProps): Promise<Metadata> {
  const { subject } = await params;
  if (!isValidSubject(subject)) return {};
  const label = ARCHIVE_SUBJECT_MAP[subject];
  const title = `${label} 북마크`;
  return {
    title,
    description: "북마크한 기출문제를 모아 보는 화면입니다. 로그인·학습권 전용입니다.",
    robots: ROBOTS_NOINDEX,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: "북마크한 기출문제를 모아 보는 화면입니다. 로그인·학습권 전용입니다.",
    },
  };
}

export default async function BookmarksPage({ params, searchParams }: BookmarksPageProps) {
  const { subject } = await params;
  const { mode } = await searchParams;
  if (!isValidSubject(subject)) notFound();

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const user = await getUser();
  const bookmarked = user ? await getBookmarkedQuestionsForSubject(user.id, subject) : [];
  const practiceMode = mode === "practice";
  const practiceQuestions = practiceMode ? shuffleQuestions(bookmarked) : [];

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <BackLink href={`/exam/${subject}`}>{label} 과목으로</BackLink>

        <div className="mb-8">
          <EyebrowLabel className="mb-2">북마크</EyebrowLabel>
          <SectionHeading as="h1">{label} 북마크</SectionHeading>
          <p className="mt-3 max-w-2xl font-display text-body text-smoke">
            별표로 저장한 문제를 모아 보고, 다시 풀어볼 수 있어요.
          </p>
        </div>

        {!user ? (
          <div className="rounded-[var(--radius-cards)] border border-carbon bg-paper p-8 text-center">
            <p className="font-display text-body text-smoke">
              북마크는 무료예요. 로그인만 하면 저장한 문제를 모아볼 수 있어요.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block font-display text-body-sm font-medium text-electric-blue"
            >
              무료로 로그인 →
            </Link>
          </div>
        ) : bookmarked.length === 0 ? (
          <div className="rounded-[var(--radius-cards)] border border-carbon bg-paper p-8 text-center">
            <p className="font-display text-body text-smoke">
              {label}에서 북마크한 문제가 없어요.
            </p>
            <Link
              href={`/exam/${subject}`}
              className="mt-4 inline-block font-display text-body-sm font-medium text-electric-blue"
            >
              기출 목록으로 →
            </Link>
          </div>
        ) : practiceMode ? (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="font-display text-body-sm text-smoke">
                  북마크 {bookmarked.length}문제 · 연습 모드
                </p>
                <Link
                  href={`/exam/${subject}/bookmarks`}
                  className="font-display text-body-sm font-medium text-electric-blue"
                >
                  목록으로 ←
                </Link>
              </div>
              <RandomPracticeRunner
                subject={subject}
                questions={practiceQuestions}
                userId={user.id}
              />
            </>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="font-display text-body-sm text-smoke">
                  총 {bookmarked.length}문제
                </p>
                <Link
                  href={`/exam/${subject}/bookmarks?mode=practice`}
                  className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-[#6366f1] px-5 py-2 font-display text-body-sm font-medium text-paper shadow-[var(--shadow-button)] transition-opacity hover:opacity-90"
                >
                  모아 풀기 →
                </Link>
              </div>
              <ElevatedCard className="overflow-hidden">
                {bookmarked.map((q) => (
                  <Link
                    key={`${q.year}-${q.questionNo}`}
                    href={`/exam/${q.subject}/${q.year}/${q.questionNo}`}
                    className="block border-b border-mist/60 px-5 py-4 transition-colors last:border-b-0 hover:bg-snow"
                  >
                    <p className="font-display text-[12px] text-fog">
                      {q.year}년 · {q.questionNo}번 · {q.category}
                    </p>
                    <p className="mt-1 font-display text-body-sm font-medium text-ink">
                      {q.stem.slice(0, 80)}
                      {q.stem.length > 80 ? "…" : ""}
                    </p>
                  </Link>
                ))}
              </ElevatedCard>
            </>
        )}
      </div>
    </div>
  );
}
