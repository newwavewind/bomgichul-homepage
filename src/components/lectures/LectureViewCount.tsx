"use client";

import { useEffect, useState } from "react";
import {
  emitLectureViewCount,
  formatLectureViewCount,
  LECTURE_VIEW_EVENT,
  parseLectureViewCountEvent,
  type LectureViewCountMap,
} from "@/lib/lecture-views";

export function LectureViewCount({
  lectureId,
  record = false,
  className,
}: {
  lectureId: string;
  record?: boolean;
  className?: string;
}) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    let settled = false;

    const apply = (value: number, fromRecord = false) => {
      if (!active) return;
      if (settled && !fromRecord) return;
      if (fromRecord) settled = true;
      setCount(value);
    };

    const onUpdate = (event: Event) => {
      const detail = parseLectureViewCountEvent(event);
      if (detail?.lectureId === lectureId) apply(detail.viewCount, true);
    };
    window.addEventListener(LECTURE_VIEW_EVENT, onUpdate);

    const run = async () => {
      try {
        if (record) {
          const response = await fetch("/api/lectures/view", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lectureId }),
          });
          const data = (await response.json()) as { viewCount?: number };
          if (typeof data.viewCount === "number") {
            apply(data.viewCount, true);
            emitLectureViewCount(lectureId, data.viewCount);
          }
          return;
        }
        const response = await fetch(
          `/api/lectures/view?ids=${encodeURIComponent(lectureId)}`
        );
        const data = (await response.json()) as { counts?: LectureViewCountMap };
        apply(data.counts?.[lectureId] ?? 0);
      } catch {
        if (active && !settled) setCount(0);
      }
    };

    void run();
    return () => {
      active = false;
      window.removeEventListener(LECTURE_VIEW_EVENT, onUpdate);
    };
  }, [lectureId, record]);

  return (
    <span className={className} aria-live="polite">
      {count == null ? "조회수 …" : formatLectureViewCount(count)}
    </span>
  );
}

export function useLectureViewCounts(ids: string[]): LectureViewCountMap {
  const [counts, setCounts] = useState<LectureViewCountMap>({});

  useEffect(() => {
    if (!ids.length) return undefined;
    let active = true;
    const query = ids.join(",");

    const onUpdate = (event: Event) => {
      const detail = parseLectureViewCountEvent(event);
      if (!detail || !ids.includes(detail.lectureId)) return;
      setCounts((prev) => ({ ...prev, [detail.lectureId]: detail.viewCount }));
    };
    window.addEventListener(LECTURE_VIEW_EVENT, onUpdate);

    void fetch(`/api/lectures/view?ids=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data: { counts?: LectureViewCountMap }) => {
        if (active) setCounts(data.counts ?? {});
      })
      .catch(() => {
        if (active) setCounts({});
      });

    return () => {
      active = false;
      window.removeEventListener(LECTURE_VIEW_EVENT, onUpdate);
    };
  }, [ids.join(",")]);

  return counts;
}
