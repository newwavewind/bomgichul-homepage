import { createAdminClient } from "@/lib/supabase/admin";
import { CATEGORY_MAP } from "@/lib/constants";
import type { PostCategory } from "@/types/database";
import { kstDayBounds, toKstDateKey } from "@/lib/site-visits";

export type AdminUserRow = {
  id: string;
  email: string | null;
  nickname: string;
  usernameSet: boolean;
  createdAt: string;
  lastSignInAt: string | null;
  isAdmin: boolean;
};

export type AdminOverview = {
  totalUsers: number;
  usersWithUsername: number;
  totalPosts: number;
  postsLast7Days: number;
  openReports: number;
  publicMemos: number;
  dmMessages: number;
  mockExamSessions: number;
  dailyQuizUsers: number;
  premiumUsers: number;
};

function getAdminClient() {
  return createAdminClient();
}

type AuthUserMeta = {
  email: string | null;
  lastSignInAt: string | null;
};

/** Auth Admin listUsers 전체 스캔 대신, 필요한 id만 getUserById로 조회 */
async function getAuthMetaByIds(
  admin: ReturnType<typeof createAdminClient>,
  ids: string[]
): Promise<Map<string, AuthUserMeta>> {
  const unique = [...new Set(ids.filter(Boolean))];
  const map = new Map<string, AuthUserMeta>();
  if (unique.length === 0) return map;

  const chunkSize = 25;
  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize);
    const rows = await Promise.all(
      chunk.map(async (id) => {
        const { data, error } = await admin.auth.admin.getUserById(id);
        if (error || !data.user) {
          return [id, { email: null, lastSignInAt: null }] as const;
        }
        return [
          id,
          {
            email: data.user.email ?? null,
            lastSignInAt: data.user.last_sign_in_at ?? null,
          },
        ] as const;
      })
    );
    for (const [id, meta] of rows) map.set(id, meta);
  }
  return map;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const admin = getAdminClient();

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    totalUsersRes,
    usersWithUsernameRes,
    postsRes,
    recentPostsRes,
    reportsRes,
    memosRes,
    dmRes,
    mockRes,
    quizRes,
    premiumRes,
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("username_set", true),
    admin.from("posts").select("id", { count: "exact", head: true }),
    admin
      .from("posts")
      .select("id", { count: "exact", head: true })
      .gte("created_at", weekAgo),
    admin
      .from("posts")
      .select("id", { count: "exact", head: true })
      .in("category", ["bug", "feedback"]),
    admin.from("question_public_memos").select("id", { count: "exact", head: true }),
    admin.from("dm_messages").select("id", { count: "exact", head: true }),
    admin.from("mock_exam_sessions").select("id", { count: "exact", head: true }),
    admin.from("daily_quiz_results").select("user_id", { count: "exact", head: true }),
    admin
      .from("user_entitlements")
      .select("user_id", { count: "exact", head: true })
      .eq("status", "active"),
  ]);

  return {
    totalUsers: totalUsersRes.count ?? 0,
    usersWithUsername: usersWithUsernameRes.count ?? 0,
    totalPosts: postsRes.count ?? 0,
    postsLast7Days: recentPostsRes.count ?? 0,
    openReports: reportsRes.count ?? 0,
    publicMemos: memosRes.count ?? 0,
    dmMessages: dmRes.count ?? 0,
    mockExamSessions: mockRes.count ?? 0,
    dailyQuizUsers: quizRes.count ?? 0,
    premiumUsers: premiumRes.count ?? 0,
  };
}

export async function getAdminUsers(limit = 100): Promise<AdminUserRow[]> {
  const admin = getAdminClient();

  const [{ data: profiles }, { data: admins }] = await Promise.all([
    admin
      .from("profiles")
      .select("id, nickname, username_set, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    admin.from("admin_users").select("user_id"),
  ]);

  const adminIds = new Set((admins ?? []).map((a) => a.user_id));
  const authById = await getAuthMetaByIds(
    admin,
    (profiles ?? []).map((p) => p.id)
  );

  return (profiles ?? []).map((p) => {
    const auth = authById.get(p.id);
    return {
      id: p.id,
      email: auth?.email ?? null,
      nickname: p.nickname,
      usernameSet: Boolean(p.username_set),
      createdAt: p.created_at,
      lastSignInAt: auth?.lastSignInAt ?? null,
      isAdmin: adminIds.has(p.id),
    };
  });
}

export type AdminPostRow = {
  id: string;
  title: string;
  category: PostCategory;
  categoryLabel: string;
  communityScope: string;
  authorNickname: string;
  viewCount: number;
  createdAt: string;
};

export type AdminPublicMemoRow = {
  id: string;
  subject: string;
  year: number;
  questionNo: number;
  content: string;
  authorNickname: string;
  createdAt: string;
};

export async function getAdminPublicMemos(limit = 100): Promise<AdminPublicMemoRow[]> {
  const admin = getAdminClient();

  const { data } = await admin
    .from("question_public_memos")
    .select("id, subject, year, question_no, content, created_at, profiles:user_id(nickname)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!data) return [];

  return data.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      subject: row.subject,
      year: row.year,
      questionNo: row.question_no,
      content: row.content,
      authorNickname: profile?.nickname ?? "익명",
      createdAt: row.created_at,
    };
  });
}

