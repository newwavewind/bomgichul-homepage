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
  "공인중개사법",
  "부동산 중개업",
  "전월세",
  "주택임대차",
  "청약",
  "취득세 OR 양도세 OR 종부세",
  "부동산 정책",
  "집값",
] as const;

/** 하루 목표 건수 (모자라면 있는 만큼, 넘치면 자름) */
export const NEWS_DAILY_TARGET = 7;
export const NEWS_DAILY_MIN = 5;

const KEYWORD_RE =
  /공인중개사|중개업|중개사|부동산\s*(정책|규제|세제|세법|공시|임대|거래)|취득세|양도세|종부세|주택임대차|전월세|청약|재건축|재개발|국토교통|부동산원|집값|매매가|전세가/i;

/** 제목 비교 시 무시할 공통/형식 단어 */
const TITLE_STOPWORDS = new Set([
  "및",
  "등",
  "위한",
  "위해",
  "대해",
  "관련",
  "기자",
  "뉴스",
  "속보",
  "단독",
  "종합",
  "사진",
  "영상",
  "위클리오늘",
  "실시",
  "개최",
  "진행",
  "논의",
  "조성",
  "맞손",
  "강화",
  "대상",
  "문화",
  "환경",
  "질서",
  "확립",
  "소통",
  "안심",
  "안전한",
  "안전",
]);

const BIGRAM_SIMILARITY_THRESHOLD = 0.36;
const TOKEN_OVERLAP_THRESHOLD = 0.34;
const MIN_SHARED_TOKENS = 2;

/** 뒤에 붙는 조사를 걷어 핵심 명사 형태로 맞춤 */
const PARTICLE_SUFFIXES = [
  "으로부터",
  "에서부터",
  "에게서",
  "한테서",
  "으로부터의",
  "으로는",
  "으로도",
  "으로는",
  "으로서",
  "으로써",
  "이라고",
  "라는",
  "과의",
  "와의",
  "에는",
  "에도",
  "에서",
  "으로",
  "로서",
  "로써",
  "에게",
  "한테",
  "께",
  "와",
  "과",
  "을",
  "를",
  "이",
  "가",
  "은",
  "는",
  "의",
  "에",
  "로",
  "도",
  "만",
  "뿐",
  "부터",
  "까지",
  "처럼",
  "같이",
] as const;

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
    .replace(/&amp;/g, "&")
    // RSS에 자주 섞이는 non-breaking space
    .replace(/&nbsp;/g, " ")
    .replace(/&#160;/g, " ");
}

