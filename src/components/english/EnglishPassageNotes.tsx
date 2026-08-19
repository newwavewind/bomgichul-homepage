import type { ExamTrackExam } from "@/lib/exam-track/types";

/**
 * 문항 아래에 붙는 「지문 해석 · 어휘」 — 공무원 영어 전용.
 *
 * 선지 해설은 「왜 이 선지가 답인가」를 답한다. 그런데 영어 기출은 그것만으로
 * 끝나지 않는다. 지문을 통째로 잘못 읽고도 소거법으로 답을 맞히는 일이 흔하고,
 * 그때 해설만 읽으면 잘못 읽은 채로 넘어간다. 그래서 지문 해석을 붙인다.
 *
 * 어휘도 같은 자리에 둔다. 그 문항에서 챙길 낱말은 그 문항을 푼 직후가 가장
 * 잘 붙는다 — 단어장을 따로 여는 순간 문맥이 끊긴다.
 *
 * 해석을 처음부터 펼쳐 두지는 않는다. 지문 옆에 뜻이 보이면 영어를 읽지 않고
 * 한국어만 읽게 된다. 스스로 읽어 본 뒤에 여는 자리다.
 */
export function EnglishPassageNotes({ exam }: { exam: ExamTrackExam }) {
  const hasTranslation = Boolean(exam.translation);
  const vocab = exam.vocab ?? [];
  if (!hasTranslation && vocab.length === 0) return null;

  return (
    <div className="mt-8 space-y-8">
      {hasTranslation ? (
        <section>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-2 border-b border-mist pb-2 font-display text-[13px] font-semibold text-ink">
              지문 해석
              <span
                aria-hidden
                className="text-fog transition-transform group-open:rotate-180"
              >
                ▾
              </span>
              <span className="ml-auto font-system text-[11px] font-normal text-fog">
                먼저 스스로 읽어 보세요
              </span>
            </summary>
            <p className="mt-3 whitespace-pre-line font-system text-[15px] leading-[1.8] text-smoke">
              {exam.translation}
            </p>
          </details>
        </section>
      ) : null}

      {vocab.length > 0 ? (
        <section>
          <h2 className="flex items-baseline gap-2 border-b border-mist pb-2 font-display text-[13px] font-semibold text-ink">
            어휘 · 표현
            <span className="font-system text-[11px] font-normal text-fog">
              이 문항에서 챙길 {vocab.length}개
            </span>
          </h2>
          <ul className="mt-3 space-y-4">
            {vocab.map((entry, i) => (
              <li key={`${entry.term}-${i}`}>
                <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-display text-[15px] font-semibold text-ink">
                    {entry.term}
                  </span>
                  <span className="font-system text-[14px] text-smoke">{entry.meaning}</span>
                  {entry.level ? (
                    <span className="font-system text-[11px] text-fog">{entry.level}</span>
                  ) : null}
                </p>
                {entry.otherMeanings ? (
                  <p className="mt-1 font-system text-[13px] leading-[1.6] text-fog">
                    다른 뜻 · {entry.otherMeanings}
                  </p>
                ) : null}
                {entry.example ? (
                  <p className="mt-1.5 font-system text-[13px] leading-[1.7] text-smoke">
                    {entry.example}
                    {entry.exampleTranslation ? (
                      <span className="block text-fog">{entry.exampleTranslation}</span>
                    ) : null}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
