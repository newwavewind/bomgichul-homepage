#!/usr/bin/env node
/**
 * ox-quiz-app(별도 저장소)의 과목별 기출 O/X 데이터를 읽어
 * 홈페이지 저장소(bomgichulhomepage)의 src/data/exam-questions/<subject>.json 으로 생성한다.
 *
 * ox-quiz-app은 배포 환경(Vercel)에 존재하지 않으므로, 이 스크립트는 로컬에서
 * 새 연도 데이터가 추가될 때만 수동 실행하고 결과 JSON을 커밋한다.
 *
 * 사용법: node scripts/generate-exam-data.mjs
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const OX_QUIZ_APP_ROOT = join(REPO_ROOT, "..", "ox-quiz-app", "src", "data");
const OUTPUT_DIR = join(REPO_ROOT, "src", "data", "exam-questions");

/** ox-quiz-app/src/subjects/registry.js 의 premium.freeTierRule 을 값만 복제 (런타임 import 없이) */
const FREE_TIER_RULES = {
  civillaw: { freeYearCount: 2 },
  realestate: { mode: "all" },
  "broker-law": { freeYearCount: 2 },
  "registry-law": { freeYearCount: 2 },
  "realestate-tax": { freeYearCount: 2 },
  "realestate-public-law": { freeYearCount: 2 },
};

const SUBJECT_EXAM_DIRS = {
  civillaw: join(OX_QUIZ_APP_ROOT, "exam"),
  realestate: join(OX_QUIZ_APP_ROOT, "subjects", "realestate", "exam"),
  "broker-law": join(OX_QUIZ_APP_ROOT, "subjects", "broker-law", "exam"),
  "registry-law": join(OX_QUIZ_APP_ROOT, "subjects", "registry-law", "exam"),
  "realestate-tax": join(OX_QUIZ_APP_ROOT, "subjects", "realestate-tax", "exam"),
  "realestate-public-law": join(OX_QUIZ_APP_ROOT, "subjects", "realestate-public-law", "exam"),
};

function readYearFiles(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf-8")))
    .flat();
}

let applyRealestateTopicClassification = null;
async function classifyRealestateQuestions(questions) {
  if (!applyRealestateTopicClassification) {
    const mod = await import(
      pathToFileURL(
        join(
          REPO_ROOT,
          "..",
          "ox-quiz-app",
          "src",
          "data",
          "subjects",
          "realestate",
          "examTopicMap.js"
        )
      ).href
    );
    applyRealestateTopicClassification = mod.applyTopicClassification;
  }

  return applyRealestateTopicClassification(questions).map((q) => ({
    ...q,
    category: q.unitLabel ?? q.category ?? "미분류",
    subcategory: q.topicLabel ?? q.subcategory ?? "미분류",
  }));
}

function computeFreeYears(years, rule) {
  if (rule.mode === "all") return new Set(years);
  const sorted = [...new Set(years)].sort((a, b) => b - a);
  return new Set(sorted.slice(0, rule.freeYearCount));
}

mkdirSync(OUTPUT_DIR, { recursive: true });

let grandTotal = 0;
let grandFree = 0;

for (const [subject, dir] of Object.entries(SUBJECT_EXAM_DIRS)) {
  let rawQuestions = readYearFiles(dir);
  if (subject === "realestate") {
    rawQuestions = await classifyRealestateQuestions(rawQuestions);
  }
  const years = rawQuestions.map((q) => q.year);
  const freeYears = computeFreeYears(years, FREE_TIER_RULES[subject]);

  const questions = rawQuestions
    .map((q) => ({
      subject,
      year: q.year,
      round: q.round,
      questionNo: q.question_no,
      stem: q.stem,
      category: q.category ?? "미분류",
      subcategory: q.subcategory ?? "미분류",
      questionType: q.question_type,
      correctChoice: String(q.correct_choice ?? ""),
      items: (q.items ?? []).map((it) => ({
        key: it.key,
        label: it.label,
        text: it.text,
        answer: it.answer,
        explanation: it.explanation,
      })),
      comboChoices: (q.combo_choices ?? []).map((c) => ({
        no: c.no,
        label: c.label,
        text: c.text,
        isCorrect: Boolean(c.is_correct),
        ...(c.explanation ? { explanation: c.explanation } : {}),
        ...(c.left != null ? { left: c.left } : {}),
        ...(c.middle != null ? { middle: c.middle } : {}),
        ...(c.right != null ? { right: c.right } : {}),
      })),
      ...(q.explanation_summary
        ? { explanationSummary: q.explanation_summary }
        : {}),
      ...(q.composite_layout ? { compositeLayout: q.composite_layout } : {}),
      ...(q.table_header?.length ? { tableHeader: q.table_header } : {}),
      free: freeYears.has(q.year),
    }))
    .sort((a, b) => a.year - b.year || a.questionNo - b.questionNo);

  writeFileSync(
    join(OUTPUT_DIR, `${subject}.json`),
    JSON.stringify(questions, null, 2) + "\n"
  );

  const freeCount = questions.filter((q) => q.free).length;
  grandTotal += questions.length;
  grandFree += freeCount;
  console.log(`${subject}: ${questions.length}문제 (무료 ${freeCount})`);
}

console.log(`총 ${grandTotal}문제, 무료 ${grandFree}문제`);
