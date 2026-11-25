import { useId, useState } from 'react'
import { examLabel } from './cellStudyAdapter'
import { cellSources, choicePractice } from './cellStudyEngine'
import { BookmarkIcon, splitRevised } from './kitUtils'
import { lawSourceLinks } from './lawSourceLinks'

const detailPaths = {
  up: 'm5 12 5-5 5 5',
  down: 'm5 8 5 5 5-5',
  right: 'M4 10h11m-4-4 4 4-4 4',
  external: 'M6 14l8-8M7 6h7v7',
  calendar: 'M4 6h12v10H4z M4 9h12 M7 4v4m6-4v4',
  o: 'M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z',
  x: 'm5.5 5.5 9 9m0-9-9 9',
  check: 'm4.5 10 3.5 3.5 7.5-7.5',
}

function DetailIcon({ name }) {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none"
    stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
    <path d={detailPaths[name]} />
  </svg>
}

function References({ sources, readings = [] }) {
  const links = lawSourceLinks(sources)
  if (!links.length && !readings.length) return null
  return (
    <div className="civil-sheet-references">
      {links.concat(readings).map(({ label, url }) => (
        url ? <a key={label} href={url} target="_blank" rel="noreferrer">{label}<DetailIcon name="external" /></a>
          : <span key={label}>{label}</span>
      ))}
    </div>
  )
}

export function choiceLabel({ exam, item }) {
  const question = examLabel(exam)
  return item ? `${question} ${item.label || item.key}` : question
}

export function choiceKey({ exam, item }) {
  return `${exam.id}:${item.key}`
}

/** 문항 자료의 밑줄 자리([[시작, 끝]])를 <u> 로 그린다 */
function Underlined({ text, ranges }) {
  const value = String(text ?? '')
  const spans = (ranges ?? []).filter(([a, b]) => a >= 0 && b > a && b <= value.length).sort((x, y) => x[0] - y[0])
  if (!spans.length) return value
  const out = []
  let at = 0
  spans.forEach(([a, b], index) => {
    if (a < at) return
    if (a > at) out.push(value.slice(at, a))
    out.push(<u key={index} className="civil-sheet-underline">{value.slice(a, b)}</u>)
    at = b
  })
  if (at < value.length) out.push(value.slice(at))
  return out
}

// 「__밑줄__」 표시(자료 줄)를 밑줄로
function MarkedLine({ text }) {
  return String(text ?? '').split(/__(.+?)__/g).map((part, index) =>
    index % 2 ? <u key={index} className="civil-sheet-underline">{part}</u> : part)
}

function SimpleTable({ headers, rows }) {
  return (
    <div className="civil-sheet-passage-table"><table>
      {headers?.length > 0 && <thead><tr>{headers.map((cell, index) => <th key={index}>{cell}</th>)}</tr></thead>}
      <tbody>{(rows ?? []).map((row, r) => <tr key={r}>{(Array.isArray(row) ? row : [row]).map((cell, c) => <td key={c}>{cell}</td>)}</tr>)}</tbody>
    </table></div>
  )
}

/**
 * 문항의 지문·보기 상자·표·그림 — 앱마다 칸 이름이 달라 모두 읽는다.
 * 원본 그림(figure·passageImage·material.image)이 있으면 그림(밑줄·기호가 그대로 보인다)을 먼저 쓰고,
 * 그림이 자료를 대신하는 문항(figure_first)은 글 상자를 겹쳐 내지 않는다.
 */
export function hasPassage(exam) {
  return Boolean(exam.figure || exam.passageImage || exam.material?.image || exam.passageText || exam.passage
    || exam.material_lines?.length || exam.material_content?.length || (typeof exam.material === 'string' && exam.material.trim())
    || exam.table?.rows?.length)
}

