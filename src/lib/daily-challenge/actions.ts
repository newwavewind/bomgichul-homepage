"use server";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import {
  ANONYMOUS_NICKNAME,
  cleanNickname,
  getDailyExam,
} from "@/lib/daily-challenge/exams";
import {
  getDailyEligiblePool,
  getDailyPool,
  getDailySet,
  listDailySubjects,
  toQuestionView,
} from "@/lib/daily-challenge/pool";
import type {
  BoardRow,
  DailyCoverage,
  DailyConfidence,
  DailyInsights,
  DailyLearningReport,
  DailyMode,
  DailyQuestion,
  DailyQuestionView,
  DailyReviewItem,
  DailyScore,
  DailyWrongNotebook,
  DailyWrongNotebookItem,
  DailyWrongSummary,
  DailyWeakPattern,
} from "@/lib/daily-challenge/types";
import { getKSTDateString } from "@/lib/exam";
import { daysToCoverDailyIds } from "@/lib/daily-challenge/pick";
import {
  INVALID_ELAPSED_MS,
  MAX_VALID_ELAPSED_MS,
} from "@/lib/daily-challenge/timing";
import { createAdminClient } from "@/lib/supabase/admin";

const REVIEW_INTERVALS = [1, 3, 7] as const;

type AttemptAnswer = {
  id: string;
  picked?: string;
  ok?: boolean;
  confidence?: DailyConfidence;
  challengeId?: string | null;
  review?: boolean;
  graduationFor?: string | null;
};

type AttemptRow = {
  id: string;
  exam_slug: string;
  subject_id: string;
  quiz_date: string;
  mode: string;
  identity_key: string;
  nickname: string;
  correct: number;
  total: number;
  elapsed_ms: number;
  question_ids?: string[];
  answers?: AttemptAnswer[] | null;
  created_at: string;
};

function secret() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY가 없습니다.");
  return key;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function validUuid(value: string | undefined | null) {
  return Boolean(
    value &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    ),
  );
}

function cookieName(slug: string, mode: string, subject: string) {
  return `bom_daily_${mode}_${slug}_${subject}`.replace(/[^a-z0-9_]/gi, "_");
}

function practicePage(value: number | undefined) {
  if (!Number.isSafeInteger(value) || (value ?? 0) < 1) return 1;
  return Math.min(value as number, 1_000_000);
}

function attemptModeKey(
  mode: DailyMode,
  page: number | undefined,
  reviewSource?: string,
) {
  if (mode === "practice") return `practice_${practicePage(page)}`;
  if (mode === "review")
    return `review_${(reviewSource || "due").replace(/[^a-z0-9_-]/gi, "_")}`;
  return "ranked";
}

function cleanDevice(id: string) {
  const text = id.trim();
  if (!/^[0-9a-f-]{16,80}$/i.test(text)) return "invalid";
  return text;
}

async function identityFor(deviceId: string) {
  const user = await getUser();
  if (user)
    return {
      identity: `user:${user.id}`,
      userId: user.id,
      profileName: user.nickname,
    };
  return {
    identity: `device:${cleanDevice(deviceId)}`,
    userId: null as string | null,
    profileName: "",
  };
}

function readStartedAt(
  value: string | undefined,
  exam: string,
  dateKey: string,
  mode: string,
  subject: string,
  identity: string,
) {
  if (!value) return null;
  const parts = value.split("|");
  if (parts.length !== 7) return null;
  const [
    cookieExam,
    cookieDate,
    cookieMode,
    cookieSubject,
    cookieIdentity,
    ts,
    sig,
  ] = parts;
  const body = [
    cookieExam,
    cookieDate,
    cookieMode,
    cookieSubject,
    cookieIdentity,
    ts,
  ].join("|");
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (
    cookieExam !== exam ||
    cookieDate !== dateKey ||
    cookieMode !== mode ||
    cookieSubject !== subject ||
    cookieIdentity !== identity
  ) {
    return null;
  }
  const started = Number(ts);
  return Number.isFinite(started) ? started : null;
}

function readElapsed(
  value: string | undefined,
  exam: string,
  dateKey: string,
  mode: string,
  subject: string,
  identity: string,
) {
  const started = readStartedAt(
    value,
    exam,
    dateKey,
    mode,
    subject,
    identity,
  );
  if (started === null) return INVALID_ELAPSED_MS;
  const elapsed = Date.now() - started;
  if (elapsed < 1000 || elapsed > MAX_VALID_ELAPSED_MS)
    return INVALID_ELAPSED_MS;
  return elapsed;
}

function safeAnswers(value: unknown): AttemptAnswer[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    if (typeof row.id !== "string") return [];
    return [
      {
        id: row.id,
        picked: typeof row.picked === "string" ? row.picked : "",
        ok: typeof row.ok === "boolean" ? row.ok : undefined,
        confidence:
          row.confidence === "sure" || row.confidence === "unsure"
            ? row.confidence
            : null,
        challengeId:
          typeof row.challengeId === "string" ? row.challengeId : null,
        review: row.review === true,
        graduationFor:
          typeof row.graduationFor === "string" ? row.graduationFor : null,
      },
    ];
  });
}

function grade(
  set: DailyQuestion[],
  picks: { id: string; key: string; confidence?: DailyConfidence }[],
): DailyReviewItem[] {
  const picked = new Map(picks.map((item) => [item.id, item]));
  return set.map((question) => {
    const answer = picked.get(question.id);
    const key = answer?.key ?? "";
    const choice = question.choices.find((item) => item.key === key);
    const answers = question.choices.filter((item) =>
      question.correctKeys.includes(item.key),
    );
    return {
      id: question.id,
      stem: question.stem,
      presentation: question.presentation,
      sourceLabel: question.sourceLabel,
      href: question.href,
      choices: question.choices,
      correctKeys: question.correctKeys,
      picked: key,
      pickedLabel: choice?.label ?? "",
      answerLabel: answers.map((item) => item.label).join(", "),
      explanation: question.explanation,
      ok: question.correctKeys.includes(key),
      confidence: answer?.confidence ?? null,
      category: question.category,
      subcategory: question.subcategory,
    };
  });
}

function shiftDate(dateKey: string, amount: number) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function emptyInsights(): DailyInsights {
  return {
    calendar: {},
    streak: 0,
    monthDone: 0,
    dueReviewCount: 0,
    weeklyWeakness: [],
    achievements: {
      learningDays: 0,
      totalAnswered: 0,
      uniqueSolved: 0,
      poolCount: 0,
      perfectDays: 0,
      reviewCorrect: 0,
      yearsStarted: 0,
      yearsCompleted: 0,
      totalYears: 0,
    },
    wrongNotebook: emptyWrongSummary(),
  };
}

