/**
 * 세무사 1차 기출을 앱 → 홈페이지 형식으로 옮긴다.
 * 2차(논술·확정답안 없음)는 웹 OX 트랙에 싣지 않는다.
 * 사용: node scripts/convert-semusa-exam.mjs
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const APP = "/Users/newsang/semusabomgichul";
const HOME = process.cwd();
const OUT_DIR = path.join(HOME, "src", "data", "semusa");

/** @type {Record<string, { id: string, label: string }>} */
const SUBJECTS = {
  재정학: { id: "jaejeonghak", label: "재정학" },
  세법학개론: { id: "sebeopgaeron", label: "세법학개론" },
  회계학개론: { id: "hoegyegaeron", label: "회계학개론" },
  상법: { id: "sangbeop", label: "상법" },
  민법: { id: "minbeop", label: "민법" },
  행정소송법: { id: "haengjeongsosong", label: "행정소송법" },
};

mkdirSync(OUT_DIR, { recursive: true });

/** @type {Record<string, any[]>} */
const bySubject = Object.fromEntries(Object.values(SUBJECTS).map((s) => [s.id, []]));

const dir = path.join(APP, "src", "data", "exam");
for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  const rows = JSON.parse(readFileSync(path.join(dir, file), "utf8"));
  for (const q of rows) {
    const meta = SUBJECTS[q.subject];
    if (!meta) {
      console.warn("unknown subject", q.subject, file);
      continue;
    }
    bySubject[meta.id].push({
      id: q.id,
      year: q.year,
      sourceCode: q.source_code,
      source: `${q.year}년 ${q.source_code} ${meta.label}`,
      round: Number(String(q.source_code).replace(/[^\d]/g, "")) || q.year,
      questionNo: q.question_no,
      points: 1,
      stem: q.stem,
      questionType: q.question_type,
      correctChoice: q.correct_choice,
      category: q.category,
      subcategory: q.subcategory ?? q.chapter ?? null,
      ...(q.taxonomy_unit_id ? { taxonomyUnitId: q.taxonomy_unit_id } : {}),
      items: (q.items ?? []).map((it) => ({
        key: it.key,
        label: it.label ?? "①②③④⑤"[Number(it.key) - 1] ?? it.key,
        text: it.text,
        answer: it.answer,
        explanation: it.explanation,
        ...(it.taxonomy_unit_id ? { taxonomy_unit_id: it.taxonomy_unit_id } : {}),
      })),
    });
  }
}

const manifest = [];
for (const meta of Object.values(SUBJECTS)) {
  const exams = bySubject[meta.id].sort(
    (a, b) =>
      b.year - a.year ||
      String(b.sourceCode).localeCompare(String(a.sourceCode), "ko") ||
      a.questionNo - b.questionNo,
  );
  const years = [...new Set(exams.map((e) => e.year))].sort((a, b) => b - a);
  const sources = [...new Set(exams.map((e) => e.sourceCode))];
  const payload = {
    subject: { id: meta.id, label: meta.label, track: "세무사" },
    years,
    sources,
    concepts: [],
    exams,
  };
  writeFileSync(path.join(OUT_DIR, `${meta.id}.json`), JSON.stringify(payload) + "\n");
  manifest.push({
    id: meta.id,
    label: meta.label,
    track: "세무사",
    conceptCount: 0,
    examCount: exams.length,
    years,
    sources,
  });
  console.log(`${meta.id}: ${exams.length} exams`);
}

writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`semusa manifest → ${OUT_DIR}`);
