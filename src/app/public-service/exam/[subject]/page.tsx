import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SimpleAppInstallStrip } from "@/components/ui/SimpleAppInstallStrip";
import { getPublicServiceExamSessions, getPublicServiceSubject } from "@/lib/public-service-content";
import { buildBreadcrumbJsonLd, buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: subjectId } = await params;
  const data = getPublicServiceSubject(subjectId);
  if (!data) return {};
  return buildPageMetadata({ title: `${data.subject.label} 기출문제`, description: `${data.subject.label} 국가직·지방직 기출 ${data.exams.length}문항`, path: `/public-service/exam/${subjectId}` });
}

export default async function PublicServiceExamSubjectPage({ params }: Props) {
  const { subject: subjectId } = await params;
  const data = getPublicServiceSubject(subjectId);
  if (!data) notFound();
  const path = `/public-service/exam/${subjectId}`;
  const description = `${data.subject.label} 국가직·지방직 기출 ${data.exams.length}문항과 정답 해설`;
  const sessions = getPublicServiceExamSessions(subjectId);
  const sessionsBySource = sessions.reduce<Map<string, typeof sessions>>((groups, session) => {
    groups.set(session.sourceCode, [...(groups.get(session.sourceCode) ?? []), session]);
    return groups;
  }, new Map());
  return (
    <div className="px-4 py-8 md:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPublicServiceLearningResourceJsonLd({ name: `${data.subject.label} 국가직·지방직 기출문제`, description, path, learningResourceType: "Quiz" })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([{ name: "홈", path: "/" }, { name: "공무원", path: "/public-service" }, { name: `${data.subject.label} 기출문제`, path }])) }} />
      <div className="mx-auto max-w-[var(--page-max-width)]">
      <Link href="/public-service" className="font-display text-body-sm text-fog hover:text-ink">← 공무원 과목</Link>
      <header className="mt-6 border-b border-mist pb-8">
        <p className="font-display text-[13px] font-semibold text-electric-blue">{data.subject.track} · 기출문제</p>
        <h1 className="mt-2 font-display text-heading font-semibold text-ink">{data.subject.label}</h1>
        <p className="mt-3 font-display text-body text-smoke">{data.years.at(-1)}~{data.years[0]}년 · 원문 {data.exams.length}문항</p>
      </header>
      <section className="mt-10">
        <h2 className="mb-5 font-display text-subheading font-semibold text-ink">시험별 기출</h2>
        <div className={`grid gap-6 ${sessionsBySource.size > 1 ? "lg:grid-cols-2" : "max-w-2xl"}`}>
          {[...sessionsBySource.entries()].map(([sourceCode, sourceSessions]) => (
            <section key={sourceCode} className="rounded-[var(--radius-largecards)] border border-mist bg-snow/60 p-4 md:p-5">
              <div className="mb-4 flex items-center justify-between border-b border-mist pb-4">
                <div>
                  <p className="font-display text-[12px] font-semibold text-electric-blue">9급 공개 기출</p>
                  <h3 className="mt-1 font-display text-[24px] font-semibold text-ink">{sourceCode}</h3>
                </div>
                <span className="rounded-full bg-paper px-3 py-1 font-display text-[12px] text-fog">{sourceSessions.length}개 연도</span>
              </div>
              <div className="space-y-3">{sourceSessions.map((session) => (
                <Link key={`${session.year}-${session.sourceCode}`} href={`/public-service/exam/${subjectId}/${session.year}/${session.sourceCode}`} className="flex items-center justify-between gap-4 rounded-2xl border-[1.5px] border-carbon bg-paper p-5 shadow-[var(--shadow-subtle)] transition-transform hover:-translate-y-0.5">
                  <div>
                    <h4 className="font-display text-[21px] font-semibold text-ink">{session.year}년</h4>
                    <p className="mt-1 font-display text-body-sm text-smoke">{session.count}문항 · 해설 포함</p>
                  </div>
                  <span className="font-display text-body text-fog" aria-hidden>→</span>
                </Link>
              ))}</div>
            </section>
          ))}
        </div>
      </section>
      <SimpleAppInstallStrip scope="public_service" />
      </div>
    </div>
  );
}
