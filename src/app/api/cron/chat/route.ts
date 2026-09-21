import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 60;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.replace(/^Bearer\s+/i, "").trim();
  return Boolean(bearer && bearer === secret);
}

/** KST weekday 0=일 … 6=토 */
function kstParts(now = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(now).map((p) => [p.type, p.value]),
  );
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    weekday: weekdayMap[parts.weekday ?? ""] ?? now.getUTCDay(),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const kst = kstParts();

  const { data: publishedCount, error: publishError } = await admin.rpc(
    "publish_due_scheduled_dm_messages",
  );
  if (publishError) {
    return NextResponse.json(
      { error: publishError.message, step: "publish_scheduled" },
      { status: 500 },
    );
  }

  const { data: weeklyEvents, error: weeklyError } = await admin
    .from("chat_study_events")
    .select("id,conversation_id,title,body,weekday,time_of_day,recurrence")
    .eq("kind", "weekly")
    .eq("recurrence", "weekly");

  if (weeklyError) {
    return NextResponse.json(
      { error: weeklyError.message, step: "load_weekly" },
      { status: 500 },
    );
  }

  let remindersSent = 0;
  const nowMinutes = kst.hour * 60 + kst.minute;

  for (const event of weeklyEvents ?? []) {
    if (event.weekday != null && Number(event.weekday) !== kst.weekday) continue;

    if (event.time_of_day) {
      const [hh, mm] = String(event.time_of_day).split(":").map(Number);
      const target = (hh || 0) * 60 + (mm || 0);
      // 크론이 한 시간에 한 번이면 해당 시각 이후 60분 창에서만 발송
      if (nowMinutes < target || nowMinutes >= target + 60) continue;
    }

    const marker = `weekly:${event.id}:${kst.date}`;
    const { data: existing } = await admin
      .from("dm_messages")
      .select("id")
      .eq("conversation_id", event.conversation_id)
      .eq("message_kind", "system")
      .contains("payload", { reminderKey: marker })
      .limit(1);

    if (existing?.length) continue;

    const { data: creator } = await admin
      .from("chat_study_events")
      .select("creator_id")
      .eq("id", event.id)
      .maybeSingle();

    const senderId = creator?.creator_id;
    if (!senderId) continue;

    const { error: insertError } = await admin.from("dm_messages").insert({
      conversation_id: event.conversation_id,
      sender_id: senderId,
      content: `📅 주간 스터디 리마인더: ${event.title}`,
      message_kind: "system",
      payload: {
        reminderKey: marker,
        eventId: event.id,
        kind: "weekly",
      },
      published_at: new Date().toISOString(),
      mention_user_ids: [],
    });

    if (!insertError) remindersSent += 1;
  }

  return NextResponse.json({
    ok: true,
    published: publishedCount ?? 0,
    remindersSent,
    kstDate: kst.date,
    weekday: kst.weekday,
  });
}
