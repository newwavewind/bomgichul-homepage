import { describe, expect, it } from "vitest";
import { examPrintOptions } from "@/lib/exam-print";
import { groupExamPrintBooklets, groupExamPrintDocuments, groupExamPrintSessions } from "@/lib/exam-print-batch";

describe("groupExamPrintDocuments", () => {
  it("keeps one copy of the official PDF for subjects that share a booklet", () => {
    const editions = examPrintOptions("real-estate")
      .filter(({ year }) => year === 2024 || year === 2025)
      .map((edition) => ({ ...edition, subjectLabel: edition.subject }));

    const documents = groupExamPrintDocuments(editions);
    expect(documents.map(({ file }) => file)).toEqual([
      "real-estate-2024-1.pdf",
      "real-estate-2024-2-1.pdf",
      "real-estate-2024-2-2.pdf",
      "real-estate-2025-1.pdf",
      "real-estate-2025-2-1.pdf",
      "real-estate-2025-2-2.pdf",
    ]);
    expect(documents[0].subjects.map(({ id }) => id)).toEqual(["civillaw", "realestate"]);
  });

  it("lists only the real booklet combinations for the selected years", () => {
    const documents = groupExamPrintDocuments(examPrintOptions("real-estate")
      .map((edition) => ({ ...edition, subjectLabel: edition.subject })));
    const recent = groupExamPrintBooklets(documents.filter(({ year }) => year === 2024 || year === 2025));
    expect(recent).toHaveLength(3);
    expect(recent.find(({ bookletKey }) => bookletKey === "civillaw+realestate")?.subjects).toHaveLength(2);

    const early = groupExamPrintBooklets(documents.filter(({ year }) => year === 2016));
    expect(early.map(({ subjects }) => subjects.length).sort()).toEqual([2, 4]);
  });

  it("orders round numbers naturally within a year", () => {
    const documents = groupExamPrintDocuments(
      [10, 2, 1].map((round) => ({
        subject: "example",
        subjectLabel: "과목",
        year: 2025,
        session: `제${round}회`,
        file: `example-${round}.pdf`,
      })),
    );
    expect(documents.map(({ session }) => session)).toEqual(["제1회", "제2회", "제10회"]);
  });

  it("groups multiple physical booklets under one round without merging rounds across years", () => {
    const sessionGroups = (exam: string) => groupExamPrintSessions(groupExamPrintDocuments(examPrintOptions(exam)
      .filter(({ year }) => year === 2024 || year === 2025)
      .map((edition) => ({ ...edition, subjectLabel: edition.subject }))));

    expect(sessionGroups("police")).toEqual([
      { year: 2025, sessions: ["1차", "2차"] },
      { year: 2024, sessions: ["1차", "2차"] },
    ]);
    expect(sessionGroups("history")).toEqual([
      { year: 2025, sessions: ["제73회", "제74회", "제75회", "제76회"] },
      { year: 2024, sessions: ["제69회", "제70회", "제71회", "제72회"] },
    ]);
  });
});
