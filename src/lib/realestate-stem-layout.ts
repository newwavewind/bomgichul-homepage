import { parseQuestionStem } from "@/lib/exam-stem";

export type JamoDef = { jamo: string; text: string };
export type BogiItem = { key: string; text: string };

export type RealestateStemParts = {
  jamoDefs: JamoDef[] | null;
  embeddedBlock: string | null;
  intro: string;
  bullets: string[] | null;
  bulletsProse: string | null;
  tail: string | null;
  bogiBlock: {
    intro: string;
    fillSentence?: string;
    jamoDefs?: JamoDef[] | null;
    bogiItems: BogiItem[];
  } | null;
  jamoFillBlock: { intro: string; fillSentence: string } | null;
};

const JAMO_DEF_MARK = /\(\s*([ㄱ-ㅎ])\s*\)\s*:\s*/g;
const INLINE_JAMO_COLON_MARK = /(?:^|\s)([ㄱ-ㅎ]):\s*/g;
const INLINE_JAMO_BLANK = /\(\s*[ㄱ-ㅎ]\s*\)(?!\s*:)/;

export function parseInlineJamoColonDefinitions(text: string): JamoDef[] | null {
  if (!text?.trim()) return null;
  const matches = [...text.matchAll(INLINE_JAMO_COLON_MARK)];
  if (matches.length < 2) return null;
  return matches.map((m, i) => {
    const start = (m.index ?? 0) + m[0].length;
    const end = i + 1 < matches.length ? (matches[i + 1].index ?? text.length) : text.length;
    return { jamo: m[1], text: text.slice(start, end).trim() };
  });
}

function parseJamoDefinitions(stem: string): { intro: string; jamoDefs: JamoDef[] | null } {
  if (!stem) return { intro: "", jamoDefs: null };
  const matches = [...stem.matchAll(JAMO_DEF_MARK)];
  if (!matches.length) return { intro: stem, jamoDefs: null };
  const intro = stem.slice(0, matches[0].index).trim();
  const jamoDefs = matches.map((m, i) => {
    const textStart = (m.index ?? 0) + m[0].length;
    const textEnd = i + 1 < matches.length ? (matches[i + 1].index ?? stem.length) : stem.length;
    return { jamo: m[1], text: stem.slice(textStart, textEnd).trim() };
  });
  return { intro, jamoDefs };
}

function isCircleBulletMaterial(text: string): boolean {
  const stripped = text.replace(/^\(단[^)]*\)\s*/u, "").trim();
  return /^[ㅇ○]\s/u.test(stripped) || /(^|\n)[ㅇ○]\s/u.test(stripped);
}

function parseEmbeddedAfterQuestion(stem: string): { intro: string; embeddedBlock: string | null } {
  if (!stem) return { intro: "", embeddedBlock: null };
  for (let i = stem.length - 1; i >= 0; i -= 1) {
    if (stem[i] !== "?") continue;
    const embeddedBlock = stem.slice(i + 1).trim();
    if (!embeddedBlock || /^\(단[,\s]/u.test(embeddedBlock)) continue;
    if (isCircleBulletMaterial(embeddedBlock)) continue;
    if (/\(\s*[ㄱ-ㅎ]\s*\)\s*:\s*/.test(embeddedBlock)) return { intro: stem, embeddedBlock: null };
    const hasInlineJamo = INLINE_JAMO_BLANK.test(embeddedBlock);
    const isDescriptionBlock = embeddedBlock.length >= 20;
    if (!hasInlineJamo && !isDescriptionBlock) continue;
    return { intro: stem.slice(0, i + 1).trim(), embeddedBlock };
  }
  return { intro: stem, embeddedBlock: null };
}

function isJamoBlankParenBeforeColon(text: string, closeParenIndex: number): boolean {
  const before = text.slice(0, closeParenIndex);
  return /\(\s*[ㄱ-ㅎ](?:\s+[ㄱ-ㅎ])*\s*$/.test(before);
}

function formatCircleBulletColons(text: string): string {
  if (!/\)\s*:\s+/.test(text)) return text;
  return text.replace(/\)\s*:\s+/g, (match, offset) => {
    if (isJamoBlankParenBeforeColon(text, offset)) return "): ";
    return ")\n: ";
  });
}

