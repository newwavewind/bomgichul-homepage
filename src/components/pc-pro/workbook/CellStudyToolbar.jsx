import { useEffect, useId, useRef, useState } from 'react'
import { INKS, PALETTES } from './cellSheetColors'

const TOOL_TABS = [
  { id: 'sheet', title: '시트' }, { id: 'practice', title: '복습' },
  { id: 'align', title: '정렬' }, { id: 'format', title: '색상' },
]

const alignments = [
  { axis: 'horizontal', label: '가로 정렬', options: [['left', '왼쪽'], ['center', '가운데'], ['right', '오른쪽']] },
  { axis: 'vertical', label: '세로 정렬', options: [['top', '위쪽'], ['middle', '가운데'], ['bottom', '아래쪽']] },
]
const colors = [
  { field: 'palette', label: '배경색', options: PALETTES.map(item => [item.value, item.label, item.swatch]) },
  { field: 'ink', label: '글자색', options: INKS.map(item => [item.value, item.label, item.light]) },
]

const iconPaths = {
  topics: 'M4 4h12v12H4z M4 8h12M8 8v8M8 12h8',
  search: 'M13 13l4 4 M14.5 9a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z',
  wide: 'M8 4H4v4m8-4h4v4M4 12v4h4m8-4v4h-4',
  narrow: 'M4 8h4V4m8 4h-4V4M4 12h4v4m8-4h-4v4',
  print: 'M6 7V3h8v4M6 14H3V7h14v7h-3m-8-3h8v6H6zM14.5 9.5h.5',
  hide: 'M2.5 10c3.6-6.2 11.4-6.2 15 0-3.6 6.2-11.4 6.2-15 0Z M4 4l12 12',
  reveal: 'M2.5 10c3.6-6.2 11.4-6.2 15 0-3.6 6.2-11.4 6.2-15 0Z M12 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
  range: 'M3.5 7V3.5H7m6 0h3.5V7M3.5 13v3.5H7m6 0h3.5V13M8 8h4v4H8z',
  find: 'M4 4h12v12H4zM4 9h5m0-5v5m0 7v-3m4-4h3M8 12l1.5 1.5L13 10',
  wrong: 'M4 4h12v12H4z M7.5 7.5l5 5m0-5-5 5',
  left: 'M4 5h12M4 8.5h7M4 12h12M4 15.5h7',
  center: 'M4 5h12M6.5 8.5h7M4 12h12M6.5 15.5h7',
  right: 'M4 5h12M9 8.5h7M4 12h12M9 15.5h7',
  top: 'M4 4h12M10 13V7m-2.5 2.5L10 7l2.5 2.5',
  middle: 'M4 10h12M10 3v4M8 5l2 2 2-2m-2 12v-4m-2 2 2-2 2 2',
  bottom: 'M4 16h12M10 7v6m-2.5-2.5L10 13l2.5-2.5',
  down: 'm6 8 4 4 4-4',
}

function ToolIcon({ name }) {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none"
    stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
    <path d={iconPaths[name]} />
  </svg>
}

function moveTab(event, tabs, activeId, select) {
  const current = tabs.findIndex(tab => tab.id === activeId)
  let next
  if (event.key === 'ArrowLeft') next = (current + tabs.length - 1) % tabs.length
  else if (event.key === 'ArrowRight') next = (current + 1) % tabs.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = tabs.length - 1
  else return
  event.preventDefault()
  select(tabs[next].id)
  event.currentTarget.querySelectorAll('[role="tab"]')[next]?.focus()
}

function Tool({ icon, children, ...props }) {
  return <button className="civil-ribbon-tool" type="button" {...props}><ToolIcon name={icon} /><span>{children}</span></button>
}

