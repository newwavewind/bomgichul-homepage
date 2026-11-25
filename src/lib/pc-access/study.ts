import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { gunzip } from 'node:zlib';
import manifest from '../../../data/pc-pro-study/manifest.json';
import type { PcStudyFeature } from './study-features';

export type StudySource = { label: string; url?: string };
export type StudyCell = { text: string; notes: string[]; sources: StudySource[] };
export type StudySheet = { id: string; group: string; title: string; columns: string[];
  rows: { label: string; cells: StudyCell[] }[] };
export type PocketQuestion = { id: string; text: string; explanation: string; answer: boolean; source: string; href?: string };
export type StudyChoice = PocketQuestion & { stem: string; mode: 'ox' | 'match' };
export type StudyTrap = { id: string; before: string; after: string; wrong: string; right: string; explanation: string; source: string; href?: string };
export type StudyLaw = { id: string; label: string; type: '조문' | '판례'; lines: string[]; blanks: { line: number; start: number; end: number; answer: string }[];
  date?: string; sourceUrl?: string; citations: number; sources: StudySource[] };
export type PcStudy = { cells: StudySheet[]; choices: StudyChoice[]; traps: StudyTrap[]; law: StudyLaw[]; ox: PocketQuestion[]; audio: boolean };

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
