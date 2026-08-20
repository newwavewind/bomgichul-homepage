import { createHmac, randomUUID } from "crypto";
import { checkBotId } from "botid/server";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  recordSiteVisit,
  shouldTrackVisitPath,
  toKstDateKey,
  updateSiteVisitEngagement,
  type VisitClass,
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

function detectClient(userAgent: string | null): {
  browserName: string;
  deviceType: string;
} {
  const ua = userAgent ?? "";
  const deviceType = /tablet|ipad/i.test(ua)
    ? "태블릿"
    : /mobile|iphone|android/i.test(ua)
      ? "모바일"
      : "데스크톱";
  const browserName = /edg\//i.test(ua)
    ? "Edge"
    : /opr\//i.test(ua)
      ? "Opera"
      : /chrome|crios/i.test(ua)
        ? "Chrome"
        : /firefox|fxios/i.test(ua)
          ? "Firefox"
          : /safari/i.test(ua)
            ? "Safari"
            : /bot|crawler|spider|yeti/i.test(ua)
              ? "Crawler"
              : "기타";
  return { browserName, deviceType };
}

function dailyIpHash(ip: string | null): string | null {
  if (!ip) return null;
  const secret =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "bomgichul-visit-hash";
  return createHmac("sha256", `${secret}:${toKstDateKey()}`)
    .update(ip)
    .digest("hex");
}

async function classifyBot(): Promise<{
  botClass: VisitClass;
  confidence: number;
  reasons: string[];
  verifiedBotName: string | null;
  verifiedBotCategory: string | null;
}> {
  try {
    const result = await checkBotId();
    const verifiedBotName = "verifiedBotName" in result ? result.verifiedBotName ?? null : null;
    const verifiedBotCategory = "verifiedBotCategory" in result ? result.verifiedBotCategory ?? null : null;
    if (result.isVerifiedBot) {
      return {
        botClass: "verified_bot",
        confidence: 100,
        reasons: [verifiedBotName ? `${verifiedBotName} 검증 봇` : "Vercel 검증 봇"],
        verifiedBotName,
        verifiedBotCategory,
      };
    }
    if (result.isBot) {
      return {
        botClass: "suspected_bot",
        confidence: 95,
        reasons: ["BotID 자동화 판정"],
        verifiedBotName: null,
        verifiedBotCategory: null,
      };
    }
    if (result.isHuman) {
      return {
        botClass: "likely_human",
        confidence: 95,
        reasons: ["BotID 사람 판정"],
        verifiedBotName: null,
        verifiedBotCategory: null,
      };
    }
  } catch {
    // BotID 장애 시에도 방문 기록 자체는 유지합니다.
  }
  return {
    botClass: "unknown",
    confidence: 0,
    reasons: ["BotID 판정 신호 없음"],
    verifiedBotName: null,
    verifiedBotCategory: null,
  };
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
  let body: { path?: string; referrer?: string | null; sessionId?: string };
  try {
    body = (await request.json()) as {
      path?: string;
      referrer?: string | null;
      sessionId?: string;
    };
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
  const userAgent = request.headers.get("user-agent");
  const { browserName, deviceType } = detectClient(userAgent);
  const bot = await classifyBot();

  const [visitId] = await Promise.all([
    recordSiteVisit({
      visitorId,
      userId: user?.id ?? null,
      path,
      // analytics POST의 Referer는 현재 페이지이므로 외부 유입 대체값으로 쓰지 않습니다.
      referrer: typeof body.referrer === "string" ? body.referrer.trim() || null : null,
      isLocal: isLocalHost(host),
      clientHost: host,
      clientIp,
      sessionId: body.sessionId?.trim() || null,
      userAgent,
      browserName,
      deviceType,
      acceptLanguage: request.headers.get("accept-language"),
      clientHints: request.headers.get("sec-ch-ua"),
      fetchSite: request.headers.get("sec-fetch-site"),
      countryCode: request.headers.get("x-vercel-ip-country"),
      ipHash: dailyIpHash(clientIp),
      botClass: bot.botClass,
      botConfidence: bot.confidence,
      classificationReasons: bot.reasons,
      verifiedBotName: bot.verifiedBotName,
      verifiedBotCategory: bot.verifiedBotCategory,
    }),
    // 페이지 방문 요청에 합쳐 별도 브라우저 왕복 없이 하루 1회만 기록합니다.
    user ? supabase.rpc("record_daily_login") : Promise.resolve(),
  ]);

  const response = NextResponse.json({ visitId });
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

export async function PATCH(request: NextRequest) {
  const visitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  if (!visitorId) return new NextResponse(null, { status: 204 });

  let body: { visitId?: string; engagementMs?: number; interactionCount?: number };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const visitId = body.visitId?.trim() ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(visitId)) {
    return NextResponse.json({ error: "invalid visit" }, { status: 400 });
  }

  await updateSiteVisitEngagement({
    visitId,
    visitorId,
    engagementMs: Number.isFinite(body.engagementMs) ? Math.round(body.engagementMs ?? 0) : 0,
    interactionCount: Number.isFinite(body.interactionCount)
      ? Math.round(body.interactionCount ?? 0)
      : 0,
  });
  return new NextResponse(null, { status: 204 });
}
