import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getExamQuestionsForSubject, type ExamSubject } from "@/lib/exam-questions";
import { HOUSING_SUBJECT_IDS, getHousingSubject } from "@/lib/housing-content";
import { SOCIAL_WORKER_SUBJECT_IDS, getSocialWorkerSubject } from "@/lib/social-worker-content";
import { ENGLISH_SUBJECT_IDS, getEnglishSubject } from "@/lib/english-content";
import { HISTORY_SUBJECT_IDS, getHistorySubject } from "@/lib/history-content";
import type { ExamTrackExam, ExamTrackSubjectContent } from "@/lib/exam-track/types";

function allTrackExams(ids: string[], getter: (id: string) => ExamTrackSubjectContent | null) {
  return ids.flatMap((id) => getter(id)?.exams ?? []);
}

function expectCompleteObjectiveQuestions(exams: ExamTrackExam[]) {
  const objective = exams.filter((exam) => exam.kind !== "subjective");
  expect(objective.filter((exam) => !exam.stem?.trim()).map((exam) => exam.id)).toEqual([]);
  expect(objective.filter((exam) => !exam.items.length).map((exam) => exam.id)).toEqual([]);
  // 선택지 자체가 한 장의 시험지 그림에 포함된 문항은 앱 원본도 text가 비어 있다.
  expect(
    objective
      .filter((exam) => !exam.material)
      .flatMap((exam) => exam.items.filter((item) => !item.text?.trim()).map(() => exam.id)),
  ).toEqual([]);
}

function expectMaterialFiles(exams: ExamTrackExam[]) {
  const missing = exams
    .flatMap((exam) => exam.material?.image ? [exam.material.image] : [])
    .filter((image) => !fs.existsSync(path.join(process.cwd(), "public", image.replace(/^\//, ""))));
  expect(missing).toEqual([]);
}

describe("웹 기출 데이터 무결성", () => {
  it("공인중개사 2,000문항의 발문과 선지가 비어 있지 않다", () => {
    const subjects: ExamSubject[] = ["civillaw", "realestate", "broker-law", "realestate-public-law", "registry-law", "realestate-tax"];
    const exams = subjects.flatMap(getExamQuestionsForSubject);
    expect(exams).toHaveLength(2000);
    expect(exams.filter((exam) => !exam.stem.trim() || exam.items.some((item) => !item.text.trim()))).toEqual([]);
  });

  it("주택관리사 1,200문항과 표·그림 자료가 모두 연결된다", () => {
    const exams = allTrackExams(HOUSING_SUBJECT_IDS, getHousingSubject);
    expect(exams).toHaveLength(1200);
    expectCompleteObjectiveQuestions(exams);
    expect(exams.filter((exam) => exam.table)).toHaveLength(53);
    expect(exams.filter((exam) => exam.material)).toHaveLength(7);
    expect(exams.filter((exam) => exam.choiceHeaders?.length)).toHaveLength(1);
    expectMaterialFiles(exams);
  });

  it("사회복지사 2,000문항의 발문과 선지가 비어 있지 않다", () => {
    const exams = allTrackExams(SOCIAL_WORKER_SUBJECT_IDS, getSocialWorkerSubject);
    expect(exams).toHaveLength(2000);
    expectCompleteObjectiveQuestions(exams);
  });

  it("영어 400문항과 보강 그림 16개가 모두 연결된다", () => {
    const exams = allTrackExams(ENGLISH_SUBJECT_IDS, getEnglishSubject);
    expect(exams).toHaveLength(400);
    expectCompleteObjectiveQuestions(exams);
    expect(exams.filter((exam) => exam.material)).toHaveLength(16);
    expectMaterialFiles(exams);
  });

  it("한능검 250문항과 사료·지도 자료가 모두 연결된다", () => {
    const exams = allTrackExams(HISTORY_SUBJECT_IDS, getHistorySubject);
    expect(exams).toHaveLength(250);
    expectCompleteObjectiveQuestions(exams);
    expect(exams.filter((exam) => exam.material)).toHaveLength(250);
    expectMaterialFiles(exams);
  });
});
