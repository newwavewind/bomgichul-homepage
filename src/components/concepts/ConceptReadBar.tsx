"use client";

import { useCallback, useEffect, useState } from "react";
import { PrimaryButton, OutlineButton } from "@/components/ui/Button";
import {
  formatConceptReads,
  getConceptReadCount,
  incrementConceptRead,
  loadConceptReads,
  resetConceptRead,
  type ConceptReadProgress,
} from "@/lib/concept-reads";

function ReadLoginModal({
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
        aria-labelledby="hp-cx-read-login-title"
        aria-describedby="hp-cx-read-login-desc"
      >
        <p className="hp-cx-login-modal__badge">무료</p>
        <h3 id="hp-cx-read-login-title" className="hp-cx-login-modal__title">
          로그인이 필요해요
        </h3>
        <p id="hp-cx-read-login-desc" className="hp-cx-login-modal__desc">
          회독 기록 저장은 무료예요. 로그인만 하면 됩니다.
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

export function ConceptReadBar({
  subject,
  slug,
  isLoggedIn,
  userId,
  returnTo,
}: {
  subject: string;
  slug: string;
  isLoggedIn: boolean;
  userId: string | null;
  returnTo: string;
}) {
  const [progress, setProgress] = useState<ConceptReadProgress>({});
  const [loginOpen, setLoginOpen] = useState(false);
  const loginHref = `/login?next=${encodeURIComponent(returnTo)}`;

  useEffect(() => {
    if (!isLoggedIn || !userId) {
      setProgress({});
      return;
    }
    setProgress(loadConceptReads(userId, subject));
  }, [isLoggedIn, userId, subject, slug]);

  const reads = isLoggedIn ? getConceptReadCount(progress, slug) : 0;
  const studied = reads > 0;

  const handleMark = useCallback(() => {
    if (!isLoggedIn || !userId) {
      setLoginOpen(true);
      return;
    }
    const { progress: next } = incrementConceptRead(userId, subject, slug);
    setProgress(next);
  }, [isLoggedIn, userId, subject, slug]);

  const handleReset = useCallback(() => {
    if (!isLoggedIn || !userId) {
      setLoginOpen(true);
      return;
    }
    setProgress(resetConceptRead(userId, subject, slug));
  }, [isLoggedIn, userId, subject, slug]);

  return (
    <>
      <section className="hp-cx-read-bar" aria-label="학습 스케줄 · 회독">
        <div className="hp-cx-read-bar__status">
          <span
            className={`hp-cx-read-badge${studied ? " hp-cx-read-badge--done" : " hp-cx-read-badge--todo"}`}
          >
            {isLoggedIn ? formatConceptReads(reads) : "미학습"}
          </span>
          <p className="hp-cx-read-bar__hint">
            {studied ? "다시 읽었다면 회독 +1" : "읽고 나면 회독 완료"}
            {!isLoggedIn ? <span className="hp-cx-read-bar__note"> · 로그인 후 이용</span> : null}
          </p>
        </div>
        <div className="hp-cx-read-bar__actions">
          {studied ? (
            <button type="button" className="hp-cx-read-reset" onClick={handleReset}>
              초기화
            </button>
          ) : null}
          <button type="button" className="hp-cx-read-mark" onClick={handleMark}>
            {studied ? "회독 +1" : "회독 완료"}
          </button>
        </div>
      </section>
      <ReadLoginModal
        open={loginOpen}
        loginHref={loginHref}
        onClose={() => setLoginOpen(false)}
      />
    </>
  );
}
