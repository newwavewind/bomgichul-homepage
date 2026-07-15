"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PrimaryButton, OutlineButton } from "@/components/ui/Button";
import {
  countStudiedConcepts,
  formatConceptReads,
  getConceptReadCount,
  loadConceptReads,
  type ConceptReadProgress,
} from "@/lib/concept-reads";

export type StudyScheduleConcept = {
  slug: string;
  titleKo: string;
  category: string;
  chapterKo?: string | null;
  parentSlug?: string | null;
};

type FilterKey = "unread" | "read" | "all";

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
        aria-labelledby="hp-cx-schedule-login-title"
      >
        <p className="hp-cx-login-modal__badge">무료</p>
        <h3 id="hp-cx-schedule-login-title" className="hp-cx-login-modal__title">
          로그인이 필요해요
        </h3>
        <p className="hp-cx-login-modal__desc">
          회독·학습 스케줄을 저장하려면 로그인이 필요합니다.
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

export function ConceptStudySchedule({
  subject,
  concepts,
  userId,
  returnTo,
}: {
  subject: string;
  concepts: StudyScheduleConcept[];
  userId: string | null;
  returnTo: string;
}) {
  const [progress, setProgress] = useState<ConceptReadProgress>({});
  const [filter, setFilter] = useState<FilterKey>("unread");
  const [loginOpen, setLoginOpen] = useState(false);
  const loginHref = `/login?next=${encodeURIComponent(returnTo)}`;
  const isLoggedIn = Boolean(userId);

  useEffect(() => {
    if (!userId) {
      setProgress({});
      return;
    }
    setProgress(loadConceptReads(userId, subject));
  }, [userId, subject]);

  useEffect(() => {
    if (!userId) return;
    const onFocus = () => setProgress(loadConceptReads(userId, subject));
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [userId, subject]);

  const total = concepts.length;
  const studied = isLoggedIn
    ? countStudiedConcepts(
        progress,
        concepts.map((c) => c.slug)
      )
    : 0;
  const unread = Math.max(0, total - studied);
  const percent = total > 0 ? Math.round((studied / total) * 100) : 0;

  const nextConcept = useMemo(() => {
    if (!isLoggedIn) return concepts[0] ?? null;
    return concepts.find((c) => getConceptReadCount(progress, c.slug) === 0) ?? null;
  }, [concepts, progress, isLoggedIn]);

  const filtered = useMemo(() => {
    if (!isLoggedIn || filter === "all") return concepts;
    if (filter === "read") {
      return concepts.filter((c) => getConceptReadCount(progress, c.slug) > 0);
    }
    return concepts.filter((c) => getConceptReadCount(progress, c.slug) === 0);
  }, [concepts, progress, filter, isLoggedIn]);

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: "unread", label: "미회독", count: unread },
    { key: "read", label: "회독함", count: studied },
    { key: "all", label: "전체", count: total },
  ];

  return (
    <>
      <section className="hp-cx-schedule" aria-label="학습 스케줄">
        <div className="hp-cx-schedule__head">
          <div>
            <p className="hp-cx-schedule__eyebrow">학습 스케줄</p>
            <h2 className="hp-cx-schedule__title">회독 진도</h2>
          </div>
          <p className="hp-cx-schedule__pct" aria-hidden>
            {percent}%
          </p>
        </div>

        <div className="hp-cx-schedule__summary">
          <span>
            회독 <strong>{studied}</strong>
          </span>
          <span className="hp-cx-schedule__dot" aria-hidden>
            ·
          </span>
          <span>
            미회독 <strong>{unread}</strong>
          </span>
          <span className="hp-cx-schedule__dot" aria-hidden>
            ·
          </span>
          <span>개념 {total}개</span>
        </div>

        <div
          className="hp-cx-schedule__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label={`회독 ${percent}%`}
        >
          <span style={{ width: `${percent}%` }} />
        </div>

        {!isLoggedIn ? (
          <div className="hp-cx-schedule__login">
            <p>로그인하면 회독한 개념과 아직 안 본 개념을 나눠 보여 드려요.</p>
            <button type="button" className="hp-cx-schedule__login-btn" onClick={() => setLoginOpen(true)}>
              로그인하고 스케줄 보기
            </button>
          </div>
        ) : null}

        <div className="hp-cx-schedule__filters" role="tablist" aria-label="회독 필터">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={filter === item.key}
              className={
                filter === item.key
                  ? "hp-cx-schedule__filter is-active"
                  : "hp-cx-schedule__filter"
              }
              onClick={() => setFilter(item.key)}
            >
              {item.label}
              <em>{item.count}</em>
            </button>
          ))}
        </div>

        {nextConcept && filter === "unread" ? (
          <Link
            href={`/concepts/${subject}/${nextConcept.slug}`}
            className="hp-cx-schedule__next"
          >
            <span className="hp-cx-schedule__next-label">다음에 볼 개념</span>
            <span className="hp-cx-schedule__next-title">{nextConcept.titleKo}</span>
            <span className="hp-cx-schedule__next-go">바로 보기 →</span>
          </Link>
        ) : null}

        <ul className="hp-cx-schedule__list">
          {filtered.length === 0 ? (
            <li className="hp-cx-schedule__empty">
              {filter === "read"
                ? "아직 회독한 개념이 없어요. 개념을 읽고 회독 완료를 눌러 주세요."
                : filter === "unread"
                  ? "미회독 개념이 없어요. 전부 회독했거나 다음에 볼 개념이 없습니다."
                  : "표시할 개념이 없어요."}
            </li>
          ) : (
            filtered.slice(0, 12).map((concept) => {
              const reads = isLoggedIn ? getConceptReadCount(progress, concept.slug) : 0;
              return (
                <li key={concept.slug}>
                  <Link
                    href={`/concepts/${subject}/${concept.slug}`}
                    className="hp-cx-schedule__row"
                  >
                    <span className="hp-cx-schedule__row-body">
                      <span className="hp-cx-schedule__row-meta">
                        {concept.chapterKo || concept.category}
                        {concept.parentSlug ? " · 하위" : ""}
                      </span>
                      <span className="hp-cx-schedule__row-title">{concept.titleKo}</span>
                    </span>
                    <span
                      className={`hp-cx-schedule__badge${
                        reads > 0 ? " is-done" : " is-todo"
                      }`}
                    >
                      {formatConceptReads(reads)}
                    </span>
                  </Link>
                </li>
              );
            })
          )}
        </ul>

        {filtered.length > 12 ? (
          <p className="hp-cx-schedule__more">
            외 {filtered.length - 12}개 · 아래 목차에서도 확인하세요
          </p>
        ) : null}
      </section>

      <LoginModal open={loginOpen} loginHref={loginHref} onClose={() => setLoginOpen(false)} />
    </>
  );
}
