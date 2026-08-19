import type { Metadata } from "next";
import { ArchiveBoard } from "@/app/archive/page";
import { buildPageMetadata } from "@/lib/seo";
import { archiveTitle } from "@/lib/exam-track/community";

export const metadata: Metadata = buildPageMetadata({
  title: archiveTitle("english"),
  description: "공무원 영어 기출·어휘·요약 자료를 올리고 다운로드하세요.",
  path: "/english/archive",
});

type SearchParams = Promise<{
  page?: string;
  q?: string;
  sort?: string;
  type?: string;
  subject?: string;
}>;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  return <ArchiveBoard searchParams={searchParams} scope="english" />;
}
