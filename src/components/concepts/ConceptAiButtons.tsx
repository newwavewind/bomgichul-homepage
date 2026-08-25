"use client";

import { useEffect, useRef, useState } from "react";
import { AiProviderTag, AiProviderTriangleDots } from "@/components/exam/AiProviderTag";
import { PrimaryButton, OutlineButton } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";
import { AI_SERVICES, openAiService, type AiServiceId } from "@/lib/ai-links";

const USAGE_HINT =
  "GPT는 입력란에 바로 채워지고, Gemini · Claude는 복사되니 붙여넣기만 하면 됩니다.";

function LoginModal({
  open,
  loginHref,
  onClose,
}: {
  open: boolean;
  loginHref: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="hp-cx-login-modal" role="presentation">
      <button
        type="button"
        className="hp-cx-login-modal__backdrop"
        aria-label="닫기"
        onClick={onClose}
      />
      <div
        className="hp-cx-login-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hp-cx-concept-ai-login-title"
      >
        <p className="hp-cx-login-modal__badge">무료</p>
        <h3 id="hp-cx-concept-ai-login-title" className="hp-cx-login-modal__title">
          로그인이 필요해요
        </h3>
        <p className="hp-cx-login-modal__desc">
          AI 해설은 로그인만 하면 무료로 이용할 수 있어요.
          <br />
          구독·결제 없이 Google로 바로 시작하세요.
        </p>
        <div className="hp-cx-login-modal__actions">
          <OutlineButton onClick={onClose}>닫기</OutlineButton>
          <PrimaryButton href={loginHref}>무료로 로그인</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export function ConceptAiButtons({
  prompt,
  isLoggedIn,
  returnTo,
  subject,
}: {
  prompt: string;
  isLoggedIn: boolean;
  returnTo: string;
  subject: string;
}) {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const rootRef = useRef<HTMLSpanElement>(null);
  const loginHref = `/login?next=${encodeURIComponent(returnTo)}`;

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const handleTrigger = () => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      trackEvent("concept_ai_login_required", { subject });
      return;
    }
    setOpen((v) => !v);
  };

  const handleClick = async (serviceId: AiServiceId) => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }
    if (!prompt) return;
    const { copied } = await openAiService(serviceId, prompt);
    const label = AI_SERVICES.find((s) => s.id === serviceId)?.label ?? serviceId;
    trackEvent("concept_ai_ask", { service: serviceId, subject });
    setOpen(false);

    if (copied) {
      setToast(`${label}: 질문 복사됨 · 새 창에서 ⌘V`);
      window.setTimeout(() => setToast(null), 3200);
    } else if (serviceId === "chatgpt") {
      setToast(`${label}: 질문이 입력됐어요`);
      window.setTimeout(() => setToast(null), 2400);
    }
  };

  return (
    <>
      <span ref={rootRef} className="exam-ai hp-cx-concept-ai inline-flex max-w-full flex-col items-start gap-1.5">
        <span className="exam-ai__row inline-flex max-w-full flex-wrap items-start gap-x-2.5 gap-y-1.5">
          <span className="inline-flex w-fit max-w-full shrink-0 flex-col items-stretch">
            <button
              type="button"
              onClick={handleTrigger}
              aria-expanded={open}
              aria-haspopup="menu"
              className="exam-ai__trigger inline-flex items-center gap-1.5 rounded-[0.55rem] border border-burnt/30 bg-transparent px-2.5 py-1 font-display text-[11px] font-semibold tracking-tight text-burnt transition-colors hover:bg-snow/60"
            >
              <AiProviderTriangleDots />
              AI 해설
              <span className="text-ash" aria-hidden>
                {open ? "▴" : "▾"}
              </span>
            </button>

            {open ? (
              <div
                role="menu"
                className="exam-ai__menu mt-1 w-full overflow-hidden rounded-xl border border-mist bg-paper py-1 shadow-[var(--shadow-card)]"
              >
                {AI_SERVICES.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    role="menuitem"
                    onClick={() => handleClick(service.id)}
                    aria-label={`${service.label}로 질문하기`}
                    title={
                      service.mode === "clipboard"
                        ? `${service.label} 열기 + 질문 복사 (붙여넣기)`
                        : `${service.label}에서 질문 자동 입력`
                    }
                    className="flex w-full items-center gap-1 px-2 py-2 text-left font-display text-[11px] text-ink transition-colors hover:bg-snow"
                  >
                    <AiProviderTag provider={service.id} />
                  </button>
                ))}
              </div>
            ) : null}
          </span>

          {open ? (
            <div
              className="exam-ai__hint relative min-w-[11rem] max-w-[18rem] flex-1 rounded-[0.65rem] border border-burnt/20 bg-paper px-2.5 py-2 shadow-[var(--shadow-button)]"
              role="note"
            >
              <p className="font-display text-[11px] leading-snug text-smoke">{USAGE_HINT}</p>
            </div>
          ) : null}
        </span>

        {toast ? (
          <span className="font-display text-[10px] text-fog" role="status">
            {toast}
          </span>
        ) : null}
      </span>

      <LoginModal open={loginOpen} loginHref={loginHref} onClose={() => setLoginOpen(false)} />
    </>
  );
}
