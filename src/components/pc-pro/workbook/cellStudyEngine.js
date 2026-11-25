/**
 * 기출 셀 학습 — 과목 자료를 장(章) 시트로 조립한다. 봄기출 모든 앱이 같은 파일을 쓴다.
 *
 * 과목 자료(src/data/cellStudy/<과목>.js)의 꼴:
 *   export default {
 *     subject: '형사법',
 *     groups: [{ title: '형법총론', chapters: [{ id: 'c01', title: '형법의 기본원리', topics: [
 *       { id: 'c01-s1', title: '죄형법정주의', side: false, rows: [
 *         ['비교 기준', ['셀 내용', '문항id#선지', …, { type: 'law', name: '형법', article: '제1조' }], ['셀 내용', '문항id#선지']],
 *       ] },
 *     ] }] }],
 *   }
 * 셀 = [내용, ...근거]. 문자열 근거는 기출 선지(「문항 id#선지 key」), 객체 근거는 조문·판례
 * ({type:'law', name, article} · {type:'case', number}), 셀 해설은 {type:'expl', text}.
 * side: true 인 소주제는 두 행이 서로 맞서는 갈래라 갈래를 열로 세워 나란히 본다(두 행의 칸 수가 같아야 한다).
 */

export const CHAPTER_COLUMNS = [
  { letter: 'B', label: '기출 판단 ①' },
  { letter: 'C', label: '기출 판단 ②' },
]
// 한 시트에 담는 소주제 수 — 넘기는 횟수는 줄이되 한 화면 스크롤이 지나치게 길어지지 않게
const TOPICS_PER_SHEET = 7
const ORDINALS = ['①', '②', '③', '④', '⑤']

function parseCell([value, ...refs]) {
  return {
    value,
    // 셀 해설 — { type: 'expl', text } 하나. 없으면 화면이 대표 선지 해설로 채운다
    explanation: refs.find(ref => ref?.type === 'expl')?.text,
    sources: refs.filter(ref => ref && typeof ref === 'object' && ref.type !== 'expl'),
    examRefs: refs.filter(ref => typeof ref === 'string').map(ref => {
      const at = ref.lastIndexOf('#')
      return [ref.slice(0, at), ref.slice(at + 1)]
    }),
  }
}

function chapterSheet(id, title, group, topics) {
  const rows = []
  let number = 2
  for (const topic of topics) {
    const side = topic.side && topic.rows.length === 2 && topic.rows[0].length === topic.rows[1].length
    rows.push({ kind: 'band', number: number++, topicId: topic.id, label: topic.title, headers: side ? topic.rows.map(row => row[0]) : null })
    if (side) {
      const width = topic.rows[0].length - 1
      for (let index = 0; index < width; index += 1) {
        rows.push({
          number: number++, topicId: topic.id, topicTitle: topic.title,
          gridLabel: ORDINALS[index] ?? String(index + 1), label: topic.title + ' ' + (ORDINALS[index] ?? index + 1),
          columnLabels: topic.rows.map(row => row[0]),
          cells: topic.rows.map(row => parseCell(row[index + 1])),
        })
      }
    } else {
      for (const [label, ...cells] of topic.rows) {
        rows.push({ number: number++, topicId: topic.id, topicTitle: topic.title, label, cells: cells.map(parseCell) })
      }
    }
  }
  return { id, title, group, unitId: id, chapter: true, columns: CHAPTER_COLUMNS, rows }
}

/** 과목 자료 → 화면에 넘길 시트 목록. 소주제가 하나뿐인 장은 같은 단원의 다음 장과 한 시트로 묶는다. */
export function buildCellSheets(data) {
  const sheets = []
  for (const group of data.groups) {
    const chapters = group.chapters.filter(chapter => chapter.topics?.length)
    const bundles = []
    for (const chapter of chapters) {
      const last = bundles[bundles.length - 1]
      if (last && last.topics.length === 1 && last.ids.length === 1) {
        last.ids.push(chapter.id); last.titles.push(chapter.title); last.topics.push(...chapter.topics)
      } else bundles.push({ ids: [chapter.id], titles: [chapter.title], topics: [...chapter.topics] })
    }
    for (const bundle of bundles) {
      const title = bundle.titles.join(' · ')
      const parts = Math.ceil(bundle.topics.length / TOPICS_PER_SHEET)
      const size = Math.ceil(bundle.topics.length / parts)
      for (let part = 0; part < parts; part += 1) {
        const id = parts > 1 ? bundle.ids[0] + '-' + (part + 1) : bundle.ids[0]
        sheets.push(chapterSheet(id, parts > 1 ? title + ' (' + (part + 1) + '/' + parts + ')' : title, group.title,
          bundle.topics.slice(part * size, (part + 1) * size)))
      }
    }
  }
  return sheets
}

