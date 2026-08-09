import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ExamTrackQuestion } from "@/components/exam-track/ExamTrackQuestion";
import { TrackConceptDetailView } from "@/components/exam-track/TrackConceptDetailView";
import { ExamQuestionJumpBar } from "@/components/exam/ExamQuestionJumpBar";
import { QuestionMemoPanel } from "@/components/exam/QuestionMemoPanel";
import { QuestionStem } from "@/components/exam/QuestionStem";
import { SimpleAppInstallStrip } from "@/components/ui/SimpleAppInstallStrip";
import { getUser } from "@/lib/auth";
import { examMemoSubjectKey, getPublicMemosForQuestion } from "@/lib/question-memos";
import { buildBreadcrumbJsonLd, buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";
import type { ExamTrackConfig, ExamTrackExam, ExamTrackSubjectContent } from "./types";

type TrackApi = {
  getSubject: (subjectId: string) => ExamTrackSubjectContent | null;
  getConcept: (
    subjectId: string,
    slug: string,
  ) => ExamTrackSubjectContent["concepts"][number] | null;
  getExam: (
    subjectId: string,
    year: number,
    sourceCode: string,
    questionNo: number,
  ) => ExamTrackExam | null;
  getExamSessions: (
    subjectId: string,
  ) => { year: number; sourceCode: string; count: number }[];
  getLinkedExams: (subjectId: string, conceptSlug: string, limit?: number) => (ExamTrackExam | undefined)[];
};

export function trackConceptListMetadata(track: ExamTrackConfig, api: TrackApi, subjectId: string) {
  const data = api.getSubject(subjectId);
  if (!data) return {};
  return buildPageMetadata({
    title: `${data.subject.label} 기출 all-in-one`,
    description: `${data.subject.label} 핵심 개념 ${data.concepts.length}개`,
    path: `${track.basePath}/concepts/${subjectId}`,
  });
}

export function TrackConceptListPage({
  track,
  api,
  subjectId,
}: {
  track: ExamTrackConfig;
  api: TrackApi;
  subjectId: string;
}) {
  const data = api.getSubject(subjectId);
  if (!data) notFound();
  const path = `${track.basePath}/concepts/${subjectId}`;
  const description = `${data.subject.label} 기출 논점을 정리한 핵심 개념 ${data.concepts.length}개`;
  const groups = new Map<string, typeof data.concepts>();
  for (const concept of data.concepts) {
    const key = concept.chapterKo || concept.category || "핵심 개념";
    groups.set(key, [...(groups.get(key) ?? []), concept]);
  }
  return (
    <div className="px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPublicServiceLearningResourceJsonLd({
              name: `${data.subject.label} 기출 핵심 개념`,
              description,
              path,
              learningResourceType: "Concept",
              educationalLevel: track.educationalLevel,
              aboutName: track.aboutName,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "홈", path: "/" },
              { name: track.label, path: track.basePath },
              { name: `${data.subject.label} 핵심 개념`, path },
            ]),
          ),
        }}
      />
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <Link href={track.basePath} className="font-display text-body-sm text-fog hover:text-ink">
          ← {track.shortLabel} 과목
        </Link>
        <header className="mt-6 border-b border-mist pb-8">
          <p className="font-display text-[13px] font-semibold text-electric-blue">
            {data.subject.track} · 기출 all-in-one
          </p>
          <h1 className="mt-2 font-display text-heading font-semibold text-ink">{data.subject.label}</h1>
          <p className="mt-3 font-display text-body text-smoke">
            기출 논점을 정리한 공개 개념 {data.concepts.length}개입니다.
          </p>
          <Link
            href={`${track.basePath}/exam/${subjectId}`}
            className="mt-5 inline-flex rounded-full border border-carbon px-4 py-2 font-display text-body-sm font-semibold text-ink"
          >
            기출문제 보기 →
          </Link>
        </header>
        <div className="mt-10 space-y-10">
          {[...groups.entries()].map(([group, concepts]) => (
            <section key={group}>
              <h2 className="mb-4 font-display text-subheading font-semibold text-ink">{group}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {concepts.map((concept) => (
                  <Link
                    key={concept.slug}
                    href={`${track.basePath}/concepts/${subjectId}/${concept.slug}`}
                    className="rounded-2xl border border-mist bg-paper p-5 shadow-[var(--shadow-subtle)] transition-colors hover:border-carbon"
                  >
                    <p className="font-display text-[12px] text-fog">
                      {concept.sectionKo || concept.subcategory}
                    </p>
                    <h3 className="mt-2 font-display text-[18px] font-semibold text-ink">
                      {concept.titleKo}
                    </h3>
                    <p className="mt-2 line-clamp-2 font-system text-[14px] leading-6 text-smoke">
                      {concept.definition}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export function trackConceptDetailMetadata(
  track: ExamTrackConfig,
  api: TrackApi,
  subjectId: string,
  slug: string,
) {
  const data = api.getSubject(subjectId);
  const concept = api.getConcept(subjectId, slug);
  if (!data || !concept) return {};
  return buildPageMetadata({
    title: `${concept.titleKo} | ${data.subject.label}`,
    description: concept.definition.slice(0, 150),
    path: `${track.basePath}/concepts/${subjectId}/${slug}`,
  });
}

export function TrackConceptDetailPage({
  track,
  api,
  subjectId,
  slug,
}: {
  track: ExamTrackConfig;
  api: TrackApi;
  subjectId: string;
  slug: string;
}) {
  const data = api.getSubject(subjectId);
  const concept = api.getConcept(subjectId, slug);
  if (!data || !concept) notFound();
  const linkedExams = api.getLinkedExams(subjectId, slug, 12).filter(Boolean) as ExamTrackExam[];
  const index = data.concepts.findIndex((item) => item.slug === slug);
  const prev = index > 0 ? data.concepts[index - 1] : null;
  const next =
    index >= 0 && index < data.concepts.length - 1 ? data.concepts[index + 1] : null;
  const listHref = `${track.basePath}/concepts/${subjectId}`;
  return (
    <TrackConceptDetailView
      subjectLabel={data.subject.label}
      listHref={listHref}
      concept={concept}
      linkedExams={linkedExams}
      examHrefFor={(exam) =>
        `${track.basePath}/exam/${subjectId}/${exam.year}/${encodeURIComponent(exam.sourceCode)}/${exam.questionNo}`
      }
      prev={prev}
      next={next}
      prevHref={prev ? `${listHref}/${prev.slug}` : null}
      nextHref={next ? `${listHref}/${next.slug}` : null}
    />
  );
}

export function trackExamSubjectMetadata(track: ExamTrackConfig, api: TrackApi, subjectId: string) {
  const data = api.getSubject(subjectId);
  if (!data) return {};
  return buildPageMetadata({
    title: `${data.subject.label} 기출문제`,
    description: `${data.subject.label} 기출 ${data.exams.length}문항`,
    path: `${track.basePath}/exam/${subjectId}`,
  });
}

export function TrackExamSubjectPage({
  track,
  api,
  subjectId,
}: {
  track: ExamTrackConfig;
  api: TrackApi;
  subjectId: string;
}) {
  const data = api.getSubject(subjectId);
  if (!data) notFound();
  const path = `${track.basePath}/exam/${subjectId}`;
  const description = `${data.subject.label} 기출 ${data.exams.length}문항과 정답 해설`;
  const sessions = api.getExamSessions(subjectId);
  const sessionsBySource = sessions.reduce<Map<string, typeof sessions>>((groups, session) => {
    groups.set(session.sourceCode, [...(groups.get(session.sourceCode) ?? []), session]);
    return groups;
  }, new Map());
  return (
    <div className="px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPublicServiceLearningResourceJsonLd({
              name: `${data.subject.label} 기출문제`,
              description,
              path,
              learningResourceType: "Quiz",
              educationalLevel: track.educationalLevel,
              aboutName: track.aboutName,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "홈", path: "/" },
              { name: track.label, path: track.basePath },
              { name: `${data.subject.label} 기출문제`, path },
            ]),
          ),
        }}
      />
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <Link href={track.basePath} className="font-display text-body-sm text-fog hover:text-ink">
          ← {track.shortLabel} 과목
        </Link>
        <header className="mt-6 border-b border-mist pb-8">
          <p className="font-display text-[13px] font-semibold text-electric-blue">
            {data.subject.track} · 기출문제
          </p>
          <h1 className="mt-2 font-display text-heading font-semibold text-ink">{data.subject.label}</h1>
          <p className="mt-3 font-display text-body text-smoke">
            {data.years.at(-1)}~{data.years[0]}년 · 원문 {data.exams.length}문항
          </p>
        </header>
        <section className="mt-10">
          <h2 className="mb-5 font-display text-subheading font-semibold text-ink">시험별 기출</h2>
          <div className={`grid gap-6 ${sessionsBySource.size > 1 ? "lg:grid-cols-2" : "max-w-2xl"}`}>
            {[...sessionsBySource.entries()].map(([sourceCode, sourceSessions]) => (
              <section
                key={sourceCode}
                className="rounded-[var(--radius-largecards)] border border-mist bg-snow/60 p-4 md:p-5"
              >
                <div className="mb-4 flex items-center justify-between border-b border-mist pb-4">
                  <div>
                    <p className="font-display text-[12px] font-semibold text-electric-blue">
                      {track.sessionEyebrow}
                    </p>
                    <h3 className="mt-1 font-display text-[24px] font-semibold text-ink">{sourceCode}</h3>
                  </div>
                  <span className="rounded-full bg-paper px-3 py-1 font-display text-[12px] text-fog">
                    {sourceSessions.length}개 연도
                  </span>
                </div>
                <div className="space-y-3">
                  {sourceSessions.map((session) => (
                    <Link
                      key={`${session.year}-${session.sourceCode}`}
                      href={`${track.basePath}/exam/${subjectId}/${session.year}/${session.sourceCode}`}
                      className="flex items-center justify-between gap-4 rounded-2xl border-[1.5px] border-carbon bg-paper p-5 shadow-[var(--shadow-subtle)] transition-transform hover:-translate-y-0.5"
                    >
                      <div>
                        <h4 className="font-display text-[21px] font-semibold text-ink">
                          {session.year}년
                        </h4>
                        <p className="mt-1 font-display text-body-sm text-smoke">
                          {session.count}문항 · 해설 포함
                        </p>
                      </div>
                      <span className="font-display text-body text-fog" aria-hidden>
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
        <SimpleAppInstallStrip scope={track.communityScope} />
      </div>
    </div>
  );
}

export function trackExamSessionMetadata(
  track: ExamTrackConfig,
  api: TrackApi,
  subjectId: string,
  year: string,
  source: string,
) {
  const data = api.getSubject(subjectId);
  if (!data) return {};
  return buildPageMetadata({
    title: `${year}년 ${source} ${data.subject.label}`,
    description: `${year}년 ${source} ${data.subject.label} 기출문제와 해설`,
    path: `${track.basePath}/exam/${subjectId}/${year}/${source}`,
  });
}

export function TrackExamSessionPage({
  track,
  api,
  subjectId,
  year,
  source,
}: {
  track: ExamTrackConfig;
  api: TrackApi;
  subjectId: string;
  year: string;
  source: string;
}) {
  const data = api.getSubject(subjectId);
  if (!data) notFound();
  const exams = data.exams
    .filter((exam) => exam.year === Number(year) && exam.sourceCode === source)
    .sort((a, b) => a.questionNo - b.questionNo);
  if (!exams.length) notFound();
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`${track.basePath}/exam/${subjectId}`}
          className="font-display text-body-sm text-fog hover:text-ink"
        >
          ← {data.subject.label} 기출 목록
        </Link>
        <header className="mt-6 border-b border-mist pb-8">
          <p className="font-display text-[13px] font-semibold text-electric-blue">{data.subject.label}</p>
          <h1 className="mt-2 font-display text-heading font-semibold text-ink">
            {year}년 {source}
          </h1>
          <p className="mt-3 font-display text-body text-smoke">원문 {exams.length}문항 · 선지별 O/X 해설</p>
        </header>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {exams.map((exam) => (
            <Link
              key={exam.id}
              href={`${track.basePath}/exam/${subjectId}/${year}/${source}/${exam.questionNo}`}
              className="rounded-2xl border border-mist bg-paper p-5 hover:border-carbon"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-snow font-display font-semibold text-ink">
                  {exam.questionNo}
                </span>
                <div>
                  <p className="line-clamp-2 font-system text-[15px] leading-6 text-ink">{exam.stem}</p>
                  <p className="mt-2 font-display text-[12px] text-fog">
                    {exam.category} · {exam.subcategory}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <SimpleAppInstallStrip scope={track.communityScope} />
      </div>
    </div>
  );
}

export function trackExamDetailMetadata(
  track: ExamTrackConfig,
  api: TrackApi,
  subjectId: string,
  year: string,
  source: string,
  no: string,
) {
  const data = api.getSubject(subjectId);
  const exam = api.getExam(subjectId, Number(year), source, Number(no));
  if (!data || !exam) return {};
  return buildPageMetadata({
    title: `${year}년 ${source} ${data.subject.label} ${no}번`,
    description: exam.stem,
    path: `${track.basePath}/exam/${subjectId}/${year}/${source}/${no}`,
  });
}

export async function TrackExamDetailPage({
  track,
  api,
  subjectId,
  year,
  source,
  no,
}: {
  track: ExamTrackConfig;
  api: TrackApi;
  subjectId: string;
  year: string;
  source: string;
  no: string;
}) {
  const data = api.getSubject(subjectId);
  const exam = api.getExam(subjectId, Number(year), source, Number(no));
  if (!data || !exam) notFound();
  const session = data.exams
    .filter((item) => item.year === Number(year) && item.sourceCode === source)
    .sort((a, b) => a.questionNo - b.questionNo);
  const position = session.findIndex((item) => item.questionNo === exam.questionNo);
  const previous = position > 0 ? session[position - 1] : null;
  const next = position >= 0 && position < session.length - 1 ? session[position + 1] : null;
  const listBase = `${track.basePath}/exam/${subjectId}/${year}/${encodeURIComponent(source)}`;
  const detailPath = `${listBase}/${exam.questionNo}`;
  const user = await getUser();
  const memoSubject = examMemoSubjectKey(track.communityScope, subjectId, source);
  const publicMemos = await getPublicMemosForQuestion(
    memoSubject,
    exam.year,
    exam.questionNo,
    user?.id,
  );
  return (
    <div className="px-4 py-8 md:py-12">
      <article className="mx-auto max-w-4xl">
        <Link
          href={listBase}
          className="font-display text-body-sm text-fog hover:text-ink"
        >
          ← {year}년 {source} 목록
        </Link>
        <ExamQuestionJumpBar
          questionNos={session.map((item) => item.questionNo)}
          current={exam.questionNo}
          hrefBase={listBase}
        />
        <header className="mt-4 rounded-2xl border border-mist bg-paper p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <p className="font-display text-[13px] font-semibold text-electric-blue">
              {data.subject.label} · {year}년 {source}
            </p>
            {exam.category ? (
              <span className="rounded-full bg-snow px-2.5 py-0.5 font-display text-[12px] text-smoke">
                {exam.category}
              </span>
            ) : null}
            {exam.subcategory && exam.subcategory !== exam.category ? (
              <span className="rounded-full bg-snow px-2.5 py-0.5 font-display text-[12px] text-smoke">
                {exam.subcategory}
              </span>
            ) : null}
          </div>
          <div className="mt-5">
            <QuestionStem stem={exam.stem} questionNo={exam.questionNo} />
          </div>
        </header>
        <div className="mt-6">
          <ExamTrackQuestion exam={exam} subjectLabel={data.subject.label} />
        </div>
        <nav className="mt-8 grid grid-cols-2 gap-3">
          {previous ? (
            <Link
              href={`${listBase}/${previous.questionNo}`}
              className="rounded-2xl border border-mist px-4 py-3 font-display text-body-sm hover:border-carbon"
            >
              ← {previous.questionNo}번
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`${listBase}/${next.questionNo}`}
              className="rounded-2xl border border-mist px-4 py-3 text-right font-display text-body-sm hover:border-carbon"
            >
              {next.questionNo}번 →
            </Link>
          ) : null}
        </nav>
        <div className="mt-8">
          <QuestionMemoPanel
            subject={memoSubject}
            year={exam.year}
            questionNo={exam.questionNo}
            userId={user?.id ?? null}
            initialMemos={publicMemos}
            loginNext={detailPath}
          />
        </div>
      </article>
    </div>
  );
}
