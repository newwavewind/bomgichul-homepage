import { getUser } from "@/lib/auth";
import { getUserActivityScores } from "@/lib/activity";
import { HeaderNav } from "@/components/layout/HeaderNav";

export async function Header() {
  const user = await getUser();
  const activity = user
    ? (await getUserActivityScores([user.id]))[user.id]
    : null;

  return (
    <HeaderNav
      user={
        user
          ? {
              id: user.id,
              nickname: user.nickname,
              usernameSet: user.usernameSet,
              isAdmin: user.isAdmin,
              oceanRank: activity?.rank ?? null,
            }
          : null
      }
    />
  );
}
