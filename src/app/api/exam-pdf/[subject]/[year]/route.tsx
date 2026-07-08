import { NextRequest, NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from "@react-pdf/renderer";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import { getExamQuestionsForYear, isStatementCompositeQuestion, type ExamSubject } from "@/lib/exam-questions";
import { getUser } from "@/lib/auth";
import { isSubjectUnlocked } from "@/lib/premium";

export const runtime = "nodejs";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

let fontsRegistered = false;
function ensureFontsRegistered() {
  if (fontsRegistered) return;
  // Nanum Gothic's TTF trips a fontkit glyph-parsing bug (RangeError in
  // advanceWidth lookup); Noto Sans KR renders fine and covers Hangul.
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
  correctTag: { color: "#6366f1", fontWeight: "bold" },
  explanation: { fontSize: 9, color: "#475569", marginLeft: 18, marginBottom: 6 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#e2e8f0", marginTop: 4 },
});

interface PdfRouteParams {
  params: Promise<{ subject: string; year: string }>;
}

export async function GET(_request: NextRequest, { params }: PdfRouteParams) {
  const { subject, year: yearParam } = await params;

  if (!isValidSubject(subject)) {
    return NextResponse.json({ error: "invalid subject" }, { status: 404 });
  }

  const year = Number(yearParam);
  const questions = getExamQuestionsForYear(subject, year);
  if (questions.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const user = await getUser();
  const unlocked = user ? await isSubjectUnlocked(user.id, subject) : false;
  if (!unlocked) {
    return NextResponse.json(
      { error: "이 과목의 프리미엄을 해제한 계정만 PDF를 받을 수 있어요." },
      { status: 403 }
    );
  }

  ensureFontsRegistered();

  const label = ARCHIVE_SUBJECT_MAP[subject];

  const doc = (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.title}>
          {year}년 {label} 기출문제 해설
        </Text>
        <Text style={styles.subtitle}>{SITE_NAME} · www.bomgichul.com</Text>

        {questions.map((q) => (
          <View key={q.questionNo} style={styles.questionBlock} wrap={false}>
            <Text style={styles.questionNo}>{q.questionNo}번</Text>
            <Text style={styles.stem}>{q.stem}</Text>

            {isStatementCompositeQuestion(q) ? (
              <>
                {q.items.map((item) => (
                  <View key={item.key}>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemBadge}>{item.label}</Text>
                      <Text style={styles.itemText}>
                        {item.text} [{item.answer}]
                      </Text>
                    </View>
                    <Text style={styles.explanation}>{item.explanation}</Text>
                  </View>
                ))}
                {q.comboChoices.map((choice) => (
                  <View key={choice.no} style={styles.itemRow}>
                    <Text style={styles.itemBadge}>{choice.label}</Text>
                    <Text style={styles.itemText}>
                      {choice.text}
                      {String(choice.no) === q.correctChoice ? (
                        <Text style={styles.correctTag}> (정답)</Text>
                      ) : null}
                    </Text>
                  </View>
                ))}
              </>
            ) : (
              q.items.map((item) => (
                <View key={item.key}>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemBadge}>{item.label}</Text>
                    <Text style={styles.itemText}>
                      {item.text} [{item.answer}]
                      {item.key === q.correctChoice ? (
                        <Text style={styles.correctTag}> (정답)</Text>
                      ) : null}
                    </Text>
                  </View>
                  <Text style={styles.explanation}>{item.explanation}</Text>
                </View>
              ))
            )}

            <View style={styles.divider} />
          </View>
        ))}
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${subject}-${year}.pdf"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
