export interface ParsedQuestionStem {
  intro: string;
  boxLines: string[];
}

const CIRCLE_AT_START = /^[ㅇ○]\s/;
const LOWER_O_AT_START = /^o\s+(?=[가-힣「(ㄱ-ㅎ])/i;
/** 시험지 보기 상자 — ㄱ. ㄴ. ㄷ. ㄹ. … */
const JAMO_ITEM_AT_START = /^[ㄱ-ㅎ]\.\s+/;
const CIRCLE_SPLIT = /(?=[ㅇ○]\s)/;
const INLINE_O_SPLIT = /\s+o\s+(?=[가-힣「(ㄱ-ㅎ])/i;
const INLINE_JAMO_ITEM_SPLIT = /(?=[ㄱ-ㅎ]\.\s+)/;

function isDisclaimerProse(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (/^\((단|다만|주|참고)[,，]/.test(t)) return true;
  if (/^\([^)]+\)$/.test(t) && t.length <= 200) return true;
  return false;
}

function normalizeBulletLine(line: string): string {
  const trimmed = line.trim();
  if (CIRCLE_AT_START.test(trimmed)) return trimmed;
  if (JAMO_ITEM_AT_START.test(trimmed)) return trimmed;
  if (LOWER_O_AT_START.test(trimmed)) {
    return `○ ${trimmed.replace(/^o\s+/i, "")}`;
  }
  return trimmed;
}

function findBulletStart(rest: string): number {
  const indices: number[] = [];
  const circleIdx = rest.search(/[ㅇ○]\s/);
  if (circleIdx >= 0) indices.push(circleIdx);
  if (LOWER_O_AT_START.test(rest)) indices.push(0);
  const oIdx = rest.search(INLINE_O_SPLIT);
  if (oIdx >= 0) indices.push(oIdx);
  const jamoIdx = rest.search(/[ㄱ-ㅎ]\.\s+/);
  if (jamoIdx >= 0) indices.push(jamoIdx);
  return indices.length > 0 ? Math.min(...indices) : -1;
}

function splitCircleBullets(text: string): string[] {
  if (!text || !/[ㅇ○]\s/.test(text)) return [];
  return text
    .split(CIRCLE_SPLIT)
    .map((s) => s.trim())
    .filter((s) => CIRCLE_AT_START.test(s))
    .map(normalizeBulletLine);
}

function splitLowerOBullets(text: string): string[] {
  const hasLeading = LOWER_O_AT_START.test(text);
  const hasInline = INLINE_O_SPLIT.test(text);
  if (!hasLeading && !hasInline) return [];

  return text
    .split(INLINE_O_SPLIT)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `○ ${s.replace(/^o\s+/i, "")}`);
}

function splitJamoItemBullets(text: string): string[] {
  if (!text || !/[ㄱ-ㅎ]\.\s+/.test(text)) return [];
  return text
    .split(INLINE_JAMO_ITEM_SPLIT)
    .map((s) => s.trim())
    .filter((s) => JAMO_ITEM_AT_START.test(s))
    .map(normalizeBulletLine);
}

function extractInlineBullets(bulletText: string): string[] {
  if (/[ㅇ○]\s/.test(bulletText)) return splitCircleBullets(bulletText);
  const jamo = splitJamoItemBullets(bulletText);
  if (jamo.length >= 2) return jamo;
  return splitLowerOBullets(bulletText);
}

function parseInlineMaterialBox(stem: string): ParsedQuestionStem | null {
  const qIdx = stem.indexOf("?");
  if (qIdx < 0) return null;

  let intro = stem.slice(0, qIdx + 1).trim();
  const rest = stem.slice(qIdx + 1).trim();
  if (!rest) return null;

  const bulletStart = findBulletStart(rest);
  if (bulletStart < 0) return null;

  let prose = rest.slice(0, bulletStart).trim();
  const bulletText = rest.slice(bulletStart).trim();

  if (prose && isDisclaimerProse(prose)) {
    intro = `${intro}${prose.startsWith("(") ? "" : " "}${prose}`;
    prose = "";
  }

  const bullets = extractInlineBullets(bulletText);
  if (bullets.length === 0) return null;

  // 첫 `o` 항목이 prose로 잘못 분류된 경우 보정
  if (prose && LOWER_O_AT_START.test(prose)) {
    return { intro, boxLines: [normalizeBulletLine(prose), ...bullets] };
  }

  if (prose && prose.length >= 10) {
    return { intro, boxLines: [prose, ...bullets] };
  }

  return { intro, boxLines: bullets };
}

function isBoxStartLine(line: string): boolean {
  const trimmed = line.trim();
  return (
    CIRCLE_AT_START.test(trimmed) ||
    LOWER_O_AT_START.test(trimmed) ||
    JAMO_ITEM_AT_START.test(trimmed)
  );
}

function parseMultilineStem(stem: string): ParsedQuestionStem | null {
  const lines = stem.split("\n");
  const boxStart = lines.findIndex((line) => isBoxStartLine(line));
  if (boxStart < 0) return null;

  const intro = lines
    .slice(0, boxStart)
    .join("\n")
    .trim();
  const boxLines = lines
    .slice(boxStart)
    .filter((line) => line.trim().length > 0)
    .flatMap((line) => {
      const trimmed = line.trim();
      // "ㄱ. A   ㄴ. B"처럼 한 줄에 여러 항목이면 분리
      const jamoParts = splitJamoItemBullets(trimmed);
      if (jamoParts.length >= 2) return jamoParts;
      return [normalizeBulletLine(trimmed)];
    });

  return { intro, boxLines };
}

/** 지문을 질문 본문 + ○/ㄱ. 자료 박스로 분리 */
export function parseQuestionStem(stem: string): ParsedQuestionStem {
  const multiline = parseMultilineStem(stem);
  if (multiline && multiline.boxLines.length > 0) return multiline;

  const inline = parseInlineMaterialBox(stem);
  if (inline) return inline;

  return { intro: stem, boxLines: [] };
}

/** 박스 분리가 필요한데 현재 단일 <p>로만 나가는 지문인지 (감사용) */
export function stemNeedsConditionBox(stem: string): boolean {
  return parseQuestionStem(stem).boxLines.length > 0;
}

/** 박스 내 항목이 서로 다른 스타일로 렌더될 위험이 있는지 (감사용) */
export function stemHasInconsistentBoxStyles(stem: string): boolean {
  const { boxLines } = parseQuestionStem(stem);
  if (boxLines.length === 0) return false;

  return boxLines.some((line) => {
    const trimmed = line.trim();
    const isSubItem =
      trimmed.startsWith("-") ||
      /^[가-힣]\.\s/.test(trimmed) ||
      JAMO_ITEM_AT_START.test(trimmed);
    const isNote = trimmed.startsWith("※");
    const isBullet = CIRCLE_AT_START.test(trimmed) || LOWER_O_AT_START.test(trimmed);
    if (isSubItem || isNote) return false;
    return !isBullet;
  });
}
