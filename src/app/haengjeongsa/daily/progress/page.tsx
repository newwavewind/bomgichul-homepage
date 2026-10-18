import { DailyProgressPage, dailyProgressMetadata } from "@/components/daily/DailyProgressScreen";

export const metadata = dailyProgressMetadata("haengjeongsa");

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DailyProgressPage slug="haengjeongsa" searchParams={searchParams} />;
}
