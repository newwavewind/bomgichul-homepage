import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { gunzip } from "node:zlib";
import type { SyntaxPracticeCard, WordDetail, WordRow } from "./english-study-types";

const root = path.join(process.cwd(), "data/english-study");
const unzip = promisify(gunzip);

async function readArchive<T>(name: string): Promise<T> {
  return JSON.parse((await unzip(await readFile(path.join(root, name)))).toString("utf8")) as T;
}

let syntax: Promise<SyntaxPracticeCard[]> | undefined;
let wordbook: Promise<{ rows: WordRow[]; details: Map<string, WordDetail> }> | undefined;

export function getSyntaxPractice() {
  return syntax ??= readArchive<SyntaxPracticeCard[]>("syntax-practice.json.gz").catch((error) => {
    syntax = undefined;
    throw error;
  });
}

export async function getSyntaxPracticeDay(day: number) {
  const cards = await getSyntaxPractice();
  const base = Math.floor(cards.length / 30);
  const extra = cards.length % 30;
  const start = (day - 1) * base + Math.min(day - 1, extra);
  return cards.slice(start, start + base + Number(day <= extra));
}

export async function findSyntaxPracticeCard(id: string) {
  const cards = await getSyntaxPractice();
  const index = cards.findIndex((card) => card.id === id);
  if (index < 0) return null;
  const base = Math.floor(cards.length / 30);
  const extra = cards.length % 30;
  const cutoff = extra * (base + 1);
  const day = index < cutoff ? Math.floor(index / (base + 1)) + 1 : extra + Math.floor((index - cutoff) / base) + 1;
  return { card: cards[index], day };
}

export function getEnglishWordbook() {
  return wordbook ??= readArchive<WordDetail[]>("wordbook.json.gz").then((words) => ({
    details: new Map(words.map((word) => [word.id, word])),
    rows: words.map(({ id, term, kind, level, count, day, meanings }) => ({ id, term, kind, level, count, day, meanings })),
  })).catch((error) => {
    wordbook = undefined;
    throw error;
  });
}
