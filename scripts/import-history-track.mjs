#!/usr/bin/env node
/**
 * 한국사능력검정 학습 데이터를 앱(historybomgichul)에서 홈페이지 형식으로 옮긴다.
 *
 * 앱은 회차별 파일(75~79.json)에 문항을 그대로 담지만, 홈페이지의 트랙은
 * 「과목 하나 = 파일 하나」에 years·sources·exams 를 함께 두는 형태다.
 * 그 사이를 여기서 맞춘다.
 *
 * 옮기면서 손보는 것:
 *   · year   — 앱은 회차 번호(75)를 year 자리에 넣지만, 홈페이지 URL 은 연도를 쓴다.
 *              heldOn 의 실제 연도(2025·2026)를 year 로, 「제75회」를 sourceCode 로 나눈다.
 *   · label  — 앱 선지에는 ①②③ 라벨이 없어 key 로 만들어 준다.
 *   · concept — 문항별 핵심 개념 카드. 다른 시험에는 없는 한국사만의 자산이라 그대로 살린다.
 *   · material — 자료 이미지 경로. 파일은 public/exam/history 로 함께 복사한다.
 *
 * 올인원(단원 개념)은 아직 집필 전이라 concepts 는 빈 배열로 둔다.
 *
 *   node scripts/import-history-track.mjs
 */
import fs from "node:fs";
import path from "node:path";

const APP = "/Users/newsang/historybomgichul";
const SRC_EXAM = path.join(APP, "src/data/subjects/history/exam");
const SRC_IMG = path.join(APP, "public/exam/history");
const OUT_DIR = path.join(process.cwd(), "src/data/history");
const OUT_IMG = path.join(process.cwd(), "public/exam/history");

const SUBJECT_ID = "simhwa";
const SUBJECT_LABEL = "한국사 심화";
const TRACK_LABEL = "한국사능력검정";

const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧"];

/** 선지 라벨 — 숫자 키는 ①②③, 그 밖(ㄱㄴㄷ)은 「ㄱ.」 꼴로 */
function labelFor(key) {
  const n = Number(key);
  if (Number.isInteger(n) && n >= 1 && n <= CIRCLED.length) return CIRCLED[n - 1];
  return `${key}.`;
}

function readRounds() {
  return fs
    .readdirSync(SRC_EXAM)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ round: Number(path.basename(f, ".json")), file: path.join(SRC_EXAM, f) }))
    .filter((r) => Number.isFinite(r.round))
    .sort((a, b) => a.round - b.round);
}

function convert() {
  const exams = [];
  const years = new Set();
  const sources = new Set();
  let noConcept = 0;
  let noMaterial = 0;

  for (const { round, file } of readRounds()) {
    const rows = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const q of rows) {
      const heldOn = q.heldOn ?? "";
      const year = Number(heldOn.slice(0, 4)) || q.year;
      const sourceCode = `제${q.round ?? round}회`;
      years.add(year);
      sources.add(sourceCode);
      if (!q.concept) noConcept += 1;
      if (!q.material) noMaterial += 1;

      exams.push({
        id: q.id,
        year,
        sourceCode,
        source: `${TRACK_LABEL} ${sourceCode} ${q.grade ?? ""}`.trim(),
        round: q.round ?? round,
        questionNo: q.question_no,
        points: q.points,
        stem: q.stem,
        questionType: q.question_type,
        correctChoice: q.correct_choice,
        category: q.category,
        subcategory: q.subcategory,
        ...(q.material ? { material: q.material } : {}),
        ...(q.concept ? { concept: q.concept } : {}),
        items: (q.items ?? []).map((it) => ({
          key: String(it.key),
          label: labelFor(it.key),
          text: it.text,
          answer: it.answer,
          explanation: it.explanation,
        })),
      });
    }
  }

  // 최신 회차가 먼저 오도록 — 다른 트랙과 같은 정렬
  const yearList = [...years].sort((a, b) => b - a);
  const sourceList = [...sources].sort(
    (a, b) => Number(a.replace(/\D/g, "")) - Number(b.replace(/\D/g, "")),
  );

  return { exams, yearList, sourceList, noConcept, noMaterial };
}

function copyImages() {
  if (!fs.existsSync(SRC_IMG)) return 0;
  let n = 0;
  for (const roundDir of fs.readdirSync(SRC_IMG)) {
    const from = path.join(SRC_IMG, roundDir);
    if (!fs.statSync(from).isDirectory()) continue;
    const to = path.join(OUT_IMG, roundDir);
    fs.mkdirSync(to, { recursive: true });
    for (const file of fs.readdirSync(from)) {
      fs.copyFileSync(path.join(from, file), path.join(to, file));
      n += 1;
    }
  }
  return n;
}

const { exams, yearList, sourceList, noConcept, noMaterial } = convert();

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  path.join(OUT_DIR, `${SUBJECT_ID}.json`),
  `${JSON.stringify(
    {
      subject: { id: SUBJECT_ID, label: SUBJECT_LABEL, track: TRACK_LABEL },
      years: yearList,
      sources: sourceList,
      concepts: [], // 올인원은 아직 집필 전
      exams,
    },
    null,
    2,
  )}\n`,
);

fs.writeFileSync(
  path.join(OUT_DIR, "manifest.json"),
  `${JSON.stringify(
    [
      {
        id: SUBJECT_ID,
        label: SUBJECT_LABEL,
        track: TRACK_LABEL,
        conceptCount: 0,
        examCount: exams.length,
        years: yearList,
        sources: sourceList,
      },
    ],
    null,
    2,
  )}\n`,
);

const copied = copyImages();

console.log(`문항 ${exams.length}개 · 연도 ${yearList.join("·")} · 회차 ${sourceList.join("·")}`);
console.log(`핵심 개념 없는 문항 ${noConcept}개 · 자료 이미지 없는 문항 ${noMaterial}개`);
console.log(`자료 이미지 ${copied}개 복사 → public/exam/history`);
