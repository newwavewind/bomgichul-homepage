"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AiProviderTag } from "@/components/exam/AiProviderTag";
import { copyText, openAiService, QUESTION_AI_SERVICES, type AiServiceId } from "@/lib/ai-links";

export function ExamExplanationAiMenu({
  prompt,
  openInApp,
}: {
  prompt: string;
  openInApp?: (trigger: HTMLButtonElement) => void;
}) {
  const [open, setOpen] = useState(false);
  const [upward, setUpward] = useState(false);
  const [message, setMessage] = useState("");
  const [copyFallback, setCopyFallback] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  function onMenuKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus();
      return;
    }
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const items = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
    if (!items.length) return;
    event.preventDefault();
    const current = items.findIndex((item) => item === document.activeElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1
      : (current + (event.key === "ArrowUp" ? -1 : 1) + items.length) % items.length;
    items[next].focus();
  }

  async function ask(service: AiServiceId) {
    setOpen(false);
    setCopyFallback(false);
    const { copied, prefilled } = await openAiService(service, prompt);
    if (prefilled) {
      setMessage("새 탭에서 질문을 확인하세요.");
    } else if (copied) {
      setMessage("질문을 복사했어요. 새 탭의 입력란에 붙여넣으세요.");
    } else {
      setMessage("질문을 자동으로 복사하지 못했어요.");
      setCopyFallback(true);
    }
  }

  return (
    <div ref={root} className="relative w-fit max-w-full">
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? id : undefined}
        className="exam-explanation-ai"
        onClick={() => {
          const rect = trigger.current?.getBoundingClientRect();
          setUpward(Boolean(rect && window.innerHeight - rect.bottom < 250 && rect.top > 250));
          setOpen(!open);
        }}
      >
        AI로 더 깊게 <span aria-hidden>→</span>
      </button>
      {open ? (
        <div
          ref={menu}
          id={id}
          role="menu"
          aria-label="AI로 더 깊게"
          onKeyDown={onMenuKey}
          onBlur={(event) => {
            if (event.relatedTarget && !root.current?.contains(event.relatedTarget)) setOpen(false);
          }}
          className={`absolute left-0 z-30 w-max max-w-[min(17rem,calc(100vw-3.5rem))] rounded-xl border border-mist bg-paper py-1 shadow-lg ${upward ? "bottom-full mb-1" : "top-full mt-1"}`}
        >
          {openInApp ? (
            <button type="button" role="menuitem"
              className="flex min-h-[38px] w-full items-center gap-2 px-3 py-1.5 text-left font-display text-[length:var(--text-reading-note)] font-bold text-[color:light-dark(#4f46e5,#b6b3ff)] hover:bg-snow"
              onClick={() => {
                if (trigger.current) openInApp(trigger.current);
                setOpen(false);
              }}
            >
              <span aria-hidden className="w-3.5 shrink-0 font-normal text-fog">1</span>
              <span>✨ 바로바로 AI 해설</span>
              <span className="rounded-md bg-snow px-1.5 py-0.5 text-[.68rem] font-medium">앱에서 바로</span>
            </button>
          ) : null}
          {QUESTION_AI_SERVICES.map((service, index) => (
            <button
              key={service.id}
              type="button"
              role="menuitem"
              aria-label={`${service.label}로 질문하기`}
              onClick={() => void ask(service.id)}
              className="flex min-h-[38px] w-full items-center gap-2 px-3 py-1.5 text-left font-display text-[length:var(--text-reading-note)] text-ink hover:bg-snow"
            >
              <span aria-hidden className="w-3.5 shrink-0 font-normal text-fog">{index + (openInApp ? 2 : 1)}</span>
              <AiProviderTag provider={service.id} />
            </button>
          ))}
          <p className="border-t border-mist px-3 py-1.5 font-display text-[length:var(--text-reading-note)] text-smoke">
            질문을 담아 새 탭을 열어요.
          </p>
        </div>
      ) : null}
      {message ? <p className="mt-2 text-[length:var(--text-reading-note)] text-smoke" role="status">{message}</p> : null}
      {copyFallback ? (
        <button type="button" className="mt-1 text-[length:var(--text-reading-note)] text-ink underline"
          onClick={async () => {
            if (await copyText(prompt)) {
              setCopyFallback(false);
              setMessage("질문을 복사했어요.");
            }
          }}
        >
          질문 복사
        </button>
      ) : null}
    </div>
  );
}
