import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { SimpleAppInstallStrip } from "@/components/ui/SimpleAppInstallStrip";
import { TrackExamSessionOverview } from "@/components/exam-track/TrackExamSessionOverview";
import { getPublicServiceExamSessions, getPublicServiceSubject, PUBLIC_SERVICE_SUBJECT_IDS } from "@/lib/public-service-content";
import { buildBreadcrumbJsonLd, buildPageMetadata, truncateDescription } from "@/lib/seo";

type Props = { params: Promise<{ subject: string; year: string; source: string }> };

// 최근 1개년만 미리 만들고, 지난 연도는 첫 방문 때 생성해 캐시한다.
export function generateStaticParams() {
  return PUBLIC_SERVICE_SUBJECT_IDS.flatMap((subject) => {
    const sessions = getPublicServiceExamSessions(subject);
    const latestYear = Math.max(...sessions.map((session) => session.year), 0);
    return sessions
      .filter((session) => session.year === latestYear)
      .map((session) => ({ subject, year: String(session.year), source: session.sourceCode }));
  });
}

function sessionExams(subjectId: string, year: string, source: string) {
  const data = getPublicServiceSubject(subjectId);
  if (!data) return null;
  const exams = data.exams
    .filter((exam) => exam.year === Number(year) && exam.sourceCode === source)
    .sort((a, b) => a.questionNo - b.questionNo);
  return { data, exams };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: subjectId, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  const found = sessionExams(subjectId, year, source);
  if (!found) return {};
  const { data, exams } = found;
  const categories = [...new Set(exams.map((exam) => exam.category).filter(Boolean))].slice(0, 4);
  return buildPageMetadata({
    title: `${year}년 9급 공무원 ${source} ${data.subject.label} 기출문제 ${exams.length}문항 정답·해설`,
    description: truncateDescription(
      `${year}년 9급 ${source} ${data.subject.label} 기출 ${exams.length}문항의 발문과 정답, 해설 요약을 한 쪽에 모았습니다.` +
        (categories.length ? ` 출제 단원: ${categories.join(", ")}.` : "") +
        " 문항마다 선지별 해설을 보며 직접 풀어 볼 수 있습니다.",
    ),
    path: `/public-service/exam/${subjectId}/${year}/${source}`,
    noIndex: exams.length === 0,
  });
}

/**
 * 공무원 회차 쪽 — 예전에는 첫 문항으로 넘기기만 했다(307). 사이트맵의 회차 주소가 색인할 본문
 * 없이 넘어가 애드센스 「콘텐츠 부족」에 걸렸다(2026-10-20). 시험 트랙 회차 쪽과 같은 모양으로 그린다.
 */
export default async function PublicServiceExamSessionPage({ params }: Props) {
  const { subject: subjectId, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  const found = sessionExams(subjectId, year, source);
  if (!found || !found.exams.length) notFound();
  const { data, exams } = found;
  const listBase = `/public-service/exam/${subjectId}/${year}/${encodeURIComponent(source)}`;
  const path = `/public-service/exam/${subjectId}/${year}/${source}`;
  // 이전·다음 회차는 같은 시험(국가직은 국가직끼리)으로 잇는다.
  const sessions = getPublicServiceExamSessions(subjectId).filter((session) => session.sourceCode === source);
  const index = sessions.findIndex((session) => String(session.year) === year);
  const newer = index > 0 ? sessions[index - 1] : null;
  const older = index >= 0 && index < sessions.length - 1 ? sessions[index + 1] : null;
  const sessionHref = (session: { year: number; sourceCode: string }) =>
    `/public-service/exam/${subjectId}/${session.year}/${encodeURIComponent(session.sourceCode)}`;
  return (
    <div className="bg-white px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "홈", path: "/" },
              { name: "공무원", path: "/public-service" },
              { name: data.subject.label, path: `/public-service/exam/${subjectId}` },
              { name: `${year}년 ${source}`, path },
            ]),
          ),
        }}
      />
      <article className="mx-auto max-w-4xl">
        <BackLink href={`/public-service/exam/${subjectId}`}>{data.subject.label} 연도 선택</BackLink>
        <header className="mt-4 rounded-2xl border border-mist bg-white p-5 md:p-6">
          <p className="font-display text-[13px] font-semibold text-electric-blue">9급 공무원 · {data.subject.label}</p>
          <h1 className="mt-1.5 font-display text-[26px] font-semibold leading-snug text-ink md:text-[30px]">
            {year}년 {source} {data.subject.label} 기출문제
          </h1>
          <p className="mt-2 font-display text-body-sm text-smoke">{exams.length}문항 · 문항마다 정답과 선지별 해설</p>
          <Link
            href={`${listBase}/${exams[0].questionNo}`}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-carbon px-4 py-2 font-display text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            1번부터 풀기 <span aria-hidden>→</span>
          </Link>
        </header>
        <TrackExamSessionOverview
          subjectLabel={data.subject.label}
          year={Number(year)}
          source={source}
          exams={exams}
          hrefFor={(exam) => `${listBase}/${exam.questionNo}`}
        />
        {newer || older ? (
          <nav aria-label="다른 회차" className="mt-8 grid grid-cols-2 gap-3">
            {older ? (
              <Link href={sessionHref(older)} className="rounded-2xl border border-mist px-4 py-3 font-display text-body-sm hover:border-carbon">
                <span aria-hidden>←</span> {older.year}년 {older.sourceCode}
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link href={sessionHref(newer)} className="rounded-2xl border border-mist px-4 py-3 text-right font-display text-body-sm hover:border-carbon">
                {newer.year}년 {newer.sourceCode} <span aria-hidden>→</span>
              </Link>
            ) : null}
          </nav>
        ) : null}
        <SimpleAppInstallStrip scope="public_service" />
      </article>
    </div>
  );
}
