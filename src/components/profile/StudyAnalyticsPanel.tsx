import type { CategoryStat, YearStat } from "@/lib/study-analytics";
import { ARCHIVE_SUBJECT_MAP } from "@/lib/constants";
import type { ExamSubject } from "@/lib/exam-questions";

function accuracyColor(accuracy: number): string {
  if (accuracy >= 80) return "bg-[#6366f1]";
  if (accuracy >= 60) return "bg-[#818cf8]";
  if (accuracy >= 40) return "bg-[#f59e0b]";
  return "bg-[#ef4444]";
}

function CategoryBars({ categories }: { categories: CategoryStat[] }) {
  if (categories.length === 0) {
    return (
      <p className="font-display text-body-sm text-smoke">
        아직 단원별 채점 기록이 없어요. 문제를 풀고 맞았어요/틀렸어요를 남겨보세요.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map((cat) => (
        <div key={cat.category}>
          <div className="mb-1 flex items-center justify-between gap-3">
            <span className="font-display text-body-sm font-medium text-ink">{cat.category}</span>
            <span className="font-display text-[12px] text-smoke">
              {cat.accuracy}% ({cat.correct}/{cat.total})
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-mist">
            <div
              className={`h-full rounded-full ${accuracyColor(cat.accuracy)}`}
              style={{ width: `${cat.accuracy}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function YearHeatmap({ years }: { years: YearStat[] }) {
  if (years.length === 0) {
    return (
      <p className="font-display text-body-sm text-smoke">
        아직 연도별 채점 기록이 없어요.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
      {years.map((year) => (
        <div
          key={year.year}
          className="rounded-[var(--radius-buttons)] border-[1.5px] border-mist bg-paper px-3 py-3 text-center"
        >
          <p className="font-display text-[12px] text-fog">{year.year}년</p>
          <p className={`mt-1 font-display text-body-sm font-bold text-ink`}>{year.accuracy}%</p>
          <div className="mx-auto mt-2 h-2 w-full overflow-hidden rounded-full bg-mist">
            <div
              className={`h-full rounded-full ${accuracyColor(year.accuracy)}`}
              style={{ width: `${year.accuracy}%` }}
            />
          </div>
          <p className="mt-1 font-display text-[11px] text-smoke">
            {year.correct}/{year.total}
          </p>
        </div>
      ))}
    </div>
  );
}

export function StudyAnalyticsPanel({
  subject,
  categories,
  years,
  totalAttempts,
}: {
  subject: ExamSubject;
  categories: CategoryStat[];
  years: YearStat[];
  totalAttempts: number;
}) {
  const label = ARCHIVE_SUBJECT_MAP[subject];

  return (
    <div className="rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-display text-body font-semibold text-ink">{label} 학습 분석</h3>
        <span className="font-display text-[12px] text-fog">채점 {totalAttempts}회</span>
      </div>

      <p className="mb-3 font-display text-[12px] font-semibold uppercase tracking-wide text-fog">
        단원별 약점
      </p>
      <CategoryBars categories={categories} />

      <p className="mb-3 mt-6 font-display text-[12px] font-semibold uppercase tracking-wide text-fog">
        연도별 정답률
      </p>
      <YearHeatmap years={years} />
    </div>
  );
}
