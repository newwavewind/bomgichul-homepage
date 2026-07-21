#!/usr/bin/env node
/**
 * 전과목·전년도 기출 PDF를 자료실에 일괄 등록합니다.
 *
 * 사용법:
 *   node scripts/seed-exam-pdfs.mjs
 *   node scripts/seed-exam-pdfs.mjs --base http://localhost:3000
 *
 * .env.local 의 CRON_SECRET 이 필요합니다.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // ignore
  }
}

loadEnvLocal();

const base = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : process.env.SEED_BASE_URL || "http://localhost:3000";

const secret = process.env.CRON_SECRET;
if (!secret) {
  console.error("CRON_SECRET 이 없습니다. .env.local 을 확인하세요.");
  process.exit(1);
}

let offset = 0;
const limit = 10;
let done = false;
let totalCreated = 0;
let totalUpdated = 0;
let totalSkipped = 0;
let totalErrors = 0;

while (!done) {
  const url = `${base}/api/admin/seed-exam-pdfs?offset=${offset}&limit=${limit}`;
  const res = await fetch(url, {
    headers: { authorization: `Bearer ${secret}` },
  });
  const json = await res.json();

  if (!res.ok) {
    console.error("seed failed:", json);
    process.exit(1);
  }

  for (const row of json.results ?? []) {
    if (row.status === "created") totalCreated += 1;
    else if (row.status === "updated") totalUpdated += 1;
    else if (row.status === "skipped") totalSkipped += 1;
    else if (row.status === "error") {
      totalErrors += 1;
      console.error(`error ${row.subject} ${row.year}:`, row.error);
    }
  }

  console.log(
    `batch offset=${offset} processed=${json.processed} done=${json.done} (created=${totalCreated}, updated=${totalUpdated}, skipped=${totalSkipped}, errors=${totalErrors})`
  );

  done = json.done;
  if (json.nextOffset == null) break;
  offset = json.nextOffset;
}

console.log("finished", {
  created: totalCreated,
  updated: totalUpdated,
  skipped: totalSkipped,
  errors: totalErrors,
});
