import { DIARY_MOODS, DIARY_MOOD_MAP } from "@/lib/constants";
import { formatDDay, formatKoreanDate } from "@/lib/exam";
import { ElevatedCard } from "@/components/ui/Card";
import type { DiaryYearGroup } from "@/lib/diary";
import type { StudyDiary } from "@/types/database";
import { OceanRankBadge } from "@/components/ranks/OceanRankBadge";
import type { UserActivityScore } from "@/lib/activity";

interface PublicDiaryFeedProps {
  days: number;
  groups: DiaryYearGroup[];
  authorActivity: Record<string, UserActivityScore>;
}

function moodEmoji(mood: StudyDiary["mood"]) {
  if (!mood) return null;
  return DIARY_MOODS.find((m) => m.value === mood)?.emoji;
}

export function PublicDiaryFeed({ days, groups, authorActivity }: PublicDiaryFeedProps) {
  if (groups.length === 0) {
    return (
      <ElevatedCard className="px-5 py-10 text-center">
        <p className="font-display text-body font-medium text-ink">
          {formatDDay(days)}에 쓴 공개 일기가 아직 없습니다
        </p>
        <p className="mt-2 font-display text-body-sm text-smoke">
          매년 같은 D-day 기록이 여기에 쌓입니다. 오늘의 일기를 남기면
          내년·후년 수험생도 볼 수 있어요.
        </p>
      </ElevatedCard>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-subheading font-semibold text-ink">
          {formatDDay(days)} 공개 일기
        </h2>
        <p className="mt-1 font-display text-body-sm text-smoke">
          같은 D-day에 쓴 기록을 연도별로 모아 보여줍니다. 작년·재작년과
          오늘의 마음을 비교해 보세요.
        </p>
      </div>

      {groups.map((group) => (
        <section key={group.examYear}>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="font-display text-body font-semibold text-ink">
              {group.examYear}년 시험
            </h3>
            <span className="font-display text-body-sm text-fog">
              {group.diaries.length}명
            </span>
          </div>
          <ElevatedCard className="divide-y divide-mist">
            {group.diaries.map((diary) => (
              <article key={diary.id} className="px-5 py-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-display text-body-sm font-semibold text-ink">
                    {diary.profiles?.nickname ?? "익명"}
                  </span>
                  {authorActivity[diary.author_id] && (
                    <OceanRankBadge rank={authorActivity[diary.author_id].rank} />
                  )}
                  <time className="font-display text-[12px] text-fog">
                    {formatKoreanDate(diary.diary_date)}
                  </time>
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
                  {diary.content}
                </p>
              </article>
            ))}
          </ElevatedCard>
        </section>
      ))}
    </div>
  );
}
