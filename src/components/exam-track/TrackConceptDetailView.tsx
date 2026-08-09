import Link from "next/link";
import { ConceptDetailToc } from "@/components/concepts/ConceptDetailToc";
import type { ConceptTocItem } from "@/lib/concepts/conceptDetailToc";
import type { ExamTrackConcept } from "@/lib/exam-track/types";
import type { PublicServiceConcept, PublicServiceExam } from "@/lib/public-service-content";
import "@/app/concepts/concepts-ui.css";
import "@/styles/concepts/conceptsEbook.css";

type ConceptLike = ExamTrackConcept | PublicServiceConcept;
type ExamLike = Pick<PublicServiceExam, "id" | "year" | "sourceCode" | "questionNo">;

function SectionBlock({
  label,
  index,
  id,
  children,
}: {
  label: string;
  index: number;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="hp-cx-section" id={id}>
      <h2 className="hp-cx-section__label">
        <span className="hp-cx-section__index" aria-hidden>
          {String(index).padStart(2, "0")}
        </span>
        <span>{label}</span>
      </h2>
      <div className="hp-cx-section__body">{children}</div>
    </section>
  );
}

function buildTrackToc(concept: ConceptLike, relatedCount: number): {
  tocItems: ConceptTocItem[];
  relatedIndex: number;
} {
  const tocItems: ConceptTocItem[] = [
    { id: "cx-sec-definition", label: "01", title: "개념 정리" },
  ];
  let n = 2;
  if (concept.intuition?.trim()) {
    tocItems.push({
      id: "cx-sec-intuition",
      label: String(n).padStart(2, "0"),
      title: "이해하기",
    });
    n += 1;
  }
  if (concept.keyPoints?.length) {
    tocItems.push({
      id: "cx-sec-keypoints",
      label: String(n).padStart(2, "0"),
      title: "핵심 포인트",
    });
    n += 1;
  }
  if (concept.pitfalls?.trim() || concept.pitfallCards?.length) {
    tocItems.push({
      id: "cx-sec-pitfalls",
      label: String(n).padStart(2, "0"),
      title: "시험 함정",
    });
    n += 1;
  }
  if (concept.example?.trim()) {
    tocItems.push({
      id: "cx-sec-example",
      label: String(n).padStart(2, "0"),
      title: "한 줄 예시",
    });
    n += 1;
  }
  tocItems.push({
    id: "cx-sec-related",
    label: relatedCount > 0 ? "기출" : String(n).padStart(2, "0"),
    title: "관련 기출",
  });
  return { tocItems, relatedIndex: n };
}

