import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { communityBaseHref, isValidCommunityScope } from "@/lib/exam-track/community";
import { getPosts } from "@/lib/posts";
import type { CommunityScope } from "@/types/database";

export const revalidate = 900;

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
  const items = data
    .filter((post) => post.category !== "bug" && post.category !== "feedback")
    .map((post) => {
      const scope = isValidCommunityScope(post.community_scope)
        ? (post.community_scope as CommunityScope)
        : "real_estate";
      const link = `${SITE_URL}${communityBaseHref(scope)}/${post.id}`;
      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${escapeXml(link)}</link>`,
        `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `<pubDate>${new Date(post.created_at).toUTCString()}</pubDate>`,
        `<description>${escapeXml(post.title)}</description>`,
        "</item>",
      ].join("");
    })
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
