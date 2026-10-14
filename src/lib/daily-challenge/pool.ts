import "server-only";

import { EXAM_SUBJECTS } from "@/lib/constants";
import { toExamOxCombos } from "@/lib/exam-track/combo-choices";
import { formatExamRefLabel } from "@/lib/exam-track/sourceLabel";
import { getExamQuestionsForSubject, type ExamQuestion } from "@/lib/exam-questions";
import { getEnglishSubject, ENGLISH_SUBJECT_IDS } from "@/lib/english-content";
import { getFirefighterSubject, FIREFIGHTER_SUBJECT_IDS } from "@/lib/firefighter-content";
import { getGamjeongSubject, GAMJEONG_SUBJECT_IDS } from "@/lib/gamjeong-content";
import { getGugeoSubject, GUGEO_SUBJECT_IDS } from "@/lib/gugeo-content";
import { getGyeongbiSubject, GYEONGBI_SUBJECT_IDS } from "@/lib/gyeongbi-content";
import { getHaengjeongsaSubject, HAENGJEONGSA_SUBJECT_IDS } from "@/lib/haengjeongsa-content";
import { getHistorySubject, HISTORY_SUBJECT_IDS } from "@/lib/history-content";
import { getHousingSubject, HOUSING_SUBJECT_IDS } from "@/lib/housing-content";
import { getNomusaSubject, NOMUSA_SUBJECT_IDS } from "@/lib/nomusa-content";
import { getPoliceSubject, POLICE_SUBJECT_IDS } from "@/lib/police-content";
import { getPublicServiceSubject, PUBLIC_SERVICE_SUBJECT_IDS } from "@/lib/public-service-content";
import { getSananSubject, SANAN_SUBJECT_IDS } from "@/lib/sanan-content";
import { getSemusaSubject, SEMUSA_SUBJECT_IDS } from "@/lib/semusa-content";
import { getSocialWorkerSubject, SOCIAL_WORKER_SUBJECT_IDS } from "@/lib/social-worker-content";
import { getSonhaeSubject, SONHAE_SUBJECT_IDS } from "@/lib/sonhae-content";
import { pickDailyIds } from "@/lib/daily-challenge/pick";
import { getDailyExam } from "@/lib/daily-challenge/exams";
import type { DailyChoice, DailyQuestion, DailyQuestionView } from "@/lib/daily-challenge/types";
import { plainStudyText } from "@/lib/study-text";

export type { DailyChoice, DailyQuestion, DailyQuestionView };

type LooseExam = {
  kind?: string;
  stem?: string;
  year: number;
  questionNo: number;
  sourceCode?: string;
  round?: number;
  correctChoice?: number | string;
  correctChoices?: number[];
  items?: { key: string; label?: string; text?: string; explanation?: string }[];
  comboChoices?: unknown[];
  explanationSummary?: string;
};

const pools = new Map<string, DailyQuestion[]>();

export function getDailyPool(slug: string): DailyQuestion[] {
  const cached = pools.get(slug);
  if (cached) return cached;
  const built = buildPool(slug);
  pools.set(slug, built);
  return built;
}

export function listDailySubjects(slug: string): { id: string; label: string }[] {
  if (slug === "real-estate") {
    return EXAM_SUBJECTS.map((subject) => ({ id: subject.value, label: subject.label }));
  }
  if (slug === "public-service") {
    return PUBLIC_SERVICE_SUBJECT_IDS.flatMap((id) => {
      const subject = getPublicServiceSubject(id);
      const label = subject?.subject.label;
      return label ? [{ id, label }] : [];
    });
  }
  const loader = TRACK_LOADERS[slug];
  if (!loader) return [];
  return loader.ids.flatMap((id) => {
    const subject = loader.get(id);
    const label = subject?.subject?.label;
    return label ? [{ id, label }] : [];
  });
}