function emptyWrongSummary(): DailyWrongSummary {
  return { active: 0, due: 0, repeated: 0, recovered: 0 };
}

function memoryRuleFor(question: DailyQuestion) {
  const correctLabels = question.choices
    .filter((choice) => question.correctKeys.includes(choice.key))
    .map((choice) => choice.label.trim());
  const paragraphs = question.explanation.split(/\n\n+/).map((text) => text.trim());
  const matched = paragraphs.find((paragraph) =>
    correctLabels.some((label) => paragraph.startsWith(`${label} `)),
  );
  const source = (matched ?? paragraphs[0] ?? question.stem)
    .replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, "")
    .split(/\[(?:개정|판례변경)\]/)[0]!
    .trim();
  const firstSentence = source.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() ?? source;
  return firstSentence.length > 180
    ? `${firstSentence.slice(0, 177).trim()}…`
    : firstSentence;
}

function weaknessCue(stem: string) {
  if (/(?:\d|기간|기한|이내|이상|이하|초과|미만|금액|개월)/.test(stem))
    return "수치·기간 기준";
  if (/(?:예외|제외|다만)/.test(stem)) return "예외 조건";
  if (/(?:순서|절차|단계)/.test(stem)) return "절차 순서";
  if (/(?:옳지 않은|틀린|아닌 것은|잘못된)/.test(stem))
    return "반대 조건 판별";
  return "핵심 개념 구분";
}

function buildWeakPatterns(items: DailyWrongNotebookItem[]): DailyWeakPattern[] {
  const grouped = new Map<
    string,
    { wrongCount: number; questions: number; cues: Map<string, number> }
  >();
  for (const item of items.filter((entry) => !entry.mastered)) {
    const topic = item.subcategory || item.category || "기타";
    const current = grouped.get(topic) ?? {
      wrongCount: 0,
      questions: 0,
      cues: new Map<string, number>(),
    };
    const cue = weaknessCue(item.stem);
    current.wrongCount += item.wrongCount;
    current.questions += 1;
    current.cues.set(cue, (current.cues.get(cue) ?? 0) + item.wrongCount);
    grouped.set(topic, current);
  }
  return [...grouped.entries()]
    .map(([topic, value]) => {
      const cue = [...value.cues.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "핵심 개념 구분";
      return {
        topic,
        cue,
        wrongCount: value.wrongCount,
        questionCount: value.questions,
        summary: `${topic}에서 ${cue} 문제를 ${value.questions}개, 총 ${value.wrongCount}회 놓쳤습니다.`,
      };
    })
    .sort((a, b) => b.wrongCount - a.wrongCount || b.questionCount - a.questionCount)
    .slice(0, 3);
}

function graduationSourceId(source: string | undefined) {
  return source?.startsWith("graduate:") ? source.slice("graduate:".length) : null;
}

function pickGraduationQuestion(
  pool: DailyQuestion[],
  originalId: string,
  attemptedIds = new Set<string>(),
) {
  const original = pool.find((question) => question.id === originalId);
  if (!original) return null;
  const sameTopic = pool
    .filter(
      (question) =>
        question.id !== original.id &&
        question.subcategory === original.subcategory,
    )
    .sort(
      (a, b) =>
        Number(attemptedIds.has(a.id)) - Number(attemptedIds.has(b.id)) ||
        b.year - a.year ||
        a.id.localeCompare(b.id),
    );
  const sameCategory = pool
    .filter(
      (question) =>
        question.id !== original.id &&
        question.category === original.category,
    )
    .sort(
      (a, b) =>
        Number(attemptedIds.has(a.id)) - Number(attemptedIds.has(b.id)) ||
        b.year - a.year ||
        a.id.localeCompare(b.id),
    );
  return sameTopic[0] ?? sameCategory[0] ?? null;
}

function buildWrongNotebook(
  rows: AttemptRow[],
  pool: DailyQuestion[],
  today: string,
): DailyWrongNotebook {
  const byId = new Map(pool.map((question) => [question.id, question]));
  type MutableItem = Omit<
    DailyWrongNotebookItem,
    | "nextReviewDate"
    | "due"
    | "mastered"
    | "note"
    | "pinned"
    | "choiceStats"
    | "graduationQuestion"
  >;
  const states = new Map<string, MutableItem>();
  const ordered = [...rows].sort(
    (a, b) =>
      a.created_at.localeCompare(b.created_at) ||
      a.quiz_date.localeCompare(b.quiz_date),
  );

  for (const row of ordered) {
    for (const answer of safeAnswers(row.answers)) {
      const question = byId.get(answer.id);
      if (!question) continue;
      const current = states.get(answer.id) ?? {
        id: question.id,
        year: question.year,
        sourceLabel: question.sourceLabel,
        stem: question.stem,
        presentation: question.presentation,
        choices: question.choices,
        correctKeys: question.correctKeys,
        explanation: question.explanation,
        lawChangeNote: question.lawChangeNote,
        examDate: question.examDate,
        lawVersions: question.lawVersions,
        href: question.href,
        category: question.category,
        subcategory: question.subcategory,
        wrongCount: 0,
        attemptCount: 0,
        correctAfterWrong: 0,
        consecutiveCorrect: 0,
        lastWrongDate: "",
        lastAttemptDate: row.quiz_date,
        history: [],
        myLastWrongKey: "",
        memoryRule: memoryRuleFor(question),
      };
      current.attemptCount += 1;
      current.lastAttemptDate = row.quiz_date;
      current.history.push({
        date: row.quiz_date,
        correct: answer.ok === true,
        kind: "attempt",
      });
      current.history = current.history.slice(-8);
      if (answer.ok === false) {
        current.wrongCount += 1;
        current.consecutiveCorrect = 0;
        current.lastWrongDate = row.quiz_date;
        current.myLastWrongKey = answer.picked ?? "";
      } else if (answer.ok === true && current.wrongCount > 0) {
        current.correctAfterWrong += 1;
        current.consecutiveCorrect += 1;
      }
      states.set(answer.id, current);

      if (answer.graduationFor && answer.graduationFor !== answer.id) {
        const graduated = states.get(answer.graduationFor);
        if (graduated?.wrongCount) {
          graduated.attemptCount += 1;
          graduated.lastAttemptDate = row.quiz_date;
          graduated.history.push({
            date: row.quiz_date,
            correct: answer.ok === true,
            kind: "graduation",
          });
          graduated.history = graduated.history.slice(-8);
          if (answer.ok === true) {
            graduated.correctAfterWrong += 1;
            graduated.consecutiveCorrect += 1;
          } else {
            graduated.consecutiveCorrect = 0;
          }
          states.set(answer.graduationFor, graduated);
        }
      }
    }
  }

  const attemptedIds = new Set(
    ordered.flatMap((row) => safeAnswers(row.answers).map((answer) => answer.id)),
  );
  const items = [...states.values()]
    .filter((item) => item.wrongCount > 0)
    .map<DailyWrongNotebookItem>((item) => {
      const mastered = item.consecutiveCorrect >= 3;
      const interval = mastered
        ? 30
        : item.consecutiveCorrect >= 2
          ? 7
          : item.consecutiveCorrect === 1
            ? 3
            : 1;
      const nextReviewDate = shiftDate(item.lastAttemptDate, interval);
      return {
        ...item,
        nextReviewDate,
        due: !mastered && nextReviewDate <= today,
        mastered,
        note: "",
        pinned: false,
        choiceStats: null,
        graduationQuestion: (() => {
          const question = pickGraduationQuestion(pool, item.id, attemptedIds);
          return question
            ? {
                id: question.id,
                stem: question.stem,
                sourceLabel: question.sourceLabel,
              }
            : null;
        })(),
      };
    })
    .sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned) ||
        Number(b.due) - Number(a.due) ||
        Number(a.mastered) - Number(b.mastered) ||
        b.wrongCount - a.wrongCount ||
        b.lastWrongDate.localeCompare(a.lastWrongDate),
    );

  return {
    summary: {
      active: items.filter((item) => !item.mastered).length,
      due: items.filter((item) => item.due).length,
      repeated: items.filter((item) => !item.mastered && item.wrongCount >= 2).length,
      recovered: items.filter((item) => item.mastered).length,
    },
    weakPatterns: buildWeakPatterns(items),
    items,
  };
}

