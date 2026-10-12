/**
 * 봄기출 자격시험 앱의 1차 기출을 홈페이지 트랙 형식으로 옮긴다.
 *
 *   node scripts/convert-app-track.mjs sanan      # 산업안전지도사
 *   node scripts/convert-app-track.mjs sonhae     # 손해평가사
 *   node scripts/convert-app-track.mjs nomusa     # 공인노무사
 *   node scripts/convert-app-track.mjs semusa     # 세무사(자료 그림을 다시 싣는다)
 *   node scripts/convert-app-track.mjs gyeongbi   # 경비지도사(1·2차 여덟 과목)
 *   node scripts/convert-app-track.mjs gamjeong   # 감정평가사(1차 다섯 과목, 5지선다)
 *
 * ## 감정평가사부터 더 옮기는 것(`rich: true`)
 *
 * 감정평가사 앱은 자료를 앞 앱들보다 촘촘히 담는다. 그대로 옮겨야 앱과 같은 문항이 된다.
 *   - 표 머리줄 수(`head`, 0 이면 머리 없음)·병합 칸(`merges`) → 앱 `병합표` 와 같은 규칙으로
 *     headerRows·colSpan·rowSpan 을 미리 계산해 싣는다(빈칸을 병합 칸으로 되살리는 규칙 포함).
 *   - 자료 문단이 표 뒤에 오는 문항(○·ㄱ. 줄) → 「※ 주」가 아니라 그 차례 그대로 표 앞 글·표 없는 글로.
 *   - 밑줄(`stem_marked`·자료 줄·표 칸의 `__…__`) → 발문 글자 위치(`underlines`)·칸 `underlines`.
 *   - 과목 머리 안내문(앱 `src/data/subjectNotices.js`, 회계학 「과목 공통 전제」) → 문항 `notice`.
 *   - 근거 링크 시험일 판: 앱 `data/exam_days.json` + `src/data/lawVersions.json`(열쇠 「법|연도|조」)
 *     가운데 그 문항 해설에 나오는 조문만 `examDate`·`lawVersions` 로(sync-app-explanations.mjs 와 같은 규칙).
 *   - 자료 그림(`figure`)은 글 상자·표가 있어도 함께 싣는다 — 이 앱의 그림은 남겨 둔 그래프·도해뿐이다
 *     (`data/figure_keep.txt`). 그림 설명(`figure_alt`)은 대체 글로.
 *   - 경제학 기호의 별표(P*·Q*·r*)는 「∗」로 — 홈페이지 본문 정리(plainStudyText)가 「*」를 지운다.
 *
 * 2차(논술·단답, 확정답안 없음)는 싣지 않는다 — 세무사·행정사와 같다.
 * 경비지도사만 다르다: 2차도 1차와 같은 4지선다 객관식이고 확정답안이 있어 1·2차를 함께 싣는다.
 * 과목마다 `group`(1차·2차)을 주면 허브가 그 이름으로 과목을 묶는다(주택관리사와 같은 꼴).
 *
 * 앱의 문항 `subject` 는 시험지 머리글을 그대로 담기도 한다(「경비업법(청원경찰법 포함)」·
 * 「기계경비기획 및 설계」). 그래서 과목 열쇠·표시 이름·`aliases` 를 모두 받고, 그래도 못 찾으면
 * 파일 이름 앞머리(`경비업법-2025-제27회.json` 의 「경비업법」)로 찾는다.
 * 복수정답·전항정답(`correct_choice: [2, 4]`)은 correctChoices 로 싣는다(채점 화면이 이 목록을 본다).
 *
 * 앱의 기출이 아직 다 들어오지 않았어도 돌릴 수 있다 — 빈 과목은 빈 목록으로 나가고,
 * 데이터가 다 들어온 뒤 같은 명령을 다시 돌리면 된다.
 * `--empty` 를 붙이면 앱을 읽지 않고 과목 뼈대(문항 0)만 쓴다 — 기출·해설이 아직 작업 중일 때
 * 트랙·커뮤니티·오류 신고 화면부터 세우는 데 쓴다(경비지도사 2026-10-05).
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
import { pathToFileURL } from "node:url";

const HOME = process.cwd();

/** @type {Record<string, { app: string, track: string, subjects: Record<string, { id: string, label: string, group?: string, aliases?: string[] }> }>} */
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
  gyeongbi: {
    app: "/Users/newsang/gyeongbibomgichul",
    track: "경비지도사",
    // 열쇠 = 앱 기출 파일 이름 앞머리(src/subjects/subjectSources.js 의 EXAM_PREFIX_BY_SUBJECT).
    // 별칭은 앱 registry.js 의 LEGACY_DATA_LABELS 와 같다(회차마다 시험지 머리글 적는 법이 다르다).
    subjects: {
      법학개론: { id: "beophak", label: "법학개론", group: "1차", aliases: ["법학 개론"] },
      민간경비론: { id: "mingan", label: "민간경비론", group: "1차", aliases: ["민간 경비론", "민간경비"] },
      경비업법: {
        id: "gyeongbibeop",
        label: "경비업법",
        group: "2차",
        aliases: [
          "경비업법(청원경찰법 포함)",
          "경비업법(청원경찰법포함)",
          "경비업법 (청원경찰법 포함)",
          "경비업법(청원경찰법을 포함한다)",
          "경비업법 및 청원경찰법",
        ],
      },
      소방학: { id: "sobang", label: "소방학", group: "2차", aliases: ["소방학개론"] },
      범죄학: { id: "beomjoe", label: "범죄학", group: "2차", aliases: ["범죄학개론"] },
      경호학: { id: "gyeongho", label: "경호학", group: "2차", aliases: ["경호학개론"] },
      기계경비개론: { id: "gigye", label: "기계경비개론", group: "2차", aliases: ["기계경비 개론"] },
      기계경비기획및설계: {
        id: "gigyeseolgye",
        label: "기계경비기획 및 설계",
        group: "2차",
        aliases: [
          "기계경비기획 및 설계",
          "기계경비 기획 및 설계",
          "기계경비기획 및설계",
          "기계경비기획·설계",
          "기계경비기획ㆍ설계",
          "기계경비기획 및 설계론",
        ],
      },
    },
  },
  gamjeong: {
    app: "/Users/newsang/gamjeongbomgichul",
    track: "감정평가사",
    rich: true,
    // 열쇠 = 앱 기출 파일 이름 앞머리(src/subjects/subjectSources.js 의 EXAM_PREFIX_BY_SUBJECT).
    // 2차(감정평가실무·이론·보상법규 서술형)는 확정답안이 없어 싣지 않는다 — 앱 exam2/ 는 읽지 않는다.
    subjects: {
      민법: { id: "minbeop", label: "민법" },
      경제학원론: { id: "gyeongje", label: "경제학원론" },
      부동산학원론: { id: "budongsan", label: "부동산학원론" },
      감정평가관계법규: { id: "beopgyu", label: "감정평가관계법규" },
      회계학: { id: "hoegye", label: "회계학" },
    },
  },
};

