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
