"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FeatureCard, TintedAccentCard } from "@/components/ui/Card";
import { PrimaryButton, OutlineButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { BrandLockup } from "@/components/ui/BrandLockup";
import { CheckBadge } from "@/components/ui/Tag";
import { LogoMark } from "@/components/illustrations/LogoMark";
import { SITE_PLATFORM, SITE_TAGLINE } from "@/lib/constants";

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

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "auth") {
      setMessage("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") ?? "/community";
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
      }
    } catch {
      setMessage("Supabase 연결이 필요합니다. .env.local을 확인해주세요.");
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
        <div className="hidden lg:block">
          <BrandLockup variant="section" className="mb-6" />
          <SectionHeading as="h1" className="mb-4 text-heading-sm">
            수험생들과 함께 성장하세요
          </SectionHeading>
          <p className="mb-8 font-display text-body text-smoke">
            Google 계정으로 바로 로그인하고, {SITE_PLATFORM}과 커뮤니티를
            이용하세요.
          </p>
          <div className="space-y-4">
            <CheckBadge label="AI 질문" value="자동 작성" />
            <CheckBadge label="커뮤니티" value="4 카테고리" />
            <CheckBadge label="가입" value="무료" />
          </div>
        </div>

        <FeatureCard tint="paper" className="border border-mist/60">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <LogoMark />
            </div>
            <EyebrowLabel className="mb-2">{SITE_PLATFORM}</EyebrowLabel>
            <SectionHeading as="h2" className="text-heading-sm">
              로그인
            </SectionHeading>
            <p className="mt-3 font-display text-body-sm text-smoke">
              {SITE_TAGLINE}
              <br />
              Google 계정으로 간편하게 시작하세요.
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
