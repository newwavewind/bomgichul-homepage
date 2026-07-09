import { ElevatedCard } from "@/components/ui/Card";
import { distinctSummary } from "@/lib/news-feed";
import type { NewsItem } from "@/types/database";

function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  return `${Number(month)}.${Number(day)}`;
}

interface NewsListProps {
  items: NewsItem[];
  selectedDate: string | null;
}

export function NewsList({ items, selectedDate }: NewsListProps) {
  return (
    <ElevatedCard className="overflow-hidden">
      {items.length === 0 ? (
        <div className="px-6 py-20 text-center">
          <p className="font-display text-body text-smoke">
            {selectedDate
              ? "이 날짜에 모아둔 뉴스가 없어요."
              : "아직 모아둔 뉴스가 없어요. 내일 아침에 다시 확인해보세요."}
          </p>
        </div>
      ) : (
        items.map((item, i) => {
          const summary = distinctSummary(item.title, item.summary);
          const showDateInMeta = !selectedDate;

          return (
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
                {summary ? (
                  <p className="mt-1 line-clamp-2 font-display text-body-sm text-smoke">
                    {summary}
                  </p>
                ) : null}
                <p
                  className={`font-display text-[12px] text-fog ${summary ? "mt-1.5" : "mt-1"}`}
                >
                  {showDateInMeta
                    ? `${item.source_name} · ${formatDate(item.published_at)}`
                    : item.source_name}
                </p>
              </div>
            </a>
          );
        })
      )}
    </ElevatedCard>
  );
}
