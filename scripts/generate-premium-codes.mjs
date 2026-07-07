#!/usr/bin/env node
/**
 * 과목별 프리미엄 잠금해제 코드를 생성해 premium_codes 테이블에 등록한다.
 * 모바일 앱 인앱결제 시 코드를 자동 발급하는 기능이 아직 없어, 수동 발급용으로 사용한다.
 *
 * 사용법: node scripts/generate-premium-codes.mjs <subject> <count>
 * 예:     node scripts/generate-premium-codes.mjs civillaw 5
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const VALID_SUBJECTS = [
  "civillaw",
  "realestate",
  "broker-law",
  "registry-law",
  "realestate-tax",
  "realestate-public-law",
];

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

loadEnvFile(join(REPO_ROOT, ".env.local"));

const [, , subject, countArg] = process.argv;
const count = Number(countArg ?? 1);

if (!VALID_SUBJECTS.includes(subject) || !Number.isInteger(count) || count < 1) {
  console.error(`사용법: node scripts/generate-premium-codes.mjs <subject> <count>
subject는 다음 중 하나여야 합니다: ${VALID_SUBJECTS.join(", ")}`);
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY가 필요합니다. .env.local을 확인하세요.\n" +
      "(Supabase Dashboard → Settings → API → service_role)"
  );
  process.exit(1);
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 0/O, 1/I/L 제외 (헷갈림 방지)

function randomCode() {
  const part = () =>
    Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
  return `${part()}-${part()}`;
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

const codes = Array.from({ length: count }, randomCode);

const { error } = await admin
  .from("premium_codes")
  .insert(codes.map((code) => ({ code, subject })));

if (error) {
  console.error("코드 생성 실패:", error.message);
  process.exit(1);
}

console.log(`✅ ${subject} 코드 ${count}개 생성 완료:\n`);
codes.forEach((code) => console.log(code));
