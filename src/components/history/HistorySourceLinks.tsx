import type { ExplanationSource } from "@/lib/exam-track/types";

/**
 * 해설 밑 「근거」 — 누르면 출처 페이지(한국민족문화대백과사전·우리역사넷 등)가 새 창으로 열린다.
 * 출처는 사실 확인용 링크다. 문장은 옮기지 않고 새로 썼다.
 */
const ALLOWED = /^https:\/\/(contents\.history\.go\.kr|db\.history\.go\.kr|sillok\.history\.go\.kr|encykorea\.aks\.ac\.kr|www\.heritage\.go\.kr|www\.emuseum\.go\.kr|db\.itkc\.or\.kr|www\.archives\.go\.kr|ko\.wikipedia\.org)\//;

export function HistorySourceLinks({
  sources,
  variant = "chips",
}: {
  sources?: ExplanationSource[];
  variant?: "chips" | "list";
}) {
  const safe = (sources ?? []).filter((s) => s?.label && ALLOWED.test(s.url));
  if (!safe.length) return null;
  if (variant === "list") {
    return (
      <div className="border-t border-dashed border-mist pt-3">
        <p className="mb-1.5 font-display text-[11px] font-semibold text-smoke">근거</p>
        <ul className="space-y-1">
          {safe.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-system text-[13px] text-ink underline decoration-mist underline-offset-4 hover:decoration-ink"
              >
                {s.label} <span aria-hidden>↗</span>
                <span className="sr-only">(새 창에서 열림)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className="font-display text-[11px] font-semibold text-smoke">근거</span>
      {safe.map((s) => (
        <a
          key={s.url}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-mist bg-snow px-2.5 py-0.5 font-system text-[12px] text-ink hover:border-carbon/40"
        >
          {s.label}
          <span aria-hidden>↗</span>
          <span className="sr-only">(새 창에서 열림)</span>
        </a>
      ))}
    </div>
  );
}
