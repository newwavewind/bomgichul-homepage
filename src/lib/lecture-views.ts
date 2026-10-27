export const LECTURE_VIEW_EVENT = "lecture-view-count";

export type LectureViewCountMap = Record<string, number>;

export function formatLectureViewCount(count: number): string {
  return `조회수 ${count.toLocaleString("ko-KR")}회`;
}

export function emitLectureViewCount(lectureId: string, viewCount: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(LECTURE_VIEW_EVENT, { detail: { lectureId, viewCount } })
  );
}

export function parseLectureViewCountEvent(event: Event): {
  lectureId: string;
  viewCount: number;
} | null {
  const detail = (event as CustomEvent).detail as
    | { lectureId?: string; viewCount?: number }
    | undefined;
  if (!detail?.lectureId || typeof detail.viewCount !== "number") return null;
  return { lectureId: detail.lectureId, viewCount: detail.viewCount };
}
