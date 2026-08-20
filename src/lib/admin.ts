import { createAdminClient } from "@/lib/supabase/admin";
import { CATEGORY_MAP } from "@/lib/constants";
import type { PostCategory } from "@/types/database";

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

  const [{ data: profiles }, { data: admins }, authList] = await Promise.all([
    admin.from("profiles").select("id, nickname, username_set, created_at").order("created_at", { ascending: false }).limit(limit),
    admin.from("admin_users").select("user_id"),
    admin.auth.admin.listUsers({ perPage: 200 }),
  ]);

  const adminIds = new Set((admins ?? []).map((a) => a.user_id));
  const authById = new Map(
    (authList.data?.users ?? []).map((u) => [
      u.id,
      { email: u.email ?? null, lastSignInAt: u.last_sign_in_at ?? null },
    ])
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

  const authListRes = await admin.auth.admin.listUsers({ perPage: 200 });
  const authById = new Map(
    (authListRes.data?.users ?? []).map((u) => [u.id, u.email ?? null])
  );

  return data.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      userId: row.user_id,
      nickname: profile?.nickname ?? "익명",
      email: authById.get(row.user_id) ?? null,
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

  const fetchAuthUsers = async () => {
    const users = [];
    for (let authPage = 1; ; authPage += 1) {
      const result = await admin.auth.admin.listUsers({
        page: authPage,
        perPage: pageSize,
      });
      if (result.error) throw result.error;
      const batch = result.data?.users ?? [];
      users.push(...batch);
      if (batch.length < pageSize) return users;
    }
  };

  const [{ profiles, total }, authUsers] = await Promise.all([
    fetchProfiles(),
    fetchAuthUsers(),
  ]);

  const authById = new Map(
    authUsers.map((user) => [user.id, user.email ?? null])
  );

  return {
    rows: (profiles ?? []).map((profile) => ({
      nickname: profile.nickname,
      email: authById.get(profile.id) ?? null,
      createdAt: profile.created_at,
      usernameSet: Boolean(profile.username_set),
    })),
    total,
  };
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
