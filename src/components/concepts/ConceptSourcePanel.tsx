import type { ConceptSourceValue } from "@/lib/exam-track/types";

export type ConceptSource = ConceptSourceValue;

function normalizeSource(source: ConceptSourceValue): { title: string; locator?: string; status?: string; type?: string; verifiedAt?: string } {
  if (typeof source === "string") return { title: source };
  const title = source.title ?? source.name ?? "출처";
  const locator = source.locator ?? source.article ?? source.via;
  return { ...source, title, locator };
}

function dateIn(title: string) {
  return title.match(/20\d{2}[-.년 ]\s?\d{1,2}[-.월 ]\s?\d{1,2}/)?.[0] ?? null;
}

export function ConceptSourcePanel({ sources = [], examLabels = [], amendmentNotice }: { sources?: ConceptSource[]; examLabels?: string[]; amendmentNotice?: string }) {
  const normalized = sources.map(normalizeSource);
  const verifiedDates = [...new Set(normalized.flatMap((source) => [dateIn(source.title), source.verifiedAt ?? null]).filter(Boolean))];
  return <aside className="mt-6 rounded-2xl border border-mist bg-surface p-5" aria-label="콘텐츠 출처와 검수 정보">
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-display text-body font-semibold text-ink">출처·검수 정보</h2><span className="rounded-full bg-paper px-3 py-1 font-display text-[11px] font-semibold text-[#087f6d]">근거 공개</span></div>
    {normalized.length ? <ul className="mt-3 space-y-2">{normalized.map((source, index) => <li key={`${source.title}-${index}`} className="font-display text-body-sm text-smoke"><strong className="text-ink">{source.type === "law" ? "법령" : source.type === "case" ? "판례" : "집필·검수"}</strong> · {source.title}{source.locator ? <span className="text-fog"> · {source.locator}</span> : null}{source.status === "verified" ? <span className="ml-2 text-[#087f6d]">검수 완료</span> : null}</li>)}</ul> : <p className="mt-3 font-display text-body-sm text-smoke">연결된 공식 기출과 해설을 기준으로 구성했으며, 개별 법령·판례 출처는 확인되는 항목부터 공개합니다.</p>}
    {examLabels.length ? <p className="mt-3 font-display text-[12px] text-fog">기출 근거: {examLabels.slice(0, 6).join(" · ")}{examLabels.length > 6 ? ` 외 ${examLabels.length - 6}건` : ""}</p> : null}
    {verifiedDates.length ? <p className="mt-2 font-display text-[12px] text-fog">표시된 콘텐츠 검수 기준일: {verifiedDates.join(", ")}</p> : null}
    {amendmentNotice ? <p className="mt-2 font-display text-[12px] font-medium text-[#9a6700]">개정 반영: {amendmentNotice}</p> : null}
  </aside>;
}
