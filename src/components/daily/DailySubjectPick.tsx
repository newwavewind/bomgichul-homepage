import Link from "next/link";

export function DailySubjectPick({
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
  return (
    <div className="bg-[linear-gradient(180deg,#f3f8ff_0%,#ffffff_40%)] px-4 py-8">
      <div className="mx-auto max-w-xl rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-7">
        <p className="text-xs font-semibold text-[#64748b]">
          <Link href={home} className="hover:text-[#0066D6]">{label}</Link>
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">매일 10문제</h1>
        <p className="mt-2 text-sm leading-6 text-[#475569]">
          오늘 풀 과목을 고르세요. 고른 과목의 기출 10문제만 나오고, 순위도 그 과목에서 매깁니다.
        </p>
        <ul className="mt-5 grid gap-2">
          {subjects.map((subject) => (
            <li key={subject.id}>
              <Link
                href={`/${exam}/daily?subject=${encodeURIComponent(subject.id)}`}
                className="flex items-center justify-between rounded-2xl border border-[#d7e3f4] bg-white/85 px-4 py-3 text-sm font-semibold text-ink hover:border-[#007AFF]"
              >
                <span>{subject.label}</span>
                <span className="text-[#0066D6]">10문제</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
