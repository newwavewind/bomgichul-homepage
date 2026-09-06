import Link from "next/link";
import { getAdminPosts } from "@/lib/admin";
import { AdminTable, formatDateTime } from "@/components/admin/AdminUi";
import { AdminPostDeleteButton } from "@/components/admin/AdminPostDeleteButton";
import { Pagination } from "@/components/board/Pagination";
import { ElevatedCard } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/Typography";
import { communityBaseHref, isValidCommunityScope } from "@/lib/exam-track/community";

const REPORTS_PER_PAGE = 30;

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const { rows: posts, total, totalPages, pageSize } = await getAdminPosts({
    category: "reports",
    page,
    pageSize: REPORTS_PER_PAGE,
  });

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading as="h2" className="mb-2 text-subheading">
          오류 신고 · 피드백
        </SectionHeading>
        <p className="font-display text-body-sm text-smoke">
          앱에서 자동 전송된 제보와 피드백 글입니다. 클릭하면 본문을 확인할 수 있습니다.
          {total > 0 ? ` · 총 ${total}건` : null}
        </p>
      </div>

      <ElevatedCard className="overflow-hidden">
        {posts.length === 0 ? (
          <p className="px-6 py-12 text-center font-display text-body-sm text-fog">
            제보 글이 없습니다.
          </p>
        ) : (
          <>
            <AdminTable
              headers={["트랙", "유형", "제목", "작성자", "조회", "등록일", ""]}
              rows={posts.map((p) => {
                const scope = isValidCommunityScope(p.communityScope)
                  ? p.communityScope
                  : "real_estate";
                return [
                  scope,
                  p.categoryLabel,
                  p.title,
                  p.authorNickname,
                  String(p.viewCount),
                  formatDateTime(p.createdAt),
                  <span key={`actions-${p.id}`} className="inline-flex items-center gap-3">
                    <Link
                      href={`${communityBaseHref(scope)}/${p.id}`}
                      className="font-medium text-electric-blue hover:underline"
                    >
                      보기
                    </Link>
                    <AdminPostDeleteButton postId={p.id} />
                  </span>,
                ];
              })}
            />
            <Pagination
              variant="embedded"
              currentPage={page}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
              baseHref="/admin/reports"
            />
          </>
        )}
      </ElevatedCard>
    </div>
  );
}
