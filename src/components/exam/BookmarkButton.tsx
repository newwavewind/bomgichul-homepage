"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { trackEvent } from "@/lib/analytics";
import type { ExamSubject } from "@/lib/exam-questions";

interface BookmarkButtonProps {
  subject: ExamSubject;
  year: number;
  questionNo: number;
  userId: string | null;
  initialBookmarked: boolean;
}

export function BookmarkButton({
  subject,
  year,
  questionNo,
  userId,
  initialBookmarked,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  if (!userId) {
    return (
      <Link
        href={`/login?next=/exam/${subject}/${year}/${questionNo}`}
        className="inline-flex items-center gap-1.5 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-3.5 py-1.5 font-display text-body-sm font-medium text-ink transition-colors hover:bg-snow"
      >
        <span aria-hidden>☆</span>
        북마크
      </Link>
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
        user_id: userId,
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
        .eq("user_id", userId)
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
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon px-3.5 py-1.5 font-display text-body-sm font-medium transition-colors disabled:opacity-60 ${
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