function buildInsights(
  rows: AttemptRow[],
  pool: DailyQuestion[],
  today: string,
  monthDateKey = today,
): DailyInsights {
  const ranked = rows.filter((row) => row.mode === "ranked");
  const calendar: DailyInsights["calendar"] = {};
  for (const row of ranked) {
    const answers = safeAnswers(row.answers);
    calendar[row.quiz_date] = {
      correct: row.correct,
      total: row.total,
      needsReview: answers.some((answer) => answer.ok === false),
    };
  }

  const completed = new Set(ranked.map((row) => row.quiz_date));
  let cursor = completed.has(today) ? today : shiftDate(today, -1);
  let streak = 0;
  while (completed.has(cursor)) {
    streak += 1;
    cursor = shiftDate(cursor, -1);
  }

  const dueDates = new Set(
    REVIEW_INTERVALS.map((days) => shiftDate(today, -days)),
  );
  const dueIds = new Set<string>();
  for (const row of ranked) {
    if (!dueDates.has(row.quiz_date)) continue;
    for (const answer of safeAnswers(row.answers)) {
      if (answer.ok === false) {
        dueIds.add(answer.id);
      }
    }
  }

  const poolById = new Map(pool.map((question) => [question.id, question]));
  const topics = new Map<string, { correct: number; total: number }>();
  const weekStart = shiftDate(today, -6);
  for (const row of ranked) {
    if (row.quiz_date < weekStart || row.quiz_date > today) continue;
    for (const answer of safeAnswers(row.answers)) {
      const question = poolById.get(answer.id);
      if (!question) continue;
      const topic = question.subcategory || question.category || "기타";
      const current = topics.get(topic) ?? { correct: 0, total: 0 };
      current.total += 1;
      current.correct += answer.ok ? 1 : 0;
      topics.set(topic, current);
    }
  }

  const month = monthDateKey.slice(0, 7);
  const newestYear = Math.max(0, ...pool.map((question) => question.year));
  const eligiblePool = pool.filter(
    (question) => question.year >= newestYear - 9,
  );
  const eligibleById = new Map(
    eligiblePool.map((question) => [question.id, question]),
  );
  const solvedIds = new Set<string>();
  let totalAnswered = 0;
  let reviewCorrect = 0;
  for (const row of rows) {
    const answers = safeAnswers(row.answers);
    totalAnswered += row.total;
    reviewCorrect += answers.filter(
      (answer) => answer.review === true && answer.ok === true,
    ).length;
    const ids = row.question_ids?.length
      ? row.question_ids
      : answers.map((answer) => answer.id);
    for (const id of ids) {
      if (eligibleById.has(id)) solvedIds.add(id);
    }
  }
  const yearTotals = new Map<number, number>();
  const yearSolved = new Map<number, number>();
  for (const question of eligiblePool) {
    yearTotals.set(question.year, (yearTotals.get(question.year) ?? 0) + 1);
    if (solvedIds.has(question.id)) {
      yearSolved.set(question.year, (yearSolved.get(question.year) ?? 0) + 1);
    }
  }
  const yearsCompleted = [...yearTotals].filter(
    ([year, total]) => (yearSolved.get(year) ?? 0) >= total,
  ).length;
  return {
    calendar,
    streak,
    monthDone: ranked.filter((row) => row.quiz_date.startsWith(month)).length,
    dueReviewCount: dueIds.size,
    weeklyWeakness: [...topics.entries()]
      .map(([topic, value]) => ({
        topic,
        correct: value.correct,
        total: value.total,
        accuracy: value.total
          ? Math.round((value.correct / value.total) * 100)
          : 0,
      }))
      .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)
      .slice(0, 3),
    achievements: {
      learningDays: completed.size,
      totalAnswered,
      uniqueSolved: solvedIds.size,
      poolCount: eligiblePool.length,
      perfectDays: ranked.filter((row) => row.total > 0 && row.correct === row.total)
        .length,
      reviewCorrect,
      yearsStarted: yearSolved.size,
      yearsCompleted,
      totalYears: yearTotals.size,
    },
    wrongNotebook: buildWrongNotebook(rows, pool, today).summary,
  };
}

async function loadIdentityRows(
  admin: ReturnType<typeof createAdminClient>,
  exam: string,
  subject: string,
  identity: string,
) {
  if (!identity) return [];
  const { data, error } = await admin
    .from("daily_challenge_attempts")
    .select(
      "id, exam_slug, subject_id, quiz_date, mode, identity_key, nickname, correct, total, elapsed_ms, question_ids, answers, created_at",
    )
    .eq("exam_slug", exam)
    .eq("subject_id", subject)
    .eq("identity_key", identity)
    .order("quiz_date", { ascending: false })
    .limit(1000);
  if (error) return [];
  return (data ?? []) as AttemptRow[];
}

