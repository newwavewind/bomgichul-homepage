"use client";

import { useState } from "react";
import { ACCOUNT_DELETION_CONFIRMATION } from "@/lib/account-deletion";

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (busy) return;
    setOpen(false);
    setConfirmation("");
    setError(null);
  };

  const deleteAccount = async () => {
    if (confirmation !== ACCOUNT_DELETION_CONFIRMATION) return;
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation }),
      });
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error ?? "계정을 삭제하지 못했습니다.");
      window.location.assign("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "계정을 삭제하지 못했습니다.");
      setBusy(false);
    }
  };

  return (
    <section className="mt-12 border-t border-mist pt-8">
      <h2 className="font-display text-body font-semibold text-ink">계정 관리</h2>
      <p className="mt-2 font-display text-body-sm leading-relaxed text-fog">
        더 이상 봄기출을 이용하지 않는다면 계정과 저장된 개인정보를 삭제할 수 있습니다.
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 font-display text-body-sm font-medium text-smoke underline underline-offset-4 hover:text-ink"
      >
        회원 탈퇴
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-carbon/45 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) close();
          }}
        >
          <div className="w-full max-w-md rounded-[20px] border-[1.5px] border-carbon bg-paper p-6 shadow-[var(--shadow-card)]">
            <p className="font-display text-[11px] font-semibold tracking-[0.12em] text-red-700">
              되돌릴 수 없는 작업
            </p>
            <h3
              id="delete-account-title"
              className="mt-2 font-display text-subheading font-semibold text-ink"
            >
              정말 탈퇴하시겠어요?
            </h3>
            <p className="mt-3 font-display text-body-sm leading-relaxed text-smoke">
              프로필, 북마크, 오답·응시 기록, 메모, 게시글·댓글, 채팅과 업로드 파일,
              등록한 학습권 연결이 모두 삭제되며 복구할 수 없습니다.
            </p>
            <label
              className="mt-5 block font-display text-[12px] font-medium text-ink"
              htmlFor="delete-confirmation"
            >
              확인을 위해 <strong>&apos;{ACCOUNT_DELETION_CONFIRMATION}&apos;</strong>를 입력하세요.
            </label>
            <input
              id="delete-confirmation"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              disabled={busy}
              autoComplete="off"
              className="mt-2 w-full rounded-[12px] border border-mist bg-snow px-4 py-3 font-display text-body-sm text-ink outline-none focus:border-carbon"
            />
            {error ? (
              <p className="mt-3 font-display text-[12px] text-red-700">{error}</p>
            ) : null}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                disabled={busy}
                className="rounded-[var(--radius-buttons)] px-4 py-2 font-display text-body-sm text-smoke hover:bg-snow disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={deleteAccount}
                disabled={busy || confirmation !== ACCOUNT_DELETION_CONFIRMATION}
                className="rounded-[var(--radius-buttons)] bg-red-700 px-4 py-2 font-display text-body-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? "삭제 중…" : "계정 영구 삭제"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