const key = process.argv[2];
const EMPTY = process.argv.includes("--empty");
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

/* ───────────── 감정평가사부터(`rich`) — 앱 화면과 같은 자료를 옮긴다 ───────────── */

/** 경제학 기호의 별표(P*·Q*) — 홈페이지 plainStudyText 가 「*」를 지우므로 같은 폭의 「∗」(U+2217)로 */
const star = (t) => (typeof t === "string" ? t.replace(/\*/g, "∗") : t);

/** `__밑줄 친 말__` 표시를 벗기고, 벗긴 글 기준 밑줄 자리 [시작, 끝) 를 돌려준다 */
function unmark(raw) {
  const s = String(raw ?? "");
  if (!s.includes("__")) return { text: s, ranges: [] };
  const parts = s.split("__");
  if (parts.length % 2 === 0) {
    console.warn("짝 없는 밑줄 표시 — 표시만 벗긴다:", s.slice(0, 60));
    return { text: s.replace(/__/g, ""), ranges: [] };
  }
  let text = "";
  const ranges = [];
  parts.forEach((part, i) => {
    if (i % 2 === 1 && part) ranges.push([text.length, text.length + part.length]);
    text += part;
  });
  return { text, ranges };
}

/** 앱 utils/materialTable.js `항목들` — 목록 점(· ㆍ ․ •)으로 시작하는 문단은 점마다 줄을 나눈다 */
function itemLines(raw) {
  const t = String(raw ?? "").trim();
  if (!/^[·ㆍ․•]/.test(t)) return [t];
  return t.split(/\s+(?=[·ㆍ․•])/).map((s) => s.trim()).filter(Boolean);
}

