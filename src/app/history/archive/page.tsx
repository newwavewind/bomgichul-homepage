import type { Metadata } from "next";
import { ArchiveBoard } from "@/app/archive/page";
import { buildPageMetadata } from "@/lib/seo";
import { archiveTitle } from "@/lib/exam-track/community";

export const metadata: Metadata = buildPageMetadata({
  title: archiveTitle("history"),
  description: "한국사능력검정 기출·연표·요약 자료를 올리고 다운로드하세요.",
  path: "/history/archive",
});

type SearchParams = Promise<{
  page?: string;
  q?: string;
  sort?: string;
  type?: string;
  subject?: string;
}>;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  return <ArchiveBoard searchParams={searchParams} scope="history" />;
}
