#!/usr/bin/env node
/**
 * 기출 문항 「나만의 메모」— 봄기출 암기/대비 가이드 시드
 *
 * 출처(환각 금지):
 *  - exam-questions/*.json 의 stem / items / explanation / explanationSummary / correctChoice
 *  - concepts 의 questionRefs 매칭 시 intuition / keyPoints / pitfalls / example / definition
 *
 * Usage:
 *   node --experimental-strip-types scripts/seed-question-public-memos.mjs [--dry-run]
 *   node --experimental-strip-types scripts/seed-question-public-memos.mjs --apply
 */
import { readFileSync, existsSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APPLY = process.argv.includes("--apply");
const REFRESH = process.argv.includes("--refresh");
const DRY = !APPLY && !REFRESH;

const ADMIN_EMAIL = "newwavewind@gmail.com";
const ADMIN_NICKNAME = "봄기출";
const MEMO_MARKER = "이 문항, 한 줄로 잡으면";
const MAX_CONTENT = 3500;

const SUBJECTS = [
  { slug: "civillaw", exam: "src/data/exam-questions/civillaw.json", concepts: "src/data/concepts/civillaw.ts" },
  { slug: "realestate", exam: "src/data/exam-questions/realestate.json", concepts: "src/data/concepts/realestate.ts" },
  { slug: "broker-law", exam: "src/data/exam-questions/broker-law.json", concepts: "src/data/concepts/broker-law.ts" },
  { slug: "registry-law", exam: "src/data/exam-questions/registry-law.json", concepts: "src/data/concepts/registry-law.ts" },
  { slug: "realestate-tax", exam: "src/data/exam-questions/realestate-tax.json", concepts: "src/data/concepts/realestate-tax.ts" },
  { slug: "realestate-public-law", exam: "src/data/exam-questions/realestate-public-law.json", concepts: "src/data/concepts/realestate-public-law.ts" },
];

const CIRCLE = { "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤" };

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

function softTrim(text, maxLen = 160) {
  const cleaned = String(text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  if (cleaned.length <= maxLen) return cleaned;
  // 문장 경계로 자르되, 핵심이 잘리지 않게 여유를 둠
  const slice = cleaned.slice(0, maxLen);
  const lastStop = Math.max(slice.lastIndexOf("."), slice.lastIndexOf("。"), slice.lastIndexOf("—"));
  if (lastStop > maxLen * 0.45) return slice.slice(0, lastStop + 1).trim();
  return `${slice.trim()}…`;
}

function firstSentence(text, maxLen = 120) {
  return softTrim(text, maxLen);
}

function choiceLabel(key) {
  return CIRCLE[String(key)] || String(key);
}

function findCorrectItem(q) {
  const key = String(q.correctChoice);
  return (q.items || []).find((it) => String(it.key) === key) || null;
}

function findCorrectCombo(q) {
  return (q.comboChoices || []).find((c) => c.isCorrect) || null;
}

function buildConceptIndex(concepts, subject) {
  /** @type {Map<string, any>} */
  const byRef = new Map();
  for (const c of concepts) {
    for (const ref of c.questionRefs || []) {
      const key = `${subject}::${ref.year}::${ref.questionNo}`;
      if (!byRef.has(key)) byRef.set(key, c);
    }
  }
  return byRef;
}

/**
 * 스토리텔링형 메모 — 기존 필드만 재구성 (법령·사실 추가 금지)
 */
export function buildMemoContent(q, concept) {
  const lines = [];
  const isComposite = q.questionType === "composite";

  lines.push(`${MEMO_MARKER}?`);
  lines.push("");

  // 개념 직관(있을 때만) — 문항 유형 설명 같은 군더더기는 넣지 않음
  if (concept?.intuition) {
    lines.push("먼저 큰 그림부터.");
    lines.push(firstSentence(concept.intuition, 140));
    lines.push("");
  } else if (concept?.definition) {
    lines.push("먼저 큰 그림부터.");
    lines.push(firstSentence(concept.definition, 140));
    lines.push("");
  }

  // 정답 선언
  const correctItem = findCorrectItem(q);
  const correctCombo = findCorrectCombo(q);
  if (correctCombo) {
    lines.push(`정답은 ${choiceLabel(correctCombo.no)} ${correctCombo.text || ""}`.trim());
  } else if (correctItem) {
    lines.push(`정답은 ${choiceLabel(correctItem.key)} 「${correctItem.text}」이에요.`);
  } else {
    lines.push(`정답은 ${choiceLabel(q.correctChoice)}이에요.`);
  }
  if (q.explanationSummary && !/^정답은/.test(q.explanationSummary.trim())) {
    lines.push(firstSentence(q.explanationSummary, 160));
  }
  lines.push("");

  // 왜 헷갈리는지 = 함정(개념) 우선, 없으면 정답 선지 해설
  const trapSource = concept?.pitfalls || correctItem?.explanation || "";
  if (trapSource) {
    lines.push("왜 헷갈리냐면요.");
    lines.push(softTrim(trapSource, 220));
    lines.push("");
  }

  // 선지/보기 가이드
  const items = Array.isArray(q.items) ? q.items : [];
  if (items.length > 0) {
    lines.push(isComposite ? "보기별로 보면" : "선지별로 보면");
    lines.push("");

    // 틀린 것(X)을 먼저 — 실전에서 중요
    const sorted = [...items].sort((a, b) => {
      if (a.answer === b.answer) return Number(a.key) - Number(b.key);
      return a.answer === "X" ? -1 : 1;
    });

    for (const it of sorted.slice(0, 6)) {
      const mark = it.answer === "O" ? "O" : "X";
      const head = `${choiceLabel(it.key)} ${it.text}`.trim();
      lines.push(`${head}`);
      lines.push(`→ ${mark}. ${softTrim(it.explanation || (it.answer === "O" ? "해당·옳음." : "해당 없음·틀림."), 180)}`);
      lines.push("");
    }
  }

  // combo choices brief
  const combos = Array.isArray(q.comboChoices) ? q.comboChoices : [];
  if (combos.length > 0 && items.length === 0) {
    lines.push("선지 조합");
    lines.push("");
    for (const c of combos.slice(0, 5)) {
      const mark = c.isCorrect ? "정답" : "오답";
      lines.push(`${choiceLabel(c.no)} ${c.text} → ${mark}`);
      if (c.explanation) lines.push(firstSentence(c.explanation, 120));
      lines.push("");
    }
  }

  // 암기 팁 from concept keyPoints (max 3) or distilled from X explanations
  lines.push("암기 팁");
  lines.push("");
  const tips = [];
  if (concept?.keyPoints?.length) {
    for (const kp of concept.keyPoints.slice(0, 3)) {
      tips.push(`· ${firstSentence(kp, 130)}`);
    }
  } else {
    const xItems = items.filter((it) => it.answer === "X" && it.explanation);
    for (const it of xItems.slice(0, 2)) {
      tips.push(`· ${firstSentence(it.explanation, 130)}`);
    }
    const oItems = items.filter((it) => it.answer === "O" && it.explanation);
    if (tips.length < 2 && oItems[0]) {
      tips.push(`· ${firstSentence(oItems[0].explanation, 130)}`);
    }
  }
  if (tips.length === 0) {
    tips.push(`· 정답 ${choiceLabel(q.correctChoice)}만 확실히 잡고, 나머지 선지는 ‘왜 탈락인지’만 외우세요.`);
  }
  lines.push(...tips);
  lines.push("");

  if (concept?.pitfalls) {
    lines.push("함정");
    lines.push(firstSentence(concept.pitfalls, 160));
    lines.push("");
  }

  if (concept?.example) {
    lines.push("한 줄 예");
    lines.push(firstSentence(concept.example, 140));
    lines.push("");
  }

  let content = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  if (content.length > MAX_CONTENT) {
    content = content.slice(0, MAX_CONTENT);
    const cut = content.lastIndexOf("\n");
    if (cut > MAX_CONTENT * 0.6) content = content.slice(0, cut).trim();
  }
  return content;
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

  const planned = [];
  let withConcept = 0;

  for (const subject of SUBJECTS) {
    const questions = JSON.parse(
      readFileSync(path.join(ROOT, subject.exam), "utf8")
    );
    const conceptMod = await import(pathToFileURL(path.join(ROOT, subject.concepts)).href);
    const concepts = conceptMod.default;
    const index = buildConceptIndex(concepts, subject.slug);

    for (const q of questions) {
      const concept = index.get(`${subject.slug}::${q.year}::${q.questionNo}`) || null;
      if (concept) withConcept += 1;
      const content = buildMemoContent(q, concept);
      planned.push({
        subject: subject.slug,
        year: q.year,
        question_no: q.questionNo,
        content,
        hasConcept: Boolean(concept),
      });
    }
  }

  console.log(`questions: ${planned.length}, with concept match: ${withConcept}`);

  // highlight the user's example question
  const sample =
    planned.find((p) => p.subject === "realestate" && p.year === 2022 && p.question_no === 32) ||
    planned[0];
  console.log("\n--- sample (2022 부동산학개론 32) ---\n");
  console.log(sample.content);
  console.log("\n--- end sample ---\n");

  const authorId = await resolveAdminAuthorId(admin);
  console.log(`author: ${ADMIN_NICKNAME} (${authorId})`);

  const { data: existing, error: existingError } = await admin
    .from("question_public_memos")
    .select("id,subject,year,question_no")
    .eq("user_id", authorId);
  if (existingError) throw new Error(existingError.message);

  const existingMap = new Map(
    (existing || []).map((r) => [`${r.subject}::${r.year}::${r.question_no}`, r.id])
  );
  console.log(`existing 봄기출 memos: ${existingMap.size}`);

  if (REFRESH) {
    console.log(`refreshing ${planned.length} memos (delete+reinsert)...`);
    if (DRY) {
      console.log("[dry-run]");
      return;
    }
    // 일괄 삭제 후 재삽입이 개별 update보다 빠름
    const { error: delError } = await admin
      .from("question_public_memos")
      .delete()
      .eq("user_id", authorId);
    if (delError) throw new Error(`delete failed: ${delError.message}`);

    let ok = 0;
    let fail = 0;
    const BATCH = 50;
    for (let i = 0; i < planned.length; i += BATCH) {
      const chunk = planned.slice(i, i + BATCH).map((p) => ({
        user_id: authorId,
        subject: p.subject,
        year: p.year,
        question_no: p.question_no,
        content: p.content,
      }));
      const { error } = await admin.from("question_public_memos").insert(chunk);
      if (error) {
        console.error(`batch ${i}:`, error.message);
        for (const row of chunk) {
          const { error: oneErr } = await admin.from("question_public_memos").insert(row);
          if (oneErr) {
            fail += 1;
            console.error(`  fail ${row.subject}/${row.year}/${row.question_no}:`, oneErr.message);
          } else {
            ok += 1;
          }
        }
      } else {
        ok += chunk.length;
        console.log(`inserted ${ok}/${planned.length}`);
      }
    }
    console.log(`done ok=${ok} fail=${fail}`);
    return;
  }

  const toInsert = planned.filter(
    (p) => !existingMap.has(`${p.subject}::${p.year}::${p.question_no}`)
  );
  console.log(`to insert: ${toInsert.length}`);

  if (DRY) {
    console.log("[dry-run] --apply 로 insert / --refresh 로 전체 갱신");
    return;
  }

  let ok = 0;
  let fail = 0;
  const BATCH = 50;
  for (let i = 0; i < toInsert.length; i += BATCH) {
    const chunk = toInsert.slice(i, i + BATCH).map((p) => ({
      user_id: authorId,
      subject: p.subject,
      year: p.year,
      question_no: p.question_no,
      content: p.content,
    }));
    const { error } = await admin.from("question_public_memos").insert(chunk);
    if (error) {
      console.error(`batch ${i}:`, error.message);
      for (const row of chunk) {
        const { error: oneErr } = await admin.from("question_public_memos").insert(row);
        if (oneErr) {
          fail += 1;
          console.error(`  fail ${row.subject}/${row.year}/${row.question_no}:`, oneErr.message);
        } else {
          ok += 1;
        }
      }
    } else {
      ok += chunk.length;
      console.log(`inserted ${ok}/${toInsert.length}`);
    }
  }

  console.log(`done ok=${ok} fail=${fail}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