/**
 * 앱 utils/materialTable.js `병합표` 를 그대로 옮긴 것 — 빈칸을 병합 칸으로 되살린다.
 * `merges`([줄, 칸, 줄 수, 칸 수])가 오면 짐작하지 않고 쓰고, `head`(머리줄 수, 0 = 머리 없음)가 오면
 * 머리를 짐작하지 않는다. 둘 다 없으면 두 층 머리글·첫 칸 묶음 이름을 앱과 같은 규칙으로 짐작한다.
 */
function mergeTable(rows, head = null, merges = null) {
  const n = Math.max(...rows.map((r) => r.length));
  const cells = rows.map((r) =>
    Array.from({ length: n }, (_, j) => ({ text: String(r[j] ?? "").trim(), colSpan: 1, rowSpan: 1, skip: false })),
  );
  if (Array.isArray(merges) && merges.length) {
    for (const m of merges) {
      const [r, c, rs = 1, cs = 1] = Array.isArray(m) ? m : [];
      if (!cells[r]?.[c]) continue;
      cells[r][c].rowSpan = Math.max(1, Math.min(rs, cells.length - r));
      cells[r][c].colSpan = Math.max(1, Math.min(cs, n - c));
      for (let i = r; i < r + cells[r][c].rowSpan; i += 1) {
        for (let j = c; j < c + cells[r][c].colSpan; j += 1) {
          if (i !== r || j !== c) cells[i][j].skip = true;
        }
      }
    }
    const headRows = Number.isInteger(head) && head >= 0 ? Math.min(head, cells.length) : 1;
    return { cells, headRows };
  }
  const empty = (r, j) => !cells[r][j].text;
  const fixed = Number.isInteger(head) && head >= 0;
  const twoTier = fixed ? head === 2 : cells.length > 2 && cells[0].some((c, j) => j > 0 && !c.text && !empty(1, j));
  const headRows = fixed ? Math.min(head, cells.length) : twoTier ? 2 : 1;
  if (twoTier) {
    for (let j = 1; j < n; j += 1) {
      if (!empty(0, j) || empty(1, j)) continue;
      let k = j - 1;
      while (k >= 0 && cells[0][k].skip) k -= 1;
      if (k >= 0 && !empty(0, k)) {
        cells[0][k].colSpan += 1;
        cells[0][j].skip = true;
      }
    }
    for (let j = 0; j < n; j += 1) {
      if (empty(1, j) && !empty(0, j) && cells[0][j].colSpan === 1 && !cells[0][j].skip) {
        cells[0][j].rowSpan = 2;
        cells[1][j].skip = true;
      }
    }
  }
  let above = -1;
  for (let r = headRows; r < cells.length; r += 1) {
    const otherText = cells[r].some((c, j) => j > 0 && c.text);
    if (!empty(r, 0)) {
      above = r;
    } else if (above >= 0 && otherText) {
      cells[above][0].rowSpan += 1;
      cells[r][0].skip = true;
    }
  }
  return { cells, headRows };
}

/**
 * material_content → 홈페이지 표 목록(앱 MaterialContent 와 같은 차례).
 * 표 앞 문단은 그 표의 lead, 마지막 표 뒤 문단은 표 없는 글(lead 만, rows 빈 목록)로 — 「※ 주」로 바꾸지 않는다
 * (감정평가사는 표 뒤에 ○ 조건·ㄱ.~ㅁ. 보기가 오는 문항이 15개다).
 */
