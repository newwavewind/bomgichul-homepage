import Link from "next/link";
import { buildHubStats, type HubSubjectStats } from "@/lib/exam-track/hub-stats";
import { trackHidesExamSourceLabel } from "@/lib/exam-track/sourceLabel";

/**
 * 시험 허브의 안내 본문(2026-10-20) — 「기출 한눈에」·과목별 자주 나오는 단원·공부 순서·최근 회차.
 *
 * 숫자와 단원 이름은 모두 이 시험의 기출을 직접 센 값이다(hub-stats). 지어낸 출제 경향은 적지 않는다.
 * 시험 안내(exam-intros) 요약은 「~를 정리했습니다」처럼 안내 쪽을 가리키는 말이라 여기 쓰지 않는다.
 */

/** 받침 있으면 「은」, 없으면 「는」 — 과목 이름 뒤 조사 */
function eunNeun(word: string): string {
  const last = word.trim().slice(-1);
  const code = last.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return "은(는)";
  return code % 28 === 0 ? "는" : "은";
}

function joinUnits(units: { label: string }[], n = 2): string {
  return units.slice(0, n).map((u) => `「${u.label}」`).join("·");
}

/**
 * id 는 시험 트랙 id 또는 트랙 밖 허브(「public_service」·「real_estate」). 공인중개사는 옛 구조라
 * 기출 주소가 /exam/{과목}/{연도} 이고, 나머지는 {basePath}/exam/{과목}/{연도}/{회차} 다.
 */
