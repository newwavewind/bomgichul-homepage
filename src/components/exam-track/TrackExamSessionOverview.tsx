import Link from "next/link";

/**
 * 회차 한 판을 한 쪽에 — 문항마다 발문·정답·해설 요약(2026-10-20).
 *
 * 예전 회차 주소는 첫 문항으로 넘기기만 해서(307) 검색엔진이 색인할 본문이 없었다.
 * 애드센스 심사도 「콘텐츠 부족」으로 돌려보냈다. 이 쪽은 그 회차의 실제 기출을 한눈에
 * 보여 주고, 문항마다 풀이 쪽으로 잇는다. 정답과 해설 요약은 접어 두어 먼저 풀어 볼 수
 * 있게 한다 — 접어도 서버가 그린 글이라 검색엔진은 읽는다.
 */

/** 이 쪽이 읽는 칸만 — 시험 트랙 기출과 공무원 기출이 함께 쓴다. */
type OverviewExam = {
  id: string;
  questionNo: number;
  category?: string;
  kind?: string;
  stem?: string;
  prompt?: string;
  blanks?: { label: string; answer: string }[];
  explanation?: string;
  explanationSummary?: string;
  correctChoice?: number;
  correctChoices?: number[];
  items: { key: string; text: string; explanation?: string }[];
};

const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

function plain(text: string | undefined): string {
  return String(text ?? "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function firstSentence(text: string | undefined, max = 140): string {
  const t = plain(text).replace(/\s*\n\s*/g, " ");
  if (!t) return "";
  const cut = t.search(/(?<=[.다요])\s/);
  const one = cut > 0 && cut < max ? t.slice(0, cut) : t;
  return one.length > max ? `${one.slice(0, max - 1)}…` : one;
}

function answerOf(exam: OverviewExam): { label: string; text: string; summary: string } | null {
  if (exam.kind === "subjective") {
    const blanks = (exam.blanks ?? []).filter((blank) => blank.answer?.trim());
    if (!blanks.length) return null;
    return {
      label: "정답",
      text: blanks.map((blank) => `${blank.label} ${blank.answer}`).join(" · "),
      summary: firstSentence(exam.explanation),
    };
  }
  const choices = exam.correctChoices?.length ? exam.correctChoices : exam.correctChoice ? [exam.correctChoice] : [];
  if (!choices.length) return null;
  const items = choices
    .map((no) => exam.items.find((item) => Number(item.key) === no) ?? exam.items[no - 1])
    .filter(Boolean);
  const correctItem = items[0];
  return {
    label: choices.map((no) => CIRCLED[no - 1] ?? `${no}번`).join(" "),
    text: items.length === 1 ? plain(correctItem?.text) : "",
    summary: firstSentence(exam.explanationSummary) || firstSentence(correctItem?.explanation),
  };
}

export function TrackExamSessionOverview<T extends OverviewExam>({
  subjectLabel,
  year,
  source,
  exams,
  hrefFor,
}: {
  subjectLabel: string;
  year: number;
  source: string;
  exams: T[];
  hrefFor: (exam: T) => string;
}) {
  const counts = new Map<string, number>();
  for (const exam of exams) {
    const key = exam.category?.trim();
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const distribution = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const top = distribution[0]?.[1] ?? 0;

  return (
    <>
      {distribution.length > 1 ? (
        <section aria-labelledby="session-distribution" className="mt-6 rounded-2xl border border-mist bg-white p-5 md:p-6">
          <h2 id="session-distribution" className="font-display text-[17px] font-semibold text-ink">
            이 회차의 단원별 출제
          </h2>
          <p className="mt-1 font-display text-[13px] text-smoke">
            {year}년 {source} {subjectLabel} {exams.length}문항을 단원별로 나눠 봤어요.
          </p>
          <ul className="mt-4 space-y-2.5">
            {distribution.map(([label, count]) => (
              <li key={label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[minmax(0,12rem)_1fr_auto]">
                <span className="truncate font-display text-[14px] text-ink">{label}</span>
                <span className="order-3 col-span-2 h-1.5 overflow-hidden rounded-full bg-snow sm:order-none sm:col-span-1" aria-hidden>
                  <span className="block h-full rounded-full bg-electric-blue/70" style={{ width: `${Math.max(8, Math.round((count / top) * 100))}%` }} />
                </span>
                <span className="font-display text-[13px] tabular-nums text-smoke">{count}문항</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="session-questions" className="mt-8">
        <h2 id="session-questions" className="font-display text-[19px] font-semibold text-ink">
          문항별 정답과 해설
        </h2>
        <p className="mt-1 font-display text-[13px] text-smoke">
          문제를 누르면 직접 풀어 보고 선지별 해설도 볼 수 있어요.
        </p>
        <ol className="mt-4 space-y-3">
          {exams.map((exam) => {
            const answer = answerOf(exam);
            const stem = plain(exam.kind === "subjective" ? exam.prompt : exam.stem);
            return (
              <li key={exam.id} className="rounded-2xl border border-mist bg-white transition-colors hover:border-carbon/40">
                <Link href={hrefFor(exam)} className="block px-5 pt-4 pb-3 md:px-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-[14px] font-semibold text-electric-blue">{exam.questionNo}번</span>
                    {exam.category ? (
                      <span className="rounded-full bg-snow px-2.5 py-0.5 font-display text-[12px] text-smoke">{exam.category}</span>
                    ) : null}
                  </div>
                  <p className="mt-2 line-clamp-3 whitespace-pre-line font-display text-[15px] leading-relaxed text-ink">{stem}</p>
                </Link>
                {answer ? (
                  <details className="group border-t border-mist/70 px-5 py-3 md:px-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-display text-[13px] text-smoke [&::-webkit-details-marker]:hidden">
                      <span>정답·해설 요약 보기</span>
                      <span aria-hidden className="transition-transform group-open:rotate-180">⌄</span>
                    </summary>
                    <div className="mt-2.5 space-y-1.5 font-display text-[14px] leading-relaxed">
                      <p className="text-ink">
                        <span className="mr-1.5 font-semibold text-electric-blue">정답 {answer.label}</span>
                        {answer.text}
                      </p>
                      {answer.summary ? <p className="text-smoke">{answer.summary}</p> : null}
                    </div>
                  </details>
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
