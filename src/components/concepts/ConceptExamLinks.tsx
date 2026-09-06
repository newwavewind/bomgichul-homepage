import Link from "next/link";
import type { ConceptStatement } from "@/lib/concepts";

function examPath(
  subject: string,
  year: number,
  questionNo: number
) {
  return `/exam/${subject}/${year}/${questionNo}`;
}

/*
 * 예전에는 isLoggedIn 프롭으로 <Link>/<a> 를 갈랐지만, 두 갈래 모두 같은 href 로
 * 가는 앵커였다. 페이지를 정적으로 되돌리며(서버가 로그인 상태를 모른다) <Link>
 * 하나로 통일한다 — 서버 컴포넌트라 useMe 를 부를 수 없고, 부를 이유도 없다.
 */
export function ConceptStatementList(props: {
  statements: ConceptStatement[];
  subject: string;
}) {
  const { statements, subject } = props;
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
        })}
      </ul>
    </>
  );
}

export function ConceptRelatedExamList(props: {
  questions: { year: number; questionNo: number }[];
  subject: string;
}) {
  const { questions, subject } = props;
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
        })}
      </div>
    </>
  );
}
