#!/usr/bin/env node
/**
 * 부동산학개론 표형 복합문항 6개에 compositeLayout / tableHeader / left·right·middle 메타 반영
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HP_PATH = join(__dirname, "../src/data/exam-questions/realestate.json");
const OX_DIR = join(__dirname, "../../ox-quiz-app/src/data/subjects/realestate/exam");

const FALLBACK_HEADERS = {
  "2016-34": ["마케팅 활동", "4P 전략"],
  "2018-7": ["A", "B", "A와 B의 관계"],
  "2018-25": ["(가)", "(나)"],
  "2019-1": ["경제적 개념", "물리적(기술적) 개념"],
  "2023-20": ["ㄱ", "ㄴ"],
  "2025-7": ["유량변수", "저량변수"],
};

const oxByKey = new Map();
for (const file of readdirSync(OX_DIR).filter((f) => f.endsWith(".json"))) {
  for (const q of JSON.parse(readFileSync(join(OX_DIR, file), "utf8"))) {
    if (q.composite_layout === "table") {
      oxByKey.set(`${q.year}-${q.question_no}`, q);
    }
  }
}

const questions = JSON.parse(readFileSync(HP_PATH, "utf8"));
let patched = 0;

for (const q of questions) {
  const key = `${q.year}-${q.questionNo}`;
  const ox = oxByKey.get(key);
  if (!ox) continue;

  q.compositeLayout = "table";
  q.tableHeader = ox.table_header?.length
    ? ox.table_header
    : FALLBACK_HEADERS[key];
  q.comboChoices = (ox.combo_choices ?? []).map((c) => ({
    no: c.no,
    label: c.label,
    text: c.text,
    isCorrect: Boolean(c.is_correct),
    ...(c.left != null && c.left !== "" ? { left: c.left } : {}),
    ...(c.middle != null && c.middle !== "" ? { middle: c.middle } : {}),
    ...(c.right != null && c.right !== "" ? { right: c.right } : {}),
  }));
  patched++;
}

writeFileSync(HP_PATH, `${JSON.stringify(questions, null, 2)}\n`);
console.log(`patched ${patched} table composite questions in realestate.json`);
