import { dailyPlayMetadata, DailyPlayPage } from "@/components/daily/DailyScreens";

export function generateMetadata() {
  return dailyPlayMetadata("housing");
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DailyPlayPage slug="housing" searchParams={searchParams} />;
}
