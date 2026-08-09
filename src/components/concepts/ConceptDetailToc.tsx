'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ConceptTocItem } from '@/lib/concepts/conceptDetailToc'

export type { ConceptTocItem }
export { buildConceptDetailTocItems } from '@/lib/concepts/conceptDetailToc'

export function ConceptDetailToc({ items }: { items: ConceptTocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? null)
  const barRef = useRef<HTMLDivElement | null>(null)
  const chipRefs = useRef(new Map<string, HTMLButtonElement>())
  const jumpingRef = useRef(false)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    jumpingRef.current = true
    setActiveId(id)
    const stickyOffset = barRef.current?.offsetHeight ?? 48
    const y = window.scrollY + el.getBoundingClientRect().top - stickyOffset - 8
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
    window.setTimeout(() => {
      jumpingRef.current = false
    }, 700)
  }, [])

  useEffect(() => {
    if (!items.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (jumpingRef.current) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        root: null,
        rootMargin: '-18% 0px -62% 0px',
        threshold: [0.08, 0.2, 0.4],
      },
    )

    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  useEffect(() => {
    const chip = chipRefs.current.get(activeId ?? "")
    const bar = barRef.current
    if (!chip || !bar) return
    const left = chip.offsetLeft - (bar.clientWidth - chip.offsetWidth) / 2
    bar.scrollTo({ left: Math.max(0, left), behavior: "smooth" })
  }, [activeId])

  if (!items.length) return null

  return (
    <nav className="hp-cx-detail-toc" aria-label="개념 목차">
      <div className="hp-cx-detail-toc__bar" ref={barRef} role="list">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="listitem"
            ref={(node) => {
              if (node) chipRefs.current.set(item.id, node)
              else chipRefs.current.delete(item.id)
            }}
            className={`hp-cx-detail-toc__chip${activeId === item.id ? ' is-active' : ''}`}
            title={item.title}
            aria-current={activeId === item.id ? 'true' : undefined}
            onClick={() => scrollToSection(item.id)}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