async function loadChoiceStats(
  admin: ReturnType<typeof createAdminClient>,
  exam: string,
  subject: string,
  excludeIdentity: string,
) {
  const { data, error } = await admin
    .from("daily_challenge_attempts")
    .select("identity_key, answers, created_at")
    .eq("exam_slug", exam)
    .eq("subject_id", subject)
    .neq("identity_key", excludeIdentity)
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) return new Map<string, { total: number; counts: Map<string, number> }>();

  const latestBySolver = new Set<string>();
  const stats = new Map<string, { total: number; counts: Map<string, number> }>();
  for (const row of data ?? []) {
    const identity = String(row.identity_key ?? "");
    for (const answer of safeAnswers(row.answers)) {
      if (!answer.picked) continue;
      const key = `${identity}\u0000${answer.id}`;
      if (latestBySolver.has(key)) continue;
      latestBySolver.add(key);
      const current = stats.get(answer.id) ?? {
        total: 0,
        counts: new Map<string, number>(),
      };
      current.total += 1;
      current.counts.set(
        answer.picked,
        (current.counts.get(answer.picked) ?? 0) + 1,
      );
      stats.set(answer.id, current);
    }
  }
  return stats;
}

async function rankStats(
  admin: ReturnType<typeof createAdminClient>,
  exam: string,
  subject: string,
  dateKey: string,
  correct: number,
  elapsedMs: number,
) {
  const { data } = await admin
    .from("daily_challenge_attempts")
    .select("correct, elapsed_ms")
    .eq("exam_slug", exam)
    .eq("subject_id", subject)
    .eq("quiz_date", dateKey)
    .eq("mode", "ranked")
    .order("correct", { ascending: false })
    .order("elapsed_ms", { ascending: true });
  const rows = (data ?? []) as Pick<AttemptRow, "correct" | "elapsed_ms">[];
  const better = rows.filter(
    (row) =>
      row.correct > correct ||
      (row.correct === correct && row.elapsed_ms < elapsedMs),
  ).length;
  const rank = better + 1;
  return {
    rank,
    participants: rows.length,
    percentile:
      rows.length > 0 ? Math.max(1, Math.ceil((rank / rows.length) * 100)) : 1,
  };
}

function makeReport(
  review: DailyReviewItem[],
  insights: DailyInsights,
  participants: number,
  percentile: number | null,
  previousDelta: number | null,
): DailyLearningReport {
  return {
    participants,
    percentile,
    previousDelta,
    weakTopic: insights.weeklyWeakness[0]?.topic ?? null,
    wrongCount: review.filter((item) => !item.ok).length,
    uncertainCount: 0,
    streak: insights.streak,
    monthDone: insights.monthDone,
    dueReviewCount: insights.dueReviewCount,
    achievements: insights.achievements,
    wrongNotebook: insights.wrongNotebook,
  };
}

export async function startDailyAttempt(input: {
  exam: string;
  subject: string;
  mode: DailyMode;
  practicePage?: number;
  reviewSource?: string;
  timerToken?: string | null;
  deviceId: string;
}) {
  const subject = listDailySubjects(input.exam).find(
    (item) => item.id === input.subject,
  );
  if (!getDailyExam(input.exam) || !subject)
    return { ok: false as const, message: "과목을 찾지 못했습니다." };
  const who = await identityFor(input.deviceId);
  const dateKey = getKSTDateString();
  const modeKey = attemptModeKey(
    input.mode,
    input.practicePage,
    input.reviewSource,
  );
  const jar = await cookies();
  const now = Date.now();
  const savedToken =
    input.timerToken ||
    jar.get(cookieName(input.exam, modeKey, subject.id))?.value;
  const savedStarted = readStartedAt(
    savedToken,
    input.exam,
    dateKey,
    modeKey,
    subject.id,
    who.identity,
  );
  const ts =
    savedStarted !== null &&
    now >= savedStarted &&
    now - savedStarted <= MAX_VALID_ELAPSED_MS
      ? savedStarted
      : now;
  const body = [
    input.exam,
    dateKey,
    modeKey,
    subject.id,
    who.identity,
    String(ts),
  ].join("|");
  const timerToken = `${body}|${sign(body)}`;
  jar.set(
    cookieName(input.exam, modeKey, subject.id),
    timerToken,
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 6,
    },
  );
  jar.set("bom_daily_identity", who.identity, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  });
  return {
    ok: true as const,
    dateKey,
    defaultNickname: who.profileName,
    timerToken,
  };
}

