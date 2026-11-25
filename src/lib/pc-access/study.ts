import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { gunzip } from 'node:zlib';
import { getPcStudyCounts } from './study-context';
import type { DailyChoice, DailyQuestionPresentation } from '@/lib/daily-challenge/types';

export type StudySource = { label: string; url?: string };
export type StudyCell = {
  value: string; explanation?: string;
  sources: { type?: string; name?: string; article?: string; number?: string; label?: string; url?: string }[];
  examRefs: [string, string][];
};
export type StudySheet = { id: string; group: string; title: string; columns: { letter: string; label: string }[];
  rows: ({ kind: 'band'; label: string; number: number } | { kind?: 'row'; label: string; number: number; cells: StudyCell[] })[] };
export type CellExam = { id: string; href?: string; year: number; question_no: number; items: {key: string}[] };
export type PocketOriginal = {
  questionNo: number; stem: string; presentation: DailyQuestionPresentation; choices: DailyChoice[];
};
export type PocketQuestion = { id: string; text: string; explanation: string; answer: boolean; source: string; href?: string };
export type StudyChoice = PocketQuestion & { stem: string; mode: 'ox' | 'match' };
export type StudyTrap = { id: string; before: string; after: string; wrong: string; right: string; explanation: string; source: string; href?: string };
export type StudyLaw = { id: string; label: string; type: '조문' | '판례'; lines: string[]; blanks: { line: number; start: number; end: number; answer: string }[];
  date?: string; sourceUrl?: string; citations: number; sources: StudySource[] };
export type PcStudy = { cells: StudySheet[]; cellExams?: CellExam[]; choices: StudyChoice[]; traps: StudyTrap[]; law: StudyLaw[]; ox: PocketQuestion[]; originals?: Record<string, PocketOriginal>; audio: boolean };

const decompress = promisify(gunzip);
export async function readPcStudy(scope: string): Promise<PcStudy | null> {
  if (!getPcStudyCounts(scope)) return null;
  const file = path.join(process.cwd(), 'data', 'pc-pro-study', scope + '.json.gz');
  const compressed = await readFile(file);
  return JSON.parse((await decompress(compressed)).toString('utf8'));
}

export type PcNotebook = {
  sources?: StudySource[];
  intro: string;
  points: string[];
  contrast?: { title: string; left: { label: string; body: string }; right: { label: string; body: string } };
  insight?: string;
  pattern?: string;
  pitfall?: string;
  example?: string;
};

export type GlossaryExample = { label: string; href: string; stem: string; choice: string; choiceLabel: string; explanation?: string; answer?: string };
export type GlossaryArticle = { title: string; lines: string[]; date?: string; url: string };
export type GlossaryTerm = {
  term: string; def: string; hanja?: string; point?: string;
  references?: { label: string; url: string }[];
  examples?: (GlossaryExample | null)[];
};
export type GlossaryExam = PocketOriginal & { correctKeys: string[] };
export type GlossaryRelated = { href: string; label: string; first?: GlossaryExam };
export type GlossaryBook = {
  entries: Record<string, Record<string, GlossaryTerm[]>>;
  sources: Record<string, GlossaryArticle | null>;
  related: Record<string, GlossaryRelated[]>;
};
export type PcGlossary = Omit<GlossaryBook, 'entries'> & { terms: Record<string, GlossaryTerm[]> };
