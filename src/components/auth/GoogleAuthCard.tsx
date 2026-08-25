"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FeatureCard, TintedAccentCard } from "@/components/ui/Card";
import { PrimaryButton, OutlineButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { SITE_IDENTITY } from "@/lib/constants";

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

function readAuthNext(defaultNext: string) {
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

  return defaultNext;
}

const PREVIEW_EMAIL_KEY = "bomgichul_preview_login_email";

const buttonClassName = `
    inline-flex w-full items-center justify-center gap-2
    rounded-[var(--radius-buttons)] border border-mist/80
    bg-paper px-7 py-2.5 font-display text-body-sm font-medium text-ink
    shadow-[var(--shadow-button)]
    transition-colors hover:bg-snow
    disabled:cursor-not-allowed disabled:opacity-50
  `;

export function GoogleAuthCard({
  mode,
  previewLogin = false,
}: {
  mode: "login" | "signup";
  /** 서버가 host 로 판별 — JS/HMR 이 죽어도 미리보기 폼이 보이게 */
  previewLogin?: boolean;
}) {
  const isSignup = mode === "signup";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [previewEmail, setPreviewEmail] = useState("");
  const [nextPath, setNextPath] = useState(isSignup ? "/onboarding" : "/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "auth") {
      const detail = params.get("message");
      const nextMessage = detail
        ? decodeURIComponent(detail)
        : isSignup
          ? "회원가입에 실패했습니다. 다시 시도해주세요."
          : "로그인에 실패했습니다. 다시 시도해주세요.";
      window.setTimeout(() => setMessage(nextMessage), 0);
    }

    setNextPath(readAuthNext(isSignup ? "/onboarding" : "/"));

    if (previewLogin) {
      try {
        const saved = window.localStorage.getItem(PREVIEW_EMAIL_KEY);
        if (saved) setPreviewEmail(saved);
      } catch {
        // ignore
      }
    }
  }, [isSignup, previewLogin]);

  const handleGoogleAuth = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const next = readAuthNext(isSignup ? "/onboarding" : "/");

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

      if (data?.url) {
        window.location.assign(data.url);
        return;
      }

      setMessage(
        "Google 로그인 URL을 받지 못했습니다. Supabase Google Provider 설정을 확인해주세요."
      );
      setLoading(false);
    } catch (err) {
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
              Google로 시작하기
            </SectionHeading>
            <p className="mt-3 font-display text-body-sm text-smoke">
              처음이면 무료 계정이 만들어지고, 기존 회원이면 저장한 학습에서 바로 이어져요.
            </p>
          </div>

          <ul className="mb-6 grid gap-2 rounded-2xl bg-surface p-4 font-display text-body-sm text-ink">
            <li>✓ 오답·북마크를 자동으로 모아 복습</li>
            <li>✓ 최근 푼 문제와 과목을 기기마다 이어서 학습</li>
            <li>✓ 정답률과 연속 학습일로 공부 흐름 확인</li>
            <li>✓ Google 계정만으로 비밀번호 없이 안전하게 시작</li>
          </ul>

          {message && (
            <TintedAccentCard className="mb-5 !p-3">
              <p className="font-display text-body-sm text-ink">{message}</p>
            </TintedAccentCard>
          )}

          {previewLogin ? (
            <form
              action="/api/dev/preview-login"
              method="post"
              className="space-y-3"
              onSubmit={() => {
                try {
                  if (previewEmail) {
                    window.localStorage.setItem(PREVIEW_EMAIL_KEY, previewEmail);
                  }
                } catch {
                  // ignore
                }
              }}
            >
              <div className="rounded-2xl border border-dashed border-carbon/40 bg-surface/80 p-4">
                <p className="font-display text-[12px] font-semibold text-ink">
                  Cursor 미리보기용 로그인
                </p>
                <p className="mt-1 font-display text-[12px] leading-relaxed text-smoke">
                  미리보기에서는 Google 창이 막혀요. 평소 쓰는 Google 이메일을 넣고 아래
                  버튼을 누르면 바로 로그인됩니다.
                </p>
                <label className="mt-3 block">
                  <span className="sr-only">미리보기 로그인 이메일</span>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="username"
                    value={previewEmail}
                    onChange={(e) => setPreviewEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    className="w-full rounded-full border border-mist bg-paper px-4 py-2.5 font-display text-body-sm text-ink outline-none focus:border-carbon"
                  />
                </label>
                <input type="hidden" name="next" value={nextPath} />
              </div>
              <button type="submit" className={buttonClassName}>
                <GoogleIcon />
                미리보기로 로그인
              </button>
            </form>
          ) : (
            <PrimaryButton
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full !bg-paper !text-ink border border-mist/80 hover:!bg-snow"
            >
              <GoogleIcon />
              {loading ? "Google로 이동 중..." : "Google로 시작하기"}
            </PrimaryButton>
          )}

          <p className="mt-5 text-center font-display text-[12px] leading-relaxed text-smoke">
            {previewLogin
              ? "배포 사이트에서는 일반 Google 로그인이 그대로 쓰입니다."
              : "가입과 로그인은 같은 버튼을 사용해요. Google 계정 선택 후 자동으로 구분됩니다."}
          </p>

          <div className="mt-6 text-center">
            <OutlineButton href="/">← 홈으로</OutlineButton>
          </div>
        </FeatureCard>
      </div>
    </div>
  );
}
