import Link from "next/link";
import { DIARY_MOODS, DIARY_MOOD_MAP } from "@/lib/constants";
import { formatKoreanDate } from "@/lib/exam";
import { ElevatedCard } from "@/components/ui/Card";
import type { StudyDiary } from "@/types/database";

interface DiaryHistoryProps {
  diaries: StudyDiary[];
  today: string;
}

function moodEmoji(mood: StudyDiary["mood"]) {
  if (!mood) return null;
  return DIARY_MOODS.find((m) => m.value === mood)?.emoji;
}

export function DiaryHistory({ diaries, today }: DiaryHistoryProps) {
  if (diaries.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 font-display text-subheading font-semibold text-ink">
        최근 일기
      </h2>
      <ElevatedCard className="divide-y divide-mist/40">
        {diaries.map((diary) => {
          const isToday = diary.diary_date === today;
          const preview =
            diary.content.length > 120
              ? `${diary.content.slice(0, 120)}…`
              : diary.content;

          return (
            <article key={diary.id} className="px-5 py-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <time className="font-display text-body-sm font-medium text-ink">
                  {formatKoreanDate(diary.diary_date)}
                </time>
                {isToday && (
                  <span className="rounded-[var(--radius-tags)] bg-ice/50 px-2 py-0.5 font-display text-[11px] font-medium text-electric-blue">
                    오늘
                  </span>
                )}
                {diary.mood && (
                  <span className="font-display text-body-sm text-smoke">
                    {moodEmoji(diary.mood)} {DIARY_MOOD_MAP[diary.mood]}
                  </span>
                )}
                {diary.study_minutes > 0 && (
                  <span className="font-display text-body-sm text-fog">
                    · {(diary.study_minutes / 60).toFixed(1)}시간
                  </span>
                )}
              </div>
              <p className="whitespace-pre-wrap font-display text-body-sm leading-relaxed text-smoke">
                {preview}
              </p>
            </article>
          );
        })}
      </ElevatedCard>
      <p className="mt-4 text-center">
        <Link href="/profile" className="font-display text-body-sm text-fog hover:text-ink">
          프로필에서 더 보기 →
        </Link>
      </p>
    </div>
  );
}
