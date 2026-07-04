import { createBrowserClient } from "@supabase/ssr";

/**
 * 브라우저용 Supabase 클라이언트.
 * NEXT_PUBLIC_* 는 이 파일에서 직접 참조해 Next.js가 번들에 인라인하도록 합니다.
 */
export function createClient() {
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

  return createBrowserClient(url, key);
}
