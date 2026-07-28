import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
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
  const info = SUBJECT_LANDING_INFO[subject];
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

        <p className="mb-4 font-display text-body-sm text-fog">
          <Link href="/#exam" className="hover:text-ink">
            기출문제 해설
          </Link>{" "}
          / {label}
        </p>

        <div className="mb-10">
          <EyebrowLabel className="mb-2">공인중개사 {info.round} 과목</EyebrowLabel>
          <SectionHeading as="h1">{label} 기출문제 해설</SectionHeading>
          <p className="mt-3 max-w-2xl font-display text-body text-smoke">
            연도를 선택해 문항별 정답과 해설을 확인하세요.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/exam/${subject}/random`}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-[#6366f1] px-5 py-2 font-display text-body-sm font-medium text-paper shadow-[var(--shadow-button)] transition-opacity hover:opacity-90"
            >
              🎲 {unlocked ? "랜덤 문제" : "랜덤 문제"}
            </Link>
            <Link
              href={`/exam/${subject}/wrong`}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
            >
              📕 오답노트 연습
            </Link>
            <Link
              href={`/exam/${subject}/review`}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
            >
              📅 오늘의 복습
            </Link>
            <Link
              href={`/exam/${subject}/bookmarks`}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
            >
              ★ 북마크{subjectBookmarkCount > 0 ? ` (${subjectBookmarkCount})` : ""}
            </Link>
            <ReviewPdfButton
              subject={subject}
              subjectLabel={label}
              unlocked={unlocked}
              bookmarkCount={subjectBookmarkCount}
              noteCount={notes.length}
            />
            <Link
              href={`/concepts/${subject}`}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
            >
              📘 기출 all-in-one
            </Link>
          </div>
        </div>

        {!freeEventActive && (
          <div id="unlock" className="mb-8 scroll-mt-24 space-y-4">
            <PremiumCodeRedeem subject={subject} userId={user?.id ?? null} unlocked={unlocked} />
          </div>
        )}

        <div className="space-y-2">
          <p className="px-1 font-display text-[13px] font-semibold uppercase tracking-[0.04em] text-fog">
            연도별 기출
          </p>
          <div className="overflow-hidden rounded-2xl bg-paper shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.05]">
            {years.map((year, index) => {
              const questions = getExamQuestionsForYear(subject, year);
              const round = questions[0]?.round;
              const isLast = index === years.length - 1;

              return (
                <Link
                  key={year}
                  href={`/exam/${subject}/${year}`}
                  className={`group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-black/[0.03] active:bg-black/[0.05] sm:px-5 sm:py-4 ${
                    !isLast ? "border-b border-mist/50" : ""
                  }`}
                >
                  <span className="min-w-0 flex-1 font-display text-[17px] font-semibold leading-tight tracking-[-0.02em] text-ink">
                    {year}년 기출
                  </span>
                  {round != null ? (
                    <span className="shrink-0 font-display text-[15px] text-fog">
                      제{round}회
                    </span>
                  ) : null}
                  <span
                    aria-hidden
                    className="shrink-0 text-fog/70 transition-transform group-hover:translate-x-0.5"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
