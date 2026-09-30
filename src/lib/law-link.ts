/**
 * 해설에 적힌 근거를 국가법령정보센터 조문 주소로 나눈다.
 * 앱(`sananbomgichul` 등)의 `lawLink.js` 와 같은 규칙.
 */

import { LAW_NAMES } from "./law-names";

const FORMAL_NAME: Record<string, string> = {
  헌법: "대한민국헌법",
  // 해설이 쓰는 짧은 이름 → 법제처 행정규칙의 현행 이름(앱 lawNames.js 행정규칙정식이름)
  "피의자 유치 및 호송 규칙": "(경찰청) 피의자 유치 및 호송 규칙",
};

/** 법령이 아니라 행정규칙(고시) — `/행정규칙/` 경로. */
const ADMIN_RULES = new Set([
  "안전보건교육규정",
  "사업장 위험성평가에 관한 지침",
  "화학물질 및 물리적 인자의 노출기준",
  "작업환경측정 및 정도관리 등에 관한 고시",
  "작업환경측정 및 지정측정기관 평가 등에 관한 고시",
  "근로자 건강진단 실시기준",
  "보호구 안전인증 고시",
  "산업재해통계업무처리규정",
  "안전검사 절차에 관한 고시",
  "근골격계부담작업의 범위 및 유해요인조사 방법에 관한 고시",
  "근로자 건강증진활동 지침",
  "사무실 공기관리 지침",
  "농업재해보험 손해평가요령",
  // 재집필(2026-09-30) 해설이 조 번호까지 인용한 훈령·고시 — 앱 lawNames.js 행정규칙이름표
  "(경찰청) 피의자 유치 및 호송 규칙",
  "112종합상황실 운영 및 신고처리 규칙",
  "112치안종합상황실 운영 및 신고처리 규칙",
  "경찰 감찰 규칙",
  "경찰 비상업무 규칙",
  "경찰 인권보호 규칙",
  "경찰공무원 징계령 세부시행규칙",
  "경찰장비관리규칙",
  "경찰청 감사 규칙",
  "경찰청 공무원 행동강령",
  "경찰청 적극행정 면책제도 운영규정",
  "보안업무규정 시행 세부규칙",
  "보안업무규정 시행규칙",
  "성폭력범죄의 수사 및 피해자 보호에 관한 규칙",
  "실종아동등 및 가출인 업무처리 규칙",
  "지역경찰의 조직 및 운영에 관한 규칙",
  "피의자 유치 및 호송 규칙",
  "화재조사 및 보고규정",
]);

const ALIASES = [...Object.keys(FORMAL_NAME), ...ADMIN_RULES];

function findLawName(text: string, end: number): { name: string; start: number } | null {
  for (const listed of [...LAW_NAMES, ...ALIASES]) {
    const start = end - listed.length;
    if (start < 0 || text.slice(start, end) !== listed) continue;
    if (start > 0 && /[가-힣]/.test(text[start - 1]!)) continue;
    return { name: listed, start };
  }
  return null;
}

const BARE_NAME_RE = /((?:[가-힣]|[·ㆍ]){1,24}?(?:법|령|규칙|규정))[」｣]?$/;
const DEPENDENT = new Set(["시행령", "시행규칙", "법률", "법", "령", "규칙", "규정", "요령"]);

function findNameOutsideTable(
  text: string,
  end: number,
  previousLaw: string | null
): { name: string; start: number } | null {
  const m = BARE_NAME_RE.exec(text.slice(0, end));
  if (!m) return null;
  const start = end - m[0].length;
  const before = text.slice(0, start).replace(/[「｢]$/, "");
  if (/[가-힣]\s*$/.test(before)) return null;

  const bare = m[1]!;
  if (DEPENDENT.has(bare)) {
    if (!previousLaw || !/^시행(령|규칙)$/.test(bare)) return null;
    const base = previousLaw.replace(/\s*시행(령|규칙)$/, "");
    const joined = `${base} ${bare}`;
    return LAW_NAMES.includes(joined) ? { name: joined, start } : null;
  }
  return { name: bare, start };
}

const ARTICLE_RE = new RegExp(
  "제\\s*(\\d+)\\s*조(?:\\s*의\\s*(\\d+))?" +
    "(?:\\s*제\\s*\\d+\\s*항)?" +
    "(?:\\s*제\\s*\\d+\\s*호(?:\\s*의\\s*\\d+)?)?" +
    "(?:\\s*[가-하]\\s*목)?" +
    "(?:\\s*(?:본문|단서|전단|후단))?",
  "g"
);

