import { dailyResultMetadata, DailyResultPage } from "@/components/daily/DailyScreens";

export function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return dailyResultMetadata("semusa", searchParams);
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DailyResultPage slug="semusa" searchParams={searchParams} />;
}