export async function submitDailyAttempt(input: {
  exam: string;
  subject: string;
  mode: DailyMode;
  practicePage?: number;
  reviewSource?: string;
  challengeId?: string | null;
  timerToken?: string | null;
  deviceId: string;
  nickname: string;
  picks: { id: string; key: string; confidence?: DailyConfidence }[];
}): Promise<DailyScore | { ok: false; message: string }> {
  const meta = getDailyExam(input.exam);
  const subject = listDailySubjects(input.exam).find(
    (item) => item.id === input.subject,
  );
  if (
    !meta ||
    !subject ||
    !["ranked", "practice", "review"].includes(input.mode)
  ) {
    return { ok: false, message: "과목을 찾지 못했습니다." };
  }

  const dateKey = getKSTDateString();
  const page = practicePage(input.practicePage);
  let set: DailyQuestion[];
  let graduationFor: string | null = null;
  if (input.mode === "review") {
    const subjectPool = getDailyPool(input.exam).filter(
      (question) => question.subjectId === subject.id,
    );
    const allowed = new Map(subjectPool.map((question) => [question.id, question]));
    const requestedGraduation = graduationSourceId(input.reviewSource);
    const original = requestedGraduation
      ? allowed.get(requestedGraduation)
      : undefined;
    set = input.picks
      .slice(0, 10)
      .flatMap((pick) => (allowed.get(pick.id) ? [allowed.get(pick.id)!] : []))
      .filter(
        (question) =>
          !original ||
          (question.id !== original.id &&
            (question.subcategory === original.subcategory ||
              question.category === original.category)),
      );
    graduationFor = original && set.length ? original.id : null;
  } else {
    set = getDailySet(input.exam, dateKey, input.mode, subject.id, page);
  }
  if (set.length === 0)
    return { ok: false, message: "오늘 문제를 만들지 못했습니다." };

  const who = await identityFor(input.deviceId);
  const jar = await cookies();
  const modeKey = attemptModeKey(input.mode, page, input.reviewSource);
  const tokenElapsedMs = readElapsed(
    input.timerToken ?? undefined,
    input.exam,
    dateKey,
    modeKey,
    subject.id,
    who.identity,
  );
  const elapsedMs =
    tokenElapsedMs !== INVALID_ELAPSED_MS
      ? tokenElapsedMs
      : readElapsed(
          jar.get(cookieName(input.exam, modeKey, subject.id))?.value,
          input.exam,
          dateKey,
          modeKey,
          subject.id,
          who.identity,
        );
  const nickname = cleanNickname(input.nickname || who.profileName);
  const review = grade(set, input.picks ?? []);
  const correct = review.filter((item) => item.ok).length;
  const roundHref = set[0]?.roundHref ?? meta.home;
  const defaultReport = makeReport(review, emptyInsights(), 0, null, null);

  const base = {
    nickname,
    correct,
    total: set.length,
    elapsedMs,
    review,
    roundHref,
    dateKey,
    rank: null as number | null,
    saved: false,
    alreadyRanked: false,
    attemptId: null as string | null,
    message: null as string | null,
    report: defaultReport,
    share: {
      attemptId: null as string | null,
      nickname,
      correct,
      total: set.length,
      elapsedMs,
      rank: null as number | null,
    },
  };

  try {
    const admin = createAdminClient();
    const beforeRows = await loadIdentityRows(
      admin,
      input.exam,
      subject.id,
      who.identity,
    );
    const previous = beforeRows.find(
      (row) => row.mode === "ranked" && row.quiz_date < dateKey,
    );

    if (input.mode === "review") {
      const reviewAnswers = review.map((item) => ({
        id: item.id,
        picked: item.picked,
        ok: item.ok,
        confidence: item.confidence,
        review: true,
        graduationFor,
      }));
      const { data: insertedReview } = await admin
        .from("daily_challenge_attempts")
        .insert({
          exam_slug: input.exam,
          subject_id: subject.id,
          quiz_date: dateKey,
          mode: "practice",
          identity_key: who.identity,
          user_id: who.userId,
          nickname,
          correct,
          total: set.length,
          elapsed_ms: elapsedMs,
          question_ids: set.map((question) => question.id),
          answers: reviewAnswers,
        })
        .select("id")
        .single();
      const nextRows = insertedReview
        ? [
            {
              id: insertedReview.id,
              exam_slug: input.exam,
              subject_id: subject.id,
              quiz_date: dateKey,
              mode: "practice",
              identity_key: who.identity,
              nickname,
              correct,
              total: set.length,
              elapsed_ms: elapsedMs,
              question_ids: set.map((question) => question.id),
              answers: reviewAnswers,
              created_at: new Date().toISOString(),
            } satisfies AttemptRow,
            ...beforeRows,
          ]
        : beforeRows;
      const insights = buildInsights(
        nextRows,
        getDailyPool(input.exam).filter(
          (question) => question.subjectId === subject.id,
        ),
        dateKey,
      );
      return {
        ...base,
        attemptId: insertedReview?.id ?? null,
        saved: Boolean(insertedReview),
        message: insertedReview
          ? "복습 기록을 저장했습니다. 공식 순위에는 반영되지 않습니다."
          : "복습은 채점했지만 기록을 저장하지 못했습니다.",
        report: makeReport(
          review,
          insights,
          0,
          null,
          previous ? correct - previous.correct : null,
        ),
      };
    }

    if (input.mode === "ranked" && nickname !== ANONYMOUS_NICKNAME) {
      const { data: clash } = await admin
        .from("daily_challenge_attempts")
        .select("identity_key")
        .eq("exam_slug", input.exam)
        .eq("subject_id", subject.id)
        .eq("quiz_date", dateKey)
        .eq("mode", "ranked")
        .eq("nickname", nickname)
        .maybeSingle();
      if (clash && clash.identity_key !== who.identity) {
        return {
          ...base,
          message:
            "오늘 이 과목에 이미 쓰인 이름입니다. 다른 이름을 적어 주세요.",
        };
      }
    }

    if (input.mode === "ranked") {
      const { data: existing } = await admin
        .from("daily_challenge_attempts")
        .select(
          "id, exam_slug, subject_id, quiz_date, mode, identity_key, nickname, correct, total, elapsed_ms, answers, created_at",
        )
        .eq("exam_slug", input.exam)
        .eq("subject_id", subject.id)
        .eq("quiz_date", dateKey)
        .eq("mode", "ranked")
        .eq("identity_key", who.identity)
        .maybeSingle();
      if (existing) {
        const row = existing as AttemptRow;
        const stats = await rankStats(
          admin,
          input.exam,
          subject.id,
          dateKey,
          row.correct,
          row.elapsed_ms,
        );
        const insights = buildInsights(
          beforeRows,
          getDailyPool(input.exam).filter(
            (question) => question.subjectId === subject.id,
          ),
          dateKey,
        );
        return {
          ...base,
          attemptId: row.id,
          saved: true,
          alreadyRanked: true,
          message:
            "오늘의 순위는 처음 기록 그대로입니다. 이번 풀이는 연습입니다.",
          report: makeReport(
            review,
            insights,
            stats.participants,
            stats.percentile,
            previous ? row.correct - previous.correct : null,
          ),
          share: {
            attemptId: row.id,
            nickname: row.nickname,
            correct: row.correct,
            total: row.total,
            elapsedMs: row.elapsed_ms,
            rank: stats.rank,
          },
        };
      }
    }

    const challengeId = validUuid(input.challengeId) ? input.challengeId : null;
    const { data: inserted, error } = await admin
      .from("daily_challenge_attempts")
      .insert({
        exam_slug: input.exam,
        subject_id: subject.id,
        quiz_date: dateKey,
        mode: input.mode,
        identity_key: who.identity,
        user_id: who.userId,
        nickname,
        correct,
        total: set.length,
        elapsed_ms: elapsedMs,
        question_ids: set.map((question) => question.id),
        answers: review.map((item) => ({
          id: item.id,
          picked: item.picked,
          ok: item.ok,
          confidence: item.confidence,
          challengeId,
        })),
      })
      .select("id")
      .single();

    if (error || !inserted) {
      return {
        ...base,
        message: "점수는 채점했지만 순위에 올리지 못했습니다.",
      };
    }

    const stats =
      input.mode === "ranked"
        ? await rankStats(
            admin,
            input.exam,
            subject.id,
            dateKey,
            correct,
            elapsedMs,
          )
        : { rank: null, participants: 0, percentile: null };
    const nextRows: AttemptRow[] = [
      {
        id: inserted.id,
        exam_slug: input.exam,
        subject_id: subject.id,
        quiz_date: dateKey,
        mode: input.mode,
        identity_key: who.identity,
        nickname,
        correct,
        total: set.length,
        elapsed_ms: elapsedMs,
        question_ids: set.map((question) => question.id),
        answers: review.map((item) => ({
          id: item.id,
          picked: item.picked,
          ok: item.ok,
          confidence: item.confidence,
          challengeId,
        })),
        created_at: new Date().toISOString(),
      },
      ...beforeRows,
    ];
    const insights = buildInsights(
      nextRows,
      getDailyPool(input.exam).filter(
        (question) => question.subjectId === subject.id,
      ),
      dateKey,
    );
    const report = makeReport(
      review,
      insights,
      stats.participants,
      stats.percentile,
      previous ? correct - previous.correct : null,
    );
    return {
      ...base,
      attemptId: inserted.id,
      rank: stats.rank,
      saved: true,
      report,
      message:
        input.mode === "practice"
          ? "추가 연습 기록은 공식 순위에 반영되지 않습니다."
          : null,
      share: {
        attemptId: inserted.id,
        nickname,
        correct,
        total: set.length,
        elapsedMs,
        rank: stats.rank,
      },
    };
  } catch {
    return { ...base, message: "점수는 채점했지만 순위에 올리지 못했습니다." };
  }
}

