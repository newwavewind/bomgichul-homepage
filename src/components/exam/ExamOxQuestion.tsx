"use client";

import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { DailyChoiceBadge } from "@/components/daily/DailyChoiceBadge";
import { useMe, fetchMe } from "@/lib/client-session";
import { LoginSoftNudge } from "@/components/auth/LoginSoftNudge";
import {
  bumpAnonAttemptCount,
  dismissProgressNudge,
  getAnonProgressNudge,
  getServerAnonProgressNudge,
  subscribeAnonProgress,
} from "@/lib/login-nudges";
import { CitedText } from "@/components/exam/CitedText";
import { recordWebStudy, scopeForPath, type StudyEntry } from "@/lib/web-study";
import { trackEvent } from "@/lib/analytics";
import { plainStudyText } from "@/lib/study-text";
import { renderStudyText } from "@/lib/underlined-text";
import { hasNativeEnterAction, questionShortcutTarget } from "@/lib/question-shortcuts";
import { ExamReferenceList } from "@/components/exam/ExamReferenceList";
import type { ExamReferenceEntry } from "@/lib/exam-questions";
import {
  getOxComboTable,
  jamoHeadersFromItems,
} from "@/lib/ox-combo-table";

export type ExamOxItem = {
  key: string;
  label?: string;
  text: string;
  answer?: string;
  explanation?: string;
  /** 그래프·도면처럼 글이 아닌 선지 — 산업안전지도사·공인노무사 몇 문항 */
  image?: string;
  /** 선지 글 안 밑줄 자리 `[시작, 끝)` — 「밑줄 친 부분이 …」 문항(국어·영어) */
  underlines?: [number, number][];
};

export type ExamAnswerState = {
  selected: number | null;
  revealed: boolean;
};

const UNANSWERED: ExamAnswerState = { selected: null, revealed: false };

export type ExamOxCombo = {
  no: number;
  label: string;
  text: string;
  isCorrect?: boolean;
  explanation?: string;
};

