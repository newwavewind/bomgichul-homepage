import { CommunityBoard } from "@/app/community/page";
import {
  buildCommunityListMetadata,
  type CommunitySearchParams,
} from "@/lib/exam-track/community-seo";

export function generateMetadata({ searchParams }: { searchParams: CommunitySearchParams }) {
  return buildCommunityListMetadata({ searchParams, scope: "public_service" });
}

export default function PublicServiceCommunityPage({ searchParams }: { searchParams: CommunitySearchParams }) {
  return <CommunityBoard searchParams={searchParams} scope="public_service" />;
}
