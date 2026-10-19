import { CommunityBoard } from "@/app/community/page";
import { hasPublicListingContent } from "@/lib/exam-track/public-listing-content";
import { ROBOTS_NOINDEX_FOLLOW } from "@/lib/seo";
import {
  buildCommunityListMetadata,
  type CommunitySearchParams,
} from "@/lib/exam-track/community-seo";

export async function generateMetadata({ searchParams }: { searchParams: CommunitySearchParams }) {
  const [metadata, hasContent] = await Promise.all([
    buildCommunityListMetadata({ searchParams, scope: "mullyu" }),
    hasPublicListingContent("mullyu", "community"),
  ]);
  return hasContent === false
    ? { ...metadata, robots: ROBOTS_NOINDEX_FOLLOW }
    : metadata;
}

export default async function Page({ searchParams }: { searchParams: CommunitySearchParams }) {
  return <CommunityBoard searchParams={searchParams} scope="mullyu" />;
}
