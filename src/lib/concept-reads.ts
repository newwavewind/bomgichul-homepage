/** 개념 회독 진도 — 로그인 사용자별 localStorage */

export type ConceptReadProgress = Record<string, { reads: number; lastReadAt?: number }>;

const STORAGE_PREFIX = "bom_concept_reads_v1";

function storageKey(userId: string, subjectId: string) {
  return `${STORAGE_PREFIX}:${userId}:${subjectId || "unknown"}`;
}

export function loadConceptReads(
  userId: string | null | undefined,
  subjectId: string
): ConceptReadProgress {
  if (!userId || typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey(userId, subjectId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ConceptReadProgress;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveConceptReads(
  userId: string,
  subjectId: string,
  progress: ConceptReadProgress
) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(userId, subjectId), JSON.stringify(progress));
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