async function mineIdentity() {
  const jar = await cookies();
  const saved = jar.get("bom_daily_identity")?.value;
  if (saved) return saved;
  const user = await getUser();
  return user ? `user:${user.id}` : "";
}

export async function getTodayBoard(
  exam: string,
  subject: string,
  dateKey = getKSTDateString(),
): Promise<BoardRow[]> {
  if (!getDailyExam(exam)) return [];
  try {
    const mine = await mineIdentity();
    const admin = createAdminClient();
    const rows: Pick<
      AttemptRow,
      "nickname" | "identity_key" | "correct" | "total" | "elapsed_ms"
    >[] = [];
    const pageSize = 1000;
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await admin
        .from("daily_challenge_attempts")
        .select("nickname, identity_key, correct, total, elapsed_ms")
        .eq("exam_slug", exam)
        .eq("subject_id", subject)
        .eq("quiz_date", dateKey)
        .eq("mode", "ranked")
        .order("correct", { ascending: false })
        .order("elapsed_ms", { ascending: true })
        .range(from, from + pageSize - 1);
      if (error) break;
      const page = (data ?? []) as typeof rows;
      rows.push(...page);
      if (page.length < pageSize) break;
    }
    return rows.map((row, index) => ({
      rank: index + 1,
      nickname: row.nickname,
      correct: row.correct,
      total: row.total,
      elapsedMs: row.elapsed_ms,
      days: null,
      mine: row.identity_key === mine,
    }));
  } catch {
    return [];
  }
}

export async function getCumulativeBoard(
  exam: string,
  subject: string,
): Promise<BoardRow[]> {
  if (!getDailyExam(exam)) return [];
  try {
    const mine = await mineIdentity();
    const admin = createAdminClient();
    const rows: Pick<
      AttemptRow,
      | "nickname"
      | "identity_key"
      | "correct"
      | "total"
      | "quiz_date"
      | "elapsed_ms"
    >[] = [];
    const pageSize = 1000;
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await admin
        .from("daily_challenge_attempts")
        .select("nickname, identity_key, correct, total, quiz_date, elapsed_ms")
        .eq("exam_slug", exam)
        .eq("subject_id", subject)
        .eq("mode", "ranked")
        .order("quiz_date", { ascending: false })
        .range(from, from + pageSize - 1);
      if (error) break;
      const page = (data ?? []) as typeof rows;
      rows.push(...page);
      if (page.length < pageSize) break;
    }

    const grouped = new Map<
      string,
      { nickname: string; points: number; days: number; total: number }
    >();
    for (const row of rows) {
      const current = grouped.get(row.identity_key);
      if (!current) {
        grouped.set(row.identity_key, {
          nickname: row.nickname,
          points: row.correct,
          days: 1,
          total: row.total,
        });
      } else {
        current.points += row.correct;
        current.days += 1;
      }
    }

    return [...grouped.entries()]
      .sort(
        (a, b) =>
          b[1].points - a[1].points ||
          b[1].days - a[1].days ||
          a[1].nickname.localeCompare(b[1].nickname, "ko"),
      )
      .map(([identity, row], index) => ({
        rank: index + 1,
        nickname: row.nickname,
        correct: row.points,
        total: row.total,
        elapsedMs: null,
        days: row.days,
        mine: identity === mine,
      }));
  } catch {
    return [];
  }
}

export async function getDailyInsights(
  exam: string,
  subject: string,
  monthDateKey = getKSTDateString(),
): Promise<DailyInsights> {
  if (!getDailyExam(exam)) return emptyInsights();
  try {
    const identity = await mineIdentity();
    if (!identity) return emptyInsights();
    const admin = createAdminClient();
    const rows = await loadIdentityRows(admin, exam, subject, identity);
    const pool = getDailyPool(exam).filter(
      (question) => question.subjectId === subject,
    );
    return buildInsights(rows, pool, getKSTDateString(), monthDateKey);
  } catch {
    return emptyInsights();
  }
}

/** An authenticated member's attempted and remaining questions in the ten-year pool. */
export async function getDailyCoverage(
  exam: string,
  subject: string,
): Promise<DailyCoverage | null> {
  if (
    !getDailyExam(exam) ||
    !listDailySubjects(exam).some((item) => item.id === subject)
  ) return null;
  const user = await getUser();
  if (!user) return null;

  const pool = getDailyEligiblePool(exam, subject);
  const poolIds = pool.map((question) => question.id);
  const attempts: {
    quiz_date: string;
    question_ids: string[] | null;
    answers: unknown;
  }[] = [];
  const admin = createAdminClient();
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await admin
      .from("daily_challenge_attempts")
      .select("quiz_date, question_ids, answers")
      .eq("exam_slug", exam)
      .eq("subject_id", subject)
      .eq("user_id", user.id)
      .order("quiz_date", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, from + pageSize - 1);
    if (error) return null;
    const page = (data ?? []) as typeof attempts;
    attempts.push(...page);
    if (page.length < pageSize) break;
  }

  const seen = new Map<string, string>();
  for (const attempt of attempts) {
    const ids = attempt.question_ids?.length
      ? attempt.question_ids
      : safeAnswers(attempt.answers).map((answer) => answer.id);
    for (const id of ids) {
      if (!seen.has(id)) seen.set(id, attempt.quiz_date);
    }
  }
  const questions = pool
    .map((question) => ({
      id: question.id,
      year: question.year,
      sourceLabel: question.sourceLabel,
      stem: question.stem.slice(0, 160),
      href: question.href,
      solved: seen.has(question.id),
      lastDate: seen.get(question.id) ?? null,
    }))
    .sort((a, b) => b.year - a.year || a.sourceLabel.localeCompare(b.sourceLabel, "ko"));
  const yearMap = new Map<number, { year: number; total: number; solved: number }>();
  for (const question of questions) {
    const year = yearMap.get(question.year) ?? {
      year: question.year,
      total: 0,
      solved: 0,
    };
    year.total += 1;
    if (question.solved) year.solved += 1;
    yearMap.set(question.year, year);
  }
  const remainingIds = questions.filter((question) => !question.solved).map((question) => question.id);
  return {
    total: questions.length,
    solved: questions.length - remainingIds.length,
    remaining: remainingIds.length,
    daysToFinish: daysToCoverDailyIds(
      poolIds,
      remainingIds,
      getKSTDateString(),
      `${exam}:${subject}`,
      10,
    ),
    years: [...yearMap.values()].sort((a, b) => b.year - a.year),
    questions,
  };
}

