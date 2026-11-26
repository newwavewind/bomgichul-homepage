export type LibraryView = "sources" | "people" | "dynasties";
export type RecordKind = "sources" | "people";
export type LibraryLink = { label: string; url: string };
export type ExamLink = { label: string; href: string };
type Captions = { title?: string; short?: string; body?: string };
export type Credit = { org?: string; author?: string; license?: string; version?: string; url?: string };
export type LibraryImage = { file: string; alt?: string; kind?: string; fit?: string; caption?: Captions; credit?: Credit };
type Original = { text?: string; from?: string; lang?: string; url?: string; credit?: Credit };
type Book = {
  title?: string; language?: string; url?: string; license?: string; terms?: string; history?: string;
  author?: string; revised?: string; facts?: Record<string, string>;
  sections?: { title: string; blocks: [string, string][] }[];
};
export type SourceSummary = { id: string; no: number; title: string; period: string; yearText: string; themes: string[]; clues: string[]; count: number };
export type PersonSummary = { id: string; name: string; hanja?: string; era: string; aliases: string[]; role?: string; lifespan?: string; period?: string; count: number };
export type HistorySource = Omit<SourceSummary, "count"> & {
  images: LibraryImage[]; plain?: string; context?: string; original?: Original; exams: ExamLink[]; links?: LibraryLink[];
};
export type HistoryPerson = Omit<PersonSummary, "count"> & {
  summary?: string; periodNote?: string; record?: Book; books: { aks?: Book; wiki?: Book }; exams: ExamLink[];
  sources: LibraryLink[]; relatedSources?: LibraryLink[]; saryoIds: string[]; saryoNotes?: Record<string, string>;
  reign?: string; family?: { label: string; name: string; id?: string }[];
  portrait?: { file: string; description?: string; credit?: string; generated?: boolean; caption?: string; license?: string; licenseUrl?: string; sourceUrl?: string; sourceLabel?: string; sourceNote?: string; relatedSource?: LibraryLink };
};
export type HistoryDynasty = {
  id: string; name: string; era: string; period?: string; note?: string; sources: LibraryLink[];
  rulers: { id: string; name: string; hanja?: string; period?: string; note?: string; personId: string | null }[];
};
export type HistoryCatalogue = {
  appCommit: string; periods: string[]; themes: string[]; dynastyEras: string[];
  sources: SourceSummary[]; people: PersonSummary[]; dynasties: HistoryDynasty[];
};
export type HistoryRecord = HistorySource | HistoryPerson;
export function libraryView(value: unknown): LibraryView {
  return value === "people" || value === "dynasties" ? value : "sources";
}
