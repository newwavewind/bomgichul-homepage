import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { allowPreviewLogin } from "@/lib/dev-preview-auth";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

async function findAuthUserByEmail(
  admin: ReturnType<typeof createAdminClient>,
  email: string
) {
  const normalized = email.toLowerCase();
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    const users = data?.users ?? [];
    const found = users.find((user) => user.email?.toLowerCase() === normalized);
    if (found) return found;
    if (users.length < 200) return null;
  }
  return null;
}

async function readLoginPayload(request: NextRequest): Promise<{
  email: string;
  next: string;
  asForm: boolean;
}> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { email?: string; next?: string };
    return {
      email: (body.email ?? "").trim().toLowerCase(),
      next: safeNextPath(body.next ?? null),
      asForm: false,
    };
  }

  const form = await request.formData();
  return {
    email: String(form.get("email") ?? "")
      .trim()
      .toLowerCase(),
    next: safeNextPath(String(form.get("next") ?? "") || null),
    asForm: true,
  };
}

function fail(
  asForm: boolean,
  request: NextRequest,
  message: string,
  status: number
) {
  if (!asForm) {
    return NextResponse.json({ error: message }, { status });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("error", "auth");
  url.searchParams.set("message", message);
  return NextResponse.redirect(url);
}

/**
 * Cursor 미리보기에서는 Google OAuth 리다이렉트가 막힌다.
 * 로컬 호스트에서만, 이미 가입된 이메일로 매직링크 토큰을 발급·교환해 세션 쿠키를 심는다.
 * JSON(fetch)과 form POST(JS 없이도 동작) 둘 다 받는다.
 */
export async function POST(request: NextRequest) {
  if (!allowPreviewLogin(request)) {
    return fail(
      true,
      request,
      "미리보기 로그인은 로컬(localhost)에서만 사용할 수 있어요.",
      403
    );
  }

  let payload: { email: string; next: string; asForm: boolean };
  try {
    payload = await readLoginPayload(request);
  } catch {
    return fail(false, request, "요청 본문이 올바르지 않아요.", 400);
  }

  const { email, next, asForm } = payload;

  if (!email || !email.includes("@")) {
    return fail(asForm, request, "가입에 쓰는 Google 이메일을 입력해 주세요.", 400);
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return fail(
      asForm,
      request,
      "SUPABASE_SERVICE_ROLE_KEY가 .env.local에 없어요. 키를 넣은 뒤 dev 서버를 재시작하세요.",
      500
    );
  }

  const existing = await findAuthUserByEmail(admin, email);
  if (!existing) {
    return fail(
      asForm,
      request,
      "해당 이메일 계정을 찾지 못했어요. 사이트에 한 번이라도 Google 로그인한 이메일을 쓰세요.",
      400
    );
  }

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkError || !linkData?.properties?.hashed_token) {
    return fail(
      asForm,
      request,
      linkError?.message || "로그인 토큰을 만들지 못했어요.",
      400
    );
  }

  const { url, key } = getSupabaseEnv();
  const response = asForm
    ? NextResponse.redirect(new URL(next, request.nextUrl.origin))
    : NextResponse.json({ ok: true, next });

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

  const { error: verifyError } = await supabase.auth.verifyOtp({
    type: "email",
    token_hash: linkData.properties.hashed_token,
  });

  if (verifyError) {
    return fail(
      asForm,
      request,
      verifyError.message || "세션을 만들지 못했어요.",
      400
    );
  }

  response.cookies.set("auth_next", "", { path: "/", maxAge: 0 });
  return response;
}