export function cellExamItems(cell, examsById) {
  return cell.examRefs.flatMap(([id, key]) => {
    const exam = examsById.get(id)
    const item = exam?.items?.find(choice => String(choice.key) === String(key))
    return item ? [{ exam, item }] : []
  })
}

// 한글 음절의 받침 다루기 — 「적절한」→「적절하」, 「쓰이」→「쓰임」
const HANGUL = 0xac00
const jong = ch => (ch.charCodeAt(0) - HANGUL) % 28
const setJong = (ch, j) => String.fromCharCode(ch.charCodeAt(0) - jong(ch) + j)
const isHangul = ch => ch && ch.charCodeAt(0) >= HANGUL && ch.charCodeAt(0) <= 0xd7a3
const nominal = stem => {
  const last = stem.slice(-1)
  if (!isHangul(last)) return null
  if (jong(last) === 0) return stem.slice(0, -1) + setJong(last, 16) // ㅁ
  if (jong(last) === 8) return stem.slice(0, -1) + setJong(last, 10) // ㄹ → ㄻ(앎)
  return stem + '음'
}
// 관형형 낱말(적절한·옳은·맞는·쓰인) → 어간
const adnominalStem = word => {
  if (/[은는]$/.test(word) && word.length > 1) {
    const rest = word.slice(0, -1)
    // 「맞는·옳은·같은」은 받침 있는 어간, 「바른·쓰인」은 ㄴ 받침
    return rest
  }
  const last = word.slice(-1)
  if (isHangul(last) && jong(last) === 4) return word.slice(0, -1) + setJong(last, 0)
  return null
}

/**
 * 「밑줄 친 부분이 바르게 쓰이지 않은 것은?」 같은 물음에서 선지를 판단할 두 말을 뽑는다.
 * → { O: '바르게 쓰임', X: '바르게 쓰이지 않음', negative: true }. 뽑지 못하면 null.
 * 순서·조합을 고르는 물음(나열·배열·묶음)은 「맞음 / 틀림」.
 */
export function judgeLabels(question) {
  const text = String(question ?? '').split('\n')[0].replace(/\s*\([^()]*\)\s*$/u, '').replace(/[?？.]\s*$/u, '').trim()
  const m = /(?:^|\s)((?:\S+\s+){0,3}\S+)\s+것(?:은|으로|만)?\s*$/u.exec(text)
  if (!m) return null
  const words = m[1].split(/\s+/)
  let negative = false
  if (words.at(-1) === '않은' || words.at(-1) === '않는') {
    const before = words.at(-2)
    if (!before?.endsWith('지')) return null
    negative = true
    words.splice(-2, 2, before.slice(0, -1) + '은') // 「적절하지 않은」 → 「적절하은」 자리표(아래에서 어간만 쓴다)
  }
  let last = words.at(-1)
  const best = words.includes('가장')
  // 앞말은 바로 앞 한 낱말만, 「~으로·~로·~과·~와·~게」 꼴일 때만 붙인다(「때·중·대한·친」 같은 조각은 버린다)
  const prev = words.slice(0, -1).filter(word => word !== '가장').at(-1)
  const lead = prev && /(?:으로|로|과|와|게)$/.test(prev) && !/^것/.test(prev) ? prev + ' ' : ''
  const head = (best ? '가장 ' : '')
  if (/(?:나열|배열|묶|표시|연결|고른|짝)/.test(last)) return { O: '맞음', X: '틀림', negative }
  if (!negative && /(?:틀린|잘못된)$/.test(last)) return { O: '옳음', X: last === '틀린' ? '틀림' : '잘못됨', negative: true }
  if (/없[는은]$/.test(last)) {
    const verb = last.replace(/없[는은]$/, '')
    return { O: lead + verb + '있음', X: lead + verb + '없음', negative: true }
  }
  let base, pos
  if (negative) {
    base = last.slice(0, -1)
    pos = nominal(base)
  } else if (/운$/.test(last) && last.length > 1) {
    const prevCh = last.at(-2)
    if (!isHangul(prevCh) || jong(prevCh) !== 0) return null
    base = last.slice(0, -2) + setJong(prevCh, 17) // ㅂ 불규칙: 자연스러운 → 자연스럽
    pos = last.slice(0, -1) + '움'
  } else {
    base = adnominalStem(last)
    pos = base && nominal(base)
  }
  if (!base || !pos || pos.length < 2) return null
  const noun = /[^적]인$/.test(last) && !negative ? last.slice(0, -1) : null // 「표준어인」 → 「표준어 아님」
  const X = best ? '아님' : noun ? noun + ' 아님' : /있$/.test(base) ? lead + base.slice(0, -1) + '없음' : lead + base + '지 않음'
  return { O: lead + head + pos, X, negative }
}

