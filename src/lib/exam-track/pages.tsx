import { QuestionNavLabel } from "@/components/exam/QuestionNavLabel";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExamTrackQuestion } from "@/components/exam-track/ExamTrackQuestion";
import { EnglishPassageNotes } from "@/components/english/EnglishPassageNotes";
import { ExamMaterialFigure } from "@/components/exam/ExamMaterialFigure";
import { ExamStructuredMaterials } from "@/components/exam/ExamStructuredMaterials";
import { ExamSubjectNotice } from "@/components/exam/ExamSubjectNotice";
import { HistoryConceptNote } from "@/components/history/HistoryConceptNote";
import { TrackConceptDetailView } from "@/components/exam-track/TrackConceptDetailView";
import { TrackConceptPartList, type TrackConceptPartGroup } from "@/components/exam-track/TrackConceptPartList";
import type { TrackConceptStatement } from "@/components/exam-track/TrackConceptStatements";
import { TrackLearningTools } from "@/components/exam-track/TrackLearningTools";
import { TrackExamSessionOverview } from "@/components/exam-track/TrackExamSessionOverview";
import { SubjectUnitShare } from "@/components/exam-track/SubjectUnitShare";
import { ExamQuestionJumpBar } from "@/components/exam/ExamQuestionJumpBar";
import {
  ExamQuestionSeoExplanations,
  hasExamQuestionSeoExplanations,
} from "@/components/exam/ExamQuestionSeoExplanations";
import { ExamSeoExplanationDetails } from "@/components/exam/ExamSeoExplanationDetails";
import { ExamSessionCard } from "@/components/exam/ExamSessionCard";
import { ExamSessionGroup } from "@/components/exam/ExamSessionGroup";
import { BookmarkButton } from "@/components/exam/BookmarkButton";
import { QuestionMemoPanel } from "@/components/exam/QuestionMemoPanel";
import { QuestionStem } from "@/components/exam/QuestionStem";
import { getTrackQuestionPresentation } from "@/components/exam-track/questionPresentation";
import {
  SubjectiveAnswer,
  SubjectivePassage,
} from "@/components/exam-track/ExamSubjectiveQuestion";
import { BackLink } from "@/components/ui/BackLink";
import { SimpleAppInstallStrip } from "@/components/ui/SimpleAppInstallStrip";
import { formatExamRefLabel, trackHidesExamSourceLabel } from "@/lib/exam-track/sourceLabel";
import { toExamOxCombos } from "@/lib/exam-track/combo-choices";
import { getConceptCommunityPosts } from "@/lib/concept-community";
import { getUserActivityScores } from "@/lib/activity";
import { examMemoSubjectKey, getPublicMemosForQuestion } from "@/lib/question-memos";
import {
  buildBreadcrumbJsonLd,
  buildExamPageDescription,
  buildExamQuizJsonLd,
  buildPageMetadata,
  buildPublicServiceLearningResourceJsonLd,
  conceptSeoTitle,
  truncateDescription,
} from "@/lib/seo";
import type { ExamTrackConfig, ExamTrackExam, ExamTrackSubjectContent } from "./types";
import { examRenderKind } from "./exam-render";
import "@/app/concepts/concepts-ui.css";
import "@/styles/concepts/conceptsEbook.css";

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
  ) => { year: number; sourceCode: string; count: number; firstQuestionNo: number }[];
  getLinkedExams: (subjectId: string, conceptSlug: string, limit?: number) => (ExamTrackExam | undefined)[];
};

/*
 * generateStaticParams 용 헬퍼 셋 — 전량을 미리 만들면 빌드가 1만 쪽을 사전
 * 렌더하므로, 소량만 돌려주고 나머지는 첫 방문 때 생성·캐시한다(dynamicParams
 * 기본값 true). 여섯 트랙 라우트가 같은 규칙을 나눠 쓴다.
 */

/** 과목 라우트 — 과목은 소수라 전부 미리 만든다. */
export function trackSubjectStaticParams(subjectIds: string[]) {
  return subjectIds.map((subject) => ({ subject }));
}

