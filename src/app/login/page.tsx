"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FeatureCard, TintedAccentCard } from "@/components/ui/Card";
import { PrimaryButton, OutlineButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { SITE_IDENTITY, SITE_PLATFORM, SITE_TAGLINE } from "@/lib/constants";

function GoogleIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function readAuthNext(): string {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("next");
  if (fromQuery?.startsWith("/") && !fromQuery.startsWith("//")) {
    return fromQuery;
  }

  const match = document.cookie.match(/(?:^|;\s*)auth_next=([^;]+)/);
  if (match?.[1]) {
    try {
      const value = decodeURIComponent(match[1]);
      if (value.startsWith("/") && !value.startsWith("//")) return value;
    } catch {
      // ignore
    }
  }

  return "/community";
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "auth") {
      const detail = params.get("message");
      const nextMessage = detail
        ? decodeURIComponent(detail)
        : "로그인에 실패했습니다. 다시 시도해주세요.";
      // setState를 effect 본문에서 동기 호출하지 않도록 지연 실행합니다.
      window.setTimeout(() => setMessage(nextMessage), 0);
    }
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const next = readAuthNext();

      // redirectTo에는 query를 붙이지 않습니다.
      // Allow list 매칭 실패·authorize URL 파싱 오류를 막기 위함입니다.
      // next 경로는 쿠키로 전달하고 callback에서 읽습니다.
      document.cookie = `auth_next=${encodeURIComponent(next)}; path=/; max-age=600; samesite=lax`;

      const redirectTo = `${window.location.origin}/auth/callback`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      // 브라우저 리다이렉트가 막힌 경우 수동 이동
      if (data?.url) {
        window.location.assign(data.url);
        return;
      }

      setMessage(
        "Google 로그인 URL을 받지 못했습니다. Supabase Google Provider 설정을 확인해주세요."
      );
      setLoading(false);
    } catch (err) {
      // 이전에는 모든 예외를 env 메시지로 덮어 실제 원인을 가렸습니다.
      const detail =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setMessage(detail);
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-md">
        <FeatureCard tint="paper" className="border border-mist/60">
          <div className="mb-8 text-center">
            <EyebrowLabel className="mb-2">{SITE_IDENTITY}</EyebrowLabel>
            <SectionHeading as="h1" className="text-heading-sm">
              로그인
            </SectionHeading>
            <p className="mt-3 font-display text-body-sm text-smoke">
              {SITE_PLATFORM}
              <br />
              {SITE_TAGLINE}
            </p>
          </div>

          {message && (
            <TintedAccentCard className="mb-5 !p-3">
              <p className="font-display text-body-sm text-ink">{message}</p>
            </TintedAccentCard>
          )}

          <PrimaryButton
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full !bg-paper !text-ink border border-mist/80 hover:!bg-snow"
          >
            <GoogleIcon />
            {loading ? "이동 중..." : "Google로 계속하기"}
          </PrimaryButton>

          <div className="mt-8 text-center">
            <OutlineButton href="/">← 홈으로</OutlineButton>
          </div>
        </FeatureCard>
      </div>
    </div>
  );
}
