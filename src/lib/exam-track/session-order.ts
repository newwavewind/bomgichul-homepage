type ExamSessionOrder = { year: number; sourceCode: string };

/** 최근 연도부터, 같은 연도의 회차·차수는 큰 번호부터 보여 준다. */
export function compareExamSessionsNewestFirst(a: ExamSessionOrder, b: ExamSessionOrder) {
  if (a.year !== b.year) return b.year - a.year;
  const aRound = /^제?\s*(\d+)\s*(회|차)$/.exec(a.sourceCode.trim());
  const bRound = /^제?\s*(\d+)\s*(회|차)$/.exec(b.sourceCode.trim());
  if (aRound && bRound && aRound[2] === bRound[2]) {
    const difference = Number(bRound[1]) - Number(aRound[1]);
    if (difference) return difference;
  }
  return a.sourceCode.localeCompare(b.sourceCode, "ko");
}
