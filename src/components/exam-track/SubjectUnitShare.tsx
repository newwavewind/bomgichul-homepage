/**
 * 과목 쪽의 「자주 나오는 단원」(2026-10-20) — 이 과목 기출을 단원별로 센 값.
 * 과목 쪽은 회차 카드뿐이라 본문이 약 700자였다(애드센스 「콘텐츠 부족」). 넘기는 쪽이 그릴 수 있는 문항만 거른다.
 */
export function SubjectUnitShare({ exams, subjectLabel }: { exams: { category?: string }[]; subjectLabel: string }) {
  const counts = new Map<string, number>();
  for (const exam of exams) {
    const unit = exam.category?.trim();
    if (unit) counts.set(unit, (counts.get(unit) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  const units = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  if (units.length < 2) return null;
  const top = units[0][1];
  return (
    <section aria-labelledby="subject-units" className="mt-10 rounded-2xl border border-mist bg-white p-5 md:p-6">
      <h2 id="subject-units" className="font-display text-[19px] font-semibold text-ink">
        {subjectLabel}에서 자주 나오는 단원
      </h2>
      <p className="mt-1 font-display text-[13px] text-smoke">
        기출 {total.toLocaleString("ko-KR")}문항을 단원별로 나눠 봤어요. 많이 나오는 단원부터 해설을 읽어 두세요.
      </p>
      <ul className="mt-4 space-y-2.5">
        {units.map(([label, count]) => (
          <li key={label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[minmax(0,14rem)_1fr_auto]">
            <span className="truncate font-display text-[14px] text-ink">{label}</span>
            <span className="order-3 col-span-2 h-1.5 overflow-hidden rounded-full bg-snow sm:order-none sm:col-span-1" aria-hidden>
              <span className="block h-full rounded-full bg-electric-blue/70" style={{ width: `${Math.max(6, Math.round((count / top) * 100))}%` }} />
            </span>
            <span className="font-display text-[13px] tabular-nums text-smoke">
              {count}문항 · {Math.round((count / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
