import {
  getExamCountdownForScope,
  getDaysUntilExam,
  bumpExamDateToUpcoming,
  formatKoreanDate,
} from "@/lib/exam";
import { TintedAccentCard } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import type { CommunityScope } from "@/types/database";

export function DDayPanel({ scope = "real_estate" }: { scope?: CommunityScope }) {
  const { exam, days, label, formattedDate, examName } =
    getExamCountdownForScope(scope);
  const registrationStart = bumpExamDateToUpcoming(exam.registrationStart);
  const registrationEnd = bumpExamDateToUpcoming(exam.registrationEnd);
  const regDays = Math.max(0, getDaysUntilExam(registrationStart));
  const showScheduleMeta = scope === "real_estate";

  return (
    <TintedAccentCard className="relative overflow-hidden">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Tag className="mb-3 !bg-midnight !text-paper">{exam.label}</Tag>
          <p className="font-display text-body-sm text-smoke">{examName}</p>
          <p className="mt-1 font-display text-body-lg font-medium text-ink">
            {formattedDate}
          </p>
          <p className="mt-2 font-display text-body-sm text-fog">{exam.note}</p>
        </div>
        <div className="text-center md:text-right">
          <p
            className={`font-display text-[56px] font-bold leading-none tracking-tight md:text-[72px] ${
              days <= 30 ? "text-amber" : "text-ink"
            }`}
          >
            {label}
          </p>
          {days > 0 ? (
            <p className="mt-2 font-display text-body-sm text-smoke">
              시험까지 {days}일 남았어요
            </p>
          ) : (
            <p className="mt-2 font-display text-body-sm font-medium text-amber">
              오늘이 시험 day! 화이팅!
            </p>
          )}
        </div>
      </div>

      {showScheduleMeta && (
        <div className="mt-6 flex flex-wrap gap-3 border-t border-mist/40 pt-5">
          <div className="rounded-[var(--radius-tags)] bg-paper/80 px-3 py-1.5">
            <span className="font-display text-[12px] text-fog">원서접수 </span>
            <span className="font-display text-body-sm font-medium text-ink">
              {formatKoreanDate(registrationStart).replace(/^\d+년 /, "")} ~{" "}
              {registrationEnd.slice(5).replace("-", ".")}
            </span>
            {regDays > 0 && (
              <span className="ml-2 font-display text-[12px] text-electric-blue">
                D-{regDays}
              </span>
            )}
          </div>
          <div className="rounded-[var(--radius-tags)] bg-paper/80 px-3 py-1.5">
            <span className="font-display text-[12px] text-fog">합격발표 </span>
            <span className="font-display text-body-sm font-medium text-ink">
              {formatKoreanDate(bumpExamDateToUpcoming(exam.resultDate)).replace(
                /^\d+년 /,
                "",
              )}
            </span>
          </div>
        </div>
      )}
    </TintedAccentCard>
  );
}
