import { useId, useLayoutEffect, useRef, useState } from 'react'
import '../styles/chalkFlow.css'

// 선은 카드 밖에 그린다. 카드의 글쓰기 clip-path가 화살촉을 잘라내지 않게 한다.
export default function ChalkFlow({ nodes, shown, ink: Ink }) {
  const root = useRef(null)
  const cards = useRef([])
  const markerId = `chalk-flow-${useId().replace(/:/g, '')}`
  const [columns, setColumns] = useState(1)
  const [drawing, setDrawing] = useState({ width: 0, height: 0, edges: [] })

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return undefined
    const measure = () => {
      const width = el.clientWidth
      const nextColumns = Math.max(1, Math.min(nodes.length, width >= 820 ? 4 : width >= 570 ? 3 : width >= 400 ? 2 : 1))
      if (nextColumns !== columns) { setColumns(nextColumns); return }
      const boxes = cards.current.slice(0, nodes.length).map(card => card && ({
        x: card.offsetLeft, y: card.offsetTop, w: card.offsetWidth, h: card.offsetHeight,
      }))
      const edges = nodes.slice(1).flatMap((node, i) => {
        const a = boxes[i]; const b = boxes[i + 1]
        if (!a || !b) return []
        let path
        if (Math.abs(a.y - b.y) < 2) {
          const y = Math.max(a.y, b.y) + Math.min(a.h, b.h) / 2
          path = `M${a.x + a.w + 6},${y} H${b.x - 6}`
        } else {
          const sx = a.x + a.w / 2
          const sy = a.y + a.h + 6
          const ex = b.w > a.w * 1.5 ? Math.min(b.x + b.w - 20, Math.max(b.x + 20, sx)) : b.x + b.w / 2
          const ey = b.y - 6
          if (Math.abs(sx - ex) < 2) path = `M${sx},${sy} V${ey}`
          else {
            const mid = (sy + ey) / 2
            const turn = Math.sign(ex - sx) * 7
            path = `M${sx},${sy} V${mid - 7} Q${sx},${mid} ${sx + turn},${mid} H${ex - turn} Q${ex},${mid} ${ex},${mid + 7} V${ey}`
          }
        }
        return [{ id: node.id, from: nodes[i].id, path }]
      })
      const next = { width, height: el.clientHeight, edges }
      setDrawing(prev => JSON.stringify(prev) === JSON.stringify(next) ? prev : next)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    cards.current.forEach(card => { if (card) observer.observe(card) })
    return () => observer.disconnect()
  }, [columns, nodes])

  return (
    <div ref={root} className="c103-flow lecture-flow" style={{ '--flow-columns': columns }}>
      {drawing.width > 0 && <svg className="lecture-flow__lines" width={drawing.width} height={drawing.height} viewBox={`0 0 ${drawing.width} ${drawing.height}`} aria-hidden="true">
        <defs><marker id={markerId} markerWidth="18" markerHeight="18" refX="16.5" refY="9" viewBox="0 0 18 18" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M1.5 2 16.5 9 1.5 16 5 9Z" className="lecture-flow__tip" />
        </marker></defs>
        {drawing.edges.map(edge => <path key={edge.id} d={edge.path} pathLength="1" markerEnd={`url(#${markerId})`} className={`lecture-flow__line${shown.has(edge.from) && shown.has(edge.id) ? ' is-on' : ''}`} />)}
      </svg>}
      {nodes.map((node, i) => <div key={node.id} ref={el => { cards.current[i] = el }} className={`lecture-flow__slot${columns === 3 && nodes.length % columns === 1 && i === nodes.length - 1 ? ' is-wide' : ''}`}>
        <Ink on={shown.has(node.id)} className={`c103-flow__node${node.tone ? ` is-${node.tone}` : ''}`}>
          <strong>{node.label}</strong><small>{node.sub}</small>
        </Ink>
      </div>)}
    </div>
  )
}
