"use client";

import { useEffect, useRef, useState } from "react";
import {
  COMMUNITY_FONT_SIZES,
  communityHtmlToPlainText,
  sanitizeConceptCommunityHtml,
} from "@/lib/concept-community-html";
import { uploadConceptCommunityImage } from "@/lib/concept-community-upload";

type ConceptCommunityEditorProps = {
  userId: string | null;
  onRequireLogin: () => void;
  onHtmlChange: (html: string, plain: string) => void;
  resetToken: number;
};

export function ConceptCommunityEditor({
  userId,
  onRequireLogin,
  onHtmlChange,
  resetToken,
}: ConceptCommunityEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeColor, setActiveColor] = useState("#111827");

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    el.innerHTML = "";
    onHtmlChange("", "");
    // resetToken만으로 초기화. onHtmlChange 참조 변경으로 재실행하지 않음.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetToken]);

  const emitChange = () => {
    const el = editorRef.current;
    if (!el) return;
    const html = sanitizeConceptCommunityHtml(el.innerHTML);
    onHtmlChange(html, communityHtmlToPlainText(html));
  };

  const runCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    emitChange();
  };

  const wrapSelection = (style: Partial<CSSStyleDeclaration>) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      editorRef.current?.focus();
      const span = document.createElement("span");
      Object.assign(span.style, style);
      span.appendChild(document.createTextNode("\u200b"));
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      if (range) {
        range.insertNode(span);
        range.setStart(span, 1);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      } else {
        editorRef.current?.appendChild(span);
      }
      emitChange();
      return;
    }

    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    Object.assign(span.style, style);
    span.appendChild(range.extractContents());
    range.insertNode(span);
    selection.removeAllRanges();
    const next = document.createRange();
    next.selectNodeContents(span);
    selection.addRange(next);
    emitChange();
  };

  const applyBold = () => runCommand("bold");

  const applySize = (size: string) => {
    editorRef.current?.focus();
    wrapSelection({ fontSize: size });
  };

  const applyColor = (color: string) => {
    setActiveColor(color);
    editorRef.current?.focus();
    wrapSelection({ color });
  };

  const insertImage = async (file: File) => {
    if (!userId) {
      onRequireLogin();
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const url = await uploadConceptCommunityImage(userId, file);
      editorRef.current?.focus();
      document.execCommand(
        "insertHTML",
        false,
        `<img src="${url}" alt="첨부 이미지" />`
      );
      emitChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "이미지 업로드에 실패했어요.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="hp-cx-community-editor">
      <div className="hp-cx-community-shell">
        <div className="hp-cx-community-toolbar" role="toolbar" aria-label="글 서식">
          <button
            type="button"
            className="hp-cx-community-tool"
            title="굵게"
            aria-label="굵게"
            onClick={applyBold}
          >
            <span className="hp-cx-community-tool__b" aria-hidden>
              B
            </span>
          </button>

          <label className="hp-cx-community-tool-select" title="글자 크기">
            <span className="sr-only">글자 크기</span>
            <span className="hp-cx-community-tool-select__mark" aria-hidden>
              Aa
            </span>
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) applySize(e.target.value);
                e.target.value = "";
              }}
            >
              <option value="" disabled>
                크기
              </option>
              {COMMUNITY_FONT_SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </label>

          <label
            className="hp-cx-community-color"
            title="글자 색"
            aria-label="글자 색"
          >
            <span className="hp-cx-community-color__mark" aria-hidden>
              A
              <i style={{ background: activeColor }} />
            </span>
            <input
              type="color"
              value={activeColor}
              onChange={(e) => applyColor(e.target.value)}
            />
          </label>

          <span className="hp-cx-community-toolbar__spacer" aria-hidden />

          <button
            type="button"
            className="hp-cx-community-tool hp-cx-community-tool--photo"
            disabled={uploading}
            title="사진 올리기"
            aria-label="사진 올리기"
            onClick={() => {
              if (!userId) {
                onRequireLogin();
                return;
              }
              fileRef.current?.click();
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <circle cx="8.5" cy="10" r="1.6" fill="currentColor" />
              <path
                d="M7 16.5 11.2 12l3.1 3.1L17.3 12 21 16.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{uploading ? "올리는 중…" : "사진"}</span>
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void insertImage(file);
            }}
          />
        </div>

        <div
          ref={editorRef}
          className="hp-cx-community-editor__area"
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-label="글 남기기"
          data-placeholder="개념 정리, 암기 팁, 헷갈렸던 포인트를 적어보세요"
          onInput={emitChange}
          onBlur={emitChange}
          suppressContentEditableWarning
        />
      </div>

      {error ? <p className="hp-cx-community-editor__error">{error}</p> : null}
    </div>
  );
}
