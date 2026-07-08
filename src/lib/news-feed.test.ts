import { describe, expect, it } from "vitest";
import {
  dedupeNewsStories,
  isSameNewsStory,
  type NewsFeedItem,
} from "@/lib/news-feed";

function item(partial: Partial<NewsFeedItem> & Pick<NewsFeedItem, "title">): NewsFeedItem {
  return {
    summary: partial.summary ?? partial.title,
    source_name: partial.source_name ?? "언론",
    source_url: partial.source_url ?? `https://example.com/${encodeURIComponent(partial.title)}`,
    published_at: partial.published_at ?? "2026-07-08",
    title: partial.title,
  };
}

describe("isSameNewsStory", () => {
  it("treats multi-outlet coverage of the same local event as one story", () => {
    const a = item({
      title: '"안전한 부동산 거래문화 조성"…광주시, 공인중개사 연수교육 실시',
      source_name: "경기일보",
    });
    const b = item({
      title: "광주시, 공인중개사 600여 명 대상 연수교육",
      source_name: "글로벌에픽",
    });
    const c = item({
      title: "광주시, 공인중개사 600여 명 대상 연수 교육 실시…안전한 부동산 거래 질서 확립",
      source_name: "웹이코노미",
    });

    expect(isSameNewsStory(a, b)).toBe(true);
    expect(isSameNewsStory(b, c)).toBe(true);
  });

  it("keeps different events as distinct stories", () => {
    const gwangju = item({
      title: "광주시, 공인중개사 연수교육 실시",
    });
    const yangpyeong = item({
      title: "양평군, 공인중개사와 소통 간담회…안전한 부동산 거래환경 조성",
    });
    const crime = item({
      title: "안산단원경찰서 부동산 중개보조원 A씨, 공인중개사법위반 검찰 구속 송치",
    });

    expect(isSameNewsStory(gwangju, yangpyeong)).toBe(false);
    expect(isSameNewsStory(gwangju, crime)).toBe(false);
    expect(isSameNewsStory(yangpyeong, crime)).toBe(false);
  });

  it("collapses yangpyeong meeting coverage across outlets into one story", () => {
    const rows = [
      item({ title: "양평군, 공인중개사와 소통 간담회…안전한 부동산 거래환경 조성 맞손" }),
      item({ title: "양평군, 공인중개사협회와 ‘안심 매력양평’ 간담회…법정단체 전환 맞춰 민관 협력 강화" }),
      item({ title: "전진선 양평군수, 공인중개사협회와 ‘부동산 거래환경’ 조성" }),
      item({ title: "양평군, 공인중개사협회와 안심 중개환경 논의" }),
    ];
    expect(dedupeNewsStories(rows, 10)).toHaveLength(1);
  });
});

describe("dedupeNewsStories", () => {
  it("returns only unique stories and does not pad to maxCount", () => {
    const rows = [
      item({ title: "광주시, 공인중개사 연수교육 실시", source_url: "https://a.com/1" }),
      item({ title: "광주시, 공인중개사 600여 명 대상 연수교육", source_url: "https://b.com/2" }),
      item({ title: "양평군, 공인중개사협회와 안심 중개환경 논의", source_url: "https://c.com/3" }),
    ];

    const selected = dedupeNewsStories(rows, 10);
    expect(selected).toHaveLength(2);
    expect(selected[0]?.title).toContain("광주시");
    expect(selected[1]?.title).toContain("양평군");
  });
});
