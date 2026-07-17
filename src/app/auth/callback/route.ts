import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/community";
  }
  return next;
}

function readNextFromRequest(request: NextRequest) {
  const fromQuery = request.nextUrl.searchParams.get("next");
  if (fromQuery) return safeNextPath(fromQuery);

  const fromCookie = request.cookies.get("auth_next")?.value;
  if (fromCookie) {
    try {
      return safeNextPath(decodeURIComponent(fromCookie));
    } catch {
      // fall through
    }
  }

  return "/community";
}

export async function GET(request: NextRequest) {
  const { origin } = request.nextUrl;
  const code = request.nextUrl.searchParams.get("code");
  const oauthError = request.nextUrl.searchParams.get("error");
  const oauthErrorDescription =
    request.nextUrl.searchParams.get("error_description");
  const next = readNextFromRequest(request);

  if (oauthError) {
    const message = oauthErrorDescription || oauthError;
    return NextResponse.redirect(
      `${origin}/login?error=auth&message=${encodeURIComponent(message)}`
    );
  }

  if (code) {
    const { url, key } = getSupabaseEnv();

    // 세션 쿠키를 redirect 응답에 직접 붙여야 로그인 상태가 유지됩니다.
    // cookies()만 쓰면 Route Handler redirect에서 쿠키가 누락될 수 있습니다.
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 로그인 성공 당일의 활동 점수를 즉시 반영합니다.
      await supabase.rpc("record_daily_login");
      response.cookies.set("auth_next", "", { path: "/", maxAge: 0 });
      // 아이디 미설정 시 middleware가 /onboarding으로 보냅니다.
      return response;
    }

    return NextResponse.redirect(
      `${origin}/login?error=auth&message=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
