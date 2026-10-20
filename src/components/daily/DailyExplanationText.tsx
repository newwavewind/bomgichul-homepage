import { CitedText } from "@/components/exam/CitedText";

/**
 * 매일 10문제 공통 해설 글 — 보기형 문제의 「ㄱ. (옳음) …」 줄을 표식으로 그린다(2026-10-21).
 *
 * 해설은 pool.ts explainExam 이 문단으로 이어 붙인 글이다. 보기 줄은 「보기 표식 + (옳음|틀림) + 해설」
 * 꼴이라 그 줄만 골라 보기 표식·참거짓 칩·해설로 나누고, 나머지 문단은 글 그대로 둔다.
 */
const STATEMENT = /^([ㄱ-ㅎ가-힣A-Za-z]{1,2}\.?)\s*\((옳음|틀림)\)\s+([\s\S]+)$/;

export function DailyExplanationText({
  text,
  examDate,
  lawVersions,
  className = "text-base leading-7 text-[#334155]",
}: {
  text: string;
  examDate?: string;
  lawVersions?: Record<string, string>;
  className?: string;
}) {
  const paragraphs = text
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const statements = paragraphs.map((paragraph) => STATEMENT.exec(paragraph));
  if (!statements.some(Boolean)) {
    return (
      <p className={`whitespace-pre-wrap ${className}`}>
        <CitedText text={text} examDate={examDate} lawVersions={lawVersions} />
      </p>
    );
  }
  return (
    <div className="space-y-2">
      {paragraphs.map((paragraph, index) => {
        const match = statements[index];
        if (!match) {
          return (
            <p key={index} className={`whitespace-pre-wrap ${className}`}>
              <CitedText text={paragraph} examDate={examDate} lawVersions={lawVersions} />
            </p>
          );
        }
        const [, label, verdict, body] = match;
        const right = verdict === "옳음";
        return (
          <div key={index} className="flex items-start gap-2.5 rounded-xl bg-[#F8FAFC] px-3 py-2.5">
            <span className="mt-0.5 w-5 shrink-0 text-sm font-semibold text-ink">{label.replace(/\.$/, "")}</span>
            <span
              className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold leading-5 ${right ? "bg-[#DCEEFF] text-[#0066D6]" : "bg-[#FFE1E8] text-[#C70036]"}`}
            >
              {verdict}
            </span>
            <p className="min-w-0 flex-1 text-sm leading-6 text-[#475569]">
              <CitedText text={body} examDate={examDate} lawVersions={lawVersions} />
            </p>
          </div>
        );
      })}
    </div>
  );
}
