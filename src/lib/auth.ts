import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function getUser() {
  if (!isSupabaseConfigured()) return null;

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
    avatar_url: null as string | null,
  };
}

export async function requireAdmin() {
  const user = await getUser();
  if (!user?.isAdmin) {
    redirect("/");
  }
  return user;
}
