import { finishLectureScene, getLectureProgress, recordLecturePosition } from './lectureProgress'
import { useEffect, useEffectEvent, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ChalkFlow from './ChalkFlow'
import { CalcBoard, GraphBoard, TimelineBoard } from './ChalkCalcBoards'
import { activeSolveWindow, solveSecondsOf, solveWindows } from './solvePause'
import { lockLandscape, lockPortrait, unlockOrientation } from './screenOrientation'
import '../styles/civil103MicroLecture.css'
import '../styles/chalkCalc.css'
import { LectureViewCount } from '../LectureViewCount'

/** 같은 플레이어에 검증된 강의 자료만 바꿔 넣는다. 음원은 재생할 때만 받는다. */
export default function createChalkLecture(definition) {
const SCENES = definition.scenes
const LECTURE_CUES = definition.cues
// 개발 미리보기에서만: 올리기 전 음성을 이 맥에서 들어 보려고 강의별 미리보기 음원 주소를 쓴다
const audioBase = () => {
  if (process.env.NODE_ENV === 'development') {
    try { const local = localStorage.getItem(definition.previewAudioKey || 'c103AudioBase'); if (local) return local } catch { /* 무시 */ }
  }
  return definition.audioBase
}
const audioUrl = index => `${audioBase()}/scene-${String(index + 1).padStart(2, '0')}.m4a`
const fmt = seconds => {
  if (!Number.isFinite(seconds)) return '0:00'
  const value = Math.floor(seconds)
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
}

/**
 * 조각마다 시작 시각(초). 음성을 만들 때 적어 둔 값(civil103LectureCues.json)을 쓰고,
 * 없으면 글자 수 비율로 어림한다 — 그래도 판서가 말을 크게 앞지르지 않게.
 */
function stepStarts(scene, duration) {
  const cue = LECTURE_CUES?.[scene.id]
  if (cue?.starts?.length === scene.steps.length) {
    const scale = Number.isFinite(duration) && duration > 0 && cue.duration ? duration / cue.duration : 1
    return cue.starts.map(at => at * scale)
  }
  // 「풀어 보세요」 쉬는 시간(무음)도 글자 수로 바꿔 넣는다 — 그래야 다음 판서가 쉬는 동안 먼저 써지지 않는다
  const weight = step => step.say.length + solveSecondsOf(step) * 6.5
  const total = scene.steps.reduce((n, step) => n + weight(step), 0) || 1
  const length = Number.isFinite(duration) && duration > 0 ? duration : total / 6.5
  let acc = 0
  return scene.steps.map(step => {
    const at = (acc / total) * length
    acc += weight(step)
    return at
  })
}

/**
 * 효과음 — 파일을 받지 않고 그 자리에서 만든다(분필 사각·강조 톡·정답 딩·오답 뚝).
 * 아이폰은 사용자가 누른 순간에만 소리를 켤 수 있어, 재생 단추를 누를 때 깨운다.
 */
const sfx = (() => {
  let ctx = null
  const get = () => {
    if (typeof window === 'undefined') return null
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return null
    if (!ctx) ctx = new Ctx()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  }
  const tone = (c, { freq, to, dur, type = 'sine', gain = 0.2, at = 0 }) => {
    const t0 = c.currentTime + at
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t0)
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur)
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    osc.connect(g).connect(c.destination)
    osc.start(t0); osc.stop(t0 + dur + 0.02)
  }
  return {
    wake: get,
    play(kind, volume = 1) {
      const c = get()
      if (!c || volume <= 0) return
      const v = Math.min(1, volume)
      if (kind === 'chalk') {
        // 거친 잡음을 짧게 세 번 — 분필이 칠판을 긁는 소리
        const len = Math.floor(c.sampleRate * 0.26)
        const buf = c.createBuffer(1, len, c.sampleRate)
        const d = buf.getChannelData(0)
        for (let i = 0; i < len; i += 1) {
          const env = Math.sin(Math.PI * Math.min(1, (i % (len / 3)) / (len / 3)))
          d[i] = (Math.random() * 2 - 1) * env * 0.6
        }
        const src = c.createBufferSource(); src.buffer = buf
        const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3200; bp.Q.value = 0.9
        const g = c.createGain(); g.gain.value = 0.11 * v
        src.connect(bp).connect(g).connect(c.destination); src.start()
      } else if (kind === 'pop') {
        tone(c, { freq: 520, to: 880, dur: 0.12, gain: 0.16 * v })
      } else if (kind === 'right') {
        tone(c, { freq: 880, dur: 0.18, gain: 0.18 * v })
        tone(c, { freq: 1320, dur: 0.32, gain: 0.16 * v, at: 0.1 })
      } else if (kind === 'wrong') {
        tone(c, { freq: 220, to: 150, dur: 0.28, type: 'triangle', gain: 0.22 * v })
      }
    },
  }
})()

