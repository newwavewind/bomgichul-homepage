import Link from "next/link";
import { getAdminPosts } from "@/lib/admin";
import { AdminTable, formatDateTime } from "@/components/admin/AdminUi";
import { AdminPostDeleteButton } from "@/components/admin/AdminPostDeleteButton";
import { ElevatedCard } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/Typography";
import { communityBaseHref, isValidCommunityScope } from "@/lib/exam-track/community";

export default async function AdminCommunityPage() {
  const posts = await getAdminPosts({ limit: 80 });

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading as="h2" className="mb-2 text-subheading">
          최근 게시글
        </SectionHeading>
        <p className="font-display text-body-sm text-smoke">
          커뮤니티 전체 게시글 목록입니다. 스팸·욕설 등은 게시글에서 직접 확인 후 대응하세요.
        </p>
      </div>

      <ElevatedCard className="overflow-hidden">
        {posts.length === 0 ? (
          <p className="px-6 py-12 text-center font-display text-body-sm text-fog">게시글 없음</p>
        ) : (
          <AdminTable
            headers={["트랙", "카테고리", "제목", "작성자", "조회", "등록일", ""]}
            rows={posts.map((p) => {
              const scope = isValidCommunityScope(p.communityScope)
                ? p.communityScope
                : "real_estate";
              return [
                scope,
                p.categoryLabel,
                <span key={p.id} className="line-clamp-1 max-w-xs">
                  {p.title}
                </span>,
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
        )}
      </ElevatedCard>
    </div>
  );
}