function toRichTables(blocks) {
  const tables = [];
  let lead = [];
  for (const b of blocks) {
    if (b.t === "table" && Array.isArray(b.rows) && b.rows.length) {
      const { cells, headRows } = mergeTable(b.rows.map((r) => r.map((c) => star(String(c ?? "")))), b.head, b.merges);
      const out = cells.map((row) =>
        row
          .filter((c) => !c.skip)
          .map((c) => {
            const { text, ranges } = unmark(c.text);
            const extra = {
              ...(c.colSpan > 1 ? { colSpan: c.colSpan } : {}),
              ...(c.rowSpan > 1 ? { rowSpan: c.rowSpan } : {}),
              ...(ranges.length ? { underlines: ranges } : {}),
            };
            return Object.keys(extra).length ? { text, ...extra } : text;
          }),
      );
      tables.push({
        ...(lead.length ? { lead: lead.join("\n") } : {}),
        ...(headRows ? { headerRows: out.slice(0, headRows) } : {}),
        rows: out.slice(headRows),
      });
      lead = [];
    } else if (b.text) {
      for (const line of itemLines(star(b.text))) lead.push(unmark(line).text);
    }
  }
  if (lead.length) tables.push({ lead: lead.join("\n"), rows: [] });
  return tables;
}

/** 과목 머리 안내문 {파일 앞머리: {연도: 글}} — 앱 화면의 「과목 공통 전제 보기」 */
const NOTICES = cfg.rich && existsSync(path.join(cfg.app, "src", "data", "subjectNotices.js"))
  ? (await import(pathToFileURL(path.join(cfg.app, "src", "data", "subjectNotices.js")).href)).default
  : {};

/**
 * 근거 링크를 시험일 판으로 — sync-app-explanations.mjs `attachLawVersions` 와 같은 규칙.
 * 이 앱의 판 표 열쇠는 「법|연도|조」(연도 = 1차 시험이 있던 해), 시험일은 data/exam_days.json 의 연도 칸.
 * [개정]·[판례변경] 뒤는 현행 이야기라 그 뒤 근거는 고르지 않는다(화면도 현행 조문을 연다).
 */
