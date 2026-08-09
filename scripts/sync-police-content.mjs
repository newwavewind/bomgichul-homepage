/**
 * 경찰공무원 앱 → 홈페이지 `/police` 트랙 JSON 동기화
 *
 * 앱 내부 슬롯 ID(registry-law 등)를 경찰 과목 ID로 다시 매핑한다.
 */
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const sourceRoot = process.env.POLICE_APP_PATH || "/Users/newsang/policebomgichul";
const outputRoot = path.resolve("src/data/police");

const subjects = [
  {
    id: "constitution",
    label: "헌법",
    track: "순경 공채",
    sourceSubjectDir: "registry-law",
    conceptFile: "registry-law.js",
  },
  {
    id: "criminal-law",
    label: "형사법",
    track: "순경 공채",
    sourceSubjectDir: "realestate-tax",
    conceptFile: "realestate-tax.js",
  },
  {
    id: "police-science",
    label: "경찰학",
    track: "순경 공채",
    sourceSubjectDir: "broker-law",
    conceptFile: "broker-law.js",
  },
];

function roundToSourceCode(round) {
  const n = Number(round);
  if (!Number.isFinite(n) || n <= 0) return "본시험";
  return `${n}차`;
}

await mkdir(outputRoot, { recursive: true });
const manifest = [];

for (const subject of subjects) {
  const conceptUrl = `${pathToFileURL(path.join(sourceRoot, "src/data/concepts", subject.conceptFile)).href}?sync=${Date.now()}`;
  const concepts = (await import(conceptUrl)).default;

  const examDir = path.join(sourceRoot, "src/data/subjects", subject.sourceSubjectDir, "exam");
  const files = (await readdir(examDir)).filter((name) => name.endsWith(".json")).sort();
  const exams = [];
  for (const file of files) {
    const questions = JSON.parse(await readFile(path.join(examDir, file), "utf8"));
    for (const question of questions) {
      const sourceCode = roundToSourceCode(question.round ?? file.replace(/\.json$/, "").split("-")[1]);
      exams.push({
        id: question.id,
        year: question.year,
        sourceCode,
        source: question.source,
        questionNo: question.question_no,
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
console.log(`완료: 경찰 ${manifest.length}과목 → ${outputRoot}`);
