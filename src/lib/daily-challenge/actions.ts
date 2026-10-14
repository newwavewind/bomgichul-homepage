"use server";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getUser } from "@/lib/auth";
import { ANONYMOUS_NICKNAME, cleanNickname, getDailyExam } from "@/lib/daily-challenge/exams";
import { getDailySet, listDailySubjects } from "@/lib/daily-challenge/pool";
import type { BoardRow, DailyQuestion, DailyReviewItem, DailyScore } from "@/lib/daily-challenge/types";
import { getKSTDateString } from "@/lib/exam";
import { createAdminClient } from "@/lib/supabase/admin";

const SLOW_MS = 30 * 60 * 1000;

type AttemptRow = {
  id: string;
  exam_slug: string;
  quiz_date: string;
  mode: string;
  identity_key: string;
  nickname: string;
  correct: number;
  total: number;
  elapsed_ms: number;
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

function cookieName(slug: string, mode: string, subject: string) {
  return `bom_daily_${mode}_${slug}_${subject}`.replace(/[^a-z0-9_]/gi, "_");
}

function cleanDevice(id: string) {
  const text = id.trim();
  if (!/^[0-9a-f-]{16,80}$/i.test(text)) return "invalid";
  return text;
}

async function identityFor(deviceId: string) {
  const user = await getUser();
  if (user) return { identity: `user:${user.id}`, userId: user.id, profileName: user.nickname };
  return { identity: `device:${cleanDevice(deviceId)}`, userId: null as string | null, profileName: "" };
}

function readElapsed(value: string | undefined, exam: string, dateKey: string, mode: string, subject: string, identity: string) {
  if (!value) return SLOW_MS;
  const parts = value.split("|");
  if (parts.length !== 7) return SLOW_MS;
  const [cookieExam, cookieDate, cookieMode, cookieSubject, cookieIdentity, ts, sig] = parts;
  const body = [cookieExam, cookieDate, cookieMode, cookieSubject, cookieIdentity, ts].join("|");
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return SLOW_MS;
  if (cookieExam !== exam || cookieDate !== dateKey || cookieMode !== mode || cookieSubject !== subject || cookieIdentity !== identity) {
    return SLOW_MS;
  }
  const started = Number(ts);
  if (!Number.isFinite(started)) return SLOW_MS;
  const elapsed = Date.now() - started;
  if (elapsed < 1000) return SLOW_MS;
  return Math.min(elapsed, SLOW_MS);
}

function grade(set: DailyQuestion[], picks: { id: string; key: string }[]): DailyReviewItem[] {
  const picked = new Map(picks.map((item) => [item.id, item.key]));
  return set.map((question) => {
    const key = picked.get(question.id) ?? "";
    const choice = question.choices.find((item) => item.key === key);
    const answers = question.choices.filter((item) => question.correctKeys.includes(item.key));
    return {
      id: question.id,
      stem: question.stem,
      sourceLabel: question.sourceLabel,
      href: question.href,
      picked: key,
      pickedLabel: choice?.label ?? "",
      answerLabel: answers.map((item) => item.label).join(", "),
      explanation: question.explanation,
      ok: question.correctKeys.includes(key),
    };
  });
}

export async function startDailyAttempt(input: { exam: string; subject: string; mode: "ranked" | "practice"; deviceId: string }) {
  const subject = listDailySubjects(input.exam).find((item) => item.id === input.subject);
  if (!getDailyExam(input.exam) || !subject) return { ok: false as const, message: "과목을 찾지 못했습니다." };
  const who = await identityFor(input.deviceId);
  const dateKey = getKSTDateString();
  const ts = Date.now();
  const body = [input.exam, dateKey, input.mode, subject.id, who.identity, String(ts)].join("|");
  const jar = await cookies();
  jar.set(cookieName(input.exam, input.mode, subject.id), `${body}|${sign(body)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 6,
  });
  jar.set("bom_daily_identity", who.identity, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  });
  return { ok: true as const, dateKey, defaultNickname: who.profileName };
}

export async function submitDailyAttempt(input: {
  exam: string;
  subject: string;
  mode: "ranked" | "practice";
  deviceId: string;
  nickname: string;
  picks: { id: string; key: string }[];
}): Promise<DailyScore | { ok: false; message: string }> {
  const meta = getDailyExam(input.exam);
  const subject = listDailySubjects(input.exam).find((item) => item.id === input.subject);
  if (!meta || !subject || (input.mode !== "ranked" && input.mode !== "practice")) {
    return { ok: false, message: "과목을 찾지 못했습니다." };
  }
  const dateKey = getKSTDateString();
  const set = getDailySet(input.exam, dateKey, input.mode, subject.id);
  if (set.length === 0) return { ok: false, message: "오늘 문제를 만들지 못했습니다." };

  const who = await identityFor(input.deviceId);
  const jar = await cookies();
  const elapsedMs = readElapsed(
    jar.get(cookieName(input.exam, input.mode, subject.id))?.value,
    input.exam,
    dateKey,
    input.mode,
    subject.id,
    who.identity,
  );
  const nickname = cleanNickname(input.nickname || who.profileName);
  const review = grade(set, input.picks ?? []);
  const correct = review.filter((item) => item.ok).length;
  const roundHref = set[0]?.roundHref ?? meta.home;

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
          message: "오늘 이 과목에 이미 쓰인 이름입니다. 다른 이름을 적어 주세요.",
        };
      }
    }

    if (input.mode === "ranked") {
      const { data: existing } = await admin
        .from("daily_challenge_attempts")
        .select("id, nickname, correct, total, elapsed_ms")
        .eq("exam_slug", input.exam)
        .eq("subject_id", subject.id)
        .eq("quiz_date", dateKey)
        .eq("mode", "ranked")
        .eq("identity_key", who.identity)
        .maybeSingle();
      if (existing) {
        const rank = await todayRank(admin, input.exam, subject.id, dateKey, existing.correct, existing.elapsed_ms);
        return {
          ...base,
          attemptId: existing.id,
          saved: true,
          alreadyRanked: true,
          message: "오늘의 순위는 처음 기록 그대로입니다. 이번 풀이는 연습입니다.",
          share: {
            attemptId: existing.id,
            nickname: existing.nickname,
            correct: existing.correct,
            total: existing.total,
            elapsedMs: existing.elapsed_ms,
            rank,
          },
        };
      }
    }

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
        answers: review.map((item) => ({ id: item.id, picked: item.picked, ok: item.ok })),
      })
      .select("id")
      .single();

    if (error || !inserted) {
      return { ...base, message: "점수는 채점했지만 순위에 올리지 못했습니다." };
    }

    const rank = input.mode === "ranked"
      ? await todayRank(admin, input.exam, subject.id, dateKey, correct, elapsedMs)
      : null;
    return {
      ...base,
      attemptId: inserted.id,
      rank,
      saved: true,
      share: { attemptId: inserted.id, nickname, correct, total: set.length, elapsedMs, rank },
    };
  } catch {
    return { ...base, message: "점수는 채점했지만 순위에 올리지 못했습니다." };
  }
}

async function todayRank(
  admin: ReturnType<typeof createAdminClient>,
  exam: string,
  subject: string,
  dateKey: string,
  correct: number,
  elapsedMs: number,
) {
  const { count: betterCorrect } = await admin
    .from("daily_challenge_attempts")
    .select("id", { count: "exact", head: true })
    .eq("exam_slug", exam)
    .eq("subject_id", subject)
    .eq("quiz_date", dateKey)
    .eq("mode", "ranked")
    .gt("correct", correct);
  const { count: fasterTie } = await admin
    .from("daily_challenge_attempts")
    .select("id", { count: "exact", head: true })
    .eq("exam_slug", exam)
    .eq("subject_id", subject)
    .eq("quiz_date", dateKey)
    .eq("mode", "ranked")
    .eq("correct", correct)
    .lt("elapsed_ms", elapsedMs);
  return (betterCorrect ?? 0) + (fasterTie ?? 0) + 1;
}

async function mineIdentity() {
  const jar = await cookies();
  return jar.get("bom_daily_identity")?.value ?? "";
}

export async function getTodayBoard(exam: string, subject: string): Promise<BoardRow[]> {
  if (!getDailyExam(exam)) return [];
  try {
  const mine = await mineIdentity();
  const admin = createAdminClient();
  const { data } = await admin
    .from("daily_challenge_attempts")
    .select("nickname, identity_key, correct, total, elapsed_ms")
    .eq("exam_slug", exam)
    .eq("subject_id", subject)
    .eq("quiz_date", getKSTDateString())
    .eq("mode", "ranked")
    .order("correct", { ascending: false })
    .order("elapsed_ms", { ascending: true })
    .limit(200);
  return ((data ?? []) as Pick<AttemptRow, "nickname" | "identity_key" | "correct" | "total" | "elapsed_ms">[]).map(
    (row, index) => ({
      rank: index + 1,
      nickname: row.nickname,
      correct: row.correct,
      total: row.total,
      elapsedMs: row.elapsed_ms,
      days: null,
      mine: row.identity_key === mine,
    }),
  );
  } catch {
    return [];
  }
}

export async function getCumulativeBoard(exam: string, subject: string): Promise<BoardRow[]> {
  if (!getDailyExam(exam)) return [];
  try {
  const mine = await mineIdentity();
  const admin = createAdminClient();
  const { data } = await admin
    .from("daily_challenge_attempts")
    .select("nickname, identity_key, correct, total, quiz_date")
    .eq("exam_slug", exam)
    .eq("subject_id", subject)
    .eq("mode", "ranked")
    .order("quiz_date", { ascending: false })
    .limit(5000);

  const grouped = new Map<string, { nickname: string; points: number; days: number; total: number }>();
  for (const row of (data ?? []) as { nickname: string; identity_key: string; correct: number; total: number }[]) {
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
    .sort((a, b) => b[1].points - a[1].points || b[1].days - a[1].days || a[1].nickname.localeCompare(b[1].nickname, "ko"))
    .slice(0, 200)
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

export async function getPublicAttempt(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  try {
  const admin = createAdminClient();
  const { data } = await admin
    .from("daily_challenge_attempts")
    .select("id, exam_slug, subject_id, quiz_date, mode, nickname, correct, total, elapsed_ms, answers")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  const row = data as {
    id: string;
    exam_slug: string;
    subject_id: string;
    quiz_date: string;
    mode: "ranked" | "practice";
    nickname: string;
    correct: number;
    total: number;
    elapsed_ms: number;
    answers: { id: string; picked: string }[];
  };
  const meta = getDailyExam(row.exam_slug);
  if (!meta) return null;
  const set = getDailySet(row.exam_slug, row.quiz_date, row.mode === "practice" ? "practice" : "ranked", row.subject_id);
  const review = grade(set, (row.answers ?? []).map((item) => ({ id: item.id, key: item.picked })));
  const rank = row.mode === "ranked"
    ? await todayRank(admin, row.exam_slug, row.subject_id, row.quiz_date, row.correct, row.elapsed_ms)
    : null;
  const subjectLabel = listDailySubjects(row.exam_slug).find((item) => item.id === row.subject_id)?.label ?? "";
  return {
    id: row.id,
    exam: row.exam_slug,
    subjectId: row.subject_id,
    subjectLabel,
    label: meta.label,
    home: meta.home,
    dateKey: row.quiz_date,
    mode: row.mode,
    nickname: row.nickname,
    correct: row.correct,
    total: row.total,
    elapsedMs: row.elapsed_ms,
    rank,
    review,
    roundHref: set[0]?.roundHref ?? meta.home,
  };
  } catch {
    return null;
  }
}

export async function getChallenger(id: string, exam: string) {
  const attempt = await getPublicAttempt(id);
  if (!attempt || attempt.exam !== exam || attempt.mode !== "ranked") return null;
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
