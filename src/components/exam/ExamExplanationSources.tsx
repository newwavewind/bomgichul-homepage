import { splitLawCites } from "@/lib/law-link";
import { plainStudyText } from "@/lib/study-text";

export type ExplanationSource = { label: string; url: string };

const CURRENT_NOTE = /\[(?:개정|판례변경)\]/;
const SEPARATORS = /^(?:[\s,，·]|및)*$/;
// 조문 링크가 호·목까지 잡지 못한 경우에는 괄호 안의 전체 인용을 표시한다.
const LOCATORS = /^(?:[\s,，·~]|및|같은\s*법|시행령|시행규칙|별[표지]\s*\d+(?:의\d+)?|제\d+(?:조|항|호)(?:의\d+)?|서식|[가-하]목|단서|본문|전단|후단)+$/;

export function prepareExplanationSources(
  explanation: string | undefined,
  sources: ExplanationSource[] = [],
  lawVersions?: Record<string, string>,
) {
  const text = plainStudyText(explanation ?? "");
  const mark = text.search(CURRENT_NOTE);
  const head = mark < 0 ? text : text.slice(0, mark);
  const tail = mark < 0 ? "" : text.slice(mark);
  const chips: ExplanationSource[] = [];
  let offset = 0;
  const cites = splitLawCites(head).flatMap((part) => {
    const start = offset;
    offset += part.text.length;
    if (!part.href) return [];
    const version = part.law && part.article ? lawVersions?.[`${part.law}|${part.article}`] : undefined;
    return [{ start, end: offset, label: part.text, url: version ?? part.href, law: part.law }];
  });

  // 출처만 든 괄호는 칩으로 옮기고, 설명과 섞인 인용은 본문에 둔다.
  const remaining = head.replace(/\(([^()]*)\)/g, (group, body: string, start: number) => {
    const end = start + group.length;
    const inGroup = cites.filter((cite) => cite.start > start && cite.end < end);
    if (!inGroup.length) return group;

    let remainder = body;
    for (const cite of inGroup) remainder = remainder.replace(cite.label, "");
    if (SEPARATORS.test(remainder)) {
      let lawName = "";
      for (const cite of inGroup) {
        const label = cite.label.trim();
        const explicitLaw = cite.law && !/^제\d/.test(label) && /^(.+?)\s+제\d/.exec(label)?.[1];
        if (explicitLaw) lawName = explicitLaw;
        chips.push({ label: lawName && /^제\d/.test(label) ? `${lawName} ${label}` : label, url: cite.url });
      }
      return "";
    }
    if (inGroup.length === 1 && LOCATORS.test(remainder)) {
      chips.push({ label: body.trim(), url: inGroup[0].url });
      return "";
    }
    return group;
  });

  const body = remaining === head
    ? text
    : [remaining.replace(/[ \t]+([.,;:)])/g, "$1").trimEnd(), tail].filter(Boolean).join(" ");
  const inlineUrls = new Set<string>();
  for (const [section, versions] of [[remaining, lawVersions], [tail, undefined]] as const) {
    for (const part of splitLawCites(section)) {
      if (!part.href) continue;
      const version = part.law && part.article ? versions?.[`${part.law}|${part.article}`] : undefined;
      inlineUrls.add(version ?? part.href);
    }
  }
  const links = new Map<string, ExplanationSource>();
  for (const source of [...chips, ...sources]) {
    if (source.label.trim() && source.url.startsWith("https://") && !inlineUrls.has(source.url)) {
      links.set(`${source.url}|${source.label}`, source);
    }
  }
  return { body, links: [...links.values()], hasEvidence: links.size > 0 || inlineUrls.size > 0 };
}

export function ExplanationSourceLinks({ sources }: { sources: ExplanationSource[] }) {
  return (
    <div className="exam-explanation-sources">
      <span className="exam-explanation-sources-title">근거</span>
      {sources.map(({ label, url }) => (
        <a key={`${url}|${label}`} href={url} target="_blank" rel="noopener noreferrer" className="exam-explanation-source-link">
          <span>{label}</span>
          <span className="exam-explanation-source-arrow" aria-hidden>↗</span>
          <span className="sr-only"> (새 창에서 열림)</span>
        </a>
      ))}
    </div>
  );
}
