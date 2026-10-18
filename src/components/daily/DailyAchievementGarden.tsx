import Link from "next/link";
import type { DailyAchievementStats } from "@/lib/daily-challenge/types";

type Variant = "summary" | "dashboard" | "result";
type MedalTier = "bronze" | "silver" | "gold" | "platinum";
type MedalDefinition = {
  key: string;
  label: string;
  description: string;
  value: (stats: DailyAchievementStats) => number;
  thresholds: readonly number[];
  suffix?: string;
};

const TREE_STAGES = [1, 3, 7, 14, 30, 60, 100] as const;

const MEDALS: MedalDefinition[] = [
  {
    key: "steady",
    label: "정진",
    description: "학습한 날",
    value: (stats: DailyAchievementStats) => stats.learningDays,
    thresholds: [7, 30, 100, 365],
  },
  {
    key: "complete",
    label: "완주",
    description: "누적 풀이",
    value: (stats: DailyAchievementStats) => stats.totalAnswered,
    thresholds: [100, 500, 1000, 3000],
  },
  {
    key: "perfect",
    label: "만점",
    description: "10/10 기록",
    value: (stats: DailyAchievementStats) => stats.perfectDays,
    thresholds: [1, 10, 30, 100],
  },
  {
    key: "review",
    label: "복습",
    description: "복습 정답",
    value: (stats: DailyAchievementStats) => stats.reviewCorrect,
    thresholds: [20, 100, 300, 1000],
  },
  {
    key: "archive",
    label: "수집",
    description: "기출 도감",
    value: (stats: DailyAchievementStats) =>
      stats.poolCount
        ? Math.round((stats.uniqueSolved / stats.poolCount) * 100)
        : 0,
    thresholds: [25, 50, 75, 100],
    suffix: "%",
  },
];

const TIER_NAMES: Record<MedalTier, string> = {
  bronze: "브론즈",
  silver: "실버",
  gold: "골드",
  platinum: "플래티넘",
};

const TIER_ORDER: MedalTier[] = ["bronze", "silver", "gold", "platinum"];

function medalState(value: number, thresholds: readonly number[]) {
  let index = -1;
  thresholds.forEach((threshold, current) => {
    if (value >= threshold) index = current;
  });
  const tier = index >= 0 ? TIER_ORDER[index] : null;
  const next = thresholds[Math.min(index + 1, thresholds.length - 1)];
  const previous = index >= 0 ? thresholds[index] : 0;
  const progress = index === thresholds.length - 1
    ? 100
    : Math.max(0, Math.min(100, ((value - previous) / (next - previous)) * 100));
  return { tier, next, progress };
}

function treeState(days: number) {
  const reached = TREE_STAGES.filter((threshold) => days >= threshold).length;
  const index = Math.min(reached, TREE_STAGES.length);
  const previous = index === 0 ? 0 : TREE_STAGES[index - 1];
  const next = TREE_STAGES[index] ?? TREE_STAGES[TREE_STAGES.length - 1];
  const progress = index >= TREE_STAGES.length
    ? 100
    : ((days - previous) / Math.max(1, next - previous)) * 100;
  return {
    stage: index,
    next,
    remaining: Math.max(0, next - days),
    progress: Math.max(0, Math.min(100, progress)),
  };
}

