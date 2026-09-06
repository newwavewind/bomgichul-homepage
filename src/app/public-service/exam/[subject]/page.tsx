import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SimpleAppInstallStrip } from "@/components/ui/SimpleAppInstallStrip";
import { BackLink } from "@/components/ui/BackLink";
import { TrackLearningTools } from "@/components/exam-track/TrackLearningTools";
import { ExamSessionCard } from "@/components/exam/ExamSessionCard";
import { ExamSessionGroup } from "@/components/exam/ExamSessionGroup";
import { getPublicServiceExamSessions, getPublicServiceSubject, PUBLIC_SERVICE_SUBJECT_IDS } from "@/lib/public-service-content";
import { buildBreadcrumbJsonLd, buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return PUBLIC_SERVICE_SUBJECT_IDS.map((subject) => ({ subject }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: subjectId } = await params;
  const data = getPublicServiceSubject(subjectId);
  if (!data) return {};
  return buildPageMetadata({ title: `9급 공무원 ${data.subject.label} 기출문제`, description: `9급 공무원 ${data.subject.label} 국가직·지방직 기출문제 ${data.exams.length}문항을 연도별로 제공합니다. 정답과 선지별 해설을 확인하고 무료로 반복 학습하세요.`, path: `/public-service/exam/${subjectId}` });
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
      <BackLink href="/public-service">공무원 과목</BackLink>
      <header className="mt-6 border-b border-mist pb-8">
        <h1 className="font-display text-heading font-semibold text-ink">9급 공무원 {data.subject.label} 기출문제</h1>
        <Link href={`/public-service/concepts/${subjectId}`} className="mt-3 inline-flex items-center gap-1 font-display text-body-sm font-semibold text-ios-blue hover:underline">
          9급 공무원 {data.subject.label} 기출 올인원 →
        </Link>
      </header>
      <TrackLearningTools scope="public_service" subjectId={subjectId} basePath="/public-service" exams={data.exams} />
      <section className="mt-10">
        <div className={`grid gap-6 ${sessionsBySource.size > 1 ? "lg:grid-cols-2" : "max-w-2xl"}`}>
          {[...sessionsBySource.entries()].map(([sourceCode, sourceSessions]) => (
            <ExamSessionGroup key={sourceCode} title={sourceCode}>
              {sourceSessions.map((session) => (
                <ExamSessionCard key={`${session.year}-${session.sourceCode}`} href={`/public-service/exam/${subjectId}/${session.year}/${session.sourceCode}`} year={session.year} questionCount={session.count} />
              ))}
            </ExamSessionGroup>
          ))}
        </div>
      </section>
      <SimpleAppInstallStrip scope="public_service" />
      </div>
    </div>
  );
}
