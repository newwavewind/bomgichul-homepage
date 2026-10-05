import beophak from "@/data/gyeongbi/beophak.json";
import mingan from "@/data/gyeongbi/mingan.json";
import gyeongbibeop from "@/data/gyeongbi/gyeongbibeop.json";
import sobang from "@/data/gyeongbi/sobang.json";
import beomjoe from "@/data/gyeongbi/beomjoe.json";
import gyeongho from "@/data/gyeongbi/gyeongho.json";
import gigye from "@/data/gyeongbi/gigye.json";
import gigyeseolgye from "@/data/gyeongbi/gigyeseolgye.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

/**
 * 경비지도사는 1·2차 모두 4지선다 객관식이고 확정답안이 있어 여덟 과목을 다 싣는다.
 * 1차 법학개론·민간경비론(일반·기계 공통), 2차 경비업법(필수) + 선택 1과목
 * (일반: 소방학·범죄학·경호학 / 기계: 기계경비개론·기계경비기획 및 설계).
 *
 * 데이터는 `node scripts/convert-app-track.mjs gyeongbi` 가 앱(~/gyeongbibomgichul)에서 만든다.
 * 앱 기출이 들어오기 전에는 문항 0인 뼈대(`--empty`)로 트랙만 세운다.
 */
const contentBySubject = {
  beophak,
  mingan,
  gyeongbibeop,
  sobang,
  beomjoe,
  gyeongho,
  gigye,
  gigyeseolgye,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const GYEONGBI_SUBJECT_IDS = track.subjectIds;
export const getGyeongbiSubject = track.getSubject;
export const getGyeongbiConcept = track.getConcept;
export const getGyeongbiExam = track.getExam;
export const getGyeongbiExamSessions = track.getExamSessions;
export const getGyeongbiLinkedExams = track.getLinkedExams;
