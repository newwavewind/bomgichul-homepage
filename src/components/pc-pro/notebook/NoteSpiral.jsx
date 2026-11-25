import { useEffect, useId, useRef, useState } from 'react'

/**
 * 제본 스프링 — 종이 위 구멍에 은빛 고리가 끼워진 모습. 고리 수는 폭에 맞춰 CSS 가 간격을 나눈다.
 * 장식이라 읽기 도구에는 숨긴다.
 */
export default function NoteSpiral() {
  // 폭에 맞춰 고리 수를 정한다 — 고리 하나에 약 22px(좁은 휴대폰에서 끝 고리가 종이 밖으로 나가지 않게)
  const id = useId()
  const ref = useRef(null)
  const [count, setCount] = useState(14)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => setCount(Math.max(8, Math.floor((el.clientWidth + 6) / 22)))
    fit()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div className="ccc-spiral" aria-hidden ref={ref}>
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} className="ccc-spiral__ring" viewBox="0 0 16 36" width="16" height="36">
          <defs>
            <linearGradient id={id + "-"+i+"-ccc-wire-front"} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#3f444c" />
              <stop offset="0.3" stopColor="#c9ced6" />
              <stop offset="0.5" stopColor="#ffffff" />
              <stop offset="0.75" stopColor="#9aa1ab" />
              <stop offset="1" stopColor="#40454d" />
            </linearGradient>
            <linearGradient id={id + "-"+i+"-ccc-wire-back"} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#5c6169" />
              <stop offset="0.5" stopColor="#a7adb6" />
              <stop offset="1" stopColor="#4a4f57" />
            </linearGradient>
            <radialGradient id={id + "-"+i+"-ccc-hole"} cx="0.5" cy="0.42" r="0.6">
              <stop offset="0" stopColor="#14161b" />
              <stop offset="0.6" stopColor="#2c3038" />
              <stop offset="0.85" stopColor="#7d838e" />
              <stop offset="1" stopColor="#d8dce3" />
            </radialGradient>
          </defs>
          {/* 종이에 뚫린 구멍 */}
          <ellipse cx="6" cy="27" rx="3.6" ry="3.3" fill={"url(#"+id+"-"+i+"-ccc-hole)"} />
          {/* 뒤로 넘어가는 다리 — 종이 위쪽 가장자리에서 뒤로 사라진다 */}
          <path d="M12.2 13 L12.2 8.5" stroke={"url(#"+id+"-"+i+"-ccc-wire-back)"} strokeWidth="2.6" strokeLinecap="round" fill="none" />
          {/* 고리 그림자 */}
          <path d="M7 27 L7 9 Q7 3.2 10 3.1 Q13 3.2 13 8.5 L13 14" stroke="rgba(15,20,35,0.22)" strokeWidth="3" strokeLinecap="round" fill="none" transform="translate(0.8 1.2)" />
          {/* 앞 다리 — 구멍에서 나와 종이 가장자리를 넘어 위로 둥글게 */}
          <path d="M6 26.5 L6 9 Q6 2.4 9.2 2.2 Q12.2 2.3 12.2 8.5" stroke={"url(#"+id+"-"+i+"-ccc-wire-front)"} strokeWidth="2.8" strokeLinecap="round" fill="none" />
          {/* 금속 반짝임 */}
          <path d="M5.6 22 L5.6 9.5 Q5.7 4.4 8 3.4" stroke="rgba(255,255,255,0.85)" strokeWidth="0.7" strokeLinecap="round" fill="none" />
        </svg>
      ))}
    </div>
  )
}
