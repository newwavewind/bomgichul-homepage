import Link from "next/link";
import { getAdminPosts } from "@/lib/admin";
import { AdminTable, formatDateTime } from "@/components/admin/AdminUi";
import { ElevatedCard } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/Typography";

export default async function AdminReportsPage() {
  const posts = await getAdminPosts({ category: "reports", limit: 100 });

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading as="h2" className="mb-2 text-subheading">
          오류 신고 · 피드백
        </SectionHeading>
        <p className="font-display text-body-sm text-smoke">
          앱에서 자동 전송된 제보와 피드백 글입니다. 클릭하면 본문을 확인할 수 있습니다.
        </p>
      </div>

      <ElevatedCard className="overflow-hidden">
        {posts.length === 0 ? (
          <p className="px-6 py-12 text-center font-display text-body-sm text-fog">
            제보 글이 없습니다.
          </p>
        ) : (
          <AdminTable
            headers={["유형", "제목", "작성자", "조회", "등록일", ""]}
            rows={posts.map((p) => [
              p.categoryLabel,
              p.title,
              p.authorNickname,
              String(p.viewCount),
              formatDateTime(p.createdAt),
              <Link
                key={p.id}
                href={`/community/${p.id}`}
                className="font-medium text-electric-blue hover:underline"
              >
                보기
              </Link>,
            ])}
          />
        )}
      </ElevatedCard>
    </div>
  );
}
