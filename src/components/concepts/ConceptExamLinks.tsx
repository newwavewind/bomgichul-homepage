"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PrimaryButton, OutlineButton } from "@/components/ui/Button";
import { appendReturnTo } from "@/lib/return-to";
import type { ConceptStatement } from "@/lib/concepts";

function examPath(
  subject: string,
  year: number,
  questionNo: number,
  returnTo: string
) {
  return appendReturnTo(`/exam/${subject}/${year}/${questionNo}`, returnTo);
}

function ConceptLoginRequiredModal({
  open,
  featureLabel,
  loginHref,
  onClose,
}: {
  open: boolean;
  featureLabel: string;
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
        aria-labelledby="hp-cx-login-modal-title"
        aria-describedby="hp-cx-login-modal-desc"
      >
        <p className="hp-cx-login-modal__badge">무료</p>
        <h3 id="hp-cx-login-modal-title" className="hp-cx-login-modal__title">
          로그인이 필요해요
        </h3>
        <p id="hp-cx-login-modal-desc" className="hp-cx-login-modal__desc">
          {featureLabel}에서 기출문제를 보려면 로그인이 필요합니다.
          <br />
          회원가입·이용은 무료예요.
        </p>
        <div className="hp-cx-login-modal__actions">
          <OutlineButton onClick={onClose}>닫기</OutlineButton>
          <PrimaryButton href={loginHref}>로그인</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function useLoginGate(returnTo: string) {
  const [pending, setPending] = useState<{
    featureLabel: string;
    loginHref: string;
  } | null>(null);

  const openLoginModal = useCallback(
    (subject: string, year: number, questionNo: number, featureLabel: string) => {
      const path = examPath(subject, year, questionNo, returnTo);
      setPending({
        featureLabel,
        loginHref: `/login?next=${encodeURIComponent(path)}`,
      });
    },
    [returnTo]
  );

  const closeLoginModal = useCallback(() => setPending(null), []);

  return { pending, openLoginModal, closeLoginModal };
}

export function ConceptStatementList({
  statements,
  subject,
  returnTo,
  isLoggedIn,
}: {
  statements: ConceptStatement[];
  subject: string;
  returnTo: string;
  isLoggedIn: boolean;
}) {
  const { pending, openLoginModal, closeLoginModal } = useLoginGate(returnTo);

  if (statements.length === 0) return null;

  return (
    <>
      <ul className="hp-cx-statements">
        {statements.map((statement, i) => {
          const meta = (
            <>
              {statement.year}년 · {statement.questionNo}번 →
            </>
          );

          const href = examPath(subject, statement.year, statement.questionNo, returnTo);

          if (isLoggedIn) {
            return (
              <li key={`${statement.year}-${statement.questionNo}-${i}`}>
                <Link
                  href={href}
                  className="hp-cx-statement"
                  aria-label={`${statement.year}년 ${statement.questionNo}번 기출문제 보기`}
                >
                  <span className="hp-cx-statement__num" aria-hidden>
                    {i + 1}
                  </span>
                  <span className="hp-cx-statement__body">
                    <span className="hp-cx-statement__text">
                      {statement.text}
                      {statement.modified ? (
                        <span className="hp-cx-statement__modified">수정</span>
                      ) : null}
                    </span>
                    <span className="hp-cx-statement__meta">{meta}</span>
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={`${statement.year}-${statement.questionNo}-${i}`}>
              <a
                href={href}
                className="hp-cx-statement hp-cx-statement--login"
                aria-label={`${statement.year}년 ${statement.questionNo}번 기출문제 보기`}
                onClick={(event) => {
                  event.preventDefault();
                  openLoginModal(subject, statement.year, statement.questionNo, "기출 지문");
                }}
              >
                <span className="hp-cx-statement__num" aria-hidden>
                  {i + 1}
                </span>
                <span className="hp-cx-statement__body">
                  <span className="hp-cx-statement__text">
                    {statement.text}
                    {statement.modified ? (
                      <span className="hp-cx-statement__modified">수정</span>
                    ) : null}
                  </span>
                  <span className="hp-cx-statement__meta">{meta}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <ConceptLoginRequiredModal
        open={Boolean(pending)}
        featureLabel={pending?.featureLabel ?? "기출 지문"}
        loginHref={pending?.loginHref ?? `/login?next=${encodeURIComponent(returnTo)}`}
        onClose={closeLoginModal}
      />
    </>
  );
}

export function ConceptRelatedExamList({
  questions,
  subject,
  returnTo,
  isLoggedIn,
}: {
  questions: { year: number; questionNo: number }[];
  subject: string;
  returnTo: string;
  isLoggedIn: boolean;
}) {
  const { pending, openLoginModal, closeLoginModal } = useLoginGate(returnTo);

  if (questions.length === 0) {
    return (
      <p className="font-display text-body-sm text-smoke">연결된 기출문제가 아직 없어요.</p>
    );
  }

  return (
    <>
      <div className="hp-cx-related-list">
        {questions.map((q) => {
          const href = examPath(subject, q.year, q.questionNo, returnTo);
          if (isLoggedIn) {
            return (
              <Link
                key={`${q.year}-${q.questionNo}`}
                href={href}
                className="hp-cx-question-row"
                aria-label={`${q.year}년 ${q.questionNo}번 기출문제 보기`}
              >
                <span>
                  {q.year}년 · {q.questionNo}번
                </span>
                <span className="hp-cx-question-row__go">문제 보기 →</span>
              </Link>
            );
          }
          return (
            <a
              key={`${q.year}-${q.questionNo}`}
              href={href}
              className="hp-cx-question-row hp-cx-question-row--login"
              aria-label={`${q.year}년 ${q.questionNo}번 기출문제 보기`}
              onClick={(event) => {
                event.preventDefault();
                openLoginModal(subject, q.year, q.questionNo, "관련 기출");
              }}
            >
              <span>
                {q.year}년 · {q.questionNo}번
              </span>
              <span className="hp-cx-question-row__go">문제 보기 →</span>
            </a>
          );
        })}
      </div>
      <ConceptLoginRequiredModal
        open={Boolean(pending)}
        featureLabel={pending?.featureLabel ?? "관련 기출"}
        loginHref={pending?.loginHref ?? `/login?next=${encodeURIComponent(returnTo)}`}
        onClose={closeLoginModal}
      />
    </>
  );
}
