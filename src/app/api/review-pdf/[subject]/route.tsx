import { NextRequest, NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from "@react-pdf/renderer";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import {
  getExamQuestion,
  isStatementCompositeQuestion,
  type ExamSubject,
} from "@/lib/exam-questions";
import { getUser } from "@/lib/auth";
import { getBookmarksForUser } from "@/lib/bookmarks";
import { getNotesForSubject } from "@/lib/notes";

export const runtime = "nodejs";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

let fontsRegistered = false;
function ensureFontsRegistered() {
  if (fontsRegistered) return;
  Font.register({
    family: "NotoSansKR",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/notosanskr/v39/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuoyeLQ.ttf",
        fontWeight: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/notosanskr/v39/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzg01eLQ.ttf",
        fontWeight: "bold",
      },
    ],
  });
  fontsRegistered = true;
}

const styles = StyleSheet.create({
  page: { padding: 36, fontFamily: "NotoSansKR", fontSize: 10, lineHeight: 1.5 },
  title: { fontSize: 15, fontWeight: "bold", marginBottom: 2 },
  subtitle: { fontSize: 9, color: "#64748b", marginBottom: 18 },
  questionBlock: { marginBottom: 14 },
  questionNo: { fontSize: 11, fontWeight: "bold", marginBottom: 4 },
  stem: { fontSize: 10, marginBottom: 6 },
  itemRow: { flexDirection: "row", marginBottom: 2 },
  itemBadge: { width: 18, fontWeight: "bold" },
  itemText: { flex: 1 },
  note: { fontSize: 9, color: "#334155", marginTop: 4, marginLeft: 18 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#e2e8f0", marginTop: 4 },
});

interface ReviewPdfParams {
  params: Promise<{ subject: string }>;
}

export async function GET(_request: NextRequest, { params }: ReviewPdfParams) {
  const { subject } = await params;
  if (!isValidSubject(subject)) {
    return NextResponse.json({ error: "invalid subject" }, { status: 404 });
  }

  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const [bookmarks, notes] = await Promise.all([
    getBookmarksForUser(user.id),
    getNotesForSubject(user.id, subject),
  ]);

  const bookmarkSet = new Set(
    bookmarks
      .filter((b) => b.subject === subject)
      .map((b) => `${b.year}-${b.question_no}`)
  );
  const noteMap = new Map<string, string>(
    notes.map((n) => [`${n.year}-${n.question_no}`, n.content])
  );

  const keys = new Set([...bookmarkSet, ...noteMap.keys()]);
  const questions = [...keys]
    .map((key) => {
      const [year, no] = key.split("-").map(Number);
      return getExamQuestion(subject, year, no);
    })
    .filter((q): q is NonNullable<typeof q> => Boolean(q))
    .sort((a, b) => a.year - b.year || a.questionNo - b.questionNo);

  if (questions.length === 0) {
    return NextResponse.json({ error: "북마크나 메모가 없어요." }, { status: 404 });
  }

  ensureFontsRegistered();
  const label = ARCHIVE_SUBJECT_MAP[subject];

  const doc = (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.title}>{label} 나만의 복습노트</Text>
        <Text style={styles.subtitle}>
          {SITE_NAME} · 북마크 {bookmarkSet.size} · 메모 {notes.length}
        </Text>

        {questions.map((q) => {
          const key = `${q.year}-${q.questionNo}`;
          const note = noteMap.get(key);
          return (
            <View key={key} style={styles.questionBlock} wrap={false}>
              <Text style={styles.questionNo}>
                {q.year}년 {q.questionNo}번
                {bookmarkSet.has(key) ? " · 북마크" : ""}
              </Text>
              <Text style={styles.stem}>{q.stem}</Text>

              {isStatementCompositeQuestion(q)
                ? q.items.map((item) => (
                    <View key={item.key} style={styles.itemRow}>
                      <Text style={styles.itemBadge}>{item.label}</Text>
                      <Text style={styles.itemText}>
                        {item.text} [{item.answer}]
                      </Text>
                    </View>
                  ))
                : q.items.map((item) => (
                    <View key={item.key} style={styles.itemRow}>
                      <Text style={styles.itemBadge}>{item.label}</Text>
                      <Text style={styles.itemText}>
                        {item.text} [{item.answer}]
                      </Text>
                    </View>
                  ))}

              {note ? <Text style={styles.note}>내 메모: {note}</Text> : null}
              <View style={styles.divider} />
            </View>
          );
        })}
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${subject}-review.pdf"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
