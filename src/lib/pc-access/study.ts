import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { gunzip } from 'node:zlib';
import manifest from '../../../data/pc-pro-study/manifest.json';
import type { PcStudyFeature } from './study-features';
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
const scopes: Readonly<Record<string, Partial<Record<PcStudyFeature, number>>>> = manifest.scopes;

export function getPcStudyCounts(scope: string) {
  return Object.hasOwn(scopes, scope) ? scopes[scope] : null;
}

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

export async function readPcNotebook(scope: string, href: string): Promise<PcNotebook | null> {
  if (!getPcStudyCounts(scope)) return null;
  const file = path.join(process.cwd(), 'data', 'pc-pro-notes', scope + '.json.gz');
  const compressed = await readFile(file).catch(error => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (!compressed) return null;
  const notes: Record<string, PcNotebook> = JSON.parse((await decompress(compressed)).toString('utf8'));
  return Object.hasOwn(notes, href) ? notes[href] : null;
}


export type GlossaryExample = { label: string; href: string; stem: string; choice: string; choiceLabel: string; explanation?: string; answer?: string };
export type GlossaryArticle = { title: string; lines: string[]; date?: string; url: string };
export type GlossaryTerm = {
  term: string; def: string; hanja?: string; point?: string;
  references?: { label: string; url: string }[];
  examples?: (GlossaryExample | null)[];
};
export type GlossaryExam = PocketOriginal & { correctKeys: string[] };
export type GlossaryRelated = { href: string; label: string; first?: GlossaryExam };
type GlossaryBook = {
  entries: Record<string, Record<string, GlossaryTerm[]>>;
  sources: Record<string, GlossaryArticle | null>;
  related: Record<string, GlossaryRelated[]>;
};
export type PcGlossary = Omit<GlossaryBook, 'entries'> & { terms: Record<string, GlossaryTerm[]> };

export async function readPcGlossary(scope: string, href: string): Promise<PcGlossary | null> {
  if (!getPcStudyCounts(scope)) return null;
  const file = path.join(process.cwd(), 'data', 'pc-pro-glossary', scope + '.json.gz');
  const compressed = await readFile(file).catch(error => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (!compressed) return null;
  const book: GlossaryBook = JSON.parse((await decompress(compressed)).toString('utf8'));
  const terms = book.entries[href];
  if (!terms) return null;
  const entries = Object.values(terms).flat();
  const urls = new Set(entries.flatMap(term => term.references?.map(reference => reference.url) ?? []));
  return {
    terms,
    sources: Object.fromEntries([...urls].map(url => [url, book.sources[url] ?? null])),
    related: Object.fromEntries(entries.flatMap(entry =>
      Object.hasOwn(book.related, entry.term) ? [[entry.term, book.related[entry.term]]] : [])),
  };
}


type GlossaryLabels = Record<string, string[]>;
let glossaryLabels: Promise<Record<string, GlossaryLabels>> | undefined;

export async function readPcGlossaryLabels(href: string): Promise<GlossaryLabels> {
  const file = path.join(process.cwd(), 'data', 'pc-pro-glossary', 'labels.json.gz');
  glossaryLabels ??= readFile(file)
    .then(buffer => decompress(buffer))
    .then(buffer => JSON.parse(buffer.toString('utf8')))
    .catch(error => {
      glossaryLabels = undefined;
      if (error.code === 'ENOENT') return {};
      throw error;
    });
  const catalog = await glossaryLabels;
  return Object.hasOwn(catalog, href) ? catalog[href] : {};
}
