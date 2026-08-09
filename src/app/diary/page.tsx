import type { Metadata } from "next";
import { getUser } from "@/lib/auth";
import {
  getTodayDiary,
  getDiariesByDDay,
  getUserDiaryStreak,
  groupDiariesByExamYear,
} from "@/lib/diary";
import {
  getExamCountdownForScope,
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
import { buildPageMetadata } from "@/lib/seo";
import { getUserActivityScores } from "@/lib/activity";
import {
  communityScopeLabel,
  diaryBaseHref,
  diaryEyebrow,
  diaryTitle,
} from "@/lib/exam-track/community";
import type { CommunityScope } from "@/types/database";

interface DiaryPageProps {
  searchParams: Promise<{ d?: string }>;
}

export async function generateMetadata({
  searchParams,
}: DiaryPageProps): Promise<Metadata> {
  const params = await searchParams;
  const today = getKSTDateString();
  const { days: todayDDay } = getExamCountdownForScope("real_estate", today);
  const requested = params.d != null ? Number(params.d) : todayDDay;
  const selectedDDay = clampDDay(
    Number.isFinite(requested) ? Math.trunc(requested) : todayDDay,
  );

  const title =
    selectedDDay === todayDDay
      ? diaryTitle("real_estate")
      : `D-${selectedDDay} 수험일기`;

  return buildPageMetadata({
    title,
    description: `${communityScopeLabel("real_estate")} 시험 D-day 기준으로 수험생들의 공개 일기를 읽고 오늘의 공부 기록을 남겨보세요.`,
    path: "/diary",
    noIndex: selectedDDay !== todayDDay,
  });
}

export async function DiaryBoard({
  searchParams,
  scope = "real_estate",
}: DiaryPageProps & { scope?: CommunityScope }) {
  const params = await searchParams;
  const user = await getUser();
  const today = getKSTDateString();
  const todayLabel = formatKoreanDate(today);
  const { days: todayDDay } = getExamCountdownForScope(scope, today);
  const baseHref = diaryBaseHref(scope);
  const label = communityScopeLabel(scope);

  const requested = params.d != null ? Number(params.d) : todayDDay;
  const selectedDDay = clampDDay(
    Number.isFinite(requested) ? Math.trunc(requested) : todayDDay,
  );

  const todayDiary = user ? await getTodayDiary(user.id, scope) : null;
  const streak = user ? await getUserDiaryStreak(user.id, scope) : 0;
  const diaries = await getDiariesByDDay(selectedDDay, scope);
  const yearGroups = groupDiariesByExamYear(diaries);
  const authorActivity = await getUserActivityScores(
    diaries.map((diary) => diary.author_id),
  );
  const isTodayDDay = selectedDDay === todayDDay;

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <EyebrowLabel className="mb-2">{diaryEyebrow(scope)}</EyebrowLabel>
          <SectionHeading as="h1">수험일기</SectionHeading>
          <p className="mt-2 font-display text-body-sm text-smoke">
            {label} 시험까지 남은 날(D-day) 기준으로 모두의 일기가 쌓입니다.
            좌우로 넘기며 {formatDDay(300)}·{formatDDay(30)} 때 사람들이 어떤
            마음을 남겼는지, 작년과 올해를 같은 화면에서 비교해 보세요.
          </p>
        </div>

        <div className="mb-6">
          <DDayPanel scope={scope} />
        </div>

        <div className="mb-8">
          <DDayNavigator
            days={selectedDDay}
            entryCount={diaries.length}
            baseHref={baseHref}
          />
        </div>

        {isTodayDDay && (
          <div className="mb-10">
            {user ? (
              <TodayDiaryForm
                todayDiary={todayDiary}
                todayLabel={todayLabel}
                streak={streak}
                scope={scope}
              />
            ) : (
              <DiaryLoginPrompt loginNext={baseHref} />
            )}
          </div>
        )}

        {!isTodayDDay && user && (
          <p className="mb-6 rounded-[var(--radius-cards)] border border-mist bg-snow px-4 py-3 font-display text-body-sm text-smoke">
            오늘은 {formatDDay(todayDDay)}입니다. 일기는 오늘 날짜로만 작성할 수
            있어요.{" "}
            <a href={baseHref} className="font-medium text-electric-blue hover:underline">
              오늘로 이동
            </a>
          </p>
        )}

        <PublicDiaryFeed
          days={selectedDDay}
          groups={yearGroups}
          authorActivity={authorActivity}
        />
      </div>
    </div>
  );
}

export default async function DiaryPage(props: DiaryPageProps) {
  return <DiaryBoard {...props} scope="real_estate" />;
}
