import { useEffect, useRef, useState } from 'react'

/**
 * 계산 강의 판서 세 가지 — 표준 9장 「같이 푸는 칠판」.
 *  - CalcBoard: 공식 → 숫자 넣기 → 계산 → 결과 상자. 마디마다 한 줄씩 써 내려가고 앞줄은 지우지 않는다.
 *  - GraphBoard: 수요·공급 직선, 교점, 이동 화살표.
 *  - TimelineBoard: 현금흐름 시간 막대(들어오는 돈 위, 나가는 돈 아래).
 * 선은 실제 화면 크기(px)로 그리고 pathLength=1 로 「제 길이 전부」를 그린다(dasharray 숫자를 박지 않는다).
 * 판서 조각 Ink 는 플레이어가 넘겨준다(ChalkFlow 와 같은 방식).
 */

const TAG = { formula: '공식', substitute: '숫자 넣기', compute: '계산', result: '답', note: '메모' }

/**
 * 식 글 — 그대로 쓰되 두 가지만 꾸민다: [[분자|분모]] 는 분수, ^{지수} 는 위 첨자.
 * 띄어쓰기에서 줄이 바뀐다(가로 스크롤 금지). 긴 숫자도 어디서든 끊긴다.
 */
export function FormulaText({ text }) {
  const parts = []
  const src = String(text ?? '')
  const re = /\[\[([^|\]]+)\|([^\]]+)\]\]|\^\{([^}]+)\}/g
  let last = 0
  for (const m of src.matchAll(re)) {
    if (m.index > last) parts.push(src.slice(last, m.index))
    if (m[3] != null) parts.push(<sup key={m.index}>{m[3]}</sup>)
    else parts.push(
      <span key={m.index} className="c103-frac" role="math" aria-label={`${m[2]} 분의 ${m[1]}`}>
        <span className="c103-frac__num"><FormulaText text={m[1]} /></span>
        <span className="c103-frac__den"><FormulaText text={m[2]} /></span>
      </span>,
    )
    last = m.index + m[0].length
  }
  if (last < src.length) parts.push(src.slice(last))
  return <>{parts}</>
}

export function CalcBoard({ calc, shown, Ink }) {
  const on = id => shown.has(id)
  return (
    <div className="c103-calc">
      {calc.facts?.length ? (
        <ul className="c103-calc__facts">
          {calc.facts.map(fact => <Ink as="li" key={fact.id} on={on(fact.id)}><FormulaText text={fact.text} /></Ink>)}
        </ul>
      ) : null}
      <ol className="c103-calc__lines">
        {calc.lines.map(line => (
          <Ink as="li" key={line.id} on={on(line.id)} className={`c103-calc__line is-${line.kind}`}>
            <span className="c103-calc__tag">{line.label ?? TAG[line.kind] ?? ''}</span>
            <span className="c103-calc__expr"><FormulaText text={line.text ?? line.tex} /></span>
            {line.note ? <small className="c103-calc__note">{line.note}</small> : null}
          </Ink>
        ))}
      </ol>
    </div>
  )
}

/** 상자의 실제 너비 — 그림을 px 로 그리려고 잰다 */
function useWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const measure = () => setWidth(el.clientWidth)
    measure()
    const watch = new ResizeObserver(measure)
    watch.observe(el)
    return () => watch.disconnect()
  }, [])
  return [ref, width]
}

/** 두 직선(각각 from·to 두 점)의 교점 — 그래프 좌표(0~1, 아래가 0) */
export function intersect(a, b) {
  const [x1, y1] = a.from, [x2, y2] = a.to, [x3, y3] = b.from, [x4, y4] = b.to
  const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
  if (Math.abs(d) < 1e-12) return null
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d
  return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)]
}

/** 선 끝 화살촉 — 끝점에서 거꾸로 두 갈래 */
function arrowHead(x1, y1, x2, y2, size = 11) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const p = s => `${x2 - size * Math.cos(a + s)},${y2 - size * Math.sin(a + s)}`
  return `M${p(0.45)} L${x2},${y2} L${p(-0.45)}`
}

