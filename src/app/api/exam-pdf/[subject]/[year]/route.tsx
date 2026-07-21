import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getExamPdfFileName, renderExamYearPdfBuffer } from "@/lib/exam-pdf";
import { EXAM_SUBJECTS } from "@/lib/constants";
import { getExamQuestionsForYear, type ExamSubject } from "@/lib/exam-questions";

export const runtime = "nodejs";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

interface PdfRouteParams {
  params: Promise<{ subject: string; year: string }>;
}

export async function GET(_request: NextRequest, { params }: PdfRouteParams) {
  const { subject, year: yearParam } = await params;

  if (!isValidSubject(subject)) {
    return NextResponse.json({ error: "invalid subject" }, { status: 404 });
  }

  const year = Number(yearParam);
  const questions = getExamQuestionsForYear(subject, year);
  if (questions.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const buffer = await renderExamYearPdfBuffer(subject, year);
  const fileName = getExamPdfFileName(subject, year);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
