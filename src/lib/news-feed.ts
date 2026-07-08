/** RSS 기반 공인중개사 관련 뉴스 수집 (Anthropic 불필요) */

export interface NewsFeedItem {
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  published_at: string;
}

const SEARCH_QUERIES = [
  "공인중개사",
  "공인중개사 시험",
  "부동산 중개업",
  "부동산 정책",
  "주택임대차",
] as const;

const KEYWORD_RE =
  /공인중개사|중개업|중개사|부동산\s*(정책|규제|세제|세법|공시|임대|거래)|취득세|양도세|종부세|주택임대차|전월세|청약|재건축|재개발|국토교통|부동산원/i;

function googleNewsRssUrl(query: string): string {
  const q = encodeURIComponent(query);
  return `https://news.google.com/rss/search?q=${q}&hl=ko&gl=KR&ceid=KR:ko`;
}

function decodeXmlEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function stripHtml(input: string): string {
  return decodeXmlEntities(input)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateSummary(text: string, max = 220): string {
  if (text.length <= max) return text;
  const sliced = text.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

function toDateString(value: string | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function extractTag(block: string, tag: string): string {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = block.match(re);
  return m ? stripHtml(m[1]) : "";
}

function extractSourceName(block: string, title: string): string {
  const sourceTitle = extractTag(block, "source");
  if (sourceTitle) return sourceTitle;

  // Google News titles often look like "기사제목 - 언론사"
  const dash = title.lastIndexOf(" - ");
  if (dash > 0 && dash < title.length - 3) {
    return title.slice(dash + 3).trim();
  }
  return "뉴스";
}

function cleanTitle(title: string, sourceName: string): string {
  const suffix = ` - ${sourceName}`;
  if (sourceName && title.endsWith(suffix)) {
    return title.slice(0, -suffix.length).trim();
  }
  return title.trim();
}

function parseRssItems(xml: string): NewsFeedItem[] {
  const items: NewsFeedItem[] = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];

  for (const block of blocks) {
    const rawTitle = extractTag(block, "title");
    const link = extractTag(block, "link");
    const description = extractTag(block, "description");
    const pubDate = extractTag(block, "pubDate");
    const publishedAt = toDateString(pubDate);
    if (!rawTitle || !link?.startsWith("http") || !publishedAt) continue;

    const sourceName = extractSourceName(block, rawTitle);
    const title = cleanTitle(rawTitle, sourceName);
    const summary = truncateSummary(description || title);
    if (!title || !summary) continue;

    items.push({
      title,
      summary,
      source_name: sourceName || "뉴스",
      source_url: link,
      published_at: publishedAt,
    });
  }

  return items;
}

function isRelevant(item: NewsFeedItem): boolean {
  return KEYWORD_RE.test(`${item.title} ${item.summary}`);
}

function isRecent(publishedAt: string, withinDays = 3): boolean {
  const d = new Date(`${publishedAt}T00:00:00+09:00`);
  if (Number.isNaN(d.getTime())) return false;
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;
  return d.getTime() >= cutoff;
}

async function fetchFeed(query: string): Promise<NewsFeedItem[]> {
  const res = await fetch(googleNewsRssUrl(query), {
    headers: {
      "User-Agent": "bomgichul-news-bot/1.0 (+https://www.bomgichul.com)",
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`RSS fetch failed (${query}): ${res.status}`);
  }
  const xml = await res.text();
  return parseRssItems(xml);
}

function titleFingerprint(title: string): string {
  return title
    .toLowerCase()
    .replace(/[\[\]『』「」"'“”‘’·…]/g, "")
    .replace(
      /(광주시|양평군|안산|단원|전진선|군수|공인중개사협회|공인중개사協|양평지회|위클리오늘|안전한|부동산|거래|문화|환경|조성|연수교육|연수|교육|간담회|소통|대상|실시|개최|진행|논의|맞손|위한)/g,
      ""
    )
    .replace(/\s+/g, "")
    .slice(0, 24);
}

/** 여러 검색어 RSS를 모아 중복 제거·관련성 필터 후 상위 N건 반환 */
export async function collectNewsFromFeeds(count = 10): Promise<NewsFeedItem[]> {
  const settled = await Promise.allSettled(
    SEARCH_QUERIES.map((q) => fetchFeed(q))
  );

  const merged: NewsFeedItem[] = [];
  const errors: string[] = [];

  for (const result of settled) {
    if (result.status === "fulfilled") {
      merged.push(...result.value);
    } else {
      errors.push(
        result.reason instanceof Error ? result.reason.message : String(result.reason)
      );
    }
  }

  if (merged.length === 0 && errors.length > 0) {
    throw new Error(errors.join("; "));
  }

  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const filtered = merged.filter((item) => {
    if (!isRelevant(item) || !isRecent(item.published_at)) return false;
    if (seenUrls.has(item.source_url)) return false;

    const fingerprint = titleFingerprint(item.title);
    if (fingerprint.length >= 8 && seenTitles.has(fingerprint)) return false;

    seenUrls.add(item.source_url);
    if (fingerprint.length >= 8) seenTitles.add(fingerprint);
    return true;
  });

  filtered.sort((a, b) => {
    if (a.published_at === b.published_at) return 0;
    return a.published_at < b.published_at ? 1 : -1;
  });

  return filtered.slice(0, count);
}
