import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { NewsDateStrip } from "@/components/news/NewsDateStrip";
import { NewsList } from "@/components/news/NewsList";
import { getNewsItems } from "@/lib/news";
import { SITE_NAME } from "@/lib/constants";
import type { NewsItem } from "@/types/database";

export const metadata: Metadata = {
  title: "뉴스",
  description: "공인중개사 시험·정책·중개업 관련 뉴스를 매일 아침 모아드려요.",
  openGraph: {
    title: `뉴스 | ${SITE_NAME}`,
    description: "공인중개사 시험·정책·중개업 관련 뉴스를 매일 아침 모아드려요.",
  },
};

interface NewsPageProps {
  searchParams: Promise<{ date?: string }>;
}

function collectNewsDates(items: NewsItem[]): string[] {
  return [...new Set(items.map((item) => item.published_at))].sort((a, b) =>
    b.localeCompare(a)
  );
}

function resolveSelectedDate(
  dates: string[],
  requested?: string
): string | null {
  if (dates.length === 0) return null;
  if (requested && dates.includes(requested)) return requested;
  return dates[0] ?? null;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { date } = await searchParams;
  const items = await getNewsItems(100);
  const dates = collectNewsDates(items);
  const selectedDate = resolveSelectedDate(dates, date);
  const filteredItems = selectedDate
    ? items.filter((item) => item.published_at === selectedDate)
    : items;

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mb-8 max-w-xl">
          <EyebrowLabel className="mb-2">매일 아침 8시 업데이트</EyebrowLabel>
          <SectionHeading as="h1">공인중개사 뉴스</SectionHeading>
          <p className="mt-3 font-display text-body text-smoke">
            시험·자격증·중개업·부동산 정책 관련 뉴스를 매일 아침 모아드려요.
          </p>
        </div>

        <NewsDateStrip dates={dates} selected={selectedDate} />
        <NewsList items={filteredItems} selectedDate={selectedDate} />
      </div>
    </div>
  );
}
