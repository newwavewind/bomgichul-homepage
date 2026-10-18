"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { DailyChoiceBadge } from "@/components/daily/DailyChoiceBadge";
import {
  DailyChoiceContent,
  DailyQuestionBody,
} from "@/components/daily/DailyQuestionBody";
import { CitedText } from "@/components/exam/CitedText";
import { saveDailyWrongNote } from "@/lib/daily-challenge/actions";
import type {
  DailyWrongNotebook,
  DailyWrongNotebookItem,
} from "@/lib/daily-challenge/types";

type Filter = "active" | "due" | "repeated" | "recovered" | "pinned" | "all";
type Sort = "priority" | "recent" | "wrong" | "oldest";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "active", label: "복습 중" },
  { value: "due", label: "지금 복습" },
  { value: "repeated", label: "반복 오답" },
  { value: "recovered", label: "익힘" },
  { value: "pinned", label: "핀 고정" },
  { value: "all", label: "전체" },
];

export function DailyWrongNotebookDashboard({
  notebook,
  exam,
  subjectId,
  subjectLabel,
}: {
  notebook: DailyWrongNotebook;
  exam: string;
  subjectId: string;
  subjectLabel: string;
}) {
  const [items, setItems] = useState(notebook.items);
  const [filter, setFilter] = useState<Filter>("active");
  const [sort, setSort] = useState<Sort>("priority");
  const [search, setSearch] = useState("");
  const visible = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ko");
    return items
      .filter((item) => {
        if (filter === "active" && item.mastered) return false;
        if (filter === "due" && !item.due) return false;
        if (filter === "repeated" && (item.mastered || item.wrongCount < 2)) return false;
        if (filter === "recovered" && !item.mastered) return false;
        if (filter === "pinned" && !item.pinned) return false;
        return !query || `${item.sourceLabel} ${item.category} ${item.subcategory} ${item.stem} ${item.note}`.toLocaleLowerCase("ko").includes(query);
      })
      .sort((a, b) => {
        if (sort === "recent") return b.lastWrongDate.localeCompare(a.lastWrongDate);
        if (sort === "oldest") return a.lastWrongDate.localeCompare(b.lastWrongDate);
        if (sort === "wrong") return b.wrongCount - a.wrongCount;
        return Number(b.pinned) - Number(a.pinned) || Number(b.due) - Number(a.due) || Number(a.mastered) - Number(b.mastered) || b.wrongCount - a.wrongCount;
      });
  }, [filter, items, search, sort]);

  const active = items.filter((item) => !item.mastered).length;
  const due = items.filter((item) => item.due).length;
  const repeated = items.filter((item) => !item.mastered && item.wrongCount >= 2).length;
  const recovered = items.filter((item) => item.mastered).length;
  const counts: Record<Filter, number> = {
    active,
    due,
    repeated,
    recovered,
    pinned: items.filter((item) => item.pinned).length,
    all: items.length,
  };

  function updateItem(id: string, patch: Partial<DailyWrongNotebookItem>) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  }

  return (
    <div className="space-y-20">
      <section className="relative isolate py-6 sm:py-12" aria-labelledby="notebook-overview-heading">
        <NotebookCollage items={items} active={active} recovered={recovered} />
        <div className="relative z-10 mx-auto max-w-[880px] rounded-2xl bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.1)] sm:p-10 lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs tracking-[0.05em] text-[#595959]">
                {subjectLabel.toUpperCase()} / SMART REVIEW QUEUE
              </p>
              <h2 id="notebook-overview-heading" className="mt-5 text-[clamp(38px,6vw,56px)] font-light leading-[1.1] tracking-[-0.02em] text-black">
                틀린 문제를,
                <br />다시 내 것으로.
              </h2>
              <p className="mt-6 max-w-xl text-lg font-normal leading-[1.4] tracking-[-0.01em] text-[#595959]">
                틀리면 1일 뒤, 다시 맞히면 3일·7일 뒤에 확인합니다. 연속으로 세 번 맞힌 문제는 익힘 보관함으로 이동합니다.
              </p>
            </div>
            {active > 0 ? (
              <Link
                href={`/${exam}/daily?subject=${encodeURIComponent(subjectId)}&review=special`}
                className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-[50px] bg-[#4d49fc] px-6 text-base font-medium text-white transition-transform hover:-translate-y-0.5"
              >
                우선순위 {Math.min(active, 10)}문제 복습
                <span className="ml-3" aria-hidden>→</span>
              </Link>
            ) : null}
          </div>

          <div className="mt-10 grid overflow-hidden rounded-2xl border border-[#e2e2e2] sm:grid-cols-4">
            <HeroStat index="01" label="복습 중" value={active} />
            <HeroStat index="02" label="지금 복습" value={due} emphasis />
            <HeroStat index="03" label="반복 오답" value={repeated} />
            <HeroStat index="04" label="익힘" value={recovered} />
          </div>
        </div>
      </section>

      <section aria-labelledby="archive-heading">
        <div className="flex flex-col gap-4 border-b border-black pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs tracking-[0.05em] text-[#595959]">YOUR REVIEW LIBRARY</p>
            <h2 id="archive-heading" className="mt-3 text-2xl font-normal tracking-[-0.01em] text-black">
              오답 보관함
            </h2>
          </div>
          <p className="font-mono text-xs tracking-[0.05em] text-[#595959]">
            SHOWING {visible.length} / {items.length}
          </p>
        </div>

        <div className="py-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <label className="relative block">
              <span className="sr-only">특별한 오답노트 검색</span>
              <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 size-5 -translate-y-1/2" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="문제, 연도, 단원, 내 메모 검색"
                className="min-h-12 w-full rounded-lg border border-black bg-white pl-12 pr-4 text-base font-normal tracking-[-0.007em] text-black outline-none placeholder:text-[#595959] focus:border-[#4d49fc] focus:ring-2 focus:ring-[#4d49fc]/15"
              />
            </label>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
              aria-label="오답 정렬"
              className="min-h-12 rounded-lg border border-black bg-white px-4 text-base font-normal text-black outline-none focus:border-[#4d49fc] focus:ring-2 focus:ring-[#4d49fc]/15"
            >
              <option value="priority">복습 우선순위</option>
              <option value="recent">최근 틀린 순</option>
              <option value="wrong">많이 틀린 순</option>
              <option value="oldest">오래된 순</option>
            </select>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="오답 상태 필터">
            {FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                aria-pressed={filter === option.value}
                className={`shrink-0 rounded-[50px] border border-black px-4 py-2 text-base font-normal transition-colors ${
                  filter === option.value
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-[#e2e2e2]"
                }`}
              >
                {option.label} <span className="ml-1 font-mono text-xs">{counts[option.value]}</span>
              </button>
            ))}
          </div>
        </div>

        {visible.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {visible.map((item, index) => (
              <WrongCard
                key={item.id}
                item={item}
                index={index + 1}
                exam={exam}
                subjectId={subjectId}
                onUpdate={updateItem}
              />
            ))}
          </div>
        ) : (
          <section className="rounded-2xl bg-[#e2e2e2] px-6 py-16 text-center">
            <p className="font-mono text-xs tracking-[0.05em] text-[#595959]">EMPTY ARCHIVE</p>
            <h2 className="mt-5 text-2xl font-normal tracking-[-0.01em] text-black">
              {items.length ? "이 조건에 맞는 문제가 없습니다" : "아직 쌓인 오답이 없습니다"}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base font-normal leading-[1.45] text-[#595959]">
              {items.length ? "필터나 검색어를 바꾸면 다른 기록을 볼 수 있습니다." : "매일 10문제를 풀면 실제로 틀린 문제만 이곳에 자동으로 정리됩니다."}
            </p>
            {!items.length ? (
              <Link
                href={`/${exam}/daily?subject=${encodeURIComponent(subjectId)}`}
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[50px] bg-[#4d49fc] px-6 text-base font-medium text-white"
              >
                오늘의 10문제 풀기
              </Link>
            ) : null}
          </section>
        )}
      </section>
    </div>
  );
}