function isEquationCircleBullet(text: string): boolean {
  const body = text.replace(/^[ㅇ○]\s+/, "");
  return /[=→]|Q[dD₁₂]|Qs?\s*=|\d\s*-\s*[\d(]|[Pp]\s*-\s*\d/i.test(body);
}

export function formatCircleBulletDashes(text: string): string {
  const t = text.trim();
  if (!/^[ㅇ○]\s/.test(t)) return text;
  if (isEquationCircleBullet(t)) return formatCircleBulletColons(t);
  let out = t;
  if (/\s+-\s+/.test(out)) {
    const parts = out.split(/\s+-\s+/);
    if (parts.length >= 2) {
      const marker = out.match(/^([ㅇ○])/)?.[1] ?? "ㅇ";
      const title = parts[0].replace(/^[ㅇ○]\s+/, "").trim();
      const subs = parts.slice(1).map((part) => `- ${part.trim()}`);
      out = [`${marker} ${title}`, ...subs].join("\n");
    }
  }
  return formatCircleBulletColons(out);
}

export function splitCircleBullets(text: string): string[] {
  if (!text || !/[ㅇ○]\s/.test(text)) return [];
  return text
    .split(/(?=[ㅇ○]\s)/)
    .map((s) => s.trim())
    .filter((s) => /^[ㅇ○]\s/.test(s));
}

function isStemDisclaimerProse(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (/^\((단|다만|주|참고)[,，]/.test(t)) return true;
  if (/^\([^)]+\)$/.test(t) && t.length <= 200) return true;
  return false;
}

function parseExamMaterialBox(stem: string): { intro: string; bulletsProse: string | null; bullets: string[] } | null {
  if (!stem?.trim()) return null;
  const qIdx = stem.indexOf("?");
  if (qIdx < 0) return null;
  let intro = stem.slice(0, qIdx + 1).trim();
  const rest = stem.slice(qIdx + 1).trim();
  if (!rest) return null;
  const bulletStart = rest.search(/[ㅇ○]\s/);
  if (bulletStart < 0) return null;
  let prose = rest.slice(0, bulletStart).trim();
  if (prose && isStemDisclaimerProse(prose)) {
    intro = intro + (prose.startsWith("(") ? "" : " ") + prose;
    prose = "";
  }
  const bullets = splitCircleBullets(rest.slice(bulletStart).trim());
  if (!bullets.length) return null;
  if (!prose) return { intro, bulletsProse: null, bullets };
  if (prose.length < 10) return null;
  return { intro, bulletsProse: prose, bullets };
}

function isBulletContinuation(line: string): boolean {
  const trimmed = line.trim();
  return /^-\s/.test(trimmed) || /^·\s/.test(trimmed) || /^:\s/.test(trimmed);
}

function splitExamStem(stem: string): { intro: string; bullets: string[] | null; tail: string | null } {
  if (!stem || !/(^|\n)[ㅇ○]\s/.test(stem)) return { intro: stem || "", bullets: null, tail: null };
  const lines = stem.split("\n");
  const introLines: string[] = [];
  const bulletLines: string[] = [];
  const tailLines: string[] = [];
  let phase: "intro" | "bullets" | "tail" = "intro";
  for (const line of lines) {
    const trimmed = line.trim();
    if (phase === "intro" && /^[ㅇ○]\s/.test(trimmed)) phase = "bullets";
    if (phase === "intro") introLines.push(line);
    else if (phase === "bullets") {
      if (/^[ㅇ○]\s/.test(trimmed)) bulletLines.push(line);
      else if (trimmed === "") continue;
      else if (bulletLines.length > 0 && isBulletContinuation(line)) {
        bulletLines[bulletLines.length - 1] += `\n${trimmed}`;
      } else {
        phase = "tail";
        tailLines.push(line);
      }
    } else tailLines.push(line);
  }
  const bullets = bulletLines.flatMap((line) => splitCircleBullets(line));
  if (bullets.length === 0) return { intro: stem, bullets: null, tail: null };
  return {
    intro: introLines.join("\n").trim(),
    bullets,
    tail: tailLines.length ? tailLines.join("\n").trim() : null,
  };
}

function parseBogiOptionItems(text: string): BogiItem[] {
  if (!text?.trim()) return [];
  const matches = [...text.matchAll(/([a-f])\.\s*/gi)];
  if (!matches.length) return [];
  return matches.map((m, i) => {
    const start = (m.index ?? 0) + m[0].length;
    const end = i + 1 < matches.length ? (matches[i + 1].index ?? text.length) : text.length;
    return { key: m[1].toLowerCase(), text: text.slice(start, end).trim() };
  });
}

function parseKoreanLetterBogiItems(text: string): BogiItem[] {
  if (!text?.trim()) return [];
  const cleaned = text.replace(/^<보기>\s*/i, "").trim();
  const re = /(?:^|\s)([가-힣]):\s+/g;
  const matches = [...cleaned.matchAll(re)];
  if (matches.length < 2) return [];
  return matches.map((m, i) => {
    const start = (m.index ?? 0) + m[0].length;
    const end = i + 1 < matches.length ? (matches[i + 1].index ?? cleaned.length) : cleaned.length;
    return { key: m[1], text: cleaned.slice(start, end).trim() };
  });
}

function parseBogiStem(stem: string): RealestateStemParts["bogiBlock"] {
  if (!stem || !/<보기>/i.test(stem)) return null;
  const tailMatch = stem.match(/\s*<보기>\s*([a-f]\.[\s\S]+)$/i);
  if (!tailMatch || tailMatch.index == null) return null;
  const bogiItems = parseBogiOptionItems(tailMatch[1]);
  if (bogiItems.length < 2) return null;
  const head = stem.slice(0, tailMatch.index).trim();
  const qIdx = head.indexOf("?");
  if (qIdx < 0) return null;
  const intro = head.slice(0, qIdx + 1).trim();
  const fillSentence = head.slice(qIdx + 1).trim();
  if (!fillSentence || !/\(\s*[ㄱ-ㅎa-z]\s*\)/i.test(fillSentence)) return null;
  return { intro, fillSentence, bogiItems };
}

const KOREAN_BOGI_LIST_BLOCK_RE = /\s*<보기>\s*((?:[가-힣]:\s+)[\s\S]+)$/i;

function splitQuestionAndJamoColonDefs(head: string): { intro: string; jamoDefs: JamoDef[] | null } {
  const jamoDefs = parseInlineJamoColonDefinitions(head);
  if (!jamoDefs) return { intro: head, jamoDefs: null };
  const mark = head.match(/(?:^|\s)([ㄱ-ㅎ]):\s+/);
  const intro = mark?.index != null ? head.slice(0, mark.index).trim() : head;
  return { intro, jamoDefs };
}

function parseKoreanBogiStem(stem: string): RealestateStemParts["bogiBlock"] {
  if (!stem || !/<보기>/i.test(stem)) return null;
  const tagMatch = stem.match(KOREAN_BOGI_LIST_BLOCK_RE);
  if (!tagMatch || tagMatch.index == null) return null;
  const bogiItems = parseKoreanLetterBogiItems(`<보기> ${tagMatch[1].trim()}`);
  if (bogiItems.length < 2) return null;
  const head = stem.slice(0, tagMatch.index).trim();
  const { intro, jamoDefs } = splitQuestionAndJamoColonDefs(head);
  return { intro, jamoDefs, fillSentence: "", bogiItems };
}

function parseJamoFillSentenceStem(stem: string): { intro: string; fillSentence: string } | null {
  if (!stem?.trim()) return null;
  if (/<보기>/i.test(stem)) return null;
  if (/(^|\n)[ㅇ○]\s/.test(stem)) return null;
  const qIdx = stem.indexOf("?");
  if (qIdx < 0) return null;
  let intro = stem.slice(0, qIdx + 1).trim();
  let rest = stem.slice(qIdx + 1).trim();
  if (!rest || !INLINE_JAMO_BLANK.test(rest)) return null;
  const disclaimer = rest.match(/^\((단|다만|주|참고)[^)]*\)\s*/u);
  if (disclaimer) {
    intro = `${intro} ${disclaimer[0].trim()}`;
    rest = rest.slice(disclaimer[0].length).trim();
  }
  if (!rest || rest.length < 15 || !INLINE_JAMO_BLANK.test(rest)) return null;
  return { intro, fillSentence: rest };
}

