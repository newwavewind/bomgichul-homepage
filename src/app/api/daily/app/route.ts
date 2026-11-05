import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { withDailyActor, type DailyActor } from "@/lib/daily-challenge/daily-actor";
import {
  ANONYMOUS_NICKNAME,
  cleanNickname,
  getDailyExam,
} from "@/lib/daily-challenge/exams";
import {
  getDailyEligiblePool,
  getDailySetWithSchedule,
  listDailySubjects,
} from "@/lib/daily-challenge/pool";
import {
  getCumulativeBoard,
  getDailyInsights,
  getTodayBoard,
  startDailyAttempt,
  submitDailyAttempt,
} from "@/lib/daily-challenge/actions";
import {
  DAILY_ARCHIVE_START_DATE,
  daysToCoverDailyIds,
} from "@/lib/daily-challenge/pick";
import { getKSTDateString } from "@/lib/exam";
import { parseQuestionStem } from "@/lib/exam-stem";

function tableCell(cell: unknown): string {
  if (typeof cell === "string") return cell;
  if (cell && typeof cell === "object" && "text" in cell) {
    return String((cell as { text?: unknown }).text ?? "");
  }
  return "";
}

function questionTables(table: unknown) {
  const list = Array.isArray(table) ? table : table ? [table] : [];
  return list.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as {
      headers?: unknown[];
      rows?: unknown[];
      caption?: string;
      lead?: string;
      notes?: unknown[];
    };
    const headers = Array.isArray(row.headers) ? row.headers.map(tableCell) : [];
    const rows = Array.isArray(row.rows)
      ? row.rows.flatMap((line) => (Array.isArray(line) ? [line.map(tableCell)] : []))
      : [];
    if (!headers.length && !rows.length) return [];
    return [{
      caption: row.caption || "",
      lead: typeof row.lead === "string" ? row.lead : "",
      headers,
      rows,
      notes: Array.isArray(row.notes) ? row.notes.map((note) => String(note)) : [],
    }];
  });
}

const ALLOW_HEADERS = "authorization, content-type";

function cors(request: Request) {
  const origin = request.headers.get("origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": ALLOW_HEADERS,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function json(request: Request, body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: cors(request) });
}

function requestedDate(value: unknown, today: string) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return today;
  if (value < DAILY_ARCHIVE_START_DATE || value > today) return today;
  return value;
}

export function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: cors(request) });
}

function guestFromNickname(value: unknown): DailyActor | null {
  if (typeof value !== "string") return null;
  const nickname = cleanNickname(value);
  if (nickname === ANONYMOUS_NICKNAME) return null;
  const key = nickname.normalize("NFKC").toLowerCase().replace(/\s+/g, "");
  return { id: "", nickname, guestIdentity: `nick:${key}` };
}

