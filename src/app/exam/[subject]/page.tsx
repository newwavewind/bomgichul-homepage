import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ElevatedCard } from "@/components/ui/Card";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import {
  EXAM_SUBJECTS,
  ARCHIVE_SUBJECT_MAP,
  SUBJECT_LANDING_INFO,
  PC_APP_URL,
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
import { SubjectFreeEventBanner } from "@/components/exam/SubjectFreeEventBanner";
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
        <Link
          href="/exam"
          className="mb-4 inline-block font-display text-body-sm text-fog transition-colors hover:text-ink"
        >
          ← 과목 목록으로
        </Link>

        <p className="mb-4 font-display text-body-sm text-fog">
          <Link href="/exam" className="hover:text-ink">
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
            <SecondaryButton href={`/subjects/${subject}`}>
              {label} 자료실 보기
            </SecondaryButton>
            <a
              href={PC_APP_URL}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
            >
              PC앱에서 목차별·개념카드 학습
            </a>
            <Link
              href={`/exam/${subject}/random`}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-[#6366f1] px-5 py-2 font-display text-body-sm font-medium text-paper shadow-[var(--shadow-button)] transition-opacity hover:opacity-90"
            >
              🎲 {unlocked ? "랜덤 문제" : "랜덤 문제"}
            </Link>
            <Link
              href={`/exam/${subject}/wrong`}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
            >
              📕 오답노트 연습
            </Link>
            <Link
              href={`/exam/${subject}/review`}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
            >
              📅 오늘의 복습
            </Link>
            <ReviewPdfButton
              subject={subject}
              subjectLabel={label}
              unlocked={unlocked}
              bookmarkCount={subjectBookmarkCount}
              noteCount={notes.length}
            />
          </div>
        </div>

        <div id="unlock" className="mb-8 scroll-mt-24 space-y-4">
          <SubjectFreeEventBanner subject={subject} />
          {!freeEventActive && (
            <PremiumCodeRedeem subject={subject} userId={user?.id ?? null} unlocked={unlocked} />
          )}
        </div>

        <ElevatedCard className="overflow-hidden">
          {years.map((year) => {
            const questions = getExamQuestionsForYear(subject, year);
            const originallyFree = questions[0]?.free ?? false;
            const accessible = originallyFree || unlocked;
            const tagLabel = originallyFree ? "무료" : unlocked ? "해제됨" : "프리미엄";
            return (
              <Link
                key={year}
                href={`/exam/${subject}/${year}`}
                className="flex items-center justify-between gap-3 border-b border-mist/60 px-5 py-4 transition-colors last:border-b-0 hover:bg-snow"
              >
                <span className="font-display text-body font-medium text-ink">
                  {year}년 기출 ({questions.length}문항)
                </span>
                <Tag className={!accessible ? "!border-fog !text-fog" : ""}>
                  {tagLabel}
                </Tag>
              </Link>
            );
          })}
        </ElevatedCard>
      </div>
    </div>
  );
}
