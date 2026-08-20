import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { ARCHIVE_SUBJECT_MAP, SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  getExamQuestionsForYear,
  isStatementCompositeQuestion,
  type ExamSubject,
} from "@/lib/exam-questions";
import { ensurePdfFontsRegistered, PDF_FONT_FAMILY } from "@/lib/pdf-fonts";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: PDF_FONT_FAMILY,
    fontSize: 10,
    lineHeight: 1.5,
  },
  title: { fontSize: 15, fontWeight: "bold", marginBottom: 2 },
  subtitle: { fontSize: 9, color: "#64748b", marginBottom: 18 },
  watermarkTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 10,
    alignItems: "center",
  },
  watermarkBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 10,
    alignItems: "center",
  },
  watermarkText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#94a3b8",
    textAlign: "center",
  },
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

export function getExamPdfWatermarkText() {
  return `${SITE_URL.replace(/^https?:\/\//, "")} ${SITE_NAME}`;
}

export function getExamPdfFileName(subject: ExamSubject, year: number) {
  return `${subject}-${year}.pdf`;
}

export function getExamPdfArchiveTitle(subject: ExamSubject, year: number) {
  const label = ARCHIVE_SUBJECT_MAP[subject];
  return `[기출 PDF] ${year}년 ${label} 기출문제 해설`;
}

export function getExamPdfArchiveContent(subject: ExamSubject, year: number) {
  const label = ARCHIVE_SUBJECT_MAP[subject];
  const questions = getExamQuestionsForYear(subject, year);
  const round = questions[0]?.round;
  const roundLine = round != null ? `제${round}회 · ` : "";

  return [
    `${roundLine}${year}년 공인중개사 ${label} 기출문제 전체 문항과 해설 PDF입니다.`,
    "",
    "· 문항 지문, 정답(O/X), 보기별 해설 포함",
    "· 로그인 후 자료실에서 다운로드할 수 있어요",
    "",
    `출처: ${SITE_NAME} (${SITE_URL})`,
  ].join("\n");
}

export async function renderExamYearPdfBuffer(
  subject: ExamSubject,
  year: number
): Promise<Buffer> {
  const questions = getExamQuestionsForYear(subject, year);
  if (questions.length === 0) {
    throw new Error(`no questions for ${subject} ${year}`);
  }

  ensurePdfFontsRegistered();

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const watermarkText = getExamPdfWatermarkText();

  const doc = (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View fixed style={styles.watermarkTop}>
          <Text style={styles.watermarkText}>{watermarkText}</Text>
        </View>
        <View fixed style={styles.watermarkBottom}>
          <Text style={styles.watermarkText}>{watermarkText}</Text>
        </View>
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

  return renderToBuffer(doc);
}