function NotebookCollage({ items, active, recovered }: { items: DailyWrongNotebookItem[]; active: number; recovered: number }) {
  const sample = items[0];
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
      <div className="absolute -left-10 top-2 w-64 -rotate-6 rounded-2xl bg-[#e4ff97] p-6">
        <p className="font-mono text-xs tracking-[0.05em]">ACTIVE REVIEW</p>
        <p className="mt-12 text-[44px] font-light leading-none">{active}</p>
        <p className="mt-2 text-base font-normal">다시 볼 문제</p>
      </div>
      <div className="absolute -right-5 top-8 w-60 rotate-[7deg] rounded-2xl bg-[#c4baff] p-6">
        <p className="font-mono text-xs tracking-[0.05em]">LEARNED</p>
        <p className="mt-12 text-[44px] font-light leading-none">{recovered}</p>
        <p className="mt-2 text-base font-normal">익힘 보관함</p>
      </div>
      <div className="absolute -bottom-5 left-4 w-72 rotate-3 rounded-2xl bg-[#ffc9c1] p-6">
        <p className="font-mono text-xs tracking-[0.05em]">LATEST NOTE</p>
        <p className="mt-10 line-clamp-2 text-base font-normal leading-[1.45]">
          {sample?.stem ?? "오늘의 오답이 다음 복습 순서가 됩니다."}
        </p>
      </div>
      <div className="absolute -bottom-2 right-6 w-64 -rotate-3 rounded-2xl bg-[#c7f8fb] p-6">
        <p className="font-mono text-xs tracking-[0.05em]">MEMORY TRACE</p>
        <div className="mt-12 flex items-center gap-3">
          {[true, false, false, true].map((filled, index) => (
            <span key={index} className={`size-4 rounded-full border border-black ${filled ? "bg-black" : "bg-transparent"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroStat({ index, label, value, emphasis = false }: { index: string; label: string; value: number; emphasis?: boolean }) {
  return (
    <div className={`border-b border-[#e2e2e2] p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${emphasis ? "bg-[#f3f2ff]" : "bg-white"}`}>
      <p className="font-mono text-xs tracking-[0.05em] text-[#595959]">{index}</p>
      <p className="mt-5 text-[32px] font-light leading-none tabular-nums text-black">{value}</p>
      <p className="mt-2 text-base font-normal text-[#595959]">{label}</p>
    </div>
  );
}

function WrongCard({
  item,
  index,
  exam,
  subjectId,
  onUpdate,
}: {
  item: DailyWrongNotebookItem;
  index: number;
  exam: string;
  subjectId: string;
  onUpdate: (id: string, patch: Partial<DailyWrongNotebookItem>) => void;
}) {
  const [open, setOpen] = useState(Boolean(item.note));
  const [note, setNote] = useState(item.note);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  function persist(nextNote: string, nextPinned: boolean) {
    setMessage("");
    startTransition(async () => {
      const result = await saveDailyWrongNote({
        exam,
        subject: subjectId,
        questionId: item.id,
        note: nextNote,
        pinned: nextPinned,
      });
      if (result.ok) {
        onUpdate(item.id, { note: nextNote.trim(), pinned: nextPinned });
        setMessage("저장됨");
      } else {
        setMessage(result.message);
      }
    });
  }

  return (
    <article className={`flex min-h-[410px] flex-col rounded-2xl border bg-white p-4 sm:p-5 lg:p-6 ${item.pinned ? "border-black" : "border-black/10"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {item.pinned ? <span className="rounded-lg bg-black px-2.5 py-1.5 text-xs text-white">핀 고정</span> : null}
          {item.lawChangeNote ? <span className="rounded-lg bg-[#ffc9c1] px-2.5 py-1.5 text-xs text-black">법령 변경</span> : null}
        </div>
        <button
          type="button"
          onClick={() => persist(note, !item.pinned)}
          disabled={pending}
          aria-label={item.pinned ? "상단 고정 해제" : "상단에 고정"}
          aria-pressed={item.pinned}
          className={`flex size-10 shrink-0 items-center justify-center rounded-[2px] border border-black ${item.pinned ? "bg-black text-white" : "bg-white text-black hover:bg-[#e2e2e2]"}`}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill={item.pinned ? "currentColor" : "none"} aria-hidden>
            <path d="M8 4h8l-1 5 3 3v1H6v-1l3-3-1-5Zm4 9v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="-mx-4 mt-6 rounded-none border-y border-black bg-[#f7f7f7] p-3 sm:-mx-5 sm:p-4 lg:mx-0 lg:rounded-2xl lg:border lg:p-5">
          <div className="border-b border-black/10 pb-4">
            <p className="font-mono text-xs tracking-[0.04em] text-[#595959]">
              {String(index).padStart(2, "0")} / {item.sourceLabel}
              {item.subcategory ? ` / ${item.subcategory}` : ""}
            </p>
          </div>
          <DailyQuestionBody
            stem={item.stem}
            presentation={item.presentation}
            questionNo={index}
            heading="h3"
          />
          <p className="mt-4 text-sm text-[#595959]">
            {item.choiceStats
              ? `다른 수험생 ${item.choiceStats.total}명의 최근 선택을 중복 없이 집계했습니다.`
              : "다른 수험생 기록이 3명 이상 모이면 선택지별 오답률을 표시합니다."}
          </p>
          <div className="mt-4 grid gap-2">
            {item.choices.map((choice) => {
              const isCorrect = item.correctKeys.includes(choice.key);
              return (
                <div
                  key={choice.key}
                  className={`rounded-2xl border px-3 py-3 sm:px-4 ${isCorrect ? "border-[#4d49fc] bg-[#f3f2ff]" : "border-black/10 bg-white"}`}
                >
                  <div className="flex gap-3">
                    <DailyChoiceBadge label={choice.label} tone={isCorrect ? "selected" : "default"} />
                    <DailyChoiceContent choice={choice} choiceHeaders={item.presentation.choiceHeaders} />
                  </div>
                  {isCorrect ? <p className="mt-2 pl-9 text-base font-medium text-[#4d49fc]">정답</p> : null}
                  <ChoiceRate item={item} choiceKey={choice.key} />
                </div>
              );
            })}
          </div>
          <div className="mt-5 border-t border-black/10 pt-5">
            <p className="text-base font-medium text-[#4d49fc]">
              정답 {item.choices.filter((choice) => item.correctKeys.includes(choice.key)).map((choice) => choice.label).join(", ")}
            </p>
            <div className="mt-3 whitespace-pre-wrap text-base font-normal leading-7 text-black">
              <CitedText
                text={item.explanation || "이 문항의 해설은 준비 중입니다."}
                examDate={item.examDate}
                lawVersions={item.lawVersions}
              />
            </div>
          </div>
          {item.lawChangeNote ? (
            <div className="mt-5 rounded-xl border border-black bg-[#fff4f1] p-4">
              <p className="text-sm font-medium text-black">출제 당시와 달라진 현재 기준</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#595959]">{item.lawChangeNote}</p>
            </div>
          ) : null}
        </div>

      <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-[#e2e2e2] bg-[#e2e2e2]">
        <SmallStat label="틀린 횟수" value={`${item.wrongCount}회`} />
        <SmallStat label="다시 맞힘" value={`${item.correctAfterWrong}회`} />
        <SmallStat label="다음 확인" value={item.mastered ? "복습 완료" : formatShortDate(item.nextReviewDate)} />
      </div>

      <ReviewTimeline item={item} />

      <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-[#e2e2e2] pt-4">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="min-h-9 rounded-[50px] bg-black px-4 text-sm font-normal text-white"
        >
          {open ? "메모 닫기" : item.note ? "내 메모" : "메모하기"}
        </button>
      </div>

      {open ? (
        <div className="mt-6 rounded-2xl bg-[#e2e2e2] p-5">
          <label className="text-base font-normal text-black" htmlFor={`wrong-note-${item.id}`}>
            내가 틀린 이유와 기억할 기준
          </label>
          <textarea
            id={`wrong-note-${item.id}`}
            value={note}
            onChange={(event) => setNote(event.target.value.slice(0, 1200))}
            placeholder="예: 취소소송과 무효확인소송의 제소기간을 혼동함"
            rows={4}
            className="mt-4 w-full resize-y rounded-lg border border-black bg-white px-4 py-3 text-base font-normal leading-[1.45] text-black outline-none placeholder:text-[#595959] focus:border-[#4d49fc] focus:ring-2 focus:ring-[#4d49fc]/15"
          />
          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="font-mono text-xs tracking-[0.03em] text-[#595959]">
              {note.length}/1200 {message ? `/ ${message}` : ""}
            </span>
            <button
              type="button"
              onClick={() => persist(note, item.pinned)}
              disabled={pending}
              className="min-h-10 rounded-[50px] bg-black px-5 text-base font-normal text-white disabled:opacity-50"
            >
              {pending ? "저장 중" : "메모 저장"}
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function ChoiceRate({
  item,
  choiceKey,
}: {
  item: DailyWrongNotebookItem;
  choiceKey: string;
}) {
  const stat = item.choiceStats?.choices.find((choice) => choice.key === choiceKey);
  const mine = item.myLastWrongKey === choiceKey;
  if (!stat && !mine) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 pl-9 text-xs">
      {mine ? (
        <span className="rounded-lg bg-black px-2 py-1 text-white">내가 고른 오답</span>
      ) : null}
      {stat ? (
        <span className="text-[#595959]">
          다른 수험생 선택 {stat.percent}% · {stat.count}명
        </span>
      ) : null}
    </div>
  );
}

function ReviewTimeline({ item }: { item: DailyWrongNotebookItem }) {
  if (!item.history.length) return null;
  return (
    <div className="mt-3 flex items-center gap-3 overflow-hidden border-t border-[#e2e2e2] pt-3">
      <div className="shrink-0">
        <p className="text-xs font-medium text-black">복습 기록</p>
        <p className="mt-0.5 text-[11px] text-[#595959]">처음 오답부터 익힘까지</p>
      </div>
      <ol className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1" aria-label="문제 복습 진행 기록">
        {item.history.map((point, index) => {
          const isLastMastered = item.mastered && index === item.history.length - 1 && point.correct;
          const label = isLastMastered
            ? "익힘 완료"
            : point.kind === "graduation"
              ? point.correct
                ? "졸업 확인 정답"
                : "졸업 확인 오답"
              : point.correct
                ? "재도전 정답"
                : "오답";
          return (
            <li key={`${point.date}-${index}`} className="flex shrink-0 items-center gap-2 rounded-lg border border-black/10 bg-[#f7f7f7] px-3 py-2">
              <span className={`block size-2.5 rounded-full border border-black ${point.correct ? "bg-black" : "bg-white"}`} />
              <p className="text-[11px] text-[#595959]">{formatShortDate(point.date)}</p>
              <p className="text-xs font-medium text-black">{label}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-3 py-2.5">
      <p className="font-mono text-[11px] tracking-[0.03em] text-[#595959]">{label}</p>
      <p className="mt-1 truncate text-sm font-medium tabular-nums text-black">{value}</p>
    </div>
  );
}

function formatShortDate(dateKey: string) {
  const [, month, day] = dateKey.split("-");
  return `${Number(month)}.${Number(day)}`;
}
