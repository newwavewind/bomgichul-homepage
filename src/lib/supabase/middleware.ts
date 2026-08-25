import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env";
import { allowOpenAdminWithoutAuth } from "@/lib/dev-preview-auth";

const USERNAME_SKIP_PREFIXES = [
  "/onboarding",
  "/auth",
  "/login",
  "/_next",
  "/brand",
  "/favicon",
  "/icon",
  "/apple-icon",
  "/robots",
  "/sitemap",
];

function shouldSkipUsernameGate(pathname: string) {
  return USERNAME_SKIP_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function hasSupabaseAuthCookie(cookies: { name: string }[]) {
  return cookies.some(
    (c) =>
      c.name.includes("auth-token") ||
      (c.name.startsWith("sb-") && (c.name.includes("token") || c.name.includes("auth")))
  );
}

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  const pathname = request.nextUrl.pathname;

  // 로컬/Cursor 미리보기: 관리자 화면은 로그인 없이 바로 연다
  if (pathname.startsWith("/admin") && allowOpenAdminWithoutAuth(request)) {
    return NextResponse.next({ request });
  }

  const allCookies = request.cookies.getAll();
  const hasAuth = hasSupabaseAuthCookie(allCookies);

  // 인증 쿠키가 없으면 외부 네트워크 통신 없이 즉시 통과
  if (!hasAuth) {
    if (pathname.startsWith("/admin")) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next({ request });
  }

  const { url, key } = getSupabaseEnv();
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && !shouldSkipUsernameGate(pathname)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username_set")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.username_set) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/onboarding";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (user && pathname === "/onboarding") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username_set")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.username_set) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!adminRow) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}