/** 연도·회차 라우트 — 최근 1개년만 미리 만든다. */
export function trackSessionStaticParams(api: TrackApi, subjectIds: string[]) {
  return subjectIds.flatMap((subject) => {
    const sessions = api.getExamSessions(subject);
    const latestYear = Math.max(...sessions.map((session) => session.year), 0);
    return sessions
      .filter((session) => session.year === latestYear)
      .map((session) => ({ subject, year: String(session.year), source: session.sourceCode }));
  });
}

/** 개념 상세 라우트 — 과목당 앞 10개만 미리 만든다. */
export function trackConceptStaticParams(api: TrackApi, subjectIds: string[]) {
  return subjectIds.flatMap((subject) =>
    (api.getSubject(subject)?.concepts ?? [])
      .slice(0, 10)
      .map((concept) => ({ subject, slug: concept.slug })),
  );
}

function buildTrackConceptStatements(
  trackId: string,
  conceptSlug: string,
  allExams: ExamTrackExam[],
  linkedExams: ExamTrackExam[],
  hrefFor: (exam: ExamTrackExam) => string,
): TrackConceptStatement[] {
  const preciselyTagged = allExams.flatMap((exam) =>
    exam.items
      .filter((item) => item.taxonomy_unit_id === conceptSlug)
      .map((item) => ({ exam, item })),
  );
  const candidates = preciselyTagged.length > 0
    ? preciselyTagged
    : linkedExams.flatMap((exam) => exam.items.map((item) => ({ exam, item })));
  const seen = new Set<string>();
  return candidates
    .filter(({ item }) => item.text.trim().length > 8 && (item.answer === "O" || item.answer === "X"))
    .filter(({ item }) => (seen.has(item.text.trim()) ? false : (seen.add(item.text.trim()), true)))
    .map(({ exam, item }, index) => ({
      id: `${exam.id}:${item.key}:${index}`,
      text: item.text,
      answer: item.answer,
      explanation: item.explanation,
      sourceLabel: formatExamRefLabel(trackId, exam.year, exam.sourceCode, exam.questionNo),
      href: hrefFor(exam),
    }));
}

export function trackConceptListMetadata(track: ExamTrackConfig, api: TrackApi, subjectId: string) {
  const data = api.getSubject(subjectId);
  if (!data) return {};
  return buildPageMetadata({
    title: `${track.label} ${data.subject.label} 기출 올인원`,
    description: `${track.label} ${data.subject.label} 시험에 필요한 핵심 개념 ${data.concepts.length}개를 기출 해설 중심으로 정리했습니다. 단원별 개념과 관련 기출문제를 무료로 학습하세요.`,
    path: `${track.basePath}/concepts/${subjectId}`,
    noIndex: data.concepts.length === 0,
  });
}

export async function TrackConceptListPage({
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
  const groups: TrackConceptPartGroup[] = [];
  for (const concept of data.concepts) {
    const chapter = concept.chapterKo || concept.category || "핵심 개념";
    let part = groups.find((item) => item.chapter === chapter);
    if (!part) {
      part = { chapter, sections: [] };
      groups.push(part);
    }
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
        <BackLink href={track.basePath}>{track.shortLabel} 과목</BackLink>
        <header className="mt-6 border-b border-mist pb-8">
          <h1 className="font-display text-heading font-semibold text-ink">
            {track.label} {data.subject.label} 기출 올인원
          </h1>
          <Link href={`${track.basePath}/exam/${subjectId}`} className="mt-3 inline-flex items-center gap-1 font-display text-body-sm font-semibold text-ios-blue hover:underline">
            {track.label} {data.subject.label} 기출문제 →
          </Link>
        </header>
        <div className="mt-10"><TrackConceptPartList groups={groups} hrefBase={`${track.basePath}/concepts/${subjectId}`} /></div>
        <SimpleAppInstallStrip scope={track.communityScope} />
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
    title: `${conceptSeoTitle(concept.titleKo, concept.sectionKo)} | ${track.label} ${data.subject.label} 기출 올인원`,
    description: truncateDescription(
      `${track.label} ${data.subject.label} · ${concept.titleKo}. ${concept.definition}`,
    ),
    path: `${track.basePath}/concepts/${subjectId}/${slug}`,
  });
}

