import gwalli from "@/data/mullyu/gwalli.json";
import unsong from "@/data/mullyu/unsong.json";
import gukje from "@/data/mullyu/gukje.json";
import bogwan from "@/data/mullyu/bogwan.json";
import beopgyu from "@/data/mullyu/beopgyu.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

/**
 * 물류관리사는 한 번의 시험(객관식 5지선다) 다섯 과목을 싣는다 — 2차 시험이 없다.
 *
 * 데이터는 `node scripts/convert-app-track.mjs mullyu` 가 앱(~/mullyubomgichul)에서 만든다 —
 * 감정평가사와 같은 rich 갈래로 자료 상자·표·그림·밑줄·시험일 판 근거 링크까지 앱과 같게 옮긴다.
 */
const contentBySubject = {
  gwalli,
  unsong,
  gukje,
  bogwan,
  beopgyu,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const MULLYU_SUBJECT_IDS = track.subjectIds;
export const getMullyuSubject = track.getSubject;
export const getMullyuConcept = track.getConcept;
export const getMullyuExam = track.getExam;
export const getMullyuExamSessions = track.getExamSessions;
export const getMullyuLinkedExams = track.getLinkedExams;
