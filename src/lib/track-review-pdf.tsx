import React from "react";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { ExamTrackExam, ExamTrackSubjectContent } from "@/lib/exam-track/types";
import { ensurePdfFontsRegistered, PDF_FONT_FAMILY } from "@/lib/pdf-fonts";

export type TrackReviewBookmark = {
  subject: string;
  year: number;
  question_no: number;
};

export type TrackReviewMemo = TrackReviewBookmark & { content: string };

export type TrackReviewEntry = {
  exam: ExamTrackExam;
  bookmarked: boolean;
  notes: string[];
};

function storagePrefix(scope: string, subjectId: string) {
  return `${scope}:${subjectId}:`;
}

function reviewKey(sourceCode: string, year: number, questionNo: number) {
  return `${sourceCode}:${year}:${questionNo}`;
}

/** 저장 키에 포함된 출처까지 대조해 서로 다른 시험 회차가 섞이지 않게 한다. */
export function collectTrackReviewEntries(
  data: ExamTrackSubjectContent,
  scope: string,
  subjectId: string,
  bookmarks: TrackReviewBookmark[],
  memos: TrackReviewMemo[],
): TrackReviewEntry[] {
  const prefix = storagePrefix(scope, subjectId);
  const bookmarkKeys = new Set(
    bookmarks
      .filter((row) => row.subject.startsWith(prefix))
      .map((row) => reviewKey(row.subject.slice(prefix.length), row.year, row.question_no)),
  );
  const memoMap = new Map<string, string[]>();
  for (const memo of memos.filter((row) => row.subject.startsWith(prefix))) {
    const key = reviewKey(memo.subject.slice(prefix.length), memo.year, memo.question_no);
    memoMap.set(key, [...(memoMap.get(key) ?? []), memo.content]);
  }

  return data.exams
    .map((exam) => {
      const key = reviewKey(exam.sourceCode, exam.year, exam.questionNo);
      return { exam, bookmarked: bookmarkKeys.has(key), notes: memoMap.get(key) ?? [] };
    })
    .filter((entry) => entry.bookmarked || entry.notes.length > 0)
    .sort((a, b) => b.exam.year - a.exam.year || a.exam.sourceCode.localeCompare(b.exam.sourceCode, "ko") || a.exam.questionNo - b.exam.questionNo);
}

const styles = StyleSheet.create({
  page: { padding: 36, fontFamily: PDF_FONT_FAMILY, fontSize: 9, lineHeight: 1.5 },
  title: { fontSize: 15, fontWeight: "bold", marginBottom: 2 },
  subtitle: { fontSize: 9, color: "#64748b", marginBottom: 18 },
  question: { marginBottom: 14 },
  questionNo: { fontSize: 11, fontWeight: "bold", marginBottom: 4 },
  stem: { fontSize: 10, marginBottom: 6 },
  item: { flexDirection: "row", marginBottom: 2 },
  badge: { width: 20, fontWeight: "bold" },
  itemText: { flex: 1 },
  explanation: { marginLeft: 20, marginBottom: 4, color: "#475569" },
  note: { marginTop: 5, padding: 7, backgroundColor: "#f1f5f9", color: "#334155" },
  divider: { borderBottomWidth: 1, borderBottomColor: "#e2e8f0", marginTop: 6 },
});

export async function renderTrackReviewPdfBuffer(
  trackLabel: string,
  data: ExamTrackSubjectContent,
  entries: TrackReviewEntry[],
) {
  ensurePdfFontsRegistered();
  const bookmarkCount = entries.filter((entry) => entry.bookmarked).length;
  const memoCount = entries.reduce((count, entry) => count + entry.notes.length, 0);
  const doc = (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.title}>{trackLabel} {data.subject.label} 나만의 복습노트</Text>
        <Text style={styles.subtitle}>봄기출 · 북마크 {bookmarkCount} · 내 메모 {memoCount}</Text>
        {entries.map(({ exam, bookmarked, notes }) => (
          <View key={`${exam.sourceCode}:${exam.year}:${exam.questionNo}`} style={styles.question} wrap={false}>
            <Text style={styles.questionNo}>
              {exam.year}년 {exam.sourceCode} {exam.questionNo}번{bookmarked ? " · 북마크" : ""}
            </Text>
            <Text style={styles.stem}>{exam.stem ?? exam.prompt ?? ""}</Text>
            {exam.passage ? <Text style={styles.stem}>{exam.passage}</Text> : null}
            {exam.items.map((item) => (
              <View key={item.key}>
                <View style={styles.item}>
                  <Text style={styles.badge}>{item.label ?? item.key}</Text>
                  <Text style={styles.itemText}>{item.text}{item.answer ? ` [${item.answer}]` : ""}</Text>
                </View>
                {item.explanation ? <Text style={styles.explanation}>{item.explanation}</Text> : null}
              </View>
            ))}
            {exam.explanation ? <Text style={styles.explanation}>{exam.explanation}</Text> : null}
            {notes.map((note, index) => <Text key={index} style={styles.note}>내 메모: {note}</Text>)}
            <View style={styles.divider} />
          </View>
        ))}
      </Page>
    </Document>
  );
  return renderToBuffer(doc);
}