function FormatTools({ display, onDisplay }) {
  const [open, setOpen] = useState(null)
  const buttons = useRef({})
  const paletteId = useId()
  const menu = colors.find(({ field }) => field === open)

  function closePalette() {
    buttons.current[open]?.focus()
    setOpen(null)
  }

  return (
    <div className="civil-ribbon-format" onKeyDown={event => {
      if (open && event.key === 'Escape') {
        event.stopPropagation()
        closePalette()
      }
    }}>
      <div className="civil-ribbon-color-row">
        {colors.map(({ field, label, options }) => {
          const [, currentName, swatch] = options.find(([value]) => value === display[field]) ?? options[0]
          return (
            <button key={field} type="button" ref={node => { buttons.current[field] = node }}
              title={label + ' · ' + currentName} aria-expanded={open === field} aria-controls={open === field ? paletteId : undefined}
              onClick={() => setOpen(value => value === field ? null : field)}>
              <span aria-hidden="true" className={field === 'palette' ? 'civil-ribbon-swatch' : 'civil-ribbon-color-tool'}
                style={{ '--ribbon-swatch': swatch ?? 'var(--sheet-ink)' }}>
                {field === 'ink' && '가'}
              </span>
              {label}<ToolIcon name="down" />
            </button>
          )
        })}
      </div>
      {menu && <div id={paletteId} className="civil-ribbon-swatches" data-field={menu.field} role="group" aria-label={menu.label + ' 선택'}>
        {menu.options.map(([value, label, swatch]) => (
          <button key={value} type="button" aria-pressed={display[menu.field] === value} onClick={() => {
            onDisplay(menu.field, value)
            closePalette()
          }}>
            <span aria-hidden="true" style={{ '--ribbon-swatch': swatch ?? 'var(--sheet-ink)' }} />
            {label}
          </button>
        ))}
      </div>}
    </div>
  )
}

export function SheetRibbon({ panel, wide, mode, hasHidden, display, wrongCount = 0, onDisplay, onPanel, onClosePanel, onWide, onMode, onReveal }) {
  const [tab, setTab] = useState('sheet')
  const id = useId()

  function select(next) {
    setTab(next)
    if (next !== 'sheet' && next !== 'practice') onClosePanel()
  }

  return (
    <section className="civil-ribbon" aria-label="시트 도구">
      <div className="civil-ribbon-tabs" role="tablist" aria-label="도구 메뉴"
        onKeyDown={event => moveTab(event, TOOL_TABS, tab, select)}>
        {TOOL_TABS.map(item => (
          <button type="button" role="tab" key={item.id} id={id + item.id} aria-controls={id + item.id + '-tools'}
            aria-selected={item.id === tab} tabIndex={item.id === tab ? 0 : -1} onClick={() => select(item.id)}>{item.title}</button>
        ))}
      </div>
      <div className="civil-ribbon-groups" role="tabpanel" id={id + 'sheet-tools'} aria-labelledby={id + 'sheet'} hidden={tab !== 'sheet'}>
        <div className="civil-ribbon-group" role="group" aria-label="이동">
          <div>
            <Tool icon="topics" aria-expanded={panel === 'topics'} onClick={() => onPanel('topics')}>시트 목차</Tool>
            <Tool icon="search" aria-expanded={panel === 'search'} onClick={() => onPanel('search')}>검색</Tool>
          </div>
          <span aria-hidden="true">이동</span>
        </div>
        <div className="civil-ribbon-group" role="group" aria-label="보기와 출력">
          <div>
            <Tool icon={wide ? 'narrow' : 'wide'} aria-pressed={wide} onClick={onWide}>{wide ? '기본 크기' : '넓게 보기'}</Tool>
            <Tool icon="print" aria-expanded={panel === 'export'} onClick={() => onPanel('export')}>인쇄·저장</Tool>
          </div>
          <span aria-hidden="true">보기·출력</span>
        </div>
      </div>
      <div className="civil-ribbon-groups" role="tabpanel" id={id + 'practice-tools'} aria-labelledby={id + 'practice'} hidden={tab !== 'practice'}>
        <div className="civil-ribbon-group" role="group" aria-label="가리기">
          <div>
            <Tool icon="hide" aria-pressed={mode === 'hide'} onClick={() => onMode('hide')}>
              {mode === 'hide' ? '가리기 완료' : '가릴 셀 선택'}
            </Tool>
            {hasHidden && <Tool icon="reveal" onClick={onReveal}>모두 표시</Tool>}
          </div>
          <span aria-hidden="true">가리기</span>
        </div>
        <div className="civil-ribbon-group" role="group" aria-label="연습">
          <div>
            <Tool icon="range" aria-pressed={mode === 'range'} onClick={() => onMode('range')}>범위 선택</Tool>
            <Tool icon="find" aria-pressed={mode === 'find'} onClick={() => onMode('find')}>기출로 셀 찾기</Tool>
          </div>
          <span aria-hidden="true">연습</span>
        </div>
        <div className="civil-ribbon-group" role="group" aria-label="틀린 셀">
          <div>
            <Tool icon="wrong" aria-expanded={panel === 'wrong'} onClick={() => onPanel('wrong')}>
              틀린 셀{wrongCount > 0 ? ' ' + wrongCount : ''}
            </Tool>
          </div>
          <span aria-hidden="true">오답</span>
        </div>
      </div>
      <div className="civil-ribbon-groups" role="tabpanel" id={id + 'align-tools'} aria-labelledby={id + 'align'} hidden={tab !== 'align'}>
        {alignments.map(({ axis, label, options }) => (
          <div key={axis} className="civil-ribbon-group civil-ribbon-alignment" role="group" aria-label={label}>
            <div>{options.map(([value, title]) => (
              <Tool key={value} icon={value} aria-label={label + ' · ' + title} aria-pressed={display[axis] === value}
                onClick={() => onDisplay(axis, value)}>{title}</Tool>
            ))}</div>
            <span aria-hidden="true">{label}</span>
          </div>
        ))}
      </div>
      <div role="tabpanel" id={id + 'format-tools'} aria-labelledby={id + 'format'} hidden={tab !== 'format'}>
        {tab === 'format' && <FormatTools display={display} onDisplay={onDisplay} />}
      </div>
    </section>
  )
}

