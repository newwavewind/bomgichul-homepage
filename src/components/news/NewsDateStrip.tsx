"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface NewsDateStripProps {
  dates: string[];
  selected: string | null;
}

function formatDateChip(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  return `${Number(month)}.${Number(day)}`;
}

function formatWeekday(dateStr: string): string {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"] as const;
  const date = new Date(`${dateStr}T12:00:00+09:00`);
  return weekdays[date.getDay()] ?? "";
}

function formatDateChipLabel(dateStr: string): string {
  return `${formatDateChip(dateStr)} ${formatWeekday(dateStr)}`;
}

function ScrollChevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NewsDateStrip({ dates, selected }: NewsDateStripProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateOverflow = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 2);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 2);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateOverflow();

    const active = el.querySelector<HTMLElement>('[aria-selected="true"]');
    if (active) {
      const left =
        active.offsetLeft - el.clientWidth / 2 + active.offsetWidth / 2;
      el.scrollTo({ left: Math.max(0, left) });
      updateOverflow();
    }

    const onScroll = () => updateOverflow();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(updateOverflow);
    ro.observe(el);
    window.addEventListener("resize", updateOverflow);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", updateOverflow);
    };
  }, [dates, selected]);

  if (dates.length === 0) return null;

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="relative mb-5">
      {canLeft ? (
        <button
          type="button"
          onClick={() => scrollBy(-220)}
          className="absolute left-0 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-mist bg-paper text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
          aria-label="이전 날짜"
        >
          <ScrollChevron dir="left" />
        </button>
      ) : null}
      {canRight ? (
        <button
          type="button"
          onClick={() => scrollBy(220)}
          className="absolute right-0 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-mist bg-paper text-ink shadow-[var(--shadow-button)] transition-colors hover:bg-snow"
          aria-label="더 과거 날짜"
        >
          <ScrollChevron dir="right" />
        </button>
      ) : null}

      <div
        ref={scrollerRef}
        className={`overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          canLeft || canRight ? "px-9" : ""
        }`}
      >
        <div
          className="flex min-w-min gap-2"
          role="tablist"
          aria-label="뉴스 날짜 선택"
        >
          {dates.map((date) => {
            const isActive = date === selected;
            const href = `/news?date=${date}`;

            return (
              <Link
                key={date}
                href={href}
                role="tab"
                aria-selected={isActive}
                className={`
                inline-flex shrink-0 items-center whitespace-nowrap rounded-[var(--radius-tags)]
                px-3.5 py-2 font-display text-body-sm font-semibold transition-colors
                ${
                  isActive
                    ? "bg-midnight text-paper"
                    : "border border-mist bg-surface text-ink hover:bg-snow"
                }
              `}
              >
                {formatDateChipLabel(date)}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
