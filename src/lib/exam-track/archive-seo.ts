import type { Metadata } from "next";
import { ARCHIVE_RESOURCE_TYPE_MAP, archiveSubjectsForScope } from "@/lib/constants";
import { archiveBaseHref, archiveTitle } from "@/lib/exam-track/community";
import { hasPublicListingContent } from "@/lib/exam-track/public-listing-content";
import { buildPageMetadata } from "@/lib/seo";
import type { CommunityScope } from "@/types/database";

export type ArchiveSearchParams = Promise<{
  page?: string;
  q?: string;
  sort?: string;
  type?: string;
  subject?: string;
  year?: string;
  round?: string;
  track?: string;
}>;

export async function buildArchiveListMetadata({
  searchParams,
  scope,
  description,
}: {
  searchParams: ArchiveSearchParams;
  scope: CommunityScope;
  description: string;
}): Promise<Metadata> {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const resourceType = params.type ?? "all";
  const subject = params.subject ?? "all";
  const search = params.q?.trim() ?? "";
  const sort = params.sort ?? "latest";
  let title = archiveTitle(scope);
  const subjectLabel = archiveSubjectsForScope(scope).find((item) => item.value === subject)?.label;
  if (resourceType !== "all") {
    title = `${ARCHIVE_RESOURCE_TYPE_MAP[resourceType] ?? resourceType} 자료 | ${title}`;
  }
  if (subject !== "all" && subjectLabel) title = `${subjectLabel} | ${title}`;
  if (page > 1) title = `${title} ${page}페이지`;

  // Keep paginated collections discoverable, but not search/filter variants.
  const hasFilters = resourceType !== "all" || subject !== "all" ||
    Boolean(params.year || params.round) || Boolean(params.track && params.track !== "all");
  const isKnownEmpty = scope === "gamjeong" &&
    (await hasPublicListingContent(scope, "archive")) === false;
  return buildPageMetadata({
    title,
    description,
    path: archiveBaseHref(scope),
    canonicalParams: {
      page,
      type: resourceType,
      subject,
      year: params.year,
      round: params.round,
      track: params.track,
    },
    noIndex: Boolean(search) || sort !== "latest" || hasFilters || isKnownEmpty,
  });
}
