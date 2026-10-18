import { dailyPlayMetadata, DailyPlayPage } from "@/components/daily/DailyScreens";

export function generateMetadata() {
  return dailyPlayMetadata("sonhae");
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DailyPlayPage slug="sonhae" searchParams={searchParams} />;
}
