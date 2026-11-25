/**
 * 기출 셀 학습 — 시트 배경색·글자색 목록.
 *
 * 배경색은 색상(hue)과 채도만 정해 두고 밝은 화면·어두운 화면의 칸 색을 계산한다.
 * 그래서 어두운 화면에서도 글자가 읽히는 짝이 늘 함께 나온다.
 * 처음부터 있던 네 가지(초록·파랑·모래색·회색)는 CSS 에 손으로 맞춘 값을 그대로 쓴다.
 */

const hsl = (h, s, l) => `hsl(${h} ${Math.round(s)}% ${Math.round(l)}%)`

/** [값, 이름, 색상, 채도] — 채도 0 은 무채색 */
const PALETTE_SPECS = [
  ['green', '초록', 145, 38], ['mint', '민트', 160, 45], ['teal', '청록', 178, 45], ['aqua', '물빛', 192, 55],
  ['sky', '하늘', 202, 65], ['blue', '파랑', 210, 55], ['cobalt', '코발트', 222, 55], ['navy', '남색', 228, 40],
  ['indigo', '쪽빛', 240, 40], ['lavender', '라벤더', 255, 45], ['violet', '보라', 268, 40], ['plum', '자두', 285, 32],
  ['orchid', '난초', 300, 38], ['magenta', '자주', 318, 40], ['pink', '분홍', 335, 60], ['rose', '장미', 348, 55],
  ['coral', '산호', 8, 65], ['red', '빨강', 0, 50], ['brick', '벽돌', 12, 40], ['orange', '주황', 24, 70],
  ['apricot', '살구', 30, 75], ['peach', '복숭아', 18, 80], ['sand', '모래색', 36, 45], ['honey', '꿀', 40, 70],
  ['yellow', '노랑', 48, 80], ['butter', '버터', 52, 65], ['lime', '라임', 75, 50], ['olive', '올리브', 70, 28],
  ['moss', '이끼', 95, 25], ['leaf', '연두', 100, 45], ['forest', '숲', 135, 30], ['sage', '세이지', 120, 15],
  ['brown', '갈색', 25, 30], ['coffee', '커피', 28, 20], ['taupe', '토프', 30, 10], ['slate', '슬레이트', 215, 18],
  ['steel', '강철', 205, 14], ['gray', '회색', 215, 0], ['stone', '돌', 40, 6], ['ivory', '아이보리', 45, 40],
]

const HAND_TUNED = new Set(['green', 'blue', 'sand', 'gray'])

export const PALETTES = PALETTE_SPECS.map(([value, label, hue, sat]) => ({
  value, label, hue, sat,
  swatch: hsl(hue, sat * 0.9, sat === 0 ? 80 : 78),
}))

/** 배경색 값 → <main> 에 붙일 data-palette 와 style(계산한 색) */
export function paletteProps(value) {
  if (HAND_TUNED.has(value)) return { 'data-palette': value }
  const spec = PALETTES.find(item => item.value === value)
  if (!spec) return { 'data-palette': 'green' }
  const { hue: h, sat: s } = spec
  return {
    'data-palette': 'custom',
    style: {
      '--pl-surface': hsl(h, s * 0.55, 97.5), '--pl-heading': hsl(h, s * 0.6, 95),
      '--pl-ruler': hsl(h, s * 0.3, 93.5), '--pl-selection': hsl(h, s * 0.75, 90),
      '--pl-accent': hsl(h, Math.max(s, 8), 30), '--pl-line': hsl(h, s * 0.35, 84),
      '--pd-paper': hsl(h, s * 0.22, 14), '--pd-surface': hsl(h, s * 0.22, 11),
      '--pd-heading': hsl(h, s * 0.28, 19), '--pd-ruler': hsl(h, s * 0.24, 18),
      '--pd-selection': hsl(h, s * 0.38, 23), '--pd-accent': hsl(h, Math.max(s * 0.85, 10), 76),
      '--pd-line': hsl(h, s * 0.2, 33),
    },
  }
}

/** [값, 이름, 밝은 화면 색, 어두운 화면 색] — null 이면 시트 기본 글자색 */
export const INKS = [
  ['default', '기본', null, null],
  ['black', '검정', '#171717', '#f4f4f5'], ['charcoal', '먹색', '#33363b', '#e2e4e8'], ['gray', '회색', '#585f68', '#c4cad2'],
  ['navy', '남색', '#1c4472', '#b8d9f7'], ['blue', '파랑', '#1f5fb3', '#9cc8ff'], ['sky', '하늘', '#1f6f9c', '#a6dcf7'],
  ['teal', '청록', '#11655f', '#96e0d6'], ['green', '초록', '#1b6544', '#a4ddb9'], ['forest', '숲', '#25502d', '#b6dbbc'],
  ['olive', '올리브', '#55581f', '#d8d99a'], ['brown', '갈색', '#713522', '#f1ba9d'], ['coffee', '커피', '#5a3e2b', '#e2c4ab'],
  ['orange', '주황', '#a24a0b', '#ffbf8a'], ['red', '빨강', '#a3261f', '#ffaaa3'], ['wine', '와인', '#7a1f3d', '#f3a9c2'],
  ['magenta', '자주', '#8a1f72', '#f2a6e1'], ['violet', '보라', '#5a2c94', '#cdb2f6'], ['indigo', '쪽빛', '#33358f', '#b9bcf5'],
  ['plum', '자두', '#5c2d5c', '#e1bce1'],
].map(([value, label, light, dark]) => ({ value, label, light, dark }))

/** 글자색 값 → 표(<table>)에 붙일 data-ink 와 style */
export function inkProps(value) {
  const ink = INKS.find(item => item.value === value)
  if (!ink?.light) return { 'data-ink': 'default' }
  return { 'data-ink': 'custom', style: { '--ink-light': ink.light, '--ink-dark': ink.dark } }
}
