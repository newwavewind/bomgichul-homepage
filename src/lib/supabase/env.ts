/**
 * NEXT_PUBLIC_* 는 빌드 시 번들에 인라인됩니다.
 * 반드시 process.env.NEXT_PUBLIC_... 형태로 직접 참조해야 합니다.
 */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseEnv() {
  // 동적 키 접근(process.env[name])은 클라이언트에서 인라인되지 않습니다.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    const missing = [
      !url && "NEXT_PUBLIC_SUPABASE_URL",
      !key && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ]
      .filter(Boolean)
      .join(", ");

    throw new Error(
      `Supabase 환경변수가 없습니다 (${missing}). .env.local을 확인한 뒤 dev 서버를 재시작하세요.`
    );
  }

  return { url, key };
}
