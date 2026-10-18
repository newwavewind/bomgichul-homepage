import Image from "next/image";
import Link from "next/link";

export function LogoMark() {
  return (
    <Link
      href="/"
      className="flex min-h-11 items-center gap-1.5 transition-opacity hover:opacity-80"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-[#e8f0ff] shadow-[inset_0_0_0_1px_rgba(29,78,216,0.14)]" aria-hidden>
        <Image
          src="/brand/book-sprout-mark.svg"
          alt=""
          width={27}
          height={27}
          unoptimized
        />
      </span>
      <span className="font-display text-body font-semibold text-ink">봄기출</span>
    </Link>
  );
}
