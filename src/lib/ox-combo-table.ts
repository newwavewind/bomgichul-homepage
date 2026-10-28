/** 「옳은 것(○)과 옳지 않은 것(×)을 바르게 연결한 것은」 정답표 */

const OX_MARK = new Set(["○", "×", "O", "X", "o", "x"]);

function normalizeOxMark(part: string) {
  if (part === "O" || part === "o") return "○";
  if (part === "X" || part === "x") return "×";
  return part;
}

/** 선지 글이 ○× 나열이면 칸 배열, 아니면 null */
export function splitOxCells(text: string): string[] | null {
  const raw = text.trim();
  if (!raw) return null;

  let parts = raw.split(/[\s/／,·ㆍ]+/).filter(Boolean);
  if (parts.length < 2) {
    const chars = [...raw.replace(/\s+/g, "")];
    if (chars.length >= 2 && chars.every((char) => OX_MARK.has(char))) {
      parts = chars;
    } else {
      return null;
    }
  }

  const normalized = parts.map(normalizeOxMark);
  return normalized.every((part) => part === "○" || part === "×")
    ? normalized
    : null;
}

function jamoToken(value: string | undefined) {
  const token = (value ?? "").replace(/[.\s]/g, "").trim();
  return /^[ㄱ-ㅎ]$/.test(token) ? token : null;
}

/** 보기 칸이 ㄱ~ㅎ 지문일 때만 열 제목으로 쓴다 */
export function jamoHeadersFromItems(
  items: { key?: string; label?: string }[],
): string[] | null {
  if (items.length < 2) return null;
  const headers = items.map((item) => {
    return jamoToken(item.label) ?? jamoToken(item.key);
  });
  if (headers.some((header) => !header)) return null;
  return headers as string[];
}

export function getOxComboTable(
  headers: string[],
  choiceTexts: string[],
): { headers: string[]; rows: string[][] } | null {
  if (headers.length < 2 || choiceTexts.length < 2) return null;
  const rows = choiceTexts.map(splitOxCells);
  if (!rows.every((row) => row && row.length === headers.length)) return null;
  return { headers, rows: rows as string[][] };
}