export function getDailySet(
  slug: string,
  dateKey: string,
  mode: "ranked" | "practice",
  subjectId: string,
): DailyQuestion[] {
  const pool = getDailyPool(slug).filter((question) => question.subjectId === subjectId);
  const salt = mode === "practice" ? `${slug}:${subjectId}:practice` : `${slug}:${subjectId}`;
  const ids = pickDailyIds(pool.map((question) => question.id), dateKey, salt, 10);
  const byId = new Map(pool.map((question) => [question.id, question]));
  return ids.flatMap((id) => {
    const question = byId.get(id);
    return question ? [question] : [];
  });
}

export function toQuestionView(question: DailyQuestion): DailyQuestionView {
  const { correctKeys: _correctKeys, explanation: _explanation, ...view } = question;
  return view;
}

function buildPool(slug: string): DailyQuestion[] {
  if (slug === "real-estate") return buildRealEstate();
  if (slug === "public-service") {
    return PUBLIC_SERVICE_SUBJECT_IDS.flatMap((subjectId) => {
      const subject = getPublicServiceSubject(subjectId);
      if (!subject) return [];
      return subject.exams.flatMap((exam) =>
        fromTrackExam("public-service", "public-service", subjectId, exam as LooseExam),
      );
    });
  }

  const meta = getDailyExam(slug);
  if (!meta?.trackId) return [];
  const loader = TRACK_LOADERS[slug];
  if (!loader) return [];
  return loader.ids.flatMap((subjectId) => {
    const subject = loader.get(subjectId);
    if (!subject) return [];
    return subject.exams.flatMap((exam) =>
      fromTrackExam(slug, meta.trackId!, subjectId, exam as LooseExam),
    );
  });
}

const TRACK_LOADERS: Record<string, { ids: string[]; get: (id: string) => { exams: LooseExam[]; subject?: { label?: string } } | null }> = {
  police: { ids: POLICE_SUBJECT_IDS, get: (id) => getPoliceSubject(id) },
  firefighter: { ids: FIREFIGHTER_SUBJECT_IDS, get: (id) => getFirefighterSubject(id) },
  housing: { ids: HOUSING_SUBJECT_IDS, get: (id) => getHousingSubject(id) },
  "social-worker": { ids: SOCIAL_WORKER_SUBJECT_IDS, get: (id) => getSocialWorkerSubject(id) },
  history: { ids: HISTORY_SUBJECT_IDS, get: (id) => getHistorySubject(id) },
  english: { ids: ENGLISH_SUBJECT_IDS, get: (id) => getEnglishSubject(id) },
  gugeo: { ids: GUGEO_SUBJECT_IDS, get: (id) => getGugeoSubject(id) },
  haengjeongsa: { ids: HAENGJEONGSA_SUBJECT_IDS, get: (id) => getHaengjeongsaSubject(id) },
  semusa: { ids: SEMUSA_SUBJECT_IDS, get: (id) => getSemusaSubject(id) },
  sanan: { ids: SANAN_SUBJECT_IDS, get: (id) => getSananSubject(id) },
  sonhae: { ids: SONHAE_SUBJECT_IDS, get: (id) => getSonhaeSubject(id) },
  nomusa: { ids: NOMUSA_SUBJECT_IDS, get: (id) => getNomusaSubject(id) },
  gyeongbi: { ids: GYEONGBI_SUBJECT_IDS, get: (id) => getGyeongbiSubject(id) },
  gamjeong: { ids: GAMJEONG_SUBJECT_IDS, get: (id) => getGamjeongSubject(id) },
};

function buildRealEstate(): DailyQuestion[] {
  const labels = new Map(EXAM_SUBJECTS.map((subject) => [subject.value, subject.label]));
  return EXAM_SUBJECTS.flatMap((subject) =>
    getExamQuestionsForSubject(subject.value).flatMap((question) =>
      fromRealEstate(question, labels.get(subject.value) ?? subject.value),
    ),
  );
}

