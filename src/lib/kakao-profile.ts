type KakaoUserResponse = {
  properties?: { nickname?: unknown };
  kakao_account?: {
    profile?: { nickname?: unknown };
  };
};

export async function getKakaoProfileNickname(
  providerToken: string,
): Promise<string | null> {
  const propertyKeys = JSON.stringify([
    "properties.nickname",
    "kakao_account.profile.nickname",
  ]);
  const response = await fetch(
    `https://kapi.kakao.com/v2/user/me?property_keys=${encodeURIComponent(propertyKeys)}`,
    {
      headers: { Authorization: `Bearer ${providerToken}` },
      cache: "no-store",
    },
  );

  if (!response.ok) return null;

  const data = (await response.json()) as KakaoUserResponse;
  const raw =
    data.kakao_account?.profile?.nickname ?? data.properties?.nickname ?? null;
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}
