"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/Button";
import {
  normalizeUsername,
  validateUsername,
  USERNAME_MAX,
  USERNAME_MIN,
} from "@/lib/username";

interface UsernameFormProps {
  currentUsername: string;
}

export function UsernameForm({ currentUsername }: UsernameFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(currentUsername);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    const value = normalizeUsername(username);
    const validationError = validateUsername(value);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    if (value === currentUsername) {
      setError("현재 아이디와 같습니다.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("로그인이 필요합니다.");
        setLoading(false);
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

      setSaved(true);
      router.refresh();
    } catch {
      setError("변경에 실패했습니다.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t border-mist pt-6">
      <Input
        id="profile-username"
        label="아이디 변경"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        minLength={USERNAME_MIN}
        maxLength={USERNAME_MAX}
        autoComplete="off"
      />
      <p className="font-display text-[12px] text-fog">
        실명은 사용할 수 없습니다. 아이디만 커뮤니티에 표시됩니다.
      </p>
      {error && <p className="font-display text-body-sm text-coral">{error}</p>}
      {saved && (
        <p className="font-display text-body-sm text-electric-blue">
          아이디가 변경됐어요.
        </p>
      )}
      <PrimaryButton type="submit" disabled={loading} size="sm">
        {loading ? "저장 중..." : "아이디 저장"}
      </PrimaryButton>
    </form>
  );
}
