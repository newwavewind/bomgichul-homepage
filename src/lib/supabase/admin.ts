import { createClient } from "@supabase/supabase-js";

const BOT_EMAIL = "app-bot@bomgichul.internal";
const BOT_NICKNAME = "봄기출앱";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY가 필요합니다. .env.local과 Vercel 환경변수를 확인하세요."
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** 앱 제보 전용 작성자 프로필 (없으면 생성) */
export async function ensureAppReportAuthorId(): Promise<string> {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("nickname", BOT_NICKNAME)
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email: BOT_EMAIL,
      email_confirm: true,
      user_metadata: { nickname: BOT_NICKNAME },
    });

  if (createError || !created.user) {
    // 이미 있으면 이메일로 조회
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 });
    const found = list?.users?.find((u) => u.email === BOT_EMAIL);
    if (!found) {
      throw new Error(
        createError?.message || "앱 제보 계정을 만들 수 없습니다."
      );
    }
    await admin
      .from("profiles")
      .upsert({
        id: found.id,
        nickname: BOT_NICKNAME,
        avatar_url: null,
        username_set: true,
      });
    return found.id;
  }

  await admin.from("profiles").upsert({
    id: created.user.id,
    nickname: BOT_NICKNAME,
    avatar_url: null,
    username_set: true,
  });

  return created.user.id;
}
