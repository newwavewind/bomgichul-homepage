import { getUser } from "@/lib/auth";
import { HeaderNav } from "@/components/layout/HeaderNav";

export async function Header() {
  const user = await getUser();

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
    />
  );
}
