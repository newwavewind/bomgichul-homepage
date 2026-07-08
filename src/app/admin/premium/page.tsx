import { getAdminPremiumEntitlements } from "@/lib/admin";
import { AdminTable, formatDateTime } from "@/components/admin/AdminUi";
import { ElevatedCard } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/Typography";

export default async function AdminPremiumPage() {
  const rows = await getAdminPremiumEntitlements(100);

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading as="h2" className="mb-2 text-subheading">
          프리미엄 이용 현황
        </SectionHeading>
        <p className="font-display text-body-sm text-smoke">
          ox-quiz-app과 공유하는 user_entitlements 테이블 기준입니다. 코드 등록·인앱 결제
          잠금 해제 내역을 확인할 수 있습니다.
        </p>
      </div>

      <ElevatedCard className="overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-6 py-12 text-center font-display text-body-sm text-fog">
            프리미엄 이용 기록이 없습니다.
          </p>
        ) : (
          <AdminTable
            headers={["아이디", "이메일", "상품", "상태", "만료일"]}
            rows={rows.map((r) => [
              r.nickname,
              r.email ?? "—",
              r.productType,
              r.status,
              r.expiresAt ? formatDateTime(r.expiresAt) : "무기한",
            ])}
          />
        )}
      </ElevatedCard>
    </div>
  );
}
