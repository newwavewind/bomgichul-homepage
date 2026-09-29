/**
 * 빈칸 박스 외 지문 표시 이슈 전수 조사.
 * npx tsx scripts/audit-stem-other-issues.mts
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import {
  parseQuestionStem,
  stemHasInconsistentBoxStyles,
} from "../src/lib/exam-stem";
import { plainStudyText } from "../src/lib/study-text";

const TRACK_ROOTS: [string, string][] = [
  ["src/data/exam-questions", "공인중개사"],
  ["src/data/public-service", "공무원"],
  ["src/data/police", "경찰"],
  ["src/data/firefighter", "소방"],
  ["src/data/housing", "주택관리사"],
  ["src/data/social-worker", "사회복지사"],
  ["src/data/history", "한국사"],
  ["src/data/english", "공무원영어"],
  ["src/data/gugeo", "공무원국어"],
  ["src/data/haengjeongsa", "행정사"],
  ["src/data/semusa", "세무사"],
];

type Q = {
  track: string;
  file: string;
  subject: string;
  year?: number | string;
  questionNo?: number | string;
  stem: string;
};

function collect(file: string, track: string): Q[] {
  const raw = JSON.parse(readFileSync(file, "utf8"));
  const out: Q[] = [];
  const push = (q: any, sub?: string) => {
    const stem = q?.stem;
    if (typeof stem !== "string") return;
    out.push({
      track,
      file: path.relative(process.cwd(), file),
      subject: String(q.subject?.label ?? q.subject ?? sub ?? path.basename(file, ".json")),
      year: q.year,
      questionNo: q.questionNo ?? q.question_no,
      stem,
    });
  };
  if (Array.isArray(raw)) raw.forEach((q) => push(q));
  else if (Array.isArray(raw.exams))
    raw.exams.forEach((q: any) => push(q, raw.subject?.label ?? raw.subject?.id));
  return out;
}

const all: Q[] = [];
for (const [root, label] of TRACK_ROOTS) {
  if (!existsSync(root)) continue;
  for (const f of readdirSync(root)) {
    if (!f.endsWith(".json") || f === "manifest.json" || f === "series.json") continue;
    all.push(...collect(path.join(root, f), label));
  }
}

/** 자료 항목 마커가 stem에 보이는데 박스가 안 나온 경우 */
function looksLikeMaterialMarkers(stem: string): boolean {
  // ㄱ. ㄴ. 가 둘 이상 / ○ 둘 이상 / ㉠ 둘 이상 / <보기>
  const jamo = (stem.match(/[ㄱ-ㅎ]\.\s+\S/g) || []).length;
  const circles = (stem.match(/[ㅇ○]\s+\S/g) || []).length;
  const circled = (stem.match(/[㉠-㉿]\s*\S/g) || []).length;
  const boxLabel = /<\s*보\s?기/.test(stem);
  return jamo >= 2 || circles >= 2 || circled >= 2 || boxLabel;
}

function ref(q: Q) {
  return {
    track: q.track,
    file: q.file,
    subject: q.subject,
    year: q.year,
    questionNo: q.questionNo,
    stemPreview: q.stem.replace(/\s+/g, " ").slice(0, 140),
  };
}

const emptyStem: Q[] = [];
const whitespaceOnly: ReturnType<typeof ref>[] = [];
const missingQuestionMark: ReturnType<typeof ref>[] = []; // 객관식인데 ? 없음 (참고)
const materialMarkerButNoBox: ReturnType<typeof ref>[] = [];
const inconsistentBoxStyles: ReturnType<typeof ref>[] = [];
const multiQuestionMark: ReturnType<typeof ref>[] = [];
const veryLongFlatLine: ReturnType<typeof ref>[] = []; // 개행 없이 400자+ (표/자료 평탄화 의심)
const duplicateQuestionNoInStem: ReturnType<typeof ref>[] = [];
const htmlOrMdLeak: ReturnType<typeof ref>[] = [];
const plainStudyChanged: ReturnType<typeof ref>[] = [];
const boxedOkWithMarkers = { count: 0 };

let total = 0;
const byTrack: Record<
  string,
  {
    total: number;
    materialMiss: number;
    inconsistent: number;
    multiQ: number;
    longFlat: number;
    noQMark: number;
    htmlLeak: number;
  }
> = {};

