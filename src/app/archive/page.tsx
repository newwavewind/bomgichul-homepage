import { Suspense } from "react";
import type { Metadata } from "next";
import { getArchivePosts } from "@/lib/archive";
import { ArchiveCard } from "@/components/archive/ArchiveCard";
import { ArchiveFilters } from "@/components/archive/ArchiveFilters";
import { ArchivePagination } from "@/components/archive/ArchivePagination";
import { SearchBar, SortSelect } from "@/components/board/SearchBar";
import { PrimaryButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ElevatedCard } from "@/components/ui/Card";
import type { SortOption } from "@/lib/constants";
import {
  ARCHIVE_RESOURCE_TYPE_MAP,
  ARCHIVE_SUBJECT_MAP,
} from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

interface ArchivePageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
    type?: string;
    subject?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: ArchivePageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.q?.trim() ?? "";
  const resourceType = params.type ?? "all";
  const subject = params.subject ?? "all";

  let title = "공인중개사 자료실";
  if (resourceType !== "all") {
    title = `${ARCHIVE_RESOURCE_TYPE_MAP[resourceType] ?? resourceType} 자료`;
  }
  if (subject !== "all") {
    const subjectLabel = ARCHIVE_SUBJECT_MAP[subject] ?? subject;
    title = resourceType !== "all" ? `${subjectLabel} ${title}` : `${subjectLabel} 자료실`;
  }
  if (page > 1) title = `${title} ${page}페이지`;

  return buildPageMetadata({
    title,
    description:
      "공인중개사 기출 PDF, 노트, 요약 자료를 과목별로 올리고 다운로드하세요. 수험생이 공유한 학습 자료를 한곳에서 찾아보세요.",
    path: "/archive",
    canonicalParams: {
      type: resourceType,
      subject,
      page,
    },
    noIndex: Boolean(search),
  });
}

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.q ?? "";
  const sort = (params.sort as SortOption) || "latest";
  const resourceType = params.type ?? "all";
  const subject = params.subject ?? "all";

  const { data: posts, totalPages, total } = await getArchivePosts({
    page,
    search,
    sort,
    resourceType,
    subject,
  });

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <EyebrowLabel className="mb-2">공인중개사 수험 자료 공유</EyebrowLabel>
            <SectionHeading as="h1">자료실</SectionHeading>
            <p className="mt-2 font-display text-body-sm text-smoke">
              공인중개사 기출, 노트, 요약 자료를 올리고 다운로드하세요 · 총 {total}개
            </p>
          </div>
          <PrimaryButton href="/archive/new">자료 올리기</PrimaryButton>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Suspense fallback={null}>
            <SearchBar defaultValue={search} placeholder="자료 검색..." basePath="/archive" />
          </Suspense>
          <Suspense fallback={null}>
            <SortSelect current={sort} basePath="/archive" />
          </Suspense>
        </div>

        <div className="mb-8">
          <Suspense fallback={null}>
            <ArchiveFilters />
          </Suspense>
        </div>

        <ElevatedCard className="overflow-hidden">
          {posts.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <p className="mb-2 font-display text-body text-smoke">
                {search ? "검색 결과가 없어요" : "아직 등록된 자료가 없어요"}
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

        <ArchivePagination
          currentPage={page}
          totalPages={totalPages}
          search={search}
          sort={sort}
          type={resourceType}
          subject={subject}
        />
      </div>
    </div>
  );
}
