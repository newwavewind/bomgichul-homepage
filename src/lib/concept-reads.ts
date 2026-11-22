/** 개념 회독 진도 — 로그인 사용자별 localStorage */

export type ConceptReadProgress = Record<string, { reads: number; lastReadAt?: number }>;

const STORAGE_PREFIX = "bom_concept_reads_v1";
const CONCEPT_READS_EVENT = "bom-concept-reads";
const EMPTY_PROGRESS = "{}";

function storageKey(userId: string, subjectId: string) {
  return `${STORAGE_PREFIX}:${userId}:${subjectId || "unknown"}`;
}

export function getConceptReadsSnapshot(userId: string | null | undefined, subjectId: string) {
  if (!userId || typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    return localStorage.getItem(storageKey(userId, subjectId)) ?? EMPTY_PROGRESS;
  } catch {
    return EMPTY_PROGRESS;
  }
}

export const getEmptyConceptReadsSnapshot = () => EMPTY_PROGRESS;

export function subscribeConceptReads(onChange: () => void) {
  window.addEventListener(CONCEPT_READS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  window.addEventListener("focus", onChange);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.removeEventListener(CONCEPT_READS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
    window.removeEventListener("focus", onChange);
    document.removeEventListener("visibilitychange", onChange);
  };
}

export function parseConceptReads(raw: string): ConceptReadProgress {
  try {
    const parsed = JSON.parse(raw) as ConceptReadProgress;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function loadConceptReads(userId: string | null | undefined, subjectId: string) {
  return parseConceptReads(getConceptReadsSnapshot(userId, subjectId));
}

function saveConceptReads(
  userId: string,
  subjectId: string,
  progress: ConceptReadProgress
) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(userId, subjectId), JSON.stringify(progress));
    window.dispatchEvent(new Event(CONCEPT_READS_EVENT));
  } catch {
    /* ignore */
  }
}

export function getConceptReadCount(progress: ConceptReadProgress, slug: string): number {
  const n = progress[slug]?.reads;
  return typeof n === "number" && n > 0 ? n : 0;
}

export function formatConceptReads(reads: number): string {
  return reads > 0 ? `${reads}회독` : "미학습";
}

export function countStudiedConcepts(
  progress: ConceptReadProgress,
  slugs: string[]
): number {
  return slugs.reduce((n, slug) => n + (getConceptReadCount(progress, slug) > 0 ? 1 : 0), 0);
}

export function incrementConceptRead(
  userId: string,
  subjectId: string,
  slug: string
): { progress: ConceptReadProgress; reads: number } {
  const progress = loadConceptReads(userId, subjectId);
  const reads = getConceptReadCount(progress, slug) + 1;
  progress[slug] = { reads, lastReadAt: Date.now() };
  saveConceptReads(userId, subjectId, progress);
  return { progress, reads };
}

export function resetConceptRead(
  userId: string,
  subjectId: string,
  slug: string
): ConceptReadProgress {
  const progress = loadConceptReads(userId, subjectId);
  if (progress[slug]) {
    delete progress[slug];
    saveConceptReads(userId, subjectId, progress);
  }
  return progress;
}
