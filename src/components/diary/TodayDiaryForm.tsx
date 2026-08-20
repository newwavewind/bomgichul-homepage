"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getExamCountdownForScope, getKSTDateString } from "@/lib/exam";
import { DIARY_MOODS } from "@/lib/constants";
import { FeatureCard } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/Button";
import type { CommunityScope, DiaryMood, StudyDiary } from "@/types/database";

interface TodayDiaryFormProps {
  todayDiary: StudyDiary | null;
  todayLabel: string;
  streak?: number;
  scope?: CommunityScope;
}

export function TodayDiaryForm({
  todayDiary,
  todayLabel,
  streak = 0,
  scope = "real_estate",
}: TodayDiaryFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(todayDiary?.content ?? "");
  const [mood, setMood] = useState<DiaryMood | null>(
    (todayDiary?.mood as DiaryMood) ?? null
  );
  const [studyHours, setStudyHours] = useState(
    todayDiary?.study_minutes ? String(todayDiary.study_minutes / 60) : ""
  );
  const [isPublic, setIsPublic] = useState(todayDiary?.is_public ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    if (!isSupabaseConfigured()) {
      setError("Supabase 연결이 필요합니다.");
      setLoading(false);
      return;
    }

    const trimmed = content.trim();
    if (!trimmed) {
      setError("오늘의 기록을 적어주세요.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const studyMinutes = studyHours
        ? Math.round(parseFloat(studyHours) * 60)
        : 0;

      const diaryDate = getKSTDateString();
      const { days: daysUntilExam } = getExamCountdownForScope(scope, diaryDate);

      const { error: upsertError } = await supabase.from("study_diaries").upsert(
        {
          author_id: user.id,
          diary_date: diaryDate,
          days_until_exam: daysUntilExam,
          community_scope: scope,
          content: trimmed,
          mood,
          study_minutes: Number.isFinite(studyMinutes) ? studyMinutes : 0,
          is_public: isPublic,
        },
        { onConflict: "author_id,diary_date,community_scope" },
      );

      if (upsertError) {
        setError(upsertError.message);
      } else {
        setSaved(true);
        router.refresh();
      }
    } catch {
      setError("저장에 실패했습니다.");
    }

    setLoading(false);
  };

  return (
    <FeatureCard tint="paper">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-subheading font-semibold text-ink">
            오늘의 일기 ({isPublic ? "공개" : "비공개"})
          </h2>
          <p className="mt-0.5 font-display text-body-sm text-smoke">
            {todayLabel} ·{" "}
            {isPublic ? "같은 D-day에 모두 공개됩니다" : "나만 볼 수 있어요"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {streak > 0 && (
            <span className="rounded-[var(--radius-tags)] bg-midnight px-3 py-1 font-display text-[12px] font-medium text-paper">
              🔥 {streak}일 연속
            </span>
          )}
          {todayDiary && (
            <span className="rounded-[var(--radius-tags)] bg-ice/50 px-3 py-1 font-display text-[12px] font-medium text-electric-blue">
              작성됨
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-3 block font-display text-body-sm font-medium text-ink">
            오늘 기분
          </label>
          <div className="flex flex-wrap gap-2">
            {DIARY_MOODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(mood === m.value ? null : m.value)}
                className={`min-h-11 rounded-[var(--radius-tags)] px-3 font-display text-body-sm font-medium transition-colors ${
                  mood === m.value
                    ? "bg-midnight text-paper"
                    : "bg-surface text-ink hover:bg-snow"
                }`}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          id="study-hours"
          label="오늘 공부 시간 (선택)"
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={studyHours}
          onChange={(e) => setStudyHours(e.target.value)}
          placeholder="예: 3.5"
        />

        <Textarea
          id="diary-content"
          label="오늘의 기록"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={8}
          placeholder="오늘 공부한 내용, 느낀 점, 내일 할 일 등을 자유롭게 적어보세요"
        />

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 accent-[#6366f1]"
          />
          <span className="font-display text-body-sm text-ink">
            같은 D-day 공개 피드에 표시 (끄면 나만 볼 수 있어요)
          </span>
        </label>

        {error && <p className="font-display text-body-sm text-coral">{error}</p>}
        {saved && (
          <p className="font-display text-body-sm text-electric-blue">
            {isPublic ? "오늘 일기가 공개 피드에 저장됐어요!" : "오늘 일기가 비공개로 저장됐어요!"}
          </p>
        )}

        <div className="flex justify-end">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "저장 중..." : todayDiary ? "수정하기" : "저장하기"}
          </PrimaryButton>
        </div>
      </form>
    </FeatureCard>
  );
}

export function DiaryLoginPrompt({
  loginNext = "/diary",
}: {
  loginNext?: string;
}) {
  return (
    <FeatureCard tint="ice" className="text-center">
      <p className="mb-2 font-display text-subheading font-semibold text-ink">
        로그인하고 오늘 일기를 써보세요
      </p>
      <p className="mb-6 font-display text-body-sm text-smoke">
        오늘 쓴 일기는 같은 D-day에 공개됩니다. 내년·후년 수험생도 볼 수 있어요.
      </p>
      <PrimaryButton href={`/login?next=${encodeURIComponent(loginNext)}`}>
        로그인하기
      </PrimaryButton>
    </FeatureCard>
  );
}
