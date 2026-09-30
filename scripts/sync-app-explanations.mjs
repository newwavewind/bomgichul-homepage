/**
 * 봄기출 네 앱(공무원·공인중개사·경찰·소방)의 기출 해설을 홈페이지 데이터에 다시 싣는다.
 *
 *   node scripts/sync-app-explanations.mjs          # 쓴다
 *   node scripts/sync-app-explanations.mjs --dry    # 무엇이 바뀌는지 세기만
 *
 * 2026-09-30 앱에서 기출 해설 30,090지문을 새로 쓰고(짧게, 끝 괄호 근거) 2차 대조·층 대조로
 * 다시 고쳤다. 그 과정에서 O/X·발문(쪽 표기 잔재·낫표)·정답(복수정답·전항정답)도 원문대로
 * 바로잡혔다. 옛 동기화 스크립트는 개념(기출 올인원)까지 통째로 다시 만들고, 이미 소방 트랙으로
 * 옮긴 과목을 공무원 앱에서 찾으려 해 그대로 돌릴 수 없다. 그래서 이 스크립트는
 *
 *   - 이미 실린 문항: 발문·보기 글·O/X·해설·정답·유형·요약·조합 선지만 **제자리에서** 바꾼다.
 *     표·그림·T계정·개념·단원표는 건드리지 않는다. 보기의 옛 근거(sources)는 화면이 쓰지 않고
 *     옛 해설 기준이라 걷는다.
 *   - 앱에만 있는 문항(뒤에 더해진 지방직 회차 등)과 과목(지방세법)은 기존 문항과 같은 모양으로 더한다.
 *   - 소방 트랙 행정법총론은 공무원 앱의 국가직 9급 행정법이 아니라 소방 앱의 소방공무원 공채
 *     행정법총론으로 바꿔 싣는다(firefighter/haengjeongbeop.json).
 *   - 복수정답·전항정답은 correctChoices 로 싣는다. 채점 화면이 이 목록을 본다.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const HOME = process.cwd();
const DRY = process.argv.includes("--dry");
const APPS = {
  admin: "/Users/newsang/ox-admin-quiz-app",
  broker: "/Users/newsang/ox-quiz-app",
  police: "/Users/newsang/policebomgichul",
  fire: "/Users/newsang/firebomgichul",
};

const rowsOf = (d) => (Array.isArray(d) ? d : d?.questions ?? []);
function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}
function loadApp(app, dirs) {
  const map = new Map();
  for (const dir of dirs) {
    const abs = path.join(APPS[app], dir);
    for (const f of readdirSync(abs).filter((x) => x.endsWith(".json") && x !== "index.json").sort()) {
      for (const q of rowsOf(readJson(path.join(abs, f)))) {
        if (q?.id && !map.has(q.id)) map.set(q.id, q);
      }
    }
  }
  return map;
}

const ADMIN = loadApp("admin", ["src/data/exam"]);
const BROKER = loadApp("broker", [
  "src/data/exam",
  ...["broker-law", "realestate-public-law", "realestate-tax", "registry-law", "realestate"].map((s) => `src/data/subjects/${s}/exam`),
]);
const POLICE = loadApp("police", ["broker-law", "realestate-tax", "registry-law"].map((s) => `src/data/subjects/${s}/exam`));
const FIRE = loadApp("fire", ["src/data/exam"]);

/** 공인중개사 앱 채점기(pastExamGrade.getCorrectChoiceNos)와 같은 판정 */
const ALL_ACCEPTED = /전\s*항\s*정답|전\s*원\s*정답/;
function acceptedChoices(q) {
  const numericKeys = (q.items ?? []).map((it) => Number(it.key)).filter((n) => Number.isFinite(n));
  if (ALL_ACCEPTED.test(q.explanation_summary ?? "") && numericKeys.length) return numericKeys;
  if (Array.isArray(q.correct_choices) && q.correct_choices.length > 1) return q.correct_choices.map(Number);
  return null;
}

