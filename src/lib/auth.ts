import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  isLocalPreviewHostHeader,
  PREVIEW_ADMIN_USER,
} from "@/lib/dev-preview-auth";

export const getUser = cache(async () => {
  if (!isSupabaseConfigured()) return null;

  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const hasAuthCookie = allCookies.some(
      (c) =>
        c.name.includes("auth-token") ||
        (c.name.startsWith("sb-") && (c.name.includes("token") || c.name.includes("auth")))
    );

    if (!hasAuthCookie) return null;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const [{ data: profile }, { data: adminRow }] = await Promise.all([
      supabase
        .from("profiles")
        .select("nickname, avatar_url, username_set")
        .eq("id", user.id)
        .single(),
      supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle(),
    ]);

    const usernameSet = Boolean(profile?.username_set);
    const isAdmin = Boolean(adminRow);

    return {
      id: user.id,
      email: user.email,
      /** 공개 아이디 — username_set 전에는 헤더 등에 노출하지 않음 */
      nickname: usernameSet ? (profile?.nickname ?? "익명") : "",
      usernameSet,
      isAdmin,
      avatar_url: profile?.avatar_url ?? null,
    };
  } catch {
    return null;
  }
});

export async function requireAdmin() {
  const headerStore = await headers();
  if (isLocalPreviewHostHeader(headerStore.get("host"))) {
    return PREVIEW_ADMIN_USER;
  }

  const user = await getUser();
  if (!user?.isAdmin) {
    redirect("/");
  }
  return user;
}
