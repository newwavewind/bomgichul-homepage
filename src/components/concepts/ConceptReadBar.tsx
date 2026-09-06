"use client";

import { useCallback, useEffect, useState } from "react";
import { PrimaryButton, OutlineButton } from "@/components/ui/Button";
import { fetchMe, useMe } from "@/lib/client-session";
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
  isLoggedIn: isLoggedInProp,
  userId: userIdProp,
  returnTo,
}: {
  subject: string;
  slug: string;
  /** 트랙 페이지(동적 렌더)만 내려준다. 정적 개념 페이지는 생략 — useMe 로 스스로 안다. */
  isLoggedIn?: boolean;
  userId?: string | null;
  returnTo: string;
}) {
  const me = useMe();
  // 프롭이 하나라도 오면 서버가 이미 알려준 것(트랙 페이지) — useMe 를 기다릴 이유가 없다.
  const propDriven = isLoggedInProp !== undefined || userIdProp !== undefined;
  const userId = propDriven ? (userIdProp ?? null) : (me.user?.id ?? null);
  const isLoggedIn = propDriven ? Boolean(isLoggedInProp) : me.user != null;
  const pending = propDriven ? false : me.pending;

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

  // 클릭 시점에 로그인 상태가 아직 조회 중이면 fetchMe(문서당 1회 왕복 공유)로
  // 확정한다 — 로그인해 둔 사람에게 로그인 모달이 잘못 뜨면 안 된다.
  const resolveUserId = useCallback(async (): Promise<string | null> => {
    if (propDriven) return userId;
    if (!me.pending) return userId;
    return (await fetchMe()).user?.id ?? null;
  }, [propDriven, userId, me.pending]);

  const handleMark = useCallback(async () => {
    const uid = await resolveUserId();
    if (!uid) {
      setLoginOpen(true);
      return;
    }
    const { progress: next } = incrementConceptRead(uid, subject, slug);
    setProgress(next);
  }, [resolveUserId, subject, slug]);

  const handleReset = useCallback(async () => {
    const uid = await resolveUserId();
    if (!uid) {
      setLoginOpen(true);
      return;
    }
    setProgress(resetConceptRead(uid, subject, slug));
  }, [resolveUserId, subject, slug]);

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
            {/* 조회가 끝나기 전에는 안 내건다 — 로그인해 둔 사람에게 깜빡이면 안 된다 */}
            {!pending && !isLoggedIn ? (
              <span className="hp-cx-read-bar__note"> · 로그인 후 이용</span>
            ) : null}
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