// 근거 링크를 시험일 판으로 — 앱 CitedText 와 같게. 앱의 lawVersions.json(열쇠 「법|시험일|조」) 가운데
// 그 문항 해설에 실제로 나오는 조문만 문항에 붙인다(표 전체 460KB 를 화면에 싣지 않으려고).
// [개정]·[판례변경] 뒤는 현행 이야기라 그 뒤 근거는 고르지 않는다(화면도 현행 조문을 연다).
const DAYS = {};
const VERSIONS = {};
for (const app of Object.keys(APPS)) {
  DAYS[app] = readJson(path.join(APPS[app], "data", "exam_days.json"));
  const byDate = new Map();
  for (const [k, url] of Object.entries(readJson(path.join(APPS[app], "src", "data", "lawVersions.json")))) {
    const [law, date, jo] = k.split("|");
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date).push({ law, jo, url });
  }
  VERSIONS[app] = byDate;
}
const DAY_KEY = {
  admin: (q) => `${q.id.split("-")[0]}|${q.year}|${q.source_code}`,
  fire: (q) => `${q.id.split("-")[0]}|${q.year}|${q.source_code}`,
  broker: (q) => String(q.year),
  police: (q) => `${q.year}-${q.round}`,
};
const squash = (t) => String(t ?? "").replace(/\s+/g, "");
const beforeCurrentNote = (t) => {
  const text = String(t ?? "");
  const i = text.search(/\[(?:개정|판례변경)\]/);
  return i < 0 ? text : text.slice(0, i);
};
function attachLawVersions(web, q, app) {
  const date = DAYS[app]?.[DAY_KEY[app](q)];
  const texts = [q.explanation_summary, ...(q.items ?? []).map((it) => it.explanation), ...(q.combo_choices ?? []).map((c) => c?.explanation)]
    .map((t) => squash(beforeCurrentNote(t)))
    .join("\n");
  const found = {};
  for (const { law, jo, url } of (date && VERSIONS[app].get(date)) || []) {
    const [n, sub] = jo.split("의");
    const art = jo.startsWith("별표") ? jo : sub ? `제${n}조의${sub}` : `제${n}조`;
    if (texts.includes(squash(law)) && texts.includes(art)) found[`${law}|${jo}`] = url;
  }
  const before = JSON.stringify([web.examDate, web.lawVersions]);
  if (Object.keys(found).length) {
    web.examDate = date;
    web.lawVersions = found;
  } else {
    delete web.examDate;
    delete web.lawVersions;
  }
  if (JSON.stringify([web.examDate, web.lawVersions]) !== before) bump("시험일판링크");
}

const stats = {};
const bump = (k, n = 1) => (stats[k] = (stats[k] ?? 0) + n);

/** 이미 실린 문항을 제자리에서 고친다. correctAsString — 공인중개사 데이터는 정답 번호를 글자로 담는다. */
function patchExam(web, q, { correctAsString = false } = {}) {
  let changed = false;
  const set = (obj, key, value, stat) => {
    if (JSON.stringify(obj[key]) === JSON.stringify(value)) return;
    if (value === undefined || value === null || value === "") {
      if (!(key in obj)) return;
      delete obj[key];
    } else {
      obj[key] = value;
    }
    bump(stat);
    changed = true;
  };
  set(web, "stem", q.stem, "발문");
  set(web, "questionType", q.question_type, "유형");
  if (correctAsString) {
    // 공인중개사 데이터는 정답 번호를 글자로, 없으면 빈 글자로 둔다(generate-exam-data.mjs 와 같은 꼴)
    const cc = String(q.correct_choice ?? "");
    if (web.correctChoice !== cc) {
      web.correctChoice = cc;
      bump("정답");
      changed = true;
    }
  } else {
    set(web, "correctChoice", q.correct_choice == null ? undefined : Number(q.correct_choice), "정답");
  }
  set(web, "correctChoices", acceptedChoices(q) ?? undefined, "복수정답");
  set(web, "explanationSummary", q.explanation_summary, "요약");
  const byKey = new Map((q.items ?? []).map((it) => [String(it.key), it]));
  for (const item of web.items ?? []) {
    const a = byKey.get(String(item.key));
    if (!a) {
      bump("앱에없는보기");
      continue;
    }
    set(item, "text", a.text, "보기글");
    set(item, "answer", a.answer, "OX");
    set(item, "explanation", a.explanation, "해설");
    if ("sources" in item) {
      delete item.sources;
      changed = true;
      bump("옛근거걷음");
    }
  }
  if (Array.isArray(web.comboChoices) && web.comboChoices.length && Array.isArray(q.combo_choices)) {
    const next = correctAsString
      ? q.combo_choices.map((c) => ({
          no: c.no,
          label: c.label,
          text: c.text,
          isCorrect: Boolean(c.is_correct),
          ...(c.explanation ? { explanation: c.explanation } : {}),
          ...(c.left != null ? { left: c.left } : {}),
          ...(c.middle != null ? { middle: c.middle } : {}),
          ...(c.right != null ? { right: c.right } : {}),
        }))
      : q.combo_choices;
    set(web, "comboChoices", next, "조합선지");
  }
  if (changed) bump("고친문항");
}

