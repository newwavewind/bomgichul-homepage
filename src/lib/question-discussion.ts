/** Human-readable prefixes keep existing public memos and apps backward compatible. */
export function parseDiscussion(content: string) {
  const match = content.match(
    /^\[(질문|해결된 질문)(?: · 채택:([a-zA-Z0-9-]+))?\]\n/,
  );
  return {
    question: Boolean(match),
    resolved: match?.[1] === "해결된 질문",
    acceptedId: match?.[2] || null,
    text: match ? content.slice(match[0].length) : content,
  };
}
export function formatDiscussion(
  text: string,
  resolved = false,
  acceptedId?: string,
) {
  return `[${resolved ? "해결된 질문" : "질문"}${acceptedId ? ` · 채택:${acceptedId}` : ""}]\n${text}`;
}
