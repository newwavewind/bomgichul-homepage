import type { NextRequest } from "next/server";

function hostIsLocal(hostHeader: string | null | undefined): boolean {
  const host = (hostHeader ?? "").split(":")[0]?.toLowerCase();
  return host === "localhost" || host === "127.0.0.1";
}

/** Cursor 미리보기·로컬 피드백용. Vercel/실서비스 호스트에서는 절대 열리지 않음. */
export function allowPreviewLogin(request: NextRequest): boolean {
  if (process.env.VERCEL) return false;
  return hostIsLocal(request.headers.get("host"));
}

/** 로컬에서 관리자 UI를 로그인 없이 열어 피드백할 때 */
export function allowOpenAdminWithoutAuth(request: NextRequest): boolean {
  return allowPreviewLogin(request);
}

export function isLocalPreviewHostHeader(hostHeader: string | null | undefined): boolean {
  if (process.env.VERCEL) return false;
  return hostIsLocal(hostHeader);
}

export function isBrowserPreviewHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

export const PREVIEW_ADMIN_USER = {
  id: "preview-admin",
  email: "preview@localhost",
  nickname: "미리보기 관리자",
  usernameSet: true,
  isAdmin: true as const,
  avatar_url: null as string | null,
};
