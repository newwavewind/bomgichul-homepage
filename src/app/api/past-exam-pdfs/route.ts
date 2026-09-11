import { NextResponse } from "next/server";
import { searchPastExamPdfs } from "@/lib/past-exam-search";
import { PAST_EXAM_SCOPE_OPTIONS } from "@/lib/past-exam-search-shared";
import type { CommunityScope } from "@/types/database";

export const runtime = "nodejs";

const SCOPES = new Set(PAST_EXAM_SCOPE_OPTIONS.map((o) => o.value));

/**
 * 홈 「기출 문제·정답 PDF」 검색 — 로그인 없이 공개.
 * 홈 페이지를 정적으로 유지하기 위해 클라이언트가 호출한다.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const scopeRaw = searchParams.get("scope") ?? "all";
  const scope = SCOPES.has(scopeRaw as "all" | CommunityScope)
    ? (scopeRaw as "all" | CommunityScope)
    : "all";

  const items = await searchPastExamPdfs({ q, scope, limit: 20 });

  return NextResponse.json(
    { items },
    {
      headers: {
        // 짧은 CDN 캐시 — 같은 검색어 반복에 빠르게
        "cache-control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
