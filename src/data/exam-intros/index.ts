import { englishIntro } from "./english";
import { historyIntro } from "./history";
import { housingIntro } from "./housing";
import { policeIntro } from "./police";
import { publicServiceIntro } from "./public-service";
import { realEstateIntro } from "./real-estate";
import { socialWorkerIntro } from "./social-worker";
import type { ExamIntro } from "./types";

export type { ExamIntro } from "./types";

export const EXAM_INTROS = {
  "public-service": publicServiceIntro,
  "real-estate": realEstateIntro,
  police: policeIntro,
  housing: housingIntro,
  "social-worker": socialWorkerIntro,
  history: historyIntro,
  english: englishIntro,
} as const satisfies Record<string, ExamIntro>;

export type ExamIntroId = keyof typeof EXAM_INTROS;

export function getExamIntro(id: ExamIntroId): ExamIntro {
  return EXAM_INTROS[id];
}