for (const q of all) {
  total++;
  const t = (byTrack[q.track] ??= {
    total: 0,
    materialMiss: 0,
    inconsistent: 0,
    multiQ: 0,
    longFlat: 0,
    noQMark: 0,
    htmlLeak: 0,
  });
  t.total++;

  if (!q.stem.trim()) {
    emptyStem.push(q);
    continue;
  }

  const cleaned = plainStudyText(q.stem);
  if (cleaned !== q.stem && /<[^>]+>|&[a-z]+;|https?:\/\//i.test(q.stem)) {
    plainStudyChanged.push(ref(q));
  }

  const { boxLines } = parseQuestionStem(cleaned);
  const hasBox = boxLines.length > 0;

  if (looksLikeMaterialMarkers(cleaned)) {
    if (!hasBox) {
      materialMarkerButNoBox.push(ref(q));
      t.materialMiss++;
    } else {
      boxedOkWithMarkers.count++;
    }
  }

  if (hasBox && stemHasInconsistentBoxStyles(cleaned)) {
    inconsistentBoxStyles.push(ref(q));
    t.inconsistent++;
  }

  const qMarks = (cleaned.match(/\?/g) || []).length;
  if (qMarks > 1) {
    multiQuestionMark.push(ref(q));
    t.multiQ++;
  }
  if (qMarks === 0 && cleaned.length > 40) {
    // 많은 기출이 「~이다.」로 끝나 ? 없을 수 있음 — 참고만
    missingQuestionMark.push(ref(q));
    t.noQMark++;
  }

  if (!cleaned.includes("\n") && cleaned.length >= 400) {
    // 긴 단문이면서 자료 마커가 있으면 평탄화 의심 강화
    if (looksLikeMaterialMarkers(cleaned) || /\(\s*\)|\([ㄱ-ㅎ]\)/.test(cleaned)) {
      veryLongFlatLine.push(ref(q));
      t.longFlat++;
    }
  }

  if (q.questionNo != null) {
    const re = new RegExp(`^\\s*${q.questionNo}\\s*[.]`);
    if (re.test(cleaned)) duplicateQuestionNoInStem.push(ref(q));
  }

  if (/<\/?[a-z][\s\S]*>/i.test(q.stem) || /&nbsp;|&lt;|&gt;/.test(q.stem)) {
    htmlOrMdLeak.push(ref(q));
    t.htmlLeak++;
  }

  if (/^\s+$/.test(q.stem)) whitespaceOnly.push(ref(q));
}

function byTrackCount(rows: { track: string }[]) {
  const m: Record<string, number> = {};
  for (const r of rows) m[r.track] = (m[r.track] || 0) + 1;
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}

const summary = {
  scannedAt: new Date().toISOString(),
  totalQuestions: total,
  emptyStem: emptyStem.length,
  /** ㄱ·○·㉠·<보기> 마커가 있는데 박스 미분리 — 핵심 잔여 버그 후보 */
  materialMarkerButNoBox: materialMarkerButNoBox.length,
  materialMarkerButNoBoxByTrack: byTrackCount(materialMarkerButNoBox),
  materialMarkersBoxedOk: boxedOkWithMarkers.count,
  inconsistentBoxStyles: inconsistentBoxStyles.length,
  inconsistentByTrack: byTrackCount(inconsistentBoxStyles),
  multiQuestionMark: multiQuestionMark.length,
  multiQByTrack: byTrackCount(multiQuestionMark),
  veryLongFlatWithMarkers: veryLongFlatLine.length,
  longFlatByTrack: byTrackCount(veryLongFlatLine),
  duplicateQuestionNoInStem: duplicateQuestionNoInStem.length,
  htmlOrMdLeak: htmlOrMdLeak.length,
  htmlLeakByTrack: byTrackCount(htmlOrMdLeak),
  /** 참고: ? 없는 긴 stem (시험지 문장형) */
  missingQuestionMark: missingQuestionMark.length,
  byTrack,
};

const STORE =
  "/Users/newsang/Library/Application Support/Cursor/AgentStores/cursor_agent_stores/bc-ce3a753c-6afa-4590-bfb0-c1c2da68eece/files/internal";
mkdirSync(STORE, { recursive: true });
writeFileSync(
  path.join(STORE, "homepage-stem-other-issues-audit.json"),
  JSON.stringify(
    {
      summary,
      materialMarkerButNoBox: materialMarkerButNoBox.slice(0, 80),
      inconsistentBoxStyles: inconsistentBoxStyles.slice(0, 40),
      multiQuestionMark: multiQuestionMark.slice(0, 40),
      veryLongFlatWithMarkers: veryLongFlatLine.slice(0, 40),
      htmlOrMdLeak: htmlOrMdLeak.slice(0, 30),
      duplicateQuestionNoInStem: duplicateQuestionNoInStem.slice(0, 20),
      emptyStem: emptyStem.map(ref),
    },
    null,
    2,
  ),
);

console.log(JSON.stringify(summary, null, 2));
if (materialMarkerButNoBox.length) {
  console.log("\n--- material miss samples ---");
  for (const r of materialMarkerButNoBox.slice(0, 12)) {
    console.log(`[${r.track}] ${r.file} ${r.year} Q${r.questionNo}`);
    console.log(" ", r.stemPreview);
  }
}
