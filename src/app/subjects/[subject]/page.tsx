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
  SITE_NAME,
  SUBJECT_LANDING_INFO,
} from "@/lib/constants";
import type { ArchiveSubject } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

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
  const title = `${label} 기출 O/X·자료`;

  return {
    title,
    description: info.description,
    alternates: { canonical: absoluteUrl(`/subjects/${subject}`) },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: info.description,
      url: absoluteUrl(`/subjects/${subject}`),
    },
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subject } = await params;
  if (!isValidSubject(subject)) notFound();

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const info = SUBJECT_LANDING_INFO[subject];
  const { data: posts, total } = await getArchivePosts({ subject, sort: "latest" });

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mb-10">
          <EyebrowLabel className="mb-2">공인중개사 {info.round} 과목</EyebrowLabel>
          <SectionHeading as="h1">{label} 기출 O/X·자료</SectionHeading>
          <p className="mt-3 max-w-2xl font-display text-body text-smoke">
            {info.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {EXAM_SUBJECT_VALUES.includes(subject) && (
              <PrimaryButton href={`/exam/${subject}`}>
                {label} 기출문제 해설 보기
              </PrimaryButton>
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
                기출 PDF, 노트, 요약 자료를 첫 번째로 올려보세요!
              </p>
              <PrimaryButton href="/archive/new">자료 올리기</PrimaryButton>
            </div>
          ) : (
            posts.map((post) => <ArchiveCard key={post.id} post={post} />)
          )}
        </ElevatedCard>
      </div>
    </div>
  );
}
