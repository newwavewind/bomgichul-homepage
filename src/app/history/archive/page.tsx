import type { Metadata } from "next";
import { ArchiveBoard } from "@/app/archive/page";
import { buildArchiveListMetadata } from "@/lib/exam-track/archive-seo";

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  return buildArchiveListMetadata({
    searchParams,
    scope: "history",
    description: "한국사능력검정 기출·연표·요약 자료를 올리고 다운로드하세요.",
  });
}

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