/** 한 마디를 자막 한 줄 크기의 문장으로 — 마침표·물음표 뒤에서 끊고, 너무 길면 쉼표에서 한 번 더 */
function captionChunks(text) {
  const sentences = text.match(/[^.?!…]+[.?!…]+["”’)]?\s*|[^.?!…]+$/g) || [text]
  return sentences.flatMap(sentence => {
    const line = sentence.trim()
    if (line.length <= 44) return line ? [line] : []
    const parts = line.split(/(?<=,)\s+/)
    const out = []
    let cur = ''
    for (const part of parts) {
      if (cur && (cur + ' ' + part).length > 44) { out.push(cur); cur = part } else cur = cur ? `${cur} ${part}` : part
    }
    if (cur) out.push(cur)
    // 쉼표가 없어 아직 긴 줄(기출 원문 등)은 가운데에 가까운 띄어쓰기에서 나눈다
    return out.flatMap(function split(piece) {
      if (piece.length <= 44) return [piece]
      const mid = piece.length / 2
      let at = -1
      for (let k = 0; k < piece.length; k += 1) if (piece[k] === ' ' && (at < 0 || Math.abs(k - mid) < Math.abs(at - mid))) at = k
      return at < 0 ? [piece] : [...split(piece.slice(0, at)), ...split(piece.slice(at + 1))]
    })
  })
}

/**
 * 칠판이 넘쳐 스크롤될 때(가로 전체화면) 써진 판서 중 맨 아래 것이 보이도록 따라 내려간다.
 * 막 써질 때뿐 아니라 되감기·장면 건너뛰기로 이미 써진 채 나타날 때도 맞춘다.
 */
function followInk(box) {
  if (!box) return
  if (box.scrollHeight <= box.clientHeight + 2) { if (box.scrollTop) box.scrollTo({ top: 0 }); return }
  const zoom = Number.parseFloat(getComputedStyle(box).zoom) || 1
  const lowest = Math.max(...[...box.querySelectorAll('.c103-ink.is-on')].map(el => el.getBoundingClientRect().bottom))
  // 보이는 아래 끝 = 칠판 끝과 자막 위 중 높은 쪽 — 자막·조작부에 판서가 가리지 않게
  const caption = box.parentElement?.querySelector('.c103-subtitle p')
  const visibleBottom = Math.min(box.getBoundingClientRect().bottom, caption ? caption.getBoundingClientRect().top : Infinity)
  // 맨 아래 판서가 보이는 아래 끝에 오게 — 되감아 판서가 줄면 다시 위로 올라와 제목부터 보인다
  const target = Math.max(0, box.scrollTop + (lowest - visibleBottom + 18) / zoom)
  if (Math.abs(target - box.scrollTop) > 1) box.scrollTo({ top: target, behavior: 'smooth' })
}

/** 판서 조각 — 드러날 차례가 되면 분필로 써진다 */
function Ink({ on, as: Tag = 'div', className = '', children, ...rest }) {
  // 막 써진 판서는 잠깐 빛난다(분필 가루가 날리는 느낌) — 다음 줄이 써지면 가라앉는다
  const [fresh, setFresh] = useState(false)
  const was = useRef(on)
  useEffect(() => {
    if (on && !was.current) {
      setFresh(true)
      const t = setTimeout(() => setFresh(false), 1400); was.current = on; return () => clearTimeout(t)
    }
    was.current = on
    return undefined
  }, [on])
  return <Tag className={`c103-ink${on ? ' is-on' : ''}${fresh ? ' is-fresh' : ''}${className ? ` ${className}` : ''}`} aria-hidden={on ? undefined : true} {...rest}>{children}</Tag>
}

function markText(text, marks, shown) {
  const parts = []
  let rest = text
  for (const mark of marks) {
    const at = rest.indexOf(mark.phrase)
    if (at < 0) continue
    if (at > 0) parts.push(rest.slice(0, at))
    parts.push(<span key={mark.id} className={`c103-mark${shown.has(mark.id) ? ' is-on' : ''}`}>{mark.phrase}</span>)
    rest = rest.slice(at + mark.phrase.length)
  }
  parts.push(rest)
  return parts
}

/**
 * 그림의 선 — 실제 화면 크기(px)로 그린다.
 * 예전엔 viewBox 0~100 을 늘려 쓰고 그리기 효과 길이를 140 으로 박아 두어, 넓은 화면에선
 * 긴 선(갑→을 270px 남짓)이 앞 140px 만 그려지고 멈췄다. pathLength=1 로 선마다 「제 길이 전부」를 그린다.
 */
function DiagramLines({ edges, at, on }) {
  const ref = useRef(null)
  const [size, setSize] = useState(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const watch = new ResizeObserver(measure)
    watch.observe(el)
    return () => watch.disconnect()
  }, [])
  const w = size?.w || 100
  const h = size?.h || 100
  return (
    <svg ref={ref} className="c103-diagram__lines" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {size ? edges.map(edge => {
        const a = at[edge.from]; const b = at[edge.to]
        return <line key={edge.id} pathLength="1" className={`c103-diagram__edge${on(edge.id) ? ' is-on' : ''}`} x1={a.x * w / 100} y1={(a.y + 8) * h / 100} x2={b.x * w / 100} y2={(b.y - 8) * h / 100} />
      }) : null}
    </svg>
  )
}

function BoardBody({ scene, shown }) {
  const on = id => shown.has(id)
  switch (scene.layout) {
    case 'flow':
      return <>
        <ChalkFlow nodes={scene.nodes} shown={shown} ink={Ink} />
        {scene.footnote ? <Ink on={on(scene.footnote.id)} className="c103-footnote">{scene.footnote.text}</Ink> : null}
        {scene.footnotes?.map(note=><Ink key={note.id} on={on(note.id)} className="c103-footnote">{note.text}</Ink>)}
      </>
    case 'rights':
      return (
        <div className="c103-rights">
          {scene.comparisons.map(row => (
            <Ink key={row.id} on={on(row.id)} className="c103-rights__row">
              <h4>{row.title}</h4>
              <ChalkFlow nodes={row.nodes} shown={on(row.id) ? new Set(row.nodes.map(node => node.id)) : new Set()} ink={Ink} />
              <p>{row.caption}</p>
            </Ink>
          ))}
          {scene.footnote ? <Ink on={on(scene.footnote.id)} className="c103-footnote">{scene.footnote.text}</Ink> : null}
        </div>
      )
    case 'article':
      return (
        <div className="c103-article">
          <Ink on={on('article')} className="c103-article__card">
            <span className="c103-article__title">{scene.article.title}</span>
            <p>{markText(scene.article.text, scene.article.marks, shown)}</p>
          </Ink>
          <div className="c103-article__notes">
            {scene.article.marks.map(mark => (
              <Ink key={mark.id} on={on(mark.id)} className="c103-article__note"><b>{mark.phrase}</b><span>{mark.note}</span></Ink>
            ))}
          </div>
        </div>
      )
    case 'compare':
      return (
        <div className="c103-compare">
          <div className="c103-compare__cols">
            {scene.columns.map(col => (
              <Ink key={col.id} on={on(col.id)} className={`c103-compare__col is-${col.tone}`}>
                <strong>{col.title}</strong>
                {col.lines.map(line => <span key={line}>{line}</span>)}
              </Ink>
            ))}
          </div>
          {scene.footnote ? <Ink on={on(scene.footnote.id)} className="c103-footnote">{scene.footnote.text}</Ink> : null}
          {scene.footnotes?.map(note=><Ink key={note.id} on={on(note.id)} className="c103-footnote">{note.text}</Ink>)}
        </div>
      )
    case 'grid':
      return (
        <div className="c103-grid-wrap">
          <div className="c103-grid">
            {scene.cells.map(cell => (
              <Ink key={cell.id} on={on(cell.id)} className="c103-grid__cell"><strong>{cell.title}</strong><span>{cell.body}</span></Ink>
            ))}
          </div>
          {scene.footnote ? <Ink on={on(scene.footnote.id)} className="c103-footnote">{scene.footnote.text}</Ink> : null}
          {scene.footnotes?.map(note=><Ink key={note.id} on={on(note.id)} className="c103-footnote">{note.text}</Ink>)}
        </div>
      )
    case 'table': {
      const wide = scene.table.head.length > 2
      return (
        <>
        <table className={`c103-table${wide ? ' is-wide' : ''}`}>
          <thead><tr>{scene.table.head.map((h, i) => <th key={i} className={!wide ? (i === 0 ? 'is-o' : 'is-x') : ''}>{h}</th>)}</tr></thead>
          <tbody>
            {scene.table.rows.map(row => (
              <tr key={row.id} aria-hidden={!on(row.id)} className={`c103-ink c103-ink--row${on(row.id) ? ' is-on' : ''}`}>
                {row.cells.map((cell, i) => wide && i === 0 ? <th key={i}>{cell}</th> : <td key={i}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        {scene.sequence ? <section className="c103-rights">
          <div className="c103-rights__row">
            <Ink on={on(scene.sequence.id)}><h4>{scene.sequence.title}</h4></Ink>
            <ChalkFlow nodes={scene.sequence.nodes} shown={shown} ink={Ink} />
          </div>
        </section> : null}
        {scene.footnote ? <Ink on={on(scene.footnote.id)} className="c103-footnote">{scene.footnote.text}</Ink> : null}
        {scene.footnotes?.map(note=><Ink key={note.id} on={on(note.id)} className="c103-footnote">{note.text}</Ink>)}
        </>
      )
    }
    case 'diagram': {
      const { nodes, edges, notes } = scene.diagram
      const at = Object.fromEntries(nodes.map(node => [node.id, node]))
      const replaced = new Set(notes.filter(note => note.replaces && on(note.id)).map(note => note.replaces))
      return (
        <div className="c103-diagram">
          <DiagramLines edges={edges} at={at} on={on} />
          {edges.map(edge => {
            const a = at[edge.from]; const b = at[edge.to]
            return <Ink key={`${edge.id}-label`} on={on(edge.id)} className="c103-diagram__label" style={{ left: `${(a.x + b.x) / 2}%`, top: `${(a.y + b.y) / 2}%` }}>{edge.label}</Ink>
          })}
          {nodes.map(node => (
            <Ink key={node.id} on={on(node.id)} className="c103-diagram__node" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
              <strong>{node.label}</strong><small>{node.sub}</small>
            </Ink>
          ))}
          {notes.map(note => replaced.has(note.id) ? null : (
            <Ink key={note.id} on={on(note.id)} className={`c103-diagram__note is-${note.tone}`} style={{ left: `${note.x}%`, top: `${note.y}%` }}>{note.text}</Ink>
          ))}
        </div>
      )
    }
    // 계산 강의(표준 9장) — 풀이 줄·수요공급 그래프·현금흐름 시간 막대
    case 'calc':
      return <>
        <CalcBoard calc={scene.calc} shown={shown} Ink={Ink} />
        {scene.footnotes?.map(note=><Ink key={note.id} on={on(note.id)} className="c103-footnote">{note.text}</Ink>)}
      </>
    case 'graph':
      return <GraphBoard graph={scene.graph} shown={shown} Ink={Ink} />
    case 'timeline':
      return <TimelineBoard timeline={scene.timeline} shown={shown} Ink={Ink} />
    case 'summary':
      return (
        <ol className="c103-summary">
          {scene.summary.map((item, i) => (
            <Ink as="li" key={item.id} on={on(item.id)} className="c103-summary__item">
              <span className="c103-summary__no" aria-hidden="true">{i + 1}</span>
              <span className="c103-summary__body">
                <span className="c103-summary__title">{item.text}</span>
                {item.details?.length ? (
                  <ul className="c103-summary__details">{item.details.map(d => <li key={d}>{d}</li>)}</ul>
                ) : null}
              </span>
            </Ink>
          ))}
        </ol>
      )
    case 'drill':
      return (
        <ol className="c103-drill">
          {scene.drill.map(item => (
            <Ink as="li" key={item.id} on={on(item.id)} className="c103-drill__item">
              <span className="c103-drill__q">{item.from ? <small className="c103-drill__from">{item.from}</small> : null}{item.q}</span>
              {/* 정답은 선생님이 말할 때 — 먼저 떠올려 볼 틈을 준다 */}
              <Ink as="span" on={on(`${item.id}a`)} className={`c103-drill__a is-${item.a === 'O' ? 'o' : 'x'}`}>{item.a}</Ink>
              <Ink as="small" on={on(`${item.id}a`)}>{item.why}</Ink>
            </Ink>
          ))}
        </ol>
      )
    default:
      return (
        <div className="c103-lines">
          {scene.lines.map(line => <Ink key={line.id} on={on(line.id)} as="p">{line.text}</Ink>)}
        </div>
      )
  }
}

function ChalkBoard({ scene, index, shown, done, caption, captionInset = 0 }) {
  // 넓은 칠판(가로 전체화면)에선 판서를 칠판 너비에 맞춰 키운다 — 넘치면 칠판 안에서 스크롤
  const boardRef = useRef(null)
  const [fit, setFit] = useState(1)
  // 칠판은 장면마다 새로 붙는다(key) — 장면이 바뀌면 새 칠판을 다시 잰다. 그리기 전에 재야 작게 번쩍이지 않는다
  useLayoutEffect(() => {
    const el = boardRef.current
    if (!el) return undefined
    const measure = () => setFit(Math.min(1.7, Math.max(1, el.clientWidth / 840)))
    measure()
    const watch = new ResizeObserver(measure)
    watch.observe(el)
    return () => watch.disconnect()
  }, [scene.id])
  useEffect(() => {
    const frame = requestAnimationFrame(() => followInk(boardRef.current?.querySelector('.c103-board__writing')))
    // 전체화면 조작부·자막의 이동 애니메이션이 끝난 실제 위치로 한 번 더 맞춘다.
    const settled = setTimeout(() => followInk(boardRef.current?.querySelector('.c103-board__writing')), 420)
    return () => { cancelAnimationFrame(frame); clearTimeout(settled) }
  }, [scene.id, shown, done, fit, captionInset, caption])
  return (
    <div ref={boardRef} style={{ '--c103-fit': fit.toFixed(3) }} className={`c103-board c103-board--${scene.layout || 'title'}${scene.sequence ? ' c103-board--sequence' : ''}${definition.boundedWriting ? ' c103-board--bounded' : ''}`} key={scene.id} aria-label={`${index + 1}번째 판서: ${scene.heading.replace('\n', ' ')}`}>
      <div className="c103-board__grain" aria-hidden="true" />
      <div className="c103-board__top">
        <span>{definition.boardLabel}</span>
        <span>{String(index + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}</span>
      </div>
      <div className="c103-board__writing">
        <span className="c103-board__eyebrow c103-write" style={{ '--write-delay': '0.05s' }}>{scene.eyebrow}</span>
        <h3 className="c103-board__heading c103-write" style={{ '--write-delay': '0.3s' }}>{scene.heading}</h3>
        <svg className="c103-board__chalk-line" viewBox="0 0 520 20" preserveAspectRatio="none" aria-hidden="true">
          <path d="M2 12 C95 5 178 15 267 9 S433 8 518 6" />
        </svg>
        <BoardBody scene={scene} shown={shown} />
        <Ink on={done} className="c103-board__emphasis">{scene.emphasis}</Ink>
      </div>
      {/* 방송 자막처럼 — 지금 말하는 문장만 칠판 아래에 */}
      <div className="c103-subtitle" aria-live="polite">{caption ? <p key={caption}>{caption}</p> : null}</div>
      <div className="c103-board__ledge" aria-hidden="true"><span /><span /><span /></div>
    </div>
  )
}

/** 강의 전체를 한 줄로 — 장면별 길이(만들 때 잰 값)를 이어 붙인 시작 시각 */
const SCENE_LENGTHS = SCENES.map(scene => LECTURE_CUES?.[scene.id]?.duration || scene.steps.reduce((n, step) => n + step.say.length / 6.5 + solveSecondsOf(step), 0))
const SCENE_OFFSETS = SCENE_LENGTHS.reduce((acc, len, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + SCENE_LENGTHS[i - 1]); return acc }, [])
const TOTAL_LENGTH = SCENE_LENGTHS.reduce((n, len) => n + len, 0)
const RATES = [0.75, 1, 1.25, 1.5, 1.75, 2]
const PREF_KEY = 'c103LecturePrefs'

function loadPrefs() {
  try { return { rate: 1, volume: 1, muted: false, subtitles: true, sfx: true, ...JSON.parse(localStorage.getItem(PREF_KEY) || '{}') } } catch { return { rate: 1, volume: 1, muted: false, subtitles: true, sfx: true } }
}
function savePrefs(prefs) {
  try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)) } catch { /* 저장 못 해도 재생은 된다 */ }
}

/** 장면(챕터)을 마디로 나눈 재생 막대 — 유튜브 챕터처럼. 장면 막대를 따로 두지 않는다 */
const sceneAt = t => {
  const i = SCENE_OFFSETS.findIndex((at, k) => t >= at && t < at + SCENE_LENGTHS[k])
  return i < 0 ? SCENES.length - 1 : i
}
function SeekBar({ value, onSeek, current }) {
  const ref = useRef(null)
  const [drag, setDrag] = useState(null)
  const dragging = useRef(false) // 누른 그 순간의 상태 — setState 는 다음 그리기까지 늦게 보인다
  const fractionAt = event => {
    const rect = ref.current.getBoundingClientRect()
    return Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
  }
  const at = drag != null ? drag * TOTAL_LENGTH : value
  const tipScene = SCENES[sceneAt(at)]
  return (
    <div
      ref={ref}
      className={`c103-seek${drag != null ? ' is-drag' : ''}`}
      role="slider"
      tabIndex={0}
      aria-label="재생 위치"
      aria-valuemin={0}
      aria-valuemax={Math.round(TOTAL_LENGTH)}
      aria-valuenow={Math.round(value)}
      aria-valuetext={`${fmt(value)} / ${fmt(TOTAL_LENGTH)} · ${SCENES[current]?.eyebrow ?? ''}`}
      onPointerDown={event => { try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* 무시 */ } dragging.current = true; setDrag(fractionAt(event)) }}
      onPointerMove={event => { if (dragging.current) setDrag(fractionAt(event)) }}
      onPointerUp={event => { if (!dragging.current) return; dragging.current = false; const f = fractionAt(event); setDrag(null); onSeek(f * TOTAL_LENGTH) }}
      onPointerCancel={() => { dragging.current = false; setDrag(null) }}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); onSeek(value - 5) }
        if (event.key === 'ArrowRight') { event.preventDefault(); onSeek(value + 5) }
      }}
    >
      <div className="c103-seek__track">
        {SCENES.map((scene, i) => {
          const from = SCENE_OFFSETS[i]
          const len = SCENE_LENGTHS[i]
          const fill = Math.min(1, Math.max(0, (at - from) / len))
          return (
            <span key={scene.id} className={`c103-seek__seg${i === current ? ' is-current' : ''}`} style={{ left: `${(from / TOTAL_LENGTH) * 100}%`, width: `calc(${(len / TOTAL_LENGTH) * 100}% - ${i === SCENES.length - 1 ? 0 : 3}px)` }}>
              <i style={{ width: `${fill * 100}%` }} />
            </span>
          )
        })}
        <div className="c103-seek__thumb" style={{ left: `${(at / TOTAL_LENGTH) * 100}%` }} />
      </div>
      {drag != null ? <span className="c103-seek__tip" style={{ left: `${drag * 100}%` }}><b>{tipScene.eyebrow}</b>{fmt(at)}</span> : null}
    </div>
  )
}

