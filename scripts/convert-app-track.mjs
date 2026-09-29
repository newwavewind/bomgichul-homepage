/**
 * 봄기출 자격시험 앱의 1차 기출을 홈페이지 트랙 형식으로 옮긴다.
 *
 *   node scripts/convert-app-track.mjs sanan      # 산업안전지도사
 *   node scripts/convert-app-track.mjs sonhae     # 손해평가사
 *   node scripts/convert-app-track.mjs nomusa     # 공인노무사
 *   node scripts/convert-app-track.mjs semusa     # 세무사(자료 그림을 다시 싣는다)
 *
 * 2차(논술·단답, 확정답안 없음)는 싣지 않는다 — 세무사·행정사와 같다.
 *
 * ## 자료를 앱과 같은 차례로 옮긴다
 *
 * 앞서 만든 변환기(convert-semusa-exam.mjs)는 발문·선지만 옮기고 자료를 버렸다. 그래서
 * 「옳은 것을 모두 고른 것은?」 문항의 ㄱ~ㅁ 보기와 그림이 홈페이지에서 통째로 빠져
 * 풀 수 없는 문항이 됐다(세무사 441문항). 앱의 StemWithMaterialBox 와 같은 순서로 고른다.
 *
 *   1. material_lines(글로 편 자료 상자) → 발문 뒤에 줄로 붙인다. 홈페이지 QuestionStem 이
 *      ㄱ.·○·<보기> 줄을 알아보고 상자로 그린다.
 *   2. material_content(별표 표·문단) → table(ExamStructuredMaterials 가 그린다).
 *   3. figure(시험지에서 오린 자료 그림) → material.image. 파일은 public/exam/<트랙>/ 로 복사.
 *   4. 셋 다 없고 material(평문)만 있으면 → 발문 뒤에 붙인다.
 *
 * 선지 그림(items[].image)도 같은 폴더로 옮겨 item.image 로 싣는다.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const HOME = process.cwd();

/** @type {Record<string, { app: string, track: string, subjects: Record<string, { id: string, label: string }> }>} */
const TRACKS = {
  sanan: {
    app: "/Users/newsang/sananbomgichul",
    track: "산업안전지도사",
    subjects: {
      산업안전보건법령: { id: "sanbeop", label: "산업안전보건법령" },
      산업안전일반: { id: "sanil", label: "산업안전일반" },
      "기업진단·지도": { id: "gieop", label: "기업진단·지도" },
    },
  },
  sonhae: {
    app: "/Users/newsang/sonhaebomgichul",
    track: "손해평가사",
    subjects: {
      상법: { id: "sangbeop", label: "「상법」 보험편" },
      농어업재해보험법령: { id: "nongeoeop", label: "농어업재해보험법령" },
      농학개론: { id: "nonghak", label: "농학개론" },
    },
  },
  nomusa: {
    app: "/Users/newsang/nomusabomgichul",
    track: "공인노무사",
    subjects: {
      "노동법(1)": { id: "nodong1", label: "노동법(1)" },
      "노동법(2)": { id: "nodong2", label: "노동법(2)" },
      민법: { id: "minbeop", label: "민법" },
      사회보험법: { id: "sahoeboheom", label: "사회보험법" },
      경영학개론: { id: "gyeongyeong", label: "경영학개론" },
      경제학원론: { id: "gyeongje", label: "경제학원론" },
    },
  },
  semusa: {
    app: "/Users/newsang/semusabomgichul",
    track: "세무사",
    subjects: {
      재정학: { id: "jaejeonghak", label: "재정학" },
      세법학개론: { id: "sebeopgaeron", label: "세법학개론" },
      회계학개론: { id: "hoegyegaeron", label: "회계학개론" },
      상법: { id: "sangbeop", label: "상법" },
      민법: { id: "minbeop", label: "민법" },
      행정소송법: { id: "haengjeongsosong", label: "행정소송법" },
    },
  },
};

const key = process.argv[2];
const cfg = TRACKS[key];
if (!cfg) {
  console.error(`사용: node scripts/convert-app-track.mjs <${Object.keys(TRACKS).join("|")}>`);
  process.exit(1);
}

const OUT_DIR = path.join(HOME, "src", "data", key);
const FIG_DIR = path.join(HOME, "public", "exam", key);
const FIG_URL = `/exam/${key}`;
mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(FIG_DIR, { recursive: true });

