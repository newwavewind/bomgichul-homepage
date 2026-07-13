import type {
  ConceptEnhancement,
  PitfallCard,
  StudyMapEnhancement,
} from "@/lib/concept-enhancements";

function SectionBlock({
  label,
  index,
  children,
}: {
  label: string;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <section className="hp-cx-section">
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

export function ConceptPitfallCards({
  cards,
  fallback,
}: {
  cards: PitfallCard[];
  fallback?: string;
}) {
  const visibleCards = cards.length
    ? cards
    : fallback
      ? [
          {
            wrong: "핵심 구분 기준을 반대로 적용하거나 예외를 일반 원칙처럼 판단한다.",
            correct: fallback,
            generatedFallback: true,
          },
        ]
      : [];
  if (!visibleCards.length) return null;

  return (
    <div className="hp-cx-pitfall-cards">
      {visibleCards.map((card, index) => (
        <div className="hp-cx-pitfall-card" key={`${card.wrong}-${index}`}>
          {card.context ? (
            <div className="hp-cx-pitfall-card__context">
              <div className="hp-cx-pitfall-card__context-head">
                <span>문제 상황</span>
                {card.meta ? <small>{card.meta}</small> : null}
              </div>
              {card.topic ? <strong>{card.topic}</strong> : null}
              <p>{card.context}</p>
            </div>
          ) : null}
          <div className="hp-cx-pitfall-card__wrong">
            <span className="hp-cx-pitfall-card__tag hp-cx-pitfall-card__tag--x" aria-label="틀린 진술">
              X
            </span>
            <span>{card.wrong}</span>
          </div>
          <div className="hp-cx-pitfall-card__correct">
            <span className="hp-cx-pitfall-card__tag hp-cx-pitfall-card__tag--o" aria-label="바른 진술">
              O
            </span>
            <span>{card.correct}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConceptStudyMap({ guide }: { guide: StudyMapEnhancement }) {
  const firstYear = guide.years[0];
  const lastYear = guide.years[guide.years.length - 1];

  return (
    <article className="hp-cx-card hp-cx-visual-card hp-cx-study-map-card">
      <SectionBlock label="한눈에 학습맵" index={5}>
        {guide.breadcrumb.length > 0 ? (
          <div className="hp-cx-map-path" aria-label="개념 위치">
            {guide.breadcrumb.map((item, index) => (
              <span key={`${item}-${index}`}>
                {item}
                {index < guide.breadcrumb.length - 1 ? <i aria-hidden>›</i> : null}
              </span>
            ))}
          </div>
        ) : null}

        <p className="hp-cx-map-summary">
          <span aria-hidden>💡</span>
          {guide.summary}
        </p>

        {guide.rules.length > 0 ? (
          <div
            className={`hp-cx-rule-grid${guide.rules.length === 1 ? " hp-cx-rule-grid--single" : ""}`}
          >
            {guide.rules.map((rule, index) => (
              <article
                key={`${rule.label}-${index}`}
                className="hp-cx-rule"
                style={{ ["--hp-cx-delay" as string]: `${index * 70}ms` }}
              >
                <div className="hp-cx-rule__top">
                  <span>{String(rule.number).padStart(2, "0")}</span>
                  <strong>{rule.label}</strong>
                </div>
                <p>{rule.body}</p>
              </article>
            ))}
          </div>
        ) : null}

        <div className="hp-cx-map-bottom">
          {guide.example ? (
            <figure className="hp-cx-example-flow">
              <figcaption>사례로 적용</figcaption>
              <div className="hp-cx-example-flow__steps" aria-hidden>
                <span>상황</span>
                <i>→</i>
                <span>규칙 대입</span>
                <i>→</i>
                <span>결론</span>
              </div>
              <p>{guide.example}</p>
            </figure>
          ) : null}

          <aside className="hp-cx-memory-card">
            <span className="hp-cx-memory-card__pin" aria-hidden>
              !
            </span>
            <div>
              <strong>시험 직전 한 문장</strong>
              <p>{guide.memory}</p>
            </div>
          </aside>
        </div>

        {guide.years.length > 0 ? (
          <div className="hp-cx-history">
            <div className="hp-cx-history__head">
              <span>
                <strong>{guide.questionCount}</strong>회 연결 출제
              </span>
              <small>
                {firstYear === lastYear ? `${firstYear}년` : `${firstYear}–${lastYear}년`} 기출
                기준
              </small>
            </div>
            <div
              className="hp-cx-history__track"
              aria-label={`관련 기출 연도 ${guide.years.join(", ")}`}
            >
              <div className="hp-cx-history__line" aria-hidden />
              {guide.years.map((year, index) => (
                <span
                  key={year}
                  className="hp-cx-history__year"
                  style={{ ["--hp-cx-delay" as string]: `${index * 55}ms` }}
                >
                  <i aria-hidden />
                  {year}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </SectionBlock>
    </article>
  );
}

export function ConceptVisualGuide({ guide }: { guide: ConceptEnhancement | null }) {
  if (!guide) return null;
  if (guide.kind === "study-map") return <ConceptStudyMap guide={guide} />;

  return (
    <article className="hp-cx-card hp-cx-visual-card">
      <SectionBlock label="한눈에 구조화" index={5}>
        <p className="hp-cx-visual-lede">{guide.summary}</p>

        <div className="hp-cx-tree" aria-label="권리취득 유형 분류도">
          <div className="hp-cx-tree__root">권리의 취득</div>
          <div className="hp-cx-tree__line" aria-hidden />
          <div className="hp-cx-tree__branches">
            {guide.branches.map((branch, index) => (
              <div
                key={branch.type}
                className={`hp-cx-branch hp-cx-branch--${branch.tone}`}
                style={{ ["--hp-cx-delay" as string]: `${index * 90}ms` }}
              >
                <span className="hp-cx-branch__cue">{branch.cue}</span>
                <strong>{branch.type}</strong>
                <p>{branch.description}</p>
                <div className="hp-cx-branch__examples">
                  {branch.examples.map((example) => (
                    <span key={example}>{example}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hp-cx-study-grid">
          <div className="hp-cx-decision">
            <h3>
              <span aria-hidden>✓</span> 10초 판별법
            </h3>
            <ol>
              {guide.decision.map(([number, question, answer]) => (
                <li key={number}>
                  <span className="hp-cx-decision__num">{number}</span>
                  <span>
                    <strong>{question}</strong>
                    <small>{answer}</small>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <figure className="hp-cx-rights-demo">
            <figcaption>저당권 설정을 그림으로 보면</figcaption>
            <div className="hp-cx-rights-demo__land">
              <span className="hp-cx-rights-demo__owner">{guide.scenario.owner}</span>
              <span className="hp-cx-rights-demo__right">{guide.scenario.right}</span>
            </div>
            <p>{guide.scenario.caption}</p>
          </figure>
        </div>

        <aside className="hp-cx-caution">
          <strong>시험 함정</strong>
          <span>{guide.caution}</span>
        </aside>

        <div className="hp-cx-sources">
          <span className="hp-cx-sources__title">법령 근거</span>
          {guide.sources.map((source) => (
            <a key={source.label} href={source.href} target="_blank" rel="noreferrer">
              <strong>{source.label}</strong>
              <span>{source.note}</span>
              <i aria-hidden>↗</i>
            </a>
          ))}
        </div>
      </SectionBlock>
    </article>
  );
}
