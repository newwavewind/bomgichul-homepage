import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { gunzip } from "node:zlib";
import { promisify } from "node:util";
import { hasPcPro } from "@/lib/pc-access/pro";
import { getPcViewer } from "@/lib/pc-access/session";
import type { HistoryCatalogue, HistoryPerson, HistorySource, RecordKind } from "./history-library-model";

const root = path.join(process.cwd(), "data/history-library");
const unzip = promisify(gunzip);
const historyOffer = "history-history";

export async function historyLibraryAccess() {
  try {
    const viewer = await getPcViewer();
    if (!viewer) return "login";
    return await hasPcPro(viewer.id, historyOffer, viewer.beta) ? "granted" : "connect";
  } catch {
    return "unavailable";
  }
}

async function readArchive<T>(name: string): Promise<T> {
  const archive = await readFile(path.join(root, name));
  return JSON.parse((await unzip(archive)).toString("utf8")) as T;
}

let catalogue: Promise<HistoryCatalogue> | undefined;
export function getHistoryCatalogue() {
  return catalogue ??= readArchive<HistoryCatalogue>("catalogue.json.gz").catch(error => {
    catalogue = undefined;
    throw error;
  });
}

let records: Promise<{ sources: Map<string, HistorySource>; people: Map<string, HistoryPerson> }> | undefined;
function getRecords() {
  return records ??= readArchive<{ sources: HistorySource[]; people: HistoryPerson[] }>("records.json.gz").then(value => ({
    sources: new Map(value.sources.map(item => [item.id, item])),
    people: new Map(value.people.map(item => [item.id, item])),
  })).catch(error => {
    records = undefined;
    throw error;
  });
}

export async function findHistoryRecord(kind: RecordKind, id: string) {
  return (await getRecords())[kind].get(id) ?? null;
}

const mediaTypes: Record<string, string> = {
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".svg": "image/svg+xml",
};

export async function readHistoryLibraryImage(file: string) {
  const type = mediaTypes[path.extname(file).toLowerCase()];
  if (!type || !/^[a-z0-9][a-z0-9_.-]+$/i.test(file)) return null;
  try {
    const bytes = await readFile(path.join(root, "media", file));
    return { bytes: new Uint8Array(bytes), type };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
