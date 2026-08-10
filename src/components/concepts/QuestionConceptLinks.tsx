import Link from "next/link";

export function QuestionConceptLinks({
  concepts,
}: {
  concepts: { slug: string; titleKo: string; href: string }[];
}) {
  if (concepts.length === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-mist bg-paper p-5 md:p-6" aria-labelledby="related-concepts-title">
      <h2 id="related-concepts-title" className="font-display text-[16px] font-semibold text-ink">
        이 문제와 관련된 개념
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {concepts.slice(0, 5).map((concept) => (
          <Link
            key={concept.slug}
            href={concept.href}
            className="rounded-full border border-mist bg-snow px-3 py-2 font-display text-body-sm text-ink transition-colors hover:border-carbon"
          >
            {concept.titleKo} →
          </Link>
        ))}
      </div>
    </section>
  );
}
