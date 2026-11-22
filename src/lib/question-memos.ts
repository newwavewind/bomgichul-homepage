import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type {
  CommunityScope,
  PublicMemoComment,
  QuestionDiscussionMemo,
} from "@/types/database";

/** 트랙별 메모 키가 서로 겹치지 않도록 (회차·출처 포함) */
export function examMemoSubjectKey(
  scope: CommunityScope,
  subjectId: string,
  sourceCode?: string,
): string {
  if (scope === "real_estate") return subjectId;
  const source = (sourceCode ?? "").trim();
  return source ? `${scope}:${subjectId}:${source}` : `${scope}:${subjectId}`;
}

type ProfileSnippet = { nickname: string; avatar_url: string | null };

type MemoRow = {
  id: string;
  user_id: string;
  subject: string;
  year: number;
  question_no: number;
  content: string;
  created_at: string;
  updated_at: string;
  visibility: QuestionDiscussionMemo["visibility"];
  profiles: ProfileSnippet | ProfileSnippet[] | null;
  question_public_memo_likes: { user_id: string }[] | null;
  question_public_memo_comments:
    | {
        id: string;
        memo_id: string;
        user_id: string;
        content: string;
        created_at: string;
        profiles: ProfileSnippet | ProfileSnippet[] | null;
      }[]
    | null;
};

function pickProfile(
  profiles: ProfileSnippet | ProfileSnippet[] | null | undefined
): ProfileSnippet {
  if (Array.isArray(profiles)) return profiles[0] ?? { nickname: "익명", avatar_url: null };
  return profiles ?? { nickname: "익명", avatar_url: null };
}

export async function getQuestionMemosForQuestion(
  subject: string,
  year: number,
  questionNo: number,
  viewerUserId?: string | null
): Promise<QuestionDiscussionMemo[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = viewerUserId ? await createClient() : createPublicClient();
  const { data, error } = await supabase
    .from("question_public_memos")
    .select(
      `
      id,
      user_id,
      subject,
      year,
      question_no,
      content,
      created_at,
      updated_at,
      visibility,
      profiles:user_id (nickname, avatar_url),
      question_public_memo_likes (user_id),
      question_public_memo_comments (
        id,
        memo_id,
        user_id,
        content,
        created_at,
        profiles:user_id (nickname, avatar_url)
      )
    `
    )
    .eq("subject", subject)
    .eq("year", year)
    .eq("question_no", questionNo)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = ((data ?? []) as MemoRow[]).filter((row) => row.visibility === "public" || row.user_id === viewerUserId);
  const reviewerIds = new Set(rows.flatMap(row => (row.question_public_memo_comments ?? []).filter(c => /^\[검수 확인:[a-zA-Z0-9-]+\]\n/.test(c.content)).map(c => c.user_id)));
  let verifiedReviewers = new Set<string>();
  if (reviewerIds.size && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data: admins } = await createAdminClient().from("admin_users").select("user_id").in("user_id", [...reviewerIds]);
    verifiedReviewers = new Set((admins ?? []).map(row => row.user_id));
  }
  return rows.map((row) => {
    const author = pickProfile(row.profiles);
    const likes = row.question_public_memo_likes ?? [];
    const comments = (row.question_public_memo_comments ?? [])
      .slice()
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map(
        (c): PublicMemoComment => ({
          verifiedByStaff: verifiedReviewers.has(c.user_id) && /^\[검수 확인:[a-zA-Z0-9-]+\]\n/.test(c.content),
          id: c.id,
          memo_id: c.memo_id,
          user_id: c.user_id,
          content: c.content,
          created_at: c.created_at,
          author: pickProfile(c.profiles),
        })
      );

    return {
      id: row.id,
      user_id: row.user_id,
      subject: row.subject,
      year: row.year,
      question_no: row.question_no,
      content: row.content,
      created_at: row.created_at,
      updated_at: row.updated_at,
      visibility: row.visibility,
      author,
      like_count: likes.length,
      liked_by_viewer: viewerUserId
        ? likes.some((like) => like.user_id === viewerUserId)
        : false,
      comments,
    };
  });
}