/** 앱 문항 → 홈페이지 공무원·경찰·소방 트랙 문항 (기존 동기화가 만든 모양 그대로) */
function toTrackExam(q, figureDirs) {
  let material;
  if (q.figure) {
    const src = path.join(figureDirs.app, "public", q.figure);
    const dest = path.join(HOME, "public", q.figure);
    if (!existsSync(src)) throw new Error(`그림이 없다: ${src}`);
    if (!DRY && !existsSync(dest)) {
      mkdirSync(path.dirname(dest), { recursive: true });
      copyFileSync(src, dest);
      bump("그림복사");
    }
    const buf = readFileSync(src);
    const size = buf.toString("ascii", 12, 16) === "IHDR" ? { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) } : {};
    material = { image: q.figure, ...size, ...(q.figure_first ? { figureFirst: true } : {}) };
  }
  const accepted = acceptedChoices(q);
  return {
    id: q.id,
    year: q.year,
    sourceCode: q.source_code,
    ...(q.source ? { source: q.source } : {}),
    questionNo: q.question_no,
    ...(material ? { material } : {}),
    ...(q.table ? { table: q.table } : {}),
    ...(q.stem_tail ? { stemTail: q.stem_tail } : {}),
    ...(q.t_accounts ? { tAccounts: q.t_accounts } : {}),
    ...(Array.isArray(q.choice_headers) && q.choice_headers.length ? { choiceHeaders: q.choice_headers } : {}),
    stem: q.stem,
    questionType: q.question_type,
    correctChoice: q.correct_choice,
    ...(accepted ? { correctChoices: accepted } : {}),
    category: q.category,
    subcategory: q.subcategory,
    ...(q.explanation_topic ? { explanationTopic: q.explanation_topic } : {}),
    ...(q.explanation_summary ? { explanationSummary: q.explanation_summary } : {}),
    items: (q.items ?? []).map((it) => ({
      key: it.key,
      label: it.label,
      text: it.text,
      answer: it.answer,
      explanation: it.explanation,
      ...(it.classification ? { classification: it.classification } : {}),
      ...(it.taxonomy_unit_id ? { taxonomy_unit_id: it.taxonomy_unit_id } : {}),
    })),
    ...(Array.isArray(q.combo_choices) && q.combo_choices.length ? { comboChoices: q.combo_choices } : {}),
  };
}

const sortExams = (a, b) =>
  b.year - a.year || String(a.sourceCode).localeCompare(String(b.sourceCode), "ko") || a.questionNo - b.questionNo;

function writeJson(file, data, pretty) {
  if (DRY) return;
  writeFileSync(file, pretty ? `${JSON.stringify(data, null, 2)}\n` : `${JSON.stringify(data)}\n`);
}

/** 단원표 — 앱 data/taxonomy-*.json 을 홈페이지 모양으로 */
function taxonomyUnits(app, file) {
  const p = path.join(APPS[app], "data", file);
  if (!existsSync(p)) return [];
  return (readJson(p).units ?? [])
    .filter((u) => u.unit_id && u.category && u.subcategory)
    .map((u) => ({ unitId: u.unit_id, category: u.category, subcategory: u.subcategory }));
}

async function concepts(app, file) {
  const url = `${pathToFileURL(path.join(APPS[app], "src", "data", "concepts", file)).href}?sync=${Date.now()}`;
  return (await import(url)).default;
}

// ── 공무원 ────────────────────────────────────────────────────────────────
const PS_DIR = path.join(HOME, "src", "data", "public-service");
const PS_PREFIX = {
  행정학: "hangjunghak",
  행정법: "haengjeongbeop",
  관세법: "gwansebeop",
  세법개론: "sebeop",
  지방세법: "jibangsebeop",
  회계학: "hoegyehak",
  형법: "hyeongbeop",
  형사소송법: "hyeongso",
  형사소송법개론: "hyeongsogaeron",
  교정학개론: "gyojeonghak",
  교육학개론: "gyoyukhak",
  국제법개론: "gukjebeop",
  노동법개론: "nodongbeop",
  사회복지학개론: "bokji",
  회계원리: "hoegyewonri",
};
const psManifest = readJson(path.join(PS_DIR, "manifest.json"));
const psBySubject = new Map();
for (const [prefix, id] of Object.entries(PS_PREFIX)) {
  const file = path.join(PS_DIR, `${id}.json`);
  if (existsSync(file)) {
    psBySubject.set(id, { file, data: readJson(file) });
  } else if (id === "jibangsebeop") {
    psBySubject.set(id, {
      file,
      data: {
        subject: { id, label: "지방세법", track: "지방세무직" },
        years: [],
        sources: [],
        concepts: await concepts("admin", "jibangsebeop.js"),
        exams: [],
        taxonomyUnits: taxonomyUnits("admin", "taxonomy-지방세법.json"),
      },
      created: true,
    });
    bump("새과목");
  }
}
for (const q of ADMIN.values()) {
  const prefix = q.id.split("-")[0];
  const id = PS_PREFIX[prefix];
  const entry = id && psBySubject.get(id);
  if (!entry) continue; // 소방 두 과목은 소방 트랙에서
  const exams = entry.data.exams;
  const web = exams.find((e) => e.id === q.id);
  if (web) {
    patchExam(web, q);
    attachLawVersions(web, q, "admin");
  } else {
    const added = toTrackExam(q, { app: APPS.admin });
    attachLawVersions(added, q, "admin");
    exams.push(added);
    bump(`더한문항:${id}`);
  }
}
for (const [id, entry] of psBySubject) {
  const d = entry.data;
  d.exams.sort(sortExams);
  d.years = [...new Set(d.exams.map((e) => e.year))].sort((a, b) => b - a);
  d.sources = [...new Set(d.exams.map((e) => e.sourceCode))].sort((a, b) => a.localeCompare(b, "ko"));
  writeJson(entry.file, d, false);
  const m = psManifest.find((x) => x.id === id);
  const row = { ...d.subject, conceptCount: d.concepts.length, examCount: d.exams.length, years: d.years, sources: d.sources };
  if (m) Object.assign(m, row);
  else psManifest.push(row);
}
writeJson(path.join(PS_DIR, "manifest.json"), psManifest, true);

