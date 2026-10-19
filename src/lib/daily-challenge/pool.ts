import "server-only";

import { EXAM_SUBJECTS } from "@/lib/constants";
import { toExamOxCombos } from "@/lib/exam-track/combo-choices";
import { formatExamRefLabel } from "@/lib/exam-track/sourceLabel";
import {
  getExamQuestionsForSubject,
  type ExamQuestion,
} from "@/lib/exam-questions";
import { getEnglishSubject, ENGLISH_SUBJECT_IDS } from "@/lib/english-content";
import {
  getFirefighterSubject,
  FIREFIGHTER_SUBJECT_IDS,
} from "@/lib/firefighter-content";
import {
  getGamjeongSubject,
  GAMJEONG_SUBJECT_IDS,
} from "@/lib/gamjeong-content";
import { getMullyuSubject, MULLYU_SUBJECT_IDS } from "@/lib/mullyu-content";
import { getGugeoSubject, GUGEO_SUBJECT_IDS } from "@/lib/gugeo-content";
import {
  getGyeongbiSubject,
  GYEONGBI_SUBJECT_IDS,
} from "@/lib/gyeongbi-content";
import {
  getHaengjeongsaSubject,
  HAENGJEONGSA_SUBJECT_IDS,
} from "@/lib/haengjeongsa-content";
import { getHistorySubject, HISTORY_SUBJECT_IDS } from "@/lib/history-content";
import { getHousingSubject, HOUSING_SUBJECT_IDS } from "@/lib/housing-content";
import { getNomusaSubject, NOMUSA_SUBJECT_IDS } from "@/lib/nomusa-content";
import { getPoliceSubject, POLICE_SUBJECT_IDS } from "@/lib/police-content";
import {
  getPublicServiceSubject,
  PUBLIC_SERVICE_SUBJECT_IDS,
} from "@/lib/public-service-content";
import { getSananSubject, SANAN_SUBJECT_IDS } from "@/lib/sanan-content";
import { getSemusaSubject, SEMUSA_SUBJECT_IDS } from "@/lib/semusa-content";
import {
  getSocialWorkerSubject,
  SOCIAL_WORKER_SUBJECT_IDS,
} from "@/lib/social-worker-content";
import { getSonhaeSubject, SONHAE_SUBJECT_IDS } from "@/lib/sonhae-content";
import {
  DAILY_ROTATION_START_DATE,
  pickDailyIds,
  pickDailyIdsWithNextDate,
} from "@/lib/daily-challenge/pick";
import { getDailyExam } from "@/lib/daily-challenge/exams";
import type {
  DailyChoice,
  DailyQuestion,
  DailyQuestionPresentation,
  DailyQuestionView,
  DailyTAccount,
} from "@/lib/daily-challenge/types";
import type { ExamTrackMaterial, ExamTrackTable } from "@/lib/exam-track/types";
import type {
  ExamQuestionTable,
  ExamReferenceEntry,
} from "@/lib/exam-questions";
import type { UnderlineRange } from "@/lib/underlined-text";
import { plainStudyText } from "@/lib/study-text";
import { itemsRepeatComboChoices } from "@/lib/daily-challenge/presentation";

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
  items?: {
    key: string;
    label?: string;
    text?: string;
    explanation?: string;
    image?: string;
    translation?: string;
  }[];
  comboChoices?: unknown[];
  explanationSummary?: string;
  examDate?: string;
  lawVersions?: Record<string, string>;
  notice?: string;
  passage?: string;
  passageText?: string;
  material?: ExamTrackMaterial & { figureFirst?: boolean };
  table?: ExamTrackTable | ExamTrackTable[] | ExamQuestionTable;
  tAccounts?: DailyTAccount[];
  stemTail?: string;
  leadEntries?: ExamReferenceEntry[];
  referenceEntries?: ExamReferenceEntry[];
  choiceHeaders?: string[];
  tableHeader?: string[];
  underlines?: UnderlineRange[];
  keepStemLines?: boolean;
  category?: string;
  subcategory?: string;
};

