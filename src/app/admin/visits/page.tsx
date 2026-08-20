import Link from "next/link";
import {
  getAdminDailyVisitTrend,
  getAdminRecentVisitsForDate,
  getAdminVisitStatsForDate,
  getAdminVisitorSummariesForDate,
  formatVisitPath,
  shortVisitorId,
  toKstDateKey,
  parseKstDateKey,
  addKstDays,
  VISIT_CLASS_LABELS,
  type VisitClass,
} from "@/lib/site-visits";
import { AdminTable, formatDateTime, formatDateTimeShort } from "@/components/admin/AdminUi";
import { VisitTrendChart } from "@/components/admin/VisitAnalyticsPanels";
import { ElevatedCard } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/Typography";
import { Suspense } from "react";

type VisitFilter = "all" | VisitClass;
const VISITORS_PER_PAGE = 50;

const FILTERS: { value: VisitFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "likely_human", label: "사람 추정" },
  { value: "verified_bot", label: "검증된 검색봇" },
  { value: "suspected_bot", label: "의심 자동화" },
  { value: "unknown", label: "판단 보류" },
];

const CLASS_STYLE: Record<VisitClass, string> = {
  likely_human: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  verified_bot: "bg-sky-50 text-sky-700 ring-sky-200",
  suspected_bot: "bg-rose-50 text-rose-700 ring-rose-200",
  unknown: "bg-slate-100 text-slate-600 ring-slate-200",
};

function visitorLabel(nickname: string | null, visitorId: string): string {
  if (nickname) return nickname;
  return `익명 ${shortVisitorId(visitorId)}`;
}

function resolveSelectedDate(raw?: string): string {
  return parseKstDateKey(raw ?? "") ?? toKstDateKey();
}

function resolveFilter(raw?: string): VisitFilter {
  return FILTERS.some((item) => item.value === raw) ? (raw as VisitFilter) : "all";
}

