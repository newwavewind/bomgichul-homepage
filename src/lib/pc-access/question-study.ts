import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { gunzip } from 'node:zlib';
import { getPcStudyCounts } from './study-context';
import type { GlossaryBook, PcGlossary, PcNotebook, StudyTrap } from './study';

const decompress = promisify(gunzip);

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

let contextualTraps: Promise<Record<string, Record<string, StudyTrap[]>>> | undefined;

export async function readPcQuestionTraps(scope: string, href: string): Promise<StudyTrap[]> {
  contextualTraps ??= readFile(path.join(process.cwd(), 'data', 'pc-pro-question-traps.json.gz'))
    .then(buffer => decompress(buffer))
    .then(buffer => JSON.parse(buffer.toString('utf8')))
    .catch(error => {
      contextualTraps = undefined;
      throw error;
    });
  const catalog = await contextualTraps;
  return catalog[scope]?.[href] ?? [];
}
