import { readFileSync, unlinkSync, existsSync } from "node:fs";
import { collectNewsFromFeeds } from "../src/lib/news-feed.ts";

function loadEnv(path) {
  const vals = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    vals[line.slice(0, i)] = line.slice(i + 1).trim().replace(/^\"|\"$/g, "");
  }
  return vals;
}

async function main() {
  const envPath = process.argv[2] || ".env.dev.tmp";
  if (!existsSync(envPath)) throw new Error(`missing ${envPath}`);
  const vals = loadEnv(envPath);
  unlinkSync(envPath);

  const url = vals.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = vals.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("missing supabase env");

  const rows = await collectNewsFromFeeds(10);
  console.log("unique_collected", rows.length);
  if (rows.length === 0) return;

  // 오늘 뉴스만 깔끔히 교체하기 위해 전체를 재구성합니다.
  const delRes = await fetch(`${url}/rest/v1/news_items?id=not.is.null`, {
    method: "DELETE",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "return=minimal",
    },
  });
  if (!delRes.ok) {
    throw new Error(`delete failed: ${delRes.status} ${await delRes.text()}`);
  }

  const upsertRes = await fetch(
    `${url}/rest/v1/news_items?on_conflict=source_url,published_at`,
    {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(rows),
    }
  );
  if (!upsertRes.ok) {
    throw new Error(
      `upsert failed: ${upsertRes.status} ${await upsertRes.text()}`
    );
  }

  for (const r of rows) {
    console.log("-", r.published_at, r.source_name, "|", r.title.slice(0, 60));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

