import { getUser } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { HeaderNav } from "@/components/layout/HeaderNav";

export async function Header() {
  const user = await getUser();
  const unreadCount = user ? await getUnreadNotificationCount(user.id) : 0;

  return (
    <HeaderNav
      user={
        user
          ? {
              id: user.id,
              nickname: user.nickname,
              usernameSet: user.usernameSet,
            }
          : null
      }
      unreadCount={unreadCount}
    />
  );
}
