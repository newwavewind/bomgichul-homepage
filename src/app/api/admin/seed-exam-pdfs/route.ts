import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncExamPdfToArchive } from "@/lib/exam-pdf-archive";
import { getExamYearParams, type ExamSubject } from "@/lib/exam-questions";
import { EXAM_SUBJECTS } from "@/lib/constants";

export const maxDuration = 300;

const ADMIN_EMAIL = "newwavewind@gmail.com";
const ADMIN_NICKNAME = "봄기출";

async function resolveAdminAuthorId(
  admin: ReturnType<typeof createAdminClient>
): Promise<string> {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw new Error(`관리자 계정 조회 실패: ${error.message}`);

  const user = data.users.find((u) => u.email === ADMIN_EMAIL);
  if (!user) throw new Error(`${ADMIN_EMAIL} 계정을 찾을 수 없습니다.`);

  const { data: profile } = await admin
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.nickname !== ADMIN_NICKNAME) {
    await admin
      .from("profiles")
      .upsert({ id: user.id, nickname: ADMIN_NICKNAME, username_set: true });
  }

  return user.id;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const subjectFilter = url.searchParams.get("subject");
  const yearFilter = url.searchParams.get("year");
  const offset = Math.max(0, Number(url.searchParams.get("offset") ?? 0));
  const limit = Math.min(20, Math.max(1, Number(url.searchParams.get("limit") ?? 10)));

  const validSubjects = EXAM_SUBJECTS.map((s) => s.value);
  let targets = getExamYearParams();

  if (subjectFilter) {
    if (!validSubjects.includes(subjectFilter as ExamSubject)) {
      return NextResponse.json({ error: "invalid subject" }, { status: 400 });
    }
    targets = targets.filter((item) => item.subject === subjectFilter);
  }

  if (yearFilter) {
    targets = targets.filter((item) => item.year === yearFilter);
  }

  const batch = targets.slice(offset, offset + limit);

  let authorId: string;
  try {
    const admin = createAdminClient();
    authorId = await resolveAdminAuthorId(admin);

    const results: {
      subject: string;
      year: string;
      status: "skipped" | "created" | "updated" | "error";
      error?: string;
    }[] = [];

    for (const item of batch) {
      try {
        const status = await syncExamPdfToArchive(
          admin,
          authorId,
          item.subject,
          Number(item.year)
        );
        results.push({ subject: item.subject, year: item.year, status });
      } catch (err) {
        results.push({
          subject: item.subject,
          year: item.year,
          status: "error",
          error: err instanceof Error ? err.message : "unknown error",
        });
      }
    }

    const nextOffset = offset + batch.length;
    const done = nextOffset >= targets.length;

    return NextResponse.json({
      ok: true,
      total: targets.length,
      offset,
      limit,
      processed: batch.length,
      nextOffset: done ? null : nextOffset,
      done,
      results,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "seed failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
