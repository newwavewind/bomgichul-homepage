"use client";

import { SITE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";

type KakaoShare = {
  sendCustom: (options: {
    templateId: number;
    templateArgs: Record<string, string>;
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

const SDK = "https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js";
const SDK_INTEGRITY =
  "sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy";
// Kakao app 1574876: the image, title, button, and source/footer all use
// https://www.bomgichul.com/${path}. sendDefault fixes the footer at the homepage.
const DAILY_SHARE_TEMPLATE_ID = 138107;

function loadKakao() {
  if (window.Kakao) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SDK}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("kakao")), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.src = SDK;
    script.async = true;
    script.integrity = SDK_INTEGRITY;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("kakao"));
    document.head.appendChild(script);
  });
}

function prepareImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    const finish = () => {
      window.clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
      resolve();
    };
    const timeout = window.setTimeout(finish, 12_000);
    image.onload = finish;
    image.onerror = finish;
    image.src = src;
  });
}

export function KakaoShareButton({
  title,
  description,
  path,
  imagePath,
  children,
}: {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
  children: string;
}) {
  const [hint, setHint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  const imageUrl = imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `${SITE_URL}${imagePath}`
    : `${SITE_URL}/brand/kakao-share-card.jpg`;

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setUseFallback(false);
    if (!key) {
      setUseFallback(true);
      setReady(true);
      return;
    }

    setHint("문제 카드와 공유 기능을 미리 준비하고 있어요.");
    void Promise.all([prepareImage(imageUrl), loadKakao()])
      .then(() => {
        if (cancelled) return;
        if (!window.Kakao) throw new Error("kakao");
        if (!window.Kakao.isInitialized()) window.Kakao.init(key);
        setReady(true);
        setHint(null);
      })
      .catch(() => {
        if (cancelled) return;
        setUseFallback(true);
        setReady(true);
        setHint(null);
      });

    return () => {
      cancelled = true;
    };
  }, [imageUrl, key]);

  async function fallbackShare(url: string) {
    if (navigator.share) {
      await navigator.share({ title, text: description, url });
      setHint(null);
      return;
    }
    await navigator.clipboard.writeText(`${title}\n${description}\n${url}`);
    setHint("공유 링크를 복사했습니다. 카카오톡 채팅방에 붙여넣어 주세요.");
  }

  function share() {
    if (busy || !ready) return;
    const url = `${SITE_URL}${path}`;
    if (!useFallback && window.Kakao) {
      try {
        // iOS에서 카카오 앱 실행이 막히지 않도록 클릭 이벤트 안에서 즉시 호출한다.
        // SDK와 이미지는 위 useEffect에서 미리 준비한다.
        window.Kakao.Share.sendCustom({
          templateId: DAILY_SHARE_TEMPLATE_ID,
          templateArgs: {
            title,
            description,
            imageUrl,
            // The template inserts the leading slash; preserve the subject,
            // invitation id, and tracking query parameters without re-encoding.
            path: path.replace(/^\/+/, ""),
          },
        });
        setHint(null);
        return;
      } catch {
        setUseFallback(true);
      }
    }

    setBusy(true);
    setHint("공유창을 여는 중이에요.");
    void fallbackShare(url)
      .catch(() => {
        setHint("공유가 취소되었거나 공유창을 열지 못했습니다.");
      })
      .finally(() => {
        setBusy(false);
      });
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={share}
        disabled={busy || !ready}
        aria-busy={busy || !ready}
        className={shareButtonClass}
      >
        {busy || !ready ? <LoadingIcon /> : <KakaoBubbleIcon />}
        <span>
          {!ready ? "공유 준비 중…" : busy ? "공유창 여는 중…" : children}
        </span>
      </button>
      {hint ? (
        <p
          aria-live="polite"
          className="px-1 text-center text-xs leading-5 text-[#5b4636]"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const shareButtonClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#FEE500] px-4 py-3 text-center text-sm font-bold text-[#191919] shadow-[0_3px_0_#e4cf00] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0";

function LoadingIcon() {
  return (
    <span
      aria-hidden="true"
      className="size-5 shrink-0 animate-spin rounded-full border-2 border-[#191919]/25 border-t-[#191919]"
    />
  );
}

function KakaoBubbleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 shrink-0 fill-current"
    >
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.82 1.82 5.3 4.57 6.72l-.94 3.46a.55.55 0 0 0 .82.61l4.12-2.73c.47.05.95.08 1.43.08 5.52 0 10-3.58 10-8.14S17.52 3 12 3Z" />
    </svg>
  );
}
