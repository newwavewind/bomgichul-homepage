import { DailyProgressPage, dailyProgressMetadata } from "@/components/daily/DailyProgressScreen";

export const metadata = dailyProgressMetadata("nomusa");

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DailyProgressPage slug="nomusa" searchParams={searchParams} />;
}
