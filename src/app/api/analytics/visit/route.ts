import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  recordSiteVisit,
  shouldTrackVisitPath,
  VISITOR_COOKIE,
  VISITOR_COOKIE_MAX_AGE,
} from "@/lib/site-visits";

function isLocalHost(host: string | null): boolean {
  if (!host) return false;
  return (
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.endsWith(".local")
  );
}

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return null;
}

export async function POST(request: NextRequest) {
  let body: { path?: string; referrer?: string };
  try {
    body = (await request.json()) as { path?: string; referrer?: string };
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const path = body.path?.trim() ?? "";
  if (!shouldTrackVisitPath(path)) {
    return new NextResponse(null, { status: 204 });
  }

  let visitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  const needsCookie = !visitorId;
  if (!visitorId) {
    visitorId = randomUUID();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const host = request.headers.get("host");
  const clientIp = getClientIp(request);

  await Promise.all([
    recordSiteVisit({
      visitorId,
      userId: user?.id ?? null,
      path,
      referrer: body.referrer?.trim() || request.headers.get("referer"),
      isLocal: isLocalHost(host),
      clientHost: host,
      clientIp,
    }),
    // 페이지 방문 요청에 합쳐 별도 브라우저 왕복 없이 하루 1회만 기록합니다.
    user ? supabase.rpc("record_daily_login") : Promise.resolve(),
  ]);

  const response = new NextResponse(null, { status: 204 });
  if (needsCookie) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: VISITOR_COOKIE_MAX_AGE,
      path: "/",
    });
  }

  return response;
}
