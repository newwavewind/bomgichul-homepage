import { NextResponse } from "next/server";
import { EXAM_SUBJECTS } from "@/lib/constants";
import {
  getExamQuestionsForYear,
  getExamYears,
  type ExamSubject,
} from "@/lib/exam-questions";
import { getWrongQuestionsForSubject } from "@/lib/attempts";
import { getUser } from "@/lib/auth";

const VALID = new Set(EXAM_SUBJECTS.map((s) => s.value));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind") ?? "subjects";

  if (kind === "subjects") {
    return NextResponse.json({
      subjects: EXAM_SUBJECTS.map((s) => ({ value: s.value, label: s.label })),
    });
  }

  const subject = searchParams.get("subject") ?? "";
  if (!VALID.has(subject as ExamSubject)) {
    return NextResponse.json({ error: "invalid subject" }, { status: 400 });
  }
  const examSubject = subject as ExamSubject;

  if (kind === "years") {
    return NextResponse.json({ years: getExamYears(examSubject) });
  }

  if (kind === "questions") {
    const year = Number(searchParams.get("year"));
    if (!Number.isFinite(year)) {
      return NextResponse.json({ error: "invalid year" }, { status: 400 });
    }
    const questions = getExamQuestionsForYear(examSubject, year).map((q) => ({
      examId: `${examSubject}-${q.year}-${q.questionNo}`,
      questionNo: q.questionNo,
      stem: q.stem.slice(0, 120),
      year: q.year,
      subject: examSubject,
    }));
    return NextResponse.json({ questions });
  }

  if (kind === "wrongs") {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ items: [], loginRequired: true });
    }
    const wrongs = await getWrongQuestionsForSubject(user.id, examSubject);
    return NextResponse.json({
      items: wrongs.slice(0, 40).map((q) => ({
        examId: `${examSubject}-${q.year}-${q.questionNo}`,
        subject: examSubject,
        year: q.year,
        questionNo: q.questionNo,
        stem: q.stem.slice(0, 140),
        href: `/exam/${examSubject}/${q.year}/${q.questionNo}`,
      })),
    });
  }

  if (kind === "mock-years") {
    return NextResponse.json({ years: getExamYears(examSubject) });
  }

  return NextResponse.json({ error: "unknown kind" }, { status: 400 });
}
