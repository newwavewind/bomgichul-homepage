import { ExamStructuredMaterials } from "@/components/exam/ExamStructuredMaterials";
import type { PublicServiceExamTable, PublicServiceTAccount } from "@/lib/public-service-content";

/** 공무원 상세 화면의 기존 진입점 — 실제 렌더러는 모든 시험이 공유한다. */
export function PublicServiceExamMaterials({
  table,
  tAccounts,
  stemTail,
}: {
  table?: PublicServiceExamTable | PublicServiceExamTable[];
  tAccounts?: PublicServiceTAccount[];
  stemTail?: string;
}) {
  return <ExamStructuredMaterials table={table} tAccounts={tAccounts} stemTail={stemTail} />;
}
