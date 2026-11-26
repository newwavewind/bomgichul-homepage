import "server-only";
import preview from "../../data/history-library/preview.json";
import { hasPcPro } from "@/lib/pc-access/pro";
import { getPcViewer } from "@/lib/pc-access/session";
import type { RecordKind } from "./history-library-model";

const historyOffer = "history-history";
export const historyPreviewIds = { sources: preview.sources, people: preview.people };

export function isHistoryPreviewRecord(kind: RecordKind, id: string) {
  return historyPreviewIds[kind].includes(id);
}

export function isHistoryPreviewImage(file: string) {
  return preview.media.includes(file);
}

export async function historyLibraryAccess() {
  try {
    const viewer = await getPcViewer();
    if (!viewer) return "login";
    return await hasPcPro(viewer.id, historyOffer, viewer.beta) ? "granted" : "connect";
  } catch {
    return "unavailable";
  }
}

export type HistoryLibraryAccess = Awaited<ReturnType<typeof historyLibraryAccess>>;
