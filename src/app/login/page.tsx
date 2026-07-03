"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { FeatureCard, TintedAccentCard } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PrimaryButton, OutlineButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { CheckBadge } from "@/components/ui/Tag";
import { LogoMark } from "@/components/illustrations/LogoMark";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { nickname } },
        });
        setMessage(error ? error.message : "회원가입 완료! 이메일을 확인해주세요.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setMessage(error.message);
        } else {
          window.location.href = "/community";
          return;
        }
      }
    } catch {
      setMessage("Supabase 연결이 필요합니다. .env.local을 확인해주세요.");
    }

    setLoading(false);
  };

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
        <div className="hidden lg:block">
          <EyebrowLabel className="mb-3">봄기출 커뮤니티</EyebrowLabel>
          <SectionHeading as="h1" className="mb-4 text-heading-sm">
            수험생들과 함께 성장하세요
          </SectionHeading>
          <p className="mb-8 font-display text-body text-smoke">
            무료 가입 후 기출 풀이와 커뮤니티를 바로 이용할 수 있습니다.
          </p>
          <div className="space-y-4">
            <CheckBadge label="기출 풀이" value="무료" />
            <CheckBadge label="커뮤니티" value="4 카테고리" />
            <CheckBadge label="가입" value="무료" />
          </div>
        </div>

        <FeatureCard tint="paper" className="border border-mist/60">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <LogoMark />
            </div>
            <EyebrowLabel className="mb-2">
              {isSignUp ? "처음이신가요?" : "다시 오셨군요"}
            </EyebrowLabel>
            <SectionHeading as="h2" className="text-heading-sm">
              {isSignUp ? "회원가입" : "로그인"}
            </SectionHeading>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <Input
                id="nickname"
                label="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                placeholder="커뮤니티 닉네임"
              />
            )}
            <Input
              id="email"
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
            />
            <Input
              id="password"
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="6자 이상"
            />

            {message && (
              <TintedAccentCard className="!p-3">
                <p className="font-display text-body-sm text-ink">{message}</p>
              </TintedAccentCard>
            )}

            <PrimaryButton type="submit" disabled={loading} className="w-full">
              {loading ? "처리 중..." : isSignUp ? "회원가입" : "로그인"}
            </PrimaryButton>
          </form>

          <p className="mt-6 text-center font-display text-body-sm text-smoke">
            {isSignUp ? "이미 계정이 있으신가요?" : "아직 계정이 없으신가요?"}{" "}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
              className="font-medium text-electric-blue hover:underline"
            >
              {isSignUp ? "로그인" : "회원가입"}
            </button>
          </p>

          <div className="mt-6 text-center">
            <OutlineButton href="/">← 홈으로</OutlineButton>
          </div>
        </FeatureCard>
      </div>
    </div>
  );
}
