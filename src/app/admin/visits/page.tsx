import {
  getAdminRecentVisits,
  getAdminVisitStats,
  getAdminVisitorSummaries,
  formatVisitPath,
  shortVisitorId,
} from "@/lib/site-visits";
import { AdminStatCard, AdminTable, formatDateTime } from "@/components/admin/AdminUi";
import { ElevatedCard } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/Typography";

function visitorLabel(nickname: string | null, visitorId: string): string {
  if (nickname) return nickname;
  return `익명 ${shortVisitorId(visitorId)}`;
}

export default async function AdminVisitsPage() {
  const [stats, recent, summaries] = await Promise.all([
    getAdminVisitStats(),
    getAdminRecentVisits(80),
    getAdminVisitorSummaries(40),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <SectionHeading as="h2" className="mb-2 text-subheading">
          방문 현황
        </SectionHeading>
        <p className="font-display text-body-sm text-smoke">
          로그인 여부와 관계없이 페이지를 연 모든 방문을 기록합니다. 로컬(
          <code className="rounded bg-surface px-1">localhost</code>) 접속도
          구분해서 표시합니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminStatCard
          label="오늘 페이지뷰"
          value={stats.visitsToday}
          hint="한국 시간 기준"
        />
        <AdminStatCard
          label="오늘 순 방문자"
          value={stats.uniqueVisitorsToday}
          hint="브라우저(쿠키) 기준"
        />
        <AdminStatCard
          label="오늘 비로그인 방문자"
          value={stats.anonymousVisitorsToday}
          hint="로그인 없이 온 순 방문자"
        />
        <AdminStatCard
          label="오늘 로그인 방문"
          value={stats.loggedInVisitsToday}
          hint="로그인 상태 페이지뷰"
        />
        <AdminStatCard
          label="최근 7일 페이지뷰"
          value={stats.visitsLast7Days}
        />
      </div>

      <section>
        <SectionHeading as="h3" className="mb-4 text-heading-sm">
          최근 24시간 방문자
        </SectionHeading>
        <ElevatedCard className="overflow-hidden">
          {summaries.length === 0 ? (
            <p className="px-6 py-12 text-center font-display text-body-sm text-fog">
              아직 기록된 방문이 없습니다. 사이트를 열어보면 여기에 나타납니다.
            </p>
          ) : (
            <AdminTable
              headers={["방문자", "방문 수", "마지막 페이지", "로컬", "마지막 시각"]}
              rows={summaries.map((v) => [
                visitorLabel(v.nickname, v.visitorId),
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
          최근 방문 기록
        </SectionHeading>
        <ElevatedCard className="overflow-hidden">
          {recent.length === 0 ? (
            <p className="px-6 py-12 text-center font-display text-body-sm text-fog">
              방문 기록이 없습니다.
            </p>
          ) : (
            <AdminTable
              headers={["시각", "방문자", "페이지", "유입", "로컬"]}
              rows={recent.map((v) => [
                formatDateTime(v.createdAt),
                visitorLabel(v.nickname, v.visitorId),
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
