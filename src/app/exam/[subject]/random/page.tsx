import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { RandomPracticeRunner } from "@/components/exam/RandomPracticeRunner";
import { RandomPracticeFilters } from "@/components/exam/RandomPracticeFilters";
import { PremiumFeatureLocked } from "@/components/exam/PremiumFeatureLocked";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import { ROBOTS_NOINDEX } from "@/lib/seo";
import {
  filterExamQuestions,
  getCategoriesForSubject,
  getExamYears,
  shuffleQuestions,
  type ExamSubject,
} from "@/lib/exam-questions";
import { getUser } from "@/lib/auth";
import { isSubjectUnlocked } from "@/lib/premium";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);
const DEFAULT_SIZE = 20;

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

interface RandomPageProps {
  params: Promise<{ subject: string }>;
  searchParams: Promise<{ years?: string; categories?: string; size?: string }>;
}

export async function generateMetadata({ params }: RandomPageProps): Promise<Metadata> {
  const { subject } = await params;
  if (!isValidSubject(subject)) return {};
  const label = ARCHIVE_SUBJECT_MAP[subject];
  const title = `${label} 랜덤 문제 연습`;
  return { title, robots: ROBOTS_NOINDEX, openGraph: { title: `${title} | ${SITE_NAME}` } };
}

export default async function RandomPracticePage({ params, searchParams }: RandomPageProps) {
  const { subject } = await params;
  const { years: yearsParam, categories: categoriesParam, size: sizeParam } =
    await searchParams;
  if (!isValidSubject(subject)) notFound();

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const user = await getUser();
  const unlocked = await isSubjectUnlocked(user?.id ?? null, subject);
  const years = getExamYears(subject);
  const categories = getCategoriesForSubject(subject);

  const selectedYears = yearsParam
    ?.split(",")
    .map(Number)
    .filter((y) => years.includes(y));
  const selectedCategories = categoriesParam?.split(",").filter((c) => categories.includes(c));
  const size = Math.min(40, Math.max(10, Number(sizeParam) || DEFAULT_SIZE));

  const pool = filterExamQuestions(subject, {
    years: selectedYears?.length ? selectedYears : undefined,
    categories: selectedCategories?.length ? selectedCategories : undefined,
  });
  const questions = shuffleQuestions(pool).slice(0, size);

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
            연도·단원을 골라 원하는 범위에서 랜덤으로 풀어봅니다.
          </p>
        </div>

        {unlocked ? (
          <>
            <Suspense fallback={null}>
              <RandomPracticeFilters
                subject={subject}
                years={years}
                categories={categories}
                defaultSize={DEFAULT_SIZE}
              />
            </Suspense>

            {questions.length === 0 ? (
              <div className="rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper p-8 text-center">
                <p className="font-display text-body text-smoke">
                  선택한 조건에 맞는 문제가 없어요. 필터를 조정해 보세요.
                </p>
              </div>
            ) : (
              <RandomPracticeRunner
                subject={subject}
                questions={questions}
                userId={user?.id ?? null}
              />
            )}
          </>
        ) : (
          <PremiumFeatureLocked
            subject={subject}
            subjectLabel={label}
            featureLabel="랜덤 문제"
            description="연도·단원 필터와 함께 전체 기출 중 원하는 범위를 골라 랜덤 연습할 수 있어요."
          />
        )}
      </div>
    </div>
  );
}
