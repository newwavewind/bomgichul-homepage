import humanBehavior from "@/data/social-worker/human-behavior.json";
import research from "@/data/social-worker/research.json";
import practice from "@/data/social-worker/practice.json";
import practiceSkills from "@/data/social-worker/practice-skills.json";
import community from "@/data/social-worker/community.json";
import policy from "@/data/social-worker/policy.json";
import administration from "@/data/social-worker/administration.json";
import law from "@/data/social-worker/law.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

const contentBySubject = {
  "human-behavior": humanBehavior,
  research,
  practice,
  "practice-skills": practiceSkills,
  community,
  policy,
  administration,
  law,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const SOCIAL_WORKER_SUBJECT_IDS = track.subjectIds;
export const getSocialWorkerSubject = track.getSubject;
export const getSocialWorkerConcept = track.getConcept;
export const getSocialWorkerExam = track.getExam;
export const getSocialWorkerExamSessions = track.getExamSessions;
export const getSocialWorkerLinkedExams = track.getLinkedExams;