function fromRealEstate(question: ExamQuestion, subjectLabel: string): DailyQuestion[] {
  const built = normalizeChoices(question);
  const stem = question.stem?.trim();
  if (!built || !stem) return [];
  const href = `/exam/${question.subject}/${question.year}/${question.questionNo}`;
  return [{
    id: `real-estate:${question.subject}:${question.year}:${question.round}:${question.questionNo}`,
    subjectId: question.subject,
    stem,
    choices: built.choices,
    correctKeys: built.correctKeys,
    href,
    roundHref: `/exam/${question.subject}/${question.year}`,
    sourceLabel: `${question.year}년 ${question.round}회 ${subjectLabel} ${question.questionNo}번`,
    explanation: explainExam(question),
  }];
}

function fromTrackExam(
  slug: string,
  trackId: string,
  subjectId: string,
  exam: LooseExam,
): DailyQuestion[] {
  if (exam.kind === "subjective") return [];
  const stem = exam.stem?.trim();
  const built = normalizeChoices(exam);
  if (!stem || !built || !exam.sourceCode) return [];
  const source = encodeURIComponent(exam.sourceCode);
  const base = `/${slug}/exam/${subjectId}/${exam.year}/${source}`;
  return [{
    id: `${slug}:${subjectId}:${exam.year}:${exam.sourceCode}:${exam.questionNo}`,
    subjectId,
    stem,
    choices: built.choices,
    correctKeys: built.correctKeys,
    href: `${base}/${exam.questionNo}`,
    roundHref: base,
    sourceLabel: formatExamRefLabel(trackId, exam.year, exam.sourceCode, exam.questionNo),
    explanation: explainExam(exam),
  }];
}

function explainExam(exam: LooseExam): string {
  const summary = exam.explanationSummary ? plainStudyText(exam.explanationSummary).trim() : "";
  const numericCorrect = typeof exam.correctChoice === "number" ? exam.correctChoice : Number(exam.correctChoice);
  const combos = toExamOxCombos(exam.comboChoices, Number.isFinite(numericCorrect) ? numericCorrect : undefined);
  const notes = combos.length >= 2
    ? combos.flatMap((combo) => {
      const text = combo.explanation ? plainStudyText(combo.explanation).trim() : "";
      return text ? [`${combo.label} ${text}`] : [];
    })
    : (exam.items ?? []).flatMap((item) => {
      const text = item.explanation ? plainStudyText(item.explanation).trim() : "";
      if (!text) return [];
      const label = item.label?.trim() || String(item.key);
      return [`${label} ${text}`];
    });
  return [summary, ...notes].filter(Boolean).join("\n\n");
}

function normalizeChoices(exam: LooseExam): { choices: DailyChoice[]; correctKeys: string[] } | null {
  const numericCorrect = typeof exam.correctChoice === "number"
    ? exam.correctChoice
    : Number(exam.correctChoice);
  const combos = toExamOxCombos(
    exam.comboChoices,
    Number.isFinite(numericCorrect) ? numericCorrect : undefined,
  );
  if (combos.length >= 2) {
    const choices = combos.map((combo) => ({
      key: String(combo.no),
      label: combo.label,
      text: combo.text,
    }));
    const marked = combos.filter((combo) => combo.isCorrect).map((combo) => String(combo.no));
    const listed = (exam.correctChoices ?? []).map(String);
    const preferred = listed.length ? listed : marked;
    const correctKeys = preferred.filter((key) => choices.some((choice) => choice.key === key));
    if (!correctKeys.length) return null;
    return { choices, correctKeys };
  }

  const items = (exam.items ?? []).filter((item) => item.text?.trim());
  if (items.length < 2) return null;
  const choices = items.map((item) => ({
    key: String(item.key),
    label: item.label?.trim() || String(item.key),
    text: item.text!.trim(),
  }));
  const listed = exam.correctChoices?.length
    ? exam.correctChoices.map(String)
    : exam.correctChoice == null || exam.correctChoice === ""
      ? []
      : [String(exam.correctChoice)];
  const correctKeys = listed.filter((key) => choices.some((choice) => choice.key === key));
  if (!correctKeys.length) return null;
  return { choices, correctKeys };
}
