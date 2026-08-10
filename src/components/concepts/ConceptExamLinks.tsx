import Link from "next/link";
import type { ConceptStatement } from "@/lib/concepts";

function examPath(
  subject: string,
  year: number,
  questionNo: number
) {
  return `/exam/${subject}/${year}/${questionNo}`;
}

export function ConceptStatementList(props: {
  statements: ConceptStatement[];
  subject: string;
  returnTo: string;
  isLoggedIn: boolean;
}) {
  const { statements, subject, isLoggedIn } = props;
  if (statements.length === 0) return null;

  return (
    <>
      <ul className="hp-cx-statements">
        {statements.map((statement, i) => {
          const meta = (
            <>
              {statement.year}년 · {statement.questionNo}번 →
            </>
          );

          const href = examPath(subject, statement.year, statement.questionNo);

          if (isLoggedIn) {
            return (
              <li key={`${statement.year}-${statement.questionNo}-${i}`}>
                <Link
                  href={href}
                  className="hp-cx-statement"
                  aria-label={`${statement.year}년 ${statement.questionNo}번 기출문제 보기`}
                >
                  <span className="hp-cx-statement__num" aria-hidden>
                    {i + 1}
                  </span>
                  <span className="hp-cx-statement__body">
                    <span className="hp-cx-statement__text">
                      {statement.text}
                      {statement.modified ? (
                        <span className="hp-cx-statement__modified">수정</span>
                      ) : null}
                    </span>
                    <span className="hp-cx-statement__meta">{meta}</span>
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={`${statement.year}-${statement.questionNo}-${i}`}>
              <a
                href={href}
                className="hp-cx-statement hp-cx-statement--login"
                aria-label={`${statement.year}년 ${statement.questionNo}번 기출문제 보기`}
              >
                <span className="hp-cx-statement__num" aria-hidden>
                  {i + 1}
                </span>
                <span className="hp-cx-statement__body">
                  <span className="hp-cx-statement__text">
                    {statement.text}
                    {statement.modified ? (
                      <span className="hp-cx-statement__modified">수정</span>
                    ) : null}
                  </span>
                  <span className="hp-cx-statement__meta">{meta}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function ConceptRelatedExamList(props: {
  questions: { year: number; questionNo: number }[];
  subject: string;
  returnTo: string;
  isLoggedIn: boolean;
}) {
  const { questions, subject, isLoggedIn } = props;
  if (questions.length === 0) {
    return (
      <p className="font-display text-body-sm text-smoke">연결된 기출문제가 아직 없어요.</p>
    );
  }

  return (
    <>
      <div className="hp-cx-related-list">
        {questions.map((q) => {
          const href = examPath(subject, q.year, q.questionNo);
          if (isLoggedIn) {
            return (
              <Link
                key={`${q.year}-${q.questionNo}`}
                href={href}
                className="hp-cx-question-row"
                aria-label={`${q.year}년 ${q.questionNo}번 기출문제 보기`}
              >
                <span>
                  {q.year}년 · {q.questionNo}번
                </span>
                <span className="hp-cx-question-row__go">문제 보기 →</span>
              </Link>
            );
          }
          return (
            <a
              key={`${q.year}-${q.questionNo}`}
              href={href}
              className="hp-cx-question-row hp-cx-question-row--login"
              aria-label={`${q.year}년 ${q.questionNo}번 기출문제 보기`}
            >
              <span>
                {q.year}년 · {q.questionNo}번
              </span>
              <span className="hp-cx-question-row__go">문제 보기 →</span>
            </a>
          );
        })}
      </div>
    </>
  );
}
