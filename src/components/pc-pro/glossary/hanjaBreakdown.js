/**
 * 용어 사전 한자 → 글자마다 뜻·음·부수·획수·급수 (경찰공무원 앱 hanjaDictionary.getTermHanjaBreakdown 과 같은 꼴).
 * 글자 자료 hanjaChars.json 은 한국사·국어 앱 한자 자료와 표준 자료로 모은 것: { 글자: { hun, eum, alt?, grade?, r?, rh?, s? } }.
 */
import hanjaChars from './hanjaChars.json'

const isHanjaChar = ch => /\p{Script=Han}/u.test(ch)

function readingsOf(entry) {
  if (!entry?.hun && !entry?.eum) return []
  return [{ meaning: entry.hun ?? '', sound: entry.eum ?? '' }, ...(entry.alt ?? []).map(a => ({ meaning: a.hun ?? '', sound: a.eum ?? '' }))]
}

export function getTermHanjaBreakdown(term, hanja) {
  const chars = [...String(hanja ?? '').replace(/\s/g, '')].filter(isHanjaChar)
  if (!chars.length) return []
  const sylls = [...String(term ?? '').replace(/[^가-힣]/g, '')]
  const aligned = chars.length === sylls.length
  return chars.map((char, index) => {
    const entry = hanjaChars[char]
    const readings = readingsOf(entry)
    const wordSound = aligned ? sylls[index] : null
    const primary = readings.find(item => item.sound === wordSound) || readings[0] || null
    const others = readings.filter(item => item !== primary)
    return {
      char,
      meaning: primary?.meaning || '',
      sound: primary?.sound || wordSound || '',
      radical: entry?.r || '',
      radicalName: entry?.rh || '',
      strokes: entry?.s ?? null,
      grade: entry?.grade || '',
      others,
      wordSound,
      wordSoundDiffers: Boolean(wordSound && readings.length && readings.every(item => item.sound !== wordSound)),
    }
  })
}
