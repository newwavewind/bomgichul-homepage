"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { trackEvent } from "@/lib/analytics";
import { useMe } from "@/lib/client-session";

interface BookmarkButtonProps {
  subject: string;
  year: number;
  questionNo: number;
  /**
   * 주어지면(문자열·null) 그대로 믿는다 — 서버가 방문자를 아는 동적 페이지용.
   * 생략하면 스스로 /api/me 로 해결한다 — 정적(ISR) 문항 페이지용.
   */
  userId?: string | null;
  /** 자기 해결 모드에서는 서버가 모르는 값이라 생략한다 — GET 으로 얻는다. */
  initialBookmarked?: boolean;
  loginNext?: string;
}

export function BookmarkButton({
  subject,
  year,
  questionNo,
  userId,
  initialBookmarked,
  loginNext,
}: BookmarkButtonProps) {
  const selfResolve = userId === undefined;
  const me = useMe();
  // undefined = 아직 판정 중(pending) — 비로그인(null)과 갈라 둔다.
  const resolvedUserId = selfResolve ? (me.pending ? undefined : (me.user?.id ?? null)) : userId;
  // null = 북마크 여부를 아직 모른다(자기 해결 모드의 초기값).
  const [bookmarked, setBookmarked] = useState<boolean | null>(
    selfResolve ? null : (initialBookmarked ?? false)
  );
  const [loading, setLoading] = useState(false);
  // 이전·다음 문항으로 소프트 내비게이션하면 인스턴스가 재사용된다 — 문항이
  // 바뀌면 이전 문항의 별이 남지 않게 초기값으로 되돌린다(자기 해결 모드는
  // 아래 effect 가 새 문항 것을 다시 얻는다).
  const identity = `${subject}:${year}:${questionNo}`;
  const [prevIdentity, setPrevIdentity] = useState(identity);
  if (prevIdentity !== identity) {
    setPrevIdentity(identity);
    setBookmarked(selfResolve ? null : (initialBookmarked ?? false));
  }

  useEffect(() => {
    if (!selfResolve || !resolvedUserId) return;
    let alive = true;
    fetch(
      `/api/exam/bookmark-state?subject=${encodeURIComponent(subject)}&year=${year}&no=${questionNo}`,
      { cache: "no-store" }
    )
      .then((res) => (res.ok ? res.json() : { bookmarked: false }))
      .then((data: { bookmarked?: boolean }) => {
        if (alive) setBookmarked(Boolean(data.bookmarked));
      })
      .catch(() => {
        // 조회 실패는 「안 됨」으로 두면 켜기 시도가 중복 삽입으로 죽을 수 있지만,
        // insert 실패 시 되돌리는 기존 처리가 받아 준다 — 빈 별로 그린다.
        if (alive) setBookmarked(false);
      });
    return () => {
      alive = false;
    };
  }, [selfResolve, resolvedUserId, subject, year, questionNo]);

  // 확정 비로그인 — 로그인 유도 링크 (기존 모양 그대로).
  if (resolvedUserId === null) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(loginNext ?? `/exam/${subject}/${year}/${questionNo}`)}`}
        className="inline-flex min-h-11 items-center gap-1 rounded-[var(--radius-buttons)] border border-carbon bg-paper px-3 font-display text-[12px] font-medium text-ink transition-colors hover:bg-snow"
      >
        <span aria-hidden>☆</span>
        북마크 · 무료
      </Link>
    );
  }

  // 로그인 판정 중이거나 북마크 여부를 아직 모르는 동안 — 빈 별을 비활성으로
  // 자리만 지킨다. 로그인해 둔 사람에게 「로그인」 링크가 깜빡이면 안 된다.
  if (resolvedUserId === undefined || bookmarked === null) {
    return (
      <button
        type="button"
        disabled
        aria-busy="true"
        className="inline-flex min-h-11 items-center gap-1 rounded-[var(--radius-buttons)] border border-carbon bg-paper px-3 font-display text-[12px] font-medium text-ink opacity-60"
      >
        <span aria-hidden>☆</span>
        북마크
      </button>
    );
  }

  const toggle = async () => {
    if (loading || !isSupabaseConfigured()) return;
    setLoading(true);
    const next = !bookmarked;
    setBookmarked(next);

    const supabase = createClient();
    if (next) {
      const { error } = await supabase.from("question_bookmarks").insert({
        user_id: resolvedUserId,
        subject,
        year,
        question_no: questionNo,
      });
      if (error) setBookmarked(false);
      else trackEvent("exam_question_bookmark", { subject, year, questionNo });
    } else {
      const { error } = await supabase
        .from("question_bookmarks")
        .delete()
        .eq("user_id", resolvedUserId)
        .eq("subject", subject)
        .eq("year", year)
        .eq("question_no", questionNo);
      if (error) setBookmarked(true);
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={bookmarked}
      className={`inline-flex min-h-11 items-center gap-1 rounded-[var(--radius-buttons)] border border-carbon px-3 font-display text-[12px] font-medium transition-colors disabled:opacity-60 ${
        bookmarked
          ? "bg-[#6366f1] text-paper hover:opacity-90"
          : "bg-paper text-ink hover:bg-snow"
      }`}
    >
      <span aria-hidden>{bookmarked ? "★" : "☆"}</span>
      {bookmarked ? "북마크됨" : "북마크"}
    </button>
  );
}
