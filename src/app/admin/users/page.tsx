import { getAdminUsers } from "@/lib/admin";
import { AdminTable, formatDateTime } from "@/components/admin/AdminNav";
import { ElevatedCard } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/Typography";

export default async function AdminUsersPage() {
  const users = await getAdminUsers(200);

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading as="h2" className="mb-2 text-subheading">
          회원·로그인 정보
        </SectionHeading>
        <p className="font-display text-body-sm text-smoke">
          Google 로그인 이메일과 사이트 공개 아이디(닉네임)를 함께 볼 수 있습니다. 관리자에게만
          표시됩니다.
        </p>
      </div>

      <ElevatedCard className="overflow-hidden">
        {users.length === 0 ? (
          <p className="px-6 py-12 text-center font-display text-body-sm text-fog">회원 없음</p>
        ) : (
          <AdminTable
            headers={["공개 아이디", "로그인 이메일", "아이디 설정", "가입일", "최근 로그인", "권한"]}
            rows={users.map((u) => [
              u.nickname,
              u.email ?? "—",
              u.usernameSet ? "완료" : "미설정",
              formatDateTime(u.createdAt),
              formatDateTime(u.lastSignInAt),
              u.isAdmin ? "관리자" : "일반",
            ])}
          />
        )}
      </ElevatedCard>

      <p className="font-display text-[12px] text-fog">
        최대 200명까지 표시됩니다. 추가 관리자 지정은 Supabase SQL Editor에서{" "}
        <code className="rounded bg-surface px-1">admin_users</code> 테이블에 user_id를
        insert하세요.
      </p>
    </div>
  );
}
