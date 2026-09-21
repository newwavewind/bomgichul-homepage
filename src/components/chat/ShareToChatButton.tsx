"use client";

import { useCallback } from "react";

export const CHAT_SHARE_STORAGE_KEY = "bomgichul.chatShare";

export type ChatShareDraft = {
  mode: "exam" | "wrong";
  examId: string;
  subject?: string;
  year?: string | number;
  questionNo?: string | number;
  stem: string;
  myPick?: string;
  correctLabel?: string;
};

export function writeChatShareDraft(draft: ChatShareDraft) {
  try {
    sessionStorage.setItem(CHAT_SHARE_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* ignore quota */
  }
}

export function readChatShareDraft(): ChatShareDraft | null {
  try {
    const raw = sessionStorage.getItem(CHAT_SHARE_STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(CHAT_SHARE_STORAGE_KEY);
    return JSON.parse(raw) as ChatShareDraft;
  } catch {
    return null;
  }
}

export function ShareToChatButton({
  mode = "exam",
  examId,
  subject,
  year,
  questionNo,
  stem,
  myPick,
  correctLabel,
}: {
  mode?: "exam" | "wrong";
  examId: string;
  subject?: string;
  year?: string | number;
  questionNo?: string | number;
  stem: string;
  myPick?: string;
  correctLabel?: string;
}) {
  const onShare = useCallback(() => {
    writeChatShareDraft({
      mode,
      examId,
      subject,
      year,
      questionNo,
      stem,
      myPick,
      correctLabel,
    });
    window.dispatchEvent(new CustomEvent("bomgichul:open-chat"));
    const url = new URL(window.location.href);
    url.searchParams.set("chat", "1");
    window.history.replaceState({}, "", url.toString());
  }, [correctLabel, examId, mode, myPick, questionNo, stem, subject, year]);

  return (
    <button
      type="button"
      onClick={onShare}
      className="rounded-full border border-[#007AFF]/30 bg-[#007AFF]/10 px-3 py-1.5 font-display text-[12px] font-semibold text-[#0066D6]"
    >
      {mode === "wrong" ? "오답 채팅 공유" : "기출 채팅 공유"}
    </button>
  );
}
