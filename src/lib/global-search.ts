import { EXAM_SUBJECTS } from "@/lib/constants";
import { getExamQuestionsForSubject } from "@/lib/exam-questions";
import { PUBLIC_SERVICE_SUBJECT_IDS, getPublicServiceSubject } from "@/lib/public-service-content";
import { POLICE_SUBJECT_IDS, getPoliceSubject } from "@/lib/police-content";
import { HOUSING_SUBJECT_IDS, getHousingSubject } from "@/lib/housing-content";
import { SOCIAL_WORKER_SUBJECT_IDS, getSocialWorkerSubject } from "@/lib/social-worker-content";
import { HISTORY_SUBJECT_IDS, getHistorySubject } from "@/lib/history-content";
import { ENGLISH_SUBJECT_IDS, getEnglishSubject } from "@/lib/english-content";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

export type GlobalSearchResult = { eyebrow: string; title: string; excerpt: string; href: string; score: number };

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, "").replace(/(\d{2})년/g, (_, y) => `${Number(y) >= 50 ? "19" : "20"}${y}년`);
}

function trackRows(label: string, base: string, ids: string[], getter: (id: string) => ExamTrackSubjectContent | null) {
  return ids.flatMap((id) => {
    const data = getter(id);
    if (!data) return [];
    return data.exams.map((exam) => ({
      eyebrow: `${label} · ${data.subject.label}`,
      title: `${data.subject.label} ${exam.year}년 ${exam.sourceCode} ${exam.questionNo}번`,
      excerpt: exam.stem ?? exam.prompt ?? exam.explanationSummary ?? "기출문제와 정답 해설",
      href: `${base}/exam/${id}/${exam.year}/${encodeURIComponent(exam.sourceCode)}/${exam.questionNo}`,
    }));
  });
}

let cached: Omit<GlobalSearchResult, "score">[] | null = null;
function rows() {
  if (cached) return cached;
  cached = [
    ...EXAM_SUBJECTS.flatMap((subject) => getExamQuestionsForSubject(subject.value).map((question) => ({
      eyebrow: `공인중개사 · ${subject.label}`,
      title: `${subject.label} ${question.year}년 ${question.questionNo}번`,
      excerpt: question.stem,
      href: `/exam/${subject.value}/${question.year}/${question.questionNo}`,
    }))),
    ...PUBLIC_SERVICE_SUBJECT_IDS.flatMap((id) => {
      const data = getPublicServiceSubject(id);
      if (!data) return [];
      return data.exams.map((exam) => ({ eyebrow: `공무원 · ${data.subject.label}`, title: `${data.subject.label} ${exam.year}년 ${exam.sourceCode} ${exam.questionNo}번`, excerpt: exam.stem, href: `/public-service/exam/${id}/${exam.year}/${encodeURIComponent(exam.sourceCode)}/${exam.questionNo}` }));
    }),
    ...trackRows("경찰공무원", "/police", POLICE_SUBJECT_IDS, getPoliceSubject),
    ...trackRows("주택관리사", "/housing", HOUSING_SUBJECT_IDS, getHousingSubject),
    ...trackRows("사회복지사 1급", "/social-worker", SOCIAL_WORKER_SUBJECT_IDS, getSocialWorkerSubject),
    ...trackRows("한국사능력검정", "/history", HISTORY_SUBJECT_IDS, getHistorySubject),
    ...trackRows("공무원 영어", "/english", ENGLISH_SUBJECT_IDS, getEnglishSubject),
  ];
  return cached;
}

export function searchAllQuestions(query: string, limit = 40): GlobalSearchResult[] {
  const q = normalize(query.trim());
  if (q.length < 2) return [];
  const tokens = q.match(/[가-힣a-z]+|\d+/g) ?? [q];
  return rows().map((row) => {
    const title = normalize(row.title);
    const haystack = normalize(`${row.eyebrow} ${row.title} ${row.excerpt}`);
    const matched = tokens.filter((token) => haystack.includes(token));
    const score = matched.length * 10 + (title.includes(q) ? 20 : 0) + (matched.length === tokens.length ? 30 : 0);
    return { ...row, score };
  }).filter((row) => row.score > 0 && tokens.every((token) => normalize(`${row.eyebrow}${row.title}${row.excerpt}`).includes(token))).sort((a, b) => b.score - a.score).slice(0, limit);
}
