import type { Metadata } from "next";
import { DiaryBoard } from "@/app/diary/page";
import { buildPageMetadata } from "@/lib/seo";
import { communityScopeLabel, diaryTitle } from "@/lib/exam-track/community";

export const metadata: Metadata = buildPageMetadata({
  title: diaryTitle("english"),
  description: `${communityScopeLabel("english")} 시험 D-day 기준으로 수험생들의 공개 일기를 읽고 오늘의 공부 기록을 남겨보세요.`,
  path: "/english/diary",
});

type SearchParams = Promise<{ d?: string }>;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  return <DiaryBoard searchParams={searchParams} scope="english" />;
}
