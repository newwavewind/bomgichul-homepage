import "server-only";

import glossary from "@/data/exam-glossary-terms.json";
import type { CommunityScope } from "@/types/database";

export type ChoiceGlossary = { terms: string[]; firstDefinition?: string };
type GlossaryByChoice = Record<string, ChoiceGlossary>;
type ChoiceText = { key: string; text: string; explanation?: string };
type Vocabulary = { term: string; meaning: string };

const glossaryByExam: Record<string, Record<string, string[]> | string[]> = glossary;

type Definitions = Record<string, Record<string, string>>;
const firstDefinitions: Partial<Record<CommunityScope, () => Promise<{ default: unknown }>>> = {
  real_estate: () => import("@/data/glossary-first/real-estate.json"),
  public_service: () => import("@/data/glossary-first/public-service.json"),
  police: () => import("@/data/glossary-first/police.json"),
  firefighter: () => import("@/data/glossary-first/firefighter.json"),
  history: () => import("@/data/glossary-first/history.json"),
  housing: () => import("@/data/glossary-first/housing.json"),
  social_worker: () => import("@/data/glossary-first/social-worker.json"),
};

export async function examGlossaryTerms(
  scope: CommunityScope,
  examId: string,
  choices: ChoiceText[],
  vocabulary: Vocabulary[] = [],
): Promise<GlossaryByChoice> {
  const entry = glossaryByExam[examId];
  if (!entry && !vocabulary.length) return {};

  const data = await firstDefinitions[scope]?.();
  const definitions = (data?.default as Definitions | undefined)?.[examId];
  const byChoice: GlossaryByChoice = {};
  if (entry && !Array.isArray(entry)) {
    for (const [key, terms] of Object.entries(entry)) {
      byChoice[key] = { terms, firstDefinition: definitions?.[key] };
    }
    return byChoice;
  }

  const terms = [...(entry ?? []), ...vocabulary.map(({ term }) => term)];
  for (const { key, text, explanation } of choices) {
    const individualText = `${text} ${explanation ?? ""}`.toLowerCase();
    const compact = individualText.replace(/\s+/g, "");
    const matched = terms.filter((term) => {
      if (/[가-힣]/.test(term)) return compact.includes(term.replace(/\s+/g, "").toLowerCase());
      const literal = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${literal}\\b`, "i").test(individualText);
    });
    if (matched.length) {
      byChoice[key] = {
        terms: [...new Set(matched)],
        firstDefinition: definitions?.[key] ?? vocabulary.find(({ term }) => term === matched[0])?.meaning,
      };
    }
  }
  return byChoice;
}

const termsByScope = new Map<CommunityScope, Promise<Map<string, string>>>();

/** Reuse existing definitions from the same exam when this choice only links the term. */
export async function findExamGlossaryDefinition(scope: CommunityScope, term: string) {
  let pending = termsByScope.get(scope);
  if (!pending) {
    pending = (async () => {
      const source = (await firstDefinitions[scope]?.())?.default as Definitions | undefined;
      const terms = new Map<string, string>();
      for (const [id, definitions] of Object.entries(source ?? {})) {
        const entry = glossaryByExam[id];
        if (!entry || Array.isArray(entry)) continue;
        for (const [key, definition] of Object.entries(definitions)) {
          const name = entry[key]?.[0];
          if (name && definition && !terms.has(name)) terms.set(name, definition);
        }
      }
      return terms;
    })();
    termsByScope.set(scope, pending);
  }
  return (await pending).get(term) ?? null;
}