function stripHtml(input: string): string {
  return decodeXmlEntities(input)
    // 실제 NBSP(유니코드 160)도 일반 공백으로 정규화
    .replace(/\u00A0/g, " ")
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

function cleanSummary(summary: string, sourceName: string): string {
  // title/source_name이 description에 뒤섞여 들어오는 경우가 있어 뒤를 정리
  const normalized = summary.replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
  if (!sourceName) return normalized;
  const escapedSource = sourceName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // 예: "....  파이낸스투데이" / ".... 파이낸스투데이" 같은 꼬리 제거
  return normalized.replace(new RegExp(`\\s*${escapedSource}\\s*$`), "").trim();
}

function toDateString(value: string | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

/** 한국 시간 기준 YYYY-MM-DD */
export function todayKstDateString(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function extractTag(block: string, tag: string): string {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = block.match(re);
  return m ? stripHtml(m[1]) : "";
}

function extractSourceName(block: string, title: string): string {
  const sourceTitle = extractTag(block, "source");
  if (sourceTitle) return sourceTitle;

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
    const summaryRaw = truncateSummary(description || title);
    const summary = cleanSummary(summaryRaw, sourceName);
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

function normalizeTitleText(title: string): string {
  return title
    .toLowerCase()
    .replace(/[\[\]『』「」"'“”‘’·…!?.,:;~/\\|<>()（）【】]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripKoreanParticles(token: string): string {
  let t = token;
  let changed = true;
  while (changed && t.length > 2) {
    changed = false;
    for (const suffix of PARTICLE_SUFFIXES) {
      if (t.length > suffix.length + 1 && t.endsWith(suffix)) {
        t = t.slice(0, -suffix.length);
        changed = true;
        break;
      }
    }
  }
  return t;
}

/**
 * 비교용 핵심 토큰.
 * - 조사 제거(공인중개사와 → 공인중개사)
 * - 협회/지회 등 변형을 같은 축으로 묶기
 */
export function extractTitleTokens(title: string): Set<string> {
  const tokens = new Set<string>();
  for (const raw of normalizeTitleText(title).split(" ")) {
    let t = stripKoreanParticles(raw.trim());
    if (t.length < 2) continue;
    if (TITLE_STOPWORDS.has(t)) continue;
    if (/^\d+$/.test(t)) continue;

    // 기관명 변형 정규화
    t = t
      .replace(/공인중개사協/g, "공인중개사협회")
      .replace(/양평군지회/g, "양평지회")
      .replace(/양평군수/g, "양평군");

    tokens.add(t);

    // 복합어에 포함된 핵심어를 추가로 노출
    if (t.includes("공인중개사")) tokens.add("공인중개사");
    if (t.includes("간담회")) tokens.add("간담회");
    if (t.includes("연수")) tokens.add("연수교육");
    if (t.includes("중개환경") || t.includes("거래환경")) tokens.add("중개환경");
    if (t.includes("양평")) tokens.add("양평군");
    if (t.includes("광주")) tokens.add("광주시");
    if (t.includes("안산")) tokens.add("안산");
    if (t.includes("구속") || t.includes("송치")) {
      tokens.add("구속");
      tokens.add("송치");
    }
    if (t.includes("부동산") && (title.includes("정책") || t.includes("정책"))) {
      tokens.add("부동산정책");
    }
    if (t.includes("부정") || t.includes("잘못한다") || t.includes("불신")) {
      tokens.add("정책부정평가");
    }
    // 여론조사 수치(59.3% 등)는 같은 보도 묶는 강한 신호
    const pct = t.match(/\d+(?:\.\d+)?%/);
    if (pct) tokens.add(`pct:${pct[0]}`);
  }
  return tokens;
}

function charBigrams(text: string): Set<string> {
  const compact = normalizeTitleText(text).replace(/\s+/g, "");
  const grams = new Set<string>();
  if (compact.length < 2) {
    if (compact) grams.add(compact);
    return grams;
  }
  for (let i = 0; i < compact.length - 1; i++) {
    grams.add(compact.slice(i, i + 2));
  }
  return grams;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) {
    if (b.has(x)) inter += 1;
  }
  return inter / (a.size + b.size - inter);
}

function sharedTokenCount(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const x of a) {
    if (b.has(x)) n += 1;
  }
  return n;
}

function hasPlaceAndEventOverlap(a: Set<string>, b: Set<string>): boolean {
  const places = ["광주시", "양평군", "안산", "서울", "경기", "부산", "대구", "인천"];
  const events = ["간담회", "연수교육", "구속", "송치", "시험", "합격", "정책", "중개환경"];
  const sharedPlace = places.some((p) => a.has(p) && b.has(p));
  const sharedEvent = events.some((e) => a.has(e) && b.has(e));
  return sharedPlace && sharedEvent;
}

/** 같은 사건(여러 언론사 중복 보도)로 볼지 여부 — AI 없이 제목 유사도/키워드 */
export function isSameNewsStory(a: NewsFeedItem, b: NewsFeedItem): boolean {
  const tokensA = extractTitleTokens(a.title);
  const tokensB = extractTitleTokens(b.title);
  const shared = sharedTokenCount(tokensA, tokensB);
  const tokenSim = jaccard(tokensA, tokensB);
  const bigramSim = jaccard(charBigrams(a.title), charBigrams(b.title));

  // 같은 여론조사 수치를 담은 부동산 정책 기사는 동일 사건
  const pctA = [...tokensA].find((t) => t.startsWith("pct:"));
  const pctB = [...tokensB].find((t) => t.startsWith("pct:"));
  if (
    pctA &&
    pctA === pctB &&
    tokensA.has("부동산정책") &&
    tokensB.has("부동산정책")
  ) {
    return true;
  }

  // 부동산 정책 부정평가 여론 보도(수치 표기 달라도 동일 프레임)
  if (
    tokensA.has("부동산정책") &&
    tokensB.has("부동산정책") &&
    tokensA.has("정책부정평가") &&
    tokensB.has("정책부정평가")
  ) {
    return true;
  }

  // 같은 지역 + 같은 이벤트 유형이면 같은 사건으로 본다
  if (hasPlaceAndEventOverlap(tokensA, tokensB) && shared >= MIN_SHARED_TOKENS) {
    return true;
  }
  if (shared >= MIN_SHARED_TOKENS && tokenSim >= TOKEN_OVERLAP_THRESHOLD) {
    return true;
  }
  if (shared >= MIN_SHARED_TOKENS && bigramSim >= BIGRAM_SIMILARITY_THRESHOLD) {
    return true;
  }
  if (bigramSim >= 0.5 && shared >= 1) {
    return true;
  }
  return false;
}

/**
 * URL 중복·같은 사건 중복을 제거하고 최대 maxCount건 선택.
 * maxCount에 못 미치면 있는 만큼만 반환 (강제 채우기 없음).
 * @param excludeAgainst 이미 저장된 기사(있다면 같은 사건으로 판정되는 후보 제외)
 */
export function dedupeNewsStories(
  items: NewsFeedItem[],
  maxCount: number,
  excludeAgainst: NewsFeedItem[] = []
): NewsFeedItem[] {
  const seenUrls = new Set<string>();
  const selected: NewsFeedItem[] = [];

  for (const item of items) {
    if (selected.length >= maxCount) break;
    if (seenUrls.has(item.source_url)) continue;
    if (selected.some((kept) => isSameNewsStory(item, kept))) continue;
    if (excludeAgainst.some((kept) => isSameNewsStory(item, kept))) continue;

    seenUrls.add(item.source_url);
    selected.push(item);
  }

  return selected;
}

/**
 * 우선순위 점수 (높을수록 먼저).
 * 1) 공인중개사 직접 → 2) 전월세·청약·세금 → 3) 부동산 정책 → 4) 시장
 */
export function newsPriorityScore(item: NewsFeedItem): number {
  const text = `${item.title} ${item.summary}`;

  if (/공인중개사|중개업|중개사법|중개보조|개업공인중개사|중개보수|중개수수료/i.test(text)) {
    return 400;
  }
  if (/전월세|전세|월세|주택임대차|임대차보호|청약|분양|특공/i.test(text)) {
    return 300;
  }
  if (/취득세|양도세|종부세|재산세|종합부동산세|부동산\s*세/i.test(text)) {
    return 250;
  }
  if (/부동산\s*정책|부동산규제|대출규제|LTV|DTI|DSR|토허제|재건축초과이익/i.test(text)) {
    return 200;
  }
  if (/집값|매매가|전세가|부동산\s*시장|아파트\s*시세|매수세|관망세/i.test(text)) {
    return 100;
  }
  return 50;
}

function compareNewsCandidates(
  a: NewsFeedItem,
  b: NewsFeedItem,
  today: string
): number {
  const aToday = a.published_at === today ? 0 : 1;
  const bToday = b.published_at === today ? 0 : 1;
  if (aToday !== bToday) return aToday - bToday;

  const scoreDiff = newsPriorityScore(b) - newsPriorityScore(a);
  if (scoreDiff !== 0) return scoreDiff;

  if (a.published_at === b.published_at) return 0;
  return a.published_at < b.published_at ? 1 : -1;
}

/** 여러 검색어 RSS를 모아 우선순위·사건 중복 제거 후 하루 목표 건수만큼 반환 */
export async function collectNewsFromFeeds(
  count = NEWS_DAILY_TARGET,
  options: { excludeAgainst?: NewsFeedItem[] } = {}
): Promise<NewsFeedItem[]> {
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

  const today = todayKstDateString();
  const excludeAgainst = options.excludeAgainst ?? [];
  const candidates = merged
    .filter((item) => isRelevant(item) && isRecent(item.published_at))
    .sort((a, b) => compareNewsCandidates(a, b, today));

  const todayPool = candidates.filter((item) => item.published_at === today);
  const fromToday = dedupeNewsStories(todayPool, count, excludeAgainst);
  if (fromToday.length > 0) {
    return fromToday;
  }

  return dedupeNewsStories(candidates, count, excludeAgainst);
}
