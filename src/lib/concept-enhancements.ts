import type { Concept } from "@/lib/concepts";
import type { ExamQuestion } from "@/lib/exam-questions";
import {
  correctStatementFromExplanation,
  isMeaningfulStatement,
} from "@/lib/concept-statements";

export type EnhancementBranch = {
  type: string;
  cue: string;
  description: string;
  examples: string[];
  tone: "mint" | "blue" | "amber";
};

export type CustomConceptEnhancement = {
  kind?: undefined;
  summary: string;
  branches: EnhancementBranch[];
  decision: [string, string, string][];
  scenario: { owner: string; right: string; caption: string };
  caution: string;
  sources: { label: string; note: string; href: string }[];
};

export type StudyMapEnhancement = {
  kind: "study-map";
  breadcrumb: string[];
  summary: string;
  rules: { label: string; body: string; number: number }[];
  example: string | null;
  memory: string;
  years: number[];
  questionCount: number;
};

export type ConceptEnhancement = CustomConceptEnhancement | StudyMapEnhancement;

export type PitfallCard = {
  wrong: string;
  correct: string;
  context?: string | null;
  topic?: string | null;
  meta?: string | null;
  generatedFallback?: boolean;
};

const conceptEnhancements: Record<string, CustomConceptEnhancement> = {
  "types-of-real-right-change": {
    summary:
      "새 권리를 얻는 경로는 먼저 “앞사람의 권리에 기대는가?”로 나누고, 승계취득이라면 다시 “권리가 이동하는가, 새 권리가 얹히는가?”로 나눈다.",
    branches: [
      {
        type: "원시취득",
        cue: "앞 권리와 독립",
        description: "타인의 기존 권리를 이어받지 않고 새로 취득한다.",
        examples: ["건물 신축", "무주동산 선점", "점유취득시효"],
        tone: "mint",
      },
      {
        type: "이전적 승계",
        cue: "권리 자체가 이동",
        description: "양도인의 기존 권리가 동일성을 유지한 채 양수인에게 옮겨간다.",
        examples: ["부동산 매매", "상속", "채권 양도"],
        tone: "blue",
      },
      {
        type: "설정적 승계",
        cue: "새 권리가 위에 생성",
        description: "기존 권리는 남고, 그 권능 일부를 내용으로 하는 제한된 권리가 생긴다.",
        examples: ["저당권 설정", "지상권 설정", "전세권 설정"],
        tone: "amber",
      },
    ],
    decision: [
      ["1", "앞사람의 권리를 이어받는가?", "아니오 → 원시취득"],
      ["2", "기존 권리 자체가 주체만 바뀌는가?", "예 → 이전적 승계"],
      ["3", "기존 권리는 남고 새 제한물권이 생기는가?", "예 → 설정적 승계"],
    ],
    scenario: {
      owner: "甲의 토지 소유권",
      right: "乙의 저당권",
      caption:
        "소유권은 甲에게 그대로 있고, 그 위에 乙의 저당권이 새로 생긴다. 따라서 “이전”이 아니라 설정적 승계다.",
    },
    caution:
      "원시취득이라고 해서 언제나 등기가 필요 없는 것은 아니다. 건물 신축은 등기 없이 취득하지만, 20년 점유취득시효는 민법 제245조 제1항에 따라 등기해야 소유권을 취득한다.",
    sources: [
      {
        label: "민법 제187조",
        note: "법률규정에 의한 부동산물권 취득과 처분 제한",
        href: "https://www.law.go.kr/법령/민법/제187조",
      },
      {
        label: "민법 제245조",
        note: "부동산 점유취득시효의 기간과 등기",
        href: "https://www.law.go.kr/법령/민법/제245조",
      },
      {
        label: "민법 제252조",
        note: "무주동산의 선점과 무주부동산의 국유",
        href: "https://www.law.go.kr/법령/민법/제252조",
      },
    ],
  },
};

