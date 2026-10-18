import { dailyRanksMetadata, DailyRanksPage } from "@/components/daily/DailyScreens";

export function generateMetadata() {
  return dailyRanksMetadata("public-service");
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DailyRanksPage slug="public-service" searchParams={searchParams} />;
}
