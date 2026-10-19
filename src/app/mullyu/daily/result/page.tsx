import { dailyResultMetadata, DailyResultPage } from "@/components/daily/DailyScreens";

export function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return dailyResultMetadata("mullyu", searchParams);
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DailyResultPage slug="mullyu" searchParams={searchParams} />;
}
