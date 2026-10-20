import g1_sagye from "@/data/youth/g1_sagye.json";
import g1_beop from "@/data/youth/g1_beop.json";
import g1_yeongu from "@/data/youth/g1_yeongu.json";
import g1_bihaeng from "@/data/youth/g1_bihaeng.json";
import g1_seong from "@/data/youth/g1_seong.json";
import g1_yakmul from "@/data/youth/g1_yakmul.json";
import g1_wigi from "@/data/youth/g1_wigi.json";
import g2_iron from "@/data/youth/g2_iron.json";
import g2_yeongu from "@/data/youth/g2_yeongu.json";
import g2_cheukjeong from "@/data/youth/g2_cheukjeong.json";
import g2_isang from "@/data/youth/g2_isang.json";
import g2_jinro from "@/data/youth/g2_jinro.json";
import g2_jipdan from "@/data/youth/g2_jipdan.json";
import g2_gajok from "@/data/youth/g2_gajok.json";
import g2_hakeop from "@/data/youth/g2_hakeop.json";
import g3_baldal from "@/data/youth/g3_baldal.json";
import g3_jipdan from "@/data/youth/g3_jipdan.json";
import g3_cheukjeong from "@/data/youth/g3_cheukjeong.json";
import g3_sangdam from "@/data/youth/g3_sangdam.json";
import g3_hakseup from "@/data/youth/g3_hakseup.json";
import g3_ihae from "@/data/youth/g3_ihae.json";
import g3_suryeon from "@/data/youth/g3_suryeon.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

/**
 * 청소년상담사는 급수(1·2·3급)마다 치르는 과목이 다르다 — 모두 필기 객관식 5지선다, 과목당 25문항.
 * 1급 일곱·2급 여덟·3급 일곱, 모두 22과목이고 급수 사이에 같은 이름의 과목은 없다.
 * 과목 id 는 앱(~/youthbomgichul src/subjects/registry.js)과 같이 급수를 앞에 붙인다(`g1_…`·`g2_…`·`g3_…`).
 * 과목의 `track` 칸이 급수(「1급」…)라 허브가 급수별로 과목을 묶는다(경비지도사 1·2차와 같은 꼴).
 *
 * 데이터는 `node scripts/convert-app-track.mjs youth` 가 앱에서 만든다 — 물류관리사와 같은 rich 갈래로
 * 자료 상자·표·그림·밑줄까지 앱과 같게 옮긴다. 차례는 앱 등록부 차례(급수 안에서 1교시 → 2교시)다.
 */
const contentBySubject = {
  g1_sagye,
  g1_beop,
  g1_yeongu,
  g1_bihaeng,
  g1_seong,
  g1_yakmul,
  g1_wigi,
  g2_iron,
  g2_yeongu,
  g2_cheukjeong,
  g2_isang,
  g2_jinro,
  g2_jipdan,
  g2_gajok,
  g2_hakeop,
  g3_baldal,
  g3_jipdan,
  g3_cheukjeong,
  g3_sangdam,
  g3_hakseup,
  g3_ihae,
  g3_suryeon,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const YOUTH_SUBJECT_IDS = track.subjectIds;
export const getYouthSubject = track.getSubject;
export const getYouthConcept = track.getConcept;
export const getYouthExam = track.getExam;
export const getYouthExamSessions = track.getExamSessions;
export const getYouthLinkedExams = track.getLinkedExams;