async function actorFromRequest(request: Request): Promise<DailyActor | null> {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return null;
  const admin = createAdminClient();
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) {
    throw new Error("로그인이 만료되었습니다. 다시 로그인해 주세요.");
  }
  const { data: profile } = await admin
    .from("profiles")
    .select("nickname, username_set")
    .eq("id", data.user.id)
    .maybeSingle();
  const nickname =
    profile?.username_set && typeof profile.nickname === "string"
      ? profile.nickname
      : "";
  return { id: data.user.id, nickname };
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return json(request, { ok: false, message: "요청을 읽지 못했습니다." }, 400);
  }

  const examSlug = typeof payload.examSlug === "string" ? payload.examSlug : "";
  const subjectId = typeof payload.subjectId === "string" ? payload.subjectId : "";
  const deviceId = typeof payload.deviceId === "string" ? payload.deviceId : "";
  const exam = getDailyExam(examSlug);
  const subject = listDailySubjects(examSlug).find((row) => row.id === subjectId);
  if (!exam || !subject || !deviceId) {
    return json(request, { ok: false, message: "시험이나 과목을 확인하지 못했습니다." }, 400);
  }

  let actor: DailyActor | null = null;
  try {
    actor = await actorFromRequest(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "로그인을 확인하지 못했습니다.";
    return json(request, { ok: false, message }, 401);
  }

  const run = async () => {
    const action = typeof payload.action === "string" ? payload.action : "open";
    if (action === "submit") {
      const score = await submitDailyAttempt({
        exam: examSlug,
        subject: subjectId,
        mode: "ranked",
        deviceId,
        nickname: typeof payload.nickname === "string" ? payload.nickname : "",
        timerToken: typeof payload.timerToken === "string" ? payload.timerToken : "",
        picks: Array.isArray(payload.picks)
          ? payload.picks.filter(
              (row): row is { id: string; key: string } =>
                !!row &&
                typeof row === "object" &&
                typeof (row as { id?: unknown }).id === "string" &&
                typeof (row as { key?: unknown }).key === "string",
            )
          : [],
      });
      const date = getKSTDateString();
      const [today, cumulative] = await Promise.all([
        getTodayBoard(examSlug, subjectId, date),
        getCumulativeBoard(examSlug, subjectId),
      ]);
      return { ...score, signedIn: Boolean(actor), today, cumulative };
    }

    const todayDate = getKSTDateString();
    const date = requestedDate(payload.dateKey, todayDate);
    const archive = date !== todayDate;
    const started = archive
      ? { ok: true as const, dateKey: date, defaultNickname: "", timerToken: "" }
      : await startDailyAttempt({
          exam: examSlug,
          subject: subjectId,
          mode: "ranked",
          deviceId,
          timerToken: typeof payload.timerToken === "string" ? payload.timerToken : "",
        });
    const questionSet = getDailySetWithSchedule(examSlug, date, "ranked", subjectId);
    const questions = questionSet.map((view) => {
      const presentation = view.presentation || {};
      const passage =
        (typeof presentation.passageText === "string" && presentation.passageText) ||
        (typeof presentation.passage === "string" && presentation.passage) ||
        "";
      const parsedStem = parseQuestionStem(view.stem);
      return {
        id: view.id,
        stem: parsedStem.boxLines.length ? parsedStem.intro : view.stem,
        stemBoxLines: parsedStem.boxLines,
        passage,
        notice: presentation.notice || "",
        stemTail: presentation.stemTail || "",
        nextDateKey: view.nextDateKey,
        promptItems: (presentation.promptItems || []).map((item) => ({
          key: item.key,
          label: item.label,
          text: item.text,
        })),
        sourceLabel: view.sourceLabel,
        tables: questionTables(presentation.table),
        choices: view.choices.map((choice) => ({
          key: choice.key,
          label: choice.label,
          text: choice.text,
        })),
      };
    });
    const eligiblePool = getDailyEligiblePool(examSlug, subjectId);
    const eligibleYears = eligiblePool.map((question) => question.year);
    const eligibleIds = eligiblePool.map((question) => question.id);
    const insights = await getDailyInsights(examSlug, subjectId, date);
    const [today, cumulative] = await Promise.all([
      getTodayBoard(examSlug, subjectId, date),
      getCumulativeBoard(examSlug, subjectId),
    ]);
    return {
      ...started,
      date,
      todayDate,
      archiveStart: DAILY_ARCHIVE_START_DATE,
      archive,
      subjectLabel: subject.label,
      signedIn: Boolean(actor),
      calendar: insights.calendar,
      practice: { streak: insights.streak, monthDone: insights.monthDone },
      composition: {
        yearSpan: eligibleYears.length
          ? Math.max(...eligibleYears) - Math.min(...eligibleYears) + 1
          : 0,
        poolCount: eligiblePool.length,
        topics: new Set(questionSet.map((view) => view.subcategory || view.category)).size,
        rotationDays: Math.ceil(eligiblePool.length / 10),
        daysFromToday: daysToCoverDailyIds(
          eligibleIds,
          eligibleIds,
          todayDate,
          `${examSlug}:${subjectId}`,
          10,
        ),
      },
      questions,
      today,
      cumulative,
    };
  };

  try {
    const bound = actor ?? guestFromNickname(payload.nickname);
    const result = bound ? await withDailyActor(bound, run) : await run();
    return json(request, result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "매일 10문제를 열지 못했습니다.";
    return json(request, { ok: false, message }, 500);
  }
}
