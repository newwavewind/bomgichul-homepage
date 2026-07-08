import type { ExamSubject } from "@/lib/exam-questions";
import { ARCHIVE_SUBJECT_MAP } from "@/lib/constants";
import { getSubjectFreeEvent, isSubjectFreeEventActive } from "@/lib/promotions";

export function SubjectFreeEventBanner({ subject }: { subject: ExamSubject }) {
  if (!isSubjectFreeEventActive(subject)) return null;

  const event = getSubjectFreeEvent(subject);
  const label = ARCHIVE_SUBJECT_MAP[subject];
  if (!event) return null;

  return (
    <div
      className="relative overflow-hidden rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-gradient-to-br from-[#eef2ff] via-ice to-[#f0fdf4] px-5 py-4 shadow-[var(--shadow-card)]"
      role="status"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 text-5xl opacity-20" aria-hidden>
        🌸
      </div>
      <p className="font-display text-[11px] font-bold uppercase tracking-widest text-[#6366f1]">
        {event.badge}
      </p>
      <p className="mt-1 font-display text-body font-semibold text-ink">
        {label} 전 기능 한시 무료
      </p>
      <p className="mt-2 max-w-2xl font-display text-body-sm leading-relaxed text-smoke">
        {event.description}
      </p>
    </div>
  );
}
