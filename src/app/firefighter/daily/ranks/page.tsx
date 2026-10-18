import { dailyRanksMetadata, DailyRanksPage } from "@/components/daily/DailyScreens";

export function generateMetadata() {
  return dailyRanksMetadata("firefighter");
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DailyRanksPage slug="firefighter" searchParams={searchParams} />;
}