export async function getAdminPosts(options: {
  category?: PostCategory | "reports";
  limit?: number;
}): Promise<AdminPostRow[]> {
  const admin = getAdminClient();

  let query = admin
    .from("posts")
    .select("id, title, category, community_scope, view_count, created_at, profiles:author_id(nickname)")
    .order("created_at", { ascending: false })
    .limit(options.limit ?? 50);

  if (options.category === "reports") {
    query = query.in("category", ["bug", "feedback"]);
  } else if (options.category) {
    query = query.eq("category", options.category);
  }

  const { data } = await query;
  if (!data) return [];

  return data.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const category = row.category as PostCategory;
    return {
      id: row.id,
      title: row.title,
      category,
      categoryLabel: CATEGORY_MAP[category] ?? category,
      communityScope: row.community_scope ?? "real_estate",
      authorNickname: profile?.nickname ?? "익명",
      viewCount: row.view_count,
      createdAt: row.created_at,
    };
  });
}

export type AdminPremiumRow = {
  userId: string;
  nickname: string;
  email: string | null;
  productType: string;
  status: string;
  expiresAt: string | null;
};

export async function getAdminPremiumEntitlements(limit = 50): Promise<AdminPremiumRow[]> {
  const admin = getAdminClient();

  const { data } = await admin
    .from("user_entitlements")
    .select(
      `
      user_id,
      product_type,
      status,
      expires_at,
      profiles:user_id (nickname)
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!data) return [];

  const authById = await getAuthMetaByIds(
    admin,
    data.map((row) => row.user_id)
  );

  return data.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      userId: row.user_id,
      nickname: profile?.nickname ?? "익명",
      email: authById.get(row.user_id)?.email ?? null,
      productType: row.product_type,
      status: row.status,
      expiresAt: row.expires_at,
    };
  });
}

export type AdminRecentSignup = {
  nickname: string;
  email: string | null;
  createdAt: string;
  usernameSet: boolean;
};

export type AdminRecentSignupPage = {
  rows: AdminRecentSignup[];
  total: number;
};

export async function getAdminRecentSignups(
  limit: number | null = 30,
  offset = 0
): Promise<AdminRecentSignupPage> {
  const admin = getAdminClient();
  const from = Math.max(0, offset);
  const pageSize = 1000;

  const fetchProfiles = async () => {
    if (limit !== null) {
      const { count, error: countError } = await admin
        .from("profiles")
        .select("id", { count: "exact", head: true });
      if (countError) throw countError;

      const total = count ?? 0;
      if (total === 0) return { profiles: [], total };

      const safeFrom = Math.min(from, total - 1);
      const to = safeFrom + Math.max(1, limit) - 1;
      const { data, error } = await admin
        .from("profiles")
        .select("id, nickname, username_set, created_at")
        .order("created_at", { ascending: false })
        .range(safeFrom, to);
      if (error) throw error;
      return { profiles: data ?? [], total };
    }

    const profiles = [];
    let total = 0;
    for (let batchFrom = 0; ; batchFrom += pageSize) {
      const { data, count, error } = await admin
        .from("profiles")
        .select("id, nickname, username_set, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(batchFrom, batchFrom + pageSize - 1);
      if (error) throw error;
      const batch = data ?? [];
      profiles.push(...batch);
      total = count ?? profiles.length;
      if (batch.length < pageSize) return { profiles, total };
    }
  };

  const { profiles, total } = await fetchProfiles();
  const authById = await getAuthMetaByIds(
    admin,
    profiles.map((profile) => profile.id)
  );

  return {
    rows: profiles.map((profile) => ({
      nickname: profile.nickname,
      email: authById.get(profile.id)?.email ?? null,
      createdAt: profile.created_at,
      usernameSet: Boolean(profile.username_set),
    })),
    total,
  };
}

/* ─── AI 해설 모음 ─────────────────────────────────────────────────
 * 앱에서 「바로바로 AI 해설」을 누를 때마다 생긴 해설이 쌓인다.
 * 사람이 아니라 해설에 관한 기록이라 기기 식별자도, 사용자가 적은
 * 꼬리질문도 담기지 않는다.
 */

export type AiExplanationGroupRow = {
  subjectId: string;
  examId: string | null;
  itemKey: string | null;
  itemText: string;
  answer: string | null;
  variantCount: number;
  modelCount: number;
  promptVersionCount: number;
  firstAt: string;
  lastAt: string;
};

export type AiExplanationVariantRow = {
  id: number;
  explanation: string;
  model: string;
  promptVersion: string;
  createdAt: string;
};

export type AiExplanationOverview = {
  total: number;
  itemCount: number;
  today: number;
};

export async function getAiExplanationOverview(): Promise<AiExplanationOverview> {
  const admin = getAdminClient();

  // 한국 시간 자정부터
  const now = new Date();
  const seoulMidnight = new Date(
    new Date(now.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10) + "T00:00:00+09:00"
  ).toISOString();

  const [totalRes, todayRes, groupsRes] = await Promise.all([
    admin.from("ai_explanation_log").select("id", { count: "exact", head: true }),
    admin
      .from("ai_explanation_log")
      .select("id", { count: "exact", head: true })
      .gte("created_at", seoulMidnight),
    admin
      .from("ai_explanation_log_groups")
      .select("exam_id", { count: "exact", head: true }),
  ]);

  return {
    total: totalRes.count ?? 0,
    today: todayRes.count ?? 0,
    itemCount: groupsRes.count ?? 0,
  };
}

/** 판본이 많이 쌓인 보기부터 — 견주어 볼 거리가 있는 자리가 위로 온다 */
export async function getAiExplanationGroups(options: {
  subjectId?: string;
  /** YYYY-MM-DD (KST). last_at 기준 그날만 */
  dateKey?: string;
  limit?: number;
} = {}): Promise<AiExplanationGroupRow[]> {
  const admin = getAdminClient();

  let query = admin
    .from("ai_explanation_log_groups")
    .select(
      "subject_id, exam_id, item_key, item_text, answer, variant_count, model_count, prompt_version_count, first_at, last_at"
    )
    .order("last_at", { ascending: false })
    .order("variant_count", { ascending: false })
    .limit(options.limit ?? 400);

  if (options.subjectId) query = query.eq("subject_id", options.subjectId);

  if (options.dateKey) {
    const { start, end } = kstDayBounds(options.dateKey);
    query = query.gte("last_at", start).lt("last_at", end);
  }

  const { data } = await query;
  if (!data) return [];

  return data.map((row) => ({
    subjectId: row.subject_id,
    examId: row.exam_id,
    itemKey: row.item_key,
    itemText: row.item_text ?? "",
    answer: row.answer,
    variantCount: row.variant_count,
    modelCount: row.model_count,
    promptVersionCount: row.prompt_version_count,
    firstAt: row.first_at,
    lastAt: row.last_at,
  }));
}

/** 최근 활동이 있는 날짜(KST)와 그날 보기 수 — 미니 달력용 */
export async function getAiExplanationDateSummaries(
  limitDays = 120
): Promise<{ dateKey: string; count: number }[]> {
  const admin = getAdminClient();
  const { data } = await admin
    .from("ai_explanation_log_groups")
    .select("last_at")
    .order("last_at", { ascending: false })
    .limit(2000);

  if (!data?.length) return [];

  const counts = new Map<string, number>();
  for (const row of data) {
    const key = toKstDateKey(new Date(row.last_at));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([dateKey, count]) => ({ dateKey, count }))
    .sort((a, b) => (a.dateKey < b.dateKey ? 1 : -1))
    .slice(0, limitDays);
}

/** 한 보기에 쌓인 판본들 — 오래된 것부터 봐야 달라진 자취가 읽힌다 */
export async function getAiExplanationVariants(params: {
  subjectId: string;
  examId: string | null;
  itemKey: string | null;
}): Promise<AiExplanationVariantRow[]> {
  const admin = getAdminClient();

  let query = admin
    .from("ai_explanation_log")
    .select("id, explanation, model, prompt_version, created_at")
    .eq("subject_id", params.subjectId)
    .order("id", { ascending: true })
    .limit(100);

  query = params.examId ? query.eq("exam_id", params.examId) : query.is("exam_id", null);
  query = params.itemKey ? query.eq("item_key", params.itemKey) : query.is("item_key", null);

  const { data } = await query;
  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    explanation: row.explanation,
    model: row.model,
    promptVersion: row.prompt_version,
    createdAt: row.created_at,
  }));
}

/** 과목 고르개에 쓸 목록 */
export async function getAiExplanationSubjects(): Promise<{ id: string; count: number }[]> {
  const admin = getAdminClient();
  const { data } = await admin
    .from("ai_explanation_log_groups")
    .select("subject_id, variant_count");
  if (!data) return [];

  const tally = new Map<string, number>();
  for (const row of data) {
    tally.set(row.subject_id, (tally.get(row.subject_id) ?? 0) + row.variant_count);
  }
  return [...tally.entries()]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count);
}

export async function deleteAdminPost(
  postId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  let admin;
  try {
    admin = getAdminClient();
  } catch {
    return { ok: false, error: "Supabase가 설정되지 않았습니다." };
  }

  const { error } = await admin.from("posts").delete().eq("id", postId);
  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
