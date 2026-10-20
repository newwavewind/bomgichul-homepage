import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DailyPlay } from "@/components/daily/DailyPlay";
import { DailyLearningReportCard } from "@/components/daily/DailyLearningReport";
import { DailyReviewList } from "@/components/daily/DailyReviewList";
import { DailySubjectPick } from "@/components/daily/DailySubjectPick";
import { DailyAbout } from "@/components/daily/DailyAbout";
import { ResultActions } from "@/components/daily/ResultActions";
import {
  getChallenger,
  getCumulativeBoard,
  getDailyInsights,
  getFriendBoard,
  getPublicAttempt,
  getReviewQuestions,
  getTodayBoard,
  getViewerDailyShareContext,
  viewerNickname,
} from "@/lib/daily-challenge/actions";
import { getDailyExam } from "@/lib/daily-challenge/exams";
import { formatElapsed, formatKoreanDate } from "@/lib/daily-challenge/format";
import {
  getDailyEligiblePool,
  getDailySetWithSchedule,
  listDailySubjects,
} from "@/lib/daily-challenge/pool";
import {
  DAILY_ARCHIVE_START_DATE,
  daysToCoverDailyIds,
} from "@/lib/daily-challenge/pick";
import { getKSTDateString } from "@/lib/exam";
import {
  ANONYMOUS_NICKNAME,
  cleanNickname,
} from "@/lib/daily-challenge/exams";
import { buildPageMetadata } from "@/lib/seo";

type Search = Record<string, string | string[] | undefined>;

async function readSearch(searchParams: Search | Promise<Search>) {
  return await searchParams;
}

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function practicePage(value: string | undefined) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) return 0;
  return Math.min(parsed, 1_000_000);
}

