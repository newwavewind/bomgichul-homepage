"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiProviderTag, AiProviderTriangleDots } from "@/components/exam/AiProviderTag";
import { trackEvent } from "@/lib/analytics";
import { AI_SERVICES, openAiService, type AiServiceId } from "@/lib/ai-links";

const USAGE_HINT =
  "GPT는 입력란에 바로 채워지고, Gemini · Claude는 복사되니 붙여넣기만 하면 됩니다.";

export function ExamAiButtons({
  prompt,
  unlocked,
  subject,
  subjectLabel,
}: {
  prompt: string;
  unlocked: boolean;
  subject: string;
  subjectLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
      setShowUpsell(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const handleTrigger = () => {
    const next = !open;
    setOpen(next);
    if (!next) setShowUpsell(false);
  };

  const handleClick = async (serviceId: AiServiceId) => {
    if (!unlocked) {
      setShowUpsell(true);
      trackEvent("exam_ai_upsell_click", { subject });
      return;
    }
    if (!prompt) return;
    const { copied } = await openAiService(serviceId, prompt);
    const label = AI_SERVICES.find((s) => s.id === serviceId)?.label ?? serviceId;
    trackEvent("exam_ai_ask", { service: serviceId });
    setOpen(false);
    setShowUpsell(false);

    if (copied) {
      setToast(`${label}: 질문 복사됨 · 새 창에서 ⌘V`);
      window.setTimeout(() => setToast(null), 3200);
    } else if (serviceId === "chatgpt") {
      setToast(`${label}: 질문이 입력됐어요`);
      window.setTimeout(() => setToast(null), 2400);
    }
  };

  return (
    <span ref={rootRef} className="exam-ai inline-flex max-w-full flex-col items-start gap-1.5">
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
                    unlocked
                      ? service.mode === "clipboard"
                        ? `${service.label} 열기 + 질문 복사 (붙여넣기)`
                        : `${service.label}에서 질문 자동 입력`
                      : `${service.label} — 프리미엄 전용`
                  }
                  className="flex w-full items-center gap-1 px-2 py-2 text-left font-display text-[11px] text-ink transition-colors hover:bg-snow"
                >
                  {!unlocked && <span aria-hidden>🔒</span>}
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
            {showUpsell && !unlocked ? (
              <div className="space-y-1.5">
                <p className="font-display text-[12px] font-semibold text-ink">
                  AI 해설 질문은 {subjectLabel} 프리미엄 전용이에요
                </p>
                <p className="font-display text-[11px] leading-snug text-smoke">
                  모바일 앱에서 과목을 구매한 뒤, 이 홈페이지에서 PC 학습 코드를 등록하면 이용할 수
                  있습니다.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <Link
                    href={`/exam/${subject}#unlock`}
                    className="font-display text-[11px] font-semibold text-burnt underline-offset-2 hover:underline"
                  >
                    코드 등록
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowUpsell(false)}
                    className="font-display text-[11px] text-fog hover:text-ink"
                  >
                    닫기
                  </button>
                </div>
              </div>
            ) : (
              <p className="font-display text-[11px] leading-snug text-smoke">{USAGE_HINT}</p>
            )}
          </div>
        ) : null}
      </span>

      {toast && (
        <span className="font-display text-[10px] text-fog" role="status">
          {toast}
        </span>
      )}
    </span>
  );
}
