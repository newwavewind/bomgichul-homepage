import { historyLibraryAccess, historyPreviewIds, isHistoryPreviewRecord } from "@/lib/history-library-access";
import type { Metadata } from "next";
import { getHistoryCatalogue, findHistoryRecord } from "@/lib/history-library";
import { libraryView } from "@/lib/history-library-model";
import { HistoryLibrary } from "@/components/history/library/HistoryLibrary";
import "@/components/history/library/history-library.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "한국사 사료 모음집·인물 사전", robots: { index: false, follow: true } };

type Props = { searchParams: Promise<{ view?: string | string[]; id?: string | string[] }> };
export default async function HistoryLibraryPage({ searchParams }: Props) {
  const { view: requestedView, id: requestedId } = await searchParams;
  const view = libraryView(requestedView);
  const id = typeof requestedId === "string" && requestedId.length <= 160 ? requestedId : undefined;
  const [access, full] = await Promise.all([historyLibraryAccess(), getHistoryCatalogue()]);
  const catalogue = access === "granted" ? full : {
    ...full,
    sources: full.sources.map(item => isHistoryPreviewRecord("sources", item.id) ? item : { ...item, clues: [] }),
    dynasties: full.dynasties.map(({ id, name, era, kind, span, aliases, supplementary }) =>
      ({ id, name, era, kind, span, aliases, supplementary, rulers: [], related: [], sources: [] })),
  };
  const selected = view === "dynasties" ? undefined : catalogue[view].find(item => item.id === id)
    ?? (access === "granted" || !id ? catalogue[view][0] : undefined);
  const initialRecord = view !== "dynasties" && selected && (access === "granted" || isHistoryPreviewRecord(view, selected.id))
    ? await findHistoryRecord(view, selected.id) : null;
  return <HistoryLibrary key={`${view}:${id ?? ""}:${access}`} catalogue={catalogue} access={access}
    previewIds={access === "granted" ? undefined : historyPreviewIds} initialView={view} initialRecord={initialRecord} initialId={id}/>;
}
