import { dailyResultMetadata, DailyResultPage } from "@/components/daily/DailyScreens";

export function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return dailyResultMetadata("gyeongbi", searchParams);
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DailyResultPage slug="gyeongbi" searchParams={searchParams} />;
}
