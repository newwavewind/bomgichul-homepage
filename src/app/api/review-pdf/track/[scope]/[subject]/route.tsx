import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";
import { getEnglishSubject } from "@/lib/english-content";
import { getHistorySubject } from "@/lib/history-content";
import { getHousingSubject } from "@/lib/housing-content";
import { getPoliceSubject } from "@/lib/police-content";
import { getPublicServiceSubject } from "@/lib/public-service-content";
import { getSocialWorkerSubject } from "@/lib/social-worker-content";
import { createClient } from "@/lib/supabase/server";
import { collectTrackReviewEntries, renderTrackReviewPdfBuffer } from "@/lib/track-review-pdf";

export const runtime = "nodejs";

const TRACKS = {
  public_service: { label: "공무원", getSubject: getPublicServiceSubject },
  police: { label: "경찰공무원", getSubject: getPoliceSubject },
  housing: { label: "주택관리사", getSubject: getHousingSubject },
  social_worker: { label: "사회복지사 1급", getSubject: getSocialWorkerSubject },
  history: { label: "한국사능력검정", getSubject: getHistorySubject },
  english: { label: "공무원 영어", getSubject: getEnglishSubject },
} as const;

type TrackScope = keyof typeof TRACKS;

function isTrackScope(value: string): value is TrackScope {
  return value in TRACKS;
}

export async function GET(_request: Request, context: RouteContext<"/api/review-pdf/track/[scope]/[subject]">) {
  const { scope, subject } = await context.params;
  if (!isTrackScope(scope)) return NextResponse.json({ error: "invalid track" }, { status: 404 });

  const track = TRACKS[scope];
  const data = track.getSubject(subject) as ExamTrackSubjectContent | null;
  if (!data) return NextResponse.json({ error: "invalid subject" }, { status: 404 });

  const user = await getUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });

  const supabase = await createClient();
  const prefix = `${scope}:${subject}:`;
  const [{ data: bookmarks, error: bookmarkError }, { data: memos, error: memoError }] = await Promise.all([
    supabase.from("question_bookmarks").select("subject,year,question_no").eq("user_id", user.id).like("subject", `${prefix}%`),
    supabase.from("question_public_memos").select("subject,year,question_no,content").eq("user_id", user.id).like("subject", `${prefix}%`),
  ]);
  if (bookmarkError || memoError) {
    return NextResponse.json({ error: "복습 자료를 불러오지 못했어요." }, { status: 500 });
  }

  const entries = collectTrackReviewEntries(data, scope, subject, bookmarks ?? [], memos ?? []);
  if (entries.length === 0) {
    return NextResponse.json({ error: "북마크나 내 메모가 없어요." }, { status: 404 });
  }

  const buffer = await renderTrackReviewPdfBuffer(track.label, data, entries);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${scope}-${subject}-review.pdf"`,
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Length": String(buffer.length),
    },
  });
}
