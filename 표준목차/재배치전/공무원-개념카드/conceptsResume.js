const STORAGE_PREFIX = 'ox_concepts_resume_v1'

function storageKey(subjectId) {
  return `${STORAGE_PREFIX}:${subjectId || 'civillaw'}`
}

/** @param {string} subjectId */
export function loadConceptsResume(subjectId) {
  try {
    const raw = sessionStorage.getItem(storageKey(subjectId))
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * @param {string} subjectId
 * @param {{ scrollTop?: number, selectedSlug?: string | null, query?: string }} state
 */
export function persistConceptsResume(subjectId, state) {
  try {
    sessionStorage.setItem(
      storageKey(subjectId),
      JSON.stringify({ ...state, savedAt: Date.now() }),
    )
  } catch {
    /* ignore */
  }
}
