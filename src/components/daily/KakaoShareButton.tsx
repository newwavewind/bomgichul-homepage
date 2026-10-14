"use client";

import { SITE_URL } from "@/lib/constants";
import { useState } from "react";

type KakaoShare = {
  sendDefault: (options: {
    objectType: "feed";
    content: {
      title: string;
      description: string;
      imageUrl: string;
      link: { mobileWebUrl: string; webUrl: string };
    };
    buttons: { title: string; link: { mobileWebUrl: string; webUrl: string } }[];
  }) => void;
};

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: KakaoShare;
    };
  }
}

const SDK = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";

function loadKakao() {
  if (window.Kakao) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("kakao")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = SDK;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("kakao"));
    document.head.appendChild(script);
  });
}

export function KakaoShareButton({
  title,
  description,
  path,
  children,
}: {
  title: string;
  description: string;
  path: string;
  children: string;
}) {
  const [hint, setHint] = useState<string | null>(null);

  async function share() {
    const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
    const url = `${window.location.origin}${path}`;
    if (!key) {
      setHint("카카오 JavaScript 키가 홈페이지 환경에 없습니다. NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY를 넣어야 피드 공유가 열립니다.");
      return;
    }
    try {
      await loadKakao();
      if (!window.Kakao) throw new Error("kakao");
      if (!window.Kakao.isInitialized()) window.Kakao.init(key);
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title,
          description,
          imageUrl: `${SITE_URL}/opengraph-image`,
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [{ title: "결과 보기", link: { mobileWebUrl: url, webUrl: url } }],
      });
      setHint(null);
    } catch {
      setHint("카카오톡 공유를 열지 못했습니다. 키와 도메인 등록을 확인해 주세요.");
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button type="button" onClick={share} className={shareButtonClass}>
        {children}
      </button>
      {hint ? <p className="text-center text-xs text-[#475569]">{hint}</p> : null}
    </div>
  );
}

export const shareButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#007AFF] px-4 py-2 text-center text-sm font-semibold text-white";
