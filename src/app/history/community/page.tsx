import type { Metadata } from "next";
import { CommunityBoard } from "@/app/community/page";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "한국사능력검정 수험생 커뮤니티",
  description: "한국사능력검정 수험생이 질문과 수험 정보를 나누는 전용 커뮤니티입니다.",
  path: "/history/community",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  return <CommunityBoard searchParams={searchParams} scope="history" />;
}
