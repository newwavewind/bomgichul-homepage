import { getUser } from "@/lib/auth";
import {
  getTodayDiary,
  getDiariesByDDay,
  groupDiariesByExamYear,
} from "@/lib/diary";
import {
  getExamCountdown,
  getKSTDateString,
  formatKoreanDate,
  formatDDay,
  clampDDay,
} from "@/lib/exam";
import { DDayPanel } from "@/components/diary/DDayPanel";
import { DDayNavigator } from "@/components/diary/DDayNavigator";
import { PublicDiaryFeed } from "@/components/diary/PublicDiaryFeed";
import { TodayDiaryForm, DiaryLoginPrompt } from "@/components/diary/TodayDiaryForm";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";

interface DiaryPageProps {
  searchParams: Promise<{ d?: string }>;
}

export default async function DiaryPage({ searchParams }: DiaryPageProps) {
  const params = await searchParams;
  const user = await getUser();
  const today = getKSTDateString();
  const todayLabel = formatKoreanDate(today);
  const { days: todayDDay } = getExamCountdown(today);

  const requested = params.d != null ? Number(params.d) : todayDDay;
  const selectedDDay = clampDDay(
    Number.isFinite(requested) ? Math.trunc(requested) : todayDDay
  );

  const todayDiary = user ? await getTodayDiary(user.id) : null;
  const diaries = await getDiariesByDDay(selectedDDay);
  const yearGroups = groupDiariesByExamYear(diaries);
  const isTodayDDay = selectedDDay === todayDDay;

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <EyebrowLabel className="mb-2">공인중개사 공개 수험 기록</EyebrowLabel>
          <SectionHeading as="h1">수험일기</SectionHeading>
          <p className="mt-2 font-display text-body-sm text-smoke">
            공인중개사 시험까지 남은 날(D-day) 기준으로 모두의 일기가 쌓입니다.
            좌우로 넘기며 {formatDDay(300)}·{formatDDay(30)} 때 사람들이 어떤
            마음을 남겼는지, 작년과 올해를 같은 화면에서 비교해 보세요.
          </p>
        </div>

        <div className="mb-6">
          <DDayPanel />
        </div>

        <div className="mb-8">
          <DDayNavigator days={selectedDDay} entryCount={diaries.length} />
        </div>

        {isTodayDDay && (
          <div className="mb-10">
            {user ? (
              <TodayDiaryForm todayDiary={todayDiary} todayLabel={todayLabel} />
            ) : (
              <DiaryLoginPrompt />
            )}
          </div>
        )}

        {!isTodayDDay && user && (
          <p className="mb-6 rounded-[var(--radius-cards)] border border-mist bg-snow px-4 py-3 font-display text-body-sm text-smoke">
            오늘은 {formatDDay(todayDDay)}입니다. 일기는 오늘 날짜로만 작성할 수
            있어요.{" "}
            <a href="/diary" className="font-medium text-electric-blue hover:underline">
              오늘로 이동
            </a>
          </p>
        )}

        <PublicDiaryFeed days={selectedDDay} groups={yearGroups} />
      </div>
    </div>
  );
}