const TONES = new Set(['a', 'b', 'c', 'd'])
const tone = t => (TONES.has(t) ? t : 'a')

export function GraphBoard({ graph, shown, Ink }) {
  const on = id => shown.has(id)
  const [ref, w] = useWidth()
  const h = Math.round(Math.min(340, Math.max(220, w * 0.64)))
  const pad = { l: 40, r: 26, t: 18, b: 34 }
  const X = x => pad.l + x * (w - pad.l - pad.r)
  const Y = y => h - pad.b - y * (h - pad.t - pad.b)
  const lines = Object.fromEntries((graph.lines ?? []).map(line => [line.id, line]))
  return (
    <div className="c103-graph-wrap">
      <div ref={ref} className="c103-graph" style={{ height: h }}>
        {w ? (
          <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
            {/* 축은 그림의 틀이라 처음부터 보인다 */}
            <g className="c103-graph__axis">
              <path d={`M${pad.l},${pad.t - 6} L${pad.l},${h - pad.b} L${w - pad.r + 8},${h - pad.b}`} />
              <path d={arrowHead(pad.l, pad.t + 10, pad.l, pad.t - 6, 8)} />
              <path d={arrowHead(w - pad.r - 8, h - pad.b, w - pad.r + 8, h - pad.b, 8)} />
              <text x={pad.l - 8} y={pad.t + 4} textAnchor="end" className="c103-graph__axis-label">{graph.yLabel ?? '가격'}</text>
              <text x={w - pad.r + 6} y={h - pad.b + 22} textAnchor="end" className="c103-graph__axis-label">{graph.xLabel ?? '수량'}</text>
            </g>
            {(graph.lines ?? []).map(line => {
              const [x1, y1] = line.from, [x2, y2] = line.to
              return (
                <g key={line.id} className={`c103-svgink is-${tone(line.tone)}${on(line.id) ? ' is-on' : ''}${line.dashed ? ' is-dashed' : ''}`}>
                  <line pathLength="1" className="c103-graph__stroke" x1={X(x1)} y1={Y(y1)} x2={X(x2)} y2={Y(y2)} />
                  <text x={X(x2) + (x2 > 0.92 ? -4 : 6)} y={Y(y2) + (y2 > y1 ? -6 : 16)} textAnchor={x2 > 0.92 ? 'end' : 'start'} className="c103-graph__label">{line.label}</text>
                </g>
              )
            })}
            {(graph.points ?? []).map(point => {
              const [a, b] = point.of ?? []
              const at = lines[a] && lines[b] ? intersect(lines[a], lines[b]) : null
              if (!at) return null
              const [px, py] = [X(at[0]), Y(at[1])]
              return (
                <g key={point.id} className={`c103-svgink c103-graph__point${on(point.id) ? ' is-on' : ''}`}>
                  {point.guides !== false ? <>
                    <line pathLength="1" className="c103-graph__guide" x1={px} y1={py} x2={px} y2={h - pad.b} />
                    <line pathLength="1" className="c103-graph__guide" x1={px} y1={py} x2={pad.l} y2={py} />
                  </> : null}
                  <circle cx={px} cy={py} r="5" />
                  <text x={px + 8} y={py - 8} className="c103-graph__label">{point.label}</text>
                  {point.yLabel ? <text x={pad.l - 6} y={py + 5} textAnchor="end" className="c103-graph__tick">{point.yLabel}</text> : null}
                  {point.xLabel ? <text x={px} y={h - pad.b + 20} textAnchor="middle" className="c103-graph__tick">{point.xLabel}</text> : null}
                </g>
              )
            })}
            {(graph.arrows ?? []).map(arrow => {
              const [x1, y1, x2, y2] = [X(arrow.from[0]), Y(arrow.from[1]), X(arrow.to[0]), Y(arrow.to[1])]
              return (
                <g key={arrow.id} className={`c103-svgink c103-graph__arrow is-${tone(arrow.tone ?? 'b')}${on(arrow.id) ? ' is-on' : ''}`}>
                  <line pathLength="1" className="c103-graph__stroke" x1={x1} y1={y1} x2={x2} y2={y2} />
                  <path className="c103-graph__head" d={arrowHead(x1, y1, x2, y2)} />
                  {arrow.label ? <text x={(x1 + x2) / 2} y={Math.min(y1, y2) - 8} textAnchor="middle" className="c103-graph__label">{arrow.label}</text> : null}
                </g>
              )
            })}
          </svg>
        ) : null}
      </div>
      {graph.notes?.map(note => <Ink key={note.id} on={on(note.id)} className="c103-footnote">{note.text}</Ink>)}
    </div>
  )
}

