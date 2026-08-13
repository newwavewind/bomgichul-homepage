import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const sourceRoot = "/Users/newsang/socialworkerbomgichul/src/data";
const targetRoot = path.resolve("src/data/social-worker");
const subjects = [
  ["human-behavior", "인간행동과 사회환경"],
  ["research", "사회복지조사론"],
  ["practice", "사회복지실천론"],
  ["practice-skills", "사회복지실천기술론"],
  ["community", "지역사회복지론"],
  ["policy", "사회복지정책론"],
  ["administration", "사회복지행정론"],
  ["law", "사회복지법제론"],
];

fs.mkdirSync(targetRoot, { recursive: true });
const manifest = [];

for (const [id, label] of subjects) {
  const examDir = path.join(sourceRoot, "subjects", id, "exam");
  const files = fs.readdirSync(examDir).filter((file) => file.endsWith(".json")).sort();
  const rawExams = files.flatMap((file) => JSON.parse(fs.readFileSync(path.join(examDir, file), "utf8")));
  const conceptModule = await import(`${pathToFileURL(path.join(sourceRoot, "concepts", `${id}.js`)).href}?v=${Date.now()}`);
  const concepts = conceptModule.default.map((concept) => ({
    slug: concept.slug,
    chapterKo: concept.chapterKo,
    sectionKo: concept.sectionKo,
    category: concept.category,
    subcategory: concept.subcategory,
    titleKo: concept.titleKo,
    titleEn: concept.titleEn,
    definition: concept.definition,
    intuition: concept.intuition,
    keyPoints: concept.keyPoints,
    pitfalls: Array.isArray(concept.pitfalls) ? concept.pitfalls.join("\n") : concept.pitfalls,
    example: concept.example,
  }));
  const exams = rawExams.map((exam) => ({
    id: exam.id,
    year: exam.year,
    sourceCode: `제${exam.round}회`,
    source: exam.source,
    questionNo: exam.question_no,
    stem: exam.stem,
    questionType: exam.question_type,
    correctChoice: exam.correct_choice,
    category: exam.category,
    subcategory: exam.subcategory,
    explanationSummary: exam.explanation_summary,
    items: exam.items.map((item) => ({
      key: String(item.key),
      label: item.label,
      text: item.text,
      answer: item.answer,
      explanation: item.explanation,
      taxonomy_unit_id: item.taxonomy_unit_id,
    })),
  }));
  const years = [...new Set(exams.map((exam) => exam.year))].sort((a, b) => b - a);
  const sources = [...new Set(exams.map((exam) => exam.sourceCode))];
  const content = {
    subject: { id, label, track: "사회복지사 1급" },
    years,
    sources,
    concepts,
    exams,
  };
  fs.writeFileSync(path.join(targetRoot, `${id}.json`), `${JSON.stringify(content)}\n`);
  manifest.push({ id, label, track: "사회복지사 1급", conceptCount: concepts.length, examCount: exams.length, years, sources });
}

fs.writeFileSync(path.join(targetRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Imported ${manifest.length} subjects and ${manifest.reduce((sum, item) => sum + item.examCount, 0)} questions.`);
