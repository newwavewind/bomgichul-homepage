import type { Metadata } from "next";
import { ArchiveBoard } from "@/app/archive/page";
import { buildPageMetadata } from "@/lib/seo";
import { archiveTitle } from "@/lib/exam-track/community";

export const metadata: Metadata = buildPageMetadata({
  title: archiveTitle("social_worker"),
  description: "사회복지사 1급 기출·노트·요약 자료를 과목별로 올리고 다운로드하세요.",
  path: "/social-worker/archive",
});

type SearchParams = Promise<{
  page?: string;
  q?: string;
  sort?: string;
  type?: string;
  subject?: string;
}>;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  return <ArchiveBoard searchParams={searchParams} scope="social_worker" />;
}
