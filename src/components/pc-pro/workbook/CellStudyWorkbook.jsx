import { useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { cellRange, choicePractice, sheetEntries, searchCells } from './cellStudyEngine'
import { lastAttemptWrong, ScreenHeader } from './cellStudyAdapter'
import { BookmarkIcon, loadJsonObject, saveJson } from './kitUtils'
import { inkProps, paletteProps } from './cellSheetColors'
import CellStudyDetails, { choiceKey, choiceLabel } from './CellStudyDetails'
import { SheetFooter, SheetRibbon } from './CellStudyToolbar'
import './cellStudy.css'

const DEFAULT_DISPLAY = { horizontal: 'left', vertical: 'top', palette: 'green', ink: 'default' }
const EDITIONS = { filled: '채워진 학습표', blank: '빈칸 연습지', answer: '빈칸 정답표' }
const entryKey = entry => entry.sheet.id + ':' + entry.address
const desktopQuery = '(min-width: 900px)'
const isDesktop = () => window.matchMedia(desktopQuery).matches
function watchDesktop(onChange) {
  const media = window.matchMedia(desktopQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}


/** 이 셀에 이어진 기출 선지 가운데 마지막 풀이가 틀린 것이 있는가 */
function wrongInfo(entry, progress) {
  return entry.choices.filter(({ exam, item }) => lastAttemptWrong(progress, exam, item)).length
}

function reverseQuestions(entries) {
  const questions = new Map()
  for (const entry of entries) {
    for (const choice of entry.choices) {
      if (!choicePractice(choice)) continue
      const key = choiceKey(choice)
      if (!questions.has(key)) questions.set(key, { choice, targets: [] })
      questions.get(key).targets.push(entry)
    }
  }
  return [...questions.values()]
}

/** 접힌 소주제 띠 아래 행 번호 */
function foldedRowNumbers(sheet, folded) {
  const out = new Set()
  let inFolded = false
  for (const row of sheet.rows) {
    if (row.kind === 'band') inFolded = folded.has(row.number)
    else if (inFolded) out.add(row.number)
  }
  return out
}

function SheetGrid({ sheet, entries, selected, range, compare, hidden, mode, reversePending, reviewing, personal, display, wrongKeys, folded, onToggleBand, onCell, onAxis }) {
  const foldedRows = foldedRowNumbers(sheet, folded)
  const bandCells = new Map()
  let band = null
  for (const row of sheet.rows) {
    if (row.kind === 'band') { band = row.number; bandCells.set(band, 0) }
    else if (band != null) bandCells.set(band, bandCells.get(band) + row.cells.length)
  }
  return (
    <div className="civil-sheet-scroll" role="region" aria-label={sheet.title + ' 학습표'}>
      <table className="civil-sheet-grid" data-horizontal={display.horizontal} data-vertical={display.vertical}
        {...inkProps(display.ink)}
        aria-labelledby={'civil-sheet-tab-' + sheet.id}>
        <colgroup><col className="civil-sheet-index-col" /><col className="civil-sheet-subject-col" /></colgroup>
        <colgroup span={sheet.columns.length} />
        <thead>
          <tr className="civil-sheet-axis">
            <td className="civil-sheet-index" aria-hidden="true"><span className="civil-sheet-corner" /></td>
            <td className="civil-sheet-fixed-column" aria-hidden="true">A</td>
            {sheet.columns.map(({ letter, label }) => (
              <td key={letter} data-active={selected?.column.letter === letter || (compare?.kind === 'column' && compare.column.letter === letter)}>
                <button type="button" aria-label={letter + '열 ' + label} disabled={mode === 'range' || mode === 'find'}
                  onClick={() => onAxis('column', letter)}>{letter}</button>
              </td>
            ))}
          </tr>
          <tr>
            <td className="civil-sheet-index" aria-hidden="true">1</td>
            <th scope="col" className="civil-sheet-fixed-column">{sheet.firstColumnLabel ?? (sheet.chapter ? '쟁점' : '구분')}</th>
            {sheet.columns.map(({ letter, label }) => <th key={letter} scope="col">{label}</th>)}
          </tr>
        </thead>
        <tbody>
          {sheet.rows.map(row => row.kind === 'band' ? (
            <tr key={row.number} className="civil-sheet-band" data-folded={folded.has(row.number)}>
              <td className="civil-sheet-index" aria-hidden="true">{row.number}</td>
              {row.headers && !folded.has(row.number) ? (
                <>
                  <th scope="rowgroup" className="civil-sheet-fixed-column">
                    <button type="button" className="civil-sheet-band-toggle" aria-expanded="true" onClick={() => onToggleBand(row.number)}>
                      {row.label}
                    </button>
                  </th>
                  {row.headers.map((header, i) => <th key={i} scope="col" className="civil-sheet-band-header">{header}</th>)}
                </>
              ) : (
                <th scope="rowgroup" colSpan={1 + sheet.columns.length} className="civil-sheet-band-title">
                  <button type="button" className="civil-sheet-band-toggle" aria-expanded={!folded.has(row.number)} onClick={() => onToggleBand(row.number)}>
                    {row.label}
                    {folded.has(row.number) && <small>{bandCells.get(row.number)}칸 접힘</small>}
                  </button>
                </th>
              )}
            </tr>
          ) : foldedRows.has(row.number) ? null : (
            <tr key={row.number}>
              <td className="civil-sheet-index" data-active={selected?.row.number === row.number || (compare?.kind === 'row' && compare.row.number === row.number)}>
                <button type="button" aria-label={row.number + '행 ' + row.label} disabled={mode === 'range' || mode === 'find'}
                  onClick={() => onAxis('row', row.number)}>{row.number}</button>
              </td>
              <th className="civil-sheet-fixed-column" scope="row" data-ordinal={row.gridLabel ? 'true' : undefined}>{row.gridLabel ?? row.label}</th>
              {entries.filter(entry => entry.row === row).map(entry => {
                const { address, column, cell } = entry
                const masked = hidden.has(address) || reversePending || (reviewing && range.includes(address))
                const active = selected?.address === address
                const grouped = range.includes(address) ||
                  (compare?.kind === 'row' && compare.row.number === row.number) ||
                  (compare?.kind === 'column' && compare.column.letter === column.letter)
                return (
                  <td key={address}>
                    <button type="button" className="civil-sheet-cell" data-masked={masked} data-active={active}
                      data-grouped={grouped} aria-pressed={mode === 'hide' ? masked : active || grouped}
                      aria-label={address + ' ' + row.label + ' · ' + column.label + ' · ' + (masked ? '가려짐' : cell.value)}
                      onClick={() => onCell(entry)}>
                      {masked ? <span className="civil-sheet-mask">가려짐</span> : (
                        <>
                          <span>{cell.value}</span>
                          {(personal[entryKey(entry)]?.bookmarked || cell.revision || wrongKeys.has(entryKey(entry))) && (
                            <span className="civil-sheet-markers">
                              {wrongKeys.has(entryKey(entry)) && <span className="civil-sheet-wrong">틀림</span>}
                              {personal[entryKey(entry)]?.bookmarked && <span aria-label="북마크"><BookmarkIcon /></span>}
                              {cell.revision && <span>개정</span>}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TopicsPanel({ kind, sheets, entries, personal, activeId, onSheet, onSelect }) {
  const [query, setQuery] = useState('')
  const [marksOnly, setMarksOnly] = useState(false)
  const groups = [...new Set(sheets.map(sheet => sheet.group))]
  const [group, setGroup] = useState(sheets.find(sheet => sheet.id === activeId)?.group ?? groups[0])
  const topicList = useRef(null)
  const shownSheets = sheets.filter(sheet => sheet.group === group)
  const results = kind === 'search' ? searchCells(entries, query).filter(entry => !marksOnly || personal[entryKey(entry)]?.bookmarked) : []

  useEffect(() => {
    const list = topicList.current
    const current = list?.querySelector('[aria-current="page"]')
    if (!current) return
    const bounds = list.getBoundingClientRect()
    const row = current.getBoundingClientRect()
    if (row.bottom > bounds.bottom) list.scrollTop += row.bottom - bounds.bottom
  }, [activeId, group])

  return (
    <section className={kind === 'topics' ? 'civil-sheet-panel civil-sheet-topic-panel' : 'civil-sheet-panel'}
      aria-label={kind === 'topics' ? '시트 목차' : '시트 검색'}>
      {kind === 'topics' ? (
        <>
          <div className="civil-sheet-topic-filters" role="group" aria-label="단원">
            {groups.map(value => (
              <button key={value} type="button" aria-pressed={group === value}
                title={value + ' · ' + sheets.filter(sheet => sheet.group === value).length + '개 시트'}
                onClick={() => setGroup(value)}>{value}</button>
            ))}
          </div>
          <ul key={group} ref={topicList} className="civil-sheet-topic-results" aria-label={group + ' 시트'}>
            {shownSheets.map(sheet => <li key={sheet.id}>
              <button type="button" data-expanded-topic={sheet.id !== sheet.unitId} aria-current={sheet.id === activeId ? 'page' : undefined}
                onClick={() => onSheet(sheet.id)}>
                <span>{sheet.title}</span><span className="civil-sheet-topic-arrow" aria-hidden="true" />
              </button>
            </li>)}
          </ul>
        </>
      ) : (
        <>
          <label className="civil-sheet-search">용어·조문·기출 검색
            <input autoFocus type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="주제명, 조문 번호, 출제 연도" />
          </label>
          <label className="civil-sheet-bookmark-filter"><input type="checkbox" checked={marksOnly} onChange={event => setMarksOnly(event.target.checked)} /> 북마크만</label>
          <ul className="civil-sheet-results">
            {results.map(entry => <li key={entryKey(entry)}><button type="button" onClick={() => onSelect(entry)}>
              <strong>{entry.sheet.title} · {entry.address}</strong><small>{entry.row.label} · {entry.column.label}</small>
            </button></li>)}
          </ul>
          {results.length === 0 && <p>조건에 맞는 셀이 없어요.</p>}
        </>
      )}
    </section>
  )
}

function WrongPanel({ entries, onSelect, onReview }) {
  const sheetCount = new Set(entries.map(entry => entry.sheet.id)).size
  return (
    <section className="civil-sheet-panel civil-wrong" aria-label="틀린 셀">
      {entries.length === 0 ? (
        <p className="civil-wrong-empty">기출을 풀다 틀린 선지가 정리된 셀이 여기에 모여요.</p>
      ) : (
        <>
          <header className="civil-wrong-head">
            <p><strong>틀린 셀 {entries.length}칸</strong><span>{sheetCount}개 시트</span></p>
            <button type="button" className="civil-wrong-start" onClick={() => onReview(entries)}>복습 시작</button>
          </header>
          <ul className="civil-wrong-list">
            {entries.map(entry => <li key={entryKey(entry)}><button type="button" onClick={() => onSelect(entry)}>
              <span className="civil-wrong-where">{entry.sheet.title} · {entry.address}</span>
              <span className="civil-wrong-value">{entry.cell.value}</span>
            </button></li>)}
          </ul>
        </>
      )}
    </section>
  )
}

function ExportPanel({ sheet, addresses }) {
  const [edition, setEdition] = useState('filled')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const available = edition === 'filled' || addresses.size > 0

  async function deliver(action) {
    if (busy || !available) return
    setBusy(true)
    setMessage('')
    try {
      if (action === 'photo') {
        const { saveSheetPhoto } = await import('./cellStudyPrint')
        const photo = await saveSheetPhoto(sheet, edition, addresses)
        setMessage((photo.mode === 'native' ? '사진첩에 저장했어요.' : '그림 내려받기를 시작했어요.') + ' (' + photo.width + '×' + photo.height + ')')
        return
      }
      const { deliverSheet } = await import('./cellStudyPrint')
      const result = await deliverSheet(sheet, edition, addresses, action)
      if (result?.mode === 'download') setMessage('PDF 다운로드를 시작했어요.')
      if (result?.mode === 'documents') setMessage('기기의 봄기출 폴더에 저장했어요.')
    } catch {
      setMessage('시트를 내보내지 못했어요. 잠시 뒤 다시 시도해 주세요.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="civil-sheet-panel" aria-label="시트 인쇄 및 PDF 저장">
      <label className="civil-sheet-year">출력 형식
        <select value={edition} disabled={busy} onChange={event => setEdition(event.target.value)}>
          {Object.entries(EDITIONS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      {edition !== 'filled' && <p>{addresses.size ? '선택한 ' + addresses.size + '칸을 사용해요.' : '가리거나 범위로 선택한 셀이 있어야 만들 수 있어요.'}</p>}
      <div className="civil-sheet-actions civil-sheet-inline">
        <button type="button" disabled={busy || !available} onClick={() => deliver('print')}>인쇄</button>
        <button type="button" disabled={busy || !available} onClick={() => deliver('save')}>PDF 저장</button>
        <button type="button" disabled={busy || !available} onClick={() => deliver('photo')}>사진첩 저장</button>
      </div>
      {(busy || message) && <p role="status">{busy ? '시트를 준비하고 있어요. 초고화질이라 몇 초 걸릴 수 있어요.' : message}</p>}
    </section>
  )
}

function RangeReview({ entries, onEnd }) {
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState(false)
  const entry = entries[index]
  return (
    <section className="civil-sheet-panel civil-sheet-practice" aria-label="선택 범위 복습">
      <strong>{index + 1}/{entries.length} · {entries.some(other => other.sheet.id !== entry.sheet.id) ? entry.sheet.title + ' ' : ''}{entry.address} {entry.row.label} · {entry.column.label}</strong>
      <p>{shown ? entry.cell.value : '이 칸의 내용을 떠올려 보세요.'}</p>
      <div className="civil-sheet-actions">
        {!shown && <button type="button" onClick={() => setShown(true)}>정답 보기</button>}
        {shown && <button type="button" onClick={() => {
          if (index + 1 === entries.length) onEnd()
          else { setIndex(value => value + 1); setShown(false) }
        }}>{index + 1 === entries.length ? '복습 완료' : '다음 셀'}</button>}
        <button type="button" onClick={onEnd}>닫기</button>
      </div>
    </section>
  )
}

/** App workbook with the website's authorized sheets and linked questions. */
/** @param {{sheets: any[], exams: any[], onBack: () => void, storageKey: string, resume?: any, onOpenItem: (choice: any, position: any) => void, onOpenPremium?: (reason: any) => void}} props */
export default function CellStudyWorkbook({ sheets, exams, onBack, storageKey, resume = null, onOpenItem, onOpenPremium }) {
  const PERSONAL_KEY = storageKey + '-personal-v1'
  const DISPLAY_KEY = 'bom-web-cell-display-v1'
  const FOLD_KEY = storageKey + '-folded-v1'
  const ATTEMPT_KEY = storageKey + '-attempts-v1'
  const [activeId, setActiveId] = useState(sheets.some(item => item.id === resume?.sheetId) ? resume.sheetId : sheets[0].id)
  const [address, setAddress] = useState(resume?.address ?? null)
  const [hiddenBySheet, setHiddenBySheet] = useState(resume?.hiddenBySheet ?? {})
  const [personal, setPersonal] = useState(() => loadJsonObject(PERSONAL_KEY))
  const [display, setDisplay] = useState(() => ({ ...DEFAULT_DISPLAY, ...loadJsonObject(DISPLAY_KEY) }))
  const [panel, setPanel] = useState(null)
  const [wide, setWide] = useState(false)
  const [mode, setMode] = useState('read')
  const [compare, setCompare] = useState(null)
  const [rangeStart, setRangeStart] = useState(null)
  const [rangeEnd, setRangeEnd] = useState(null)
  const [reviewing, setReviewing] = useState(false)
  const [reverseIndex, setReverseIndex] = useState(0)
  const [reversePick, setReversePick] = useState(null)
  const [wrongReview, setWrongReview] = useState(null)
  const [progress, setProgress] = useState(() => loadJsonObject(ATTEMPT_KEY))
  const [foldedBySheet, setFoldedBySheet] = useState(() => loadJsonObject(FOLD_KEY))
  const detailDialog = useRef(null)
  const desktop = useSyncExternalStore(watchDesktop, isDesktop, () => false)

  const location = { sheetId: activeId, address }
  const sheet = sheets.find(item => item.id === location.sheetId) ?? sheets[0]
  const allEntries = useMemo(() => {
    const byId = new Map(exams.map(exam => [exam.id, exam]))
    return sheets.flatMap(item => sheetEntries(item, byId)).map(entry => ({
      ...entry,
      terms: entry.choices.flatMap(({ item }) => (item.terms ?? []).flatMap(({ term, hanja }) => hanja ? [term, hanja] : [term])),
    }))
  }, [exams, sheets])
  const wrongEntries = useMemo(() => allEntries.filter(entry => wrongInfo(entry, progress) > 0), [allEntries, progress])
  const wrongKeys = new Set(wrongEntries.map(entryKey))
  const entries = allEntries.filter(entry => entry.sheet.id === sheet.id)
  const selected = entries.find(entry => entry.address === location.address)
  const hidden = new Set(hiddenBySheet[sheet.id])
  const range = rangeStart && rangeEnd ? cellRange(entries, rangeStart, rangeEnd) : []
  const rangeAddresses = range.length ? range.map(entry => entry.address) : rangeStart ? [rangeStart.address] : []
  const exportAddresses = new Set([...hidden, ...rangeAddresses])
  const reversed = mode === 'find' ? reverseQuestions(entries) : []
  const reverse = reversed.length ? reversed[reverseIndex % reversed.length] : null
  const selectedHidden = selected && hidden.has(selected.address)
  const personalKey = selected ? entryKey(selected) : null

  const togglePanel = kind => setPanel(current => current === kind ? null : kind)

  function switchMode(value) {
    setMode(value)
    setCompare(null)
    setReviewing(false)
    setReversePick(null)
    if (value === 'range') { setRangeStart(null); setRangeEnd(null) }
    if (value === 'find') { setAddress(null); setReverseIndex(0) }
  }

  function openSheet(id, cellAddress = null) {
    setActiveId(id)
    setAddress(cellAddress)
    setPanel(null)
    setRangeStart(null)
    setRangeEnd(null)
    switchMode('read')
  }

  function updateHidden(addresses, forceShow = false) {
    setHiddenBySheet(previous => {
      const next = new Set(previous[sheet.id])
      const show = forceShow || addresses.every(item => next.has(item))
      for (const item of addresses) {
        if (show) next.delete(item)
        else next.add(item)
      }
      return { ...previous, [sheet.id]: [...next] }
    })
  }

  function choose(entry) {
    if (mode === 'find') {
      if (reverse && !reversePick) {
        setAddress(entry.address)
        setReversePick(entry.address)
      }
      return
    }
    if (sheet.id !== activeId) setActiveId(sheet.id)
    setAddress(entry.address)
    setCompare(null)
    if (mode === 'hide') updateHidden([entry.address])
    if (mode === 'range') {
      setReviewing(false)
      if (!rangeStart || rangeEnd) { setRangeStart(entry); setRangeEnd(null) }
      else setRangeEnd(entry)
    }
  }

  function chooseAxis(kind, value) {
    const matches = entries.filter(entry => (kind === 'row' ? entry.row.number : entry.column.letter) === value)
    if (mode === 'hide') { updateHidden(matches.map(entry => entry.address)); return }
    setAddress(null)
    setCompare({ kind, row: matches[0].row, column: matches[0].column, matches })
  }

  function updatePersonal(change) {
    if (!personalKey) return
    const next = { ...personal, [personalKey]: { ...personal[personalKey], ...change } }
    setPersonal(next)
    saveJson(PERSONAL_KEY, next)
  }

  function recordChoice({ exam, item }, wrong) {
    const next = { ...progress, [exam.id]: { ...progress[exam.id], [item.key]: wrong } }
    setProgress(next)
    saveJson(ATTEMPT_KEY, next)
  }

  function openExam(choice) {
    onOpenItem?.(choice, { sheetId: sheet.id, address: selected?.address, hiddenBySheet })
  }

  function changeDisplay(field, value) {
    const next = { ...display, [field]: value }
    setDisplay(next)
    saveJson(DISPLAY_KEY, next)
  }

  function closeDetail() {
    if (activeId !== sheet.id) setActiveId(sheet.id)
    setAddress(null)
  }

  // 소주제 띠를 누르면 그 소주제 행을 접고 편다(시트마다 기억)
  const folded = new Set(foldedBySheet[sheet.id] ?? [])
  function toggleBand(number) {
    const next = new Set(folded)
    if (next.has(number)) next.delete(number)
    else next.add(number)
    const saved = { ...foldedBySheet, [sheet.id]: [...next] }
    setFoldedBySheet(saved)
    saveJson(FOLD_KEY, saved)
  }
  const foldedRows = foldedRowNumbers(sheet, folded)
  const visibleEntries = entries.filter(entry => !foldedRows.has(entry.row.number))

  // 넓은 화면에서는 표 옆에서, 좁은 화면에서는 가운데 창에서 해설을 읽는다.
  const detailOpen = Boolean(selected && mode === 'read')
  const detailIndex = selected ? visibleEntries.findIndex(entry => entry.address === selected.address) : -1
  const previousEntry = detailIndex > 0 ? visibleEntries[detailIndex - 1] : null
  const nextEntry = detailIndex >= 0 && detailIndex < visibleEntries.length - 1 ? visibleEntries[detailIndex + 1] : null
  const stepTo = entry => { if (entry) setAddress(entry.address) }
  useLayoutEffect(() => {
    const dialog = detailDialog.current
    if (detailOpen && !desktop && dialog && !dialog.open) dialog.showModal()
  }, [detailOpen, desktop])
  const swipe = useRef(null)

  const reversePending = mode === 'find' && reverse && !reversePick
  const readout = mode === 'hide' ? '셀이나 행·열 번호를 누르세요.'
    : mode === 'range' ? (rangeEnd ? rangeStart.address + ':' + rangeEnd.address + ' · ' + range.length + '칸' : rangeStart ? '끝 셀을 누르세요.' : '시작 셀을 누르세요.')
      : mode === 'find' ? '기출의 근거가 되는 셀을 고르세요.'
        : compare ? (compare.kind === 'column' ? compare.column.label : compare.row.label)
          : selectedHidden ? '가려진 셀' : selected?.cell.value ?? '셀을 누르면 해설이 열립니다.'

  const detailContent = detailOpen ? (
            <div className={desktop ? "pc-workbook-detail-card" : "civil-sheet-modal-card"}
              onTouchStart={event => { const t = event.touches[0]; swipe.current = { x: t.clientX, y: t.clientY } }}
              onTouchEnd={event => {
                const start = swipe.current
                swipe.current = null
                if (!start) return
                const t = event.changedTouches[0]
                const dx = t.clientX - start.x
                if (Math.abs(dx) < 60 || Math.abs(t.clientY - start.y) > Math.abs(dx) * 0.6) return
                stepTo(dx < 0 ? nextEntry : previousEntry)
              }}>
          {selectedHidden ? <section className="civil-sheet-panel" aria-label="가려진 셀">
              <button className="civil-sheet-reveal" type="button" onClick={() => updateHidden([selected.address], true)}>이 셀 내용 보기</button>
            </section> : <CellStudyDetails key={personalKey} entry={selected} personal={personal[personalKey] ?? {}}
              onPersonalChange={updatePersonal} onRecordChoice={recordChoice}
              onOpenItem={onOpenItem ? openExam : undefined} onOpenPremium={onOpenPremium ? reason => { closeDetail(); onOpenPremium(reason) } : undefined} onClose={closeDetail} />}
              <nav className="civil-sheet-modal-nav" aria-label="셀 넘기기">
                <button type="button" disabled={!previousEntry} onClick={() => stepTo(previousEntry)}>
                  <span aria-hidden="true">‹</span> 이전 셀
                </button>
                <span>{detailIndex + 1} / {visibleEntries.length}</span>
                <button type="button" disabled={!nextEntry} onClick={() => stepTo(nextEntry)}>
                  다음 셀 <span aria-hidden="true">›</span>
                </button>
              </nav>
            </div>
  ) : null

  return (
    <main className={'concept-cards-d4 civil-sheet-screen pb-bottom-nav' + (wide ? ' civil-sheet-wide' : '')} {...paletteProps(display.palette)}>
      <div className="cc-d4-inner civil-sheet-shell">
        <ScreenHeader titleHighlight="기출 셀 학습" onBack={onBack} />
        <SheetRibbon panel={panel} wide={wide} mode={mode} hasHidden={hidden.size > 0} display={display} onDisplay={changeDisplay}
          wrongCount={wrongEntries.length}
          onPanel={togglePanel} onClosePanel={() => setPanel(null)} onWide={() => setWide(value => !value)}
          onMode={value => switchMode(mode === value ? 'read' : value)} onReveal={() => updateHidden([...hidden], true)} />
        {(panel === 'topics' || panel === 'search') && <TopicsPanel key={panel} kind={panel} sheets={sheets}
          entries={allEntries} personal={personal} activeId={sheet.id} onSheet={openSheet}
          onSelect={entry => openSheet(entry.sheet.id, entry.address)} />}
        {panel === 'export' && <ExportPanel key={sheet.id} sheet={sheet} addresses={exportAddresses} />}
        {panel === 'wrong' && (wrongReview
          ? <RangeReview key={'wrong-' + wrongReview.length} entries={wrongReview} onEnd={() => setWrongReview(null)} />
          : <WrongPanel entries={wrongEntries} onSelect={entry => openSheet(entry.sheet.id, entry.address)} onReview={setWrongReview} />)}

        {mode === 'find' && (
          <section className="civil-sheet-panel civil-sheet-practice" aria-label="기출로 셀 찾기">
            {reverse ? (
              <>
                <strong>{reversePick ? '근거 셀 확인' : '근거가 되는 셀을 고르세요'}</strong>
                <small>{choiceLabel(reverse.choice)}</small>
                <p>{reverse.choice.exam.stem}</p>
                <blockquote>{reverse.choice.item.text}</blockquote>
                {reversePick && (
                  <>
                    <p role="status">{reverse.targets.some(entry => entry.address === reversePick) ? '맞았어요' : '표에서 근거를 확인해 보세요'}
                      {' · '}{reverse.targets.map(entry => entry.address + ' ' + entry.row.label + ' · ' + entry.column.label).join(' / ')}</p>
                    <div className="civil-sheet-actions">
                      <button type="button" onClick={() => openSheet(sheet.id, reverse.targets[0].address)}>근거 셀 열기</button>
                      <button type="button" onClick={() => { setReverseIndex(value => value + 1); setReversePick(null); setAddress(null) }}>다음 선지</button>
                    </div>
                  </>
                )}
              </>
            ) : <p>현재 이용 가능한 기출 선지가 없어요.</p>}
          </section>
        )}

        <div className="pc-workbook-grid" data-detail={desktop && detailOpen}>
        <div className="civil-sheet-workbook">
          <div role="tabpanel" id={'civil-sheet-panel-' + sheet.id} aria-labelledby={'civil-sheet-tab-' + sheet.id}>
            <div className="civil-sheet-readout" role="status">
              <span className="civil-sheet-coordinate">{selected?.address ?? '셀'}</span>
              <span className="civil-sheet-readout-text">{readout}</span>
            </div>
            <SheetGrid sheet={sheet} entries={entries} selected={selected} range={rangeAddresses} compare={compare}
              hidden={hidden} mode={mode} reversePending={reversePending} reviewing={reviewing} personal={personal} display={display} wrongKeys={wrongKeys}
              folded={folded} onToggleBand={toggleBand} onCell={choose} onAxis={chooseAxis} />
          </div>
          <SheetFooter sheets={sheets} activeId={sheet.id} onSheet={openSheet} />
        </div>
        {detailOpen && (desktop ? <aside className="pc-workbook-detail" aria-label="셀 해설">{detailContent}</aside> : <dialog ref={detailDialog}
          className="concept-cards-d4 civil-sheet-screen civil-sheet-modal"
          {...paletteProps(display.palette)}
          aria-label={selectedHidden ? '가려진 셀' : undefined}
          aria-labelledby={selectedHidden ? undefined : 'civil-sheet-selection'}
          onCancel={event => { event.preventDefault(); closeDetail() }}
          onKeyDown={event => {
            if (event.altKey || event.metaKey || event.ctrlKey || event.target.matches('input, textarea, select, [contenteditable]')) return
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault()
              stepTo(event.key === 'ArrowLeft' ? previousEntry : nextEntry)
            }
          }}
          onClick={event => { if (event.target === event.currentTarget) closeDetail() }}>
{detailContent}
          </dialog>)}
        </div>

        {mode === 'range' && range.length > 0 && (
          reviewing ? <RangeReview key={rangeAddresses.join(':')} entries={range} onEnd={() => setReviewing(false)} />
            : <div className="civil-sheet-actions civil-sheet-inline">
              <button type="button" onClick={() => setReviewing(true)}>선택한 {range.length}칸 복습</button>
              <button type="button" onClick={() => { updateHidden(rangeAddresses); switchMode('read') }}>범위 가리기</button>
            </div>
        )}
        {compare && mode === 'read' && (
          <section className="civil-sheet-panel" aria-label="셀 비교">
            <div className="civil-sheet-detail-title">
              <strong>{compare.kind === 'column' ? compare.column.label : compare.row.label} 비교</strong>
              <div className="civil-sheet-actions"><button type="button" onClick={() => setCompare(null)}>접기</button></div>
            </div>
            <ul className="civil-sheet-results civil-sheet-compare">
              {compare.matches.map(entry => <li key={entry.address}><button type="button" onClick={() => choose(entry)}>
                <strong>{entry.address} · {compare.kind === 'column' ? entry.row.label : entry.column.label}</strong>
                <small>{hidden.has(entry.address) ? '가려짐' : entry.cell.value}</small>
              </button></li>)}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}
