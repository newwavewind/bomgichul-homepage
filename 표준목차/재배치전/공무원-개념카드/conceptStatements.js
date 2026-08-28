/**
 * 홈페이지 concept-statements.ts 이식 — 기출에서 학습용 옳은 지문 추출
 */

/** @typedef {import('./index.js').Concept} Concept */

/**
 * @typedef {Object} ConceptStatement
 * @property {string} text
 * @property {number} year
 * @property {number} questionNo
 * @property {string} [examId]
 * @property {string} [sourceCode] 국가직·지방직 구분
 * @property {boolean} [modified] 틀린 선지·짧은 O 선지를 해설로 고친 경우
 */

function normalizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim()
}

function normalizeKey(text) {
  return normalizeText(text).replace(/[·ㆍ\s]/g, '').toLowerCase()
}

export function isMeaningfulStatement(text) {
  const t = normalizeText(text)
  if (t.length < 10) return false
  if (/^\d+개$/.test(t)) return false
  if (/^[①②③④⑤⑥⑦⑧⑨⑩]$/.test(t)) return false
  if (/^(옳다|맞다|틀렸다|틀린\s*설명이다)\.?$/.test(t)) return false
  // 보기 기호(ㄱ·ㄴ·ㄷ)를 가리키는 말은 지문이 아니라 **채점하는 말**이다.
  // 한글 자모 뒤에 조사나 쌍점이 붙는 꼴은 보기를 가리킬 때뿐이라 정상 문장을 다치지 않는다.
  if (/[ㄱ-ㅎ]\s*(을|를|은|는|이|가|만|과|와|·|:|,)/.test(t)) return false
  if (/(적어 틀렸|그 자리에 들어갈|이 빠져 있다|만 옳은 것이 아니라|의 조합은 옳지)/.test(t)) return false
  return true
}

/** @param {Concept} concept */
export function buildConceptSearchTerms(concept) {
  const terms = new Set()

  const add = (raw) => {
    const t = String(raw || '').replace(/\s+/g, '').trim()
    if (t.length >= 4) terms.add(t)
  }

  for (const part of concept.titleKo.split(/[·()]/)) {
    add(part)
  }

  for (const point of concept.keyPoints || []) {
    for (const match of point.match(/[가-힣]{4,}/g) ?? []) {
      add(match)
    }
  }

  for (const match of pitfallsText(concept).match(/[가-힣]{4,}/g) ?? []) {
    add(match)
  }

  const sub = (concept.subcategory || '').replace(/\s+/g, '')
  if (sub.length >= 4) add(sub)

  return [...terms].sort((a, b) => b.length - a.length)
}


/** `pitfalls` 는 앱마다 문자열이거나 배열이다 — 어느 쪽이든 글로 펴서 돌려준다. */
function pitfallsText(concept) {
  const p = concept?.pitfalls
  if (!p) return ''
  if (typeof p === 'string') return p
  if (Array.isArray(p)) {
    return p.map((x) => (typeof x === 'string' ? x : Object.values(x || {}).join(' '))).join(' ')
  }
  return Object.values(p).join(' ')
}

/**
 * 지문을 **정렬하는 데만** 쓰는 관련도 점수. 거르는 데 쓰지 않는다.
 *
 * `buildConceptSearchTerms` 는 네 글자 이상만 담아 「착오」·「대리」 같은 짧은 핵심어를
 * 놓친다. 거르는 잣대라면 그 엄격함이 안전하지만, 순서를 매길 때는 놓치는 편이 손해다.
 * 그래서 두 글자까지 담되 **조사를 떼어** 「개설등록의」와 「개설등록」을 같은 말로 본다.
 */
export function statementRelevanceScore(text, concept) {
  const 흔한말 = new Set(['설명', '옳은', '틀린', '것은', '모두', '고른', '관한', '법령', '경우', '다음', '판례', '대한', '해당', '기준', '내용', '범위', '방법', '절차', '규정', '사항', '한다', '된다', '있다', '없다', '따라', '따른'])
  const 조사 = /(으로써|에게서|으로서|이라는|에서는|에게는|하는|되는|이며|이고|으로|에게|에서|이라|라고|까지|부터|마다|이나|한다|된다|이다|의|를|을|이|가|은|는|에|와|과|도|만|로)$/
  const 뿌리 = (w) => {
    let t = w
    for (let i = 0; i < 2; i += 1) {
      const m = t.match(조사)
      if (m && t.length - m[0].length >= 2) t = t.slice(0, t.length - m[0].length)
      else break
    }
    return t
  }

  const terms = new Set()
  const add = (raw) => {
    for (const m of String(raw || '').match(/[가-힣]{2,}/g) ?? []) {
      const r = 뿌리(m)
      if (r.length >= 2 && !흔한말.has(r)) terms.add(r.toLowerCase())
    }
  }
  add(concept.titleKo)
  add(concept.subcategory)
  for (const point of concept.keyPoints || []) add(point)
  add(pitfallsText(concept))
  if (!terms.size) return 0

  const norm = normalizeKey(text)
  let score = 0
  for (const t of terms) {
    if (norm.includes(t)) score += Math.min(t.length, 6)
  }
  return score
}