export async function getDailyWrongNotebook(
  exam: string,
  subject: string,
): Promise<DailyWrongNotebook | null> {
  if (
    !getDailyExam(exam) ||
    !listDailySubjects(exam).some((item) => item.id === subject)
  ) return null;
  const user = await getUser();
  if (!user) return null;

  try {
    const admin = createAdminClient();
    const rows = await loadIdentityRows(admin, exam, subject, `user:${user.id}`);
    const pool = getDailyEligiblePool(exam, subject);
    const notebook = buildWrongNotebook(rows, pool, getKSTDateString());
    const [{ data: notes }, choiceStats] = await Promise.all([
      admin
        .from("daily_wrong_notes")
        .select("question_id, note, pinned")
        .eq("user_id", user.id)
        .eq("exam_slug", exam)
        .eq("subject_id", subject),
      loadChoiceStats(admin, exam, subject, `user:${user.id}`),
    ]);
    const noteMap = new Map(
      (notes ?? []).map((row) => [
        String(row.question_id),
        { note: String(row.note ?? ""), pinned: Boolean(row.pinned) },
      ]),
    );
    notebook.items = notebook.items
      .map((item) => {
        const stats = choiceStats.get(item.id);
        return {
          ...item,
          ...(noteMap.get(item.id) ?? {}),
          choiceStats:
            stats && stats.total >= 3
              ? {
                  total: stats.total,
                  choices: item.choices.map((choice) => {
                    const count = stats.counts.get(choice.key) ?? 0;
                    return {
                      key: choice.key,
                      count,
                      percent: Math.round((count / stats.total) * 100),
                    };
                  }),
                }
              : null,
        };
      })
      .sort(
        (a, b) =>
          Number(b.pinned) - Number(a.pinned) ||
          Number(b.due) - Number(a.due) ||
          Number(a.mastered) - Number(b.mastered) ||
          b.wrongCount - a.wrongCount ||
          b.lastWrongDate.localeCompare(a.lastWrongDate),
      );
    return notebook;
  } catch {
    return { summary: emptyWrongSummary(), weakPatterns: [], items: [] };
  }
}

export async function saveDailyWrongNote(input: {
  exam: string;
  subject: string;
  questionId: string;
  note: string;
  pinned: boolean;
}) {
  const user = await getUser();
  if (!user) return { ok: false as const, message: "로그인이 필요합니다." };
  if (
    !getDailyExam(input.exam) ||
    !listDailySubjects(input.exam).some((item) => item.id === input.subject) ||
    !getDailyEligiblePool(input.exam, input.subject).some(
      (question) => question.id === input.questionId,
    )
  ) {
    return { ok: false as const, message: "문제를 찾지 못했습니다." };
  }
  const note = input.note
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .trim()
    .slice(0, 1200);
  try {
    const admin = createAdminClient();
    if (!note && !input.pinned) {
      await admin
        .from("daily_wrong_notes")
        .delete()
        .eq("user_id", user.id)
        .eq("exam_slug", input.exam)
        .eq("subject_id", input.subject)
        .eq("question_id", input.questionId);
    } else {
      const { error } = await admin.from("daily_wrong_notes").upsert(
        {
          user_id: user.id,
          exam_slug: input.exam,
          subject_id: input.subject,
          question_id: input.questionId,
          note,
          pinned: input.pinned,
        },
        { onConflict: "user_id,exam_slug,subject_id,question_id" },
      );
      if (error) throw error;
    }
    revalidatePath(`/${input.exam}/daily/wrong`);
    return { ok: true as const };
  } catch {
    return { ok: false as const, message: "메모를 저장하지 못했습니다." };
  }
}

export async function getReviewQuestions(
  exam: string,
  subject: string,
  source = "due",
): Promise<DailyQuestionView[]> {
  if (!getDailyExam(exam)) return [];
  try {
    const identity = await mineIdentity();
    if (!identity) return [];
    const admin = createAdminClient();
    const rows = await loadIdentityRows(admin, exam, subject, identity);
    const pool = getDailyPool(exam).filter(
      (question) => question.subjectId === subject,
    );
    const graduationFor = graduationSourceId(source);
    if (graduationFor) {
      const attemptedIds = new Set(
        rows.flatMap((row) => safeAnswers(row.answers).map((answer) => answer.id)),
      );
      const question = pickGraduationQuestion(pool, graduationFor, attemptedIds);
      return question ? [toQuestionView(question)] : [];
    }
    if (source === "special") {
      const notebook = buildWrongNotebook(rows, pool, getKSTDateString());
      const byId = new Map(pool.map((question) => [question.id, question]));
      return notebook.items
        .filter((item) => !item.mastered)
        .slice(0, 10)
        .flatMap((item) =>
          byId.get(item.id) ? [toQuestionView(byId.get(item.id)!)] : [],
        );
    }
    let candidates: AttemptRow[] = [];
    if (validUuid(source)) {
      candidates = rows.filter((row) => row.id === source);
    } else {
      const today = getKSTDateString();
      const dueDates = new Set(
        REVIEW_INTERVALS.map((days) => shiftDate(today, -days)),
      );
      candidates = rows.filter(
        (row) => row.mode === "ranked" && dueDates.has(row.quiz_date),
      );
    }
    const ids: string[] = [];
    for (const row of candidates) {
      for (const answer of safeAnswers(row.answers)) {
        if (
          answer.ok === false &&
          !ids.includes(answer.id)
        ) {
          ids.push(answer.id);
        }
      }
    }
    const byId = new Map(
      pool.map((question) => [question.id, question]),
    );
    return ids
      .slice(0, 10)
      .flatMap((id) => (byId.get(id) ? [toQuestionView(byId.get(id)!)] : []));
  } catch {
    return [];
  }
}

