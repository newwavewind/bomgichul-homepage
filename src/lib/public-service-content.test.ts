import { describe, expect, it } from "vitest";
import {
  PUBLIC_SERVICE_SUBJECT_IDS,
  getPublicServiceConcept,
  getPublicServiceExam,
  getPublicServiceExamSessions,
  getPublicServiceSubject,
} from "./public-service-content";
import { parseQuestionStem } from "./exam-stem";

describe("공무원 공개 콘텐츠", () => {
  it("16개 과목의 개념과 기출이 모두 연결된다", () => {
    expect(PUBLIC_SERVICE_SUBJECT_IDS).toHaveLength(16);
    let concepts = 0;
    let exams = 0;
    for (const subjectId of PUBLIC_SERVICE_SUBJECT_IDS) {
      const subject = getPublicServiceSubject(subjectId);
      expect(subject).toBeTruthy();
      expect(subject!.concepts.length).toBeGreaterThan(0);
      expect(subject!.exams.length).toBeGreaterThan(0);
      concepts += subject!.concepts.length;
      exams += subject!.exams.length;
    }
    expect(concepts).toBe(470);
    expect(exams).toBe(3660);
  });

  it("목록에서 개념·시험·문항 상세를 다시 찾을 수 있다", () => {
    for (const subjectId of PUBLIC_SERVICE_SUBJECT_IDS) {
      const subject = getPublicServiceSubject(subjectId)!;
      const concept = subject.concepts[0];
      const exam = subject.exams[0];
      expect(getPublicServiceConcept(subjectId, concept.slug)?.slug).toBe(concept.slug);
      expect(getPublicServiceExam(subjectId, exam.year, exam.sourceCode, exam.questionNo)?.id).toBe(exam.id);
      expect(getPublicServiceExamSessions(subjectId).length).toBeGreaterThan(0);
    }
  });

  it("ㄱ·ㄴ·ㄷ 자료형 문항은 발문과 보기 박스로 분리된다", () => {
    const exam = getPublicServiceExam("hangjunghak", 2026, "국가직", 1)!;
    const parsed = parseQuestionStem(exam.stem);
    expect(parsed.intro).toBe("행정학의 발전과정에 대한 설명으로 옳은 것만을 모두 고르면?");
    expect(parsed.boxLines.some((line) => line.startsWith("ㄱ."))).toBe(true);
    expect(parsed.boxLines.some((line) => line.startsWith("ㄴ."))).toBe(true);
    expect(parsed.boxLines.some((line) => line.startsWith("ㄷ."))).toBe(true);
  });

  it("문항 해설 주제는 정답을 포함할 수 있어 문제 풀이 전 표시용으로 사용하지 않는다", () => {
    const exam = getPublicServiceExam("hangjunghak", 2026, "국가직", 1)!;
    expect(exam.explanationTopic).toContain("ㄱ, ㄷ");
    expect([exam.category, exam.subcategory]).not.toContain(exam.explanationTopic);
  });
});
