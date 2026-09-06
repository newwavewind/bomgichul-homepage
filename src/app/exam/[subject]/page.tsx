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
import { ReviewPdfButton } from "@/components/exam/ReviewPdfButton";
import { SubjectBookmarkCount } from "@/components/exam/SubjectExtras";
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
  const title = `공인중개사 ${label} 기출문제`;
  const description = `공인중개사 ${label} 2016~2025년 기출문제를 연도별로 제공합니다. 문항을 선택해 정답과 선지별 해설을 확인하세요.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/exam/${subject}`) },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(`/exam/${subject}`),
      // 레이아웃의 og 이미지는 세그먼트 openGraph 정의에 통째로 덮인다 — 다시 넣는다.
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function ExamSubjectPage({ params }: ExamSubjectPageProps) {
  const { subject } = await params;
  if (!isValidSubject(subject)) notFound();

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const subjectRound = SUBJECT_LANDING_INFO[subject].round;
  const years = getExamYears(subject);
  // 북마크·메모 수는 클라이언트가 뒤따라 묻는다(SubjectExtras) — 서버에서
  // getUser() 로 세면 쿠키 때문에 페이지 전체가 동적 렌더로 떨어진다.
  const freeEventActive = isSubjectFreeEventActive(subject);

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <BackLink href="/#exam">과목 목록으로</BackLink>

        <header className="border-b border-mist pb-8">
          <SectionHeading as="h1">공인중개사 {label} 기출문제</SectionHeading>
          <Link href={`/concepts/${subject}`} className="mt-3 inline-flex items-center gap-1 font-display text-body-sm font-semibold text-ios-blue hover:underline">
            공인중개사 {label} 기출 올인원 →
          </Link>
        </header>

        <section className="mb-10 mt-10 pt-8">
          <div className="flex justify-end">
            <ReviewPdfButton subject={subject} subjectLabel={label} toolbar />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            <Link
              href={`/exam/${subject}/random`}
              className="rounded-2xl border border-mist bg-paper px-3 py-3 text-center font-display text-body-sm font-semibold text-ink hover:border-carbon"
            >
              🎲 랜덤 문제
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
              ★ 북마크<SubjectBookmarkCount subject={subject} />
            </Link>
          </div>
        </section>

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
