import { lawUrl, precedentUrl, splitLawCites } from "@/lib/law-link";
import { plainStudyText } from "@/lib/study-text";

export type ExplanationSource = { label: string; url: string };

/** 데이터에 실리는 출처 — 링크형({label,url}) 또는 법령·판례 검증 메타 */
export type AttachedExplanationSource =
  | ExplanationSource
  | {
      type?: string;
      name?: string;
      article?: string;
      number?: string;
      label?: string;
      url?: string;
      verifiedAt?: string;
      via?: string;
    };

const CURRENT_NOTE = /\[(?:개정|판례변경)\]/;
const SEPARATORS = /^(?:[\s,，·]|및)*$/;
// 조문 링크가 호·목까지 잡지 못한 경우에는 괄호 안의 전체 인용을 표시한다.
const LOCATORS = /^(?:[\s,，·~]|및|같은\s*법|시행령|시행규칙|별[표지]\s*\d+(?:의\d+)?|제\d+(?:조|항|호)(?:의\d+)?|서식|[가-하]목|단서|본문|전단|후단)+$/;
const ARTICLE_META = /제\s*(\d+)\s*조(?:\s*의\s*(\d+))?/;

/** 공무원 등 재집필 출처(법·판례 메타)를 근거 칩용 {label,url}로 만든다. */
export function normalizeAttachedSource(
  raw: AttachedExplanationSource | null | undefined,
  lawVersions?: Record<string, string>,
): ExplanationSource | null {
  if (!raw || typeof raw !== "object") return null;
  const source = raw as Record<string, unknown>;
  if (typeof source.label === "string" && typeof source.url === "string") {
    const label = source.label.trim();
    const url = source.url.trim();
    if (!label || !url.startsWith("https://")) return null;
    return { label, url };
  }

  if (source.type === "law" && typeof source.name === "string" && source.name.trim()) {
    const name = source.name.trim();
    const articleRaw = typeof source.article === "string" ? source.article.trim() : "";
    const match = ARTICLE_META.exec(articleRaw);
    const articleNum = match?.[1];
    const articleOf = match?.[2];
    const articleKey = articleNum ? (articleOf ? `${articleNum}의${articleOf}` : articleNum) : undefined;
    const label = articleRaw ? `${name} ${articleRaw.replace(/\s+/g, "")}` : name;
    const version = articleKey ? lawVersions?.[`${name}|${articleKey}`] : undefined;
    const url = version ?? (articleNum ? lawUrl(name, articleNum, articleOf) : lawUrl(name));
    return { label, url };
  }

  if ((source.type === "case" || source.type === "precedent") && typeof source.number === "string") {
    const number = source.number.trim();
    if (!number) return null;
    return { label: number, url: precedentUrl(number) };
  }

  return null;
}

export function prepareExplanationSources(
  explanation: string | undefined,
  sources: AttachedExplanationSource[] = [],
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
  const attached = sources
    .map((source) => normalizeAttachedSource(source, lawVersions))
    .filter((source): source is ExplanationSource => source != null);
  const links = new Map<string, ExplanationSource>();
  for (const source of [...chips, ...attached]) {
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
