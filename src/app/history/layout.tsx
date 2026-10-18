import { notFound } from "next/navigation";
import { isPublicExamVisible } from "@/lib/public-exam-visibility";

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  if (!isPublicExamVisible("history")) notFound();
  return children;
}