const conceptPitfallCards: Record<string, PitfallCard[]> = {
  "resident-opinion-hearing-obligation": [
    {
      wrong: "개발밀도관리구역과 기반시설부담구역을 지정할 때에는 모두 주민의견을 들어야 한다.",
      correct:
        "기반시설부담구역 지정에는 주민의견 청취가 필요하지만, 개발밀도관리구역 지정에는 주민의견 청취 의무가 명시되어 있지 않습니다.",
    },
    {
      wrong: "개발밀도관리구역은 주민의견 청취를 거치고, 지방도시계획위원회 심의는 거치지 않아도 된다.",
      correct:
        "절차가 반대입니다. 개발밀도관리구역은 주민의견 청취 대상이 아니지만 지방도시계획위원회 심의는 거쳐야 합니다.",
    },
  ],
};

function uniqueYears(questionRefs: Concept["questionRefs"] = []) {
  return [...new Set((questionRefs || []).map((ref) => ref.year).filter(Boolean))].sort(
    (a, b) => a - b
  );
}

function shortRule(point: string, index: number) {
  const cleaned = String(point || "").replace(/\s+/g, " ").trim();
  const firstClause = cleaned.split(/[—–:;]|(?:이며|이고|하지만|다만),?/)[0]?.trim();
  if (firstClause && firstClause.length <= 32) return firstClause.replace(/[.。]$/, "");
  return `핵심 규칙 ${index + 1}`;
}

function buildDefaultEnhancement(concept: Concept): StudyMapEnhancement {
  const points = (concept.keyPoints || []).filter(Boolean).slice(0, 4);
  const years = uniqueYears(concept.questionRefs);
  return {
    kind: "study-map",
    breadcrumb: [concept.chapterKo, concept.sectionKo || concept.category].filter(
      (v): v is string => Boolean(v)
    ),
    summary: concept.intuition || concept.definition,
    rules: points.map((point, index) => ({
      label: shortRule(point, index),
      body: point,
      number: index + 1,
    })),
    example: concept.example || null,
    memory: concept.pitfalls || points[0] || concept.definition,
    years,
    questionCount: concept.questionRefs?.length || 0,
  };
}

export function getConceptEnhancement(
  concept: Concept | null | undefined
): ConceptEnhancement | null {
  if (!concept?.slug) return null;
  return conceptEnhancements[concept.slug] ?? buildDefaultEnhancement(concept);
}

export function getConceptPitfallOverrides(slug: string): PitfallCard[] | null {
  return conceptPitfallCards[slug] ?? null;
}

function pitfallCardLimit(questionCount: number) {
  if (questionCount >= 10) return 12;
  if (questionCount >= 7) return 8;
  if (questionCount >= 4) return 6;
  if (questionCount >= 2) return 4;
  return 2;
}

export function buildPitfallCards(concept: Concept, questions: ExamQuestion[]): PitfallCard[] {
  const overrides = getConceptPitfallOverrides(concept.slug) || [];
  const limit = pitfallCardLimit(concept.questionRefs?.length || questions.length);
  const cards: PitfallCard[] = [...overrides];
  const seen = new Set(overrides.map((card) => card.wrong.replace(/\s+/g, "")));
  const seenQuestions = new Set<string>();

  for (const question of questions) {
    const qKey = `${question.year}-${question.questionNo}`;
    if (seenQuestions.has(qKey)) continue;
    for (const item of question.items || []) {
      if (cards.length >= limit) return cards;
      if (item.answer !== "X" || !isMeaningfulStatement(item.text)) continue;
      const wrong = String(item.text || "").replace(/\s+/g, " ").trim();
      const key = wrong.replace(/[·ㆍ\s]/g, "").toLowerCase();
      if (seen.has(key)) continue;
      const contextDependent =
        /[甲乙丙丁戊己庚辛]/.test(wrong) ||
        /(?:위|이러한|각각|전자의|후자의)\s/.test(wrong) ||
        wrong.length < 32;
      let correct = correctStatementFromExplanation(item.explanation, wrong);
      if (
        contextDependent &&
        question.explanationSummary &&
        question.explanationSummary.length > (correct?.length || 0)
      ) {
        correct = question.explanationSummary;
      }
      if (!correct || correct === wrong || correct.length < 18) continue;
      cards.push({
        wrong,
        correct,
        context: contextDependent ? question.stem : null,
        topic: contextDependent ? question.subcategory : null,
        meta: contextDependent ? `${question.year}년 · ${question.questionNo}번` : null,
      });
      seen.add(key);
      seenQuestions.add(qKey);
      break;
    }
  }

  return cards;
}
