import { NextRequest, NextResponse } from "next/server";
import { EXAM_SUBJECTS } from "@/lib/constants";
import { getMockExamSessions, saveMockExamSession } from "@/lib/mock-exam-sessions";
import type { ExamSubject } from "@/lib/exam-questions";
import { getUser } from "@/lib/auth";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

/**
 * 연도 페이지의 「시험 모드 기록」이 클라이언트에서 묻는 자리.
 * 페이지가 서버에서 getUser() 로 세션을 읽으면 쿠키 때문에 전체가 동적
 * 렌더로 떨어지므로, 기록은 여기서 요청 시에만 읽고 페이지는 정적으로 남긴다.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const subject = params.get("subject") ?? "";
  const yearRaw = params.get("year");
  const year = Number(yearRaw);

  // Number(null)은 0 이라 year 누락이 통과해 버린다 — 원문 존재부터 확인한다.
  if (!isValidSubject(subject) || !yearRaw || !Number.isFinite(year)) {
    return NextResponse.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }

  const user = await getUser();
  if (!user) {
    // 비로그인은 빈 목록 — 연도 페이지가 지금처럼 아무것도 그리지 않는다.
    return NextResponse.json(
      { sessions: [] },
      { headers: { "cache-control": "private, no-store" } },
    );
  }

  const sessions = await getMockExamSessions(user.id, subject, year);
  return NextResponse.json(
    { sessions },
    { headers: { "cache-control": "private, no-store" } },
  );
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }

  const subject = String(body.subject ?? "");
  const year = Number(body.year);
  const total = Number(body.total);
  const correct = Number(body.correct);
  const elapsedSeconds = Number(body.elapsedSeconds);

  if (
    !isValidSubject(subject) ||
    !Number.isFinite(year) ||
    !Number.isFinite(total) ||
    total <= 0 ||
    !Number.isFinite(correct) ||
    correct < 0 ||
    !Number.isFinite(elapsedSeconds) ||
    elapsedSeconds < 0
  ) {
    return NextResponse.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }

  const session = await saveMockExamSession({
    userId: user.id,
    subject,
    year,
    total,
    correct,
    elapsedSeconds,
  });

  if (!session) {
    return NextResponse.json({ error: "기록 저장에 실패했어요." }, { status: 500 });
  }

  return NextResponse.json({ session });
}
