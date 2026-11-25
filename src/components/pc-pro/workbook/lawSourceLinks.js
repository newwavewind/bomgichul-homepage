/**
 * 선지 해설의 근거(법령 조문·판례)를 화면 「근거」 칩 꼴 [{label, url}] 로 바꾼다.
 * 근거는 법제처 OPEN API 로 맞대 확인한 것이라(verifiedAt), 칩은 법제처 국가법령정보센터로 연다.
 *   law  {name:"민법", article:"제109조"} → 「민법 제109조」 · law.go.kr/법령/민법/제109조
 *   case {number:"92다7719"}            → 「대법원 92다7719」 · law.go.kr/판례/(92다7719)
 */
const enc = s => encodeURIComponent(String(s).trim())

export function lawSourceLinks(sources) {
  if (!Array.isArray(sources)) return []
  const out = []
  const seen = new Set()
  for (const s of sources) {
    if (!s) continue
    let label = ''
    let url = ''
    if (s.type === 'law' && s.name) {
      const art = String(s.article ?? '').trim()
      label = art ? `${s.name} ${art}` : s.name
      url = art ? `https://www.law.go.kr/법령/${enc(s.name)}/${enc(art)}` : `https://www.law.go.kr/법령/${enc(s.name)}`
    } else if (s.type === 'norm' && s.name) {
      // 어문 규범(한글 맞춤법·표준어 규정 등) — 국립국어원 어문 규범 누리집
      const art = String(s.article ?? '').trim()
      label = art ? `${s.name} ${art}` : s.name
      url = 'https://korean.go.kr/kornorms/main/main.do'
    } else if (s.type === 'case' && s.number) {
      const court = s.court || (/헌/.test(s.number) ? '헌법재판소' : '대법원')
      label = `${court} ${s.number}`
      url = `https://www.law.go.kr/판례/(${enc(s.number)})`
    }
    if (!label || seen.has(label)) continue
    seen.add(label)
    out.push({ label, url })
  }
  return out
}
