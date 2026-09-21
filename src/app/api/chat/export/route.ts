import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");
  const filter = searchParams.get("filter") ?? "all";
  if (!conversationId) {
    return NextResponse.json({ error: "missing conversationId" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: member } = await supabase
    .from("dm_conversation_members")
    .select("user_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!member) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { data: conv } = await supabase
    .from("dm_conversations")
    .select("title")
    .eq("id", conversationId)
    .maybeSingle();

  let query = supabase
    .from("dm_messages")
    .select(
      "id,content,created_at,message_kind,payload,deleted_at,profiles:sender_id(nickname)",
    )
    .eq("conversation_id", conversationId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true })
    .limit(500);

  if (filter === "exam") {
    query = query.in("message_kind", [
      "exam_card",
      "wrong_share",
      "mock_invite",
      "schedule_share",
      "note_card",
      "live_session",
    ]);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const lines = [
    `# ${conv?.title ?? "채팅"} 내보내기`,
    `# filter=${filter}`,
    "",
  ];
  for (const row of data ?? []) {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const nick = (profile as { nickname?: string } | null)?.nickname ?? "익명";
    const when = row.created_at;
    const kind = row.message_kind ?? "text";
    const payload = (row.payload ?? {}) as Record<string, unknown>;
    let body = row.content || "";
    if (kind === "exam_card" || kind === "wrong_share") {
      body = [
        body,
        typeof payload.stem === "string" ? `지문: ${payload.stem}` : "",
        payload.year && payload.questionNo
          ? `문항: ${payload.year}년 ${payload.questionNo}번`
          : "",
      ]
        .filter(Boolean)
        .join("\n");
    }
    lines.push(`[${when}] ${nick} (${kind})`);
    lines.push(body);
    lines.push("");
  }

  const text = lines.join("\n");
  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="chat-export-${conversationId.slice(0, 8)}.txt"`,
    },
  });
}
