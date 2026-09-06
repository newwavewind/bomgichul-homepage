"use client";

import { useEffect } from "react";

/**
 * 게시글 본문 글꼴을 그림이 뜬 뒤에 싣는다.
 *
 * 예전에는 rich-text-editor.css 맨 위의 @import 두 줄이 이 글꼴들을 실었는데,
 * @import 는 렌더를 막는다 — 개념 카드 수천 쪽의 LCP 가 8.8초까지 밀렸다
 * (Lighthouse 실측, 렌더 차단 절감 추정 3,480ms). 여기서는 첫 그림이 난 다음
 * <link> 를 붙이므로 글꼴이 늦게 갈아입혀질 뿐(FOUT) 렌더는 안 막는다.
 * 글꼴 목록은 에디터의 COMMUNITY_FONTS 와 짝이다 — 하나를 고치면 함께 고칠 것.
 */
const FONT_SHEETS = [
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css",
  "https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Do+Hyeon&family=Gowun+Dodum&family=IBM+Plex+Sans+KR:wght@400;600;700&family=Jua&family=Noto+Sans+KR:wght@400;600;700&family=Noto+Serif+KR:wght@400;600;700&display=swap",
];

let injected = false;

export function RichTextFonts() {
  useEffect(() => {
    if (injected) return;
    injected = true;
    for (const href of FONT_SHEETS) {
      if (document.querySelector(`link[href="${href}"]`)) continue;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);
  return null;
}
