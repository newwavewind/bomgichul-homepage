import { describe, expect, it } from "vitest";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";
import { collectTrackReviewEntries, renderTrackReviewPdfBuffer } from "@/lib/track-review-pdf";

const data = {
  subject: { id: "law", label: "법", track: "test" },
  years: [2026],
  sources: ["국가직", "지방직"],
  concepts: [],
  exams: [
    { id: "a", year: 2026, sourceCode: "국가직", questionNo: 1, stem: "A", items: [] },
    { id: "b", year: 2026, sourceCode: "지방직", questionNo: 1, stem: "B", items: [] },
  ],
} satisfies ExamTrackSubjectContent;

describe("collectTrackReviewEntries", () => {
  it("출처까지 포함한 저장 키로 북마크와 메모를 정확히 결합한다", () => {
    const entries = collectTrackReviewEntries(
      data,
      "public_service",
      "law",
      [{ subject: "public_service:law:국가직", year: 2026, question_no: 1 }],
      [{ subject: "public_service:law:지방직", year: 2026, question_no: 1, content: "메모" }],
    );
    expect(entries).toHaveLength(2);
    expect(entries.find((entry) => entry.exam.sourceCode === "국가직")?.bookmarked).toBe(true);
    expect(entries.find((entry) => entry.exam.sourceCode === "지방직")?.notes).toEqual(["메모"]);
  });

  it("다른 시험 범위의 데이터는 포함하지 않는다", () => {
    expect(collectTrackReviewEntries(
      data,
      "public_service",
      "law",
      [{ subject: "police:law:국가직", year: 2026, question_no: 1 }],
      [],
    )).toEqual([]);
  });

  it("로컬 한글 글꼴로 실제 PDF 버퍼를 생성한다", async () => {
    const buffer = await renderTrackReviewPdfBuffer("공무원", data, [{
      exam: data.exams[0],
      bookmarked: true,
      notes: ["한글 메모"],
    }]);
    expect(buffer.subarray(0, 5).toString()).toBe("%PDF-");
    expect(buffer.length).toBeGreaterThan(1_000);
  });
});
