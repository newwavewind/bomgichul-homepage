import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Supabase 공지(2026-10-21 메일): 2026-10-30 부터 public 스키마에 새로 만드는 테이블은 API(anon·
 * authenticated·service_role)에 자동으로 열리지 않는다. 마이그레이션에 grant 를 함께 넣지 않으면 앱에서
 * 「permission denied」가 난다. 그날 이후 날짜의 마이그레이션이 public 테이블을 만들면 같은 파일에
 * 그 테이블 grant 가 있어야 한다. 기존 테이블은 영향 없음.
 */
const MIGRATIONS = join(process.cwd(), "supabase", "migrations");
const CUTOFF = "20261030";

function createdPublicTables(sql: string): string[] {
  const names: string[] = [];
  const re = /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:"?public"?\.)?"?([a-z0-9_]+)"?\s*\(/gi;
  for (const match of sql.matchAll(re)) {
    const before = sql.slice(Math.max(0, match.index - 1), match.index + match[0].length);
    if (/\b(?:auth|storage|cron|realtime|extensions)\./i.test(before)) continue;
    names.push(match[1]!.toLowerCase());
  }
  return names;
}

describe("새 테이블 마이그레이션의 grant", () => {
  const files = readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql") && f.slice(0, 8) >= CUTOFF);
  it.each(files.length ? files : ["(해당 없음)"])("%s", (file) => {
    if (file === "(해당 없음)") return;
    const sql = readFileSync(join(MIGRATIONS, file), "utf8");
    const missing = createdPublicTables(sql).filter(
      (table) => !new RegExp(`grant\\s+[^;]+\\s+on\\s+(?:table\\s+)?(?:"?public"?\\.)?"?${table}"?\\b`, "i").test(sql),
    );
    expect(missing, `${file}: grant 없는 새 테이블 — 예) grant select, insert, update, delete on public.<표> to authenticated; grant all on public.<표> to service_role;`).toEqual([]);
  });

  it("검사기 자체 — grant 빠진 표를 잡는다", () => {
    const sql = "create table if not exists public.demo (id int);";
    expect(createdPublicTables(sql)).toEqual(["demo"]);
  });
});