export async function getFriendBoard(
  challengeId: string | undefined,
): Promise<BoardRow[]> {
  if (!validUuid(challengeId)) return [];
  try {
    const mine = await mineIdentity();
    const admin = createAdminClient();
    const { data: root } = await admin
      .from("daily_challenge_attempts")
      .select(
        "id, exam_slug, subject_id, quiz_date, mode, identity_key, nickname, correct, total, elapsed_ms, answers, created_at",
      )
      .eq("id", challengeId!)
      .eq("mode", "ranked")
      .maybeSingle();
    if (!root) return [];
    const origin = root as AttemptRow;
    const { data } = await admin
      .from("daily_challenge_attempts")
      .select(
        "id, exam_slug, subject_id, quiz_date, mode, identity_key, nickname, correct, total, elapsed_ms, answers, created_at",
      )
      .eq("exam_slug", origin.exam_slug)
      .eq("subject_id", origin.subject_id)
      .eq("quiz_date", origin.quiz_date)
      .eq("mode", "ranked")
      .limit(1000);
    const related = ((data ?? []) as AttemptRow[]).filter(
      (row) =>
        row.id === origin.id ||
        safeAnswers(row.answers).some(
          (answer) => answer.challengeId === challengeId,
        ),
    );
    return related
      .sort(
        (a, b) =>
          b.correct - a.correct ||
          a.elapsed_ms - b.elapsed_ms ||
          a.created_at.localeCompare(b.created_at),
      )
      .map((row, index) => ({
        rank: index + 1,
        nickname: row.nickname,
        correct: row.correct,
        total: row.total,
        elapsedMs: row.elapsed_ms,
        days: null,
        mine: row.identity_key === mine,
      }));
  } catch {
    return [];
  }
}

export async function getPublicAttempt(id: string) {
  if (!validUuid(id)) return null;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("daily_challenge_attempts")
      .select(
        "id, exam_slug, subject_id, quiz_date, mode, identity_key, nickname, correct, total, elapsed_ms, answers, created_at",
      )
      .eq("id", id)
      .maybeSingle();
    if (!data) return null;
    const row = data as AttemptRow;
    const meta = getDailyExam(row.exam_slug);
    if (!meta) return null;
    const pool = getDailyPool(row.exam_slug).filter(
      (question) => question.subjectId === row.subject_id,
    );
    const poolById = new Map(pool.map((question) => [question.id, question]));
    const answers = safeAnswers(row.answers);
    const answeredSet = answers.flatMap((answer) => {
      const question = poolById.get(answer.id);
      return question ? [question] : [];
    });
    const set =
      answeredSet.length > 0
        ? answeredSet
        : getDailySet(
            row.exam_slug,
            row.quiz_date,
            row.mode === "practice" ? "practice" : "ranked",
            row.subject_id,
          );
    const review = grade(
      set,
      answers.map((item) => ({
        id: item.id,
        key: item.picked ?? "",
        confidence: item.confidence,
      })),
    );
    const stats =
      row.mode === "ranked"
        ? await rankStats(
            admin,
            row.exam_slug,
            row.subject_id,
            row.quiz_date,
            row.correct,
            row.elapsed_ms,
          )
        : { rank: null, participants: 0, percentile: null };
    const identityRows = await loadIdentityRows(
      admin,
      row.exam_slug,
      row.subject_id,
      row.identity_key,
    );
    const previous = identityRows.find(
      (attempt) =>
        attempt.mode === "ranked" && attempt.quiz_date < row.quiz_date,
    );
    const insights = buildInsights(
      identityRows,
      pool,
      getKSTDateString(),
      row.quiz_date,
    );
    const subjectLabel =
      listDailySubjects(row.exam_slug).find(
        (item) => item.id === row.subject_id,
      )?.label ?? "";
    return {
      id: row.id,
      exam: row.exam_slug,
      subjectId: row.subject_id,
      subjectLabel,
      label: meta.label,
      home: meta.home,
      dateKey: row.quiz_date,
      mode: row.mode as "ranked" | "practice",
      nickname: row.nickname,
      correct: row.correct,
      total: row.total,
      elapsedMs: row.elapsed_ms,
      rank: stats.rank,
      report: makeReport(
        review,
        insights,
        stats.participants,
        stats.percentile,
        previous ? row.correct - previous.correct : null,
      ),
      review,
      roundHref: set[0]?.roundHref ?? meta.home,
    };
  } catch {
    return null;
  }
}

export async function getChallenger(id: string, exam: string) {
  const attempt = await getPublicAttempt(id);
  if (!attempt || attempt.exam !== exam || attempt.mode !== "ranked")
    return null;
  if (attempt.dateKey !== getKSTDateString()) return null;
  return {
    id: attempt.id,
    subjectId: attempt.subjectId,
    nickname: attempt.nickname,
    correct: attempt.correct,
    total: attempt.total,
  };
}

export async function viewerNickname() {
  const user = await getUser();
  return user?.nickname ?? "";
}

export async function getViewerDailyShareContext(
  exam: string,
  subject: string,
  dateKey = getKSTDateString(),
) {
  const empty = {
    inviterNickname: "",
    attempt: null as {
      attemptId: string;
      correct: number;
      total: number;
      participants: number;
    } | null,
  };
  if (
    !getDailyExam(exam) ||
    !listDailySubjects(exam).some((item) => item.id === subject) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)
  ) {
    return empty;
  }

  try {
    const user = await getUser();
    const jar = await cookies();
    const identity = user
      ? `user:${user.id}`
      : (jar.get("bom_daily_identity")?.value ?? "");
    const inviterNickname = user?.nickname ?? "";
    if (!identity) return { ...empty, inviterNickname };

    const admin = createAdminClient();
    const { data } = await admin
      .from("daily_challenge_attempts")
      .select("id, correct, total, elapsed_ms")
      .eq("exam_slug", exam)
      .eq("subject_id", subject)
      .eq("quiz_date", dateKey)
      .eq("mode", "ranked")
      .eq("identity_key", identity)
      .maybeSingle();
    if (!data) return { ...empty, inviterNickname };

    const stats = await rankStats(
      admin,
      exam,
      subject,
      dateKey,
      data.correct,
      data.elapsed_ms,
    );
    return {
      inviterNickname,
      attempt: {
        attemptId: data.id,
        correct: data.correct,
        total: data.total,
        participants: stats.participants,
      },
    };
  } catch {
    return empty;
  }
}
