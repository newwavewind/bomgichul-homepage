import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const webRoot = process.argv[2] ?? "/Users/newsang/bomgichulhomepage";

async function conceptGetter(appRoot) {
  return import(pathToFileURL(path.join(appRoot, "src/data/concepts/index.js")));
}

function writeJsonConcepts(relativeFile, appConcepts) {
  const file = path.join(webRoot, relativeFile);
  const content = JSON.parse(fs.readFileSync(file, "utf8"));
  content.concepts = appConcepts;
  fs.writeFileSync(file, `${JSON.stringify(content)}\n`);
  return appConcepts.length;
}

function readTsConcepts(file) {
  const source = fs
    .readFileSync(file, "utf8")
    .replace(/^import[^\n]*\n/, "")
    .replace(/const concepts: Concept\[\] =/, "const concepts =")
    .replace(/export default concepts;?/, "");
  return Function(`${source}; return concepts;`)();
}

function writeTsConcepts(subjectId, appConcepts) {
  const file = path.join(webRoot, "src/data/concepts", `${subjectId}.ts`);
  const webConcepts = readTsConcepts(file);
  const webBySlug = new Map(webConcepts.map((concept) => [concept.slug, concept]));
  // 앱이 학습 콘텐츠의 기준 원본이다. 웹에만 있는 parentSlug·개정 배지 같은
  // 연결 메타데이터는 보존하고, 앱에 존재하는 필드는 앱 값으로 갱신한다.
  const merged = appConcepts.map((concept) => ({
    ...(webBySlug.get(concept.slug) ?? {}),
    ...concept,
  }));
  const source = `import type { Concept } from "@/lib/concepts";\n\nconst concepts: Concept[] = ${JSON.stringify(merged, null, 2)};\n\nexport default concepts;\n`;
  fs.writeFileSync(file, source);
  return merged.length;
}

const suites = [
  {
    label: "public-service",
    appRoot: "/Users/newsang/ox-admin-quiz-app",
    webDir: "public-service",
    subjects: [
      "hangjunghak", "haengjeongbeop", "gwansebeop", "hyeongbeop",
      "hyeongso", "hyeongsogaeron", "gyojeonghak", "gyoyukhak",
      "gukjebeop", "sebeop", "nodongbeop", "bokji", "sobang",
      "sobangbeop", "hoegyehak", "hoegyewonri",
    ],
  },
  {
    label: "housing",
    appRoot: "/Users/newsang/housingbomgichul",
    webDir: "housing",
    subjects: ["accounting", "facilities", "civil-law", "housing-law", "housing-admin"],
  },
  {
    label: "social-worker",
    appRoot: "/Users/newsang/socialworkerbomgichul",
    webDir: "social-worker",
    subjects: [
      "human-behavior", "research", "practice", "practice-skills",
      "community", "policy", "administration", "law",
    ],
  },
];

for (const suite of suites) {
  const conceptModule = await conceptGetter(suite.appRoot);
  const counts = new Map();
  for (const subjectId of suite.subjects) {
    const concepts = conceptModule.getConceptsForSubject(subjectId);
    const count = writeJsonConcepts(
      path.join("src/data", suite.webDir, `${subjectId}.json`),
      concepts,
    );
    counts.set(subjectId, count);
    console.log(`${suite.label}/${subjectId}: ${count}`);
  }
  const manifestFile = path.join(webRoot, "src/data", suite.webDir, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  for (const subject of manifest) {
    if (counts.has(subject.id)) subject.conceptCount = counts.get(subject.id);
  }
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
}

const police = await conceptGetter("/Users/newsang/policebomgichul");
const policeCounts = new Map();
for (const [appSubjectId, webSubjectId] of [
  ["broker-law", "police-science"],
  ["registry-law", "constitution"],
  ["realestate-tax", "criminal-law"],
]) {
  const count = writeJsonConcepts(
    path.join("src/data/police", `${webSubjectId}.json`),
    police.getConceptsForSubject(appSubjectId),
  );
  policeCounts.set(webSubjectId, count);
  console.log(`police/${webSubjectId}: ${count}`);
}
const policeManifestFile = path.join(webRoot, "src/data/police/manifest.json");
const policeManifest = JSON.parse(fs.readFileSync(policeManifestFile, "utf8"));
for (const subject of policeManifest) {
  if (policeCounts.has(subject.id)) subject.conceptCount = policeCounts.get(subject.id);
}
fs.writeFileSync(policeManifestFile, `${JSON.stringify(policeManifest, null, 2)}\n`);

const realEstate = await conceptGetter("/Users/newsang/ox-quiz-app");
for (const subjectId of [
  "civillaw", "realestate", "broker-law", "registry-law",
  "realestate-tax", "realestate-public-law",
]) {
  const count = writeTsConcepts(subjectId, realEstate.getConceptsForSubject(subjectId));
  console.log(`real-estate/${subjectId}: ${count}`);
}

// 영어 앱의 올인원은 일반 개념 카드가 아니라 1,050개의 기출 구문 카드다.
// 앱이 번호를 국가직·지방직 통합 순서로 다시 매기므로 모듈을 통해 완성된 값을 받는다.
const englishSyntaxRoot = "/Users/newsang/englishbomgichul/src/data/syntax";
const nationalSyntax = JSON.parse(fs.readFileSync(path.join(englishSyntaxRoot, "national.json"), "utf8"));
const localSyntax = JSON.parse(fs.readFileSync(path.join(englishSyntaxRoot, "local.json"), "utf8"));
const syntaxCards = [
  ...nationalSyntax.map((card) => ({ ...card, series: "national", seriesLabel: "국가직" })),
  ...localSyntax.map((card) => ({ ...card, series: "local", seriesLabel: "지방직" })),
]
  .sort((a, b) => a.year - b.year
    || (a.series === b.series ? 0 : a.series === "national" ? -1 : 1)
    || a.questionNo - b.questionNo
    || a.id.localeCompare(b.id))
  .map((card, index) => ({ ...card, no: index + 1 }));
fs.writeFileSync(
  path.join(webRoot, "src/data/english/syntax.json"),
  `${JSON.stringify(syntaxCards)}\n`,
);
fs.copyFileSync(
  path.join(englishSyntaxRoot, "taxonomy.json"),
  path.join(webRoot, "src/data/english/syntax-taxonomy.json"),
);
fs.copyFileSync(
  path.join(englishSyntaxRoot, "focusNotes.js"),
  path.join(webRoot, "src/data/english/syntax-notes.js"),
);
const englishManifestFile = path.join(webRoot, "src/data/english/manifest.json");
const englishManifest = JSON.parse(fs.readFileSync(englishManifestFile, "utf8"));
if (englishManifest[0]) englishManifest[0].conceptCount = syntaxCards.length;
fs.writeFileSync(englishManifestFile, `${JSON.stringify(englishManifest, null, 2)}\n`);
console.log(`english/syntax: ${syntaxCards.length}`);
