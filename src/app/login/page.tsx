import type { Metadata } from "next";
import { headers } from "next/headers";
import { GoogleAuthCard } from "@/components/auth/GoogleAuthCard";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "로그인",
  description: `${SITE_NAME} 홈페이지 기능은 전부 무료입니다. Google 계정으로 로그인만 하면 해설·오답노트·북마크·PDF까지 결제 없이 이용할 수 있어요.`,
};

function isLocalPreviewHost(hostHeader: string | null): boolean {
  const host = (hostHeader ?? "").split(":")[0]?.toLowerCase();
  return host === "localhost" || host === "127.0.0.1";
}

export default async function LoginPage() {
  const headerStore = await headers();
  const previewLogin = isLocalPreviewHost(headerStore.get("host"));

  return <GoogleAuthCard mode="login" previewLogin={previewLogin} />;
}
