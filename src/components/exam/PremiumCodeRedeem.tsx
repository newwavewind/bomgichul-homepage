"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { trackEvent } from "@/lib/analytics";
import { subjectFromProductType } from "@/lib/premium-subjects";
import { PrimaryButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ARCHIVE_SUBJECT_MAP } from "@/lib/constants";
import type { ExamSubject } from "@/lib/exam-questions";

interface PremiumCodeRedeemProps {
  subject: ExamSubject;
  userId: string | null;
  unlocked: boolean;
}

interface RegisterPcAccessCodeResult {
  ok: boolean;
  product_type: string;
  email?: string | null;
}

export function PremiumCodeRedeem({ subject, userId, unlocked }: PremiumCodeRedeemProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlockedSubjectLabel, setUnlockedSubjectLabel] = useState<string | null>(null);

  const label = ARCHIVE_SUBJECT_MAP[subject];

  if (unlocked) {
    return (
      <div className="rounded-[var(--radius-cards)] border border-carbon bg-ice/50 px-5 py-4">
        <p className="font-display text-body-sm font-semibold text-ink">
          ✅ {label} 프리미엄이 해제되어 있어요. 전체 연도의 해설을 볼 수 있어요.
        </p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="rounded-[var(--radius-cards)] border border-dashed border-mist bg-surface px-5 py-4">
        <p className="font-display text-body-sm text-smoke">
          모바일 앱에서 {label} 프리미엄을 구매하셨나요? 로그인하면 발급받은 PC 학습 코드를 이 홈페이지에서 등록해 전체 해설을 볼 수 있어요.
        </p>
        <div className="mt-3">
          <Link
            href={`/login?next=/exam/${subject}`}
            className="font-display text-body-sm font-medium text-[#6366f1] hover:underline"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Supabase 연결이 필요합니다.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("register_pc_access_code", {
      p_code: trimmed,
    });

    if (rpcError) {
      setError(rpcError.message || "코드 등록에 실패했어요. 잠시 후 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    const result = data as RegisterPcAccessCodeResult;
    const unlockedSubject = subjectFromProductType(result.product_type);
    trackEvent("premium_code_redeem", { subject: unlockedSubject ?? result.product_type });
    setUnlockedSubjectLabel(
      unlockedSubject ? ARCHIVE_SUBJECT_MAP[unlockedSubject] : result.product_type
    );
    setCode("");
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="rounded-[var(--radius-cards)] border border-carbon bg-paper px-5 py-4">
      <p className="font-display text-body-sm font-semibold text-ink">
        모바일 앱에서 구매한 PC 학습 코드가 있으신가요?
      </p>
      <p className="mt-1 font-display text-body-sm text-smoke">
        Google Play·App Store에서 과목을 구매하면 발급되는 PC 학습 코드를 입력하면, 이 홈페이지와 PC앱에서 그 과목의 전체 연도 해설을 볼 수 있어요. 코드는 구매한 과목에만 적용돼요.
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-wrap items-end gap-3">
        <div className="w-48">
          <Input
            id={`premium-code-${subject}`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="예: BOM-XXXX-XXXX"
            disabled={loading}
          />
        </div>
        <PrimaryButton type="submit" size="sm" disabled={loading || !code.trim()}>
          {loading ? "확인 중..." : "코드 등록"}
        </PrimaryButton>
      </form>
      {error && <p className="mt-2 font-display text-body-sm text-coral">{error}</p>}
      {unlockedSubjectLabel && (
        <p className="mt-2 font-display text-body-sm text-[#6366f1]">
          {unlockedSubjectLabel} 프리미엄이 해제됐어요!
        </p>
      )}
    </div>
  );
}
