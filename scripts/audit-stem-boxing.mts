/**
 * 홈페이지 전 트랙 기출 지문 박스 분리 전수 조사.
 * 사용: npx tsx scripts/audit-stem-boxing.mts
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { parseQuestionStem } from "../src/lib/exam-stem";

const TRACK_ROOTS = [
  "src/data/exam-questions", // 공인중개사
  "src/data/public-service", // 공무원
  "src/data/police",
  "src/data/firefighter",
  "src/data/housing",
  "src/data/social-worker",
  "src/data/history",
  "src/data/english",
  "src/data/gugeo",
  "src/data/haengjeongsa",
  "src/data/semusa",
];

const BLANK_RE = /\(\s*\)|\([ㄱ-ㅎ]\)|\(　\)/;

type Q = {
  track: string;
  file: string;
  subject: string;
  year?: number | string;
  questionNo?: number | string;
  stem: string;
};

function trackLabel(dir: string): string {
  const base = path.basename(dir);
  const map: Record<string, string> = {
    "exam-questions": "공인중개사",
    "public-service": "공무원",
    police: "경찰",
    firefighter: "소방",
    housing: "주택관리사",
    "social-worker": "사회복지사",
    history: "한국사",
    english: "공무원영어",
    gugeo: "공무원국어",
    haengjeongsa: "행정사",
    semusa: "세무사",
  };
  return map[base] ?? base;
}

function pushQ(out: Q[], q: any, meta: Partial<Q>) {
  if (!q || typeof q !== "object") return;
  const stem = q.stem ?? q.question;
  if (typeof stem !== "string" || !stem.trim()) return;
  out.push({
    track: meta.track!,
    file: meta.file!,
    subject: String(q.subject?.label ?? q.subject ?? meta.subject ?? ""),
    year: q.year ?? meta.year,
    questionNo: q.questionNo ?? q.question_no ?? q.no,
    stem,
  });
}

function collectFromFile(file: string, track: string): Q[] {
  const raw = JSON.parse(readFileSync(file, "utf8"));
  const out: Q[] = [];
  const subjectHint = path.basename(file, ".json");
  const base = { track, file: path.relative(process.cwd(), file), subject: subjectHint };

  if (Array.isArray(raw)) {
    for (const q of raw) pushQ(out, q, base);
    return out;
  }
  if (Array.isArray(raw.exams)) {
    for (const q of raw.exams) {
      pushQ(out, q, {
        ...base,
        subject: raw.subject?.label ?? raw.subject?.id ?? subjectHint,
      });
    }
    return out;
  }
  // nested bags
  for (const [k, v] of Object.entries(raw)) {
    if (!v || typeof v !== "object") continue;
    if (Array.isArray(v)) {
      for (const q of v) pushQ(out, q, { ...base, year: Number(k) || k });
    } else if (Array.isArray((v as any).exams)) {
      for (const q of (v as any).exams) pushQ(out, q, { ...base, year: Number(k) || k });
    } else if (Array.isArray((v as any).questions)) {
      for (const q of (v as any).questions) pushQ(out, q, { ...base, year: Number(k) || k });
    }
  }
  return out;
}

const all: Q[] = [];
for (const root of TRACK_ROOTS) {
  if (!existsSync(root)) continue;
  for (const f of readdirSync(root)) {
    if (!f.endsWith(".json") || f === "manifest.json" || f === "series.json") continue;
    all.push(...collectFromFile(path.join(root, f), trackLabel(root)));
  }
}

type Row = Q & { intro?: string; restPreview?: string; boxPreview?: string };

const stillFlatBlankFill: Row[] = [];
const boxedBlankFill: Row[] = [];
const blankNoQuestionMark: Row[] = [];
const multiQuestionMark: Row[] = [];
const longProseBoxed: Row[] = []; // ? 뒤 긴 산문 박스 (빈칸 아님) — 참고
let boxed = 0;
let unboxed = 0;
let bulletBoxed = 0;

for (const q of all) {
  const { intro, boxLines } = parseQuestionStem(q.stem);
  const hasBox = boxLines.length > 0;
  if (hasBox) boxed++;
  else unboxed++;

  const qi = q.stem.indexOf("?");
  const rest = qi >= 0 ? q.stem.slice(qi + 1).trim() : "";
  const hasBlank = BLANK_RE.test(q.stem);
  const looksBlankFill = hasBlank && qi >= 0 && rest.length >= 20;

  if (looksBlankFill) {
    if (hasBox) {
      boxedBlankFill.push({
        ...q,
        intro,
        boxPreview: (boxLines[0] ?? "").slice(0, 100),
      });
    } else {
      stillFlatBlankFill.push({ ...q, restPreview: rest.slice(0, 120) });
    }
  }

  if (hasBlank && qi < 0) {
    blankNoQuestionMark.push({ ...q });
  }

  const qMarks = (q.stem.match(/\?/g) || []).length;
  if (qMarks > 1) {
    multiQuestionMark.push({ ...q });
  }

  if (
    hasBox &&
    !hasBlank &&
    boxLines.length === 1 &&
    !/^[ㅇ○ㄱ-ㅎ㉠<]/.test(boxLines[0].trim()) &&
    !/^[ㄱ-ㅎ]\.\s/.test(boxLines[0].trim())
  ) {
    longProseBoxed.push({
      ...q,
      intro: intro.slice(0, 100),
      boxPreview: boxLines[0].slice(0, 100),
    });
  }

  if (
    hasBox &&
    boxLines.some(
      (l) =>
        /^[ㅇ○ㄱ-ㅎ㉠]/.test(l.trim()) ||
        /^[ㄱ-ㅎ]\.\s/.test(l.trim()) ||
        /^<\s*보/.test(l.trim()),
    )
  ) {
    bulletBoxed++;
  }
}

function byTrack(rows: Row[]) {
  const m: Record<string, number> = {};
  for (const r of rows) m[r.track] = (m[r.track] || 0) + 1;
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}

function byFile(rows: Row[]) {
  const m: Record<string, number> = {};
  for (const r of rows) m[r.file] = (m[r.file] || 0) + 1;
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}

const byTrackTotal: Record<string, number> = {};
for (const q of all) byTrackTotal[q.track] = (byTrackTotal[q.track] || 0) + 1;

const summary = {
  scannedAt: new Date().toISOString(),
  totalQuestions: all.length,
  byTrack: byTrackTotal,
  boxed,
  unboxed,
  bulletBoxed,
  blankFillPattern: boxedBlankFill.length + stillFlatBlankFill.length,
  blankFillNowBoxed: boxedBlankFill.length,
  blankFillStillFlat: stillFlatBlankFill.length,
  blankWithoutQuestionMark: blankNoQuestionMark.length,
  multiQuestionMark: multiQuestionMark.length,
  longProseBoxedWithoutBlank: longProseBoxed.length,
  stillFlatByTrack: byTrack(stillFlatBlankFill),
  stillFlatByFile: byFile(stillFlatBlankFill),
  blankFillBoxedByTrack: byTrack(boxedBlankFill),
  blankNoQByTrack: byTrack(blankNoQuestionMark),
};

const STORE =
  "/Users/newsang/Library/Application Support/Cursor/AgentStores/cursor_agent_stores/bc-ce3a753c-6afa-4590-bfb0-c1c2da68eece/files";
mkdirSync(path.join(STORE, "internal"), { recursive: true });

writeFileSync(
  path.join(STORE, "internal/homepage-stem-full-audit.json"),
  JSON.stringify(
    {
      summary,
      stillFlatBlankFill,
      blankNoQuestionMark: blankNoQuestionMark.slice(0, 80),
      multiQuestionMark: multiQuestionMark.slice(0, 60),
      longProseBoxedSample: longProseBoxed.slice(0, 40),
    },
    null,
    2,
  ),
);

console.log(JSON.stringify(summary, null, 2));
if (stillFlatBlankFill.length) {
  console.log("\nSTILL FLAT samples:");
  for (const r of stillFlatBlankFill.slice(0, 15)) {
    console.log(`- [${r.track}] ${r.file} ${r.year} Q${r.questionNo}`);
    console.log(`  ${r.stem.slice(0, 100)}…`);
  }
}
