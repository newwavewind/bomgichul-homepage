import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { getPosts } from "@/lib/posts";
import { getBookmarksForUser } from "@/lib/bookmarks";
import { getWrongQuestionsForUser } from "@/lib/attempts";
import { getExamQuestion, type ExamSubject } from "@/lib/exam-questions";
import { getPremiumBadgeForUser } from "@/lib/badges";
import { getUnlockedSubjects } from "@/lib/premium";
import { getAttemptsForSubject, buildSubjectStudyStats } from "@/lib/study-analytics";
import { PostCard } from "@/components/board/PostCard";
import { UsernameForm } from "@/components/profile/UsernameForm";
import { StudyAnalyticsPanel } from "@/components/profile/StudyAnalyticsPanel";
import { PrimaryButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ElevatedCard, FeatureCard } from "@/components/ui/Card";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { ARCHIVE_SUBJECT_MAP, EXAM_SUBJECTS } from "@/lib/constants";
import { getUserActivityScores } from "@/lib/activity";
import { OCEAN_RANKS } from "@/lib/ocean-ranks";
import { OceanRankBadge } from "@/components/ranks/OceanRankBadge";

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.usernameSet) {
    redirect("/onboarding");
  }

  const { data: myPosts } = await getPosts({ authorId: user.id, page: 1 });
  const bookmarks = await getBookmarksForUser(user.id);
  const bookmarkedQuestions = bookmarks
    .map((b) => getExamQuestion(b.subject as ExamSubject, b.year, b.question_no))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));
  const wrongQuestions = await getWrongQuestionsForUser(user.id);
  const myBadge = await getPremiumBadgeForUser(user.id);
  const activityMap = await getUserActivityScores([user.id]);
  const activity = activityMap[user.id];
  const nextRank = OCEAN_RANKS[activity.rank.level] ?? null;
  const unlockedSubjects = await getUnlockedSubjects(user.id);

  const analyticsPanels = await Promise.all(
    [...unlockedSubjects].map(async (subject) => {
      const attempts = await getAttemptsForSubject(user.id, subject);
      return buildSubjectStudyStats(subject, attempts);
    })
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <EyebrowLabel className="mb-2">내 계정</EyebrowLabel>
      <SectionHeading as="h1" className="mb-8 text-heading-sm">
        프로필
      </SectionHeading>

      <FeatureCard className="mb-8 border-[1.5px] border-carbon">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-icons)] border-[1.5px] border-carbon bg-snow font-display text-heading-sm font-semibold text-ink">
            {user.nickname.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display text-[12px] text-fog">아이디</p>
            <p className="flex items-center gap-2 font-display text-subheading font-semibold text-ink">
              {user.nickname}
              <OceanRankBadge rank={activity.rank} size="md" />
              {myBadge && <PremiumBadge label={myBadge} />}
            </p>
            <p className="mt-1 font-display text-[12px] text-fog">
              로그인용 이메일은 본인만 볼 수 있으며 공개되지 않습니다.
            </p>
          </div>
        </div>
        <UsernameForm currentUsername={user.nickname} />
        <div className="mt-6 border-t border-mist pt-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-[12px] text-fog">바다 레벨 활동 점수</p>
              <p className="mt-1 font-display text-subheading font-semibold text-ink">
                {activity.score.toLocaleString("ko-KR")}점
              </p>
            </div>
            <Link href="/ranks" className="font-display text-[12px] font-semibold text-electric-blue hover:underline">
              전체 레벨 보기 →
            </Link>
          </div>
          {nextRank && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between font-display text-[11px] text-fog">
                <span>다음 레벨 {nextRank.name}</span>
                <span>{Math.max(0, nextRank.minScore - activity.score).toLocaleString("ko-KR")}점 남음</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-mist">
                <div
                  className="h-full rounded-full bg-electric-blue"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        ((activity.score - activity.rank.minScore) /
                          (nextRank.minScore - activity.rank.minScore)) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["일일 로그인", activity.loginDays],
              ["게시글", activity.postCount],
              ["댓글", activity.commentCount],
              ["받은 좋아요", activity.likesReceived],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-[12px] bg-snow px-3 py-3 text-center">
                <p className="font-display text-[11px] text-fog">{label}</p>
                <p className="mt-1 font-display text-body font-semibold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </FeatureCard>

      <div className="mb-6">
        <h2 className="font-display text-subheading font-semibold text-ink">프리미엄 학습 분석</h2>
        <p className="mt-1 font-display text-body-sm text-smoke">
          과목별 단원 약점과 연도별 정답률을 확인할 수 있어요.
        </p>
      </div>

      {analyticsPanels.length === 0 ? (
        <ElevatedCard className="mb-8 px-6 py-10 text-center">
          <p className="font-display text-body text-smoke">
            해제된 과목이 없어요. 코드를 등록하면 학습 분석이 표시됩니다.
          </p>
          <PrimaryButton href="/" className="mt-4">
            기출문제로 이동
          </PrimaryButton>
        </ElevatedCard>
      ) : (
        <div className="mb-8 space-y-4">
          {analyticsPanels.map((stats) => (
            <StudyAnalyticsPanel
              key={stats.subject}
              subject={stats.subject}
              categories={stats.categories}
              years={stats.years}
              totalAttempts={stats.totalAttempts}
            />
          ))}
        </div>
      )}

      {unlockedSubjects.size > 0 && (
        <div className="mb-8 flex flex-wrap gap-3">
          {[...unlockedSubjects].map((subject) => (
            <Link
              key={subject}
              href={`/exam/${subject}/review`}
              className="inline-flex items-center rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-4 py-2 font-display text-body-sm font-medium text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
            >
              {ARCHIVE_SUBJECT_MAP[subject]} 오늘의 복습 →
            </Link>
          ))}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-subheading font-semibold text-ink">
          내 북마크 ({bookmarkedQuestions.length})
        </h2>
      </div>

      <ElevatedCard className="mb-8 overflow-hidden">
        {bookmarkedQuestions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-display text-body text-smoke">
              아직 북마크한 문제가 없어요
            </p>
          </div>
        ) : (
          bookmarkedQuestions.map((q) => (
            <Link
              key={`${q.subject}-${q.year}-${q.questionNo}`}
              href={`/exam/${q.subject}/${q.year}/${q.questionNo}`}
              className="block border-b border-mist/60 px-5 py-4 transition-colors last:border-b-0 hover:bg-snow"
            >
              <p className="font-display text-[12px] text-fog">
                {ARCHIVE_SUBJECT_MAP[q.subject]} · {q.year}년 · {q.questionNo}번
              </p>
              <p className="mt-1 font-display text-body-sm font-medium text-ink">
                {q.stem.slice(0, 60)}
                {q.stem.length > 60 ? "…" : ""}
              </p>
            </Link>
          ))
        )}
      </ElevatedCard>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-subheading font-semibold text-ink">
          오답노트 ({wrongQuestions.length})
        </h2>
      </div>

      <ElevatedCard className="mb-4 overflow-hidden">
        {wrongQuestions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-display text-body text-smoke">
              틀렸다고 표시한 문제가 없어요
            </p>
          </div>
        ) : (
          wrongQuestions.map((q) => (
            <Link
              key={`${q.subject}-${q.year}-${q.questionNo}`}
              href={`/exam/${q.subject}/${q.year}/${q.questionNo}`}
              className="block border-b border-mist/60 px-5 py-4 transition-colors last:border-b-0 hover:bg-snow"
            >
              <p className="font-display text-[12px] text-fog">
                {ARCHIVE_SUBJECT_MAP[q.subject]} · {q.year}년 · {q.questionNo}번
              </p>
              <p className="mt-1 font-display text-body-sm font-medium text-ink">
                {q.stem.slice(0, 60)}
                {q.stem.length > 60 ? "…" : ""}
              </p>
            </Link>
          ))
        )}
      </ElevatedCard>

      {unlockedSubjects.size > 0 && (
        <div className="mb-8 flex flex-wrap gap-3">
          {EXAM_SUBJECTS.filter((s) => unlockedSubjects.has(s.value as ExamSubject)).map((s) => (
            <Link
              key={s.value}
              href={`/exam/${s.value}/wrong`}
              className="font-display text-body-sm font-medium text-electric-blue hover:underline"
            >
              {s.label} 오답노트 연습 →
            </Link>
          ))}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-subheading font-semibold text-ink">
          내가 쓴 글 ({myPosts.length})
        </h2>
        <PrimaryButton href="/community/write" size="sm">
          새 글쓰기
        </PrimaryButton>
      </div>

      <ElevatedCard className="overflow-hidden">
        {myPosts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="mb-2 font-display text-body text-smoke">
              아직 작성한 글이 없어요
            </p>
            <PrimaryButton href="/community/write">첫 글 작성하기</PrimaryButton>
          </div>
        ) : (
          myPosts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              category={post.category}
              authorName={user.nickname}
              authorRank={activity.rank}
              viewCount={post.view_count}
              createdAt={post.created_at}
            />
          ))
        )}
      </ElevatedCard>

      <div className="mt-6 text-center">
        <Link
          href="/community"
          className="font-display text-body-sm text-fog hover:text-ink"
        >
          커뮤니티로 돌아가기 →
        </Link>
      </div>
    </div>
  );
}
