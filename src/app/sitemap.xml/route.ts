import { renderSitemapIndex, SITEMAP_RESPONSE_HEADERS } from "@/lib/sitemap";

export const revalidate = 3600;

export function GET() {
  return new Response(renderSitemapIndex(), { headers: SITEMAP_RESPONSE_HEADERS });
}
