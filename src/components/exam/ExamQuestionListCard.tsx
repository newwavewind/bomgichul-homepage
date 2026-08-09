import Link from "next/link";

export function ExamQuestionListCard({
  href,
  questionNo,
  stem,
  category,
  subcategory,
}: {
  href: string;
  questionNo: number;
  stem: string;
  category?: string | null;
  subcategory?: string | null;
}) {
  const meta = [category, subcategory && subcategory !== category ? subcategory : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={href}
      className="rounded-2xl border border-mist bg-paper p-5 transition-colors hover:border-carbon"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-snow font-display font-semibold text-ink">
          {questionNo}
        </span>
        <div className="min-w-0">
          <p className="line-clamp-2 font-system text-[15px] leading-6 text-ink">{stem}</p>
          {meta ? <p className="mt-2 font-display text-[12px] text-fog">{meta}</p> : null}
        </div>
      </div>
    </Link>
  );
}
