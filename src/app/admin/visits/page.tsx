import {
  getAdminDailyVisitTrend,
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
import { VisitTrendChart } from "@/components/admin/VisitAnalyticsPanels";
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

export default async function AdminVisitsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; month?: string }>;
}) {
  const params = await searchParams;
  const selectedDate = resolveSelectedDate(params.date);

  const trendFrom = addKstDays(selectedDate, -59);
  const trendTo = addKstDays(selectedDate, 30);
  const [dayStatsAll, dayStats, trend, visitors, recent] = await Promise.all([
    getAdminVisitStatsForDate(selectedDate),
    getAdminVisitStatsForDate(selectedDate, { excludeLocal: true }),
    getAdminDailyVisitTrend(trendFrom, trendTo, { excludeLocal: true }),
    getAdminVisitorSummariesForDate(selectedDate, 80),
    getAdminRecentVisitsForDate(selectedDate, 80),
  ]);

  const remoteVisitors = visitors.filter((v) => !v.isLocal);
  const remoteRecent = recent.filter((v) => !v.isLocal);

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
    <div className="space-y-6 sm:space-y-10">
      <div>
        <SectionHeading as="h2" className="mb-2 text-heading-sm sm:text-subheading">
          방문 현황
        </SectionHeading>
        <p className="font-display text-[13px] leading-relaxed text-smoke sm:text-body-sm">
          아래 숫자는 <strong className="font-semibold text-ink">localhost 개발 접속을 제외</strong>한
          값입니다. 회원 수와는 다른 지표입니다(쿠키 기준 브라우저 방문). Cursor·브라우저로{" "}
          <code className="rounded bg-surface px-1 text-[12px]">www.bomgichul.com</code>을 열면
          로컬이 아니라 일반 방문으로 잡힐 수 있습니다.
        </p>
      </div>

      <Suspense fallback={<div className="h-48 animate-pulse rounded-[var(--radius-cards)] bg-snow" />}>
        <VisitTrendChart selectedDate={selectedDate} points={trend} />
      </Suspense>

      <section>
        <SectionHeading as="h3" className="mb-1 text-heading-sm">
          {selectedLabel}
        </SectionHeading>
        <p className="mb-4 font-display text-body-sm text-smoke">
          실방문 집계 (로컬 제외) · 같은 날 전체 {dayStatsAll.pageViews} PV / 로컬 방문자{" "}
          {dayStatsAll.localVisitors}명 포함 시
        </p>
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
          <AdminStatCard
            label="페이지뷰"
            value={dayStats.pageViews}
            hint="로컬 제외 · 해당 일 조회"
          />
          <AdminStatCard
            label="순 방문자"
            value={dayStats.uniqueVisitors}
            hint="로컬 제외 · 쿠키 기준"
          />
          <AdminStatCard
            label="비로그인 방문자"
            value={dayStats.anonymousVisitors}
            hint="로컬 제외 · 미로그인"
          />
          <AdminStatCard
            label="로컬 접속(참고)"
            value={dayStatsAll.localVisitors}
            hint="localhost 등 개발 — 위 집계에서 제외됨"
          />
          <AdminStatCard
            label="로그인 방문"
            value={dayStats.loggedInVisits}
            hint="로컬 제외 · 로그인 PV"
          />
        </div>
      </section>

      <section>
        <SectionHeading as="h3" className="mb-4 text-heading-sm">
          {selectedLabel} 방문자 (로컬 제외)
        </SectionHeading>
        <ElevatedCard className="overflow-hidden p-0">
          {remoteVisitors.length === 0 ? (
            <p className="px-4 py-10 text-center font-display text-[13px] text-fog sm:px-6 sm:py-12 sm:text-body-sm">
              이 날짜에 로컬이 아닌 방문이 없습니다. 추이 차트에서 다른 날짜를 선택해 보세요.
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
              rows={remoteVisitors.map((v) => [
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
          {selectedLabel} 방문 기록 (로컬 제외)
        </SectionHeading>
        <ElevatedCard className="overflow-hidden p-0">
          {remoteRecent.length === 0 ? (
            <p className="px-4 py-10 text-center font-display text-[13px] text-fog sm:px-6 sm:py-12 sm:text-body-sm">
              방문 기록이 없습니다.
            </p>
          ) : (
            <AdminTable
              headers={["시각", "방문자", "접속 주소", "페이지", "유입", "로컬"]}
              mobilePrimaryIndex={1}
              rows={remoteRecent.map((v) => [
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
