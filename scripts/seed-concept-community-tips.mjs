#!/usr/bin/env node
/**
 * 모두의 개념 — 봄기출 암기/함정 팁 시드
 *
 * 출처: 각 개념의 definition/intuition/keyPoints/pitfalls/example/questionRefs 만 사용.
 * (외부 지식·추정 금지)
 *
 * Usage:
 *   node --experimental-strip-types scripts/seed-concept-community-tips.mjs [--dry-run]
 *   node --experimental-strip-types scripts/seed-concept-community-tips.mjs --apply
 *
 * Env: .env.seed.local (SUPABASE_SERVICE_ROLE_KEY) + .env.local (URL)
 */
import { readFileSync, existsSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APPLY = process.argv.includes("--apply");
const DRY = !APPLY;
const ADMIN_EMAIL = "newwavewind@gmail.com";
const ADMIN_NICKNAME = "봄기출";
const MAX_CONTENT = 3900;
const TIP_MARKER = "시험용 암기 포인트";

const SUBJECTS = [
  { slug: "civillaw", file: "src/data/concepts/civillaw.ts" },
  { slug: "realestate", file: "src/data/concepts/realestate.ts" },
  { slug: "broker-law", file: "src/data/concepts/broker-law.ts" },
  { slug: "registry-law", file: "src/data/concepts/registry-law.ts" },
  { slug: "realestate-tax", file: "src/data/concepts/realestate-tax.ts" },
  { slug: "realestate-public-law", file: "src/data/concepts/realestate-public-law.ts" },
];

function loadEnv(filePath) {
  if (!existsSync(filePath)) return {};
  const out = {};
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    out[line.slice(0, i)] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function firstSentence(text, maxLen = 110) {
  const cleaned = String(text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const match = cleaned.match(/^(.+?[.。]|[^.。]{1,110})/);
  let s = (match?.[1] || cleaned).trim();
  if (s.length > maxLen) s = `${s.slice(0, maxLen - 1).trim()}…`;
  return s;
}

function pickRefLabel(questionRefs) {
  if (!Array.isArray(questionRefs) || questionRefs.length === 0) return "";
  const sorted = [...questionRefs].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return a.questionNo - b.questionNo;
  });
  const ref = sorted[0];
  if (!ref?.year || !ref?.questionNo) return "";
  return ` (${ref.year}년 ${ref.questionNo}번 유형)`;
}

function formatKeyPoint(point) {
  const raw = String(point || "").replace(/\s+/g, " ").trim();
  if (!raw) return "";

  // "라벨 = 내용" / "라벨: 내용" / "라벨 — 내용"
  const split = raw.match(/^(.{1,48}?)(?:\s*=\s*|\s*:\s*|\s+[—–-]\s+)(.+)$/u);
  if (split) {
    const label = split[1].trim().replace(/[.。]$/, "");
    const body = split[2].trim();
    if (label && body && label.length <= 40) {
      return `<p><b>${esc(label)}</b> = ${esc(body)}</p>`;
    }
  }
  return `<p>${esc(raw)}</p>`;
}

function cleanPitfall(pitfalls) {
  return String(pitfalls || "")
    .replace(/^\s*함정\s*[:：]?\s*/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** 개념 필드만으로 팁 HTML 생성 (환각 금지) */
export function buildTipContent(concept) {
  const refLabel = pickRefLabel(concept.questionRefs);
  const lines = [];
  lines.push(`<p><b>${TIP_MARKER}${esc(refLabel)}</b></p>`);

  const intro =
    firstSentence(concept.intuition) ||
    "시험에 자주 나오는 포인트입니다. 아래만 딱 외우세요.";
  lines.push(`<p>${esc(intro)}</p>`);

  const points = Array.isArray(concept.keyPoints)
    ? concept.keyPoints.map((p) => String(p).trim()).filter(Boolean)
    : [];

  // 핵심만: 최대 4개. 너무 길면 앞에서부터.
  for (const point of points.slice(0, 4)) {
    const html = formatKeyPoint(point);
    if (html) lines.push(html);
  }

  const pitfall = cleanPitfall(concept.pitfalls);
  if (pitfall) {
    lines.push(`<p><b>함정:</b> ${esc(pitfall)}</p>`);
  }

  const example = String(concept.example || "").replace(/\s+/g, " ").trim();
  if (example && example.length <= 180) {
    lines.push(`<p><b>예:</b> ${esc(example)}</p>`);
  }

  // keyPoints·pitfalls가 둘 다 비면 definition 한 줄만이라도
  if (points.length === 0 && !pitfall) {
    const def = firstSentence(concept.definition, 160);
    if (def) lines.push(`<p>${esc(def)}</p>`);
  }

  let content = lines.join("");
  if (content.length > MAX_CONTENT) {
    content = content.slice(0, MAX_CONTENT);
    const lastClose = content.lastIndexOf("</p>");
    if (lastClose > 0) content = content.slice(0, lastClose + 4);
  }
  return content;
}

function tipQuality(concept, content) {
  const hasPoints = Array.isArray(concept.keyPoints) && concept.keyPoints.length > 0;
  const hasPitfall = Boolean(String(concept.pitfalls || "").trim());
  if (!hasPoints && !hasPitfall) return "weak";
  if (content.length < 80) return "weak";
  return "ok";
}

async function loadConcepts() {
  const all = [];
  for (const subject of SUBJECTS) {
    const fileUrl = pathToFileURL(path.join(ROOT, subject.file)).href;
    const mod = await import(fileUrl);
    const list = mod.default;
    if (!Array.isArray(list)) {
      throw new Error(`개념 배열이 아닙니다: ${subject.file}`);
    }
    for (const concept of list) {
      all.push({ subject: subject.slug, concept });
    }
  }
  return all;
}

async function resolveAdminAuthorId(admin) {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw new Error(`관리자 계정 조회 실패: ${error.message}`);
  const user = data.users.find((u) => u.email === ADMIN_EMAIL);
  if (!user) throw new Error(`${ADMIN_EMAIL} 계정을 찾을 수 없습니다.`);

  const { data: profile } = await admin
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.nickname !== ADMIN_NICKNAME) {
    await admin
      .from("profiles")
      .upsert({ id: user.id, nickname: ADMIN_NICKNAME, username_set: true });
  }
  return user.id;
}

async function main() {
  const env = {
    ...loadEnv(path.join(ROOT, ".env.local")),
    ...loadEnv(path.join(ROOT, ".env.seed.local")),
  };
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 필요");

  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const rows = await loadConcepts();
  console.log(`concepts loaded: ${rows.length}`);

  const authorId = await resolveAdminAuthorId(admin);
  console.log(`author: ${ADMIN_NICKNAME} (${authorId})`);

  const { data: existing, error: existingError } = await admin
    .from("concept_community_posts")
    .select("subject,concept_slug,user_id,content")
    .eq("user_id", authorId);
  if (existingError) throw new Error(existingError.message);

  const skipKeys = new Set(
    (existing || [])
      .filter((p) => String(p.content || "").includes(TIP_MARKER) || String(p.content || "").includes("기출"))
      .map((p) => `${p.subject}::${p.concept_slug}`)
  );
  // 이미 수동으로 쓴 팁도 포함
  for (const p of existing || []) {
    skipKeys.add(`${p.subject}::${p.concept_slug}`);
  }
  console.log(`existing 봄기출 posts: ${(existing || []).length}`);

  const planned = [];
  let weak = 0;
  for (const { subject, concept } of rows) {
    const key = `${subject}::${concept.slug}`;
    if (skipKeys.has(key)) continue;
    const content = buildTipContent(concept);
    const quality = tipQuality(concept, content);
    if (quality === "weak") weak += 1;
    planned.push({
      subject,
      concept_slug: concept.slug,
      titleKo: concept.titleKo,
      content,
      quality,
    });
  }

  console.log(`to insert: ${planned.length} (weak-signal: ${weak})`);
  console.log("--- samples ---");
  for (const sample of planned.slice(0, 3)) {
    console.log(`\n[${sample.subject}/${sample.concept_slug}] ${sample.titleKo}`);
    console.log(sample.content.replace(/<\/p>/g, "</p>\n"));
  }

  if (DRY) {
    console.log("\n[dry-run] --apply 로 실제 insert");
    return;
  }

  let ok = 0;
  let fail = 0;
  const BATCH = 40;
  for (let i = 0; i < planned.length; i += BATCH) {
    const chunk = planned.slice(i, i + BATCH).map((p) => ({
      user_id: authorId,
      subject: p.subject,
      concept_slug: p.concept_slug,
      content: p.content,
    }));
    const { error } = await admin.from("concept_community_posts").insert(chunk);
    if (error) {
      fail += chunk.length;
      console.error(`batch ${i}:`, error.message);
      // fallback one-by-one
      for (const row of chunk) {
        const { error: oneErr } = await admin.from("concept_community_posts").insert(row);
        if (oneErr) {
          console.error(`  fail ${row.subject}/${row.concept_slug}:`, oneErr.message);
        } else {
          ok += 1;
          fail -= 1;
        }
      }
    } else {
      ok += chunk.length;
      console.log(`inserted ${ok}/${planned.length}`);
    }
  }

  console.log(`done ok=${ok} fail=${fail}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
