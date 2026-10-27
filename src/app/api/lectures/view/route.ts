import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import catalog from "@/components/lectures/catalog.json";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  VISITOR_COOKIE,
  VISITOR_COOKIE_MAX_AGE,
} from "@/lib/site-visits";

const LECTURE_IDS = new Set(
  catalog.flatMap((group) => group.lectures.map((lecture) => lecture.id))
);

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: VISITOR_COOKIE_MAX_AGE,
    path: "/",
  };
}

function parseIds(raw: string | null): string[] {
  if (!raw) return [];
  return [...new Set(raw.split(",").map((id) => id.trim()).filter((id) => LECTURE_IDS.has(id)))];
}

export async function GET(request: NextRequest) {
  const ids = parseIds(request.nextUrl.searchParams.get("ids"));
  if (!ids.length || !isSupabaseConfigured()) {
    return NextResponse.json({ counts: {} });
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("lecture_stats")
    .select("lecture_id, view_count")
    .in("lecture_id", ids);

  if (error) {
    console.error("Failed to fetch lecture views:", error.message);
    return NextResponse.json({ counts: {} });
  }

  const counts: Record<string, number> = {};
  for (const id of ids) counts[id] = 0;
  for (const row of data ?? []) {
    counts[row.lecture_id] = row.view_count ?? 0;
  }
  return NextResponse.json({ counts });
}

export async function POST(request: NextRequest) {
  let lectureId = "";
  try {
    const body = (await request.json()) as { lectureId?: string };
    lectureId = body.lectureId?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  if (!LECTURE_IDS.has(lectureId)) {
    return NextResponse.json({ error: "unknown lecture" }, { status: 400 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ viewCount: 0 });
  }

  let visitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  const needsCookie = !visitorId;
  if (!visitorId) visitorId = randomUUID();

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("increment_lecture_view", {
    p_lecture_id: lectureId,
    p_viewer_key: visitorId,
  });

  if (error) {
    console.error("Failed to increment lecture view:", error.message);
    const fallback = await admin
      .from("lecture_stats")
      .select("view_count")
      .eq("lecture_id", lectureId)
      .maybeSingle();
    const response = NextResponse.json({
      viewCount: fallback.data?.view_count ?? 0,
    });
    if (needsCookie) response.cookies.set(VISITOR_COOKIE, visitorId, cookieOptions());
    return response;
  }

  const response = NextResponse.json({
    viewCount: typeof data === "number" ? data : 0,
  });
  if (needsCookie) {
    response.cookies.set(VISITOR_COOKIE, visitorId, cookieOptions());
  }
  return response;
}
