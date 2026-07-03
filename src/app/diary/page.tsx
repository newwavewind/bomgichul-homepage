import { getUser } from "@/lib/auth";
import { getTodayDiary, getRecentDiaries } from "@/lib/diary";
import { getKSTDateString, formatKoreanDate } from "@/lib/exam";
import { DDayPanel } from "@/components/diary/DDayPanel";
import { TodayDiaryForm, DiaryLoginPrompt } from "@/components/diary/TodayDiaryForm";
import { DiaryHistory } from "@/components/diary/DiaryHistory";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";

export default async function DiaryPage() {
  const user = await getUser();
  const today = getKSTDateString();
  const todayLabel = formatKoreanDate(today);

  const todayDiary = user ? await getTodayDiary(user.id) : null;
  const recentDiaries = user ? await getRecentDiaries(user.id) : [];

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <EyebrowLabel className="mb-2">매일의 수험 기록</EyebrowLabel>
          <SectionHeading as="h1">수험일기</SectionHeading>
          <p className="mt-2 font-display text-body-sm text-smoke">
            공인중개사 시험까지 남은 날을 확인하고, 오늘의 공부를 기록하세요.
          </p>
        </div>

        <div className="mb-8">
          <DDayPanel />
        </div>

        <div className="mb-10">
          {user ? (
            <TodayDiaryForm todayDiary={todayDiary} todayLabel={todayLabel} />
          ) : (
            <DiaryLoginPrompt />
          )}
        </div>

        {user && recentDiaries.length > 0 && (
          <DiaryHistory diaries={recentDiaries} today={today} />
        )}
      </div>
    </div>
  );
}