/** 조작부 선 아이콘 — 굵기·크기를 한 벌로(글자 기호는 기기마다 모양이 달라 쓰지 않는다) */
function Icon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  switch (name) {
    case 'back5':
      return <svg {...common}><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" /><path d="M4.5 4.5v3.6h3.6" /><text x="12" y="15.4" textAnchor="middle" fontSize="7.6" fontWeight="700" fill="currentColor" stroke="none" fontFamily="system-ui, sans-serif">5</text></svg>
    case 'fwd5':
      return <svg {...common}><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" /><path d="M19.5 4.5v3.6h-3.6" /><text x="12" y="15.4" textAnchor="middle" fontSize="7.6" fontWeight="700" fill="currentColor" stroke="none" fontFamily="system-ui, sans-serif">5</text></svg>
    case 'play':
      return <svg {...common} strokeWidth={0} fill="currentColor"><path d="M8.2 5.6v12.8c0 .8.9 1.3 1.6.9l10-6.4a1.05 1.05 0 0 0 0-1.8l-10-6.4c-.7-.4-1.6.1-1.6.9z" /></svg>
    case 'pause':
      return <svg {...common} strokeWidth={0} fill="currentColor"><rect x="6.5" y="5" width="3.8" height="14" rx="1.2" /><rect x="13.7" y="5" width="3.8" height="14" rx="1.2" /></svg>
    case 'replay':
      return <svg {...common}><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" /><path d="M4.5 4.5v3.6h3.6" /></svg>
    case 'volume':
      return <svg {...common}><path d="M4 9.5v5h3.2L12 18.5v-13L7.2 9.5z" fill="currentColor" stroke="none" /><path d="M15.5 9a4.2 4.2 0 0 1 0 6" /><path d="M18 6.5a7.8 7.8 0 0 1 0 11" /></svg>
    case 'volumeLow':
      return <svg {...common}><path d="M4 9.5v5h3.2L12 18.5v-13L7.2 9.5z" fill="currentColor" stroke="none" /><path d="M15.5 9a4.2 4.2 0 0 1 0 6" /></svg>
    case 'mute':
      return <svg {...common}><path d="M4 9.5v5h3.2L12 18.5v-13L7.2 9.5z" fill="currentColor" stroke="none" /><path d="M16 9.5l5 5M21 9.5l-5 5" /></svg>
    case 'cc':
      return <svg {...common}><rect x="3" y="5.5" width="18" height="13" rx="2.6" /><path d="M10.3 10.2a2.2 2.2 0 1 0 0 3.6M16.6 10.2a2.2 2.2 0 1 0 0 3.6" /></svg>
    case 'full':
      return <svg {...common}><path d="M4.5 9V4.5H9M15 4.5h4.5V9M19.5 15v4.5H15M9 19.5H4.5V15" /></svg>
    case 'exitFull':
      return <svg {...common}><path d="M9 4.5V9H4.5M19.5 9H15V4.5M15 19.5V15h4.5M4.5 15H9v4.5" /></svg>
    case 'rotate':
      return <svg {...common}><rect x="7" y="3.5" width="10" height="17" rx="2" /><path d="M3 15.5a8.5 8.5 0 0 0 4 4.2M21 8.5a8.5 8.5 0 0 0-4-4.2" /></svg>
    default:
      return null
  }
}

