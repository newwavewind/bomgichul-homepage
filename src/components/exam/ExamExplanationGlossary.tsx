"use client";

import { PcGlossaryTerm, useQuestionGlossaryTerms } from "@/components/pc-pro/PcStudyAction";
import type { PcQuestionAccess } from "@/lib/pc-access/study-features";
import { ExplanationAppFeatureButton } from "@/components/exam/ExplanationAppFeatures";
import type { ChoiceGlossary } from "@/lib/exam-glossary";

function TermPlus() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none">
      <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ExamExplanationGlossary({ glossary, hasApp, choice, pro }: { glossary?: ChoiceGlossary; hasApp: boolean; choice: string; pro?: PcQuestionAccess }) {
  const native = useQuestionGlossaryTerms(choice);
  const terms = native?.length ? native : glossary?.terms ?? [];
  if (!terms.length && !pro) return null;
  const firstDefinition = pro ? undefined : glossary?.firstDefinition;
  const remaining = firstDefinition ? terms.slice(1) : terms;

  return (
    <section aria-label="용어 사전" className="exam-choice-glossary">
      <h3 className="exam-choice-glossary-title">
        <svg aria-hidden viewBox="0 0 24 24" fill="none">
          <path d="M12 6.3C9.4 4.8 6.4 4.5 3.5 5.3v13.2c2.9-.8 5.9-.5 8.5 1 2.6-1.5 5.6-1.8 8.5-1V5.3c-2.9-.8-5.9-.5-8.5 1Z" fill="#E5EDFF" />
          <path d="M12 6.3C9.4 4.8 6.4 4.5 3.5 5.3v13.2c2.9-.8 5.9-.5 8.5 1m0-13.2c2.6-1.5 5.6-1.8 8.5-1v13.2c-2.9-.8-5.9-.5-8.5 1m0-13.2v13.2" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 4.8v5l1.5-1 1.5 1V4.7" fill="#F2BC66" />
          <path d="m6.5 9 2.6.5m-2.6 3 2.6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        용어 사전
      </h3>
      <ul className="flex flex-wrap items-start gap-1.5">
        {firstDefinition ? (
          <li className="max-w-full has-[details[open]]:basis-full">
            <details className="exam-choice-glossary-first">
              <summary className="exam-choice-glossary-term w-fit">
                {terms[0]} <TermPlus />
              </summary>
              <p className="exam-choice-glossary-definition">{firstDefinition}</p>
            </details>
          </li>
        ) : null}
        {pro && !terms.length && (
          <li className="max-w-full has-[.exam-choice-glossary-definition]:basis-full">
            <PcGlossaryTerm choice={choice} term="용어 사전" offers={pro.offers} emptyMessage="이 선지에 등록된 용어가 없어요.">
              용어 보기 <span className="pc-access-pro">Pro</span> <TermPlus />
            </PcGlossaryTerm>
          </li>
        )}
        {remaining.map((term) => (
          <li key={term} className="max-w-full has-[.exam-choice-glossary-definition]:basis-full">
            {pro ? (
              <PcGlossaryTerm choice={choice} term={term} offers={pro.offers}>
                {term} <TermPlus />
              </PcGlossaryTerm>
            ) : hasApp ? (
              <ExplanationAppFeatureButton feature="glossary" className="exam-choice-glossary-term">
                {term} <TermPlus />
              </ExplanationAppFeatureButton>
            ) : (
              <span className="exam-choice-glossary-term">{term}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
