import type { CommunityScope } from "@/types/database";
import { PUBLIC_SERVICE_SERIES } from "@/data/public-service/series";

export type ArchiveTrackOption = {
  value: string;
  label: string;
  /** title/content 부분 일치 (차수·국가직 등) */
  titleMatch?: string;
  /** 공무원 직렬 → 과목 slug 목록 */
  subjectIds?: string[];
};

/** 자료실 연도 칩 — 시험별로 올려 둔 원본 범위 */
export function archiveYearsForScope(scope: CommunityScope): number[] {
  switch (scope) {
    case "real_estate":
      return rangeYears(2016, 2025);
    case "public_service":
      return rangeYears(2017, 2026);
    case "police":
      return rangeYears(2022, 2026);
    case "housing":
      return rangeYears(2016, 2026);
    case "social_worker":
      return rangeYears(2017, 2026);
    case "english":
      return rangeYears(2017, 2026);
    case "history":
      return [];
    default:
      return rangeYears(2016, 2026);
  }
}

/** 한국사 회차 칩 */
export function archiveRoundsForScope(scope: CommunityScope): number[] {
  if (scope !== "history") return [];
  return [79, 78, 77, 76, 75, 74, 73, 72, 71, 70];
}

/**
 * 직렬·차수·교시 등 시험별 「구분」 칩.
 * 공무원은 직렬(과목 묶음), 영어는 국가직/지방직, 나머지는 차수·교시.
 */
export function archiveTracksForScope(scope: CommunityScope): {
  label: string;
  options: ArchiveTrackOption[];
} | null {
  switch (scope) {
    case "public_service":
      return {
        label: "직렬",
        options: [
          { value: "all", label: "전체 직렬" },
          ...PUBLIC_SERVICE_SERIES.map((s) => ({
            value: s.id,
            label: s.label,
            subjectIds: s.subjectIds,
          })),
        ],
      };
    case "english":
      return {
        label: "구분",
        options: [
          { value: "all", label: "전체" },
          { value: "national", label: "국가직", titleMatch: "국가직" },
          { value: "local", label: "지방직", titleMatch: "지방직" },
        ],
      };
    case "real_estate":
      return {
        label: "차수",
        options: [
          { value: "all", label: "전체" },
          { value: "round1", label: "1차", titleMatch: "1차" },
          { value: "round2", label: "2차", titleMatch: "2차" },
          { value: "answer", label: "정답", titleMatch: "정답" },
        ],
      };
    case "housing":
      return {
        label: "차수",
        options: [
          { value: "all", label: "전체" },
          { value: "round1", label: "1차", titleMatch: "1차" },
          { value: "round2", label: "2차", titleMatch: "2차" },
          { value: "answer", label: "정답", titleMatch: "정답" },
        ],
      };
    case "police":
      return {
        label: "차수",
        options: [
          { value: "all", label: "전체" },
          { value: "round1", label: "1차", titleMatch: "1차" },
          { value: "round2", label: "2차", titleMatch: "2차" },
          { value: "answer", label: "정답", titleMatch: "정답" },
        ],
      };
    case "social_worker":
      return {
        label: "교시",
        options: [
          { value: "all", label: "전체" },
          { value: "period1", label: "1교시", titleMatch: "1교시" },
          { value: "period2", label: "2교시", titleMatch: "2교시" },
          { value: "period3", label: "3교시", titleMatch: "3교시" },
          { value: "answer", label: "정답", titleMatch: "정답" },
        ],
      };
    case "history":
      return {
        label: "급수",
        options: [
          { value: "all", label: "전체" },
          { value: "advanced", label: "심화", titleMatch: "심화" },
          { value: "basic", label: "기본", titleMatch: "기본" },
          { value: "answer", label: "정답", titleMatch: "정답" },
        ],
      };
    default:
      return null;
  }
}

function rangeYears(from: number, to: number): number[] {
  const years: number[] = [];
  for (let y = to; y >= from; y -= 1) years.push(y);
  return years;
}

/** 커뮤니티 baseHref → 자료실(필터 가능) 경로 */
export function communityHrefToArchive(baseHref: string): string {
  if (baseHref === "/community") return "/archive";
  if (baseHref.endsWith("/community")) {
    return `${baseHref.slice(0, -"/community".length)}/archive`;
  }
  return baseHref;
}
