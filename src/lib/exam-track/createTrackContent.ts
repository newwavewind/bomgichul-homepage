import type { ExamTrackSubjectContent } from "./types";
import { findTrackConceptsForExamQuestion } from "./concept-matches";

export function createTrackContent(contentBySubject: Record<string, ExamTrackSubjectContent>) {
  const subjectIds = Object.keys(contentBySubject);

  function getSubject(subjectId: string) {
    return contentBySubject[subjectId] ?? null;
  }

  function getConcept(subjectId: string, slug: string) {
    return getSubject(subjectId)?.concepts.find((concept) => concept.slug === slug) ?? null;
  }

  function getExam(subjectId: string, year: number, sourceCode: string, questionNo: number) {
    return (
      getSubject(subjectId)?.exams.find(
        (exam) => exam.year === year && exam.sourceCode === sourceCode && exam.questionNo === questionNo,
      ) ?? null
    );
  }

  function getExamSessions(subjectId: string) {
    const subject = getSubject(subjectId);
    if (!subject) return [];
    const sessions = new Map<
      string,
      { year: number; sourceCode: string; count: number; firstQuestionNo: number }
    >();
    for (const exam of subject.exams) {
      const key = `${exam.year}-${exam.sourceCode}`;
      const current = sessions.get(key) ?? {
        year: exam.year,
        sourceCode: exam.sourceCode,
        count: 0,
        firstQuestionNo: exam.questionNo,
      };
      current.count += 1;
      current.firstQuestionNo = Math.min(current.firstQuestionNo, exam.questionNo);
      sessions.set(key, current);
    }
    // 최신 회차가 위로: 연도 내림차순 → 회차 번호 내림차순(제80회→제65회).
    // 회차 숫자가 없으면 문자열 비교.
    const sourceRank = (sourceCode: string) => {
      const digits = sourceCode.replace(/\D/g, "");
      return digits ? Number(digits) : null;
    };
    return [...sessions.values()].sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      const aRank = sourceRank(a.sourceCode);
      const bRank = sourceRank(b.sourceCode);
      if (aRank != null && bRank != null && aRank !== bRank) return bRank - aRank;
      return a.sourceCode.localeCompare(b.sourceCode, "ko", { numeric: true });
    });
  }

  /** questionRefs가 없으면 category·subcategory로 기출을 연결 */
  function getLinkedExams(subjectId: string, conceptSlug: string, limit = 12) {
    const subject = getSubject(subjectId);
    const concept = getConcept(subjectId, conceptSlug);
    if (!subject || !concept) return [];

    return subject.exams
      .filter((exam) =>
        findTrackConceptsForExamQuestion(subject, exam).some(
          (matched) => matched.slug === concept.slug,
        ),
      )
      .slice(0, limit);
  }

  return {
    subjectIds,
    getSubject,
    getConcept,
    getExam,
    getExamSessions,
    getLinkedExams,
  };
}
