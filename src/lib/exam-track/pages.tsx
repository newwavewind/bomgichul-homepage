import Link from "next/link";
import { notFound } from "next/navigation";
import { ExamTrackQuestion } from "@/components/exam-track/ExamTrackQuestion";
import { TrackConceptDetailView } from "@/components/exam-track/TrackConceptDetailView";
import type { TrackConceptStatement } from "@/components/exam-track/TrackConceptStatements";
import { TrackLearningTools } from "@/components/exam-track/TrackLearningTools";
import { ExamQuestionJumpBar } from "@/components/exam/ExamQuestionJumpBar";
import {
  ExamQuestionSeoExplanations,
  hasExamQuestionSeoExplanations,
} from "@/components/exam/ExamQuestionSeoExplanations";
import { ExamSeoExplanationDetails } from "@/components/exam/ExamSeoExplanationDetails";
import { ExamSessionCard } from "@/components/exam/ExamSessionCard";
import { ExamSessionGroup } from "@/components/exam/ExamSessionGroup";
import { ExamQuestionListCard } from "@/components/exam/ExamQuestionListCard";
import { BookmarkButton } from "@/components/exam/BookmarkButton";
import { QuestionMemoPanel } from "@/components/exam/QuestionMemoPanel";
import { QuestionStem } from "@/components/exam/QuestionStem";
import { QuestionConceptLinks } from "@/components/concepts/QuestionConceptLinks";
import {
  SubjectiveAnswer,
  SubjectivePassage,
} from "@/components/exam-track/ExamSubjectiveQuestion";
import { BackLink } from "@/components/ui/BackLink";
import { SimpleAppInstallStrip } from "@/components/ui/SimpleAppInstallStrip";
import { getUser } from "@/lib/auth";
import { getAttemptResult } from "@/lib/attempts";
import { isQuestionBookmarked } from "@/lib/bookmarks";
import { getConceptCommunityPosts } from "@/lib/concept-community";
import { getUserActivityScores } from "@/lib/activity";
import { examMemoSubjectKey, getPublicMemosForQuestion } from "@/lib/question-memos";
import {
  buildBreadcrumbJsonLd,
  buildExamPageDescription,
  buildExamQuizJsonLd,
  buildPageMetadata,
  buildPublicServiceLearningResourceJsonLd,
} from "@/lib/seo";
import type { ExamTrackConfig, ExamTrackExam, ExamTrackSubjectContent } from "./types";
import { findTrackConceptsForExamQuestion } from "./concept-matches";
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
  ) => { year: number; sourceCode: string; count: number }[];
  getLinkedExams: (subjectId: string, conceptSlug: string, limit?: number) => (ExamTrackExam | undefined)[];
};

function buildTrackConceptStatements(
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
      sourceLabel: `${exam.year}년 ${exam.sourceCode} ${exam.questionNo}번`,
      href: hrefFor(exam),
    }));
}

