import { DailyWrongNotebookPage, dailyWrongNotebookMetadata } from "@/components/daily/DailyWrongNotebookScreen";

export const metadata = dailyWrongNotebookMetadata("mullyu");

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DailyWrongNotebookPage slug="mullyu" searchParams={searchParams} />;
}

