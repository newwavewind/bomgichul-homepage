import {
  getAdminDailyVisitTrend,
  getAdminMonthVisitorCounts,
  getAdminRecentVisitsForDate,
  getAdminVisitStatsForDate,
  getAdminVisitorSummariesForDate,
  formatVisitPath,
  formatClientAddress,
  shortVisitorId,
  toKstDateKey,
  parseKstDateKey,
  addKstDays,
} from "@/lib/site-visits";
import { AdminStatCard, AdminTable, formatDateTime, formatDateTimeShort } from "@/components/admin/AdminUi";
import {
  VisitDateCalendar,
  VisitTrendChart,
} from "@/components/admin/VisitAnalyticsPanels";
import { ElevatedCard } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/Typography";
import { Suspense } from "react";

function visitorLabel(nickname: string | null, visitorId: string): string {
  if (nickname) return nickname;
  return `익명 ${shortVisitorId(visitorId)}`;
}

function resolveSelectedDate(raw?: string): string {
  return parseKstDateKey(raw ?? "") ?? toKstDateKey();
}

function resolveCalendarMonth(
  selectedDate: string,
  monthParam?: string
): { year: number; month: number } {
  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [year, month] = monthParam.split("-").map(Number);
    if (month >= 1 && month <= 12) return { year, month };
  }
  const [year, month] = selectedDate.split("-").map(Number);
  return { year, month };
}

export default async function AdminVisitsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; month?: string }>;
}) {
  const params = await searchParams;
  const selectedDate = resolveSelectedDate(params.date);
  const { year, month } = resolveCalendarMonth(selectedDate, params.month);

  const trendFrom = addKstDays(selectedDate, -29);
  const [dayStats, trend, monthDayCounts, visitors, recent] = await Promise.all([
    getAdminVisitStatsForDate(selectedDate),
    getAdminDailyVisitTrend(trendFrom, selectedDate),
    getAdminMonthVisitorCounts(year, month),
    getAdminVisitorSummariesForDate(selectedDate, 80),
    getAdminRecentVisitsForDate(selectedDate, 80),
  ]);

  const selectedLabel = new Date(`${selectedDate}T12:00:00+09:00`).toLocaleDateString(
    "ko-KR",
    { year: "numeric", month: "long", day: "numeric", weekday: "short" }
  );

  return (
    <div className="space-y-6 sm:space-y-10">
      <div>
        <SectionHeading as="h2" className="mb-2 text-heading-sm sm:text-subheading">
          방문 현황
        </SectionHeading>
        <p className="font-display text-[13px] leading-relaxed text-smoke sm:text-body-sm">
          날짜별 방문·비회원 접속 주소(
          <code className="rounded bg-surface px-1 text-[12px]">localhost</code> 또는 IP)를
          확인합니다.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-6">
        <Suspense fallback={<div className="h-80 animate-pulse rounded-[var(--radius-cards)] bg-snow" />}>
          <VisitDateCalendar
            selectedDate={selectedDate}
            year={year}
            month={month}
            dayCounts={monthDayCounts}
          />
        </Suspense>
        <VisitTrendChart points={trend} selectedDate={selectedDate} />
      </div>

      <section>
        <SectionHeading as="h3" className="mb-1 text-heading-sm">
          {selectedLabel}
        </SectionHeading>
        <p className="mb-4 font-display text-body-sm text-smoke">
          선택한 날짜의 방문 집계 (한국 시간 0시~24시)
        </p>
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
          <AdminStatCard
            label="페이지뷰"
            value={dayStats.pageViews}
            hint="해당 일 전체 조회"
          />
          <AdminStatCard
            label="순 방문자"
            value={dayStats.uniqueVisitors}
            hint="브라우저(쿠키) 기준"
          />
          <AdminStatCard
            label="비로그인 방문자"
            value={dayStats.anonymousVisitors}
            hint="로그인 없이 온 순 방문자"
          />
          <AdminStatCard
            label="로컬 접속"
            value={dayStats.localVisitors}
            hint="localhost 등 개발 접속"
          />
          <AdminStatCard
            label="로그인 방문"
            value={dayStats.loggedInVisits}
            hint="로그인 상태 페이지뷰"
          />
        </div>
      </section>

      <section>
        <SectionHeading as="h3" className="mb-4 text-heading-sm">
          {selectedLabel} 방문자
        </SectionHeading>
        <ElevatedCard className="overflow-hidden p-0">
          {visitors.length === 0 ? (
            <p className="px-4 py-10 text-center font-display text-[13px] text-fog sm:px-6 sm:py-12 sm:text-body-sm">
              이 날짜에 기록된 방문이 없습니다. 달력에서 다른 날짜를 선택해 보세요.
            </p>
          ) : (
            <AdminTable
              headers={[
                "방문자",
                "접속 주소",
                "방문 수",
                "마지막 페이지",
                "로컬",
                "마지막 시각",
              ]}
              rows={visitors.map((v) => [
                visitorLabel(v.nickname, v.visitorId),
                v.userId
                  ? "—"
                  : formatClientAddress(v.clientHost, v.clientIp, v.isLocal),
                String(v.visitCount),
                formatVisitPath(v.lastPath),
                v.isLocal ? "예" : "—",
                formatDateTime(v.lastSeenAt),
              ])}
            />
          )}
        </ElevatedCard>
      </section>

      <section>
        <SectionHeading as="h3" className="mb-4 text-heading-sm">
          {selectedLabel} 방문 기록
        </SectionHeading>
        <ElevatedCard className="overflow-hidden p-0">
          {recent.length === 0 ? (
            <p className="px-4 py-10 text-center font-display text-[13px] text-fog sm:px-6 sm:py-12 sm:text-body-sm">
              방문 기록이 없습니다.
            </p>
          ) : (
            <AdminTable
              headers={["시각", "방문자", "접속 주소", "페이지", "유입", "로컬"]}
              mobilePrimaryIndex={1}
              rows={recent.map((v) => [
                formatDateTimeShort(v.createdAt),
                visitorLabel(v.nickname, v.visitorId),
                v.userId
                  ? "—"
                  : formatClientAddress(v.clientHost, v.clientIp, v.isLocal),
                formatVisitPath(v.path),
                v.referrer ? formatVisitPath(v.referrer) : "—",
                v.isLocal ? "예" : "—",
              ])}
            />
          )}
        </ElevatedCard>
      </section>
    </div>
  );
}
