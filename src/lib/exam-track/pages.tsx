import Link from "next/link";
import { notFound } from "next/navigation";
import { ExamTrackQuestion } from "@/components/exam-track/ExamTrackQuestion";
import { EnglishPassageNotes } from "@/components/english/EnglishPassageNotes";
import { ExamMaterialFigure } from "@/components/exam/ExamMaterialFigure";
import { ExamStructuredMaterials } from "@/components/exam/ExamStructuredMaterials";
import { HistoryConceptNote } from "@/components/history/HistoryConceptNote";
import { TrackConceptDetailView } from "@/components/exam-track/TrackConceptDetailView";
import { TrackConceptPartList, type TrackConceptPartGroup } from "@/components/exam-track/TrackConceptPartList";
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
import { QuestionStem, toBoxGroups } from "@/components/exam/QuestionStem";
import { QuestionConceptLinks } from "@/components/concepts/QuestionConceptLinks";
import {
  SubjectiveAnswer,
  SubjectivePassage,
} from "@/components/exam-track/ExamSubjectiveQuestion";
import { BackLink } from "@/components/ui/BackLink";
import { SimpleAppInstallStrip } from "@/components/ui/SimpleAppInstallStrip";
import { getUser } from "@/lib/auth";
import { toExamOxCombos } from "@/lib/exam-track/combo-choices";
import { parseQuestionStem } from "@/lib/exam-stem";
import { plainStudyText } from "@/lib/study-text";
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
  conceptSeoTitle,
  truncateDescription,
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
    title: `${track.label} ${data.subject.label} 기출 올인원`,
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
  const user = await getUser();
  const communityPosts = await getConceptCommunityPosts(subjectKey, slug, user?.id ?? null);
  const authorIds = [...communityPosts.map((post) => post.user_id), ...communityPosts.flatMap((post) => post.comments.map((comment) => comment.user_id))];
  const activity = await getUserActivityScores(authorIds);
  const authorRanks = Object.fromEntries(Object.entries(activity).map(([id, value]) => [id, value.rank]));
  const hrefFor = (exam: ExamTrackExam) => `${track.basePath}/exam/${subjectId}/${exam.year}/${encodeURIComponent(exam.sourceCode)}/${exam.questionNo}`;
  const statements = buildTrackConceptStatements(slug, data.exams, linkedExams, hrefFor);
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
      userId={user?.id ?? null}
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
          {/* 개념을 실은 트랙에서만 내건다. 예전에는 무조건 걸려 있어서, 개념이
              비어 있는 트랙(한국사·영어)에서는 눌러도 404 로 떨어졌다. */}
          {data.concepts.length > 0 ? (
            <Link href={`${track.basePath}/concepts/${subjectId}`} className="mt-3 inline-flex items-center gap-1 font-display text-body-sm font-semibold text-ios-blue hover:underline">
              {track.label} {data.subject.label} 기출 올인원 →
            </Link>
          ) : null}
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
    <div className="bg-white px-4 py-8 md:py-12">
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
  const passageGroups = seoQuestion.comboChoices.length > 0
    ? toBoxGroups(parseQuestionStem(plainStudyText(exam.stem ?? "")).boxLines)
    : [];
  const passageLead = passageGroups.flatMap(group => group.lines);
  // 도입부가 없는 문항(20·33번처럼 ㉠부터 바로 시작)은 상자 이름도 없다.
  // 발문이 「아래 <보기>에서」라고 가리키면 그 이름을 세워 준다.
  const passageLabel = passageGroups.find(group => group.label)?.label
    ?? (seoQuestion.comboChoices.length > 0 && /<\s*보\s?기[^>]*>/.test(exam.stem ?? "") ? "< 보기 >" : undefined);
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
          <BackLink href={listBase}>{year}년 {source} 목록</BackLink>
          <BookmarkButton subject={storageSubject} year={exam.year} questionNo={exam.questionNo} userId={user?.id ?? null} initialBookmarked={bookmarked} loginNext={detailPath} />
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
            <QuestionStem
              stem={(isSubjective ? exam.prompt : exam.stem) ?? ""}
              questionNo={exam.questionNo}
              renderBox={passageLead.length === 0}
            />
            <ExamStructuredMaterials table={exam.table} stemTail={exam.stemTail} />
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
                userId={user?.id ?? null}
                storageSubject={storageSubject}
                revealSubject={storageSubject}
                initialAttemptResult={initialAttemptResult}
              />
              {/* 영어는 선지 해설만으로 끝나지 않는다 — 지문 해석과 그 문항에서
                  챙길 어휘를 같은 자리에 붙인다. 다른 트랙에는 이 자료가 없다. */}
              {track.id === "english" ? <EnglishPassageNotes exam={exam} /> : null}
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
        <SimpleAppInstallStrip scope={track.communityScope} />
      </article>
    </div>
  );
}
