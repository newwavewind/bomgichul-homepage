/**
 * 공무원국어 기출을 앱 → 홈페이지 형식으로 옮긴다.
 * 사용: node scripts/convert-gugeo-exam.mjs
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import path from "node:path";

const APP = "/Users/newsang/gugeobomgichul";
const HOME = process.cwd();
const OUT_DIR = path.join(HOME, "src", "data", "gugeo");
const IMG_OUT = path.join(HOME, "public", "exam", "gugeo");

const SERIES = [
  { dir: "national", code: "국가직", label: "국가직" },
  { dir: "local", code: "지방직", label: "지방직" },
];

const exams = [];
const years = new Set();
const sources = new Set();
const copiedImages = new Set();

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(IMG_OUT, { recursive: true });

for (const series of SERIES) {
  const dir = path.join(APP, "src", "data", "subjects", series.dir, "exam");
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
    const rows = JSON.parse(readFileSync(path.join(dir, file), "utf8"));
    for (const q of rows) {
      years.add(q.year);
      sources.add(series.code);

      let material = null;
      if (q.passageImage) {
        const name = String(q.passageImage).split("/").pop();
        const from = path.join(APP, "public", "exam-images", name);
        if (existsSync(from)) {
          if (!copiedImages.has(name)) {
            copyFileSync(from, path.join(IMG_OUT, name));
            copiedImages.add(name);
          }
          material = { image: `/exam/gugeo/${name}` };
        }
      }

      exams.push({
        id: q.id,
        year: q.year,
        sourceCode: series.code,
        source: `${q.year}년 ${series.label} 9급 국어`,
        round: q.year,
        questionNo: q.question_no,
        points: 1,
        stem: q.stem,
        questionType: q.question_type,
        correctChoice: q.correct_choice,
        category: q.category,
        subcategory: q.subcategory,
        ...(material ? { material } : {}),
        ...(q.passageText ? { passageText: q.passageText } : {}),
        ...(q.series ? { series: q.series } : {}),
        ...(q.seriesLabel ? { seriesLabel: q.seriesLabel } : {}),
        items: (q.items ?? []).map((it) => ({
          key: it.key,
          label: it.label ?? "①②③④⑤"[Number(it.key) - 1] ?? it.key,
          text: it.text,
          answer: it.answer,
          explanation: it.explanation,
        })),
      });
    }
  }
}

exams.sort(
  (a, b) =>
    b.year - a.year ||
    (a.sourceCode === b.sourceCode ? 0 : a.sourceCode === "국가직" ? -1 : 1) ||
    a.questionNo - b.questionNo,
);

const payload = {
  subject: { id: "gugeo", label: "9급 공무원 국어", track: "공무원 국어" },
  years: [...years].sort((a, b) => b - a),
  sources: [...sources],
  concepts: [],
  exams,
};

writeFileSync(path.join(OUT_DIR, "gugeo.json"), JSON.stringify(payload) + "\n");
writeFileSync(
  path.join(OUT_DIR, "manifest.json"),
  JSON.stringify(
    [
      {
        id: "gugeo",
        label: "9급 공무원 국어",
        track: "공무원 국어",
        conceptCount: 0,
        examCount: exams.length,
        years: payload.years,
        sources: payload.sources,
      },
    ],
    null,
    2,
  ) + "\n",
);

console.log(`gugeo: ${exams.length} exams, ${copiedImages.size} images → ${OUT_DIR}`);
