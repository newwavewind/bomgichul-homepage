import {
  buildSitemapGroup,
  renderSitemap,
  SITEMAP_GROUPS,
  SITEMAP_RESPONSE_HEADERS,
  type SitemapGroup,
} from "@/lib/sitemap";

export const revalidate = 3600;

type Props = { params: Promise<{ name: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { name } = await params;
  const groupName = name.endsWith(".xml") ? name.slice(0, -4) : name;
  if (!SITEMAP_GROUPS.includes(groupName as SitemapGroup)) {
    return new Response("Not Found", { status: 404 });
  }

  const entries = await buildSitemapGroup(groupName as SitemapGroup);
  return new Response(renderSitemap(entries), { headers: SITEMAP_RESPONSE_HEADERS });
}
