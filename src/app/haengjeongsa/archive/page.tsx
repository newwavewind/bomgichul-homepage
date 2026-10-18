import type { Metadata } from "next";
import { ArchiveBoard } from "@/app/archive/page";
import { buildArchiveListMetadata } from "@/lib/exam-track/archive-seo";

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  return buildArchiveListMetadata({
    searchParams,
    scope: "haengjeongsa",
    description: "행정사 기출·노트·요약 자료를 과목별로 올리고 다운로드하세요.",
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
  return <ArchiveBoard searchParams={searchParams} scope="haengjeongsa" />;
}
