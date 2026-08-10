import { describe, expect, it } from "vitest";
import { findTrackConceptsForExamQuestion, type TrackMatchSource } from "./concept-matches";
import type { ExamTrackConcept, ExamTrackExam } from "./types";

function exam(no: number, category: string, subcategory: string, unitIds: string[]): ExamTrackExam {
  return {
    id: `x-${no}`,
    year: 2024,
    sourceCode: "국가직",
    questionNo: no,
    stem: `${no}번`,
    category,
    subcategory,
    items: unitIds.map((id, i) => ({ key: String(i + 1), text: "지문", taxonomy_unit_id: id })),
  };
}

function concept(slug: string, category: string, subcategory: string, refs: number[]): ExamTrackConcept {
  return {
    slug,
    category,
    subcategory,
    titleKo: slug,
    definition: "",
    questionRefs: refs.map((questionNo) => ({ year: 2024, sourceCode: "국가직", questionNo })),
  };
}

const UNITS = [
  { unitId: "u-1", category: "재무회계", subcategory: "결산" },
  { unitId: "u-2", category: "재무회계", subcategory: "재고자산" },
];

function source(exams: ExamTrackExam[], concepts: ExamTrackConcept[]): TrackMatchSource {
  return { exams, concepts, taxonomyUnits: UNITS };
}

describe("findTrackConceptsForExamQuestion — taxonomy 단원 층", () => {
  it("근거 문항이 모두 같은 단원에 걸린 개념은 같은 단원의 새 문항으로 넓어진다", () => {
    const exams = [
      exam(1, "재무회계", "결산", ["u-1"]),
      exam(2, "재무회계", "결산", ["u-1"]),
      exam(3, "재무회계", "결산", ["u-1"]),
    ];
    const c = concept("closing", "재무회계", "결산", [1, 2]);
    const got = findTrackConceptsForExamQuestion(source(exams, [c]), exams[2]);
    expect(got.map((x) => x.slug)).toEqual(["closing"]);
  });

  it("문항 분류가 그 단원이 아니면 잇지 않는다 — 지문 하나가 스친 것만으로는 부족", () => {
    const exams = [
      exam(1, "재무회계", "결산", ["u-1"]),
      exam(2, "재무회계", "결산", ["u-1"]),
      exam(3, "재무회계", "재고자산", ["u-1", "u-2"]),
    ];
    const c = concept("closing", "재무회계", "결산", [1, 2]);
    expect(findTrackConceptsForExamQuestion(source(exams, [c]), exams[2])).toEqual([]);
  });

  it("근거 문항 중 하나라도 그 단원이 아니면 개념 자체가 자격을 잃는다", () => {
    const exams = [
      exam(1, "재무회계", "결산", ["u-1"]),
      exam(2, "재무회계", "재고자산", ["u-2"]),
      exam(3, "재무회계", "결산", ["u-1"]),
    ];
    const c = concept("closing", "재무회계", "결산", [1, 2]);
    expect(findTrackConceptsForExamQuestion(source(exams, [c]), exams[2])).toEqual([]);
  });

  it("taxonomy 표가 없는 트랙(경찰·주택관리사)에서는 이 층이 동작하지 않는다", () => {
    const exams = [
      exam(1, "재무회계", "결산", ["u-1"]),
      exam(2, "재무회계", "결산", ["u-1"]),
      exam(3, "재무회계", "결산", ["u-1"]),
    ];
    const c = concept("closing", "재무회계", "결산", [1, 2]);
    expect(findTrackConceptsForExamQuestion({ exams, concepts: [c] }, exams[2])).toEqual([]);
  });

  it("명시적 questionRefs 가 여전히 최우선이다", () => {
    const exams = [exam(1, "재무회계", "결산", ["u-2"])];
    const c = concept("explicit", "다른분류", "다른소분류", [1]);
    expect(findTrackConceptsForExamQuestion(source(exams, [c]), exams[0]).map((x) => x.slug)).toEqual([
      "explicit",
    ]);
  });
});