// ── 경찰 ──────────────────────────────────────────────────────────────────
for (const f of ["constitution", "criminal-law", "police-science"]) {
  const file = path.join(HOME, "src", "data", "police", `${f}.json`);
  const d = readJson(file);
  for (const web of d.exams) {
    const q = POLICE.get(web.id);
    if (q) {
      patchExam(web, q);
      attachLawVersions(web, q, "police");
    }
    else bump("경찰:앱에없음");
  }
  writeJson(file, d, false);
}

// ── 소방 ──────────────────────────────────────────────────────────────────
const FF_DIR = path.join(HOME, "src", "data", "firefighter");
for (const f of ["sobang", "sobangbeop"]) {
  const file = path.join(FF_DIR, `${f}.json`);
  const d = readJson(file);
  for (const web of d.exams) {
    const q = FIRE.get(web.id);
    if (q) {
      patchExam(web, q);
      attachLawVersions(web, q, "fire");
    }
    else bump("소방:앱에없음");
  }
  writeJson(file, d, false);
}
{
  const exams = [...FIRE.values()]
    .filter((q) => q.id.startsWith("행정법총론-"))
    .map((q) => {
      const added = toTrackExam(q, { app: APPS.fire });
      attachLawVersions(added, q, "fire");
      return added;
    });
  exams.sort(sortExams);
  const data = {
    subject: { id: "haengjeongbeop", label: "행정법총론", track: "소방" },
    years: [...new Set(exams.map((e) => e.year))].sort((a, b) => b - a),
    sources: [...new Set(exams.map((e) => e.sourceCode))],
    concepts: await concepts("fire", "haengjeongbeop.js"),
    exams,
    taxonomyUnits: taxonomyUnits("fire", "taxonomy-행정법총론.json"),
  };
  writeJson(path.join(FF_DIR, "haengjeongbeop.json"), data, false);
  bump("소방행정법총론", exams.length);
  const manifestFile = path.join(FF_DIR, "manifest.json");
  const manifest = readJson(manifestFile);
  const m = manifest.find((x) => x.id === "haengjeongbeop");
  Object.assign(m, { conceptCount: data.concepts.length, examCount: exams.length, years: data.years, sources: data.sources });
  writeJson(manifestFile, manifest, true);
}

// ── 공인중개사 ────────────────────────────────────────────────────────────
const RE_KO = {
  civillaw: "민법",
  realestate: "부동산",
  "broker-law": "공인중개사법",
  "realestate-public-law": "부동산공법",
  "realestate-tax": "부동산세법",
  "registry-law": "부동산공시법령",
};
for (const [slug, ko] of Object.entries(RE_KO)) {
  const file = path.join(HOME, "src", "data", "exam-questions", `${slug}.json`);
  const list = readJson(file);
  for (const web of list) {
    const q = BROKER.get(`${ko}-${web.year}-Q${web.questionNo}`);
    if (q) {
      patchExam(web, q, { correctAsString: true });
      attachLawVersions(web, q, "broker");
    }
    else bump("공인중개사:앱에없음");
  }
  writeJson(file, list, true);
}

console.log(DRY ? "(--dry) 쓰지 않았다" : "썼다");
console.log(Object.fromEntries(Object.entries(stats).sort()));
