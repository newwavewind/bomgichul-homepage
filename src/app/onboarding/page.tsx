"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/illustrations/BrandLogo";
import { FeatureCard, TintedAccentCard } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import {
  normalizeUsername,
  validateUsername,
  USERNAME_MAX,
  USERNAME_MIN,
} from "@/lib/username";

export default function OnboardingPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const value = normalizeUsername(username);
    const validationError = validateUsername(value);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          nickname: value,
          username_set: true,
          avatar_url: null,
        })
        .eq("id", user.id);

      if (updateError) {
        if (updateError.code === "23505") {
          setError("이미 사용 중인 아이디입니다.");
        } else {
          setError(updateError.message);
        }
        setLoading(false);
        return;
      }

      router.replace("/community");
      router.refresh();
    } catch {
      setError("아이디 저장에 실패했습니다. 다시 시도해주세요.");
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <BrandLogo size="md" />
          </div>
          <EyebrowLabel className="mb-2">공인중개사 커뮤니티</EyebrowLabel>
          <SectionHeading as="h1" className="text-heading-sm">
            아이디 만들기
          </SectionHeading>
          <p className="mt-3 font-display text-body-sm text-smoke">
            실명·이메일은 공개되지 않습니다. 공인중개사 커뮤니티·수험일기·자료실에서는
            아이디로만 활동합니다.
          </p>
        </div>

        <FeatureCard tint="paper" className="border-[1.5px] border-carbon">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="username"
              label="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={USERNAME_MIN}
              maxLength={USERNAME_MAX}
              placeholder="예: gichul_runner"
              autoComplete="off"
              autoFocus
            />
            <p className="font-display text-[12px] text-fog">
              {USERNAME_MIN}~{USERNAME_MAX}자 · 한글, 영문, 숫자, 밑줄(_)
            </p>

            {error && (
              <TintedAccentCard className="!p-3">
                <p className="font-display text-body-sm text-ink">{error}</p>
              </TintedAccentCard>
            )}

            <PrimaryButton type="submit" disabled={loading} className="w-full">
              {loading ? "저장 중..." : "이 아이디로 시작하기"}
            </PrimaryButton>
          </form>
        </FeatureCard>
      </div>
    </div>
  );
}
