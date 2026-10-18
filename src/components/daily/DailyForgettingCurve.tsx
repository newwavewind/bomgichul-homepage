/** Ebbinghaus (1885), chapter VII: observed relearning-time savings, not recall accuracy. */
const observations = [
  { label: "20분", minutes: 20, savings: 58.2 },
  { label: "1시간", minutes: 63, savings: 44.2 },
  { label: "약 9시간", minutes: 525, savings: 35.8 },
  { label: "1일", minutes: 1440, savings: 33.7 },
  { label: "2일", minutes: 2880, savings: 27.8 },
  { label: "6일", minutes: 8640, savings: 25.4 },
  { label: "31일", minutes: 44640, savings: 21.1 },
] as const;

const maxSavings = 70;
const firstLog = Math.log10(observations[0].minutes);
const lastLog = Math.log10(observations[observations.length - 1].minutes);

function CurvePlot({ compact }: { compact: boolean }) {
  const left = compact ? 38 : 62;
  const right = compact ? 334 : 548;
  const top = compact ? 34 : 32;
  const bottom = compact ? 204 : 214;
  const points = observations.map((observation) => ({
    ...observation,
    x: left + ((Math.log10(observation.minutes) - firstLog) / (lastLog - firstLog)) * (right - left),
    y: bottom - (observation.savings / maxSavings) * (bottom - top),
  }));
  const line = points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const area = `${line} L${right} ${bottom} L${left} ${bottom} Z`;
  const gradientId = compact ? "daily-forgetting-area-mobile" : "daily-forgetting-area-desktop";
  const visibleLabels = compact ? [0, 1, 3, 5, 6] : [0, 1, 2, 3, 5, 6];

  return (
    <svg
      viewBox={compact ? "0 0 360 260" : "0 0 600 276"}
      role="img"
      aria-label="에빙하우스의 1885년 재학습 시간 절약률 관측값. 20분 58.2퍼센트, 1시간 44.2퍼센트, 9시간 35.8퍼센트, 1일 33.7퍼센트, 2일 27.8퍼센트, 6일 25.4퍼센트, 31일 21.1퍼센트"
      className={compact ? "block h-auto w-full sm:hidden" : "hidden h-auto w-full sm:block"}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1682ED" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#1682ED" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {[0, 20, 40, 60].map((value) => {
        const y = bottom - (value / maxSavings) * (bottom - top);
        return (
          <g key={value}>
            <path d={`M${left} ${y}H${right}`} stroke={value === 0 ? "#AFC2D5" : "#DFE9F3"} strokeWidth="1" strokeDasharray={value === 0 ? undefined : "4 5"} />
            <text x={left - 10} y={y + 4} textAnchor="end" fill="#6F8299" fontSize={compact ? 11 : 14}>{value}</text>
          </g>
        );
      })}
      <text x={left} y={compact ? 18 : 20} fill="#50647B" fontSize={compact ? 11 : 15} fontWeight="600">재학습 시간 절약률 (%)</text>
      <path d={area} fill={`url(#${gradientId})`} />
      <path d={line} fill="none" stroke="#0575E6" strokeWidth={compact ? 2.8 : 3.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point, index) => (
        <g key={point.label}>
          <circle cx={point.x} cy={point.y} r={compact ? 5 : 7} fill="white" stroke="#0575E6" strokeWidth={compact ? 2.3 : 3} />
          {[0, 3, 6].includes(index) ? (
            <text x={point.x} y={point.y - (compact ? 11 : 16)} textAnchor="middle" fill="#075AA8" fontSize={compact ? 12 : 16} fontWeight="700">
              {point.savings}%
            </text>
          ) : null}
          {visibleLabels.includes(index) ? (
            <text x={point.x} y={compact ? 227 : 244} textAnchor="middle" fill="#536A83" fontSize={compact ? 11 : 14} fontWeight="600">
              {point.label}
            </text>
          ) : null}
        </g>
      ))}
      <text x={right} y={compact ? 252 : 268} textAnchor="end" fill="#7890A6" fontSize={compact ? 10 : 12}>학습 후 경과 시간 · 로그 간격</text>
    </svg>
  );
}

export function DailyForgettingCurve() {
  return (
    <figure className="mt-5 overflow-hidden rounded-[22px] border border-[#DBE7F3] bg-[#F8FBFF] shadow-[0_12px_32px_rgba(31,69,115,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-3 px-4 pt-5 sm:px-6">
        <div>
          <p className="text-[11px] font-bold tracking-[0.12em] text-[#0066D6]">1885 · ORIGINAL OBSERVATIONS</p>
          <h4 className="mt-1 text-base font-semibold text-ink">에빙하우스의 실제 관측값</h4>
        </div>
        <span className="rounded-full border border-[#D8E7F7] bg-white px-3 py-1 text-xs font-semibold text-[#41637F]">
          실측 7개 시점
        </span>
      </div>
      <p className="px-4 pt-2 text-sm leading-6 text-[#52657C] sm:px-6">
        무의미 음절을 학습한 뒤 다시 익힐 때, 처음보다 절약된 학습 시간의 비율입니다.
      </p>
      <div className="px-2 pt-3 sm:px-4">
        <CurvePlot compact />
        <CurvePlot compact={false} />
      </div>
      <dl className="grid grid-cols-4 gap-1.5 px-4 pb-4 sm:grid-cols-7 sm:gap-2 sm:px-6 sm:pb-5">
        {observations.map((observation) => (
          <div key={observation.label} className="rounded-xl border border-white bg-white/90 px-2 py-2 text-center shadow-[0_2px_7px_rgba(39,73,108,0.04)]">
            <dt className="text-[11px] font-medium text-[#64748B]">{observation.label}</dt>
            <dd className="mt-0.5 text-sm font-bold tabular-nums text-[#075AA8]">{observation.savings}%</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