const CASE_RE =
  /(?<![\d,])(?:(대판|대결|헌재)\s*)?((?:19|20)?\d{2}(?:재다|재두|헌마|헌바|헌가|헌라|헌나|헌다|다카|카합|카단|다|두|도|누|므|후|카|드|부|무|마|허|초|즈|그|스|브|르|으|라|오)\d{1,6})(?![\d,]\d)(?:\s*전합)?/g;

const APPENDIX_RE = /별표\s*(\d+)(?:\s*의\s*(\d+))?/g;

export function lawUrl(name: string, article?: string, articleOf?: string): string {
  const proper = FORMAL_NAME[name] ?? name;
  const kind = ADMIN_RULES.has(proper) ? "행정규칙" : "법령";
  if (article == null) {
    return `https://www.law.go.kr/${kind}/${encodeURIComponent(proper)}`;
  }
  const clause = articleOf ? `제${article}조의${articleOf}` : `제${article}조`;
  return `https://www.law.go.kr/${kind}/${encodeURIComponent(proper)}/${encodeURIComponent(clause)}`;
}

export function precedentUrl(caseNo: string): string {
  return `https://www.law.go.kr/precSc.do?menuId=7&query=${encodeURIComponent(caseNo)}`;
}

export type LawCitePart = {
  text: string;
  href?: string;
  law?: string;
  article?: string;
};

/**
 * 글을 조각으로 나눈다. 링크가 없으면 빈 배열.
 */
export function splitLawCites(text: string): LawCitePart[] {
  if (!text) return [];

  type Hit = { start: number; end: number; href: string; law?: string; article?: string };
  const hits: Hit[] = [];

  ARTICLE_RE.lastIndex = 0;
  APPENDIX_RE.lastIndex = 0;
  const slots = [
    ...[...text.matchAll(ARTICLE_RE)].map((m) => ({ m, appendix: false as const })),
    ...[...text.matchAll(APPENDIX_RE)].map((m) => ({ m, appendix: true as const })),
  ].sort((a, b) => (a.m.index ?? 0) - (b.m.index ?? 0));

  let textLaw: string | null = null;
  for (const { m } of slots) {
    const beforeEnd = text.slice(0, m.index).replace(/\s+$/, "").length;
    textLaw = findLawName(text, beforeEnd)?.name ?? textLaw;
  }

  let previousLaw: string | null = null;
  let previousEnd = -1;
  for (const { m, appendix } of slots) {
    const beforeEnd = text.slice(0, m.index).replace(/\s+$/, "").length;
    let nameHit: { name: string; start: number } | null =
      findLawName(text, beforeEnd) ??
      findNameOutsideTable(text, beforeEnd, previousLaw ?? textLaw);
    let start: number;
    if (nameHit) {
      start = nameHit.start - (/[「｢]$/.test(text.slice(0, nameHit.start)) ? 1 : 0);
    } else if (
      previousLaw &&
      previousEnd >= 0 &&
      /^\s*(?:[,，]|및)\s*$/.test(text.slice(previousEnd, m.index))
    ) {
      nameHit = { name: previousLaw, start: m.index! };
      start = m.index!;
    } else {
      continue;
    }
    previousLaw = nameHit.name;
    previousEnd = m.index! + m[0].length;
    hits.push({
      start,
      end: previousEnd,
      href: appendix
        ? lawUrl(nameHit.name)
        : lawUrl(nameHit.name, m[1], m[2]),
      law: FORMAL_NAME[nameHit.name] ?? nameHit.name,
      article: appendix
        ? m[2]
          ? `별표${m[1]}의${m[2]}`
          : `별표${m[1]}`
        : m[2]
          ? `${m[1]}의${m[2]}`
          : m[1],
    });
  }

  CASE_RE.lastIndex = 0;
  for (const m of text.matchAll(CASE_RE)) {
    const start = m.index!;
    const end = start + m[0].length;
    if (hits.some((x) => start < x.end && end > x.start)) continue;
    hits.push({ start, end, href: precedentUrl(m[2]!) });
  }

  if (!hits.length) return [];
  hits.sort((a, b) => a.start - b.start);

  const parts: LawCitePart[] = [];
  let cursor = 0;
  for (const hit of hits) {
    if (hit.start < cursor) continue;
    if (hit.start > cursor) parts.push({ text: text.slice(cursor, hit.start) });
    parts.push({
      text: text.slice(hit.start, hit.end),
      href: hit.href,
      law: hit.law,
      article: hit.article,
    });
    cursor = hit.end;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor) });
  return parts;
}
