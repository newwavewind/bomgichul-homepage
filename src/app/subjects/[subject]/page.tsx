import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArchivePosts } from "@/lib/archive";
import { ArchiveCard } from "@/components/archive/ArchiveCard";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ElevatedCard } from "@/components/ui/Card";
import {
  ARCHIVE_SUBJECTS,
  ARCHIVE_SUBJECT_MAP,
  EXAM_SUBJECTS,
  PC_APP_URL,
  SUBJECT_LANDING_INFO,
} from "@/lib/constants";
import type { ArchiveSubject } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import { getUserActivityScores } from "@/lib/activity";
import { getConceptsForSubject } from "@/lib/concepts";
import { getExamYears } from "@/lib/exam-questions";

const VALID_SUBJECTS = ARCHIVE_SUBJECTS.map((s) => s.value).filter(
  (v): v is Exclude<ArchiveSubject, "all"> => v !== "all"
);
const EXAM_SUBJECT_VALUES = EXAM_SUBJECTS.map((s) => s.value) as string[];

interface SubjectPageProps {
  params: Promise<{ subject: string }>;
}

function isValidSubject(value: string): value is Exclude<ArchiveSubject, "all"> {
  return (VALID_SUBJECTS as string[]).includes(value);
}

export function generateStaticParams() {
  return VALID_SUBJECTS.map((subject) => ({ subject }));
}

export async function generateMetadata({
  params,
}: SubjectPageProps): Promise<Metadata> {
  const { subject } = await params;
  if (!isValidSubject(subject)) return {};

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const info = SUBJECT_LANDING_INFO[subject];
  const isExamSubject = EXAM_SUBJECT_VALUES.includes(subject);
  const title = isExamSubject
    ? `${label} 기출·개념·자료`
    : `${label} 학습 자료`;
  const description = isExamSubject
    ? `${label} 기출문제 해설, 기출 all-in-one 개념, 수험생 공유 자료를 한곳에서 확인하세요. ${info.description}`
    : `${label} 관련 수험 자료를 모았습니다. ${info.description}`;

  return buildPageMetadata({
    title,
    description,
    path: `/subjects/${subject}`,
  });
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subject } = await params;
  if (!isValidSubject(subject)) notFound();

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const info = SUBJECT_LANDING_INFO[subject];
  const { data: posts, total } = await getArchivePosts({ subject, sort: "latest" });
  const authorActivity = await getUserActivityScores(posts.map((post) => post.author_id));
  const isExamSubject = EXAM_SUBJECT_VALUES.includes(subject);
  const conceptCount = isExamSubject ? getConceptsForSubject(subject as never).length : 0;
  const examYears = isExamSubject ? getExamYears(subject as never) : [];

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mb-10">
          <EyebrowLabel className="mb-2">공인중개사 {info.round} 과목</EyebrowLabel>
          <SectionHeading as="h1">
            {isExamSubject ? `${label} 기출·개념·자료` : `${label} 학습 자료`}
          </SectionHeading>
          <p className="mt-3 max-w-2xl font-display text-body text-smoke">
            {info.description}
          </p>
          {isExamSubject ? (
            <p className="mt-2 font-display text-body-sm text-fog">
              기출 all-in-one 개념 {conceptCount}개
              {examYears.length > 0
                ? ` · 기출 ${examYears[examYears.length - 1]}~${examYears[0]}년`
                : ""}
              {total > 0 ? ` · 자료 ${total}개` : ""}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            {isExamSubject && (
              <>
                <PrimaryButton href={`/exam/${subject}`}>
                  {label} 기출문제 해설
                </PrimaryButton>
                <SecondaryButton href={`/concepts/${subject}`}>
                  {label} 기출 all-in-one
                </SecondaryButton>
              </>
            )}
            <SecondaryButton href={`/archive?subject=${subject}`}>
              {label} 자료실 전체보기
            </SecondaryButton>
            <a
              href={PC_APP_URL}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-5 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
            >
              PC앱에서 학습하기
            </a>
          </div>
        </div>

        <div className="mb-4 font-display text-body-sm text-fog">
          {label} 자료 {total}개
        </div>

        <ElevatedCard className="overflow-hidden">
          {posts.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <p className="mb-2 font-display text-body text-smoke">
                아직 등록된 {label} 자료가 없어요
              </p>
              <p className="mb-6 font-display text-body-sm text-fog">
                {isExamSubject
                  ? "기출문제 해설과 기출 all-in-one 개념은 바로 볼 수 있어요."
                  : "기출 PDF, 노트, 요약 자료를 첫 번째로 올려보세요!"}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {isExamSubject ? (
                  <>
                    <PrimaryButton href={`/exam/${subject}`}>기출문제 해설</PrimaryButton>
                    <SecondaryButton href={`/concepts/${subject}`}>
                      기출 all-in-one
                    </SecondaryButton>
                  </>
                ) : (
                  <PrimaryButton href="/archive/new">자료 올리기</PrimaryButton>
                )}
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <ArchiveCard
                key={post.id}
                post={post}
                authorRank={authorActivity[post.author_id]?.rank}
              />
            ))
          )}
        </ElevatedCard>
      </div>
    </div>
  );
}
