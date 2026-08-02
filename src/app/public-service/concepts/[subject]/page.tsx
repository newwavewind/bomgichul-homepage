import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicServiceSubject } from "@/lib/public-service-content";
import { buildBreadcrumbJsonLd, buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: subjectId } = await params;
  const data = getPublicServiceSubject(subjectId);
  if (!data) return {};
  return buildPageMetadata({ title: `${data.subject.label} 기출 all-in-one`, description: `${data.subject.label} 핵심 개념 ${data.concepts.length}개`, path: `/public-service/concepts/${subjectId}` });
}

export default async function PublicServiceConceptListPage({ params }: Props) {
  const { subject: subjectId } = await params;
  const data = getPublicServiceSubject(subjectId);
  if (!data) notFound();
  const path = `/public-service/concepts/${subjectId}`;
  const description = `${data.subject.label} 기출 논점을 기본서 목차 순서로 정리한 핵심 개념 ${data.concepts.length}개`;
  const groups = new Map<string, typeof data.concepts>();
  for (const concept of data.concepts) {
    const key = concept.chapterKo || concept.category || "핵심 개념";
    groups.set(key, [...(groups.get(key) ?? []), concept]);
  }
  return (
    <div className="px-4 py-8 md:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPublicServiceLearningResourceJsonLd({ name: `${data.subject.label} 기출 핵심 개념`, description, path, learningResourceType: "Concept" })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([{ name: "홈", path: "/" }, { name: "공무원", path: "/public-service" }, { name: `${data.subject.label} 핵심 개념`, path }])) }} />
      <div className="mx-auto max-w-[var(--page-max-width)]">
      <Link href="/public-service" className="font-display text-body-sm text-fog hover:text-ink">← 공무원 과목</Link>
      <header className="mt-6 border-b border-mist pb-8">
        <p className="font-display text-[13px] font-semibold text-electric-blue">{data.subject.track} · 기출 all-in-one</p>
        <h1 className="mt-2 font-display text-heading font-semibold text-ink">{data.subject.label}</h1>
        <p className="mt-3 font-display text-body text-smoke">기출 논점을 기본서 목차 순서로 정리한 공개 개념 {data.concepts.length}개입니다.</p>
        <Link href={`/public-service/exam/${subjectId}`} className="mt-5 inline-flex rounded-full border border-carbon px-4 py-2 font-display text-body-sm font-semibold text-ink">기출문제 보기 →</Link>
      </header>
      <div className="mt-10 space-y-10">{[...groups.entries()].map(([group, concepts]) => (
        <section key={group}><h2 className="mb-4 font-display text-subheading font-semibold text-ink">{group}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{concepts.map((concept) => (
            <Link key={concept.slug} href={`/public-service/concepts/${subjectId}/${concept.slug}`} className="rounded-2xl border border-mist bg-paper p-5 shadow-[var(--shadow-subtle)] transition-colors hover:border-carbon">
              <p className="font-display text-[12px] text-fog">{concept.sectionKo || concept.subcategory}</p>
              <h3 className="mt-2 font-display text-[18px] font-semibold text-ink">{concept.titleKo}</h3>
              <p className="mt-2 line-clamp-2 font-system text-[14px] leading-6 text-smoke">{concept.definition}</p>
            </Link>
          ))}</div>
        </section>
      ))}</div>
      </div>
    </div>
  );
}
