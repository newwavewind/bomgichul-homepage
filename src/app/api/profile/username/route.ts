import { NextResponse } from "next/server";
import { isSameOriginRequest } from "@/lib/account-deletion";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { normalizeUsername, validateUsername } from "@/lib/username";

export async function GET(request: Request) {
  const username = normalizeUsername(
    new URL(request.url).searchParams.get("username") ?? "",
  );
  const validationError = validateUsername(username);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  // The unique index uses lower(nickname). Escape the only allowed LIKE wildcard
  // so an underscore in an ID is matched literally during availability checks.
  const pattern = username.replaceAll("_", "\\_");
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id")
    .ilike("nickname", pattern)
    .neq("id", user.id)
    .limit(1);

  if (error) {
    console.error("Username availability check failed", {
      userId: user.id,
      error,
    });
    return NextResponse.json(
      { error: "중복 확인에 실패했습니다. 다시 시도해주세요." },
      { status: 500 },
    );
  }

  return NextResponse.json({ available: data.length === 0 });
}

export async function POST(request: Request) {
  const forwardedHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProto =
    request.headers.get("x-forwarded-proto") ??
    new URL(request.url).protocol.slice(0, -1);
  const effectiveUrl = forwardedHost
    ? `${forwardedProto}://${forwardedHost}${new URL(request.url).pathname}`
    : request.url;

  if (!isSameOriginRequest(effectiveUrl, request.headers.get("origin"))) {
    return NextResponse.json(
      { error: "허용되지 않은 요청입니다." },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const raw =
    typeof body === "object" && body !== null && "username" in body
      ? (body as { username?: unknown }).username
      : null;
  const username = normalizeUsername(typeof raw === "string" ? raw : "");
  const validationError = validateUsername(username);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .update({ nickname: username, username_set: true, avatar_url: null })
    .eq("id", user.id)
    .select("id, nickname, username_set")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "이미 사용 중인 아이디입니다." },
        { status: 409 },
      );
    }
    console.error("Username update failed", { userId: user.id, error });
    return NextResponse.json(
      { error: "아이디 저장에 실패했습니다. 다시 시도해주세요." },
      { status: 500 },
    );
  }

  if (!data.username_set || data.nickname !== username) {
    return NextResponse.json(
      { error: "아이디가 저장되지 않았습니다. 다시 시도해주세요." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
