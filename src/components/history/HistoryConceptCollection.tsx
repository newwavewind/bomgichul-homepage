"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HistoryConceptNote } from "@/components/history/HistoryConceptNote";
import type { HistoryConceptNote as Note } from "@/lib/exam-track/types";

export type ConceptCard = {
  examId: string;
  round: number;
  sourceCode: string;
  year: number;
  questionNo: number;
  category: string;
  subcategory: string;
  concept: Note;
};

export type RoundTab = { round: number; sourceCode: string; year: number; count: number };

/**
 * 「핵심 개념 모아보기」 — 문항 없이 개념 카드만 훑는 화면.
 *
 * 한국사는 문항마다 그 시대를 통째로 정리한 카드가 붙어서, 그것만 이어 읽으면
 * 개념서 한 권이 된다. 앱에도 같은 화면이 있지만 거기서는 회차 탭만 있고,
 * 여기서는 PC 폭을 살려 **시대 필터**를 함께 둔다 — 고려만, 일제만 몰아 보는 식으로
 * 쓸 수 있다. 다른 시험에는 없는 한국사만의 자리다.
 */
export function HistoryConceptCollection({
  cards,
  rounds,
}: {
  cards: ConceptCard[];
  rounds: RoundTab[];
}) {
  const [round, setRound] = useState<number | "all">(rounds[0]?.round ?? "all");
  const [era, setEra] = useState<string>("all");

  const byRound = useMemo(
    () => (round === "all" ? cards : cards.filter((c) => c.round === round)),
    [cards, round],
  );

  const eras = useMemo(() => {
    const counts = new Map<string, number>();
    for (const card of byRound) counts.set(card.category, (counts.get(card.category) ?? 0) + 1);
    return [...counts.entries()].map(([label, count]) => ({ label, count }));
  }, [byRound]);

  const items = useMemo(
    () =>
      (era === "all" ? byRound : byRound.filter((c) => c.category === era)).sort(
        (a, b) => b.round - a.round || a.questionNo - b.questionNo,
      ),
    [byRound, era],
  );

  const pickRound = (next: number | "all") => {
    setRound(next);
    setEra("all");
  };

  return (
    <div>
      <div className="mb-5 space-y-3">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="회차 선택">
          <TabButton active={round === "all"} onClick={() => pickRound("all")}>
            전체 {cards.length}
          </TabButton>
          {rounds.map((r) => (
            <TabButton key={r.round} active={round === r.round} onClick={() => pickRound(r.round)}>
              제{r.round}회 {r.count}
            </TabButton>
          ))}
        </div>

        {eras.length > 1 ? (
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="시대 선택">
            <ChipButton active={era === "all"} onClick={() => setEra("all")}>
              모든 시대
            </ChipButton>
            {eras.map((e) => (
              <ChipButton key={e.label} active={era === e.label} onClick={() => setEra(e.label)}>
                {e.label} {e.count}
              </ChipButton>
            ))}
          </div>
        ) : null}
      </div>

      <p className="mb-4 font-display text-body-sm text-fog">
        {items.length}개 개념
        {round !== "all" ? ` · 제${round}회` : ""}
        {era !== "all" ? ` · ${era}` : ""}
      </p>

      {items.length === 0 ? (
        <div className="rounded-[var(--radius-cards)] border border-carbon bg-paper p-8 text-center">
          <p className="font-display text-body text-smoke">이 조건에 맞는 핵심 개념이 없어요.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {items.map((card) => (
            <article key={card.examId}>
              <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-[12px] text-fog">
                <span className="rounded-full border border-mist bg-snow px-2 py-0.5 font-medium text-smoke">
                  {card.category}
                </span>
                <span>{card.subcategory}</span>
                <span aria-hidden>·</span>
                <Link
                  href={`/history/exam/simhwa/${card.year}/${encodeURIComponent(card.sourceCode)}/${card.questionNo}`}
                  className="font-medium text-electric-blue hover:underline"
                >
                  {card.sourceCode} {card.questionNo}번 문제 보기 →
                </Link>
              </div>
              {/* 카드 자체가 제목·본문을 다 갖고 있어 위에 겹쳐 쓰지 않는다 */}
              <div className="[&>section]:mt-0">
                <HistoryConceptNote concept={card.concept} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 font-display text-[13px] font-semibold transition-colors ${
        active
          ? "border-carbon bg-carbon text-paper"
          : "border-mist bg-paper text-smoke hover:border-carbon hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 font-display text-[12px] font-medium transition-colors ${
        active
          ? "border-ios-blue/40 bg-ios-blue/[0.12] text-ios-blue"
          : "border-mist bg-snow text-smoke hover:border-carbon/40 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
