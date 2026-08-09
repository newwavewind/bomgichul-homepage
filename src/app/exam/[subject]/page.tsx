import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/Typography";
import { BackLink } from "@/components/ui/BackLink";
import {
  EXAM_SUBJECTS,
  ARCHIVE_SUBJECT_MAP,
  SUBJECT_LANDING_INFO,
  SITE_NAME,
} from "@/lib/constants";
import {
  getExamYears,
  getExamQuestionsForYear,
  type ExamSubject,
} from "@/lib/exam-questions";
import { getBookmarksForUser } from "@/lib/bookmarks";
import { getNotesForSubject } from "@/lib/notes";
import { getUser } from "@/lib/auth";
import { isSubjectUnlocked } from "@/lib/premium";
import { PremiumCodeRedeem } from "@/components/exam/PremiumCodeRedeem";
import { ReviewPdfButton } from "@/components/exam/ReviewPdfButton";
import { ExamSessionCard } from "@/components/exam/ExamSessionCard";
import { ExamSessionGroup } from "@/components/exam/ExamSessionGroup";
import { isSubjectFreeEventActive } from "@/lib/promotions";
import { absoluteUrl } from "@/lib/seo";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

interface ExamSubjectPageProps {
  params: Promise<{ subject: string }>;
}

export function generateStaticParams() {
  return VALID_SUBJECTS.map((subject) => ({ subject }));
}

export async function generateMetadata({
  params,
}: ExamSubjectPageProps): Promise<Metadata> {
  const { subject } = await params;
  if (!isValidSubject(subject)) return {};

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const title = `${label} 기출문제 해설 | 연도별`;
  const description = `${label} 2016~2025년 기출문제를 연도별로 모아뒀습니다. 문항을 선택해 정답과 해설을 확인하세요.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/exam/${subject}`) },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(`/exam/${subject}`),
    },
  };
}

export default async function ExamSubjectPage({ params }: ExamSubjectPageProps) {
  const { subject } = await params;
  if (!isValidSubject(subject)) notFound();

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const subjectRound = SUBJECT_LANDING_INFO[subject].round;
  const years = getExamYears(subject);
  const user = await getUser();
  const unlocked = await isSubjectUnlocked(user?.id ?? null, subject);
  const [bookmarks, notes] = user
    ? await Promise.all([getBookmarksForUser(user.id), getNotesForSubject(user.id, subject)])
    : [[], []];
  const subjectBookmarkCount = bookmarks.filter((b) => b.subject === subject).length;
  const freeEventActive = isSubjectFreeEventActive(subject);

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <BackLink href="/#exam">과목 목록으로</BackLink>

        <header className="border-b border-mist pb-8">
          <SectionHeading as="h1">{label}</SectionHeading>
        </header>

        <section className="mb-10 mt-10 pt-8">
          <div className="flex justify-end">
            <ReviewPdfButton
              subject={subject}
              subjectLabel={label}
              unlocked={unlocked}
              bookmarkCount={subjectBookmarkCount}
              noteCount={notes.length}
              toolbar
            />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            <Link
              href={`/exam/${subject}/random`}
              className="rounded-2xl border border-mist bg-paper px-3 py-3 text-center font-display text-body-sm font-semibold text-ink hover:border-carbon"
            >
              🎲 {unlocked ? "랜덤 문제" : "랜덤 문제"}
            </Link>
            <Link
              href={`/exam/${subject}/wrong`}
              className="rounded-2xl border border-mist bg-paper px-3 py-3 text-center font-display text-body-sm font-semibold text-ink hover:border-carbon"
            >
              📕 오답노트 연습
            </Link>
            <Link
              href={`/exam/${subject}/review`}
              className="rounded-2xl border border-mist bg-paper px-3 py-3 text-center font-display text-body-sm font-semibold text-ink hover:border-carbon"
            >
              📅 오늘의 복습
            </Link>
            <Link
              href={`/exam/${subject}/bookmarks`}
              className="rounded-2xl border border-mist bg-paper px-3 py-3 text-center font-display text-body-sm font-semibold text-ink hover:border-carbon"
            >
              ★ 북마크{subjectBookmarkCount > 0 ? ` (${subjectBookmarkCount})` : ""}
            </Link>
          </div>
        </section>

        {!freeEventActive && !unlocked && user && (
          <div id="unlock" className="mb-8 scroll-mt-24 space-y-4">
            <PremiumCodeRedeem subject={subject} userId={user?.id ?? null} unlocked={unlocked} />
          </div>
        )}

        <div className="max-w-2xl">
          <ExamSessionGroup title={subjectRound}>
            {years.map((year) => {
              const questions = getExamQuestionsForYear(subject, year);
              return (
                <ExamSessionCard
                  key={year}
                  href={`/exam/${subject}/${year}`}
                  year={year}
                  questionCount={questions.length}
                />
              );
            })}
          </ExamSessionGroup>
        </div>
      </div>
    </div>
  );
}
