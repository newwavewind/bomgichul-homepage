import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicServiceSubject } from "@/lib/public-service-content";
import { BackLink } from "@/components/ui/BackLink";
import { SimpleAppInstallStrip } from "@/components/ui/SimpleAppInstallStrip";
import { TrackConceptPartList, type TrackConceptPartGroup } from "@/components/exam-track/TrackConceptPartList";
import { buildBreadcrumbJsonLd, buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";
import "@/app/concepts/concepts-ui.css";
import "@/styles/concepts/conceptsEbook.css";

type Props = { params: Promise<{ subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: subjectId } = await params;
  const data = getPublicServiceSubject(subjectId);
  if (!data) return {};
  return buildPageMetadata({ title: `9급 공무원 ${data.subject.label} 기출 올인원`, description: `9급 공무원 ${data.subject.label} 핵심 개념 ${data.concepts.length}개를 기출 해설 중심으로 정리했습니다. 단원별 개념과 관련 기출문제를 무료로 학습하세요.`, path: `/public-service/concepts/${subjectId}` });
}

export default async function PublicServiceConceptListPage({ params }: Props) {
  const { subject: subjectId } = await params;
  const data = getPublicServiceSubject(subjectId);
  if (!data) notFound();
  const path = `/public-service/concepts/${subjectId}`;
  const description = `${data.subject.label} 기출 논점을 기본서 목차 순서로 정리한 핵심 개념 ${data.concepts.length}개`;
  const groups: TrackConceptPartGroup[] = [];
  for (const concept of data.concepts) {
    const chapter = concept.chapterKo || concept.category || "핵심 개념";
    let part = groups.find((item) => item.chapter === chapter);
    if (!part) { part = { chapter, sections: [] }; groups.push(part); }
    const section = concept.sectionKo || concept.category || "핵심 개념";
    let sectionGroup = part.sections.find((item) => item.section === section);
    if (!sectionGroup) {
      sectionGroup = { section, orderNo: String(part.sections.length + 1).padStart(2, "0"), items: [] };
      part.sections.push(sectionGroup);
    }
    sectionGroup.items.push(concept);
  }
  return (
    <div className="hp-cx px-4 py-8 md:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPublicServiceLearningResourceJsonLd({ name: `${data.subject.label} 기출 핵심 개념`, description, path, learningResourceType: "Concept" })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([{ name: "홈", path: "/" }, { name: "공무원", path: "/public-service" }, { name: `${data.subject.label} 핵심 개념`, path }])) }} />
      <div className="mx-auto max-w-[var(--page-max-width)]">
      <BackLink href="/public-service">공무원 과목</BackLink>
      <header className="mt-6 border-b border-mist pb-8">
        <h1 className="font-display text-heading font-semibold text-ink">9급 공무원 {data.subject.label} 기출 올인원</h1>
        <Link href={`/public-service/exam/${subjectId}`} className="mt-3 inline-flex items-center gap-1 font-display text-body-sm font-semibold text-ios-blue hover:underline">
          9급 공무원 {data.subject.label} 기출문제 →
        </Link>
      </header>
      <div className="mt-10"><TrackConceptPartList groups={groups} hrefBase={`/public-service/concepts/${subjectId}`} /></div>
        <SimpleAppInstallStrip scope="public_service" />
      </div>
    </div>
  );
}
