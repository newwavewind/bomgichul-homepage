import cardsJson from "@/data/english/syntax.json";
import taxonomyJson from "@/data/english/syntax-taxonomy.json";

export interface EnglishSyntaxChunk { role: string; en: string; ko: string }
export interface EnglishSyntaxGrammar { point: string; detail: string; trap: string }
export interface EnglishSyntaxVocab { term: string; meaning: string; level?: string; kind?: string; otherMeanings?: string }
export interface EnglishSyntaxCard {
  id: string;
  questionId: string;
  year: number;
  questionNo: number;
  sentence: string;
  primaryTag: string;
  groupId: string;
  tags: string[];
  chunks: EnglishSyntaxChunk[];
  translation: string;
  grammar: EnglishSyntaxGrammar[];
  vocab?: EnglishSyntaxVocab[];
  note: string;
  no: number;
  focus?: string[];
  series: "national" | "local";
  seriesLabel: "국가직" | "지방직";
}

export interface EnglishSyntaxUnit { id: string; name: string; desc: string }
export interface EnglishSyntaxGroup { id: string; no: number; name: string; hint: string; units: EnglishSyntaxUnit[] }

export const ENGLISH_SYNTAX_CARDS = cardsJson as EnglishSyntaxCard[];
export const ENGLISH_SYNTAX_GROUPS = (taxonomyJson as { groups: EnglishSyntaxGroup[] }).groups;
export const ENGLISH_SYNTAX_UNIT_MAP = new Map(
  ENGLISH_SYNTAX_GROUPS.flatMap((group) => group.units.map((unit) => [unit.id, { group, unit }] as const)),
);

export function getEnglishSyntaxCard(id: string) {
  return ENGLISH_SYNTAX_CARDS.find((card) => card.id === id) ?? null;
}

export function getEnglishSyntaxQuestionHref(card: EnglishSyntaxCard) {
  return `/english/exam/gong9/${card.year}/${encodeURIComponent(card.seriesLabel)}/${card.questionNo}`;
}
