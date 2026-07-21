import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";
import { syncExamPdfToArchive } from "@/lib/exam-pdf-archive";
import { getExamYearParams } from "@/lib/exam-questions";

const ADMIN_EMAIL = "newwavewind@gmail.com";
const ADMIN_NICKNAME = "봄기출";

function loadEnvFile(filename: string) {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
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
    process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env.seed.local");

async function resolveAdminAuthorId() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Client-Info": "seed-exam-pdfs-direct" } },
    realtime: { transport: ws as unknown as typeof WebSocket },
  });
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

  return { admin, authorId: user.id };
}

async function main() {
  const targets = getExamYearParams();
  const { admin, authorId } = await resolveAdminAuthorId();

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`등록 대상: ${targets.length}개`);

  for (const [index, item] of targets.entries()) {
    const year = Number(item.year);
    try {
      const status = await syncExamPdfToArchive(admin, authorId, item.subject, year);
      if (status === "created") created += 1;
      else if (status === "updated") updated += 1;
      else skipped += 1;
      console.log(`[${index + 1}/${targets.length}] ${item.subject} ${item.year} → ${status}`);
    } catch (err) {
      errors += 1;
      console.error(
        `[${index + 1}/${targets.length}] ${item.subject} ${item.year} ERROR:`,
        err instanceof Error ? err.message : err
      );
    }
  }

  console.log("완료", { created, updated, skipped, errors, total: targets.length });
  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