function Passage({ exam }) {
  const image = exam.passageImage || exam.material?.image || exam.figure
  const parts = []
  if (image) parts.push(<img key="img" className="civil-sheet-passage-image" src={image} alt={exam.figure_alt || '지문 원본'} loading="lazy" />)
  const imageCovers = Boolean(exam.passageImage || exam.material?.image || (exam.figure && exam.figure_first))
  if (!imageCovers) {
    if (exam.material_content?.length) {
      exam.material_content.forEach((block, index) => {
        if (block?.t === 'table') parts.push(<SimpleTable key={'mc' + index} rows={block.rows} />)
        else if (block?.text) parts.push(<p key={'mc' + index} className="civil-sheet-passage"><MarkedLine text={block.text} /></p>)
      })
    } else if (exam.material_lines?.length) {
      parts.push(<p key="ml" className="civil-sheet-passage">{exam.material_lines.map((line, index) =>
        <span key={index}>{index > 0 && '\n'}<MarkedLine text={line} /></span>)}</p>)
    } else if (typeof exam.material === 'string' && exam.material.trim()) {
      parts.push(<p key="m" className="civil-sheet-passage"><MarkedLine text={exam.material} /></p>)
    }
    const text = exam.passageText || exam.passage
    if (text && !exam.passageImage) parts.push(<p key="pt" className="civil-sheet-passage"><MarkedLine text={text} /></p>)
    if (exam.table?.rows?.length) parts.push(<SimpleTable key="tb" headers={exam.table.headers} rows={exam.table.rows} />)
  }
  return parts
}

const oxLabels = { O: 'O', X: 'X' }
const matchLabels = { O: '해당함', X: '해당 없음' }

