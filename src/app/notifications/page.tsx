import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { getNotificationsForUser, markAllNotificationsRead } from "@/lib/notifications";
import { formatKstRelative } from "@/lib/datetime";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ElevatedCard } from "@/components/ui/Card";

function timeAgo(dateString: string): string {
  return formatKstRelative(dateString);
}

export default async function NotificationsPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/notifications");

  const notifications = await getNotificationsForUser(user.id);
  await markAllNotificationsRead(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <EyebrowLabel className="mb-2">내 알림</EyebrowLabel>
      <SectionHeading as="h1" className="mb-8 text-heading-sm">
        알림
      </SectionHeading>

      <ElevatedCard className="overflow-hidden">
        {notifications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-display text-body text-smoke">아직 알림이 없어요</p>
          </div>
        ) : (
          notifications.map((n) => (
            <Link
              key={n.id}
              href={`/community/${n.post_id}`}
              className="flex items-start gap-3 border-b border-mist/60 px-5 py-4 transition-colors last:border-b-0 hover:bg-snow"
            >
              {!n.read_at && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#6366f1]" />
              )}
              <div>
                <p className="font-display text-body-sm text-ink">
                  <span className="font-semibold">{n.actor?.nickname ?? "익명"}</span>
                  님이{" "}
                  <span className="font-medium">
                    &lsquo;{n.post?.title ?? "게시글"}&rsquo;
                  </span>{" "}
                  글에 댓글을 남겼어요
                </p>
                <p className="mt-1 font-display text-[12px] text-fog">
                  {timeAgo(n.created_at)}
                </p>
              </div>
            </Link>
          ))
        )}
      </ElevatedCard>

      <div className="mt-6 text-center">
        <Link
          href="/community"
          className="font-display text-body-sm text-fog hover:text-ink"
        >
          커뮤니티로 돌아가기 →
        </Link>
      </div>
    </div>
  );
}
