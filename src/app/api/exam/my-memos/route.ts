import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/auth";
import { getQuestionMemosForQuestion } from "@/lib/question-memos";

// Fetch the current thread, including viewer-specific likes when signed in.
export const runtime = "nodejs";

const PRIVATE_HEADERS = { "cache-control": "private, no-store" };

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const subject = params.get("subject") ?? "";
  const year = Number(params.get("year"));
  const questionNo = Number(params.get("no"));
  if (!subject || !Number.isFinite(year) || !Number.isFinite(questionNo)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400, headers: PRIVATE_HEADERS });
  }

  const user = await getUser();
  try {
    const memos = await getQuestionMemosForQuestion(subject, year, questionNo, user?.id);
    return NextResponse.json({ memos }, { headers: PRIVATE_HEADERS });
  } catch {
    return NextResponse.json({ error: "discussion_unavailable" }, { status: 503, headers: PRIVATE_HEADERS });
  }
}
