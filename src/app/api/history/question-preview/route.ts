import { getHistoryExam } from "@/lib/history-content";
import { examGlossaryTerms } from "@/lib/exam-glossary";
import type { HistoryQuestionPreview } from "@/lib/history-library-model";
import { pcQuestionOffers } from "@/lib/pc-access/study-context";

export async function GET(request: Request) {
  const href = new URL(request.url).searchParams.get("href");
  const match = href && /^\/history\/exam\/simhwa\/(20\d{2})\/([^/]+)\/([1-9]\d?)$/.exec(href);
  let source: string;
  try {
    source = match ? decodeURIComponent(match[2]) : "";
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!match || !/^제\d+회$/.test(source)) return new Response(null, { status: 400 });

  const exam = getHistoryExam("simhwa", Number(match[1]), source, Number(match[3]));
  if (!exam?.stem || !exam.items.length) return new Response(null, { status: 404 });

  const path = `/history/exam/simhwa/${exam.year}/${encodeURIComponent(exam.sourceCode)}/${exam.questionNo}`;
  const offers = pcQuestionOffers(path);
  const preview: HistoryQuestionPreview = {
    id: exam.id,
    year: exam.year,
    round: exam.round,
    sourceCode: exam.sourceCode,
    category: exam.category,
    subcategory: exam.subcategory,
    questionNo: exam.questionNo,
    stem: exam.stem,
    material: exam.material,
    correctChoice: exam.correctChoice,
    correctChoices: exam.correctChoices,
    explanationSummary: exam.explanationSummary,
    items: exam.items,
    glossaryByChoice: await examGlossaryTerms("history", exam.id, exam.items, exam.vocab),
    glossaryPro: offers.length ? { path, offers } : undefined,
  };
  return Response.json(preview, { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } });
}