export function DailyAchievementGarden({
  stats,
  exam,
  subjectId,
  subjectLabel,
  variant = "summary",
}: {
  stats: DailyAchievementStats;
  exam: string;
  subjectId: string;
  subjectLabel: string;
  variant?: Variant;
}) {
  const tree = treeState(stats.learningDays);
  const collectionPercent = stats.poolCount
    ? Math.round((stats.uniqueSolved / stats.poolCount) * 100)
    : 0;
  const isDashboard = variant === "dashboard";
  const earned = MEDALS.filter((medal) =>
    medalState(medal.value(stats), medal.thresholds).tier,
  ).length;

  return (
    <section
      className={`relative overflow-hidden border border-[#DCE6DF] bg-[radial-gradient(circle_at_9%_0%,rgba(211,229,216,0.9),transparent_38%),linear-gradient(145deg,#F8FBF8_0%,#F4F8F6_54%,#F6F8FC_100%)] shadow-[0_18px_50px_rgba(28,55,43,0.08)] ${
        isDashboard ? "rounded-[32px] p-5 sm:p-7" : "rounded-[24px] p-4"
      }`}
      aria-label={`${subjectLabel} 학습 성취`}
    >
      <div className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full border border-white/70 bg-white/30" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[#688071]">
            LEARNING GARDEN
          </p>
          <h2 className={`${isDashboard ? "mt-2 text-2xl" : "mt-1 text-lg"} font-display font-semibold tracking-[-0.025em] text-[#173A2B]`}>
            나의 학습 정원
          </h2>
          <p className="mt-1 text-xs leading-5 text-[#65746D]">
            풀수록 자라고, 기록은 메달로 남습니다.
          </p>
        </div>
        <span className="rounded-full border border-white/90 bg-white/75 px-3 py-1.5 text-[11px] font-semibold text-[#4C6659] shadow-sm backdrop-blur">
          메달 {earned}/{MEDALS.length}
        </span>
      </div>

      <div className={`relative mt-4 grid items-stretch gap-3 ${isDashboard ? "md:grid-cols-[1.05fr_1.3fr]" : "grid-cols-[0.92fr_1.08fr]"}`}>
        <div className="relative min-h-[164px] overflow-hidden rounded-[22px] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(235,243,237,0.88))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
          <div className="absolute inset-x-3 bottom-3 h-12 rounded-[50%] bg-[#DDE9DF]/65 blur-xl" />
          <StudyTree stage={tree.stage} large={isDashboard} />
          <div className="relative mt-1 flex items-end justify-between gap-2">
            <div>
              <p className="text-[11px] font-medium text-[#718078]">누적 학습</p>
              <p className="mt-0.5 font-display text-lg font-semibold text-[#204535]">
                {stats.learningDays.toLocaleString()}일
              </p>
            </div>
            <p className="max-w-[98px] text-right text-[10px] leading-4 text-[#718078]">
              {tree.remaining > 0
                ? `다음 성장까지 ${tree.remaining}일`
                : "최종 성장 단계"}
            </p>
          </div>
          <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-[#DDE7DF]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#7B9D86,#3F765C)] transition-[width] duration-700"
              style={{ width: `${tree.progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-[22px] border border-white/90 bg-white/75 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur">
          <div className="flex items-center gap-3">
            <CollectionRing percent={collectionPercent} />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[#718078]">최근 10개년 수집</p>
              <p className="mt-0.5 font-display text-lg font-semibold text-[#243B53]">
                {stats.uniqueSolved.toLocaleString()}
                <span className="ml-1 text-xs font-medium text-[#7A8794]">
                  / {stats.poolCount.toLocaleString()}문제
                </span>
              </p>
              <p className="mt-1 text-[10px] leading-4 text-[#7A8794]">
                {stats.yearsCompleted > 0
                  ? `${stats.yearsCompleted}개 연도 완주`
                  : `${stats.yearsStarted}/${stats.totalYears}개 연도 수집 시작`}
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
            <Metric label="누적 풀이" value={`${stats.totalAnswered.toLocaleString()}문제`} />
            <Metric label="만점 기록" value={`${stats.perfectDays.toLocaleString()}회`} />
          </div>
        </div>
      </div>

      <div className={`relative mt-3 grid gap-2 ${isDashboard ? "grid-cols-2 sm:grid-cols-5" : "grid-cols-5"}`}>
        {MEDALS.map((medal) => {
          const value = medal.value(stats);
          const state = medalState(value, medal.thresholds);
          return (
            <div
              key={medal.key}
              className={`group relative min-w-0 overflow-hidden rounded-[18px] border px-1.5 py-2 text-center transition-transform duration-200 hover:-translate-y-0.5 ${
                state.tier
                  ? "border-white/90 bg-white/80 shadow-[0_7px_18px_rgba(38,55,46,0.07)]"
                  : "border-[#E1E7E3] bg-[#F2F5F3]/75"
              }`}
            >
              <MedalIcon id={medal.key} tier={state.tier} />
              <p className="mt-1 truncate text-[10px] font-semibold text-[#334A3F]">
                {medal.label}
              </p>
              {isDashboard ? (
                <>
                  <p className="mt-0.5 text-[9px] text-[#829087]">
                    {state.tier ? TIER_NAMES[state.tier] : medal.description}
                  </p>
                  <div className="mx-auto mt-1.5 h-0.5 w-9 overflow-hidden rounded-full bg-[#DEE5E0]">
                    <div
                      className="h-full rounded-full bg-[#668A74]"
                      style={{ width: `${state.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[9px] tabular-nums text-[#87948D]">
                    {value.toLocaleString()}{medal.suffix ?? ""}
                    {!state.tier || state.tier !== "platinum"
                      ? ` / ${state.next.toLocaleString()}${medal.suffix ?? ""}`
                      : ""}
                  </p>
                </>
              ) : null}
            </div>
          );
        })}
      </div>

      {!isDashboard ? (
        <Link
          href={`/${exam}/daily/progress?subject=${encodeURIComponent(subjectId)}`}
          className="relative mt-3 flex min-h-10 items-center justify-between rounded-[14px] border border-white/90 bg-white/70 px-3.5 text-xs font-semibold text-[#3D5D4C] shadow-sm transition-colors hover:bg-white"
        >
          <span>수집 도감과 메달 자세히 보기</span>
          <span aria-hidden className="text-base font-light text-[#668A74]">→</span>
        </Link>
      ) : null}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#F4F7F5] px-2 py-2">
      <p className="text-[#839087]">{label}</p>
      <p className="mt-0.5 truncate font-semibold tabular-nums text-[#40554A]">{value}</p>
    </div>
  );
}

