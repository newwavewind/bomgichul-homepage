import { dailyPlayMetadata, DailyPlayPage } from "@/components/daily/DailyScreens";

export function generateMetadata() {
  return dailyPlayMetadata("real-estate");
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DailyPlayPage slug="real-estate" searchParams={searchParams} />;
}