/** PNG 머리(IHDR)에서 너비·높이를 읽는다 — 화면이 자리를 먼저 잡아 두게 */
function pngSize(file) {
  const buf = readFileSync(file);
  if (buf.length < 24 || buf.toString("ascii", 12, 16) !== "IHDR") return {};
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

let copied = 0;
/** 앱의 /exam-figures/… 경로 → 홈페이지 주소. 파일은 복사해 둔다. */
function figure(appPath) {
  const src = path.join(cfg.app, "public", appPath);
  if (!existsSync(src)) throw new Error(`그림이 없다: ${src}`);
  const name = path.basename(appPath);
  const dest = path.join(FIG_DIR, name);
  if (!existsSync(dest) || readFileSync(dest).length !== readFileSync(src).length) {
    copyFileSync(src, dest);
    copied += 1;
  }
  return { url: `${FIG_URL}/${encodeURIComponent(name)}`, ...pngSize(src) };
}

/** material_content(문단·표 블록) → 홈페이지 표. 표 앞 문단은 lead, 뒤 문단은 notes 로. */
function toTables(blocks) {
  const tables = [];
  let lead = [];
  for (const b of blocks) {
    if (b.t === "table" && Array.isArray(b.rows) && b.rows.length) {
      const [head, ...rest] = b.rows;
      tables.push({
        ...(lead.length ? { lead: lead.join("\n") } : {}),
        ...(rest.length ? { headers: head.map(String), rows: rest } : { rows: b.rows }),
      });
      lead = [];
    } else if (b.text) {
      lead.push(String(b.text));
    }
  }
  if (lead.length) {
    if (tables.length) tables[tables.length - 1].notes = lead;
    else tables.push({ lead: lead.join("\n"), rows: [] });
  }
  return tables;
}

const counts = { lines: 0, table: 0, figure: 0, text: 0, itemImage: 0 };
const bySubject = Object.fromEntries(Object.values(cfg.subjects).map((s) => [s.id, []]));
const dir = path.join(cfg.app, "src", "data", "exam");
for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  const rows = JSON.parse(readFileSync(path.join(dir, file), "utf8"));
  for (const q of Array.isArray(rows) ? rows : rows.questions ?? []) {
    const meta = cfg.subjects[q.subject];
    if (!meta) {
      console.warn("모르는 과목", q.subject, file);
      continue;
    }
    let stem = q.stem ?? "";
    let table;
    let material;
    if (Array.isArray(q.material_lines) && q.material_lines.length) {
      stem = `${stem}\n${q.material_lines.join("\n")}`;
      counts.lines += 1;
    } else if (Array.isArray(q.material_content) && q.material_content.length) {
      table = toTables(q.material_content);
      counts.table += 1;
    } else if (q.figure) {
      const f = figure(q.figure);
      material = { image: f.url, ...(f.width ? { width: f.width, height: f.height } : {}) };
      counts.figure += 1;
    } else if (typeof q.material === "string" && q.material.trim()) {
      stem = `${stem}\n${q.material.trim()}`;
      counts.text += 1;
    }
    bySubject[meta.id].push({
      id: q.id,
      year: q.year,
      sourceCode: q.source_code,
      source: `${q.year}년 ${q.source_code} ${meta.label}`,
      round: Number(String(q.source_code).replace(/[^\d]/g, "")) || q.year,
      questionNo: q.question_no,
      points: 1,
      stem,
      ...(table ? { table } : {}),
      ...(material ? { material } : {}),
      ...(q.stem_tail ? { stemTail: q.stem_tail } : {}),
      ...(Array.isArray(q.choice_headers) && q.choice_headers.length ? { choiceHeaders: q.choice_headers } : {}),
      questionType: q.question_type,
      correctChoice: q.correct_choice,
      category: q.category,
      subcategory: q.subcategory ?? q.chapter ?? null,
      ...(q.taxonomy_unit_id ? { taxonomyUnitId: q.taxonomy_unit_id } : {}),
      items: (q.items ?? []).map((it) => {
        let image;
        if (it.image) {
          image = figure(it.image).url;
          counts.itemImage += 1;
        }
        return {
          key: it.key,
          label: it.label ?? "①②③④⑤"[Number(it.key) - 1] ?? it.key,
          text: it.text,
          ...(image ? { image } : {}),
          answer: it.answer,
          explanation: it.explanation,
          ...(it.taxonomy_unit_id ? { taxonomy_unit_id: it.taxonomy_unit_id } : {}),
        };
      }),
    });
  }
}

const manifest = [];
for (const meta of Object.values(cfg.subjects)) {
  const exams = bySubject[meta.id].sort(
    (a, b) =>
      b.year - a.year ||
      String(b.sourceCode).localeCompare(String(a.sourceCode), "ko") ||
      a.questionNo - b.questionNo,
  );
  const years = [...new Set(exams.map((e) => e.year))].sort((a, b) => b - a);
  const sources = [...new Set(exams.map((e) => e.sourceCode))];
  writeFileSync(
    path.join(OUT_DIR, `${meta.id}.json`),
    JSON.stringify({ subject: { id: meta.id, label: meta.label, track: cfg.track }, years, sources, concepts: [], exams }) + "\n",
  );
  manifest.push({ id: meta.id, label: meta.label, track: cfg.track, conceptCount: 0, examCount: exams.length, years, sources });
  console.log(`${meta.id}: ${exams.length}문항`);
}
writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`자료: 글 상자 ${counts.lines} · 표 ${counts.table} · 그림 ${counts.figure} · 평문 ${counts.text} · 선지 그림 ${counts.itemImage} · 새로 복사한 그림 ${copied}`);
