"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/illustrations/BrandLogo";
import { FeatureCard } from "@/components/ui/Card";
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
  const currentUsername = useRef("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkedUsername, setCheckedUsername] = useState<string | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckAvailability = async () => {
    const value = normalizeUsername(username);
    const validationError = validateUsername(value);
    setCheckedUsername(null);
    setAvailabilityMessage(null);
    setError(validationError);
    if (validationError) return;

    setChecking(true);
    try {
      const response = await fetch(
        `/api/profile/username?username=${encodeURIComponent(value)}`,
        { cache: "no-store" },
      );
      const result = (await response.json()) as {
        available?: boolean;
        error?: string;
      };
      if (response.status === 401) {
        router.replace("/login");
        return;
      }
      if (normalizeUsername(currentUsername.current) !== value) return;
      if (!response.ok) {
        setError(result.error ?? "중복 확인에 실패했습니다. 다시 시도해주세요.");
      } else if (!result.available) {
        setError("이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.");
      } else {
        setCheckedUsername(value);
        setAvailabilityMessage("사용할 수 있는 아이디입니다.");
      }
    } catch {
      if (normalizeUsername(currentUsername.current) === value) {
        setError("중복 확인에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const value = normalizeUsername(username);
    const validationError = validateUsername(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (checkedUsername !== value) {
      setError("아이디 중복 확인을 먼저 해주세요.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/profile/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: value }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        if (response.status === 401) router.replace("/login");
        if (response.status === 409) {
          setCheckedUsername(null);
          setAvailabilityMessage(null);
        }
        setError(
          result.error ?? "아이디 저장에 실패했습니다. 다시 시도해주세요.",
        );
        setLoading(false);
        return;
      }

      router.replace("/");
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
          <EyebrowLabel className="mb-2">
            공인중개사 수험생 커뮤니티
          </EyebrowLabel>
          <SectionHeading as="h1" className="text-heading-sm">
            아이디 만들기
          </SectionHeading>
          <p className="mt-3 font-display text-body-sm text-smoke">
            실명·이메일은 공개되지 않습니다. 수험생 커뮤니티·자료실에서는
            아이디로만 활동합니다.
          </p>
        </div>

        <FeatureCard tint="paper" className="border-[1.5px] border-carbon">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <Input
                  id="username"
                  label="아이디"
                  value={username}
                  onChange={(e) => {
                    currentUsername.current = e.target.value;
                    setUsername(e.target.value);
                    setCheckedUsername(null);
                    setAvailabilityMessage(null);
                    setError(null);
                  }}
                  required
                  minLength={USERNAME_MIN}
                  maxLength={USERNAME_MAX}
                  placeholder="예: gichul_runner"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={handleCheckAvailability}
                disabled={checking || loading || !username.trim()}
                className="h-12 shrink-0 rounded-xl border border-[#B9D8FB] bg-white px-4 font-display text-sm font-semibold text-[#007AFF] transition-colors hover:bg-[#F5FAFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checking ? "확인 중..." : "중복 확인"}
              </button>
            </div>
            <p className="font-display text-[12px] text-fog">
              {USERNAME_MIN}~{USERNAME_MAX}자 · 한글, 영문, 숫자, 밑줄(_)
            </p>

            <div aria-live="polite" className="min-h-5">
              {error && <p className="font-display text-sm text-[#C2413B]">{error}</p>}
              {availabilityMessage && (
                <p className="font-display text-sm font-medium text-[#007AFF]">
                  {availabilityMessage}
                </p>
              )}
            </div>

            <PrimaryButton
              type="submit"
              disabled={loading || checking || checkedUsername !== normalizeUsername(username)}
              className="w-full"
            >
              {loading ? "저장 중..." : "이 아이디로 시작하기"}
            </PrimaryButton>
          </form>
        </FeatureCard>
      </div>
    </div>
  );
}
