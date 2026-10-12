import minbeop from "@/data/gamjeong/minbeop.json";
import gyeongje from "@/data/gamjeong/gyeongje.json";
import budongsan from "@/data/gamjeong/budongsan.json";
import beopgyu from "@/data/gamjeong/beopgyu.json";
import hoegye from "@/data/gamjeong/hoegye.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

/**
 * 감정평가사는 1차 다섯 과목(5지선다)만 싣는다 — 2차 서술형(감정평가실무·이론·보상법규)은
 * 확정답안이 없어 웹 OX 트랙에 싣지 않는다(앱은 바로바로 AI).
 *
 * 데이터는 `node scripts/convert-app-track.mjs gamjeong` 이 앱(~/gamjeongbomgichul)에서 만든다 —
 * 표 머리·병합 칸, 밑줄, 회계학 과목 공통 전제, 시험일 판 근거 링크까지 앱과 같게 옮긴다.
 */
const contentBySubject = {
  minbeop,
  gyeongje,
  budongsan,
  beopgyu,
  hoegye,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const GAMJEONG_SUBJECT_IDS = track.subjectIds;
export const getGamjeongSubject = track.getSubject;
export const getGamjeongConcept = track.getConcept;
export const getGamjeongExam = track.getExam;
export const getGamjeongExamSessions = track.getExamSessions;
export const getGamjeongLinkedExams = track.getLinkedExams;
