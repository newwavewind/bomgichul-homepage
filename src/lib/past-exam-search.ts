import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured, getSupabaseEnv } from "@/lib/supabase/env";
import { communityScopeLabel } from "@/lib/exam-track/community";
import type { CommunityScope } from "@/types/database";
import {
  PAST_EXAM_TITLE_PREFIX,
  type PastExamFileKind,
  type PastExamPdfGroup,
} from "@/lib/past-exam-search-shared";

export type { PastExamPdfGroup, PastExamPdfFile, PastExamFileKind } from "@/lib/past-exam-search-shared";
export { PAST_EXAM_SCOPE_OPTIONS, PAST_EXAM_TITLE_PREFIX } from "@/lib/past-exam-search-shared";

function publicArchiveUrl(filePath: string): string {
  const { url } = getSupabaseEnv();
  return `${url}/storage/v1/object/public/archive/${filePath}`;
}

function detectKind(title: string): PastExamFileKind {
  // 경찰·영어처럼 「· 1차 … 정답」「· 국가직 정답」형태도 잡는다
  if (/최종정답|확정정답/.test(title)) return "answer";
  if (/정답\s*$/.test(title) && !/문제/.test(title)) return "answer";
  if (/문제지/.test(title) || /문제\s*$/.test(title) || /영어\s*문제/.test(title)) {
    return "question";
  }
  return "other";
}

function kindLabel(kind: PastExamFileKind): string {
  switch (kind) {
    case "question":
      return "문제";
    case "answer":
      return "정답";
    default:
      return "파일";
  }
}

/** 문제/정답 짝을 맞추기 위한 공통 키 */
export function groupKeyFromTitle(title: string, scope: CommunityScope): string {
  const base = title
    .replace(PAST_EXAM_TITLE_PREFIX, "")
    .replace(/\s*·\s*(문제지|문제|최종정답|확정정답|정답|해설).*$/u, "")
    .replace(/\s+/g, " ")
    .trim();
  return `${scope}|${base}`;
}

export function displayLabelFromTitle(title: string): string {
  return title
    .replace(PAST_EXAM_TITLE_PREFIX, "")
    .replace(/\s*·\s*(문제지|문제|최종정답|확정정답|정답|해설).*$/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractYear(title: string): number | null {
  const m = title.match(/(20\d{2})\s*년/);
  return m ? Number(m[1]) : null;
}

function extractRound(title: string): number | null {
  const m = title.match(/(\d{2,3})\s*회/);
  return m ? Number(m[1]) : null;
}

export async function searchPastExamPdfs(options: {
  q?: string;
  scope?: "all" | CommunityScope;
  year?: number | null;
  round?: number | null;
  limit?: number;
}): Promise<PastExamPdfGroup[]> {
  if (!isSupabaseConfigured()) return [];

  const q = (options.q ?? "").trim();
  const scope = options.scope ?? "all";
  const year = options.year && options.year >= 2000 && options.year <= 2100 ? options.year : null;
  const round =
    options.round && options.round >= 1 && options.round <= 200 ? options.round : null;
  const limit = Math.min(Math.max(options.limit ?? 24, 1), 48);
  const supabase = createPublicClient();

  let query = supabase
    .from("posts")
    .select(
      "id, title, community_scope, created_at, post_attachments(id, file_name, file_path, file_size, mime_type)",
    )
    .eq("category", "resource")
    .eq("resource_type", "past_exam")
    .like("title", `${PAST_EXAM_TITLE_PREFIX}%`)
    .order("created_at", { ascending: false })
    .limit(Math.min(limit * 3, 120));

  if (scope !== "all") {
    query = query.eq("community_scope", scope);
  }

  // 한국사는 제목에 연도가 없고 `N회`만 있음
  if (round) {
    query = query.ilike("title", `%${round}회%`);
  } else if (year) {
    query = query.ilike("title", `%${year}년%`);
  }

  if (q) {
    const tokens = q.split(/\s+/).filter(Boolean).slice(0, 6);
    for (const token of tokens) {
      query = query.ilike("title", `%${token}%`);
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error("past exam search failed:", error.message);
    return [];
  }

  const groups = new Map<string, PastExamPdfGroup>();

  for (const row of data ?? []) {
    const scopeValue = row.community_scope as CommunityScope;
    const key = groupKeyFromTitle(row.title, scopeValue);
    const attachments = Array.isArray(row.post_attachments) ? row.post_attachments : [];
    if (attachments.length === 0) continue;

    let group = groups.get(key);
    if (!group) {
      group = {
        key,
        label: displayLabelFromTitle(row.title),
        scope: scopeValue,
        scopeLabel: communityScopeLabel(scopeValue),
        year: extractYear(row.title),
        round: extractRound(row.title),
        files: [],
      };
      groups.set(key, group);
    }

    const kind = detectKind(row.title);
    for (const file of attachments) {
      if (!file.file_path) continue;
      if (group.files.some((f) => f.kind === kind && kind !== "other")) continue;
      group.files.push({
        kind,
        kindLabel: kindLabel(kind),
        postId: row.id,
        fileName: file.file_name,
        url: publicArchiveUrl(file.file_path),
      });
    }
  }

  const ordered = [...groups.values()].map((g) => ({
    ...g,
    files: [...g.files].sort((a, b) => {
      const order = { question: 0, answer: 1, other: 2 } as const;
      return order[a.kind] - order[b.kind];
    }),
  }));

  ordered.sort((a, b) => {
    if ((b.round ?? 0) !== (a.round ?? 0)) return (b.round ?? 0) - (a.round ?? 0);
    return (b.year ?? 0) - (a.year ?? 0);
  });

  return ordered.slice(0, limit);
}
