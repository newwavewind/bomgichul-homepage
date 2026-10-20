import Link from "next/link";
import { getDailyEligiblePool } from "@/lib/daily-challenge/pool";

/**
 * 매일 10문제 과목 고르기 화면 아래의 안내(2026-10-20) — 서버가 그리는 글.
 *
 * 과목 고르기는 단추뿐이라 검색엔진이 읽을 본문이 약 450자였다(애드센스 「콘텐츠 부족」).
 * 규칙은 풀이 화면의 「한 바퀴는 어떻게 도나요?」와 같은 말이고, 과목별 숫자는 실제 문제 모음에서 센다.
 */
export function DailyAbout({
  exam,
  label,
  home,
  subjects,
}: {
  exam: string;
  label: string;
  home: string;
  subjects: { id: string; label: string }[];
}) {
  const rows = subjects
    .map((subject) => {
      const pool = getDailyEligiblePool(exam, subject.id);
      if (!pool.length) return null;
      const years = pool.map((q) => q.year);
      return {
        ...subject,
        count: pool.length,
        firstYear: Math.min(...years),
        lastYear: Math.max(...years),
        days: Math.ceil(pool.length / 10),
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);
  if (!rows.length) return null;

  const rules: [string, string][] = [
    ["모두 같은 10문제", "같은 날에는 누가 풀어도 같은 10문제가 나와요. 그래서 순위를 공정하게 비교할 수 있어요."],
    ["하루 10문제씩 차례로", "과목 기출을 한 번 섞은 뒤 첫날은 1~10번, 다음 날은 11~20번을 내요. 한 바퀴를 다 풀기 전에는 같은 문제가 다시 나오지 않아요."],
    ["다 돌면 다시 섞기", "마지막 문제까지 다 풀면 순서를 새로 섞어 처음부터 다시 시작해요. 순서를 외워서는 풀 수 없어요."],
    ["풀고 나면 해설까지", "채점이 끝나면 문제마다 정답과 선지별 해설이 나오고, 틀린 문제만 모아 다시 풀 수 있어요."],
  ];

  return (
    <div className="bg-white px-4 pb-12">
      <div className="mx-auto max-w-xl space-y-6">
        <section aria-labelledby="daily-how" className="rounded-[28px] border border-mist bg-white p-5 md:p-7">
          <h2 id="daily-how" className="font-display text-[20px] font-semibold text-ink">
            {label} 매일 10문제는 이렇게 구성돼요
          </h2>
          <ol className="mt-4 space-y-3">
            {rules.map(([title, body], index) => (
              <li key={title} className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-electric-blue/10 font-display text-[12px] font-semibold text-electric-blue">
                  {index + 1}
                </span>
                <p className="font-display text-[14px] leading-relaxed text-smoke">
                  <strong className="font-semibold text-ink">{title}</strong> · {body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="daily-pools" className="rounded-[28px] border border-mist bg-white p-5 md:p-7">
          <h2 id="daily-pools" className="font-display text-[20px] font-semibold text-ink">과목별 문제 모음</h2>
          <p className="mt-1.5 font-display text-[13px] text-smoke">
            과목마다 아래 기출에서 하루 10문제씩 나와요.
          </p>
          <ul className="mt-4 divide-y divide-mist">
            {rows.map((row) => (
              <li key={row.id} className="flex items-baseline justify-between gap-4 py-3">
                <span className="font-display text-[15px] font-semibold text-ink">{row.label}</span>
                <span className="shrink-0 text-right font-display text-[13px] tabular-nums text-smoke">
                  {row.firstYear === row.lastYear ? `${row.lastYear}년` : `${row.firstYear}–${row.lastYear}년`} · {row.count.toLocaleString("ko-KR")}문제 · 한 바퀴 약 {row.days}일
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-display text-[13px] leading-relaxed text-smoke">
            회차별로 문항 전체를 보고 싶다면{" "}
            <Link href={home} className="font-semibold text-electric-blue underline-offset-2 hover:underline">
              {label} 학습 홈
            </Link>
            에서 과목과 연도를 고르세요.
          </p>
        </section>
      </div>
    </div>
  );
}
