import { plainStudyText } from "@/lib/study-text";
import type { ExamTrackExamBlank } from "@/lib/exam-track/types";

/** 주관식(단답형) 지문 — 빈칸 ( ㄱ )이 들어 있는 법령 조문 인용문 */
export function SubjectivePassage({ passage }: { passage?: string }) {
  if (!passage?.trim()) return null;

  return (
    <section
      className="rounded-2xl border border-mist bg-paper px-5 py-5"
      aria-label="지문"
    >
      <p className="whitespace-pre-wrap font-display text-body leading-relaxed text-ink">
        {plainStudyText(passage)}
      </p>
    </section>
  );
}

/**
 * 주관식 정답과 해설. 2단계와 같은 원칙 — 초기 HTML에 본문으로 담고
 * 화면에서는 상위 details 가 접어 둔다.
 */
export function SubjectiveAnswer({
  year,
  questionNo,
  subjectLabel,
  blanks = [],
  explanation,
  legalSources = [],
}: {
  year: number;
  questionNo: number;
  subjectLabel: string;
  blanks?: ExamTrackExamBlank[];
  explanation?: string;
  legalSources?: string[];
}) {
  const answered = blanks.filter((blank) => blank.answer?.trim());
  if (answered.length === 0 && !explanation?.trim()) return null;

  return (
    <section aria-label="문항 해설">
      <h2 className="mb-4 font-display text-subheading font-semibold text-ink">
        {year}년 {subjectLabel} {questionNo}번 정답과 해설
      </h2>

      {answered.length > 0 ? (
        <dl className="mb-6 space-y-2">
          {answered.map((blank) => (
            <div
              key={blank.label}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-[var(--radius-buttons)] border border-mist bg-snow px-4 py-3"
            >
              <dt className="font-display text-body-sm font-medium text-smoke">
                ( {blank.label} )
              </dt>
              <dd className="font-display text-body font-semibold text-ink">{blank.answer}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {explanation?.trim() ? (
        <div className="rounded-[var(--radius-buttons)] border border-mist bg-snow px-4 py-3">
          <p className="font-display text-body-sm font-medium text-ink">해설</p>
          <p className="mt-2 whitespace-pre-wrap font-display text-body-sm leading-relaxed text-smoke">
            {plainStudyText(explanation)}
          </p>
        </div>
      ) : null}

      {legalSources.length > 0 ? (
        <div className="mt-4">
          <p className="font-display text-body-sm font-medium text-ink">근거</p>
          <ul className="mt-2 space-y-1">
            {legalSources.map((source) => (
              <li key={source} className="font-display text-body-sm text-smoke">
                {source}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