/** 선지 하나를 O/X 로 풀 수 있는지, 정답 표시는 무엇인지 */
export function choicePractice({ exam, item }) {
  if (item.answer !== 'O' && item.answer !== 'X') return null
  if (exam.composite_layout === 'table' || /\[\s*(?:그림|그래프)|<\s*img\b|!\[/iu.test(String(exam.stem) + item.text)) return null
  const stem = String(exam.stem ?? '').replace(/\s*\([^()]*\)\s*$/u, '').trim()
  const isStatementQuestion = /(?:설명|내용|진술|정의|서술)\s*(?:로|으로|중)\s*(?:옳은|틀린|옳지\s*않은|잘못된)\s*것/u.test(stem)
  if (isStatementQuestion) return { format: 'ox', correctMark: item.answer }
  // 물음의 말로 판단 단추를 단다(「바르게 쓰임 / 바르게 쓰이지 않음」). 선지 answer 는 긍정 쪽의 참·거짓이다.
  const labels = exam.href?.startsWith('/exam/') ? null : judgeLabels(stem)
  if (labels && labels.negative === (exam.question_type === 'wrong')) {
    return { format: 'judge', correctMark: item.answer, labels: { O: labels.O, X: labels.X } }
  }
  // 단일 선택형의 '아닌 것은' 문항은 선지의 참·거짓과 고르는 방향이 반대다.
  const matchesQuestion = (item.answer === 'O') !== (exam.question_type === 'wrong')
  return { format: 'match', correctMark: matchesQuestion ? 'O' : 'X' }
}

export function sheetEntries(sheet, examsById) {
  return sheet.rows.flatMap((row, rowIndex) => row.kind === 'band' ? [] : row.cells.map((cell, columnIndex) => {
    const base = sheet.columns[columnIndex]
    const column = row.columnLabels ? { ...base, label: row.columnLabels[columnIndex] } : base
    return { sheet, row, column, rowIndex, columnIndex, cell, address: `${base.letter}${row.number}`, choices: cellExamItems(cell, examsById) }
  }))
}

export function cellRange(entries, first, last) {
  return entries.filter(entry => entry.rowIndex >= Math.min(first.rowIndex, last.rowIndex) &&
    entry.rowIndex <= Math.max(first.rowIndex, last.rowIndex) &&
    entry.columnIndex >= Math.min(first.columnIndex, last.columnIndex) &&
    entry.columnIndex <= Math.max(first.columnIndex, last.columnIndex))
}

const normalizeSearch = value => String(value).normalize('NFKC').toLowerCase().replace(/\s+/g, '')

export function cellSources(cell, choices) {
  return [...cell.sources, ...choices.flatMap(({ item }) => item.sources ?? [])]
}

export function searchCells(entries, query) {
  const tokens = query.trim().split(/\s+/).filter(Boolean).map(normalizeSearch)
  return entries.filter(({ sheet, row, column, address, cell, choices, terms }) => {
    const text = normalizeSearch([sheet.title, sheet.group, row.topicTitle, row.label, column.label, address, cell.value,
      ...(terms ?? []),
      ...choices.map(({ exam, item }) => `${exam.year}년 ${exam.question_no}번 ${item.text} ${item.explanation ?? ''}`),
      ...cellSources(cell, choices).map(source => source.number ?? `${source.name} ${source.article}`)].join(' '))
    return tokens.every(token => text.includes(token))
  })
}
