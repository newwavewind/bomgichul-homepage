import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { communityBaseHref, isValidCommunityScope } from "@/lib/exam-track/community";
import { getPosts } from "@/lib/posts";
import type { CommunityScope } from "@/types/database";

export const revalidate = 900;

const FALLBACK_ITEMS = [
  {
    title: "공인중개사 기출 학습",
    link: `${SITE_URL}/real-estate`,
    description: "공인중개사 과목별 핵심 개념과 연도별 공개 기출문제를 학습하세요.",
  },
  {
    title: "공무원 기출 학습",
    link: `${SITE_URL}/public-service`,
    description: "공무원 시험 과목별 핵심 개념과 연도별 공개 기출문제를 학습하세요.",
  },
  {
    title: "경찰공무원 기출 학습",
    link: `${SITE_URL}/police`,
    description: "경찰공무원 시험 과목별 핵심 개념과 연도별 공개 기출문제를 학습하세요.",
  },
  {
    title: "주택관리사 기출 학습",
    link: `${SITE_URL}/housing`,
    description: "주택관리사 과목별 핵심 개념과 연도별 공개 기출문제를 학습하세요.",
  },
] as const;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const { data } = await getPosts({ scope: "all", page: 1, sort: "latest" });
  const publishedPosts = data
    .filter((post) => post.category !== "bug" && post.category !== "feedback")
  const publishedAt = new Date().toUTCString();
  const feedItems = publishedPosts.length > 0
    ? publishedPosts.map((post) => {
      const scope = isValidCommunityScope(post.community_scope)
        ? (post.community_scope as CommunityScope)
        : "real_estate";
      const link = `${SITE_URL}${communityBaseHref(scope)}/${post.id}`;
      return {
        title: post.title,
        link,
        description: post.title,
        pubDate: new Date(post.created_at).toUTCString(),
      };
    })
    : FALLBACK_ITEMS.map((item) => ({ ...item, pubDate: publishedAt }));

  const items = feedItems
    .map((item) =>
      [
        "<item>",
        `<title>${escapeXml(item.title)}</title>`,
        `<link>${escapeXml(item.link)}</link>`,
        `<guid isPermaLink="true">${escapeXml(item.link)}</guid>`,
        `<pubDate>${item.pubDate}</pubDate>`,
        `<description>${escapeXml(item.description)}</description>`,
        "</item>",
      ].join("")
    )
    .join("");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "<channel>",
    `<title>${SITE_NAME} 수험생 커뮤니티</title>`,
    `<link>${SITE_URL}</link>`,
    `<description>${SITE_DESCRIPTION}</description>`,
    "<language>ko-KR</language>",
    `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    items,
    "</channel>",
    "</rss>",
  ].join("");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