/** 공무원형 기출 상세 UI (공인중개사·경찰·주택관리사 공통) */
export function ExamOxQuestion({
  examId,
  revealEvent,
  items,
  correctChoice,
  correctChoices,
  examDate,
  lawVersions,
  explanationSummary,
  comboChoices = [],
  referenceEntries,
  passageLead = [],
  passageLabel,
  choiceHeaders = [],
  initialAttemptResult = null,
  onAttempt,
  renderExplanation = true,
  keyboardShortcuts = false,
  answerState,
  onAnswerStateChange,
  userId,
  loginNext,
}: {
  examId: string;
  revealEvent?: { subject: string; year: number; questionNo: number };
  items: ExamOxItem[];
  correctChoice?: number;
  /** 복수정답·전항정답 — 있으면 correctChoice 대신 이 목록 가운데 무엇을 골라도 정답이다 */
  correctChoices?: number[];
  /** 시험일과 그날 판 조문 주소(열쇠 「법|조」) — 해설 근거 링크를 시험 당시 판으로 연다 */
  examDate?: string;
  lawVersions?: Record<string, string>;
  explanationSummary?: string;
  comboChoices?: ExamOxCombo[];
  referenceEntries?: ExamReferenceEntry[];
  /** 보기 상자에서 ㉠ 앞에 놓인 도입부. 지문과 한 문장으로 이어지는 자리다. */
  passageLead?: string[];
  passageLabel?: string;
  choiceHeaders?: string[];
  initialAttemptResult?: "correct" | "wrong" | null;
  onAttempt?: (result: "correct" | "wrong") => void | Promise<void>;
  renderExplanation?: boolean;
  keyboardShortcuts?: boolean;
  answerState?: ExamAnswerState;
  onAnswerStateChange?: (answer: ExamAnswerState) => void;
  /**
   * null 확정 비로그인 — 진도·오답 유도 배너를 켠다.
   * 생략하면(정적 문항 페이지) /api/me 로 스스로 해결한다.
   */
  userId?: string | null;
  loginNext?: string;
}) {
  const pathname = usePathname();
  const me = useMe();
  // 판정 중(pending)에는 익명 취급하지 않는다 — 로그인해 둔 사람에게
  // 로그인 유도 배너가 깜빡 나타나면 안 된다. 익명은 판정이 끝난 뒤 확정된다.
  const isAnon = userId === undefined ? !me.pending && !me.user : userId === null;
  const loginHref = `/login?next=${encodeURIComponent(loginNext ?? pathname ?? "/")}`;
  const actor = (userId === undefined ? me.user?.id : userId) ?? "guest";
  const questionHref = loginNext ?? pathname;
  const journalId = `${questionHref}#${examId}`;
  const isComposite = comboChoices.length > 0;
  const choicesRef = useRef<HTMLDivElement>(null);
  const choiceNumbers = isComposite
    ? comboChoices.map((choice) => choice.no)
    : items.map((item, index) => Number(item.key || index + 1));
  const shortcutNumbers = keyboardShortcuts
    ? choiceNumbers.filter((choice) => Number.isInteger(choice) && choice >= 1 && choice <= 9)
    : [];
  const firstShortcut = shortcutNumbers[0];
  const lastShortcut = shortcutNumbers[shortcutNumbers.length - 1];
  const hasShortcutRange = shortcutNumbers.length > 1 &&
    shortcutNumbers.every((choice, index) => choice === firstShortcut + index);
  const oxComboTable = isComposite
    ? (() => {
        const headers = jamoHeadersFromItems(items);
        if (!headers) return null;
        return getOxComboTable(
          headers,
          comboChoices.map((choice) => choice.text),
        );
      })()
    : null;
  const [localAnswer, setLocalAnswer] = useState(UNANSWERED);
  const { selected, revealed } = answerState ?? localAnswer;
  const updateAnswer = onAnswerStateChange ?? setLocalAnswer;
  const selectChoice = (choice: number) => updateAnswer({ selected: choice, revealed: false });
  // 해설을 이 컴포넌트가 그릴 때(랜덤 문제 등) 채점 뒤 각 선지 아래에 그 선지 해설을 붙인다
  const inlineExplanation = renderExplanation && revealed;
  const [previousExamId, setPreviousExamId] = useState(examId);
  if (previousExamId !== examId) {
    setPreviousExamId(examId);
    setLocalAnswer(UNANSWERED);
  }
  const showProgressNudge = useSyncExternalStore(
    subscribeAnonProgress,
    getAnonProgressNudge,
    getServerAnonProgressNudge,
  );
  // 확정답안이 둘 이상을 정답으로 인정한 문항(복수정답·전항정답)은 그 가운데 무엇을 골라도 정답이다.
  // 번호 하나만 보면 공식 정답을 골랐는데 오답이 뜬다 — 앱 채점기(getCorrectChoiceNos)와 같게 본다.
  const acceptedChoices =
    correctChoices && correctChoices.length ? correctChoices : correctChoice !== undefined ? [correctChoice] : [];
  const hasAnswerKey = acceptedChoices.length > 0;
  const allAccepted =
    acceptedChoices.length > 1 && acceptedChoices.length >= (isComposite ? comboChoices.length : items.length);
  const answerLabel = allAccepted ? "모든 번호(전항정답)" : `${acceptedChoices.join("·")}번`;
  const isCorrect = selected !== null && acceptedChoices.includes(selected);
  const answeredWrong =
    revealed &&
    (selected === null
      ? initialAttemptResult === "wrong"
      : hasAnswerKey && !acceptedChoices.includes(selected));

  /**
   * 채점은 한 번뿐이고 되돌리지 않는다.
   *
   * 예전에는 같은 단추가 「정답 확인 ↔ 해설 접기」로 오갔는데, 접을 이유가
   * 없다 — 답을 본 뒤에 다시 가리면 이미 본 것이 안 보이게 될 뿐이고, 그
   * 상태에서 할 수 있는 일도 없다. 앱에도 그 단추는 없다.
   */
  const reveal = () => {
    if (revealed) return;
    updateAnswer({ selected, revealed: true });
    if (selected !== null && hasAnswerKey) {
      const result = acceptedChoices.includes(selected) ? "correct" : "wrong";
      const entry: Omit<StudyEntry,"day"> = {id: journalId, href: questionHref, title: document.querySelector("h1")?.textContent || examId, scope: scopeForPath(pathname), result,
        answerSummary: [`정답: ${answerLabel}`, explanationSummary, ...items.filter(item => item.explanation).map(item => `${item.label ?? item.key}: ${plainStudyText(item.explanation!)}`)].filter(Boolean).join("\n")};
      if(userId === undefined && me.pending) void fetchMe().then(session => recordWebStudy(session.user?.id ?? "guest", entry));
      else recordWebStudy(actor, entry);
      trackEvent("web_question_completed", {scope:scopeForPath(pathname),result});
    }
    if (isAnon) bumpAnonAttemptCount();
    if (selected !== null && hasAnswerKey) {
      void onAttempt?.(acceptedChoices.includes(selected) ? "correct" : "wrong");
    }
    // 아래 해설 details 를 함께 연다
    if (revealEvent) {
      window.dispatchEvent(
        new CustomEvent("exam:answer_revealed", {
          detail: { ...revealEvent, open: true, selectedChoice: selected, incorrect: selected !== null && hasAnswerKey && !isCorrect },
        })
      );
    }
  };

  const handleShortcut = useEffectEvent((event: KeyboardEvent) => {
    const { key } = event;
    const target = questionShortcutTarget(event);
    const article = choicesRef.current?.closest("article");
    if (!target || !article) return;
    if (target !== document.body && target !== document.documentElement && !article.contains(target)) return;

    if (key === "ArrowLeft" || key === "ArrowRight") {
      const navigation = article.querySelector<HTMLElement>(
        `nav :is(a[href], button:not(:disabled))[aria-keyshortcuts="${key}"]`,
      );
      if (!navigation) return;
      event.preventDefault();
      navigation.click();
      return;
    }

    if (revealed) return;
    if (key === "Enter") {
      // A focused control still gets its native Enter behavior.
      if (selected === null || hasNativeEnterAction(target)) return;
      event.preventDefault();
      reveal();
      return;
    }

    const choiceButton = choicesRef.current?.querySelector<HTMLButtonElement>(
      'button[aria-keyshortcuts="' + key + '"]',
    );
    if (!choiceButton) return;
    event.preventDefault();
    selectChoice(Number(key));
    choiceButton.focus({ preventScroll: true });
    choiceButton.scrollIntoView({ block: "nearest" });
  });

  useEffect(() => {
    if (!keyboardShortcuts) return;
    const onKeyDown = (event: KeyboardEvent) => handleShortcut(event);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keyboardShortcuts]);

  return (
    <div ref={choicesRef} className="space-y-4 web-question-choices">
      {isComposite ? (
        <div className="space-y-3">
          {/*
            보기는 시험지처럼 **상자 하나**다. 도입부와 ㉠~㉤ 이 「…행하여지고 있어,
            ㉠타인의 생명…」처럼 한 문장으로 이어지는 문항이 있어, 도입부를 위쪽에
            따로 떼어 두면 그 상자가 쉼표에서 끊겨 문장이 잘린 것처럼 읽힌다.
            그래서 도입부와 지문을 같은 상자에 담고, O/X 는 각 줄 끝에 붙인다.
          */}
          <fieldset className="min-w-0 rounded-[var(--radius-cards)] border border-carbon px-5 pb-4">
            {passageLabel ? (
              <legend className="mx-auto px-3 text-center font-display text-body-sm font-medium text-smoke">
                {passageLabel}
              </legend>
            ) : null}
            <div className={`space-y-2.5 ${passageLabel ? "pt-2" : "pt-4"}`}>
              {passageLead.map((line, i) => (
                <p key={`${examId}-lead-${i}`} className="font-system text-[length:var(--text-body-sm)] leading-[1.85] text-ink">
                  {plainStudyText(line)}
                </p>
              ))}
              {items.map((item) => (
                <div key={`${examId}-stmt-${item.key}`} className="flex flex-wrap gap-x-3">
                  <span className="font-display font-semibold text-ink">
                    {item.label ?? item.key}
                  </span>
                  <span className="flex-1 font-system text-[length:var(--text-body-sm)] leading-[1.85] text-ink">
                    {renderStudyText(item.text, item.underlines)}
                  </span>
                  {revealed && item.answer ? (
                    <span
                      className={`font-display text-[13px] font-bold ${
                        item.answer === "O" ? "text-[color:light-dark(#6366f1,var(--color-carbon))] dark:text-iris" : "text-[color:light-dark(#ef4444,var(--color-coral))] dark:text-coral"
                      }`}
                    >
                      {item.answer}
                    </span>
                  ) : null}
                  {inlineExplanation && item.explanation ? (
                    <InlineExplanation text={item.explanation} examDate={examDate} lawVersions={lawVersions} />
                  ) : null}
                </div>
              ))}
            </div>
          </fieldset>
          <ExamReferenceList entries={referenceEntries} />
          {oxComboTable ? (
            <div className="overflow-hidden rounded-[var(--radius-cards)] border border-mist bg-paper">
              <div
                className="grid items-center gap-x-3 border-b border-mist bg-snow px-4 py-2.5 font-display text-[12px] font-semibold text-smoke"
                style={{
                  gridTemplateColumns: `2.25rem repeat(${oxComboTable.headers.length}, minmax(0, 1fr))`,
                }}
                aria-hidden
              >
                <span />
                {oxComboTable.headers.map((header, index) => (
                  <span key={`${header}-${index}`} className="text-center">
                    {header}
                  </span>
                ))}
              </div>
              <div className="divide-y divide-mist">
                {comboChoices.map((choice, rowIdx) => {
                  const selectedItem = selected === choice.no;
                  const cells = oxComboTable.rows[rowIdx] ?? [];
                  const isAccepted = acceptedChoices.includes(choice.no);
                  return (
                    <div key={`${examId}-combo-${choice.no}`}>
                      <button
                        type="button"
                        aria-pressed={selectedItem}
                        aria-keyshortcuts={!revealed && shortcutNumbers.includes(choice.no) ? String(choice.no) : undefined}
                        onClick={() => {
                          if (revealed) return;
                          if (selectedItem) reveal();
                          else selectChoice(choice.no);
                        }}
                        className={`grid w-full items-center gap-x-3 px-4 py-3 text-left transition-colors ${
                          selectedItem
                            ? revealed
                              ? isAccepted
                                ? "bg-[#6366f1]/[0.06]"
                                : "bg-[#ef4444]/[0.05]"
                              : "bg-snow study-pick-tap-again"
                            : "hover:bg-snow"
                        }`}
                        style={{
                          gridTemplateColumns: `2.25rem repeat(${oxComboTable.headers.length}, minmax(0, 1fr))`,
                        }}
                      >
                        <DailyChoiceBadge label={choice.label} tone={selectedItem ? (revealed && !isAccepted ? "incorrect" : "selected") : "default"} />
                        {cells.map((cell, cellIndex) => (
                          <span
                            key={cellIndex}
                            className="text-center font-system text-[length:var(--text-body-sm)] leading-[1.85] text-ink"
                          >
                            {cell}
                          </span>
                        ))}
                      </button>
                      {inlineExplanation && choice.explanation ? (
                        <div className="px-4 pb-3">
                          <InlineExplanation
                            text={choice.explanation}
                            examDate={examDate}
                            lawVersions={lawVersions}
                          />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
          <div className="space-y-3" role="group" aria-label="선택지">
            {comboChoices.map((choice) => {
              const selectedItem = selected === choice.no;
              return (
                <button
                  key={`${examId}-combo-${choice.no}`}
                  type="button"
                  aria-pressed={selectedItem}
                  aria-keyshortcuts={!revealed && shortcutNumbers.includes(choice.no) ? String(choice.no) : undefined}
                  onClick={() => {
                    if (revealed) return;
                    if (selectedItem) reveal();
                    else selectChoice(choice.no);
                  }}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors ${
                    selectedItem
                      ? revealed
                        ? (correctChoices?.length ? acceptedChoices.includes(choice.no) : choice.isCorrect)
                          ? "border-[#6366f1] bg-[#6366f1]/[0.06]"
                          : "border-[#ef4444] bg-[#ef4444]/[0.05]"
                        : "border-carbon bg-snow study-pick-tap-again"
                      : "border-mist bg-paper hover:border-ash"
                  }`}
                >
                  <div className="flex gap-3">
                    <DailyChoiceBadge label={choice.label} tone={selectedItem ? (revealed && hasAnswerKey && !isCorrect ? "incorrect" : "selected") : "default"} />
                    <span className="flex-1 font-system text-[length:var(--text-body-sm)] leading-[1.85] text-ink">
                      {plainStudyText(choice.text)}
                    </span>
                  </div>
                  {inlineExplanation && choice.explanation ? (
                    <InlineExplanation text={choice.explanation} examDate={examDate} lawVersions={lawVersions} />
                  ) : null}
                </button>
              );
            })}
          </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {choiceHeaders.length >= 2 ? (
            <div className="flex gap-3 px-4 font-display text-[12px] font-semibold text-smoke" aria-label="선택지 열 제목">
              <span className="w-5 shrink-0" aria-hidden />
              <div className="grid flex-1 gap-2 text-center" style={{ gridTemplateColumns: `repeat(${choiceHeaders.length}, minmax(0, 1fr))` }}>
                {choiceHeaders.map((header, index) => <span key={index}>{header}</span>)}
              </div>
            </div>
          ) : null}
          {items.map((item, index) => {
            const choice = choiceNumbers[index];
            const selectedItem = selected === choice;
            // 채점 뒤에는 고른 자리와 정답만 남기고 나머지는 물러선다.
            // 앱이 하던 것이다 — 다섯 줄이 같은 무게로 남아 있으면 어디를
            // 봐야 하는지 눈이 다시 헤맨다.
            const muted = revealed && !inlineExplanation && !selectedItem && !acceptedChoices.includes(choice);
            const isAnswer = revealed && acceptedChoices.includes(choice);
            return (
              <button
                key={`${examId}-${item.key}`}
                type="button"
                aria-pressed={selectedItem}
                aria-keyshortcuts={!revealed && shortcutNumbers.includes(choice) ? String(choice) : undefined}
                // 고른 번호를 한 번 더 누르면 바로 채점한다 — 아래 단추까지
                // 손을 내리지 않아도 되게 앱이 두었던 길이다.
                onClick={() => {
                  if (revealed) return;
                  if (selectedItem) reveal();
                  else selectChoice(choice);
                }}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors ${
                  isAnswer
                    ? "border-[#6366f1] bg-[#6366f1]/[0.06]"
                    : selectedItem
                      ? revealed
                        ? "border-[#ef4444] bg-[#ef4444]/[0.05]"
                        : "border-carbon bg-snow study-pick-tap-again"
                      : "border-mist bg-paper hover:border-ash"
                } ${muted ? "opacity-45" : ""}`}
              >
                <div className="flex gap-3">
                  <DailyChoiceBadge label={item.label ?? String(choice)} tone={selectedItem ? (revealed && hasAnswerKey && !isCorrect ? "incorrect" : "selected") : "default"} />
                  {choiceHeaders.length >= 2 && item.text.split("/").length === choiceHeaders.length ? (
                    <span className="grid flex-1 gap-2 text-center font-system text-[length:var(--text-body-sm)] leading-[1.85] text-ink" style={{ gridTemplateColumns: `repeat(${choiceHeaders.length}, minmax(0, 1fr))` }}>
                      {item.text.split("/").map((cell, cellIndex) => <span key={cellIndex}>{plainStudyText(cell.trim())}</span>)}
                    </span>
                  ) : item.image ? (
                    <span className="flex-1">
                      {/* 글은 그림을 옮겨 적은 것이라 둘 다 보이면 같은 선지가 두 번 읽힌다 — 화면 읽기용으로만 남긴다 */}
                      {item.text ? <span className="sr-only">{plainStudyText(item.text)}</span> : null}
                      {/* eslint-disable-next-line @next/next/no-img-element -- 크기가 제각각인 시험지 그림이라 원본 비율을 그대로 둔다 */}
                      <img src={item.image} alt={item.text ? plainStudyText(item.text) : `${item.label ?? ""} 선지 그림`} loading="lazy" className="h-auto max-h-60 w-auto max-w-full rounded-md border border-mist bg-[#fff]" />
                    </span>
                  ) : (
                    <span className="flex-1 font-system text-[length:var(--text-body-sm)] leading-[1.85] text-ink">{renderStudyText(item.text, item.underlines)}</span>
                  )}
                  {revealed && item.answer ? (
                    <span
                      className={`font-display text-[13px] font-bold ${
                        item.answer === "O" ? "text-[color:light-dark(#6366f1,var(--color-carbon))] dark:text-iris" : "text-[color:light-dark(#ef4444,var(--color-coral))] dark:text-coral"
                      }`}
                    >
                      {item.answer}
                    </span>
                  ) : null}
                </div>
                {inlineExplanation && item.explanation ? (
                  <InlineExplanation text={item.explanation} examDate={examDate} lawVersions={lawVersions} />
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      {keyboardShortcuts ? (
        <p className="exam-keyboard-hint hidden flex-wrap items-center gap-x-4 gap-y-1.5 font-system text-[13px] text-smoke md:flex [@media(pointer:coarse)]:hidden">
          {!revealed && shortcutNumbers.length > 0 ? (
            <>
              <span className="inline-flex items-center gap-1.5">
                {hasShortcutRange ? (
                  <><kbd>{firstShortcut}</kbd><span>~</span><kbd>{lastShortcut}</kbd></>
                ) : shortcutNumbers.map((choice, index) => <kbd key={index}>{choice}</kbd>)}
                선택
              </span>
              <span className="inline-flex items-center gap-1.5"><kbd>Enter</kbd> 채점</span>
            </>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <kbd aria-label="왼쪽 방향키">←</kbd><kbd aria-label="오른쪽 방향키">→</kbd> 문항 이동
          </span>
        </p>
      ) : null}

      {/* 고른 뒤 한 번 더 누르면 채점된다는 것을 알린다. 알리지 않으면
          아무도 두 번 누르지 않는다 — 앱이 선지 아래에 두던 안내다. */}
      {/* 채점 전에만 남는다 — 채점하고 나면 안내도 단추도 할 일이 없다 */}
      {!revealed ? (
        <>
          <p className="text-center font-system text-[13px] text-fog">
            번호를 고른 뒤 한 번 더 누르거나 아래 「정답 확인」을 누르세요
          </p>
          <button
            type="button"
            disabled={selected === null}
            aria-keyshortcuts={keyboardShortcuts ? "Enter" : undefined}
            onClick={reveal}
            className="web-grade-button w-full rounded-2xl bg-carbon px-5 py-4 font-display text-body-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-35"
          >
            정답 확인
          </button>
        </>
      ) : null}

      {revealed ? (
        <div className="space-y-4">
          {renderExplanation ? (
            <p role="status" className="font-display text-body-sm font-semibold text-ink">
              {isCorrect ? (allAccepted ? answerLabel : "정답") : hasAnswerKey ? `정답 ${answerLabel}` : "채점 완료"}
            </p>
          ) : (
            <span className="sr-only" role="status">
              {hasAnswerKey && selected !== null ? (isCorrect ? "정답" : "오답") : "채점 완료"}
            </span>
          )}
          {isAnon && answeredWrong ? (
            <LoginSoftNudge
              title="오답노트에 넣어 두기"
              body="로그인하면 틀린 문항을 오답노트에 모아 다시 풀 수 있어요."
              href={loginHref}
              cta="로그인하고 저장"
            />
          ) : null}
          {isAnon && showProgressNudge ? (
            <LoginSoftNudge
              title="지금까지 푼 건 이 기기에만 남아 있어요"
              body="로그인하면 오답·북마크·최근 학습을 다른 기기에서도 이어갈 수 있어요."
              href={loginHref}
              cta="로그인하고 이어하기"
              onDismiss={dismissProgressNudge}
            />
          ) : null}
          {/* 선지 해설은 각 선지 바로 아래에 붙였다(2026-10-21) — 여기는 공통 해설만 */}
          {renderExplanation && explanationSummary ? (
            <section className="rounded-2xl border border-mist bg-paper px-5 py-4" aria-label="공통 해설">
              <h2 className="font-display text-body-sm font-semibold text-ink">공통 해설</h2>
              <p className="mt-2 font-system text-[length:var(--text-reading-detail)] leading-[1.72] text-smoke">
                <CitedText text={explanationSummary} examDate={examDate} lawVersions={lawVersions} />
              </p>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function InlineExplanation({
  text,
  examDate,
  lawVersions,
}: {
  text: string;
  examDate?: string;
  lawVersions?: Record<string, string>;
}) {
  return (
    <span className="mt-3 flex w-full items-start gap-2.5 rounded-xl bg-white/70 px-3 py-2.5 text-left font-system text-[length:var(--text-reading-detail)] leading-[1.72] text-smoke">
      <span className="mt-0.5 shrink-0 rounded-full bg-[color:light-dark(#EAF3FE,color-mix(in_srgb,var(--color-snow)_90%,#EAF3FE))] px-2 py-0.5 font-display text-[11px] font-bold leading-5 text-[color:light-dark(#47739E,var(--color-carbon))] dark:bg-snow dark:text-carbon">
        해설
      </span>
      <span className="min-w-0 flex-1">
        <CitedText text={text} examDate={examDate} lawVersions={lawVersions} />
      </span>
    </span>
  );
}
