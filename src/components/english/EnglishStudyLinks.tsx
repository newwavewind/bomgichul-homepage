import Link from "next/link";

export const englishStudyLinks = [
  { title: "구문 올인원", href: "/english/concepts/gong9" },
  { title: "기출 단어장", href: "/english/wordbook" },
] as const;

export function EnglishStudyLinks() {
  return (
    <nav className="mt-2 grid grid-cols-3 gap-2" aria-label="공무원 영어 학습 도구">
      {englishStudyLinks.map(({ title, href }) => (
        <Link key={href} href={href} prefetch={false}
          className="flex min-h-11 items-center justify-center rounded-[12px] border border-mist bg-paper px-2 text-center text-xs font-semibold text-carbon hover:bg-snow sm:text-sm">
          {title}
        </Link>
      ))}
    </nav>
  );
}
