import { dailyPlayMetadata, DailyPlayPage } from "@/components/daily/DailyScreens";

export function generateMetadata() {
  return dailyPlayMetadata("gyeongbi");
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DailyPlayPage slug="gyeongbi" searchParams={searchParams} />;
}
