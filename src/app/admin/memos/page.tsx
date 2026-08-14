import Link from "next/link";
import { getAdminPublicMemos } from "@/lib/admin";
import { AdminTable, formatDateTime } from "@/components/admin/AdminUi";
import { ElevatedCard } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/Typography";
import { communityScopeLabel, isValidCommunityScope, trackHubHref } from "@/lib/exam-track/community";

function memoDestination(subjectKey: string, year: number, questionNo: number) {
  const [possibleScope, subjectId, ...sourceParts] = subjectKey.split(":");

  if (isValidCommunityScope(possibleScope) && possibleScope !== "real_estate") {
    const source = sourceParts.join(":");
    if (!subjectId || !source) return null;
    return `${trackHubHref(possibleScope)}/exam/${encodeURIComponent(subjectId)}/${year}/${encodeURIComponent(source)}/${questionNo}`;
  }

  if (!subjectKey) return null;
  return `/exam/${encodeURIComponent(subjectKey)}/${year}/${questionNo}`;
}

function memoTrackLabel(subjectKey: string) {
  const [possibleScope] = subjectKey.split(":");
  return isValidCommunityScope(possibleScope) && possibleScope !== "real_estate"
    ? communityScopeLabel(possibleScope)
    : "공인중개사";
}

export default async function AdminMemosPage() {
  const memos = await getAdminPublicMemos(100);

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading as="h2" className="mb-2 text-subheading">
          최근 공개 메모
        </SectionHeading>
        <p className="font-display text-body-sm text-smoke">
          모든 시험의 기출 문항에 공개된 메모입니다. 원문 보기를 누르면 해당 기출 문항으로 이동합니다.
        </p>
      </div>

      <ElevatedCard className="overflow-hidden">
        {memos.length === 0 ? (
          <p className="px-6 py-12 text-center font-display text-body-sm text-fog">공개 메모 없음</p>
        ) : (
          <AdminTable
            headers={["시험", "문항", "메모", "작성자", "등록일", ""]}
            mobilePrimaryIndex={2}
            rows={memos.map((memo) => {
              const href = memoDestination(memo.subject, memo.year, memo.questionNo);
              return [
                memoTrackLabel(memo.subject),
                `${memo.year}년 ${memo.questionNo}번`,
                <span key={memo.id} className="line-clamp-2 max-w-md whitespace-pre-wrap">
                  {memo.content}
                </span>,
                memo.authorNickname,
                formatDateTime(memo.createdAt),
                href ? (
                  <Link key={`view-${memo.id}`} href={href} className="font-medium text-electric-blue hover:underline">
                    원문 보기
                  </Link>
                ) : (
                  "경로 확인 필요"
                ),
              ];
            })}
          />
        )}
      </ElevatedCard>
    </div>
  );
}
