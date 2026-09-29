"use client";

import { writeChatShareDraft } from "@/components/chat/ShareToChatButton";

type WrongItem = {
  examId: string;
  subject: string;
  year: number;
  questionNo: number;
  stem: string;
  href: string;
};

export function ShareWrongsToChatButton({
  subject,
  subjectLabel,
  items,
}: {
  subject: string;
  subjectLabel: string;
  items: WrongItem[];
}) {
  if (!items.length) return null;

  return (
    <button
      type="button"
      onClick={() => {
        writeChatShareDraft({
          mode: "wrong",
          examId: `${subject}-wrongs`,
          subject,
          stem: JSON.stringify(
            items.slice(0, 12).map((item) => ({
              examId: item.examId,
              subject: item.subject,
              year: item.year,
              questionNo: item.questionNo,
              stem: item.stem,
              href: item.href,
            })),
          ),
        });
        // Prefill composer meta via a companion key
        try {
          sessionStorage.setItem(
            "bomgichul.chatShareMeta",
            `${subjectLabel}|`,
          );
        } catch {
          /* ignore */
        }
        window.dispatchEvent(new CustomEvent("bomgichul:open-chat"));
        const url = new URL(window.location.href);
        url.searchParams.set("chat", "1");
        window.history.replaceState({}, "", `${url.pathname}${url.search}`);
      }}
      className="rounded-full border border-[#007AFF]/30 bg-[#007AFF]/10 px-3 py-1.5 font-display text-[12px] font-semibold text-[#0066D6]"
    >
      오답 {Math.min(items.length, 12)}문항 채팅 공유
      <span className="sr-only">{subjectLabel}</span>
    </button>
  );
}
