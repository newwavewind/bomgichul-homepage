import Link from "next/link";

export function LogoMark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-[#e8f0ff] shadow-[inset_0_0_0_1px_rgba(29,78,216,0.14)]" aria-hidden>
        <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
          <path d="M4.25 7.2C7.55 6.7 10.25 7.45 13.5 9.7V21.65C10.3 19.4 7.55 18.65 4.25 19.2V7.2Z" fill="white" stroke="#1D4ED8" strokeWidth="1.45" strokeLinejoin="round" />
          <path d="M22.75 7.2C19.45 6.7 16.75 7.45 13.5 9.7V21.65C16.7 19.4 19.45 18.65 22.75 19.2V7.2Z" fill="white" stroke="#1D4ED8" strokeWidth="1.45" strokeLinejoin="round" />
          <path d="M13.5 9.45C13.25 6.25 15.2 3.95 18.45 3.7C18.55 6.75 16.75 8.75 13.5 9.45Z" fill="#20A486" />
          <path d="M13.5 9.45C12.95 7.25 11.45 5.9 9.2 5.75C9.25 7.9 10.75 9.15 13.5 9.45Z" fill="#66C8A7" />
          <path d="M13.5 9.5V21.65" stroke="#1D4ED8" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-display text-body font-semibold text-ink">봄기출</span>
    </Link>
  );
}