function parseHousingMarketEquations(stem: string): { intro: string; embeddedBlock: string } | null {
  if (!stem || !/A주택시장:\s*Qd\s*=/i.test(stem)) return null;
  const m = stem.match(/^(.*?)(\s*A주택시장:\s*[\s\S]+)$/);
  if (!m) return null;
  const intro = m[1].trim();
  let eqBlock = m[2].trim();
  eqBlock = eqBlock.replace(/,\s*(Qs\s*=\s*[^,\n]+?)\s+(B주택시장:)/i, ", $1\n$2");
  return { intro, embeddedBlock: eqBlock };
}

const empty = (intro: string): RealestateStemParts => ({
  jamoDefs: null,
  embeddedBlock: null,
  intro,
  bullets: null,
  bulletsProse: null,
  tail: null,
  bogiBlock: null,
  jamoFillBlock: null,
});

export function prepareRealestateStem(stem: string): RealestateStemParts {
  const housingEq = parseHousingMarketEquations(stem);
  if (housingEq) {
    const { intro, bullets, tail } = splitExamStem(housingEq.intro);
    return {
      ...empty(intro),
      embeddedBlock: housingEq.embeddedBlock,
      bullets,
      tail,
    };
  }

  const bogiBlock = parseBogiStem(stem) ?? parseKoreanBogiStem(stem);
  if (bogiBlock) {
    return {
      ...empty(bogiBlock.intro),
      bogiBlock,
      jamoDefs: bogiBlock.jamoDefs ?? null,
    };
  }

  const materialBox = parseExamMaterialBox(stem);
  if (materialBox) {
    return {
      ...empty(materialBox.intro),
      bullets: materialBox.bullets,
      bulletsProse: materialBox.bulletsProse,
    };
  }

  const jamoFillBlock = parseJamoFillSentenceStem(stem);
  if (jamoFillBlock) return { ...empty(jamoFillBlock.intro), jamoFillBlock };

  const { intro: stemAfterDefs, jamoDefs } = parseJamoDefinitions(stem);
  const { intro: stemIntro, embeddedBlock } = parseEmbeddedAfterQuestion(stemAfterDefs);
  const { intro, bullets, tail } = splitExamStem(stemIntro);
  if (bullets?.length) {
    return { ...empty(intro), jamoDefs, embeddedBlock, bullets, tail };
  }

  const boxed = parseQuestionStem(stemIntro);
  if (boxed.boxLines.length > 0) {
    return { ...empty(boxed.intro), jamoDefs, embeddedBlock, bullets: boxed.boxLines };
  }

  return { ...empty(intro), jamoDefs, embeddedBlock, bullets, tail };
}

export function realestateStemHasBoxes(parts: RealestateStemParts): boolean {
  return Boolean(
    parts.jamoDefs?.length ||
      parts.embeddedBlock ||
      parts.bogiBlock ||
      parts.jamoFillBlock ||
      parts.bullets?.length ||
      parts.bulletsProse ||
      parts.tail,
  );
}
