/**
 * 주택관리사 앱 → 홈페이지 `/housing` 트랙 JSON 동기화
 */
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const sourceRoot = process.env.HOUSING_APP_PATH || "/Users/newsang/housingbomgichul";
const outputRoot = path.resolve("src/data/housing");

const subjects = [
  { id: "accounting", label: "회계원리", track: "1차", conceptFile: "accounting.js" },
  { id: "facilities", label: "공동주택시설개론", track: "1차", conceptFile: "facilities.js" },
  { id: "civil-law", label: "민법", track: "1차", conceptFile: "civil-law.js" },
  { id: "housing-law", label: "주택관리관계법규", track: "2차", conceptFile: "housing-law.js" },
  { id: "housing-admin", label: "공동주택관리실무", track: "2차", conceptFile: "housing-admin.js" },
];

await mkdir(outputRoot, { recursive: true });
const manifest = [];

for (const subject of subjects) {
  const conceptUrl = `${pathToFileURL(path.join(sourceRoot, "src/data/concepts", subject.conceptFile)).href}?sync=${Date.now()}`;
  const concepts = (await import(conceptUrl)).default;

  const examDir = path.join(sourceRoot, "src/data/subjects", subject.id, "exam");
  const files = (await readdir(examDir)).filter((name) => name.endsWith(".json")).sort();
  const exams = [];
  for (const file of files) {
    const questions = JSON.parse(await readFile(path.join(examDir, file), "utf8"));
    for (const question of questions) {
      const round = Number(question.round);
      const sourceCode = Number.isFinite(round) && round > 0 ? `제${round}회` : "본시험";
      // 2차 주관식(단답형)은 stem·items 대신 prompt·passage·blanks 를 쓴다.
      // 이 필드를 옮기지 않으면 빈 껍데기 레코드가 되어 상세 페이지가 렌더되지 않는다.
      const subjective = question.kind === "subjective";
      exams.push({
        id: question.id,
        year: question.year,
        sourceCode,
        source: question.source,
        questionNo: question.question_no,
        kind: question.kind,
        prompt: subjective ? question.prompt : undefined,
        passage: subjective ? question.passage : undefined,
        blanks: subjective
          ? (question.blanks || []).map((blank) => ({
              label: blank.label,
              answer: blank.answer,
              type: blank.type,
            }))
          : undefined,
        explanation: subjective ? question.explanation : undefined,
        legalSources: subjective ? question.sources : undefined,
        stem: question.stem,
        questionType: question.question_type,
        correctChoice: question.correct_choice,
        category: question.category,
        subcategory: question.subcategory,
        explanationTopic: question.explanation_topic,
        explanationSummary: question.explanation_summary,
        items: (question.items || []).map((item) => ({
          key: item.key,
          label: item.label,
          text: item.text,
          answer: item.answer,
          explanation: item.explanation,
        })),
        comboChoices: question.combo_choices,
      });
    }
  }

  exams.sort(
    (a, b) =>
      b.year - a.year ||
      a.sourceCode.localeCompare(b.sourceCode, "ko") ||
      a.questionNo - b.questionNo,
  );

  const years = [...new Set(exams.map((q) => q.year))].sort((a, b) => b - a);
  const sources = [...new Set(exams.map((q) => q.sourceCode))].sort((a, b) => a.localeCompare(b, "ko"));
  const payload = {
    subject: { id: subject.id, label: subject.label, track: subject.track },
    years,
    sources,
    concepts,
    exams,
  };
  await writeFile(path.join(outputRoot, `${subject.id}.json`), `${JSON.stringify(payload)}\n`);
  manifest.push({
    ...payload.subject,
    conceptCount: concepts.length,
    examCount: exams.length,
    years,
    sources,
  });
  console.log(`${subject.label}: 개념 ${concepts.length}, 기출 ${exams.length}`);
}

await writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`완료: 주택관리사 ${manifest.length}과목 → ${outputRoot}`);
