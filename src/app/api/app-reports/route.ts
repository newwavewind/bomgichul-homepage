import { NextResponse } from "next/server";
import {
  createAdminClient,
  ensureAppReportAuthorId,
} from "@/lib/supabase/admin";

type ReportType = "error" | "feedback";

const TYPE_TO_CATEGORY: Record<ReportType, "bug" | "feedback"> = {
  error: "bug",
  feedback: "feedback",
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const type = body?.type as ReportType;
    const title = String(body?.title ?? "").trim();
    const content = String(body?.content ?? "").trim();

    if (type !== "error" && type !== "feedback") {
      return json({ error: "type은 error 또는 feedback 이어야 합니다." }, 400);
    }
    if (!title || title.length > 200) {
      return json({ error: "제목은 1~200자로 입력해주세요." }, 400);
    }
    if (!content || content.length > 8000) {
      return json({ error: "내용은 1~8000자로 입력해주세요." }, 400);
    }

    const authorId = await ensureAppReportAuthorId();
    const admin = createAdminClient();
    const category = TYPE_TO_CATEGORY[type];

    const { data, error } = await admin
      .from("posts")
      .insert({
        author_id: authorId,
        category,
        title,
        content,
      })
      .select("id")
      .single();

    if (error) {
      return json({ error: error.message }, 500);
    }

    return json({
      ok: true,
      id: data.id,
      url: `/community/${data.id}`,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "제보 저장에 실패했습니다.";
    return json({ error: message }, 500);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
