import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * 개념 커뮤니티(모두의 개념)의 개인화 조각만 내려주는 자리.
 *
 * 개념 상세 페이지는 정적(ISR)으로 굽느라 뷰어를 모른다 — 글 본문·좋아요 수는
 * 정적 HTML 에 그대로 싣고, 「내가 누른 좋아요·추천」 표시만 로그인 사용자가
 * 여기로 따로 물어 클라이언트에서 덧입힌다.
 */
export const runtime = "nodejs";

const EMPTY = { likedPostIds: [] as string[], recommendedPostIds: [] as string[] };
const PRIVATE_HEADERS = { "cache-control": "private, no-store" };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get("subject") ?? "";
  const slug = searchParams.get("slug") ?? "";
  if (!subject || !slug || subject.length > 100 || slug.length > 200) {
    return NextResponse.json(EMPTY, { status: 400, headers: PRIVATE_HEADERS });
  }

  const user = await getUser();
  // 비로그인은 개인화가 없다 — 오류가 아니라 빈 결과다.
  if (!user || !isSupabaseConfigured()) {
    return NextResponse.json(EMPTY, { headers: PRIVATE_HEADERS });
  }

  const supabase = await createClient();
  const { data: postRows } = await supabase
    .from("concept_community_posts")
    .select("id")
    .eq("subject", subject)
    .eq("concept_slug", slug);

  const postIds = (postRows ?? []).map((row: { id: string }) => row.id);
  if (postIds.length === 0) {
    return NextResponse.json(EMPTY, { headers: PRIVATE_HEADERS });
  }

  const [{ data: likeRows }, { data: recommendRows }] = await Promise.all([
    supabase
      .from("concept_community_post_likes")
      .select("post_id")
      .eq("user_id", user.id)
      .in("post_id", postIds),
    supabase
      .from("concept_community_post_recommends")
      .select("post_id")
      .eq("user_id", user.id)
      .in("post_id", postIds),
  ]);

  return NextResponse.json(
    {
      likedPostIds: (likeRows ?? []).map((row: { post_id: string }) => row.post_id),
      recommendedPostIds: (recommendRows ?? []).map(
        (row: { post_id: string }) => row.post_id
      ),
    },
    { headers: PRIVATE_HEADERS }
  );
}
