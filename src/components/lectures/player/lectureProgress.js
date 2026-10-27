/**
 * 칠판 수업 수강 진행 — 강의마다 장면별로 「어디까지 들었나」를 이 기기에 남긴다.
 * 들은 비율은 장면마다 가장 멀리 간 자리의 합 ÷ 전체 길이. 앞으로 건너뛴 구간도 들은 것으로 치지 않으려고
 * 재생 중 실제로 지나간 자리(직전 위치에서 몇 초 안쪽으로 이어진 것)만 늘린다.
 * 마지막 장면이 끝나면 완료로 친다. 목록 화면은 'chalk-lecture-progress' 알림으로 다시 그린다.
 */
const KEY = 'chalkLectureProgress'
const EVENT = 'chalk-lecture-progress'

function readAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {} } catch { return {} }
}
function writeAll(all) {
  try { localStorage.setItem(KEY, JSON.stringify(all)) } catch { /* 저장 못 해도 재생은 된다 */ }
  try { window.dispatchEvent(new Event(EVENT)) } catch { /* 무시 */ }
}

export function getLectureProgress(id) {
  return readAll()[id] || null
}

/** 장면 길이 배열을 받아 들은 비율(0~1) */
export function heardRatio(entry, lengths) {
  if (!entry) return 0
  if (entry.done) return 1
  const total = lengths.reduce((n, x) => n + x, 0)
  if (!total) return 0
  const heard = lengths.reduce((n, len, i) => n + Math.min(len, entry.scenes?.[i] || 0), 0)
  return Math.min(1, heard / total)
}

/**
 * 재생 중 위치를 남긴다. 직전 위치에서 5초 안쪽(2배속·1.5초 간격 기록 감안)으로 이어질 때만 「들은 자리」를 늘린다.
 * 이어 보기용 마지막 자리(scene·pos)는 늘 갱신한다.
 */
const lastWrite = new Map()
export function recordLecturePosition(id, scene, pos) {
  if (!id || !Number.isFinite(pos)) return
  // 재생 중 초당 여러 번 불린다 — 1.5초마다만 적는다(장면이 바뀌면 바로)
  const key = `${id}:${scene}`, now = Date.now()
  if (now - (lastWrite.get(key) || 0) < 1500) return
  lastWrite.set(key, now)
  const all = readAll()
  const entry = all[id] || { scenes: {}, done: false }
  const reached = entry.scenes[scene] || 0
  const continuous = entry.lastScene === scene && pos >= (entry.lastPos ?? 0) && pos - (entry.lastPos ?? 0) <= 5
  if (continuous && pos > reached) entry.scenes[scene] = Number(pos.toFixed(1))
  entry.lastScene = scene
  entry.lastPos = Number(pos.toFixed(1))
  entry.updatedAt = Date.now()
  all[id] = entry
  writeAll(all)
}

/**
 * 장면 하나를 끝까지 들었을 때 — 그 장면 길이만큼 채운다.
 * 마지막 장면이 끝나고 실제로 들은 비율이 90% 이상이면 완료(끝으로 건너뛰어 끝낸 것은 완료로 치지 않는다).
 */
export function finishLectureScene(id, scene, lengths, isLast) {
  if (!id) return
  const all = readAll()
  const entry = all[id] || { scenes: {}, done: false }
  const length = lengths[scene] || 0
  const reached = entry.scenes[scene] || 0
  // 장면 끝 무렵 몇 초 안에서 이어 들어 끝났을 때만 그 장면을 다 들은 것으로 친다
  if (entry.lastScene === scene && length - (entry.lastPos ?? 0) <= 6) entry.scenes[scene] = Math.max(reached, Number(length.toFixed(1)))
  if (isLast) {
    if (heardRatio({ ...entry, done: false }, lengths) >= 0.9) { entry.done = true; entry.doneAt = Date.now() }
    entry.lastScene = 0; entry.lastPos = 0
  } else { entry.lastScene = scene + 1; entry.lastPos = 0 }
  entry.updatedAt = Date.now()
  all[id] = entry
  writeAll(all)
}

export function resetLectureProgress(id) {
  const all = readAll()
  delete all[id]
  writeAll(all)
}

export function onLectureProgress(listener) {
  window.addEventListener(EVENT, listener)
  window.addEventListener('storage', listener)
  return () => { window.removeEventListener(EVENT, listener); window.removeEventListener('storage', listener) }
}