function archiveDate(requested: string | undefined, todayDateKey: string) {
  if (!requested || !/^\d{4}-\d{2}-\d{2}$/.test(requested)) return todayDateKey;
  const parsed = new Date(`${requested}T00:00:00Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== requested
  )
    return todayDateKey;
  if (requested < DAILY_ARCHIVE_START_DATE || requested > todayDateKey)
    return todayDateKey;
  return requested;
}

export async function dailyPlayMetadata(slug: string): Promise<Metadata> {
  const meta = getDailyExam(slug);
  if (!meta) return {};
  return buildPageMetadata({
    title: `${meta.label} 매일 10문제`,
    description: `${meta.label} 과목을 고르고 그 과목 기출 10문제를 오늘 날짜로 풉니다.`,
    path: `/${slug}/daily`,
  });
}

export async function DailyPlayPage({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Search | Promise<Search>;
}) {
  const meta = getDailyExam(slug);
  if (!meta) notFound();
  const query = await readSearch(searchParams);
  const subjects = listDailySubjects(slug);
  const challengeId = one(query.challenge);
  const challenge = challengeId ? await getChallenger(challengeId, slug) : null;
  const requested = one(query.subject);
  const subject =
    subjects.find((item) => item.id === requested) ??
    (challenge
      ? subjects.find((item) => item.id === challenge.subjectId)
      : undefined) ??
    (subjects.length === 1 ? subjects[0] : undefined);
  if (!subject) {
    return (
      <>
        <DailySubjectPick
          exam={slug}
          label={meta.label}
          home={meta.home}
          subjects={subjects}
        />
        <DailyAbout exam={slug} label={meta.label} home={meta.home} subjects={subjects} />
      </>
    );
  }
  const todayDateKey = getKSTDateString();
  const dateKey = archiveDate(one(query.date), todayDateKey);
  const rawInviter = one(query.inviter);
  const cleanedInviter = rawInviter ? cleanNickname(rawInviter) : "";
  const invitedBy =
    cleanedInviter === ANONYMOUS_NICKNAME ? "" : cleanedInviter;
  const isArchive = dateKey !== todayDateKey;
  const reviewSource = isArchive ? undefined : one(query.review);
  const morePage =
    isArchive || reviewSource ? 0 : practicePage(one(query.more));
  const mode = reviewSource ? "review" : morePage > 0 ? "practice" : "ranked";
  const set = reviewSource
    ? await getReviewQuestions(slug, subject.id, reviewSource)
    : getDailySetWithSchedule(
        slug,
        dateKey,
        mode === "review" ? "ranked" : mode,
        subject.id,
        morePage,
      );
  const [nickname, todayRanking, insights, friendBoard, shareContext] = await Promise.all([
    viewerNickname(),
    getTodayBoard(slug, subject.id, dateKey),
    getDailyInsights(slug, subject.id, dateKey),
    challengeId ? getFriendBoard(challengeId) : Promise.resolve([]),
    getViewerDailyShareContext(slug, subject.id, dateKey),
  ]);
  const eligiblePool = getDailyEligiblePool(slug, subject.id);
  const eligibleIds = eligiblePool.map((question) => question.id);
  const newestYear = set.reduce(
    (latest, question) => Math.max(latest, question.year),
    0,
  );
  const eligibleYears = eligiblePool.map((question) => question.year);
  const composition = {
    years: new Set(eligibleYears).size,
    yearSpan: eligibleYears.length
      ? Math.max(...eligibleYears) - Math.min(...eligibleYears) + 1
      : 0,
    topics: new Set(
      set.map((question) => question.subcategory || question.category),
    ).size,
    latestCount: set.filter((question) => question.year >= newestYear - 2)
      .length,
    poolCount: eligiblePool.length,
    rotationDays: Math.ceil(eligiblePool.length / 10),
    daysFromToday: daysToCoverDailyIds(
      eligibleIds,
      eligibleIds,
      todayDateKey,
      `${slug}:${subject.id}`,
      10,
    ),
  };

  return (
    <DailyPlay
      key={`${subject.id}:${dateKey}:${mode}:${morePage}:${reviewSource ?? ""}`}
      exam={slug}
      subjectId={subject.id}
      subjectLabel={subject.label}
      label={meta.label}
      home={meta.home}
      dateKey={dateKey}
      todayDateKey={todayDateKey}
      isArchive={isArchive}
      mode={mode}
      practicePage={morePage}
      reviewSource={reviewSource}
      questions={set}
      roundHref={set[0]?.roundHref ?? meta.home}
      defaultNickname={nickname}
      todayRanking={todayRanking.slice(0, 10)}
      friendBoard={friendBoard}
      insights={insights}
      composition={composition}
      shareContext={shareContext}
      invitedBy={invitedBy}
      challenge={
        !isArchive && challenge && challenge.subjectId === subject.id
          ? challenge
          : null
      }
    />
  );
}

export async function dailyResultMetadata(
  slug: string,
  searchParams: Search | Promise<Search>,
): Promise<Metadata> {
  const meta = getDailyExam(slug);
  if (!meta) return {};
  const attemptId = one((await readSearch(searchParams)).attempt);
  const attempt = attemptId ? await getPublicAttempt(attemptId) : null;
  const description = attempt
    ? `${formatKoreanDate(attempt.dateKey)} ${attempt.subjectLabel} ${attempt.nickname} · 10문제 중 ${attempt.correct}개${attempt.rank ? ` · 오늘 ${attempt.rank}위` : ""}`
    : `${meta.label} 매일 10문제 결과`;
  return buildPageMetadata({
    title: attempt
      ? `${meta.label} ${attempt.subjectLabel} 매일 10문제 ${attempt.correct}/${attempt.total}`
      : `${meta.label} 매일 10문제 결과`,
    description,
    path: `/${slug}/daily/result`,
    canonicalParams: attemptId ? { attempt: attemptId } : undefined,
  });
}

export async function DailyResultPage({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Search | Promise<Search>;
}) {
  const meta = getDailyExam(slug);
  if (!meta) notFound();
  const attemptId = one((await readSearch(searchParams)).attempt);
  const attempt = attemptId ? await getPublicAttempt(attemptId) : null;

  return (
    <div className="bg-[linear-gradient(180deg,#f3f8ff_0%,#ffffff_40%)] px-2 py-8 sm:px-4">
      <div className="mx-auto max-w-[900px] rounded-[24px] border border-white/80 bg-white/75 p-2.5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-5 md:p-7">
        {attempt && attempt.exam === slug ? (
          <>
            <p className="text-sm text-[#0066D6]">
              {formatKoreanDate(attempt.dateKey)} · {attempt.subjectLabel} ·{" "}
              {attempt.nickname}
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
              {attempt.correct}/{attempt.total}
            </h1>
            <p className="mt-1 text-sm text-[#475569]">
              {formatElapsed(attempt.elapsedMs)}
              {attempt.rank ? ` · 오늘 ${attempt.rank}위` : ""}
            </p>
            <DailyLearningReportCard
              exam={slug}
              subjectId={attempt.subjectId}
              attemptId={attempt.id}
              correct={attempt.correct}
              total={attempt.total}
              elapsedMs={attempt.elapsedMs}
              rank={attempt.rank}
              report={attempt.report}
            />
            <DailyReviewList items={attempt.review} />
            <div className="mt-6">
              <ResultActions
                exam={slug}
                examLabel={meta.label}
                label={attempt.subjectLabel || meta.label}
                home={meta.home}
                subjectId={attempt.subjectId}
                dateKey={attempt.dateKey}
                nickname={attempt.nickname}
                correct={attempt.correct}
                total={attempt.total}
                elapsedMs={attempt.elapsedMs}
                rank={attempt.rank}
                attemptId={attempt.id}
                roundHref={attempt.roundHref}
                participants={attempt.report.participants}
              />
            </div>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold text-ink">
              매일 10문제
            </h1>
            <p className="mt-2 text-sm text-[#475569]">
              저장된 결과를 찾지 못했습니다.
            </p>
            <Link
              href={`/${slug}/daily`}
              className="mt-4 inline-flex rounded-2xl bg-[#007AFF] px-4 py-3 text-sm font-semibold text-white"
            >
              오늘 문제 풀기
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export async function dailyRanksMetadata(slug: string): Promise<Metadata> {
  const meta = getDailyExam(slug);
  if (!meta) return {};
  return buildPageMetadata({
    title: `${meta.label} 매일 10문제 순위`,
    description: `${meta.label} 매일 10문제의 과목별 오늘 순위와 누적 순위입니다.`,
    path: `/${slug}/daily/ranks`,
  });
}

export async function DailyRanksPage({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Search | Promise<Search>;
}) {
  const meta = getDailyExam(slug);
  if (!meta) notFound();
  const query = await readSearch(searchParams);
  const subjects = listDailySubjects(slug);
  const requested = one(query.subject);
  const subject =
    subjects.find((item) => item.id === requested) ??
    (subjects.length === 1 ? subjects[0] : undefined);
  if (!subject) {
    return (
      <>
        <DailySubjectPick
          exam={slug}
          label={meta.label}
          home={meta.home}
          subjects={subjects}
        />
        <DailyAbout exam={slug} label={meta.label} home={meta.home} subjects={subjects} />
      </>
    );
  }
  const board = one(query.board) === "total" ? "total" : "today";
  const todayDateKey = getKSTDateString();
  const dateKey = archiveDate(one(query.date), todayDateKey);
  const rows =
    board === "total"
      ? await getCumulativeBoard(slug, subject.id)
      : await getTodayBoard(slug, subject.id, dateKey);
  const dateQuery = dateKey === todayDateKey ? "" : `&date=${dateKey}`;
  const rankBase = `/${slug}/daily/ranks?subject=${encodeURIComponent(subject.id)}${dateQuery}`;
  const dailyHref = `/${slug}/daily?subject=${encodeURIComponent(subject.id)}${dateQuery}`;

  return (
    <div className="bg-[linear-gradient(180deg,#f3f8ff_0%,#ffffff_40%)] px-4 py-8">
      <div className="mx-auto max-w-xl">
        <p className="text-xs font-semibold text-[#64748b]">{meta.label}</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
          {subject.label} 순위
        </h1>
        <div className="mt-4 flex gap-2">
          <Link href={rankBase} className={board === "today" ? tabOn : tabOff}>
            {dateKey === todayDateKey ? "오늘" : formatKoreanDate(dateKey)}
          </Link>
          <Link
            href={`${rankBase}&board=total`}
            className={board === "total" ? tabOn : tabOff}
          >
            누적
          </Link>
        </div>
        <ol className="mt-4 space-y-2">
          {rows.length === 0 ? (
            <li className="rounded-2xl bg-white/80 px-4 py-6 text-sm text-[#475569]">
              아직 기록이 없습니다.
            </li>
          ) : (
            rows.map((row) => (
              <li
                key={`${row.rank}-${row.nickname}`}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 ${row.mine ? "bg-[#E8F4FF]" : "bg-white/80"}`}
              >
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {row.rank}. {row.nickname}
                  </p>
                  <p className="text-xs text-[#64748b]">
                    {board === "total"
                      ? `${row.days}일 · 맞힌 수 ${row.correct}`
                      : `${row.correct}/${row.total}${row.elapsedMs != null ? ` · ${formatElapsed(row.elapsedMs)}` : ""}`}
                  </p>
                </div>
              </li>
            ))
          )}
        </ol>
        <Link
          href={dailyHref}
          className="mt-6 inline-flex rounded-2xl bg-[#007AFF] px-4 py-3 text-sm font-semibold text-white"
        >
          이 과목 10문제 풀기
        </Link>
      </div>
    </div>
  );
}

const tabOn =
  "rounded-full bg-[#007AFF] px-4 py-2 text-sm font-semibold text-white";
const tabOff =
  "rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#334155]";
