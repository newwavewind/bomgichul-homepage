/** 기출 셀 학습 꾸러미 안에서만 쓰는 작은 도구 — 앱마다 다른 파일에 기대지 않으려고 꾸러미에 둔다. */

const REVISED_MARK_RE = /\[개정(?:반영)?\]/

/** 해설을 [개정] 앞(시험 당시)과 뒤(지금)로 가른다. 표시가 없으면 null. */
export function splitRevised(text) {
  const s = String(text ?? '')
  const m = REVISED_MARK_RE.exec(s)
  if (!m) return null
  return {
    before: s.slice(0, m.index).replace(/[\s—–-]+$/, '').trim(),
    after: s.slice(m.index + m[0].length).trim(),
  }
}

export function loadJsonObject(key) {
  if (typeof localStorage === 'undefined') return {}
  try {
    const saved = localStorage.getItem(key)
    const parsed = saved ? JSON.parse(saved) : null
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

export function saveJson(key, value) {
  if (typeof localStorage === 'undefined') return false
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function BookmarkIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4-6 4Z" />
    </svg>
  )
}
