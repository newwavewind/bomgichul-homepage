import Link from "next/link";
import { getAdminOverview, getAdminRecentSignups } from "@/lib/admin";
import { getAdminVisitStats } from "@/lib/site-visits";
import { AdminStatCard } from "@/components/admin/AdminUi";
import { ElevatedCard } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/Typography";

export default async function AdminDashboardPage() {
  const [overview, signups, visitStats] = await Promise.all([
    getAdminOverview(),
    getAdminRecentSignups(8),
    getAdminVisitStats(),
  ]);

  return (
    <div className="space-y-10">
      <section>
        <SectionHeading as="h2" className="mb-4 text-subheading">
          한눈에 보기
        </SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminStatCard label="전체 회원" value={overview.totalUsers} hint={`아이디 설정 완료 ${overview.usersWithUsername}명`} />
          <AdminStatCard label="게시글" value={overview.totalPosts} hint={`최근 7일 ${overview.postsLast7Days}건`} />
          <AdminStatCard
            label="오류·피드백"
            value={overview.openReports}
            hint="앱 제보·피드백 글"
          />
          <AdminStatCard label="공개 메모" value={overview.publicMemos} hint="기출 문항 메모" />
          <AdminStatCard label="DM 메시지" value={overview.dmMessages} hint="누적 1:1 채팅" />
          <AdminStatCard label="모의고사 기록" value={overview.mockExamSessions} />
          <AdminStatCard label="일일 퀴즈 참여" value={overview.dailyQuizUsers} hint="누적 기록 수" />
          <AdminStatCard label="프리미엄 이용" value={overview.premiumUsers} hint="활성 entitlements" />
          <Link href="/admin/visits" className="block transition-opacity hover:opacity-90">
            <AdminStatCard
              label="오늘 방문"
              value={visitStats.uniqueVisitorsToday}
              hint={`페이지뷰 ${visitStats.visitsToday} · 비로그인 ${visitStats.anonymousVisitorsToday}`}
            />
          </Link>
        </div>
      </section>

      <section>
        <SectionHeading as="h2" className="mb-4 text-subheading">
          최근 가입
        </SectionHeading>
        <ElevatedCard className="overflow-hidden">
          {signups.length === 0 ? (
            <p className="px-6 py-10 text-center font-display text-body-sm text-fog">
              가입 회원이 없습니다.
            </p>
          ) : (
            <ul className="divide-y divide-mist/60">
              {signups.map((s, i) => (
                <li
                  key={`${s.email}-${i}`}
                  className="flex flex-wrap items-center justify-between gap-2 px-6 py-4"
                >
                  <div>
                    <p className="font-display text-body-sm font-medium text-ink">
                      {s.nickname}
                      {!s.usernameSet && (
                        <span className="ml-2 text-[12px] text-fog">(아이디 미설정)</span>
                      )}
                    </p>
                    <p className="mt-0.5 font-display text-[12px] text-smoke">{s.email ?? "이메일 없음"}</p>
                  </div>
                  <time className="font-display text-[12px] text-fog">
                    {new Date(s.createdAt).toLocaleString("ko-KR")}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </ElevatedCard>
      </section>

      <section className="rounded-[var(--radius-cards)] border border-dashed border-mist bg-surface px-5 py-4">
        <p className="font-display text-body-sm text-smoke">
          <strong className="text-ink">운영 팁:</strong> 오류·피드백은{" "}
          <Link href="/admin/reports" className="text-electric-blue hover:underline">
            제보 목록
          </Link>
          에서 확인하고, 사이트 방문(로그인·비로그인·로컬 포함)은{" "}
          <Link href="/admin/visits" className="text-electric-blue hover:underline">
            방문
          </Link>
          탭에서, 회원 로그인 이메일·공개 아이디는{" "}
          <Link href="/admin/users" className="text-electric-blue hover:underline">
            회원·로그인
          </Link>
          탭에서 조회할 수 있습니다.
        </p>
      </section>
    </div>
  );
}
