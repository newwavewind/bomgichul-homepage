import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const sourceRoot = process.env.PUBLIC_SERVICE_APP_PATH || "/Users/newsang/ox-admin-quiz-app";
const outputRoot = path.resolve("src/data/public-service");
const examRoot = path.join(sourceRoot, "src/data/exam");
const conceptRoot = path.join(sourceRoot, "src/data/concepts");
const taxonomyRoot = path.join(sourceRoot, "data");

/**
 * 지문의 taxonomy_unit_id 가 어느 단원인지는 앱의 taxonomy 레지스트리에만 있다.
 * 이 표가 없으면 홈페이지에서 unit_id 는 뜻 없는 문자열이라 개념과 이어지지 않는다.
 * (앱 `src/data/taxonomyRegistry.js` 의 과목 → 파일 대응을 그대로 따른다)
 */
const taxonomyFileBySubject = {
  hangjunghak: "taxonomy.json",
  haengjeongbeop: "taxonomy-행정법.json",
  gwansebeop: "taxonomy-관세법.json",
  hyeongbeop: "taxonomy-형법.json",
  hyeongso: "taxonomy-형사소송법.json",
  hyeongsogaeron: "taxonomy-형사소송법.json",
  gyojeonghak: "taxonomy-교정학개론.json",
  gyoyukhak: "taxonomy-교육학개론.json",
  gukjebeop: "taxonomy-국제법개론.json",
  sebeop: "taxonomy-세법개론.json",
  nodongbeop: "taxonomy-노동법개론.json",
  bokji: "taxonomy-사회복지학개론.json",
  sobang: "taxonomy-소방학개론.json",
  sobangbeop: "taxonomy-소방관계법규.json",
  hoegyehak: "taxonomy-회계학.json",
  hoegyewonri: "taxonomy-회계원리.json",
};

async function readTaxonomyUnits(subjectId) {
  const file = taxonomyFileBySubject[subjectId];
  if (!file) return [];
  let raw;
  try {
    raw = await readFile(path.join(taxonomyRoot, file), "utf8");
  } catch {
    return [];
  }
  return (JSON.parse(raw).units ?? [])
    .filter((unit) => unit.unit_id && unit.category && unit.subcategory)
    .map((unit) => ({
      unitId: unit.unit_id,
      category: unit.category,
      subcategory: unit.subcategory,
    }));
}

const subjects = [
  { id: "hangjunghak", label: "행정학개론", sourceSubject: null, conceptFile: "hangjunghak.js", track: "일반행정" },
  { id: "haengjeongbeop", label: "행정법총론", sourceSubject: "행정법", conceptFile: "haengjeongbeop.js", track: "일반행정" },
  { id: "gwansebeop", label: "관세법개론", sourceSubject: "관세법", conceptFile: "gwansebeop.js", track: "관세직" },
  { id: "sebeop", label: "세법개론", sourceSubject: "세법", conceptFile: "sebeop.js", track: "세무직" },
  { id: "hoegyehak", label: "회계학", sourceSubject: "회계학", conceptFile: "hoegyehak.js", track: "세무·관세직" },
  { id: "hyeongbeop", label: "형법", sourceSubject: "형법", conceptFile: "hyeongbeop.js", track: "검찰·교정직" },
  { id: "hyeongso", label: "형사소송법", sourceSubject: "형사소송법", conceptFile: "hyeongso.js", track: "검찰직" },
  { id: "hyeongsogaeron", label: "형사소송법개론", sourceSubject: "형사소송법개론", conceptFile: "hyeongsogaeron.js", track: "교정직" },
  { id: "gyojeonghak", label: "교정학개론", sourceSubject: "교정학", conceptFile: "gyojeonghak.js", track: "교정직" },
  { id: "gyoyukhak", label: "교육학개론", sourceSubject: "교육학", conceptFile: "gyoyukhak.js", track: "교육행정" },
  { id: "gukjebeop", label: "국제법개론", sourceSubject: "국제법", conceptFile: "gukjebeop.js", track: "출입국관리" },
  { id: "nodongbeop", label: "노동법개론", sourceSubject: "노동법", conceptFile: "nodongbeop.js", track: "고용노동" },
  { id: "bokji", label: "사회복지학개론", sourceSubject: "사회복지", conceptFile: "bokji.js", track: "사회복지" },
  { id: "sobang", label: "소방학개론", sourceSubject: "소방학", conceptFile: "sobang.js", track: "소방" },
  { id: "sobangbeop", label: "소방관계법규", sourceSubject: "소방관계법규", conceptFile: "sobangbeop.js", track: "소방" },
  { id: "hoegyewonri", label: "회계원리", sourceSubject: "회계원리", conceptFile: "hoegyewonri.js", track: "회계 계열" },
];

const examFiles = (await readdir(examRoot)).filter((name) => name.endsWith(".json") && name !== "index.json");
const allExams = [];
for (const file of examFiles) {
  const questions = JSON.parse(await readFile(path.join(examRoot, file), "utf8"));
  allExams.push(...questions);
}

await mkdir(outputRoot, { recursive: true });
const manifest = [];

for (const subject of subjects) {
  const moduleUrl = `${pathToFileURL(path.join(conceptRoot, subject.conceptFile)).href}?sync=${Date.now()}`;
  const concepts = (await import(moduleUrl)).default;
  const exams = allExams
    .filter((question) => subject.sourceSubject ? question.subject === subject.sourceSubject : !question.subject)
    .sort((a, b) => b.year - a.year || a.source_code.localeCompare(b.source_code, "ko") || a.question_no - b.question_no)
    .map((question) => ({
      id: question.id,
      year: question.year,
      sourceCode: question.source_code,
      source: question.source,
      questionNo: question.question_no,
      stem: question.stem,
      questionType: question.question_type,
      correctChoice: question.correct_choice,
      category: question.category,
      subcategory: question.subcategory,
      explanationTopic: question.explanation_topic,
      explanationSummary: question.explanation_summary,
      items: question.items,
      comboChoices: question.combo_choices,
    }));

  const years = [...new Set(exams.map((question) => question.year))].sort((a, b) => b - a);
  const sources = [...new Set(exams.map((question) => question.sourceCode))].sort((a, b) => a.localeCompare(b, "ko"));
  const taxonomyUnits = await readTaxonomyUnits(subject.id);
  const payload = { subject: { ...subject, conceptFile: undefined, sourceSubject: undefined }, years, sources, concepts, exams, taxonomyUnits };
  await writeFile(path.join(outputRoot, `${subject.id}.json`), `${JSON.stringify(payload)}\n`);
  manifest.push({ ...payload.subject, conceptCount: concepts.length, examCount: exams.length, years, sources });
  console.log(`${subject.label}: 개념 ${concepts.length}, 기출 ${exams.length}, taxonomy 단원 ${taxonomyUnits.length}`);
}

await writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`완료: ${manifest.length}과목`);