/** 음성은 장면마다 흘려 받는다 — 앱 패키지에 음성·영상 파일이 들어가지 않는다 */
/**
 * 강의 바로 밑에서 기출을 그 자리에서 푼다 — 문제 화면으로 갔다 돌아오면 흐름이 끊긴다(10-25 사용자).
 * 조합형(ㄱ·ㄴ·ㄷ + 묶음 보기)과 보기형(①~⑤) 둘 다. 고르면 맞음/틀림과 지문별 O·X·해설을 펼친다.
 */
function ChalkLecturePlayer({ renderTrigger, progressId, renderFooter, initialOpen = false, lectureId }) {
  const [open, setOpen] = useState(false)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState('')
  const [prefs, setPrefs] = useState(loadPrefs)
  const [view, setView] = useState('window') // window | full
  const [orient, setOrient] = useState('portrait') // 꽉 찬 화면에서 portrait | landscape
  // 지금 화면이 세로 모양인가 — 「가로 고정」이 성공했다고 답해도 실제로 안 돌 수 있어(웹·일부 기기) 크기로 판단한다
  const [portraitViewport, setPortraitViewport] = useState(() => typeof window !== 'undefined' && window.innerHeight > window.innerWidth)
  const [menu, setMenu] = useState('') // '' | speed | volume
  // 펼친 메뉴(속도·소리·장면)가 화면 밖으로 넘치지 않게 — 실제 자리를 재서 안쪽으로 민다.
  // 좁은 휴대폰에선 단추가 왼쪽 끝으로 줄바꿈되어, 오른쪽 맞춤 메뉴가 왼쪽 밖으로 나갔다(10-25).
  // 화면을 돌려 세운 가로에서도 맞게 getBoundingClientRect 대신 칠판 틀(shell) 안의 자리(offset)로 잰다.
  useLayoutEffect(() => {
    if (!menu) return
    const el = document.querySelector('.c103-pop__menu')
    const shell = el?.closest('.c103-shell')
    if (!el || !shell) return
    el.style.transform = ''
    let x = 0
    for (let n = el; n && n !== shell; n = n.offsetParent) x += n.offsetLeft
    const room = shell.clientWidth
    const want = Math.min(Math.max(x, 8), Math.max(8, room - 8 - el.offsetWidth))
    if (Math.abs(want - x) > 0.5) el.style.transform = `translateX(${want - x}px)`
  }, [menu])
  const [chromeHidden, setChromeHidden] = useState(false)
  // 겹친 조작부 높이 — 자막이 그만큼 위로 비켜 선다
  const controlsRef = useRef(null)
  const [controlsHeight, setControlsHeight] = useState(0)
  useEffect(() => {
    const el = controlsRef.current
    if (!el) return undefined
    const measure = () => setControlsHeight(el.offsetHeight)
    measure()
    const watch = new ResizeObserver(measure)
    watch.observe(el)
    return () => watch.disconnect()
  }, [view])
  const [volumeWorks, setVolumeWorks] = useState(true)
  const audioRef = useRef(null)
  const indexRef = useRef(0)
  const playRequest = useRef(0)
  const pendingSeek = useRef(null)
  const hideTimer = useRef(null)

  const updatePrefs = patch => setPrefs(prev => { const next = { ...prev, ...patch }; savePrefs(next); return next })

  // 속도·볼륨은 장면이 바뀌어도(새 src) 이어지게 매번 다시 건다
  const applyAudioPrefs = audio => {
    audio.defaultPlaybackRate = prefs.rate
    audio.playbackRate = prefs.rate
    audio.muted = prefs.muted
    try { audio.volume = prefs.volume } catch { /* 아이폰은 볼륨을 앱이 못 바꾼다 */ }
  }
  useEffect(() => { if (audioRef.current) applyAudioPrefs(audioRef.current) }, [prefs]) // eslint-disable-line react-hooks/exhaustive-deps

  // 아이폰 웹뷰는 audio.volume 을 무시한다 — 그때는 막대 대신 음소거만 보이고 기기 버튼을 쓰게 한다
  useEffect(() => {
    const probe = document.createElement('audio')
    try { probe.volume = 0.5 } catch { /* 무시 */ }
    setVolumeWorks(Math.abs(probe.volume - 0.5) < 0.01)
  }, [])

  const playScene = (index, startAt = 0, autoplay = true) => {
    sfx.wake()
    const audio = audioRef.current
    if (!audio || index < 0 || index >= SCENES.length) return
    const request = ++playRequest.current
    indexRef.current = index
    pendingSeek.current = startAt > 0.05 ? startAt : null
    audio.pause()
    audio.src = audioUrl(index)
    audio.load()
    applyAudioPrefs(audio)
    setOpen(true)
    setSceneIndex(index)
    setPosition(startAt)
    setDuration(0)
    setCompleted(false)
    setError('')
    setPlaying(autoplay)
    if (!autoplay) return
    void audio.play().catch(cause => {
      // 다른 장면을 누르거나 멈춰서 취소된 이전 재생 요청은 통신 오류가 아니다.
      if (request !== playRequest.current || cause?.name === 'AbortError') return
      setPlaying(false)
      setError('음성을 재생하지 못했습니다. 인터넷 연결을 확인하고 다시 눌러 주세요.')
    })
  }

  /** 강의 전체 시각(초)으로 이동 — 장면을 넘나든다 */
  const seekTo = target => {
    const audio = audioRef.current
    if (!audio) return
    const t = Math.min(Math.max(0, target), TOTAL_LENGTH - 0.3)
    let index = SCENE_OFFSETS.findIndex((at, i) => t >= at && t < at + SCENE_LENGTHS[i])
    if (index < 0) index = SCENES.length - 1
    const within = t - SCENE_OFFSETS[index]
    if (index === indexRef.current && audio.src) {
      if (audio.readyState === 0) {
        pendingSeek.current = within
        setPosition(within)
      } else {
        audio.currentTime = Math.max(0, Math.min(within, Number.isFinite(audio.duration) ? audio.duration - 0.1 : within))
        setPosition(audio.currentTime)
      }
      setCompleted(false)
      if (audio.paused && playing) void audio.play().catch(() => {})
    } else {
      // 일시정지 중 장면 경계를 넘겨도 임의로 다시 재생하지 않는다.
      playScene(index, within, playing)
    }
  }
  // A shared lecture link opens this lecture paused; sound starts with a user gesture.
  useEffect(() => { if (initialOpen) playScene(0, 0, false) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const globalPosition = (SCENE_OFFSETS[sceneIndex] || 0) + position

  const leaveFull = () => {
    setView('window'); setOrient('portrait')
    void unlockOrientation()
  }
  const stop = () => {
    playRequest.current += 1
    audioRef.current?.pause()
    setPlaying(false)
    setOpen(false)
    setMenu('')
    if (view === 'full') leaveFull()
  }

  const enterFull = async nextOrient => {
    setView('full'); setOrient(nextOrient); setMenu('')
    if (nextOrient === 'landscape') await lockLandscape(); else await lockPortrait()
  }
  // 기기가 실제로 돌았는지는 화면 크기로 — 크기가 바뀔 때마다 다시 본다
  useEffect(() => {
    const onResize = () => setPortraitViewport(window.innerHeight > window.innerWidth)
    onResize()
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener('orientationchange', onResize) }
  }, [view, orient])
  // 가로를 골랐는데 화면이 아직 세로 모양이면 화면 자체를 돌려 가로처럼 보여 준다
  const rotated = view === 'full' && orient === 'landscape' && portraitViewport


  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = event => {
      if (event.key === 'Escape') { if (view === 'full') leaveFull(); else stop() }
      if (event.key === ' ' && event.target === document.body) { event.preventDefault(); toggle() }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, view]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { audioRef.current?.pause(); void unlockOrientation() }, [])

  // 꽉 찬 화면에서 재생 중이면 3초 뒤 조작부를 숨긴다 — 화면을 누르면 다시
  const pokeChrome = () => {
    setChromeHidden(false)
    clearTimeout(hideTimer.current)
    if (view === 'full' && playing && !menu) hideTimer.current = setTimeout(() => setChromeHidden(true), 3000)
  }
  useEffect(() => { pokeChrome(); return () => clearTimeout(hideTimer.current) }, [view, playing, menu]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (completed) { playScene(0); return }
    sfx.wake()
    if (audio.paused) {
      const request = ++playRequest.current
      setError('')
      setPlaying(true)
      void audio.play().catch(cause => {
        if (request !== playRequest.current || cause?.name === 'AbortError') return
        setPlaying(false)
        setError('음성을 재생하지 못했습니다. 인터넷 연결을 확인해 주세요.')
      })
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  // Read the current audio position on every keypress, including while a new scene loads.
  // SeekBar handles its own left/right keys; defaultPrevented avoids a second 5-second jump.
  const onFullscreenKey = useEffectEvent(event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    const target = event.target
    if (target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"], [role="menu"]')) return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      const current = (SCENE_OFFSETS[indexRef.current] || 0) + (pendingSeek.current ?? audioRef.current?.currentTime ?? 0)
      seekTo(current + (event.key === 'ArrowRight' ? 5 : -5))
      pokeChrome()
    } else if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && volumeWorks) {
      event.preventDefault()
      const volume = Math.max(0, Math.min(1, Math.round(((prefs.muted ? 0 : prefs.volume) + (event.key === 'ArrowUp' ? 0.05 : -0.05)) * 100) / 100))
      updatePrefs({volume, muted:volume === 0})
      pokeChrome()
    }
  })
  useEffect(() => {
    if (!open || view !== 'full') return undefined
    const handleKey = event => onFullscreenKey(event)
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, view])

  const scene = SCENES[sceneIndex]
  const starts = useMemo(() => stepStarts(scene, duration), [scene, duration])
  // 음성을 못 불러오면 판서를 다 펼쳐 글로라도 읽게 한다
  const stepIndex = error ? scene.steps.length - 1 : Math.max(0, starts.reduce((last, at, i) => (position + 0.12 >= at ? i : last), 0))
  const sceneDone = Boolean(error) || completed || (duration > 0 && position >= duration - 0.4) || stepIndex === scene.steps.length - 1 && position > (starts.at(-1) ?? 0) + 2
  const shown = useMemo(() => new Set(scene.steps.slice(0, stepIndex + 1).flatMap(step => step.reveal || [])), [scene, stepIndex])
  const terms = scene.steps.slice(0, stepIndex + 1).map(step => step.term).filter(Boolean)
  // 마디 안에서는 글자 수 비율로 문장 시각을 나눈다(재생 속도를 바꿔도 음성 시각을 따르므로 함께 빨라진다)
  const caption = useMemo(() => {
    const step = scene.steps[stepIndex]
    if (!step || error) return ''
    const chunks = captionChunks(step.say)
    const from = starts[stepIndex] ?? 0
    const to = starts[stepIndex + 1] ?? (Number.isFinite(duration) && duration > 0 ? duration : from + step.say.length / 6.5)
    const total = chunks.reduce((n, c) => n + c.length, 0) || 1
    let acc = 0
    for (const chunk of chunks) {
      acc += chunk.length
      if (position < from + (to - from) * (acc / total)) return chunk
    }
    return chunks.at(-1)
  }, [scene, stepIndex, starts, position, duration, error])
  // 「풀어 보세요」 무음 구간이면 남은 시간 — cues 의 solve 칸(렌더러가 적음)을 먼저 쓴다
  const solving = useMemo(() => {
    if (error) return null
    const cue = LECTURE_CUES?.[scene.id]
    const scale = Number.isFinite(duration) && duration > 0 && cue?.duration ? duration / cue.duration : 1
    return activeSolveWindow(solveWindows(scene, starts, { cue, scale, duration }), position)
  }, [scene, starts, duration, position, error])
  // 재생 중 마디가 하나씩 넘어갈 때만 효과음 — 건너뛰거나 장면을 바꿀 때는 조용히
  const lastStep = useRef({ scene: -1, step: -1 })
  useEffect(() => {
    const prev = lastStep.current
    lastStep.current = { scene: sceneIndex, step: stepIndex }
    if (!playing || !prefs.sfx || prefs.muted || prev.scene !== sceneIndex || stepIndex !== prev.step + 1) return
    const reveal = scene.steps[stepIndex]?.reveal || []
    if (!reveal.length) return
    const volume = volumeWorks ? prefs.volume : 1
    const answer = (scene.drill || []).find(item => reveal.includes(`${item.id}a`))
    if (answer) { sfx.play(answer.a === 'O' ? 'right' : 'wrong', volume); return }
    sfx.play('chalk', volume)
  }, [sceneIndex, stepIndex]) // eslint-disable-line react-hooks/exhaustive-deps
  const lastDone = useRef(false)
  useEffect(() => {
    if (sceneDone && !lastDone.current && playing && prefs.sfx && !prefs.muted) sfx.play('pop', volumeWorks ? prefs.volume : 1)
    lastDone.current = sceneDone
  }, [sceneDone]) // eslint-disable-line react-hooks/exhaustive-deps
  const muted = prefs.muted || prefs.volume === 0
  const full = view === 'full'

  const controls = (
    <div className="c103-controls" ref={controlsRef} onPointerDown={pokeChrome} onFocusCapture={pokeChrome}>
      <SeekBar value={globalPosition} onSeek={seekTo} current={sceneIndex} />
      <div className="c103-bar">
        <div className="c103-bar__left">
          <button type="button" className="c103-icon" onClick={() => seekTo(globalPosition - 5)} aria-label="5초 뒤로"><Icon name="back5" /></button>
          <button type="button" className="c103-play" onClick={toggle} aria-label={playing ? '일시정지' : completed ? '처음부터 다시' : '재생'}>
            <Icon name={playing ? 'pause' : completed ? 'replay' : 'play'} />
          </button>
          <button type="button" className="c103-icon" onClick={() => seekTo(globalPosition + 5)} aria-label="5초 앞으로"><Icon name="fwd5" /></button>
          <span className="c103-time">{fmt(globalPosition)} / {fmt(TOTAL_LENGTH)}</span>
          <div className="c103-pop c103-pop--left">
            <button type="button" className="c103-chapter" onClick={() => setMenu(menu === 'chapters' ? '' : 'chapters')} aria-haspopup="menu" aria-expanded={menu === 'chapters'} aria-label={`장면 목록 — 지금 ${scene.eyebrow}`}>
              <span>{scene.eyebrow}</span><b aria-hidden="true">›</b>
            </button>
            {menu === 'chapters' ? (
              <div className="c103-pop__menu c103-pop__menu--chapters" role="menu" aria-label="장면 목록">
                {SCENES.map((item, index) => (
                  <button type="button" role="menuitem" key={item.id} className={index === sceneIndex ? 'is-on' : ''} onClick={() => { playScene(index); setMenu('') }}>
                    <span>{item.eyebrow}</span><small>{fmt(SCENE_OFFSETS[index])}</small>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="c103-bar__right">
          <div className="c103-pop">
            <button type="button" className={`c103-icon c103-icon--text${prefs.rate !== 1 ? ' is-on' : ''}`} onClick={() => setMenu(menu === 'speed' ? '' : 'speed')} aria-haspopup="menu" aria-expanded={menu === 'speed'} aria-label={`재생 속도 ${prefs.rate}배`}>{prefs.rate}×</button>
            {menu === 'speed' ? (
              <div className="c103-pop__menu" role="menu" aria-label="재생 속도">
                {RATES.map(rate => (
                  <button type="button" role="menuitemradio" aria-checked={prefs.rate === rate} key={rate} className={prefs.rate === rate ? 'is-on' : ''} onClick={() => { updatePrefs({ rate }); setMenu('') }}>{rate === 1 ? '보통' : `${rate}×`}</button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="c103-pop">
            <button type="button" className={`c103-icon${muted ? ' is-off' : ''}`} onClick={() => setMenu(menu === 'volume' ? '' : 'volume')} aria-label={muted ? '소리 켜기' : '볼륨'}>
              <Icon name={muted ? 'mute' : prefs.volume < 0.5 ? 'volumeLow' : 'volume'} />
            </button>
            {menu === 'volume' ? (
              <div className="c103-pop__menu c103-pop__menu--volume" role="group" aria-label="소리">
                {volumeWorks ? (
                  <input type="range" min="0" max="1" step="0.05" value={prefs.muted ? 0 : prefs.volume} aria-label="볼륨 크기"
                    onChange={event => updatePrefs({ volume: Number(event.target.value), muted: Number(event.target.value) === 0 })} />
                ) : <span className="c103-pop__hint">크기는 휴대폰 버튼으로</span>}
                <button type="button" onClick={() => updatePrefs({ muted: !prefs.muted })}>{prefs.muted ? '소리 켜기' : '음소거'}</button>
                <button type="button" className={prefs.sfx ? 'is-on' : ''} aria-pressed={prefs.sfx} onClick={() => updatePrefs({ sfx: !prefs.sfx })}>효과음 {prefs.sfx ? '켬' : '끔'}</button>
              </div>
            ) : null}
          </div>
          <button type="button" className={`c103-icon${prefs.subtitles ? ' is-on' : ' is-dim'}`} onClick={() => updatePrefs({ subtitles: !prefs.subtitles })} aria-pressed={prefs.subtitles} aria-label={prefs.subtitles ? '자막 끄기' : '자막 켜기'}><Icon name="cc" /></button>
          {full && <button type="button" className="c103-icon c103-icon--text" onClick={() => enterFull(orient === 'landscape' ? 'portrait' : 'landscape')} aria-label={orient === 'landscape' ? '세로로 보기' : '가로로 보기'}><Icon name="rotate" /><span className="c103-icon__label">{orient === 'landscape' ? '세로' : '가로'}</span></button>}
          <button type="button" className="c103-icon c103-fullscreen" onClick={full ? leaveFull : () => enterFull('portrait')} aria-label={full ? '전체화면 끄기' : '전체화면'} title={full ? '전체화면 끄기 (Esc)' : '전체화면 · ←/→ 5초 이동 · ↑/↓ 볼륨'}><Icon name={full ? 'exitFull' : 'full'} /></button>
        </div>
      </div>
      {error ? <p className="c103-error" role="alert">{error}</p> : null}
      {!full ? (
        <div className="c103-controls__meta">
          <span>음성은 인터넷으로 흘려 받아요</span>
          <span>근거: {scene.source}</span>
        </div>
      ) : null}
    </div>
  )

  const modal = open ? createPortal(
    <div
      className={`c103-overlay${full ? ' is-full' : ''}${full ? ` is-${orient}` : ''}${rotated ? ' is-rotated' : ''}${chromeHidden ? ' is-chrome-hidden' : ''}`}
      style={{ '--c103-rate': prefs.rate, '--c103-ctrl-h': `${controlsHeight}px` }}
      role="dialog"
      aria-modal="true"
      aria-label={`${definition.title} 칠판 강의`}
      // 마우스는 움직이면 보이고, 손가락은 칠판을 눌러야 보인다(누르는 사이 움직임으로 다시 켜지지 않게)
      onPointerMove={full ? e => { if (e.pointerType === 'mouse') pokeChrome() } : undefined}
    >
      <div className="c103-shell">
        <header className="c103-header">
          <div>
            <span className="c103-kicker">봄기출 칠판 강의</span>
            <h2>{definition.title}</h2>
            {lectureId ? <LectureViewCount lectureId={lectureId} record className="c103-views" /> : null}
          </div>
          {!full && <button type="button" className="c103-close" onClick={stop} aria-label="닫기">✕</button>}
        </header>
        {/* 전체화면에선 칠판을 살짝 누르면 조작부가 나오고, 보일 때 누르면 들어간다(유튜브처럼) — 재생·멈춤은 조작부 단추로 */}
        <div
          className="c103-stage"
          onClick={full ? () => { if (chromeHidden) pokeChrome(); else { clearTimeout(hideTimer.current); setChromeHidden(true) } } : undefined}
        >
          <ChalkBoard scene={scene} index={sceneIndex} shown={shown} done={sceneDone} caption={prefs.subtitles ? caption : ''} captionInset={full && !chromeHidden ? controlsHeight : 0} />
          {solving ? (
            // 쉬는 동안 남은 시간만 — 누를 것 없이 그대로 이어진다(넘기려면 탐색바로)
            <div className="c103-solve" role="timer" aria-live="off" aria-label={`풀어 보는 시간 ${Math.ceil(solving.left)}초 남음`}>
              <span className="c103-solve__label">풀어 보는 시간</span>
              <span className="c103-solve__bar" aria-hidden="true"><i style={{ width: `${(1 - solving.ratio) * 100}%` }} /></span>
              <span className="c103-solve__left">{Math.ceil(solving.left)}초</span>
            </div>
          ) : null}
          {!full ? (
            <div className="c103-stage__side">
              {/* 음성을 못 들을 때(불러오기 실패)만 그 장면 대본 전체를 글로 */}
              {error ? (
                <div className="c103-stage__caption">
                  <span>선생님 말</span>
                  <p>{scene.steps.map(step => step.say).join(' ')}</p>
                </div>
              ) : null}
              {terms.length ? (
                <div className="c103-terms" aria-label="처음 듣는 말">
                  <span>처음 듣는 말</span>
                  <dl>{terms.map(([word, meaning]) => <div key={word}><dt>{word}</dt><dd>{meaning}</dd></div>)}</dl>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        {controls}
        {!full ? (
          <footer className="c103-footer">
            <span>바로 풀어 보기</span>
            {definition.examLinks.map(exam => <a key={exam.href} href={exam.href} target="_blank" rel="noopener noreferrer">{exam.label} ↗</a>)}
            <a href={definition.sourceUrl} target="_blank" rel="noopener noreferrer">{definition.sourceLabel} ↗</a>
          </footer>
        ) : null}
        {!full ? renderFooter?.() : null}
      </div>
    </div>, document.body) : null

  return (
    <>
      <audio ref={audioRef} preload="none" onTimeUpdate={event => { const t = event.currentTarget.currentTime; setPosition(t); recordLecturePosition(progressId, indexRef.current, t) }}
        onLoadedMetadata={event => {
          const audio = event.currentTarget
          applyAudioPrefs(audio)
          if (pendingSeek.current != null) { audio.currentTime = Math.min(pendingSeek.current, audio.duration - 0.1); pendingSeek.current = null }
        }}
        onDurationChange={event => setDuration(event.currentTarget.duration)}
        onPlay={() => { setPlaying(true); setError('') }}
        onPause={event => { if (!event.currentTarget.ended) setPlaying(false) }}
        onEnded={() => {
          // 수강 진행 — 이 장면을 끝까지 들었다(마지막 장면이면 강의 완료)
          finishLectureScene(progressId, indexRef.current, SCENE_LENGTHS, indexRef.current + 1 >= SCENES.length)
          if (indexRef.current + 1 < SCENES.length) playScene(indexRef.current + 1)
          else { setPlaying(false); setCompleted(true) }
        }}
        onError={() => { setPlaying(false); setError('음성을 불러오지 못했습니다. 판서와 자막으로 이어서 보세요.') }} />
      {renderTrigger?.(() => playScene(0), () => {
        // 이어 보기 — 끝까지 듣지 않은 강의는 멈춘 장면·자리부터
        const last = getLectureProgress(progressId)
        if (last && !last.done && (last.lastScene > 0 || last.lastPos > 1)) playScene(Math.min(last.lastScene, SCENES.length - 1), last.lastPos)
        else playScene(0)
      })}
      {modal}
    </>
  )
}

return ChalkLecturePlayer
}
