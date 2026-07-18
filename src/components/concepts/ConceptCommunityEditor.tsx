"use client";

import { RichTextEditor } from "@/components/editor/RichTextEditor";

type ConceptCommunityEditorProps = {
  userId: string | null;
  onRequireLogin: () => void;
  onHtmlChange: (html: string, plain: string) => void;
  resetToken: number;
};

/** 모두의 개념 — 커뮤니티 글쓰기와 동일한 서식 도구 */
export function ConceptCommunityEditor({
  userId,
  onRequireLogin,
  onHtmlChange,
  resetToken,
}: ConceptCommunityEditorProps) {
  return (
    <RichTextEditor
      userId={userId}
      resetToken={resetToken}
      onRequireLogin={onRequireLogin}
      onHtmlChange={onHtmlChange}
      placeholder="개념 정리, 암기 팁, 헷갈렸던 포인트를 적어보세요"
      aria-label="글 남기기"
      minHeight="7.5rem"
    />
  );
}
