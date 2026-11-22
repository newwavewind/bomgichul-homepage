"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  getConceptReadsSnapshot,
  getEmptyConceptReadsSnapshot,
  parseConceptReads,
  subscribeConceptReads,
} from "@/lib/concept-reads";

export function useConceptReadProgress(userId: string | null, subject: string) {
  const snapshot = useSyncExternalStore(
    subscribeConceptReads,
    () => getConceptReadsSnapshot(userId, subject),
    getEmptyConceptReadsSnapshot,
  );
  return useMemo(() => parseConceptReads(snapshot), [snapshot]);
}