export function trackConceptListMetadata(track: ExamTrackConfig, api: TrackApi, subjectId: string) {
  const data = api.getSubject(subjectId);
  if (!data) return {};
  return buildPageMetadata({
    title: `${data.subject.label} 기출 올인원`,
    description: `${track.label} ${data.subject.label} 시험에 필요한 핵심 개념 ${data.concepts.length}개를 기출 해설 중심으로 정리했습니다. 단원별 개념과 관련 기출문제를 무료로 학습하세요.`,
    path: `${track.basePath}/concepts/${subjectId}`,
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
  const groups = new Map<string, typeof data.concepts>();
  for (const concept of data.concepts) {
    const key = concept.chapterKo || concept.category || "핵심 개념";
    groups.set(key, [...(groups.get(key) ?? []), concept]);
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
          <h1 className="font-display text-heading font-semibold text-ink">{data.subject.label}</h1>
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
  const user = await getUser();
  const communityPosts = await getConceptCommunityPosts(subjectKey, slug, user?.id ?? null);
  const authorIds = [...communityPosts.map((post) => post.user_id), ...communityPosts.flatMap((post) => post.comments.map((comment) => comment.user_id))];
  const activity = await getUserActivityScores(authorIds);
  const authorRanks = Object.fromEntries(Object.entries(activity).map(([id, value]) => [id, value.rank]));
  const hrefFor = (exam: ExamTrackExam) => `${track.basePath}/exam/${subjectId}/${exam.year}/${encodeURIComponent(exam.sourceCode)}/${exam.questionNo}`;
  const statements = buildTrackConceptStatements(slug, data.exams, linkedExams, hrefFor);
  return (
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
      userId={user?.id ?? null}
      initialPosts={communityPosts}
      authorRanks={authorRanks}
      statements={statements}
    />
  );
}

export function trackExamSubjectMetadata(track: ExamTrackConfig, api: TrackApi, subjectId: string) {
  const data = api.getSubject(subjectId);
  if (!data) return {};
  return buildPageMetadata({
    title: `${track.label} ${data.subject.label} 기출문제`,
    description: `${track.label} ${data.subject.label} 기출문제 ${data.exams.length}문항을 연도·회차별로 제공합니다. 정답과 선지별 해설을 확인하고 무료로 반복 학습하세요.`,
    path: `${track.basePath}/exam/${subjectId}`,
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
  const user = await getUser();
  const housingFirstStage = new Set(["accounting", "facilities", "civil-law"]);
  const sessionsByGroup = sessions.reduce<Map<string, typeof sessions>>((groups, session) => {
    const groupLabel = track.id === "housing"
      ? housingFirstStage.has(subjectId) ? "1차" : "2차"
      : session.sourceCode;
    groups.set(groupLabel, [...(groups.get(groupLabel) ?? []), session]);
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
          userId={user?.id ?? null}
        />
        <section className="mt-10">
          <div className={`grid gap-6 ${sessionsByGroup.size > 1 ? "lg:grid-cols-2" : "max-w-2xl"}`}>
            {[...sessionsByGroup.entries()].map(([groupLabel, groupSessions]) => (
              <ExamSessionGroup key={groupLabel} title={groupLabel}>
                {groupSessions.map((session) => (
                  <ExamSessionCard
                    key={`${session.year}-${session.sourceCode}`}
                    href={`${track.basePath}/exam/${subjectId}/${session.year}/${session.sourceCode}`}
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
  return buildPageMetadata({
    title: `${year}년 ${track.label} ${source} ${data.subject.label} 기출문제`,
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
        <BackLink href={`${track.basePath}/exam/${subjectId}`}>
          {data.subject.label} 기출 목록
        </BackLink>
        <header className="mt-6 border-b border-mist pb-8">
          <h1 className="font-display text-heading font-semibold text-ink">
            {year}년 {source}
          </h1>
        </header>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {exams.map((exam) => (
            <ExamQuestionListCard
              key={exam.id}
              href={`${track.basePath}/exam/${subjectId}/${year}/${source}/${exam.questionNo}`}
              questionNo={exam.questionNo}
              stem={exam.stem ?? exam.prompt ?? ""}
              category={exam.category}
              subcategory={exam.subcategory}
            />
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
  const kind = examRenderKind(exam);
  if (!data || !exam || !kind) return {};
  const subjective = kind === "subjective";
  return buildPageMetadata({
    title: `${year}년 ${track.label} ${source} ${data.subject.label} ${no}번 기출문제 해설`,
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
  const listBase = `${track.basePath}/exam/${subjectId}/${year}/${encodeURIComponent(source)}`;
  const detailPath = `${listBase}/${exam.questionNo}`;
  const user = await getUser();
  const storageSubject = `${track.communityScope}:${subjectId}:${source}`;
  const [bookmarked, initialAttemptResult] = user
    ? await Promise.all([
        isQuestionBookmarked(user.id, storageSubject, exam.year, exam.questionNo),
        getAttemptResult(user.id, storageSubject, exam.year, exam.questionNo),
      ])
    : [false, null];
  const memoSubject = examMemoSubjectKey(track.communityScope, subjectId, source);
  const publicMemos = await getPublicMemosForQuestion(
    memoSubject,
    exam.year,
    exam.questionNo,
    user?.id,
  );
  const title = `${year}년 ${source} ${data.subject.label} ${exam.questionNo}번 기출문제 해설`;
  const canonicalPath = `${track.basePath}/exam/${subjectId}/${year}/${source}/${exam.questionNo}`;
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
  const relatedConcepts = findTrackConceptsForExamQuestion(data, exam);
  return (
    <div className="px-4 py-8 md:py-12">
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
          <BackLink href={listBase}>{year}년 {source} 목록</BackLink>
          <BookmarkButton subject={storageSubject} year={exam.year} questionNo={exam.questionNo} userId={user?.id ?? null} initialBookmarked={bookmarked} loginNext={detailPath} />
        </div>
        <ExamQuestionJumpBar
          questionNos={session.map((item) => item.questionNo)}
          current={exam.questionNo}
          hrefBase={listBase}
        />
        <header className="mt-4 rounded-2xl border border-mist bg-paper p-5 md:p-6">
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
            <QuestionStem
              stem={(isSubjective ? exam.prompt : exam.stem) ?? ""}
              questionNo={exam.questionNo}
            />
          </div>
        </header>
        <div className="mt-6">
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
              <ExamTrackQuestion
                exam={exam}
                subjectLabel={data.subject.label}
                userId={user?.id ?? null}
                storageSubject={storageSubject}
                revealSubject={storageSubject}
                initialAttemptResult={initialAttemptResult}
              />
              {hasExamQuestionSeoExplanations({ ...exam, comboChoices: [] }) ? <ExamSeoExplanationDetails
                subject={storageSubject}
                year={exam.year}
                questionNo={exam.questionNo}
                externallyToggled
              >
                <ExamQuestionSeoExplanations
                  question={{ ...exam, comboChoices: [] }}
                  subjectLabel={data.subject.label}
                  embedded
                />
              </ExamSeoExplanationDetails> : null}
            </>
          )}
          <QuestionConceptLinks
            concepts={relatedConcepts.map((concept) => ({
              slug: concept.slug,
              titleKo: concept.titleKo,
              href: `${track.basePath}/concepts/${subjectId}/${concept.slug}`,
            }))}
          />
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
