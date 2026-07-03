#!/usr/bin/env node
/**
 * Supabase 공식 CLI 연결 흐름
 * 1. supabase login (--token 또는 ~/.config/supabase/access-token)
 * 2. supabase link --project-ref --password
 * 3. supabase db push
 * 4. supabase projects api-keys → .env.local
 *
 * 환경변수 (선택):
 *   SUPABASE_ACCESS_TOKEN  — Account Access Token (login --token)
 *   SUPABASE_PROJECT_REF   — Reference ID
 *   SUPABASE_DB_PASSWORD   — Database password
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokenPath = join(root, ".supabase-access-token");
const envLocalPath = join(root, ".env.supabase.local");
const cliTokenPath = join(homedir(), ".config/supabase/access-token");

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

loadEnvFile(envLocalPath);

function run(cmd, opts = {}) {
  return execSync(cmd, {
    cwd: root,
    encoding: "utf8",
    ...opts,
  });
}

function getToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN?.trim()) return process.env.SUPABASE_ACCESS_TOKEN.trim();
  if (existsSync(tokenPath)) return readFileSync(tokenPath, "utf8").trim();
  if (existsSync(cliTokenPath)) return readFileSync(cliTokenPath, "utf8").trim();
  return null;
}

// ── 1. Login ──
const token = getToken();
if (token && !existsSync(cliTokenPath)) {
  console.log("🔐 supabase login --token (공식 CLI 인증)...");
  run(`npx supabase login --token "${token.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
} else if (existsSync(cliTokenPath)) {
  console.log("✅ Supabase CLI 이미 로그인됨 (~/.config/supabase/access-token)\n");
} else {
  console.error(`
❌ Supabase CLI 로그인이 필요합니다.

공식 방법 (택 1):

【A】 Cursor 통합 터미널에서 (브라우저 OAuth, 1회):
    cd ${root}
    npx supabase login

【B】 Access Token으로 (Agent 자동화용, 1회):
    1. https://supabase.com/dashboard/account/tokens → Generate token
    2. 프로젝트 루트에 .supabase-access-token 파일에 토큰 저장
    3. 다시 npm run supabase:connect 실행

로그인 후 다시 실행해 주세요.
`);
  process.exit(1);
}

// ── 2. Link ──
const projectRef = process.env.SUPABASE_PROJECT_REF?.trim();
const dbPassword = process.env.SUPABASE_DB_PASSWORD?.trim();

if (!projectRef || !dbPassword) {
  console.error(`
❌ link에 project ref와 DB 비밀번호가 필요합니다.

공식 방법 (택 1):

【A】 Cursor 통합 터미널에서 (비밀번호 프롬프트, 가장 공식적):
    npx supabase link --project-ref YOUR_REFERENCE_ID

【B】 환경변수로 Agent 실행:
    SUPABASE_PROJECT_REF=your_ref SUPABASE_DB_PASSWORD=your_pass npm run supabase:connect

【C】 .env.supabase.local 파일 (gitignore됨):
    cp .env.supabase.local.example .env.supabase.local
    # SUPABASE_PROJECT_REF, SUPABASE_DB_PASSWORD 입력 후 npm run supabase:connect
`);
  process.exit(1);
}

console.log(`🔗 supabase link --project-ref ${projectRef}`);
try {
  run(
    `npx supabase link --project-ref "${projectRef}" --password "${dbPassword.replace(/"/g, '\\"')}"`,
    { stdio: "inherit" }
  );
} catch {
  console.log("ℹ️  이미 link된 프로젝트일 수 있습니다.\n");
}

// config.toml project_id
const configPath = join(root, "supabase/config.toml");
let toml = readFileSync(configPath, "utf8");
if (toml.includes('project_id = ""')) {
  toml = toml.replace('project_id = ""', `project_id = "${projectRef}"`);
}
writeFileSync(configPath, toml);

// ── 3. db push ──
console.log("\n📦 supabase db push");
run("npx supabase db push --yes", { stdio: "inherit" });

// ── 4. API keys → .env.local ──
console.log("\n🔑 supabase projects api-keys");
const keys = JSON.parse(run(`npx supabase projects api-keys --project-ref "${projectRef}" -o json`));
const anon = keys.find((k) => k.name === "anon" || k.type === "anon");
if (!anon?.api_key) {
  console.error("❌ anon key 조회 실패");
  process.exit(1);
}

const url = `https://${projectRef}.supabase.co`;
writeFileSync(
  join(root, ".env.local"),
  `NEXT_PUBLIC_SUPABASE_URL=${url}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${anon.api_key}\n`
);
console.log("✅ .env.local 생성 완료");

// ── 5. 연결 테스트 ──
const res = await fetch(`${url}/rest/v1/profiles?select=id&limit=1`, {
  headers: { apikey: anon.api_key, Authorization: `Bearer ${anon.api_key}` },
});
console.log(res.ok || res.status === 200 ? "✅ Supabase REST 연결 정상\n" : `⚠️  REST ${res.status}\n`);
console.log("다음: npm run dev");
