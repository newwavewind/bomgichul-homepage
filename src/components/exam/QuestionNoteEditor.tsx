"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Textarea } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/Button";
import type { ExamSubject } from "@/lib/exam-questions";

interface QuestionNoteEditorProps {
  subject: ExamSubject;
  year: number;
  questionNo: number;
  userId: string | null;
  initialContent: string;
}

export function QuestionNoteEditor({
  subject,
  year,
  questionNo,
  userId,
  initialContent,
}: QuestionNoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!userId) {
    return (
      <div className="mt-4 rounded-[var(--radius-cards)] border border-dashed border-mist bg-surface px-5 py-4 text-center">
        <p className="font-display text-body-sm text-smoke">
          메모는 무료예요. 로그인만 하면 이 문제에 나만의 메모를 남길 수 있어요.
        </p>
        <div className="mt-3">
          <Link
            href={`/login?next=/exam/${subject}/${year}/${questionNo}`}
            className="font-display text-body-sm font-medium text-[#6366f1] hover:underline"
          >
            무료로 로그인
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (saving || !isSupabaseConfigured()) return;
    setSaving(true);
    setSaved(false);

    const supabase = createClient();
    const trimmed = content.trim();

    const { error } = trimmed
      ? await supabase.from("question_notes").upsert(
          { user_id: userId, subject, year, question_no: questionNo, content: trimmed },
          { onConflict: "user_id,subject,year,question_no" }
        )
      : await supabase
          .from("question_notes")
          .delete()
          .eq("user_id", userId)
          .eq("subject", subject)
          .eq("year", year)
          .eq("question_no", questionNo);

    if (!error) setSaved(true);
    setSaving(false);
  };

  return (
    <div className="mt-4 rounded-[var(--radius-cards)] border border-carbon bg-paper px-5 py-4">
      <Textarea
        id={`note-${subject}-${year}-${questionNo}`}
        label="나만의 메모"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setSaved(false);
        }}
        rows={3}
        placeholder="이 문제에 대한 나만의 메모를 남겨보세요 (헷갈렸던 포인트, 암기 팁 등)"
      />
      <div className="mt-3 flex items-center justify-end gap-3">
        {saved && (
          <p className="font-display text-body-sm text-[#6366f1]">저장됐어요</p>
        )}
        <PrimaryButton size="sm" onClick={handleSave} disabled={saving}>
          {saving ? "저장 중..." : "메모 저장"}
        </PrimaryButton>
      </div>
    </div>
  );
}
