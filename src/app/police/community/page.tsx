import { CommunityBoard } from "@/app/community/page";
import {
  buildCommunityListMetadata,
  type CommunitySearchParams,
} from "@/lib/exam-track/community-seo";

export function generateMetadata({ searchParams }: { searchParams: CommunitySearchParams }) {
  return buildCommunityListMetadata({ searchParams, scope: "police" });
}

export default async function Page({ searchParams }: { searchParams: CommunitySearchParams }) {
  return <CommunityBoard searchParams={searchParams} scope="police" />;
}
