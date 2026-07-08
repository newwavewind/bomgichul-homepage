import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ElevatedCard } from "@/components/ui/Card";
import { getNewsItems } from "@/lib/news";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "뉴스",
  description: "공인중개사 시험·정책·중개업 관련 뉴스를 매일 아침 모아드려요.",
  openGraph: {
    title: `뉴스 | ${SITE_NAME}`,
    description: "공인중개사 시험·정책·중개업 관련 뉴스를 매일 아침 모아드려요.",
  },
};

function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  return `${Number(month)}.${Number(day)}`;
}

export default async function NewsPage() {
  const items = await getNewsItems(30);

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mb-10 max-w-xl">
          <EyebrowLabel className="mb-2">매일 아침 8시 업데이트</EyebrowLabel>
          <SectionHeading as="h1">공인중개사 뉴스</SectionHeading>
          <p className="mt-3 font-display text-body text-smoke">
            시험·자격증·중개업·부동산 정책 관련 뉴스를 매일 아침 모아드려요.
          </p>
        </div>

        <ElevatedCard className="overflow-hidden">
          {items.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <p className="font-display text-body text-smoke">
                아직 모아둔 뉴스가 없어요. 내일 아침에 다시 확인해보세요.
              </p>
            </div>
          ) : (
            items.map((item, i) => (
              <a
                key={item.id}
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-start gap-3 border-b border-mist/60 px-5 py-4 transition-colors last:border-b-0 hover:bg-snow"
              >
                <span className="mt-0.5 shrink-0 font-display text-body-sm font-semibold text-electric-blue">
                  {i + 1}.
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-body-sm font-medium text-ink">
                    {item.title}
                  </p>
                  <p className="mt-1 line-clamp-2 font-display text-body-sm text-smoke">
                    {item.summary}
                  </p>
                  <p className="mt-1.5 font-display text-[12px] text-fog">
                    {item.source_name} · {formatDate(item.published_at)}
                  </p>
                </div>
              </a>
            ))
          )}
        </ElevatedCard>
      </div>
    </div>
  );
}