function ClassificationBadge({ value, confidence }: { value: VisitClass; confidence?: number }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ring-inset ${CLASS_STYLE[value]}`}>
      {VISIT_CLASS_LABELS[value]}{confidence ? ` ${confidence}%` : ""}
    </span>
  );
}

function QualityCard({ label, value, note, tone }: { label: string; value: number; note: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-mist bg-paper p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-2">
        <i className={`h-2.5 w-2.5 rounded-full ${tone}`} aria-hidden />
        <p className="font-display text-[12px] font-semibold text-smoke">{label}</p>
      </div>
      <p className="mt-2 font-display text-[28px] font-semibold leading-none text-ink">{value.toLocaleString()}</p>
      <p className="mt-2 font-display text-[11px] leading-relaxed text-fog">{note}</p>
    </div>
  );
}

export default async function AdminVisitsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; kind?: string; page?: string }>;
}) {
  const params = await searchParams;
  const selectedDate = resolveSelectedDate(params.date);
  const selectedFilter = resolveFilter(params.kind);

  const trendFrom = addKstDays(selectedDate, -59);
  const trendTo = addKstDays(selectedDate, 30);
  const [dayStatsAll, dayStats, trend, visitors, recent] = await Promise.all([
    getAdminVisitStatsForDate(selectedDate),
    getAdminVisitStatsForDate(selectedDate, { excludeLocal: true }),
    getAdminDailyVisitTrend(trendFrom, trendTo, { excludeLocal: true }),
    getAdminVisitorSummariesForDate(selectedDate, 2000),
    getAdminRecentVisitsForDate(selectedDate, 100),
  ]);

  const filteredVisitors = visitors.filter(
    (v) => !v.isLocal && (selectedFilter === "all" || v.visitClass === selectedFilter)
  );
  const totalPages = Math.max(1, Math.ceil(filteredVisitors.length / VISITORS_PER_PAGE));
  const requestedPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const currentPage = Math.min(requestedPage, totalPages);
  const remoteVisitors = filteredVisitors.slice(
    (currentPage - 1) * VISITORS_PER_PAGE,
    currentPage * VISITORS_PER_PAGE
  );
  const remoteRecent = recent.filter(
    (v) => !v.isLocal && (selectedFilter === "all" || v.botClass === selectedFilter)
  );

  const selectedLabel = new Date(`${selectedDate}T12:00:00+09:00`).toLocaleDateString(
    "ko-KR",
    {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    }
  );

  return (
    <div className="space-y-7 sm:space-y-9">
      <header className="border-b border-mist pb-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">Traffic quality</p>
            <SectionHeading as="h2" className="mt-1 text-heading-sm sm:text-subheading">방문자 품질</SectionHeading>
            <p className="mt-2 max-w-3xl font-display text-[13px] leading-relaxed text-smoke">
              쿠키 수를 실제 사람 수로 단정하지 않고 BotID·접속 패턴·체류·상호작용을 함께 봅니다.
              과거 기록은 신호가 부족해 판단 보류가 많을 수 있습니다.
            </p>
          </div>
          <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 font-display text-[11px] font-semibold text-emerald-700">
            원본 IP 미저장 · KST 기준
          </span>
        </div>
      </header>

      <Suspense fallback={<div className="h-48 animate-pulse rounded-[var(--radius-cards)] bg-snow" />}>
        <VisitTrendChart key={selectedDate} selectedDate={selectedDate} points={trend} />
      </Suspense>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <SectionHeading as="h3" className="text-heading-sm">{selectedLabel}</SectionHeading>
            <p className="mt-1 font-display text-[12px] text-fog">로컬 개발 접속 제외 · 방문자 단위 분류</p>
          </div>
          <div className="flex flex-wrap gap-1.5 font-display text-[11px] text-smoke">
            <span className="rounded-full bg-snow px-2.5 py-1">전체 {dayStats.uniqueVisitors.toLocaleString()}명</span>
            <span className="rounded-full bg-snow px-2.5 py-1">PV {dayStats.pageViews.toLocaleString()}</span>
            <span className="rounded-full bg-snow px-2.5 py-1">로그인 PV {dayStats.loggedInVisits.toLocaleString()}</span>
            {dayStatsAll.localVisitors > 0 && <span className="rounded-full bg-snow px-2.5 py-1">로컬 {dayStatsAll.localVisitors}명 제외</span>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          <QualityCard label="사람 추정" value={dayStats.likelyHumanVisitors} note="BotID 사람 판정, 로그인 또는 상호작용" tone="bg-emerald-500" />
          <QualityCard label="검증된 검색봇" value={dayStats.verifiedBotVisitors} note="Vercel에서 신원을 확인한 정상 봇" tone="bg-sky-500" />
          <QualityCard label="의심 자동화" value={dayStats.suspectedBotVisitors} note="BotID 또는 비정상 순회 패턴" tone="bg-rose-400" />
          <QualityCard label="판단 보류" value={dayStats.unknownVisitors} note="사람·봇을 가를 신호가 아직 부족" tone="bg-slate-300" />
        </div>
      </section>

      <section>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionHeading as="h3" className="text-heading-sm">방문자 분석</SectionHeading>
            <p className="mt-1 font-display text-[12px] text-fog">{filteredVisitors.length.toLocaleString()}명 중 {remoteVisitors.length}명 표시 · 각 행에서 판정 근거 확인</p>
          </div>
          <nav className="flex max-w-full gap-1 overflow-x-auto pb-1" aria-label="방문자 분류 필터">
            {FILTERS.map((filter) => {
              const query = new URLSearchParams({ date: selectedDate });
              if (filter.value !== "all") query.set("kind", filter.value);
              const active = selectedFilter === filter.value;
              return <Link key={filter.value} href={`/admin/visits?${query.toString()}`} className={`shrink-0 rounded-full px-3 py-2 font-display text-[11px] font-semibold transition-colors ${active ? "bg-electric-blue text-white" : "bg-snow text-smoke hover:bg-mist"}`}>{filter.label}</Link>;
            })}
          </nav>
        </div>
        <ElevatedCard className="overflow-hidden p-0">
          {remoteVisitors.length === 0 ? (
            <p className="px-4 py-12 text-center font-display text-[13px] text-fog">이 조건에 해당하는 방문자가 없습니다.</p>
          ) : (
            <AdminTable
              headers={["방문자", "분류", "판정 근거", "활동", "마지막 페이지", "마지막 시각"]}
              rows={remoteVisitors.map((v) => [
                <span key="visitor" className="font-semibold">{visitorLabel(v.nickname, v.visitorId)}</span>,
                <ClassificationBadge key="class" value={v.visitClass} confidence={v.confidence} />,
                <span key="reason" className="text-[12px] text-smoke">{v.reasons.join(" · ")}</span>,
                <span key="activity" className="whitespace-nowrap text-[12px] text-smoke">{v.visitCount} PV{v.interactionCount > 0 ? ` · 상호작용 ${v.interactionCount}` : ""}</span>,
                formatVisitPath(v.lastPath),
                formatDateTime(v.lastSeenAt),
              ])}
            />
          )}
        </ElevatedCard>
        {totalPages > 1 && (
          <nav className="mt-3 flex items-center justify-center gap-2 font-display text-[12px]" aria-label="방문자 페이지">
            {(() => {
              const previous = new URLSearchParams({ date: selectedDate, page: String(Math.max(1, currentPage - 1)) });
              const next = new URLSearchParams({ date: selectedDate, page: String(Math.min(totalPages, currentPage + 1)) });
              if (selectedFilter !== "all") { previous.set("kind", selectedFilter); next.set("kind", selectedFilter); }
              return <>
                <Link aria-disabled={currentPage === 1} className={`rounded-full px-3 py-2 ${currentPage === 1 ? "pointer-events-none text-mist" : "bg-snow text-smoke"}`} href={`/admin/visits?${previous.toString()}`}>← 이전</Link>
                <span className="px-2 font-semibold text-ink">{currentPage} / {totalPages}</span>
                <Link aria-disabled={currentPage === totalPages} className={`rounded-full px-3 py-2 ${currentPage === totalPages ? "pointer-events-none text-mist" : "bg-snow text-smoke"}`} href={`/admin/visits?${next.toString()}`}>다음 →</Link>
              </>;
            })()}
          </nav>
        )}
      </section>

      <details className="group rounded-2xl border border-mist bg-paper">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 font-display text-[13px] font-semibold text-ink sm:px-5">
          원본 방문 기록 100건
          <span className="text-fog transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="border-t border-mist">
          {remoteRecent.length > 0 ? (
            <AdminTable
              headers={["시각", "방문자", "분류", "기기", "페이지", "외부 유입"]}
              mobilePrimaryIndex={1}
              rows={remoteRecent.map((v) => [
                formatDateTimeShort(v.createdAt),
                visitorLabel(v.nickname, v.visitorId),
                <ClassificationBadge key="class" value={v.botClass} confidence={v.botConfidence} />,
                [v.countryCode, v.deviceType, v.browserName].filter(Boolean).join(" · ") || "—",
                formatVisitPath(v.path),
                v.referrer ? formatVisitPath(v.referrer) : "직접 방문/알 수 없음",
              ])}
            />
          ) : <p className="p-8 text-center font-display text-[13px] text-fog">방문 기록이 없습니다.</p>}
        </div>
      </details>

      <aside className="rounded-2xl bg-slate-50 px-4 py-4 font-display text-[12px] leading-relaxed text-smoke sm:px-5">
        <strong className="text-ink">판정 원칙</strong> 검증된 검색봇은 SEO에 필요한 정상 트래픽으로 별도 보존합니다. 의심 자동화는 차단 확정이 아니라 운영 검토 대상이며, 3~7일간 로그를 모아 기준을 조정합니다.
      </aside>
    </div>
  );
}
