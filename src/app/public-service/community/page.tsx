import type { Metadata } from "next";
import { CommunityBoard } from "@/app/community/page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "공무원 수험생 커뮤니티",
  description: "공무원 수험생이 과목별 질문과 수험 정보를 나누는 전용 커뮤니티입니다.",
  path: "/public-service/community",
});

export default function PublicServiceCommunityPage({ searchParams }: { searchParams: Promise<{ page?: string; category?: string; q?: string; sort?: string }> }) {
  return <CommunityBoard searchParams={searchParams} scope="public_service" />;
}
