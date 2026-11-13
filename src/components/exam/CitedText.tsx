import { splitLawCites, type LawCitePart } from "@/lib/law-link";
import { plainStudyText } from "@/lib/study-text";

/** [개정]·[판례변경] 뒤는 현행 이야기다 — 그 뒤 근거는 시험일 판이 아니라 현행 조문을 연다(앱과 같다) */
const CURRENT_NOTE = /\[(?:개정|판례변경)\]/;

function toExamDay(parts: LawCitePart[], lawVersions?: Record<string, string>): (LawCitePart & { examDay?: boolean })[] {
  if (!lawVersions) return parts;
  return parts.map((part) => {
    const url = part.law && part.article ? lawVersions[`${part.law}|${part.article}`] : undefined;
    return url ? { ...part, href: url, examDay: true } : part;
  });
}

/**
 * 해설 본문. 법령·판례 인용은 국가법령정보센터로 링크한다(앱 CitedText 와 동일).
 *
 * 문항에 시험일 판 주소(lawVersions, 열쇠 「법|조」)가 실려 있으면 그 조문은 **시험 당시 판**으로 연다.
 * 기출 해설은 시험일에 시행 중이던 법으로 썼다 — 지금 조문으로 열면 번호·내용이 달라진 자리가 있다.
 */
export function CitedText({
  text,
  className,
  examDate,
  lawVersions,
}: {
  text: string;
  className?: string;
  examDate?: string;
  lawVersions?: Record<string, string>;
}) {
  const plain = plainStudyText(text);
  const mark = plain.search(CURRENT_NOTE);
  const head = mark < 0 ? plain : plain.slice(0, mark);
  const tail = mark < 0 ? "" : plain.slice(mark);
  const headParts = splitLawCites(head);
  const tailParts = tail ? splitLawCites(tail) : [];
  // [개정]·[판례변경]이 있으면 앞(출제 당시)은 줄을 긋고, 뒤(현행)는 따로 또렷하게 보인다(앱과 같다)
  if (mark > 0) {
    const label = tail.startsWith("[판례변경]") ? "판례 변경" : "개정 · 현행";
    const now = tail.replace(/^\[(?:개정|판례변경)\]\s*/, "");
    const nowParts = splitLawCites(now);
    const render = (list: (LawCitePart & { examDay?: boolean })[]) =>
      list.map((part, i) =>
        part.href ? (
          <a key={i} href={part.href} target="_blank" rel="noopener noreferrer" className="law-cite"
            title={part.examDay && examDate ? `${examDate} 시험 당시 판으로 열립니다` : undefined}>
            {part.text}
          </a>
        ) : (
          <span key={i}>{part.text}</span>
        )
      );
    return (
      <span className={className}>
        <span className="text-slate-400 dark:text-slate-500">
          <span className="mr-1.5 inline-block rounded-full bg-slate-100 px-1.5 text-[11px] font-bold leading-[1.7] text-slate-500 no-underline dark:bg-slate-800 dark:text-slate-400">출제 당시</span>
          <span className="line-through decoration-slate-400/70">
            {render(headParts.length ? toExamDay(headParts, lawVersions) : [{ text: head }])}
          </span>
        </span>
        <span className="mt-1.5 block">
          <span className="mr-1.5 inline-block rounded-full bg-amber-50 px-1.5 text-[11px] font-bold leading-[1.7] text-amber-700 dark:bg-amber-950 dark:text-amber-300">{label}</span>
          {render(nowParts.length ? nowParts : [{ text: now }])}
        </span>
      </span>
    );
  }
  if (!headParts.length && !tailParts.length) {
    return className ? <span className={className}>{plain}</span> : <>{plain}</>;
  }
  const parts: (LawCitePart & { examDay?: boolean })[] = [
    ...(headParts.length ? toExamDay(headParts, lawVersions) : [{ text: head }]),
    ...(tail ? (tailParts.length ? tailParts : [{ text: tail }]) : []),
  ];
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.href ? (
          <a
            key={i}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className="law-cite"
            title={part.examDay && examDate ? `${examDate} 시험 당시 판으로 열립니다` : undefined}
          >
            {part.text}
          </a>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </span>
  );
}
