/**
 * 시험 트랙 과목의 교재 목차(편 → 장)와 「출처|연도|번호 → 장」 대응표(2026-10-21).
 *
 * 앱마다 다른 목차 원천(curriculum.json·taxonomy.json…)을 scripts/toc/* 가 src/data/exam-toc/<트랙>.json 으로
 * 옮겨 둔다. 파일이 없거나 과목이 빠졌으면 fallbackToc 가 문항의 category(편)·subcategory(장)로 목차를
 * 세우고, 시험지가 대개 교재 순서로 문항을 늘어놓는 점을 빌려 평균 문항 번호 순으로 줄 세운다.
 */
export type TrackTocPart = { label: string; chapters: { id: string; label: string }[] };
export type TrackSubjectToc = { parts: TrackTocPart[]; byQuestion: Record<string, string> };

export function tocKey(exam: { sourceCode: string; year: number; questionNo: number }): string {
  return `${exam.sourceCode}|${exam.year}|${exam.questionNo}`;
}

export async function loadTrackSubjectToc(trackSlug: string, subjectId: string): Promise<TrackSubjectToc | null> {
  try {
    const mod = (await import(`@/data/exam-toc/${trackSlug}.json`)) as { default: Record<string, TrackSubjectToc> };
    return mod.default[subjectId] ?? null;
  } catch {
    return null;
  }
}

export function fallbackToc(
  exams: { sourceCode: string; year: number; questionNo: number; category?: string; subcategory?: string }[],
): TrackSubjectToc {
  const parts = new Map<string, { sum: number; n: number; chapters: Map<string, { sum: number; n: number }> }>();
  const byQuestion: Record<string, string> = {};
  for (const exam of exams) {
    const part = exam.category?.trim() || "기타";
    const chapter = exam.subcategory?.trim() || part;
    const p = parts.get(part) ?? { sum: 0, n: 0, chapters: new Map() };
    p.sum += exam.questionNo;
    p.n += 1;
    const c = p.chapters.get(chapter) ?? { sum: 0, n: 0 };
    c.sum += exam.questionNo;
    c.n += 1;
    p.chapters.set(chapter, c);
    parts.set(part, p);
    byQuestion[tocKey(exam)] = `${part}::${chapter}`;
  }
  const avg = (x: { sum: number; n: number }) => x.sum / Math.max(1, x.n);
  return {
    parts: [...parts.entries()]
      .sort((a, b) => avg(a[1]) - avg(b[1]))
      .map(([label, p]) => ({
        label,
        chapters: [...p.chapters.entries()]
          .sort((a, b) => avg(a[1]) - avg(b[1]))
          .map(([chapter]) => ({ id: `${label}::${chapter}`, label: chapter })),
      })),
    byQuestion,
  };
}
