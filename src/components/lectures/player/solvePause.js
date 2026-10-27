/**
 * 「잠시 멈추고 풀어 보세요」 쉬는 시간 — 표준 9장 1번(2026-10-26 사용자 지시로 단추 대신 말 + 무음).
 * 운전 중처럼 음성만 듣는 사람도 있어 재생을 멈추지 않는다. 마디(step)에 pauseForSolve 를 적으면
 *   - 렌더러가 그 마디 말 뒤에 무음을 음성 파일 자체에 넣는다(true 는 10초, 숫자는 그 초, 3~20초).
 *   - 다음 마디는 「자, 같이 풀어 볼까요?」처럼 다시 시작하는 말로 연다.
 *   - 화면은 쉬는 동안 남은 시간 막대만 보여 준다(누르지 않아도 된다. 넘기려면 탐색바로).
 * 쉬는 시간은 장면 길이 상한에서 빼고 센다.
 */
export const SOLVE_DEFAULT_SECONDS = 10
export const SOLVE_MIN_SECONDS = 3
export const SOLVE_MAX_SECONDS = 20
// 렌더러가 마디 말 뒤에 늘 두는 쉼 — 쉬는 시간은 이 뒤에 붙는다
export const STEP_GAP = 0.32

/** 이 마디 뒤에 쉬는 초. 표시가 없으면 0 */
export function solveSecondsOf(step) {
  const v = step?.pauseForSolve
  if (v === true) return SOLVE_DEFAULT_SECONDS
  if (typeof v === 'number' && Number.isFinite(v) && v > 0) return v
  return 0
}

/** 장면의 쉬는 시간 합(초) — 장면 길이 상한에서 뺀다 */
export const sceneSolveSeconds = scene => (scene?.steps ?? []).reduce((n, step) => n + solveSecondsOf(step), 0)

/**
 * 장면의 쉬는 구간들 [{ step, from, to }](초, 그 장면 음원 기준).
 * 음성을 만들 때 적은 cues 의 solve 칸이 있으면 그것을(재생 길이에 맞춰 scale), 없으면 다음 마디 시작에서 거꾸로 잰다.
 */
export function solveWindows(scene, starts, { cue, scale = 1, duration } = {}) {
  const steps = scene?.steps ?? []
  if (Array.isArray(cue?.solve) && cue.solve.length) return cue.solve.map(w => ({ step: w.step, from: w.from * scale, to: w.to * scale }))
  const out = []
  steps.forEach((step, j) => {
    const seconds = solveSecondsOf(step)
    if (!seconds) return
    const to = starts?.[j + 1] ?? (Number.isFinite(duration) && duration > 0 ? duration : null)
    if (!Number.isFinite(to)) return
    out.push({ step: j, from: Math.max(starts?.[j] ?? 0, to - seconds), to })
  })
  return out
}

/** 지금 쉬는 중이면 { step, from, to, left(남은 초), ratio(지난 비율) }, 아니면 null */
export function activeSolveWindow(windows, t) {
  if (!Number.isFinite(t)) return null
  const w = (windows ?? []).find(x => t >= x.from && t < x.to)
  if (!w) return null
  const total = Math.max(0.001, w.to - w.from)
  return { ...w, left: Math.max(0, w.to - t), ratio: Math.min(1, Math.max(0, (t - w.from) / total)) }
}
