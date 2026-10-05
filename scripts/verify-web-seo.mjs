import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const base = process.env.PREVIEW_URL || "http://localhost:3000";
const scopes = [
  "real-estate",
  "public-service",
  "police",
  "housing",
  "social-worker",
  "english",
  "history",
  "firefighter",
  "gugeo",
  "haengjeongsa",
  "semusa",
  "sanan",
  "sonhae",
  "nomusa",
  "gyeongbi",
];
const results = [];
const anchors = (html) =>
  [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((m) =>
    m[1].replaceAll("&amp;", "&"),
  );
async function inspect(path, privatePage = false) {
  const res = await fetch(new URL(path, base), {
    headers: { "User-Agent": "Googlebot" },
    signal: AbortSignal.timeout(120000),
  });
  assert.equal(res.status, 200, path);
  const html = await res.text();
  const canonical = [
    ...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/g),
  ].map((m) => m[1]);
  assert.equal(canonical.length, 1, `one canonical: ${path}`);
  assert.equal(
    decodeURI(new URL(canonical[0]).href),
    decodeURI(new URL(path.split("?")[0], "https://www.bomgichul.com").href),
    path,
  );
  assert.match(html, /<title>[^<]+<\/title>/, `title ${path}`);
  assert.match(
    html,
    /<meta name="description" content="[^"]+"/,
    `description ${path}`,
  );
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `one h1 ${path}`);
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] || "";
  assert.equal(
    robots.includes("noindex"),
    privatePage,
    `robots ${path}: ${robots}`,
  );
  const json = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].map((m) => JSON.parse(m[1]));
  assert.ok(json.length > 0, `JSON-LD ${path}`);
  results.push({
    path,
    status: res.status,
    canonical: canonical[0],
    robots,
    h1: 1,
    jsonLd: json.length,
  });
  console.log(`PASS ${path}`);
  return html;
}
const home = await inspect("/");
for (const scope of scopes)
  assert.ok(anchors(home).includes(`/${scope}`), `SSR home link ${scope}`);
for (const scope of scopes) {
  const hub = await inspect(`/${scope}`);
  assert.match(hub, /앱 안내|앱 설치 안내/);
  const prefix = scope === "real-estate" ? "/exam/" : `/${scope}/exam/`;
  const subject = anchors(hub).find(
    (path) =>
      path.startsWith(prefix) &&
      path.slice(prefix.length).split("/").length === 1,
  );
  assert.ok(subject, `subject ${scope}`);
  const subjectHtml = await inspect(subject);
  const session = anchors(subjectHtml).find(
    (path) =>
      path.startsWith(subject + "/") && /\/\d{4}(?:\/[^/]+)?$/.test(path),
  );
  assert.ok(session, `session ${scope}`);
  const sessionHtml = await inspect(session);
  const question = anchors(sessionHtml).find(
    (path) => path.startsWith(session + "/") && /\/\d+$/.test(path),
  );
  assert.ok(question, `question ${scope}`);
  const questionHtml = await inspect(question);
  assert.match(questionHtml, /문항 해설|선지별 해설|해설 요약/);
  assert.match(questionHtml, /비공개 개인 메모/);
  assert.match(questionHtml, /이 문제에 대한 이야기/);
  const concept = anchors(questionHtml).find(
    (path) =>
      path.includes("/concepts/") &&
      path.split("/").length >= (scope === "real-estate" ? 4 : 5),
  );
  if (concept) {
    const conceptHtml = await inspect(concept);
    assert.match(conceptHtml, /개념 바로가기/);
  }
}
await inspect("/search?q=민법", true);
await inspect("/study-tools", true);
const robots = await (await fetch(`${base}/robots.txt`)).text();
assert.ok(robots.includes("Sitemap: https://www.bomgichul.com/sitemap.xml"));
assert.ok(!robots.includes("Disallow: /study-tools"));
await writeFile(
  "/tmp/bom-web-seo-results.json",
  JSON.stringify(results, null, 2),
);
console.log(
  `Verified ${results.length} server-rendered pages; original public routes remain indexable.`,
);