export function TrackConceptDetailView({
  subjectLabel,
  listHref,
  examHrefFor,
  concept,
  linkedExams,
  prev,
  next,
  prevHref,
  nextHref,
}: {
  subjectLabel: string;
  listHref: string;
  examHrefFor: (exam: ExamLike) => string;
  concept: ConceptLike;
  linkedExams: ExamLike[];
  prev?: ConceptLike | null;
  next?: ConceptLike | null;
  prevHref?: string | null;
  nextHref?: string | null;
}) {
  const { tocItems, relatedIndex } = buildTrackToc(concept, linkedExams.length);
  let sectionIndex = 1;

  return (
    <div className="hp-cx px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <Link href={listHref} className="font-display text-body-sm text-fog hover:text-ink">
          ← {subjectLabel} 개념 목록
        </Link>

        <div className="mb-6 mt-5">
          <p className="mb-2 font-display text-eyebrow font-semibold text-[#007AFF]">
            {concept.chapterKo || concept.category}
            {concept.sectionKo || concept.subcategory
              ? ` · ${concept.sectionKo || concept.subcategory}`
              : ""}
          </p>
          <h1 className="font-display text-heading font-semibold tracking-tight text-ink md:text-heading-lg">
            {concept.titleKo}
          </h1>
          {concept.titleEn ? (
            <p className="mt-2 font-display text-body-sm text-smoke">{concept.titleEn}</p>
          ) : null}
        </div>

        <ConceptDetailToc items={tocItems} />

        <article className="hp-cx-card">
          <SectionBlock id="cx-sec-definition" label="개념 정리" index={sectionIndex++}>
            {concept.definition}
          </SectionBlock>
          {concept.intuition?.trim() ? (
            <SectionBlock id="cx-sec-intuition" label="이해하기" index={sectionIndex++}>
              {concept.intuition}
            </SectionBlock>
          ) : null}
          {concept.keyPoints?.length ? (
            <SectionBlock id="cx-sec-keypoints" label="핵심 포인트" index={sectionIndex++}>
              <ol className="hp-cx-bullets">
                {concept.keyPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ol>
            </SectionBlock>
          ) : null}
          {concept.pitfalls?.trim() || concept.pitfallCards?.length ? (
            <SectionBlock id="cx-sec-pitfalls" label="시험 함정" index={sectionIndex++}>
              {concept.pitfalls?.trim() ? (
                <aside className="hp-cx-caution">{concept.pitfalls}</aside>
              ) : null}
              {concept.pitfallCards?.length ? (
                <div className={concept.pitfalls?.trim() ? "mt-4 space-y-3" : "space-y-3"}>
                  {concept.pitfallCards.map((card, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[rgba(70,62,48,0.18)] bg-white/70 p-4"
                    >
                      <p className="font-system text-[14px] leading-6 text-[#b45309]">
                        ✕ {card.wrong}
                      </p>
                      <p className="mt-3 border-t border-[rgba(70,62,48,0.12)] pt-3 font-system text-[14px] leading-6 text-[#0066D6]">
                        ○ {card.correct}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </SectionBlock>
          ) : null}
          {concept.example?.trim() ? (
            <SectionBlock id="cx-sec-example" label="한 줄 예시" index={sectionIndex++}>
              <aside className="hp-cx-map-summary">{concept.example}</aside>
            </SectionBlock>
          ) : null}
        </article>

        <article id="cx-sec-related" className="hp-cx-card">
          <section className="hp-cx-section">
            <div className="hp-cx-questions-head">
              <h2 className="hp-cx-section__label">
                <span className="hp-cx-section__index" aria-hidden>
                  {String(relatedIndex).padStart(2, "0")}
                </span>
                <span>관련 기출</span>
              </h2>
              <span className="hp-cx-questions-count">{linkedExams.length}문항</span>
            </div>
            <div className="hp-cx-section__body">
              {linkedExams.length === 0 ? (
                <p className="font-display text-body-sm text-fog">연결된 기출문제가 아직 없어요.</p>
              ) : (
                <div className="hp-cx-related-list">
                  {linkedExams.map((exam) => (
                    <Link key={exam.id} href={examHrefFor(exam)} className="hp-cx-question-row">
                      <span>
                        {exam.year}년 {exam.sourceCode} {exam.questionNo}번
                      </span>
                      <span className="hp-cx-question-row__go">문제 보기 →</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </article>

        <nav className="hp-cx-pager" aria-label="이전·다음 개념">
          {prev && prevHref ? (
            <Link
              href={prevHref}
              className="hp-cx-pager__btn hp-cx-pager__btn--prev"
              aria-label={`이전: ${prev.titleKo}`}
            >
              <span className="hp-cx-pager__arrow" aria-hidden>
                ←
              </span>
              <span className="hp-cx-pager__label">이전</span>
            </Link>
          ) : (
            <span className="hp-cx-pager__btn hp-cx-pager__btn--disabled" aria-hidden>
              <span className="hp-cx-pager__arrow">←</span>
              <span className="hp-cx-pager__label">이전</span>
            </span>
          )}
          {next && nextHref ? (
            <Link
              href={nextHref}
              className="hp-cx-pager__btn hp-cx-pager__btn--next"
              aria-label={`다음: ${next.titleKo}`}
            >
              <span className="hp-cx-pager__label">다음</span>
              <span className="hp-cx-pager__arrow" aria-hidden>
                →
              </span>
            </Link>
          ) : (
            <span className="hp-cx-pager__btn hp-cx-pager__btn--disabled" aria-hidden>
              <span className="hp-cx-pager__label">다음</span>
              <span className="hp-cx-pager__arrow">→</span>
            </span>
          )}
        </nav>
      </div>
    </div>
  );
}