function ExamChoice({ choice, onOpenItem, onRecordChoice, revision, compact = false }) {
  const { exam, item } = choice
  const [answer, setAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const explanationId = useId()
  const terms = item.terms ?? []
  const fix = item.fix
  const comparison = revision?.before && revision.after && revision.reference?.[0] === exam.id && revision.reference[1] === item.key
    ? revision : null
  const revised = comparison ?? splitRevised(item.explanation)
  const reveal = showExplanation || answer !== null
  const practice = choicePractice(choice)
  // 물음에서 뽑은 말(「바르게 쓰임 / 바르게 쓰이지 않음」)이 있으면 그 말로, 아니면 해당함·O/X
  const isMatch = practice?.format === 'match' || practice?.format === 'judge'
  const labels = practice?.labels ?? (practice?.format === 'match' ? matchLabels : oxLabels)
  const isCorrect = answer === practice?.correctMark

  return (
    <article className="civil-sheet-choice" data-compact={compact}>
      <div className="civil-sheet-choice-header">
        <span>{choiceLabel(choice)}</span>
        {revised && <span>개정 전 출제</span>}
      </div>
      <p className="civil-sheet-stem"><Underlined text={exam.stem} ranges={exam.underlines} /></p>
      {hasPassage(exam) && (compact
        ? <details className="civil-sheet-passage-fold"><summary>지문 보기</summary><Passage exam={exam} /></details>
        : <Passage exam={exam} />)}
      <blockquote><Underlined text={item.text} ranges={item.underlines} /></blockquote>
      <div className="civil-sheet-choice-actions">
        {practice && <div className="civil-sheet-ox" data-format={practice.format} role="group"
          aria-label={practice.format === 'judge' ? '물음에 비추어 이 선지를 판단' : isMatch ? '문제에서 고르라고 한 항목에 해당하는지 판단' : '선지 O/X'}>
          {Object.entries(labels).map(([mark, label]) => {
            const selected = answer === mark
            const correct = answer !== null && practice.correctMark === mark
            const resultIcon = correct ? 'check' : selected ? 'x' : null
            return (
              <button key={mark} type="button" aria-label={isMatch ? undefined : `${label} 선택`} aria-pressed={selected}
                data-mark={mark} data-correct={correct} disabled={answer !== null} onClick={() => {
                  setAnswer(mark)
                  onRecordChoice(choice, mark !== practice.correctMark)
                }}>
                {isMatch ? <>{resultIcon && <DetailIcon name={resultIcon} />}{label}</>
                  : <DetailIcon name={mark.toLowerCase()} />}
              </button>
            )
          })}
        </div>}
        <div className="civil-sheet-choice-links">
          <button type="button" aria-expanded={reveal} aria-controls={reveal ? explanationId : undefined} onClick={() => {
            if (reveal) { setAnswer(null); setShowExplanation(false) }
            else setShowExplanation(true)
          }}>{reveal ? '해설 접기' : '선지 해설 보기'}<DetailIcon name={reveal ? 'up' : 'down'} /></button>
          {onOpenItem && exam.href && <button type="button" onClick={() => onOpenItem(choice)}>전체 문항<DetailIcon name="right" /></button>}
        </div>
      </div>
      {reveal && (
        <div className="civil-sheet-answer-body" id={explanationId}>
          {practice && <p role="status" className="civil-sheet-answer" data-correct={answer == null || isCorrect}>
            {answer !== null && (isCorrect ? '맞았어요 · ' : '다시 확인해 보세요 · ')}
            정답 {labels[practice.correctMark]}
            {revised && ' · 시험 당시 기준'}
          </p>}
          {comparison ? (
            <dl className="civil-sheet-law-comparison">
              <div><dt>시험 당시 <small>{exam.year}년</small></dt><dd>{comparison.before}</dd></div>
              <div><dt>개정 후 <small>{revisionTiming(comparison)}</small></dt><dd>{comparison.after}</dd></div>
            </dl>
          ) : revised ? (
            <dl className="civil-sheet-pairs"><dt>시험 당시</dt><dd>{revised.before}</dd><dt>개정 후</dt><dd>{revised.after}</dd></dl>
          ) : <p>{item.explanation}</p>}
          {fix && !comparison && <dl className="civil-sheet-pairs"><dt>함정 문장</dt><dd>{fix[0]}</dd><dt>바르게</dt><dd>{fix[1]}</dd></dl>}
          {comparison ? <References readings={comparison.readings} /> : <References sources={item.sources} />}
          {terms.length > 0 && (
            <details className="civil-sheet-terms">
              <summary>용어 사전</summary>
              <dl>{terms.map(({ term, hanja, def }) => (
                <div key={term}><dt>{term}{hanja && <span className="civil-sheet-hanja" lang="ko-Hani">({hanja})</span>}</dt><dd>{def}</dd></div>
              ))}</dl>
            </details>
          )}
        </div>
      )}
    </article>
  )
}

function revisionTiming({ effectiveDate }) {
  return effectiveDate.endsWith('.') ? `${effectiveDate} 시행` : effectiveDate
}

function Revision({ revision }) {
  if (!revision) return null
  return (
    <details className="civil-sheet-revision">
      <summary>개정 반영 · {revision.effectiveDate} 시행</summary>
      <dl className="civil-sheet-pairs"><dt>시험 당시</dt><dd>{revision.before}</dd><dt>개정 후</dt><dd>{revision.after}</dd></dl>
      <a href={revision.url} target="_blank" rel="noreferrer">개정 조문과 부칙 보기</a>
    </details>
  )
}

function TopicExams({ exams, onOpenItem }) {
  return (
    <details className="civil-sheet-terms">
      <summary>이 시트의 기출 문항 {exams.length}개</summary>
      <ul className="civil-sheet-results civil-sheet-topic-exams">
        {exams.filter(exam => exam.href).map(exam => <li key={exam.id}>
          <button type="button" onClick={() => onOpenItem({ exam })}>
            <strong>{choiceLabel({ exam })}</strong>
            <small>{exam.stem.replace(/\s+/g, ' ')}</small>
          </button>
        </li>)}
      </ul>
    </details>
  )
}

/** 근거 선지가 학습권 밖일 때 — 몇 년도 기출인지 밝히고 결제 창으로 잇는다 */
function LockedChoice({ refs, onOpenPremium }) {
  const years = [...new Set((refs ?? []).map(([id]) => /-((?:19|20)\d{2})(?:-|$)/.exec(id)?.[1]).filter(Boolean))]
    .sort((a, b) => b - a)
  const label = years.length ? years.map(year => year + '년').join('·') + ' 기출' : '이 기출'
  return (
    <div className="civil-sheet-locked">
      <p>{label} 선지는 학습권으로 열 수 있어요.</p>
      {onOpenPremium && <button type="button" className="civil-sheet-locked-open"
        onClick={() => onOpenPremium(years[0] ?? 'locked-exams')}>학습권 보기</button>}
    </div>
  )
}

export default function CellStudyDetails({ entry, personal, onPersonalChange, onRecordChoice, onOpenItem, onOpenPremium, onClose }) {
  const [year, setYear] = useState('all')
  const { cell, choices, sheet } = entry
  const head = choices[0]
  const headKey = head && choiceKey(head)
  const archive = choices.filter(choice => choiceKey(choice) !== headKey)
    .sort((a, b) => b.exam.year - a.exam.year || a.exam.question_no - b.exam.question_no)
  const years = [...new Set(archive.map(({ exam }) => exam.year))]
  const summary = cell.value
  const explanation = cell.explanation ?? head?.item.explanation
  const revised = splitRevised(explanation)
  const currentLaw = cell.revision?.readings ? cell.revision : null
  const sources = currentLaw ? cell.sources : cellSources(cell, choices)

  return (
    <section className="civil-sheet-detail" aria-labelledby="civil-sheet-selection">
      <div className="civil-sheet-detail-title">
        <span className="civil-sheet-address" aria-hidden="true">{entry.address}</span>
        <h3 id="civil-sheet-selection">{entry.row.label} · {entry.column.label}</h3>
        <div className="civil-sheet-detail-tools">
          <button type="button" className="civil-sheet-learned" aria-pressed={Boolean(personal.learned)}
            title={personal.learned ? '외움 표시 지우기' : '이 셀을 외웠다고 표시'}
            onClick={() => onPersonalChange({ learned: !personal.learned })}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4 6.6 11.3 12.5 4.9" /></svg>
            외움
          </button>
          <button type="button" aria-label="북마크" title={personal.bookmarked ? '북마크 해제' : '북마크'}
            aria-pressed={Boolean(personal.bookmarked)} onClick={() => onPersonalChange({ bookmarked: !personal.bookmarked })}><BookmarkIcon /></button>
          <button type="button" aria-label="닫기" title="닫기" onClick={onClose}><DetailIcon name="x" /></button>
        </div>
      </div>
      <div className="civil-sheet-explanation">
        <h4>{currentLaw ? '현행 기준' : '핵심 해설'}
          {currentLaw?.effectiveDate && <> <small className="civil-sheet-law-date">{revisionTiming(currentLaw)}</small></>}
        </h4>
        <div className="civil-sheet-explanation-body">
          <p>{summary}</p>
          {revised ? <dl className="civil-sheet-pairs"><dt>시험 당시</dt><dd>{revised.before}</dd><dt>개정 후</dt><dd>{revised.after}</dd></dl>
            : explanation && <p>{explanation}</p>}
          <References sources={sources} readings={cell.readings} />
        </div>
        {!currentLaw && <Revision revision={cell.revision} />}
      </div>
      <div className="civil-sheet-exams">
        {head ? <>
          <h4>대표 기출 선지</h4>
          <ExamChoice key={headKey} choice={head} onOpenItem={onOpenItem} onRecordChoice={onRecordChoice} revision={currentLaw} />
        </> : <>
          {cell.restrictedChoice || cell.examRefs?.length
            ? <LockedChoice refs={cell.examRefs} onOpenPremium={onOpenPremium} />
            : <p>이 셀에 직접 연결된 기출 선지가 없어요.</p>}
          {(entry.row.relatedExams ?? sheet.relatedExams)?.some(exam => exam.href) && onOpenItem &&
            <TopicExams exams={entry.row.relatedExams ?? sheet.relatedExams} onOpenItem={onOpenItem} />}
        </>}
        {archive.length > 0 && (
          <details className="civil-sheet-terms civil-sheet-archive">
            <summary>연도별 기출 {archive.length}개</summary>
            <label className="civil-sheet-year civil-sheet-exam-year">출제 연도
              <span>
                <DetailIcon name="calendar" />
                <select value={year} onChange={event => setYear(event.target.value)}>
                  <option value="all">전체</option>
                  {years.map(value => <option key={value} value={value}>{value}년</option>)}
                </select>
                <DetailIcon name="down" />
              </span>
            </label>
            {archive.filter(({ exam }) => year === 'all' || String(exam.year) === year).map(choice =>
              <ExamChoice key={choiceKey(choice)} choice={choice} onOpenItem={onOpenItem} onRecordChoice={onRecordChoice} revision={currentLaw} compact />)}
          </details>
        )}
      </div>
    </section>
  )
}
