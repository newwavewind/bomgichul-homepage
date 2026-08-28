const STORAGE_PREFIX = 'ox_concept_progress_v1'

function storageKey(subjectId) {
  return `${STORAGE_PREFIX}:${subjectId || 'civillaw'}`
}

/** @param {string} subjectId */
export function loadConceptProgress(subjectId) {
  try {
    const raw = localStorage.getItem(storageKey(subjectId))
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

/** @param {string} subjectId @param {Record<string, { reads: number, lastReadAt?: number }>} progress */
export function saveConceptProgress(subjectId, progress) {
  try {
    localStorage.setItem(storageKey(subjectId), JSON.stringify(progress))
  } catch {
    /* ignore quota */
  }
}

/** @param {Record<string, { reads?: number }>} progress @param {string} slug */
export function getConceptReads(progress, slug) {
  const n = progress?.[slug]?.reads
  return typeof n === 'number' && n > 0 ? n : 0
}

/** @param {number} reads */
export function formatConceptReads(reads) {
  return reads > 0 ? `${reads}회독` : '미학습'
}

/**
 * @param {string} subjectId
 * @param {string} slug
 * @returns {{ progress: Record<string, { reads: number, lastReadAt: number }>, reads: number }}
 */
export function incrementConceptRead(subjectId, slug) {
  const progress = loadConceptProgress(subjectId)
  const prev = getConceptReads(progress, slug)
  const reads = prev + 1
  progress[slug] = { reads, lastReadAt: Date.now() }
  saveConceptProgress(subjectId, progress)
  return { progress, reads }
}

/**
 * @param {string} subjectId
 * @param {string} slug
 */
export function resetConceptRead(subjectId, slug) {
  const progress = loadConceptProgress(subjectId)
  if (progress[slug]) {
    delete progress[slug]
    saveConceptProgress(subjectId, progress)
  }
  return progress
}

/** @param {Record<string, { reads?: number }>} progress @param {string[]} slugs */
export function countStudiedConcepts(progress, slugs) {
  return slugs.reduce((n, slug) => n + (getConceptReads(progress, slug) > 0 ? 1 : 0), 0)
}
