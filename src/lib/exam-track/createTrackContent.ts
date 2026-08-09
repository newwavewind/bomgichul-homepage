import type { ExamTrackSubjectContent } from "./types";

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
    const sessions = new Map<string, { year: number; sourceCode: string; count: number }>();
    for (const exam of subject.exams) {
      const key = `${exam.year}-${exam.sourceCode}`;
      const current = sessions.get(key) ?? { year: exam.year, sourceCode: exam.sourceCode, count: 0 };
      current.count += 1;
      sessions.set(key, current);
    }
    return [...sessions.values()].sort(
      (a, b) => b.year - a.year || a.sourceCode.localeCompare(b.sourceCode, "ko"),
    );
  }

  /** questionRefs가 없으면 category·subcategory로 기출을 연결 */
  function getLinkedExams(subjectId: string, conceptSlug: string, limit = 12) {
    const subject = getSubject(subjectId);
    const concept = getConcept(subjectId, conceptSlug);
    if (!subject || !concept) return [];

    const fromRefs = (concept.questionRefs ?? [])
      .map((ref) =>
        ref.examId
          ? subject.exams.find((exam) => exam.id === ref.examId)
          : subject.exams.find(
              (exam) =>
                exam.year === ref.year &&
                (!ref.sourceCode || exam.sourceCode === ref.sourceCode) &&
                exam.questionNo === ref.questionNo,
            ),
      )
      .filter(Boolean);

    if (fromRefs.length) return fromRefs.slice(0, limit);

    return subject.exams
      .filter(
        (exam) =>
          exam.category === concept.category &&
          (!concept.subcategory || exam.subcategory === concept.subcategory),
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
