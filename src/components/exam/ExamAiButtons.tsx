"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui/Button";
import { StorePurchaseLinks } from "@/components/exam/StorePurchaseLinks";
import { trackEvent } from "@/lib/analytics";
import { AI_SERVICES, openAiService, type AiServiceId } from "@/lib/ai-links";

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
  const [toast, setToast] = useState<string | null>(null);
  const [showNotice, setShowNotice] = useState(false);

  const handleLockedClick = () => {
    setShowNotice(true);
    trackEvent("exam_ai_upsell_click", { subject });
  };

  const handleClick = async (serviceId: AiServiceId) => {
    if (!unlocked) {
      handleLockedClick();
      return;
    }
    if (!prompt) return;
    const { copied } = await openAiService(serviceId, prompt);
    const label = AI_SERVICES.find((s) => s.id === serviceId)?.label ?? serviceId;
    trackEvent("exam_ai_ask", { service: serviceId });

    if (copied) {
      setToast(`${label}: 질문 복사됨 · 새 창에서 ⌘V`);
      window.setTimeout(() => setToast(null), 3200);
    } else if (serviceId === "chatgpt") {
      setToast(`${label}: 질문이 입력됐어요`);
      window.setTimeout(() => setToast(null), 2400);
    }
  };

  return (
    <span className="inline-flex flex-col items-start gap-1.5">
      <span className="inline-flex flex-wrap items-center gap-1.5">
        {AI_SERVICES.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => handleClick(service.id)}
            title={
              unlocked
                ? service.mode === "clipboard"
                  ? `${service.label} 열기 + 질문 복사 (붙여넣기)`
                  : `${service.label}에서 질문 자동 입력`
                : `${service.label} — 프리미엄 전용`
            }
            className={`rounded-full border px-2 py-0.5 font-display text-[11px] font-semibold transition-colors ${
              unlocked
                ? "border-mist bg-paper text-smoke hover:border-carbon hover:bg-snow hover:text-ink"
                : "border-mist bg-surface text-fog hover:border-carbon hover:text-smoke"
            }`}
          >
            {!unlocked && <span aria-hidden>🔒 </span>}
            {service.label}
          </button>
        ))}
      </span>

      {showNotice && !unlocked && (
        <div className="max-w-sm rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-ice px-3 py-2.5 shadow-[var(--shadow-button)]">
          <p className="font-display text-body-sm font-semibold text-ink">
            AI 해설 질문은 {subjectLabel} 프리미엄 전용이에요
          </p>
          <p className="mt-1 font-display text-[12px] leading-relaxed text-smoke">
            GPT·Gemini·Claude로 지문·보기·해설을 바탕으로 추가 설명을 받을 수 있어요. 모바일 앱에서
            과목을 구매한 뒤, 이 홈페이지에서 PC 학습 코드를 등록하면 이용할 수 있습니다.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PrimaryButton href={`/exam/${subject}#unlock`} size="sm">
              코드 등록
            </PrimaryButton>
            <StorePurchaseLinks size="sm" />
            <button
              type="button"
              onClick={() => setShowNotice(false)}
              className="font-display text-[12px] text-fog hover:text-ink"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {toast && (
        <span className="font-display text-[10px] text-fog" role="status">
          {toast}
        </span>
      )}
    </span>
  );
}
