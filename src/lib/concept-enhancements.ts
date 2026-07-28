import type { Concept } from "@/lib/concepts";
import {
  getConceptEnhancement as getAppConceptEnhancement,
} from "@/data/concepts/conceptEnhancements.js";

/** App Kind UI guides are untyped JSON-shaped objects. */
export type ConceptEnhancement = Record<string, unknown> & {
  kind?: string;
  summary?: string;
};

export function getConceptEnhancement(
  concept: Concept | null | undefined
): ConceptEnhancement | null {
  if (!concept?.slug) return null;
  return getAppConceptEnhancement(concept) as ConceptEnhancement | null;
}