const pools = new Map<string, DailyQuestion[]>();

export function getDailyPool(slug: string): DailyQuestion[] {
  const cached = pools.get(slug);
  if (cached) return cached;
  const built = buildPool(slug);
  pools.set(slug, built);
  return built;
}

/** The latest ten available exam years in one subject's objective-question pool. */
export function getDailyEligiblePool(slug: string, subjectId: string) {
  const subjectPool = getDailyPool(slug).filter(
    (question) => question.subjectId === subjectId,
  );
  const latestYear = Math.max(0, ...subjectPool.map((question) => question.year));
  return subjectPool.filter((question) => question.year >= latestYear - 9);
}

export function listDailySubjects(
  slug: string,
): { id: string; label: string }[] {
  if (slug === "real-estate") {
    return EXAM_SUBJECTS.map((subject) => ({
      id: subject.value,
      label: subject.label,
    }));
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
  practicePage = 1,
): DailyQuestion[] {
  const pool = dateKey < DAILY_ROTATION_START_DATE
    ? getDailyPool(slug).filter((question) => question.subjectId === subjectId)
    : getDailyEligiblePool(slug, subjectId);
  const salt = `${slug}:${subjectId}`;
  const pageOffset =
    mode === "practice" ? normalizePracticePage(practicePage) : 0;
  const ids = pickDailyIds(
    pool.map((question) => question.id),
    dateKey,
    salt,
    10,
    pageOffset,
  );
  const byId = new Map(pool.map((question) => [question.id, question]));
  return ids.flatMap((id) => {
    const question = byId.get(id);
    return question ? [question] : [];
  });
}

export function getDailySetWithSchedule(
  slug: string,
  dateKey: string,
  mode: "ranked" | "practice",
  subjectId: string,
  practicePage = 1,
): DailyQuestionView[] {
  const fullPool = getDailyPool(slug).filter(
    (question) => question.subjectId === subjectId,
  );
  const eligiblePool = getDailyEligiblePool(slug, subjectId);
  const pool = dateKey < DAILY_ROTATION_START_DATE ? fullPool : eligiblePool;
  const salt = `${slug}:${subjectId}`;
  const pageOffset =
    mode === "practice" ? normalizePracticePage(practicePage) : 0;
  const picks = pickDailyIdsWithNextDate(
    pool.map((question) => question.id),
    eligiblePool.map((question) => question.id),
    dateKey,
    salt,
    10,
    pageOffset,
  );
  const byId = new Map(pool.map((question) => [question.id, question]));
  return picks.flatMap(({ id, nextDateKey }) => {
    const question = byId.get(id);
    return question ? [toQuestionView(question, nextDateKey)] : [];
  });
}

function normalizePracticePage(value: number) {
  if (!Number.isSafeInteger(value) || value < 1) return 1;
  return Math.min(value, 1_000_000);
}

export function toQuestionView(
  question: DailyQuestion,
  nextDateKey: string | null = null,
): DailyQuestionView {
  const {
    correctKeys: _correctKeys,
    explanation: _explanation,
    ...view
  } = question;
  return { ...view, nextDateKey };
}

function buildPool(slug: string): DailyQuestion[] {
  if (slug === "real-estate") return buildRealEstate();
  if (slug === "public-service") {
    return PUBLIC_SERVICE_SUBJECT_IDS.flatMap((subjectId) => {
      const subject = getPublicServiceSubject(subjectId);
      if (!subject) return [];
      return subject.exams.flatMap((exam) =>
        fromTrackExam(
          "public-service",
          "public-service",
          subjectId,
          exam as LooseExam,
        ),
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

const TRACK_LOADERS: Record<
  string,
  {
    ids: string[];
    get: (
      id: string,
    ) => { exams: LooseExam[]; subject?: { label?: string } } | null;
  }
> = {
  police: { ids: POLICE_SUBJECT_IDS, get: (id) => getPoliceSubject(id) },
  firefighter: {
    ids: FIREFIGHTER_SUBJECT_IDS,
    get: (id) => getFirefighterSubject(id),
  },
  housing: { ids: HOUSING_SUBJECT_IDS, get: (id) => getHousingSubject(id) },
  "social-worker": {
    ids: SOCIAL_WORKER_SUBJECT_IDS,
    get: (id) => getSocialWorkerSubject(id),
  },
  history: { ids: HISTORY_SUBJECT_IDS, get: (id) => getHistorySubject(id) },
  english: { ids: ENGLISH_SUBJECT_IDS, get: (id) => getEnglishSubject(id) },
  gugeo: { ids: GUGEO_SUBJECT_IDS, get: (id) => getGugeoSubject(id) },
  haengjeongsa: {
    ids: HAENGJEONGSA_SUBJECT_IDS,
    get: (id) => getHaengjeongsaSubject(id),
  },
  semusa: { ids: SEMUSA_SUBJECT_IDS, get: (id) => getSemusaSubject(id) },
  sanan: { ids: SANAN_SUBJECT_IDS, get: (id) => getSananSubject(id) },
  sonhae: { ids: SONHAE_SUBJECT_IDS, get: (id) => getSonhaeSubject(id) },
  nomusa: { ids: NOMUSA_SUBJECT_IDS, get: (id) => getNomusaSubject(id) },
  gyeongbi: { ids: GYEONGBI_SUBJECT_IDS, get: (id) => getGyeongbiSubject(id) },
  gamjeong: { ids: GAMJEONG_SUBJECT_IDS, get: (id) => getGamjeongSubject(id) },
  mullyu: { ids: MULLYU_SUBJECT_IDS, get: (id) => getMullyuSubject(id) },
};

function buildRealEstate(): DailyQuestion[] {
  const labels = new Map(
    EXAM_SUBJECTS.map((subject) => [subject.value, subject.label]),
  );
  return EXAM_SUBJECTS.flatMap((subject) =>
    getExamQuestionsForSubject(subject.value).flatMap((question) =>
      fromRealEstate(question, labels.get(subject.value) ?? subject.value),
    ),
  );
}

function fromRealEstate(
  question: ExamQuestion,
  subjectLabel: string,
): DailyQuestion[] {
  const built = normalizeChoices(question);
  const stem = question.stem?.trim();
  if (!built || !stem) return [];
  const href = `/exam/${question.subject}/${question.year}/${question.questionNo}`;
  return [
    {
      id: `real-estate:${question.subject}:${question.year}:${question.round}:${question.questionNo}`,
      subjectId: question.subject,
      stem,
      presentation: buildPresentation(question, built.hasCombos),
      choices: built.choices,
      correctKeys: built.correctKeys,
      href,
      roundHref: `/exam/${question.subject}/${question.year}`,
      sourceLabel: `${question.year}년 ${question.round}회 ${subjectLabel} ${question.questionNo}번`,
      explanation: explainExam(question),
      lawChangeNote: extractLawChangeNote(explainExam(question)),
      examDate: question.examDate,
      lawVersions: question.lawVersions,
      year: question.year,
      category: question.category || "미분류",
      subcategory: question.subcategory || question.category || "미분류",
    },
  ];
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
  return [
    {
      id: `${slug}:${subjectId}:${exam.year}:${exam.sourceCode}:${exam.questionNo}`,
      subjectId,
      stem,
      presentation: buildPresentation(exam, built.hasCombos),
      choices: built.choices,
      correctKeys: built.correctKeys,
      href: `${base}/${exam.questionNo}`,
      roundHref: base,
      sourceLabel: formatExamRefLabel(
        trackId,
        exam.year,
        exam.sourceCode,
        exam.questionNo,
      ),
      explanation: explainExam(exam),
      lawChangeNote: extractLawChangeNote(explainExam(exam)),
      examDate: exam.examDate,
      lawVersions: exam.lawVersions,
      year: exam.year,
      category: exam.category || "미분류",
      subcategory: exam.subcategory || exam.category || "미분류",
    },
  ];
}

function explainExam(exam: LooseExam): string {
  const summary = exam.explanationSummary
    ? plainStudyText(exam.explanationSummary).trim()
    : "";
  const numericCorrect =
    typeof exam.correctChoice === "number"
      ? exam.correctChoice
      : Number(exam.correctChoice);
  const combos = toExamOxCombos(
    exam.comboChoices,
    Number.isFinite(numericCorrect) ? numericCorrect : undefined,
  );
  const notes =
    combos.length >= 2
      ? combos.flatMap((combo) => {
          const text = combo.explanation
            ? plainStudyText(combo.explanation).trim()
            : "";
          return text ? [`${combo.label} ${text}`] : [];
        })
      : (exam.items ?? []).flatMap((item) => {
          const text = item.explanation
            ? plainStudyText(item.explanation).trim()
            : "";
          if (!text) return [];
          const label = item.label?.trim() || String(item.key);
          return [`${label} ${text}`];
        });
  return [summary, ...notes].filter(Boolean).join("\n\n");
}

function extractLawChangeNote(explanation: string): string | null {
  const notes = explanation
    .split(/\n\n+/)
    .flatMap((paragraph) => {
      const mark = paragraph.search(/\[(?:개정|판례변경)\]/);
      return mark >= 0 ? [paragraph.slice(mark).trim()] : [];
    });
  return notes.length ? [...new Set(notes)].join("\n") : null;
}

function buildPresentation(
  exam: LooseExam,
  hasCombos: boolean,
): DailyQuestionPresentation {
  const promptItems =
    hasCombos && !itemsRepeatComboChoices(exam.items, exam.comboChoices)
      ? (exam.items ?? []).flatMap((item) => {
          const text = item.text?.trim() ?? "";
          if (!text && !item.image) return [];
          return [
            {
              key: String(item.key),
              label: item.label?.trim() || String(item.key),
              text,
              image: item.image,
              translation: item.translation,
            },
          ];
        })
      : [];

  return {
    promptItems,
    notice: exam.notice,
    passage: exam.passage,
    passageText: exam.passageText,
    material: exam.material,
    table: exam.table,
    tAccounts: exam.tAccounts,
    stemTail: exam.stemTail,
    leadEntries: exam.leadEntries ?? [],
    referenceEntries: exam.referenceEntries ?? [],
    choiceHeaders: exam.choiceHeaders ?? exam.tableHeader ?? [],
    underlines: exam.underlines,
    keepStemLines: exam.keepStemLines,
  };
}

function normalizeChoices(exam: LooseExam): {
  choices: DailyChoice[];
  correctKeys: string[];
  hasCombos: boolean;
} | null {
  const numericCorrect =
    typeof exam.correctChoice === "number"
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
    const marked = combos
      .filter((combo) => combo.isCorrect)
      .map((combo) => String(combo.no));
    const listed = (exam.correctChoices ?? []).map(String);
    const preferred = listed.length ? listed : marked;
    const correctKeys = preferred.filter((key) =>
      choices.some((choice) => choice.key === key),
    );
    if (!correctKeys.length) return null;
    return { choices, correctKeys, hasCombos: true };
  }

  const items = (exam.items ?? []).filter((item) => item.text?.trim());
  if (items.length < 2) return null;
  const choices = items.map((item) => ({
    key: String(item.key),
    label: item.label?.trim() || String(item.key),
    text: item.text!.trim(),
    image: item.image,
    translation: item.translation,
  }));
  const listed = exam.correctChoices?.length
    ? exam.correctChoices.map(String)
    : exam.correctChoice == null || exam.correctChoice === ""
      ? []
      : [String(exam.correctChoice)];
  const correctKeys = listed.filter((key) =>
    choices.some((choice) => choice.key === key),
  );
  if (!correctKeys.length) return null;
  return { choices, correctKeys, hasCombos: false };
}