/**
 * 문항 하나가 이 개념에서 얼마나 가까운가 — 지문에 쓰던 잣대를 문항의 글 전체에 그대로 댄다.
 * 한 개념에 걸린 기출이 수십 개일 때 앞에 세울 몇을 고르는 데만 쓴다.
 *
 * @param {{ stem?: string, question?: string, items?: Array<{ text?: string }> }} question
 * @param {Concept} concept
 */
export function questionRelevanceScore(question, concept) {
  const 글 = [question?.stem || question?.question || '']
  for (const item of question?.items || []) 글.push(item?.text || '')
  return statementRelevanceScore(글.join(' '), concept)
}

/** @param {string} text @param {Concept} concept */
export function isStatementRelevantToConcept(text, concept) {
  // 표준 목차에서 온 자리는 그 절에 배정된 문항만 이미 보고 있다. 여기서 이름으로
  // 한 번 더 거르면, 절 이름과 낱말이 겹치지 않는 멀쩡한 지문까지 통째로 사라진다.
  // questionRefs 로 매인 카드를 그냥 통과시키는 것과 같은 이치다.
  if (concept.outline) return true
  if (concept.questionRefs?.length) return true

  const terms = buildConceptSearchTerms(concept)
  if (terms.length === 0) return true

  const norm = normalizeKey(text)
  return terms.some((term) => norm.includes(term.toLowerCase()))
}

/**
 * 채점만 하고 지식은 없는 문장인가.
 *
 * 해설은 「옳다.」·「ㄴ은 옳지만 ㄷ이 틀렸다.」로 운을 뗀 뒤 본론을 적는 일이 많다.
 * 그 머리를 그대로 두면 지문이 「옳다. …」로 시작해 읽는 사람에게 문항의 채점 결과를
 * 들려주는 꼴이 된다 — 카드 한 장으로 완결되는 글이 아니게 된다.
 */
function isVerdictOnlySentence(sentence) {
  const t = normalizeText(sentence).replace(/[.!?]+$/, '')
  if (!t || t.length > 44) return false
  if (/^(옳다|맞다|틀렸다|옳지\s*않다|틀린\s*설명이다|모두\s*옳다|넷\s*다\s*옳다|셋\s*다\s*옳다|둘\s*다\s*옳다)$/.test(t)) return true
  // 「ㄴ, ㄹ만 옳다」·「ㄱ은 맞지만 ㄴ·ㄷ이 어긋난다」처럼 보기 기호를 채점하는 머리말
  if (/[ㄱ-ㅎ]/.test(t) && /(옳|틀|맞|어긋|빠졌|해당)/.test(t)) return true
  return false
}

export function correctStatementFromExplanation(explanation, wrongText) {
  let e = normalizeText(explanation)
  if (!e) return null

  if (e.includes('→')) {
    const after = e.split('→').slice(1).join('→').trim()
    if (after.length >= 10) e = after
  }

  e = e
    .replace(/[''"][^''"]{2,}[''"](?:는|은)\s*틀린\s*설명이다\.?/g, '')
    .replace(/\s*즉,?\s+.+$/u, '')
    .replace(/\s*\([^)]*(?:판례|민법|조항|법령)[^)]*\)\.?/g, '')
    .replace(/\s*\(판례\)\.?/g, '')
    .trim()

  const sentences = e.match(/[^.!?]+[.!?]+/gu)
  if (sentences?.length) {
    // 채점만 하는 머리말은 건너뛴다 — 남는 것이 없으면 그때는 원래대로 첫 문장을 쓴다
    const 알맹이 = sentences.filter((s) => !isVerdictOnlySentence(s))
    const 고른것 = 알맹이.length ? 알맹이 : sentences
    e = 고른것[0].trim()
    if (e.length < 20 && 고른것[1]) {
      e = `${고른것[0].trim()} ${고른것[1].trim()}`
    }
  }

  if (e && !/[.!?]$/.test(e)) e += '.'

  if (isMeaningfulStatement(e)) return normalizeText(e)

  if (wrongText) {
    const fragment = normalizeText(explanation).replace(/[.。]$/, '')
    if (fragment.length >= 2 && fragment.length <= 40) {
      const dateLike = fragment.match(/\d+월\s*\d+일/)
      const wrongDate = wrongText.match(/\d+월\s*\d+일/)
      if (dateLike && wrongDate && dateLike[0] !== wrongDate[0]) {
        const flipped = normalizeText(wrongText).replace(wrongDate[0], dateLike[0])
        if (isMeaningfulStatement(flipped) && flipped !== normalizeText(wrongText)) {
          return flipped
        }
      }
    }
  }

  return null
}