export async function TrackConceptDetailPage({
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
  const subjectKey = `${track.communityScope}:${subjectId}`;
  // 커뮤니티 글은 공개 데이터라 서버에서 그대로 그린다(SEO 본문 유지).
  // 뷰어별 표시(내 좋아요 등)는 클라이언트 몫이므로 userId 자리는 null 이다.
  const communityPosts = await getConceptCommunityPosts(subjectKey, slug, null);
  const authorIds = [...communityPosts.map((post) => post.user_id), ...communityPosts.flatMap((post) => post.comments.map((comment) => comment.user_id))];
  const activity = await getUserActivityScores(authorIds);
  const authorRanks = Object.fromEntries(Object.entries(activity).map(([id, value]) => [id, value.rank]));
  const hrefFor = (exam: ExamTrackExam) => `${track.basePath}/exam/${subjectId}/${exam.year}/${encodeURIComponent(exam.sourceCode)}/${exam.questionNo}`;
  const statements = buildTrackConceptStatements(track.id, slug, data.exams, linkedExams, hrefFor);
  return (
    <>
    <TrackConceptDetailView
      subjectLabel={data.subject.label}
      listHref={listHref}
      concept={concept}
      linkedExams={linkedExams}
      examHrefFor={(exam) => `${track.basePath}/exam/${subjectId}/${exam.year}/${encodeURIComponent(exam.sourceCode)}/${exam.questionNo}`}
      prev={prev}
      next={next}
      prevHref={prev ? `${listHref}/${prev.slug}` : null}
      nextHref={next ? `${listHref}/${next.slug}` : null}
      subjectKey={subjectKey}
      initialPosts={communityPosts}
      authorRanks={authorRanks}
      statements={statements}
    />
    <div className="px-4 pb-8">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <SimpleAppInstallStrip scope={track.communityScope} />
      </div>
    </div>
    </>
  );
}

export function trackExamSubjectMetadata(track: ExamTrackConfig, api: TrackApi, subjectId: string) {
  const data = api.getSubject(subjectId);
  if (!data) return {};
  return buildPageMetadata({
    title: `${track.label} ${data.subject.label} 기출문제`,
    description: `${track.label} ${data.subject.label} 기출문제 ${data.exams.length}문항을 연도·회차별로 제공합니다. 정답과 선지별 해설을 확인하고 무료로 반복 학습하세요.`,
    path: `${track.basePath}/exam/${subjectId}`,
    noIndex: data.exams.length === 0,
  });
}

export async function TrackExamSubjectPage({
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
  const housingFirstStage = new Set(["accounting", "facilities", "civil-law"]);
  // 경비지도사는 1·2차 모두 객관식이라 2차 과목도 싣는다 — 과목에 따라 「1차」·「2차」로 묶는다.
  const gyeongbiFirstStage = new Set(["beophak", "mingan"]);
  const sessionsByGroup = sessions.reduce<Map<string, typeof sessions>>((groups, session) => {
    const groupLabel =
      track.id === "housing"
        ? housingFirstStage.has(subjectId)
          ? "1차"
          : "2차"
        : track.id === "gyeongbi"
          ? gyeongbiFirstStage.has(subjectId)
            ? "1차"
            : "2차"
        // 청소년상담사는 과목이 급수마다 따로라 과목의 급수(「1급」…) 한 묶음으로 보인다.
        : track.id === "youth"
          ? `${data.subject.track} 필기`
        : track.id === "haengjeongsa" || track.id === "semusa" || track.id === "sanan" || track.id === "sonhae" || track.id === "nomusa"
          ? "1차 필기"
          : trackHidesExamSourceLabel(track.id)
            ? track.sessionEyebrow
            : session.sourceCode;
    groups.set(groupLabel, [...(groups.get(groupLabel) ?? []), session]);
    return groups;
  }, new Map());
  return (
    <div className="bg-white px-4 py-8 md:py-12">
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
        <BackLink href={track.basePath}>{track.shortLabel} 과목</BackLink>
        <header className="mt-6 border-b border-mist pb-8">
          <h1 className="font-display text-heading font-semibold text-ink">
            {track.label} {data.subject.label} 기출문제
          </h1>
        </header>
        <TrackLearningTools
          scope={track.communityScope}
          subjectId={subjectId}
          basePath={track.basePath}
          exams={data.exams}
        />
        <SubjectUnitShare exams={data.exams.filter((exam) => examRenderKind(exam))} subjectLabel={data.subject.label} />
        <section className="mt-10">
          {sessions.length === 0 ? (
            // 트랙을 먼저 세우고 기출을 뒤에 싣는 시험(경비지도사)에서 빈 화면 대신 알린다.
            <p className="max-w-2xl rounded-[var(--radius-cards)] border border-mist bg-paper px-5 py-4 font-display text-body-sm text-smoke">
              {data.subject.label} 연도별 문항은{" "}
              <Link href={track.basePath} className="font-semibold text-[#0066d6] underline-offset-2 hover:underline">
                {track.shortLabel} 학습 홈
              </Link>
              의 다른 과목에서 해설과 함께 풀 수 있습니다.
            </p>
          ) : null}
          <div className={`grid gap-6 ${sessionsByGroup.size > 1 ? "lg:grid-cols-2" : "max-w-2xl"}`}>
            {[...sessionsByGroup.entries()].map(([groupLabel, groupSessions]) => (
              <ExamSessionGroup key={groupLabel} title={groupLabel}>
                {groupSessions.map((session) => (
                  <ExamSessionCard
                    key={`${session.year}-${session.sourceCode}`}
                    href={`${track.basePath}/exam/${subjectId}/${session.year}/${encodeURIComponent(session.sourceCode)}`}
                    year={session.year}
                    questionCount={session.count}
                  />
                ))}
              </ExamSessionGroup>
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
  const exams = data.exams.filter(
    (exam) => exam.year === Number(year) && exam.sourceCode === source && examRenderKind(exam),
  );
  const categories = [...new Set(exams.map((exam) => exam.category).filter(Boolean))].slice(0, 4);
  return buildPageMetadata({
    title: `${year}년 ${track.label} ${source} ${data.subject.label} 기출문제 ${exams.length}문항 정답·해설`,
    description: truncateDescription(
      `${year}년 ${source} ${data.subject.label} 기출 ${exams.length}문항의 발문과 정답, 해설 요약을 한 쪽에 모았습니다.` +
        (categories.length ? ` 출제 단원: ${categories.join(", ")}.` : "") +
        " 문항마다 선지별 해설을 보며 직접 풀어 볼 수 있습니다.",
    ),
    path: `${track.basePath}/exam/${subjectId}/${year}/${source}`,
    noIndex: exams.length === 0,
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
  // 예전에는 첫 문항으로 넘기기만 했다(307) — 검색엔진이 색인할 본문이 없는 주소가 사이트맵에
  // 실려 있었다. 이제 그 회차의 문항·정답·해설 요약을 한 쪽에 그린다(2026-10-20).
  const exams = data.exams
    .filter((exam) => exam.year === Number(year) && exam.sourceCode === source && examRenderKind(exam))
    .sort((a, b) => a.questionNo - b.questionNo);
  if (!exams.length) notFound();
  const listBase = `${track.basePath}/exam/${subjectId}/${year}/${encodeURIComponent(source)}`;
  const path = `${track.basePath}/exam/${subjectId}/${year}/${source}`;
  const sessions = api.getExamSessions(subjectId);
  const index = sessions.findIndex((session) => String(session.year) === year && session.sourceCode === source);
  const newer = index > 0 ? sessions[index - 1] : null;
  const older = index >= 0 && index < sessions.length - 1 ? sessions[index + 1] : null;
  const sessionHref = (session: { year: number; sourceCode: string }) =>
    `${track.basePath}/exam/${subjectId}/${session.year}/${encodeURIComponent(session.sourceCode)}`;
  const showSource = !trackHidesExamSourceLabel(track.id);
  const title = `${year}년${showSource ? ` ${source}` : ""} ${data.subject.label} 기출문제`;
  return (
    <div className="bg-white px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "홈", path: "/" },
              { name: track.label, path: track.basePath },
              { name: data.subject.label, path: `${track.basePath}/exam/${subjectId}` },
              { name: `${year}년 ${source}`, path },
            ]),
          ),
        }}
      />
      <article className="mx-auto max-w-4xl">
        <BackLink href={`${track.basePath}/exam/${subjectId}`}>{data.subject.label} 연도 선택</BackLink>
        <header className="mt-4 rounded-2xl border border-mist bg-white p-5 md:p-6">
          <p className="font-display text-[13px] font-semibold text-electric-blue">
            {track.label} · {data.subject.label}
          </p>
          <h1 className="mt-1.5 font-display text-[26px] font-semibold leading-snug text-ink md:text-[30px]">{title}</h1>
          <p className="mt-2 font-display text-body-sm text-smoke">
            {exams.length}문항 · 문항마다 정답과 선지별 해설
          </p>
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
                <span aria-hidden>←</span> {older.year}년{showSource ? ` ${older.sourceCode}` : ""}
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link href={sessionHref(newer)} className="rounded-2xl border border-mist px-4 py-3 text-right font-display text-body-sm hover:border-carbon">
                {newer.year}년{showSource ? ` ${newer.sourceCode}` : ""} <span aria-hidden>→</span>
              </Link>
            ) : null}
          </nav>
        ) : null}
        <SimpleAppInstallStrip scope={track.communityScope} />
      </article>
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
  const kind = examRenderKind(exam);
  if (!data || !exam || !kind) return {};
  const subjective = kind === "subjective";
  return buildPageMetadata({
    title: `${exam.year}년 ${track.label} ${exam.sourceCode} ${data.subject.label} ${exam.questionNo}번 기출문제 해설`,
    description: buildExamPageDescription({
      category: exam.category,
      stem: subjective ? [exam.prompt, exam.passage].filter(Boolean).join(" ") : exam.stem ?? "",
      correctChoice: exam.correctChoice,
      explanationSummary: subjective
        ? (exam.blanks ?? [])
            .map((blank) => `${blank.label} ${blank.answer}`)
            .join(", ")
        : exam.explanationSummary,
      items: exam.items,
    }),
    path: `${track.basePath}/exam/${subjectId}/${exam.year}/${exam.sourceCode}/${exam.questionNo}`,
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
  // 보여 줄 본문이 없는 레코드는 500 대신 404 — sitemap 도 같은 규칙으로 제외한다.
  const renderKind = examRenderKind(exam);
  if (!data || !exam || !renderKind) notFound();
  const isSubjective = renderKind === "subjective";
  const session = data.exams
    .filter((item) => item.year === Number(year) && item.sourceCode === source)
    .sort((a, b) => a.questionNo - b.questionNo);
  const position = session.findIndex((item) => item.questionNo === exam.questionNo);
  const previous = position > 0 ? session[position - 1] : null;
  const next = position >= 0 && position < session.length - 1 ? session[position + 1] : null;
  const listBase = `${track.basePath}/exam/${subjectId}/${exam.year}/${encodeURIComponent(exam.sourceCode)}`;
  const detailPath = `${listBase}/${exam.questionNo}`;
  const storageSubject = `${track.communityScope}:${subjectId}:${source}`;
  const memoSubject = examMemoSubjectKey(track.communityScope, subjectId, source);
  // 공개 메모는 SEO 본문이라 서버에서 그대로 그린다. 내 북마크·풀이기록 같은
  // 개인화는 쿠키를 걷어내려고 클라이언트(각 컴포넌트의 자체 조회)로 옮겼다.
  const publicMemos = await getPublicMemosForQuestion(
    memoSubject,
    exam.year,
    exam.questionNo,
    null,
  );
  const title = `${year}년 ${source} ${data.subject.label} ${exam.questionNo}번 기출문제 해설`;
  const canonicalPath = `${track.basePath}/exam/${subjectId}/${exam.year}/${exam.sourceCode}/${exam.questionNo}`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "홈", path: "/" },
    { name: track.label, path: track.basePath },
    { name: data.subject.label, path: `${track.basePath}/exam/${subjectId}` },
    { name: `${year}년 ${source}`, path: `${track.basePath}/exam/${subjectId}/${year}/${source}` },
    { name: `${exam.questionNo}번`, path: canonicalPath },
  ]);
  const questionText = isSubjective
    ? [exam.prompt, exam.passage].filter(Boolean).join("\n")
    : exam.stem ?? "";
  const quizJsonLd = buildExamQuizJsonLd({
    title,
    description: questionText,
    path: canonicalPath,
    subjectLabel: data.subject.label,
    year: exam.year,
    questionNo: exam.questionNo,
    stem: questionText,
    choices: exam.items.map((item) => ({
      label: item.label || item.key,
      text: item.text,
      key: item.key,
    })),
    correctChoice: String(exam.correctChoice ?? ""),
    educationalLevel: track.educationalLevel,
    aboutName: `${track.aboutName} ${data.subject.label}`,
  });
  /*
   * 「모두 몇 개인가」 유형의 선택지. 트랙마다 데이터 모양이 달라 예전에는 빈 배열로
   * 넘겼는데, 그러면 해설에서 ①~④ 중 무엇이 정답인지 적히지 않는다. 화면 쪽과 같은
   * 값을 쓰도록 맞춘다.
   */
  const seoQuestion = { ...exam, comboChoices: toExamOxCombos(exam.comboChoices, exam.correctChoice) };
  /*
   * 「모두 몇 개인가」 문항의 보기 상자는 지문(㉠~㉤)과 한 문장으로 이어진다.
   * 도입부만 지문 위에 따로 상자로 두면 쉼표에서 끊겨 문장이 잘린 것처럼 읽히므로,
   * 그 상자를 지문 바로 위로 내려 함께 그린다. 지문이 선지 자리에 오는 다른 유형
   * (comboChoices 가 없는 문항)은 그대로 둔다.
   */
  const { passageLead, passageLabel } = getTrackQuestionPresentation(exam);
  return (
    <div className="bg-white px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {quizJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
        />
      ) : null}
      <article className="mx-auto max-w-4xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <BackLink
              href={`${track.basePath}/exam/${subjectId}`}
            >
              {data.subject.label} 연도 선택
            </BackLink>
          </div>
          <BookmarkButton subject={storageSubject} year={exam.year} questionNo={exam.questionNo} loginNext={detailPath} />
        </div>
        <ExamQuestionJumpBar
          questionNos={session.map((item) => item.questionNo)}
          current={exam.questionNo}
          hrefBase={listBase}
        />
        <header className="mt-4 rounded-2xl border border-mist bg-white p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
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
          </div>
          <div className="mt-5">
            <ExamSubjectNotice notice={exam.notice} className="mb-4" />
            <QuestionStem
              stem={(isSubjective ? exam.prompt : exam.stem) ?? ""}
              questionNo={exam.questionNo}
              renderBox={passageLead.length === 0}
              underlines={exam.underlines ?? null}
              keepLineBreaks={exam.keepStemLines}
            />
            <ExamStructuredMaterials table={exam.table} stemTail={exam.stemTail} />
          </div>
        </header>
        <div className="mt-6 web-question-layout">
          {isSubjective ? (
            <>
              <SubjectivePassage passage={exam.passage} />
              <ExamSeoExplanationDetails
                subject={storageSubject}
                year={exam.year}
                questionNo={exam.questionNo}
              >
                <SubjectiveAnswer
                  year={exam.year}
                  questionNo={exam.questionNo}
                  subjectLabel={data.subject.label}
                  blanks={exam.blanks}
                  explanation={exam.explanation}
                  legalSources={exam.legalSources}
                />
              </ExamSeoExplanationDetails>
            </>
          ) : (
            <>
              {/* 자료 그림 — 한국사는 「밑줄 그은 (가) 시대」처럼 이것을 봐야만
                  풀리는 문항이 대부분이다. 예전에는 한국사 전용 화면 안에서만
                  그렸는데, 그 화면을 걷어낼 때 그림까지 함께 사라졌다. */}
              <ExamMaterialFigure material={exam.material} questionNo={exam.questionNo} />
              {/* 전 과목이 같은 방식으로 푼다 — 하나를 고르고 「정답 확인」.
                  한국사만 선지마다 O/X 를 매기게 해 두었는데, 앱을 열어 재어
                  보니 앱도 그렇게 하지 않았다. 한 번 고르면 될 것을 다섯 번
                  눌러야 해서 불편하기만 했다. */}
              <ExamTrackQuestion
                exam={exam}
                passageLead={passageLead}
                passageLabel={passageLabel}
                subjectLabel={data.subject.label}
                storageSubject={storageSubject}
                revealSubject={storageSubject}
              />
              {/* 영어는 선지 해설만으로 끝나지 않는다 — 지문 해석과 그 문항에서
                  챙길 어휘를 같은 자리에 붙인다. 다른 트랙에는 이 자료가 없다. */}
              {track.id === "english" ? <EnglishPassageNotes exam={exam} showTranslation={false} /> : null}
              {/* 한국사의 핵심 개념 카드 — 선지 해설이 「왜 이 선지가 참·거짓인가」를
                  답한다면, 이 카드는 「이 문항을 풀려면 무엇을 알아야 했는가」를
                  답한다. 늘 펼쳐 두고 서버에서 그린다 — 채점해야만 나오게 하면
                  크롤러가 이 본문을 영영 못 읽는다. */}
              {exam.concept ? <HistoryConceptNote concept={exam.concept} /> : null}
              {hasExamQuestionSeoExplanations(seoQuestion) ? <ExamSeoExplanationDetails
                subject={storageSubject}
                year={exam.year}
                questionNo={exam.questionNo}
                externallyToggled
              >
                <ExamQuestionSeoExplanations
                  question={seoQuestion}
                  subjectLabel={data.subject.label}
                  embedded
                />
                {/* 영어 지문 해석은 앱처럼 정답 확인 뒤 해설 칸에 함께 펼친다(2026-10-21) —
                    예전엔 선지 아래에 접혀 있어 해설 칸만 보고 「해석이 없다」고 여겼다. */}
                {track.id === "english" && exam.translation ? (
                  <section className="mt-6 rounded-[var(--radius-buttons)] border border-mist/70 px-4 py-3">
                    <h3 className="font-display text-body-sm font-semibold text-ink">지문 해석</h3>
                    <p className="mt-2 whitespace-pre-line font-system text-[15px] leading-[1.8] text-smoke">
                      {exam.translation}
                    </p>
                  </section>
                ) : null}
              </ExamSeoExplanationDetails> : null}
            </>
          )}
        </div>
        <nav aria-label="이전·다음 문제" className="web-question-nav mt-8 grid grid-cols-2 gap-3">
          {previous ? (
            <Link
              href={`${listBase}/${previous.questionNo}`}
              className="rounded-2xl border border-mist px-4 py-3 font-display text-body-sm hover:border-carbon"
            >
              <QuestionNavLabel direction="previous" questionNo={previous.questionNo} />
            </Link>
          ) : (
            <span />
          )}
          <span className="web-question-nav-grade-slot" aria-hidden />
          {next ? (
            <Link
              href={`${listBase}/${next.questionNo}`}
              className="rounded-2xl border border-mist px-4 py-3 text-right font-display text-body-sm hover:border-carbon"
            >
              <QuestionNavLabel direction="next" questionNo={next.questionNo} />
            </Link>
          ) : null}
        </nav>
        <div className="mt-8">
          <QuestionMemoPanel
            subject={memoSubject}
            year={exam.year}
            questionNo={exam.questionNo}
            initialMemos={publicMemos}
            loginNext={detailPath}
          />
        </div>
        <SimpleAppInstallStrip scope={track.communityScope} />
      </article>
    </div>
  );
}
