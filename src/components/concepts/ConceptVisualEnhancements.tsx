import type { PitfallCard } from "@/lib/concept-enhancements";

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

export { ConceptVisualGuide } from "@/components/concepts/ConceptKindGuides";
