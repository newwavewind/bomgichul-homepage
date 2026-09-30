/** Shared presentation for the existing crawlable previous/next links. */
export function QuestionNavLabel({
  direction,
  questionNo,
}: {
  direction: "previous" | "next";
  questionNo: number;
}) {
  const next = direction === "next";
  const chevron = (
    <span className="web-question-nav-icon" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d={next ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
  return (
    <span className={`web-question-nav-content${next ? " web-question-nav-content--next" : ""}`}>
      {!next && chevron}
      <span className="web-question-nav-copy">
        <span className="web-question-nav-caption">{next ? "다음 문제" : "이전 문제"}</span>
        <span className="web-question-nav-number">{questionNo}<span className="web-question-nav-unit">번</span></span>
      </span>
      {next && chevron}
    </span>
  );
}
