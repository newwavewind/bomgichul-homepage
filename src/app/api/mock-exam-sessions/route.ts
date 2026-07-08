import { NextRequest, NextResponse } from "next/server";
import { EXAM_SUBJECTS } from "@/lib/constants";
import { saveMockExamSession } from "@/lib/mock-exam-sessions";
import type { ExamSubject } from "@/lib/exam-questions";
import { getUser } from "@/lib/auth";
import { isSubjectUnlocked } from "@/lib/premium";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
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

  const unlocked = await isSubjectUnlocked(user.id, subject);
  if (!unlocked) {
    return NextResponse.json({ error: "프리미엄 과목만 기록할 수 있어요." }, { status: 403 });
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
