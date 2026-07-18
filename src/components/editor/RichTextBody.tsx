import { sanitizeConceptCommunityHtml } from "@/lib/concept-community-html";
import "./rich-text-editor.css";

function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

/** 게시글·자료실 본문 — HTML이면 살균 후 렌더, 아니면 기존 평문 유지 */
export function RichTextBody({ content }: { content: string }) {
  if (!looksLikeHtml(content)) {
    return (
      <div className="whitespace-pre-wrap font-display text-body leading-relaxed text-ink">
        {content}
      </div>
    );
  }

  const html = sanitizeConceptCommunityHtml(content);
  return (
    <div
      className="rte-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
