import type { Metadata } from "next";
import { ArchiveBoard } from "@/app/archive/page";
import { buildArchiveListMetadata } from "@/lib/exam-track/archive-seo";

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  return buildArchiveListMetadata({
    searchParams,
    scope: "youth",
    description: "청소년상담사 1·2·3급 기출·노트·요약 자료를 과목별로 올리고 다운로드하세요.",
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
  return <ArchiveBoard searchParams={searchParams} scope="youth" />;
}
