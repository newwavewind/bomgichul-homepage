import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getEnglishWordbook } from "@/lib/english-study-data";
import { getKSTDateString } from "@/lib/exam";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: Request) {
  const user = await getUser();
  const today = new URL(request.url).searchParams.get("period") !== "all";
  const { data, error } = await createAdminClient().rpc("english_wordbook_board", {
    p_day: today ? getKSTDateString() : null,
    p_viewer: user?.id ?? null,
  });
  if (error) return NextResponse.json({ error: "board_unavailable" }, { status: 503 });
  return NextResponse.json({ rows: data }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user?.usernameSet) return NextResponse.json({ error: "profile_required" }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.sessionId !== "string" || !uuid.test(body.sessionId)
    || !Number.isInteger(body.position) || body.position < 1 || body.position > 10000
    || typeof body.wordId !== "string" || body.wordId.length > 200
    || typeof body.picked !== "string" || body.picked.length > 500
    || (body.direction !== "en-ko" && body.direction !== "ko-en")) {
    return NextResponse.json({ error: "invalid_answer" }, { status: 400 });
  }
  const word = (await getEnglishWordbook()).details.get(body.wordId);
  if (!word) return NextResponse.json({ error: "invalid_word" }, { status: 400 });
  const correct = body.direction === "en-ko" ? word.meanings[0] : word.term;
  const { error } = await createAdminClient().from("english_wordbook_rank_answers").upsert({
    user_id: user.id,
    session_id: body.sessionId,
    position: body.position,
    word_id: word.id,
    is_correct: body.picked === correct,
  }, { ignoreDuplicates: true });
  if (error) return NextResponse.json({ error: "record_unavailable" }, { status: 503 });
  return NextResponse.json({ ok: true });
}
