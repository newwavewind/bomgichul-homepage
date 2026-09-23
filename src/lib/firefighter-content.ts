import sobang from "@/data/firefighter/sobang.json";
import sobangbeop from "@/data/firefighter/sobangbeop.json";
/**
 * 행정법총론은 공무원 트랙과 동일 원본을 쓰되, 소방 앱과 같이
 * 「국가직」회차만 연다(앱 exam 폴더에 지방직 파일이 없음).
 */
import haengjeongbeopRaw from "@/data/public-service/haengjeongbeop.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

const FIRE_ADMIN_SOURCE = "국가직";

function firefighterAdminLaw(
  raw: typeof haengjeongbeopRaw,
): typeof haengjeongbeopRaw {
  const exams = raw.exams.filter((exam) => exam.sourceCode === FIRE_ADMIN_SOURCE);
  const concepts = raw.concepts.map((concept) => ({
    ...concept,
    questionRefs: concept.questionRefs?.filter(
      (ref) => !ref.sourceCode || ref.sourceCode === FIRE_ADMIN_SOURCE,
    ),
  }));
  return {
    ...raw,
    subject: { ...raw.subject, track: "소방" },
    sources: [FIRE_ADMIN_SOURCE],
    years: [...new Set(exams.map((exam) => exam.year))].sort((a, b) => b - a),
    exams,
    concepts,
  };
}

const contentBySubject = {
  sobang,
  sobangbeop,
  haengjeongbeop: firefighterAdminLaw(haengjeongbeopRaw),
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const FIREFIGHTER_SUBJECT_IDS = track.subjectIds;
export const getFirefighterSubject = track.getSubject;
export const getFirefighterConcept = track.getConcept;
export const getFirefighterExam = track.getExam;
export const getFirefighterExamSessions = track.getExamSessions;
export const getFirefighterLinkedExams = track.getLinkedExams;
