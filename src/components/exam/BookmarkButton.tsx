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

const bookmarkFrame =
  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 font-display text-reading-detail font-semibold leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ios-blue disabled:opacity-70";
const bookmarkIdle =
  "border-mist bg-paper text-ink shadow-[var(--shadow-button)] hover:border-ios-blue/40 hover:bg-ios-blue/[0.04]";
const bookmarkSaved =
  "border-ios-blue/35 bg-ios-blue/[0.09] text-[color:light-dark(#06529e,#c1ddff)] hover:bg-ios-blue/[0.14]";

function BookmarkMark({ saved = false }: { saved?: boolean }) {
  return (
    <span aria-hidden className={`grid size-7 shrink-0 place-items-center rounded-full ${saved
      ? "bg-[color:light-dark(#0066d6,#8dc5ff)] text-[color:light-dark(#ffffff,#10233a)]"
      : "bg-ios-blue/10 text-[color:light-dark(#0066d6,#a5ceff)]"}`}>
      <svg viewBox="0 0 20 20" fill={saved ? "currentColor" : "none"} className="size-4">
        <path
          d="M5.5 4.5A1.5 1.5 0 0 1 7 3h6a1.5 1.5 0 0 1 1.5 1.5V17L10 14l-4.5 3V4.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
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

  // 비로그인 사용자는 로그인 후 이 문항으로 돌아온다.
  if (resolvedUserId === null) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(loginNext ?? `/exam/${subject}/${year}/${questionNo}`)}`}
        className={`${bookmarkFrame} ${bookmarkIdle}`}
        aria-label="북마크 · 로그인 후 저장"
      >
        <BookmarkMark />
        <span className="flex flex-col">
          <span>북마크</span>
          <span className="hidden text-reading-note font-normal text-smoke sm:block">로그인 후 저장</span>
        </span>
      </Link>
    );
  }

  // 로그인 판정 중이거나 북마크 여부를 아직 모르는 동안 — 비활성 상태로
  // 자리만 지킨다. 로그인해 둔 사람에게 「로그인」 링크가 깜빡이면 안 된다.
  if (resolvedUserId === undefined || bookmarked === null) {
    return (
      <button
        type="button"
        disabled
        aria-busy="true"
        className={`${bookmarkFrame} ${bookmarkIdle}`}
      >
        <BookmarkMark />
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
      className={`${bookmarkFrame} ${bookmarked ? bookmarkSaved : bookmarkIdle}`}
    >
      <BookmarkMark saved={bookmarked} />
      {bookmarked ? "북마크됨" : "북마크"}
    </button>
  );
}