export async function ExamTrackHubGuide({ id, basePath, label }: { id: string; basePath: string; label: string }) {
  const stats = await buildHubStats(id);
  if (!stats) return null;
  const showSource = !trackHidesExamSourceLabel(id);
  const examBase = id === "real_estate" ? "/exam" : `${basePath}/exam`;
  const roundHref = (subject: HubSubjectStats) =>
    !subject.latest
      ? `${examBase}/${subject.id}`
      : id === "real_estate"
        ? `${examBase}/${subject.id}/${subject.latest.year}`
        : `${examBase}/${subject.id}/${subject.latest.year}/${encodeURIComponent(subject.latest.sourceCode)}`;
  const withUnits = stats.subjects.filter((subject) => subject.topUnits.length > 0);
  // 과목이 많은 시험(공무원 15·청소년상담사 22)은 앞 6과목만 펼치고 나머지는 접는다 — 접어도 서버가 그린 글이다.
  const shown = withUnits.slice(0, 6);
  const folded = withUnits.slice(6);
  const unitCard = (subject: HubSubjectStats) => (
    <article key={subject.id} className="flex flex-col rounded-2xl border border-mist bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[17px] font-semibold text-ink">{subject.label}</h3>
        <span className="font-display text-[13px] tabular-nums text-smoke">{subject.questionCount}문항</span>
      </div>
      <ul className="mt-4 flex-1 space-y-2.5">
        {subject.topUnits.map((unit) => (
          <li key={unit.label}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate font-display text-[14px] text-ink">{unit.label}</span>
              <span className="shrink-0 font-display text-[12px] tabular-nums text-smoke">{unit.share}%</span>
            </div>
            <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-snow" aria-hidden>
              <span className="block h-full rounded-full bg-electric-blue/70" style={{ width: `${Math.max(4, unit.share)}%` }} />
            </span>
          </li>
        ))}
      </ul>
      {subject.latest ? (
        <Link
          href={roundHref(subject)}
          className="mt-5 inline-flex items-center gap-1 self-start font-display text-[13px] font-semibold text-electric-blue underline-offset-2 hover:underline"
        >
          최근 {subject.latest.year}년{showSource ? ` ${subject.latest.sourceCode}` : ""} {subject.latest.count}문항 보기 <span aria-hidden>→</span>
        </Link>
      ) : null}
    </article>
  );
  const newest = [...stats.subjects].sort((a, b) => (b.latest?.year ?? 0) - (a.latest?.year ?? 0))[0];

  return (
    <div className="space-y-10 md:space-y-12">
      <section aria-labelledby="hub-overview" className="rounded-[var(--radius-largecards)] border border-mist bg-white p-6 md:p-8">
        <p className="font-display text-[13px] font-semibold text-electric-blue">기출 한눈에</p>
        <h2 id="hub-overview" className="mt-1.5 font-display text-[24px] font-semibold leading-snug text-ink md:text-[26px]">
          {label} 기출, 이렇게 담았어요
        </h2>
        <p className="mt-3 max-w-3xl font-display text-body-sm leading-relaxed text-smoke">
          {label} {stats.subjects.length}과목 기출을 회차 그대로 모았어요. 과목을 고르면 연도별 회차가, 회차를 고르면 그 회차 문제 전체가 나와요.
        </p>
        <dl className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "수록 기출", value: stats.firstYear === stats.lastYear ? `${stats.lastYear}년` : `${stats.firstYear}–${stats.lastYear}년` },
            { label: "문항", value: `${stats.questionCount.toLocaleString("ko-KR")}문항` },
            { label: "과목·회분", value: `${stats.subjects.length}과목 · ${stats.sessionCount}회분` },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-snow px-4 py-3.5">
              <dt className="font-display text-[12px] text-smoke">{item.label}</dt>
              <dd className="mt-1 font-display text-[16px] font-semibold text-ink md:text-[18px]">{item.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 font-display text-[13px] leading-relaxed text-smoke">
          모든 문제에 정답과 선지별 해설이 있고, 회차별로 문제 전체를 한 화면에서 볼 수 있어요.
        </p>
      </section>

      {withUnits.length ? (
        <section aria-labelledby="hub-units">
          <h2 id="hub-units" className="font-display text-[22px] font-semibold text-ink">과목별로 자주 나오는 단원</h2>
          <p className="mt-1.5 font-display text-body-sm text-smoke">
            기출 {stats.questionCount.toLocaleString("ko-KR")}문항을 단원별로 나눠 봤어요. 막대 길이는 그 과목에서 차지하는 비율이에요.
          </p>
          <div className={`mt-5 grid gap-4 md:grid-cols-2 ${withUnits.length > 6 ? "xl:grid-cols-3" : ""}`}>
            {shown.map(unitCard)}
          </div>
          {folded.length ? (
            <details className="group mt-4">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-mist bg-white px-4 py-2 font-display text-[13px] font-semibold text-ink hover:border-carbon [&::-webkit-details-marker]:hidden">
                과목 {folded.length}개 더 보기
                <span aria-hidden className="transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{folded.map(unitCard)}</div>
            </details>
          ) : null}
        </section>
      ) : null}

      <section aria-labelledby="hub-howto" className="rounded-[var(--radius-largecards)] border border-mist bg-paper p-6 md:p-8">
        <h2 id="hub-howto" className="font-display text-[22px] font-semibold text-ink">이렇게 공부해 보세요</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          <li className="rounded-2xl bg-white p-5">
            <p className="font-display text-[13px] font-semibold text-electric-blue">1 · 최근 회차로 출발점 확인</p>
            <p className="mt-2 font-display text-[14px] leading-relaxed text-ink">
              {newest?.latest
                ? `${newest.label} ${newest.latest.year}년 기출을 처음부터 끝까지 풀어 보세요.`
                : "가장 최근 회차를 처음부터 끝까지 풀어 보세요."}{" "}
              다 풀고 나면 어느 단원이 약한지 알 수 있어요.
            </p>
          </li>
          <li className="rounded-2xl bg-white p-5">
            <p className="font-display text-[13px] font-semibold text-electric-blue">2 · 자주 나오는 단원부터</p>
            <p className="mt-2 font-display text-[14px] leading-relaxed text-ink">
              {withUnits.length
                ? withUnits
                    .slice(0, 2)
                    .map((s) => `${s.label}${eunNeun(s.label)} ${joinUnits(s.topUnits)}`)
                    .join(", ") + "에서 많이 나왔어요. "
                : ""}
              많이 나오는 단원부터 해설을 읽어 두세요.
            </p>
          </li>
          <li className="rounded-2xl bg-white p-5">
            <p className="font-display text-[13px] font-semibold text-electric-blue">3 · 매일 조금씩 다시</p>
            <p className="mt-2 font-display text-[14px] leading-relaxed text-ink">
              <Link href={`${basePath}/daily`} className="font-semibold text-electric-blue underline-offset-2 hover:underline">
                매일 10문제
              </Link>
              로 조금씩 꾸준히 풀고, 틀린 문제는 해설을 읽은 뒤 다시 풀어 보세요.
            </p>
          </li>
        </ol>
      </section>
    </div>
  );
}
