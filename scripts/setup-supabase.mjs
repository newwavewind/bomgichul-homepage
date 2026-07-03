#!/usr/bin/env node
/**
 * Supabase 프로젝트 생성 → link → migration → .env.local
 * 사용: SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/setup-supabase.mjs
 * 또는: 프로젝트 루트에 .supabase-access-token 파일에 토큰 저장 후 node scripts/setup-supabase.mjs
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECT_NAME = "bomgichul-homepage";
const REGION = "ap-northeast-2";

function getToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN.trim();
  const tokenPath = join(root, ".supabase-access-token");
  if (existsSync(tokenPath)) return readFileSync(tokenPath, "utf8").trim();
  console.error("❌ SUPABASE_ACCESS_TOKEN 또는 .supabase-access-token 파일이 필요합니다.");
  process.exit(1);
}

function run(cmd, opts = {}) {
  return execSync(cmd, {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, SUPABASE_ACCESS_TOKEN: token },
    ...opts,
  });
}

const token = getToken();
process.env.SUPABASE_ACCESS_TOKEN = token;

console.log("✅ 1–3. CLI 준비 완료 (supabase 2.x via npm)\n");

// 로그인 확인
try {
  run("npx supabase projects list -o json");
  console.log("✅ 4. Supabase CLI 인증 확인\n");
} catch {
  console.error("❌ Access Token이 유효하지 않습니다. 새 토큰을 발급해 주세요.");
  process.exit(1);
}

// 기존 동일 이름 프로젝트 확인
let projectRef = null;
try {
  const list = JSON.parse(run("npx supabase projects list -o json"));
  const existing = list.find((p) => p.name === PROJECT_NAME);
  if (existing) {
    projectRef = existing.id;
    console.log(`ℹ️  기존 프로젝트 사용: ${PROJECT_NAME} (${projectRef})\n`);
  }
} catch (e) {
  console.error("프로젝트 목록 조회 실패:", e.message);
  process.exit(1);
}

if (!projectRef) {
  console.log("📋 5. 조직 목록:");
  const orgs = JSON.parse(run("npx supabase orgs list -o json"));
  if (!orgs.length) {
    console.error("❌ Supabase 조직이 없습니다. Dashboard에서 조직을 먼저 만드세요.");
    process.exit(1);
  }
  console.log(`   → ${orgs[0].name} (${orgs[0].id})\n`);

  const dbPassword = randomBytes(16).toString("base64url").slice(0, 24);
  writeFileSync(join(root, ".supabase-db-password"), dbPassword);
  console.log("🚀 6. 프로젝트 생성 중...");
  console.log(`   이름: ${PROJECT_NAME} | 리전: ${REGION} (Seoul)`);
  console.log(`   🔑 DB 비밀번호 (저장해 두세요): ${dbPassword}\n`);

  const created = JSON.parse(
    run(
      `npx supabase projects create "${PROJECT_NAME}" --org-id "${orgs[0].id}" --db-password "${dbPassword}" --region "${REGION}" -o json`
    )
  );
  projectRef = created.id;
  console.log(`✅ 생성됨 — project ref: ${projectRef}`);
  console.log("⏳ 프로visioning 대기 (90초)...\n");
  execSync("sleep 90", { stdio: "inherit" });
}

// Link
console.log("🔗 6. 프로젝트 link...");
const dbPasswordPath = join(root, ".supabase-db-password");
const dbPassword = existsSync(dbPasswordPath) ? readFileSync(dbPasswordPath, "utf8").trim() : "";
const linkCmd = dbPassword
  ? `npx supabase link --project-ref "${projectRef}" --password "${dbPassword}"`
  : `npx supabase link --project-ref "${projectRef}"`;
try {
  run(linkCmd, { stdio: "pipe" });
} catch {
  // 이미 link된 경우 config.toml 업데이트
  const configPath = join(root, "supabase/config.toml");
  let config = readFileSync(configPath, "utf8");
  if (!config.includes(`project_id = "${projectRef}"`)) {
    config = config.replace(/project_id = ".*"/, `project_id = "${projectRef}"`);
    if (!config.includes("project_id =")) {
      config = config.replace(
        '# Supabase CLI config',
        `# Supabase CLI config\nproject_id = "${projectRef}"`
      );
    }
    writeFileSync(configPath, config);
  }
}
console.log(`✅ link 완료: ${projectRef}\n`);

// DB push
console.log("📦 7. migration 적용 (db push)...");
try {
  run("npx supabase db push --yes", { stdio: "inherit" });
  console.log("\n✅ migration 적용 완료\n");
} catch (e) {
  console.warn("⚠️  db push 실패 — schema.sql을 Dashboard SQL Editor에서 실행해야 할 수 있습니다.");
  console.warn(String(e.message || e));
}

// API keys
console.log("🔑 8. API 키 조회...");
const keys = JSON.parse(run(`npx supabase projects api-keys --project-ref "${projectRef}" -o json`));
const anon = keys.find((k) => k.name === "anon" || k.type === "anon");
const url = `https://${projectRef}.supabase.co`;

if (!anon?.api_key) {
  console.error("❌ anon key를 가져오지 못했습니다. Dashboard → Settings → API에서 수동 복사하세요.");
  process.exit(1);
}

const envContent = `NEXT_PUBLIC_SUPABASE_URL=${url}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anon.api_key}
`;
writeFileSync(join(root, ".env.local"), envContent);
console.log(`✅ .env.local 생성 완료`);
console.log(`   URL: ${url}\n`);

// Connection test
console.log("🧪 9. Supabase 연결 테스트...");
const testRes = await fetch(`${url}/rest/v1/`, {
  headers: {
    apikey: anon.api_key,
    Authorization: `Bearer ${anon.api_key}`,
  },
});
if (testRes.ok || testRes.status === 404) {
  console.log("✅ Supabase REST API 연결 정상\n");
} else {
  console.warn(`⚠️  REST 응답: ${testRes.status} (프로젝트가 아직 provisioning 중일 수 있음)\n`);
}

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("완료! 다음도 설정하세요:");
console.log("• Supabase Dashboard → Authentication → URL Configuration");
console.log("  Site URL: https://bomgichul-homepage.vercel.app");
console.log("  Redirect: http://localhost:3000/auth/callback");
console.log("            https://bomgichul-homepage.vercel.app/auth/callback");
console.log("• Vercel Environment Variables에 .env.local과 동일 값 추가 후 Redeploy");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