const LAW_BY_YEAR = new Map();
let EXAM_DAYS = {};
if (cfg.rich) {
  const daysFile = path.join(cfg.app, "data", "exam_days.json");
  const versionsFile = path.join(cfg.app, "src", "data", "lawVersions.json");
  if (existsSync(daysFile)) EXAM_DAYS = JSON.parse(readFileSync(daysFile, "utf8"));
  if (existsSync(versionsFile)) {
    for (const [k, url] of Object.entries(JSON.parse(readFileSync(versionsFile, "utf8")))) {
      const [law, year, jo] = k.split("|");
      if (!LAW_BY_YEAR.has(year)) LAW_BY_YEAR.set(year, []);
      LAW_BY_YEAR.get(year).push({ law, jo, url });
    }
  }
}
const squash = (t) => String(t ?? "").replace(/\s+/g, "");
const beforeCurrentNote = (t) => {
  const text = String(t ?? "");
  const i = text.search(/\[(?:개정|판례변경)\]/);
  return i < 0 ? text : text.slice(0, i);
};
function lawVersionsFor(q) {
  const day = EXAM_DAYS[String(q.year)];
  const list = LAW_BY_YEAR.get(String(q.year));
  if (!/^\d{8}$/.test(String(day ?? "")) || !list) return {};
  const texts = [q.explanation_summary, ...(q.items ?? []).map((it) => it.explanation)]
    .map((t) => squash(beforeCurrentNote(t)))
    .join("\n");
  const found = {};
  for (const { law, jo, url } of list) {
    const [num, sub] = jo.split("의");
    const art = jo.startsWith("별표") ? jo : sub ? `제${num}조의${sub}` : `제${num}조`;
    // 「국유재산법 제51조, 시행령 제55조」처럼 시행령·시행규칙을 앞 법 이름 없이 적는 자리도 고른다
    // (화면 law-link 가 앞 법 이름을 이어 붙여 「국유재산법 시행령」으로 읽는다). 더 골라도 화면은
    // 해설에 실제로 나온 법·조 조각에만 판 주소를 씌우므로 해가 없다.
    const base = law.replace(/\s*시행(령|규칙)$/, "");
    const lawHit =
      texts.includes(squash(law)) ||
      (base !== law && texts.includes(squash(base)) && texts.includes(law.endsWith("령") ? "시행령" : "시행규칙"));
    if (lawHit && texts.includes(art)) found[`${law}|${jo}`] = url;
  }
  if (!Object.keys(found).length) return {};
  const d = String(day);
  return { examDate: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`, lawVersions: found };
}

/** 과목 열쇠·표시 이름·별칭 → 과목. macOS·tar 를 거친 이름은 NFD 라 NFC 로 펴서 견준다. */
const SUBJECT_BY_NAME = new Map();
for (const [name, meta] of Object.entries(cfg.subjects)) {
  for (const alias of [name, meta.label, ...(meta.aliases ?? [])]) {
    const k = alias.normalize("NFC");
    if (!SUBJECT_BY_NAME.has(k)) SUBJECT_BY_NAME.set(k, meta);
  }
}

/** 복수정답·전항정답은 앱이 correct_choices 나 correct_choice 자리에 목록으로 담는다 */
function answerKey(q) {
  const list = Array.isArray(q.correct_choices) && q.correct_choices.length > 1
    ? q.correct_choices
    : Array.isArray(q.correct_choice) && q.correct_choice.length > 1
      ? q.correct_choice
      : null;
  const first = Array.isArray(q.correct_choice) ? q.correct_choice[0] : q.correct_choice;
  return {
    correctChoice: first == null ? first : Number(first),
    ...(list ? { correctChoices: list.map(Number) } : {}),
  };
}

const counts = { lines: 0, table: 0, figure: 0, text: 0, itemImage: 0, multi: 0, underline: 0, notice: 0, lawVersions: 0 };

/** 감정평가사부터 — 앱 StemWithMaterialBox·MaterialContent 가 그리는 것을 빠짐없이 옮긴다 */
function richExam(q, meta, key, filePrefix) {
  // 발문 — 밑줄 표시가 든 지문(stem_marked)이 지금 지문과 같을 때만 그 밑줄을 쓴다(앱과 같은 조건)
  let stem = star(q.stem ?? "");
  const underlines = [];
  if (typeof q.stem_marked === "string" && q.stem_marked.includes("__")) {
    const marked = unmark(star(q.stem_marked));
    if (marked.text === stem) underlines.push(...marked.ranges);
    else console.warn("stem_marked 가 지문과 달라 밑줄을 버린다:", q.id);
  }
  let table;
  let material;
  if (Array.isArray(q.material_lines) && q.material_lines.length) {
    // 글 상자 줄은 발문 뒤에 줄로 — 홈페이지 QuestionStem 이 상자로 그린다. 줄 안 밑줄은 발문 기준 자리로.
    for (const raw of q.material_lines) {
      const { text, ranges } = unmark(star(String(raw ?? "").trim()));
      if (!text) continue;
      const at = stem.length + 1;
      stem = `${stem}\n${text}`;
      for (const [s, e] of ranges) underlines.push([at + s, at + e]);
    }
    counts.lines += 1;
  } else if (Array.isArray(q.material_content) && q.material_content.length) {
    table = toRichTables(q.material_content);
    if (JSON.stringify(table).includes('"underlines"')) counts.underline += 1;
    counts.table += 1;
  } else if (typeof q.material === "string" && q.material.trim() && !q.figure) {
    stem = `${stem}\n${unmark(star(q.material.trim())).text}`;
    counts.text += 1;
  }
  // 자료 그림은 글 상자·표가 있어도 싣는다(남겨 둔 그래프·도해뿐 — 앱은 표 문항에서 「원본 그림 보기」로 연다)
  if (q.figure) {
    const f = figure(q.figure);
    material = {
      image: f.url,
      ...(f.width ? { width: f.width, height: f.height } : {}),
      ...(q.figure_alt ? { alt: star(String(q.figure_alt)) } : {}),
    };
    counts.figure += 1;
  }
  if (underlines.length) counts.underline += 1;
  const notice = NOTICES?.[filePrefix]?.[String(q.year)];
  if (notice) counts.notice += 1;
  const versions = lawVersionsFor(q);
  if (versions.examDate) counts.lawVersions += 1;
  return {
    id: q.id,
    year: q.year,
    sourceCode: q.source_code,
    source: `${q.year}년 ${q.source_code} ${meta.label}`,
    round: Number(String(q.source_code).replace(/[^\d]/g, "")) || q.year,
    questionNo: q.question_no,
    points: 1,
    ...(notice ? { notice: String(notice).trim() } : {}),
    stem,
    ...(Array.isArray(q.material_lines) && q.material_lines.length ? { keepStemLines: true } : {}),
    ...(underlines.length ? { underlines } : {}),
    ...(table ? { table } : {}),
    ...(material ? { material } : {}),
    ...(q.stem_tail ? { stemTail: star(q.stem_tail) } : {}),
    ...(Array.isArray(q.choice_headers) && q.choice_headers.length ? { choiceHeaders: q.choice_headers.map(star) } : {}),
    questionType: q.question_type,
    ...key,
    ...versions,
    category: q.category,
    subcategory: q.subcategory ?? q.chapter ?? null,
    ...(q.taxonomy_unit_id ? { taxonomyUnitId: q.taxonomy_unit_id } : {}),
    ...(q.explanation_summary ? { explanationSummary: star(q.explanation_summary) } : {}),
    items: (q.items ?? []).map((it) => {
      let image;
      if (it.image) {
        image = figure(it.image).url;
        counts.itemImage += 1;
      }
      return {
        key: it.key,
        label: it.label ?? "①②③④⑤"[Number(it.key) - 1] ?? it.key,
        text: star(unmark(it.text).text),
        ...(image ? { image } : {}),
        answer: it.answer,
        explanation: star(it.explanation),
        ...(it.taxonomy_unit_id ? { taxonomy_unit_id: it.taxonomy_unit_id } : {}),
      };
    }),
  };
}

const bySubject = Object.fromEntries(Object.values(cfg.subjects).map((s) => [s.id, []]));
const dir = path.join(cfg.app, "src", "data", "exam");
for (const file of EMPTY ? [] : readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  const rows = JSON.parse(readFileSync(path.join(dir, file), "utf8"));
  const filePrefix = file.normalize("NFC").split("-")[0];
  for (const q of Array.isArray(rows) ? rows : rows.questions ?? []) {
    const meta =
      SUBJECT_BY_NAME.get(String(q.subject ?? "").normalize("NFC")) ?? SUBJECT_BY_NAME.get(filePrefix);
    if (!meta) {
      console.warn("모르는 과목", q.subject, file);
      continue;
    }
    const key = answerKey(q);
    if (key.correctChoices) counts.multi += 1;
    if (cfg.rich) {
      bySubject[meta.id].push(richExam(q, meta, key, filePrefix));
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
      ...key,
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
    JSON.stringify({ subject: { id: meta.id, label: meta.label, track: meta.group ?? cfg.track }, years, sources, concepts: [], exams }) + "\n",
  );
  manifest.push({ id: meta.id, label: meta.label, track: meta.group ?? cfg.track, conceptCount: 0, examCount: exams.length, years, sources });
  console.log(`${meta.id}: ${exams.length}문항`);
}
writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`자료: 글 상자 ${counts.lines} · 표 ${counts.table} · 그림 ${counts.figure} · 평문 ${counts.text} · 선지 그림 ${counts.itemImage} · 새로 복사한 그림 ${copied} · 복수정답 ${counts.multi}`);
if (cfg.rich) console.log(`밑줄 ${counts.underline}문항 · 과목 공통 전제 ${counts.notice}문항 · 시험일 판 근거 ${counts.lawVersions}문항`);