/**
 * @returns {{ text: string, modified: boolean } | null}
 */
function statementTextFromItem(item) {
  if (item.answer === 'O') {
    const text = normalizeText(item.text)
    if (text.length < 25) {
      const fromExpl = correctStatementFromExplanation(item.explanation, item.text)
      if (fromExpl && fromExpl.length >= 25) {
        return { text: fromExpl, modified: fromExpl !== text }
      }
    }
    return isMeaningfulStatement(text) ? { text, modified: false } : null
  }

  const corrected = correctStatementFromExplanation(item.explanation, item.text)
  if (!corrected || corrected.length < 25) return null
  return { text: corrected, modified: true }
}

/**
 * @param {Array<{ year: number, question_no?: number, questionNo?: number, id?: string, items?: Array<{ answer?: string, text?: string, explanation?: string }> }>} questions
 * @param {Concept} concept
 * @returns {ConceptStatement[]}
 */
export function extractStatementsFromQuestions(questions, concept) {
  /** @type {Map<string, ConceptStatement>} */
  const correct = new Map()

  for (const q of questions) {
    for (const item of q.items || []) {
      const extracted = statementTextFromItem(item)
      if (!extracted) continue
      const { text, modified } = extracted
      if (
        !isStatementRelevantToConcept(item.text || '', concept) &&
        !isStatementRelevantToConcept(text, concept)
      ) {
        continue
      }

      const key = normalizeKey(text)
      if (correct.has(key)) continue

      const questionNo = q.question_no ?? q.questionNo ?? 0
      correct.set(key, {
        text,
        year: q.year,
        questionNo,
        examId: q.id,
        sourceCode: q.source_code ?? q.sourceCode,
        modified: Boolean(modified),
      })
    }
  }

  const 점수 = new Map()
  for (const s of correct.values()) 점수.set(s, statementRelevanceScore(s.text, concept))
  return [...correct.values()].sort(
    (a, b) => 점수.get(b) - 점수.get(a) || b.year - a.year || a.questionNo - b.questionNo,
  )
}

/**
 * 화면에 얹을 지문을 고른다. 들어오는 배열은 이미 관련도가 깊은 것부터 서 있으므로
 * 앞에서부터 담기만 하면 1번이 가장 가깝고 뒤로 갈수록 멀어진다.
 *
 * 다만 「옳은 지문 모음」이라 이름 붙은 칸이 고쳐 쓴 문장으로 뒤덮이면 이름값을 못 한다.
 * 그래서 `modified` 딱지가 붙은 것은 다섯까지만 받고 나머지는 미뤄 둔다. 원문 그대로인
 * 지문이 그만큼 없어 자리가 남으면 그때는 미룬 것으로 마저 채운다 — 비율을 지키자고
 * 빈자리를 남기지는 않는다. 채운 뒤에는 원래의 관련도 순서로 다시 세운다.
 *
 * 열 자리를 채우지 못하면 못한 대로 둔다. 먼 지문을 억지로 끌어와 앉히지 않는다.
 *
 * @param {ConceptStatement[]} statements 관련도순으로 정렬된 지문
 * @param {number} 상한
 * @param {number} 수정상한
 */
export function pickConceptStatements(statements, 상한 = 10, 수정상한 = 5) {
  const 고른것 = []
  const 미룬것 = []
  let 수정수 = 0

  for (const s of statements) {
    if (고른것.length >= 상한) break
    if (s.modified) {
      if (수정수 >= 수정상한) {
        미룬것.push(s)
        continue
      }
      수정수 += 1
    }
    고른것.push(s)
  }

  for (const s of 미룬것) {
    if (고른것.length >= 상한) break
    고른것.push(s)
  }

  const 순서 = new Map(statements.map((s, i) => [s, i]))
  return 고른것.sort((a, b) => 순서.get(a) - 순서.get(b))
}

/**
 * @param {Concept} concept
 * @param {unknown[]} exams
 * @param {(concept: Concept, exams: unknown[]) => unknown[]} getQuestions
 */
export function getConceptStatements(concept, exams, getQuestions) {
  const questions = getQuestions(concept, exams)
  return extractStatementsFromQuestions(questions, concept)
}