export function SheetFooter({ sheets, activeId, onSheet }) {
  const tabsRef = useRef(null)
  const activeIndex = sheets.findIndex(sheet => sheet.id === activeId)
  const previous = sheets[activeIndex - 1]
  const next = sheets[activeIndex + 1]

  useEffect(() => {
    const tabs = tabsRef.current
    const selected = tabs?.querySelector('[aria-selected="true"]')
    if (!selected) return
    function centerSelectedTab() {
      const tab = selected.getBoundingClientRect()
      const viewport = tabs.getBoundingClientRect()
      tabs.scrollLeft += tab.left + tab.width / 2 - (viewport.left + tabs.clientWidth / 2)
    }
    centerSelectedTab()
    const observer = new ResizeObserver(centerSelectedTab)
    observer.observe(tabs)
    return () => observer.disconnect()
  }, [activeId])

  return (
    <div className="civil-sheet-footer">
      <div className="civil-sheet-navigation">
        <div className="civil-sheet-arrows" role="group" aria-label="시트 이동">
          <button type="button" aria-label="이전 시트" disabled={!previous} onClick={() => onSheet(previous.id)}><span aria-hidden="true" /></button>
          <button type="button" aria-label="다음 시트" disabled={!next} onClick={() => onSheet(next.id)}><span aria-hidden="true" /></button>
        </div>
        <div ref={tabsRef} className="civil-sheet-tabs" role="tablist" aria-label="학습 시트"
          onKeyDown={event => moveTab(event, sheets, activeId, onSheet)}>
          {sheets.map(item => (
            <button type="button" role="tab" key={item.id} id={'civil-sheet-tab-' + item.id}
              aria-selected={item.id === activeId} aria-controls={item.id === activeId ? 'civil-sheet-panel-' + item.id : undefined}
              tabIndex={item.id === activeId ? 0 : -1} onClick={() => onSheet(item.id)}>{item.title}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
