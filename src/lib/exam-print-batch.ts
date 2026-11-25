export type ExamPrintEdition = {
  subject: string;
  subjectLabel: string;
  subjectGroup?: string;
  bookletLabel?: string;
  year: number;
  session: string;
  file: string;
};

export type ExamPrintDocument = Pick<ExamPrintEdition, "file" | "year" | "session" | "subjectGroup" | "bookletLabel"> & {
  bookletKey: string;
  subjects: { id: string; label: string }[];
};

export function groupExamPrintDocuments(editions: ExamPrintEdition[]) {
  const documents = new Map<string, Omit<ExamPrintDocument, "bookletKey">>();
  for (const { file, year, session, subject, subjectLabel, subjectGroup, bookletLabel } of editions) {
    const document = documents.get(file) ?? { file, year, session, subjectGroup, bookletLabel, subjects: [] };
    document.subjects.push({ id: subject, label: subjectLabel });
    documents.set(file, document);
  }
  return [...documents.values()]
    .map((document) => ({
      ...document,
      bookletKey: document.subjects.map(({ id }) => id).sort().join("+"),
    }))
    .sort((a, b) =>
      a.year - b.year ||
      a.session.localeCompare(b.session, "ko", { numeric: true }) ||
      a.file.localeCompare(b.file, "en", { numeric: true }),
    );
}

export function groupExamPrintBooklets(documents: ExamPrintDocument[]) {
  const booklets = new Map<string, ExamPrintDocument>();
  for (const document of documents) {
    if (!booklets.has(document.bookletKey)) booklets.set(document.bookletKey, document);
  }
  return [...booklets.values()].sort((a, b) =>
    (a.subjectGroup ?? "").localeCompare(b.subjectGroup ?? "", "ko") ||
    (a.bookletLabel ?? a.subjects[0].label).localeCompare(b.bookletLabel ?? b.subjects[0].label, "ko", { numeric: true }),
  );
}

export function groupExamPrintSessions(documents: ExamPrintDocument[]) {
  const years = new Map<number, Set<string>>();
  for (const { year, session } of documents) {
    const sessions = years.get(year) ?? new Set<string>();
    sessions.add(session);
    years.set(year, sessions);
  }
  return [...years].reverse().map(([year, sessions]) => ({ year, sessions: [...sessions] }));
}

export function examPrintSessionKey(year: number, session: string) {
  return `${year}/${session}`;
}

export type ExamPrintMergeRequest = { files: string[]; title: string; includeExplanations?: boolean };

export type ExamPrintMergeResponse =
  | { type: "progress"; done: number }
  | { type: "complete"; file: Blob; pages: number }
  | { type: "error" };
