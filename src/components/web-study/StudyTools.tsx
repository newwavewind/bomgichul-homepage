"use client";
import { useState } from "react";
import { useWebStudy, useSelectedExam } from "./useWebStudy";
import Link from "next/link";
import { trackWebFunnel } from "@/lib/web-funnel";
import { useMe } from "@/lib/client-session";
import {
  EXAM_CHOICES,
  readWebStudy,
  saveWebStudy,
  weeklyReport,
  calculatePlan,
  studyStreak,
  latestWrong,
  studyDay,
  type StudyPlan,
} from "@/lib/web-study";
export function StudyTools() {
  const { user, pending } = useMe();
  const actor = user?.id ?? "guest";
  if (pending) return <p role="status">학습 기록을 확인하고 있습니다…</p>;
  return <StudyToolsForUser key={actor} actor={actor} />;
}
function StudyToolsForUser({ actor }: { actor: string }) {
  const data = useWebStudy(actor);
  const selected = useSelectedExam();
  const [draft, setDraft] = useState<Partial<StudyPlan>>({});
  const scope = draft.scope ?? data.plan?.scope ?? selected ?? "real-estate";
  const deadline = draft.deadline ?? data.plan?.deadline ?? "";
  const minutes = draft.minutes ?? data.plan?.minutes ?? 30;
  const total = draft.total ?? data.plan?.total ?? 200;
  const [message, setMessage] = useState("");
  const report = weeklyReport(data.entries);
  const plan = data.plan ? calculatePlan(data.plan, data.entries) : null;
  const wrong = latestWrong(data.entries);
  const save = () => {
    if (
      !deadline ||
      deadline < studyDay() ||
      !Number.isInteger(minutes) ||
      minutes < 5 ||
      minutes > 720 ||
      !Number.isInteger(total) ||
      total < 1 ||
      total > 100000
    ) {
      setMessage(
        "오늘 이후 시험일, 하루 5~720분, 목표 1~100,000문항을 입력해 주세요.",
      );
      return;
    }
    const next: StudyPlan = {
      scope,
      deadline,
      minutes,
      total,
      started: data.plan?.scope === scope ? data.plan.started : studyDay(),
    };
    const ok = saveWebStudy(actor, { ...data, plan: next });
    setMessage(
      ok
        ? "계획을 저장했습니다. 남은 분량은 매일 다시 배분됩니다."
        : "저장하지 못했습니다. 브라우저 저장 공간을 확인해 주세요.",
    );
  };
  return (
    <div className="web-study-tools">
      <p>
        웹에서 학습한 기록을 기준으로 합니다. 이 브라우저에 계정별로 저장되며
        다른 기기·앱과 동기화되지 않습니다.
      </p>
      <section className="web-panel">
        <h2>최근 7일 학습 보고서</h2>
        <div className="web-stats">
          <p>
            학습일 <strong>{report.days}일</strong>
          </p>
          <p>
            연속 학습 <strong>{studyStreak(data.entries)}일</strong>
          </p>
          <p>
            풀이{" "}
            <strong>
              {report.current.filter((e) => e.result !== "read").length}문항
            </strong>
          </p>
          <p>
            정답률{" "}
            <strong>
              {report.accuracy === null ? "기록 없음" : `${report.accuracy}%`}
            </strong>
          </p>
        </div>
        <p>
          이전 7일 정답률:{" "}
          {report.previousAccuracy === null
            ? "기록 없음"
            : `${report.previousAccuracy}%`}
        </p>
        <p>
          개념 학습 {report.current.filter((e) => e.result === "read").length}건
          · 다시 푼 문항 {report.current.filter((e) => e.review).length}건
        </p>
        {Object.entries(report.reasons).map(([reason, count]) => (
          <p key={reason}>
            {reason}: {count}건
          </p>
        ))}
        <p>
          {wrong.length
            ? "다음 학습: 아래 오답 요약집에서 최근 틀린 문제부터 다시 확인하세요."
            : "문제를 풀거나 개념 회독을 완료하면 보고서가 쌓입니다."}
        </p>
      </section>
      <section className="web-panel">
        <h2>시험일까지 학습 계획</h2>
        <div className="web-form">
          <label>
            목표 시험
            <select
              value={scope}
              onChange={(e) => setDraft({ ...draft, scope: e.target.value })}
            >
              {EXAM_CHOICES.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            시험일
            <input
              type="date"
              min={studyDay()}
              onInput={(e) =>
                setDraft({ ...draft, deadline: e.currentTarget.value })
              }
              value={deadline}
              onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
            />
          </label>
          <label>
            하루 공부 시간(분)
            <input
              type="number"
              min="5"
              max="720"
              value={minutes}
              onChange={(e) =>
                setDraft({ ...draft, minutes: Number(e.target.value) })
              }
            />
          </label>
          <label>
            목표 문제 수
            <input
              type="number"
              min="1"
              max="100000"
              value={total}
              onChange={(e) =>
                setDraft({ ...draft, total: Number(e.target.value) })
              }
            />
          </label>
        </div>
        <button className="web-primary" onClick={save}>
          계획 저장
        </button>
        <p role="status">{message}</p>
        {plan && (
          <div>
            <p>
              완료 {plan.done}문항 · 남은 {plan.remaining}문항 · {plan.days}일
            </p>
            <p>
              {plan.days
                ? `오늘 권장 ${plan.daily}문항 · 예상 ${plan.estimatedMinutes}분`
                : "시험일이 지났습니다. 새 시험일을 설정해 주세요."}
            </p>
            {plan.overloaded && (
              <p>
                문항당 2분으로 추정하면 설정한 시간을 초과합니다. 목표
                분량·시간·시험일을 조정해 주세요.
              </p>
            )}
            <Link href={`/${data.plan!.scope}`}>목표 시험 공부하기 →</Link>
          </div>
        )}
      </section>
      <section className="web-panel web-summary">
        <h2>시험 직전 오답 요약집</h2>
        <p>
          최근 기록이 오답인 문제를 반복 오답 순으로 정리했습니다. 인쇄 화면에서
          PDF로 저장할 수 있습니다.
        </p>
        <button
          className="web-primary print:hidden"
          onClick={() => window.print()}
          disabled={!wrong.length}
        >
          요약집 인쇄 / PDF 저장
        </button>
        {!wrong.length && (
          <p>저장된 오답이 없습니다. 문제를 풀면 자동으로 모입니다.</p>
        )}
        <ol>
          {wrong.map((entry) => (
            <li key={entry.id} className="web-summary-item">
              <Link
                href={entry.href}
                onClick={() =>
                  trackWebFunnel("web_review_started", {
                    scope: entry.scope,
                    candidate_count: wrong.length,
                  })
                }
              >
                {entry.title}
              </Link>
              <p>
                {entry.day} · {entry.reason || "오답 이유 미선택"} · 누적 오답{" "}
                {entry.wrongCount ?? 1}회
              </p>
              {entry.answerSummary && (
                <p className="whitespace-pre-wrap">{entry.answerSummary}</p>
              )}
              <label>
                요약 메모
                <textarea
                  defaultValue={entry.note || ""}
                  onBlur={(e) => {
                    const next = readWebStudy(actor);
                    const index = next.entries.findLastIndex(
                      (row) => row.id === entry.id,
                    );
                    if (index >= 0) {
                      next.entries[index].note = e.target.value;
                      const ok = saveWebStudy(actor, next);
                      setMessage(
                        ok
                          ? "요약 메모 저장됨"
                          : "요약 메모를 저장하지 못했습니다.",
                      );
                    }
                  }}
                />
              </label>
              <p className="web-print-note">{entry.note || ""}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