function CollectionRing({ percent }: { percent: number }) {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (Math.max(0, Math.min(100, percent)) / 100);
  return (
    <div className="relative size-[66px] shrink-0">
      <svg viewBox="0 0 64 64" className="size-full -rotate-90" aria-hidden>
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#E4EBE7" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#4E8066"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold tabular-nums text-[#365847]">
        {percent}%
      </span>
    </div>
  );
}

function MedalIcon({ id, tier }: { id: string; tier: MedalTier | null }) {
  const palette = tier
    ? {
        bronze: ["#B8794D", "#E0B38C"],
        silver: ["#83909D", "#DCE2E8"],
        gold: ["#B78A32", "#F2D88D"],
        platinum: ["#486779", "#C8E0E6"],
      }[tier]
    : ["#AAB4AE", "#E3E8E5"];
  const symbol = { steady: "I", complete: "II", perfect: "★", review: "↺", archive: "◆" }[id] ?? "•";
  const gradientId = `medal-${id}-${tier ?? "locked"}`;
  return (
    <svg viewBox="0 0 48 54" aria-hidden className={`mx-auto h-8 w-7 ${tier ? "" : "opacity-55"}`}>
      <defs>
        <linearGradient id={gradientId} x1="8" y1="5" x2="39" y2="47" gradientUnits="userSpaceOnUse">
          <stop stopColor={palette[1]} />
          <stop offset="1" stopColor={palette[0]} />
        </linearGradient>
      </defs>
      <path d="M12 2h9l3 14-10 5L8 7z" fill={palette[0]} opacity=".82" />
      <path d="M27 2h9l4 5-6 14-10-5z" fill={palette[1]} opacity=".9" />
      <circle cx="24" cy="32" r="16" fill={`url(#${gradientId})`} stroke="white" strokeWidth="2" />
      <circle cx="24" cy="32" r="11.5" fill="none" stroke="white" strokeOpacity=".5" />
      <text x="24" y="36" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">{symbol}</text>
    </svg>
  );
}

function StudyTree({ stage, large }: { stage: number; large: boolean }) {
  const visibleLeaves = Math.min(18, stage * 3);
  const growthTop = stage === 0 ? 116 : Math.max(18, 118 - stage * 14);
  const leaves = [
    [62, 108, 0], [95, 96, 52], [74, 94, 14], [51, 91, -22],
    [29, 88, -68], [87, 79, 35], [66, 73, 4], [42, 76, -42],
    [101, 66, 64], [76, 57, 22], [53, 57, -24], [31, 59, -60],
    [92, 50, 52], [63, 40, -12], [39, 42, -48], [84, 34, 38],
    [69, 21, 18], [52, 27, -28],
  ] as const;
  return (
    <svg
      viewBox="0 0 130 128"
      aria-label={`학습 나무 ${stage}단계`}
      role="img"
      className={`relative mx-auto block ${large ? "h-44" : "h-[86px]"} w-full max-w-[210px]`}
    >
      <defs>
        <clipPath id={`tree-growth-${stage}-${large ? "large" : "small"}`}>
          <rect x="0" y={growthTop} width="130" height={128 - growthTop} rx="4" />
        </clipPath>
      </defs>
      <ellipse cx="65" cy="119" rx="40" ry="5" fill="#B9CBBE" opacity=".35" />
      {stage === 0 ? (
        <>
          <ellipse cx="64" cy="115" rx="5" ry="3.5" fill="#6F8B78" />
          <path d="M64 113c-1-5 1-8 4-10" fill="none" stroke="#5D8069" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <g clipPath={`url(#tree-growth-${stage}-${large ? "large" : "small"})`}>
          <path d="M63 118c2-27-3-42 3-66 2-9 4-17 3-28" fill="none" stroke="#725B45" strokeWidth="7" strokeLinecap="round" />
          <path d="M66 76C54 68 46 57 40 43M66 62c11-8 20-18 25-30M64 93c-14-8-23-19-29-31M65 86c13-5 24-14 32-25M68 48c-7-7-11-14-13-23M69 47c7-5 12-11 15-18" fill="none" stroke="#786049" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {leaves.slice(0, visibleLeaves).map(([cx, cy, rotate], index) => (
            <ellipse
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              rx={index % 3 === 0 ? 10 : 8.5}
              ry={index % 3 === 0 ? 5.5 : 4.8}
              transform={`rotate(${rotate} ${cx} ${cy})`}
              fill={index % 4 === 0 ? "#729B7C" : index % 3 === 0 ? "#96B39C" : "#4F8063"}
            />
          ))}
        </g>
      )}
    </svg>
  );
}
