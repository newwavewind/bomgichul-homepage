/** iOS·Android에서 같은 모양으로 렌더링되는 봄기출 전용 고급 연필 벡터. */
export default function PencilGlyphIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="2.75 2.75 18.5 18.5"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="bom-pencil-lacquer" x1="7" y1="17" x2="17.5" y2="7.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--pen-body-start, #e79a48)" />
          <stop offset="0.52" stopColor="var(--pen-body-mid, #f3c568)" />
          <stop offset="1" stopColor="var(--pen-body-end, #fff0aa)" />
        </linearGradient>
        <linearGradient id="bom-pencil-metal" x1="14.5" y1="6.8" x2="18.2" y2="10.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--pen-metal-light, #fff8df)" />
          <stop offset="1" stopColor="var(--pen-metal-dark, #c9a85e)" />
        </linearGradient>
      </defs>

      <path
        d="M4.35 20.55 6.15 15.7 16.35 5.5a1.55 1.55 0 0 1 2.19 0l1.02 1.02a1.55 1.55 0 0 1 0 2.19L9.35 18.92l-4.83 1.8a.15.15 0 0 1-.17-.17Z"
        fill="var(--pen-shadow, rgba(22,25,24,.15))"
        transform="translate(.35 .45)"
      />
      <path
        d="m6.18 15.72 8.18-8.18 3.08 3.08-8.18 8.18-3.08-3.08Z"
        fill="url(#bom-pencil-lacquer)"
      />
      <path
        d="m14.36 7.54 1.72-1.72 3.08 3.08-1.72 1.72-3.08-3.08Z"
        fill="url(#bom-pencil-metal)"
      />
      <path
        d="m16.08 5.82.68-.68a1.35 1.35 0 0 1 1.91 0l1.16 1.16a1.35 1.35 0 0 1 0 1.91l-.67.69-3.08-3.08Z"
        fill="var(--pen-eraser, #ef9b8f)"
      />
      <path d="m6.18 15.72 3.08 3.08-4.62 1.72 1.54-4.8Z" fill="var(--pen-wood, #efd3a5)" />
      <path d="m4.64 20.52.58-1.78 1.2 1.2-1.78.58Z" fill="var(--pen-graphite, #252a28)" />
      <path
        d="m7.67 15.68 7.1-7.1"
        stroke="var(--pen-highlight, rgba(255,255,255,.78))"
        strokeWidth=".72"
        strokeLinecap="round"
      />
      <path
        d="M4.35 20.55 6.15 15.7 16.35 5.5a1.55 1.55 0 0 1 2.19 0l1.02 1.02a1.55 1.55 0 0 1 0 2.19L9.35 18.92l-4.83 1.8a.15.15 0 0 1-.17-.17Z"
        stroke="var(--pen-outline, currentColor)"
        strokeWidth=".88"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m6.18 15.72 3.08 3.08M14.36 7.54l3.08 3.08M16.08 5.82l3.08 3.08" stroke="var(--pen-outline, currentColor)" strokeWidth=".72" strokeLinecap="round" />
    </svg>
  )
}