export function TimelineBoard({ timeline, shown, Ink }) {
  const on = id => shown.has(id)
  const [ref, w] = useWidth()
  const n = Math.max(1, timeline.periods ?? 1)
  const pad = 30
  const spacing = (w - pad * 2) / n
  const tight = spacing < 58
  const h = tight ? 236 : 206
  const axisY = Math.round(h / 2) + 4
  const X = i => pad + i * spacing
  const tickLabel = i => timeline.tickLabels?.[i] ?? `${i}${timeline.unit ?? ''}`
  return (
    <div className="c103-timeline-wrap">
      <div ref={ref} className="c103-timeline" style={{ height: h }}>
        {w ? (
          <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
            <g className="c103-graph__axis">
              <path d={`M${pad - 12},${axisY} L${w - pad + 14},${axisY}`} />
              <path d={arrowHead(w - pad, axisY, w - pad + 14, axisY, 8)} />
              {Array.from({ length: n + 1 }, (_, i) => (
                <g key={i}>
                  <path d={`M${X(i)},${axisY - 5} L${X(i)},${axisY + 5}`} />
                  {!tight || i % 2 === 0 || i === n ? <text x={X(i)} y={axisY + 21} textAnchor="middle" className="c103-graph__tick">{tickLabel(i)}</text> : null}
                </g>
              ))}
            </g>
            {(timeline.spans ?? []).map(span => {
              const y = h - 28
              return (
                <g key={span.id} className={`c103-svgink c103-timeline__span${on(span.id) ? ' is-on' : ''}`}>
                  <path pathLength="1" className="c103-graph__stroke" d={`M${X(span.from)},${y - 6} L${X(span.from)},${y} L${X(span.to)},${y} L${X(span.to)},${y - 6}`} />
                  <text x={(X(span.from) + X(span.to)) / 2} y={y + 19} textAnchor="middle" className="c103-graph__label">{span.label}</text>
                </g>
              )
            })}
            {(timeline.marks ?? []).map((mark, k) => {
              const up = mark.tone !== 'out'
              const len = 44 + (tight && k % 2 ? 20 : 0)
              const x = X(mark.at)
              const y2 = up ? axisY - len : axisY + len
              const y1 = up ? axisY - 4 : axisY + 4
              return (
                <g key={mark.id} className={`c103-svgink c103-timeline__mark is-${up ? 'in' : 'out'}${on(mark.id) ? ' is-on' : ''}`}>
                  <line pathLength="1" className="c103-graph__stroke" x1={x} y1={y1} x2={x} y2={y2} />
                  <path className="c103-graph__head" d={arrowHead(x, y1, x, y2, 8)} />
                  <text x={x} y={up ? y2 - 7 : y2 + 17} textAnchor="middle" className="c103-timeline__amount">{mark.amount}</text>
                  {mark.label ? <text x={x} y={up ? y2 - 25 : y2 + 34} textAnchor="middle" className="c103-graph__tick">{mark.label}</text> : null}
                </g>
              )
            })}
          </svg>
        ) : null}
      </div>
      {timeline.notes?.map(note => <Ink key={note.id} on={on(note.id)} className="c103-footnote">{note.text}</Ink>)}
    </div>
  )
}
