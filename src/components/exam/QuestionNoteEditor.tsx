"use client";
import { useEffect, useState } from "react";
import { readWebStudy, saveWebStudy } from "@/lib/web-study";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
export function QuestionNoteEditor({
  subject,
  year,
  questionNo,
  userId,
  loginNext,
}: {
  subject: string;
  year: number;
  questionNo: number;
  userId: string | null;
  loginNext: string;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(Boolean(userId));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (!userId) return;
    let alive = true;
    void createClient()
      .from("question_notes")
      .select("content")
      .eq("user_id", userId)
      .eq("subject", subject)
      .eq("year", year)
      .eq("question_no", questionNo)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error)
          setStatus(
            "메모를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.",
          );
        else {
          setContent(data?.content || "");
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, [userId, subject, year, questionNo]);
  const save = async () => {
    if (!userId || loading || saving) return;
    setSaving(true);
    setStatus("");
    try {
      const { error } = await createClient()
        .from("question_notes")
        .upsert(
          {
            user_id: userId,
            subject,
            year,
            question_no: questionNo,
            content: content.trim(),
          },
          { onConflict: "user_id,subject,year,question_no" },
        );
      if (!error) {
        const local = readWebStudy(userId);
        for (const entry of local.entries) {
          if (entry.href === loginNext) entry.note = content.trim();
        }
        saveWebStudy(userId, local);
      }
      setStatus(
        error
          ? "저장하지 못했습니다. 다시 시도해 주세요."
          : "개인 메모를 저장했습니다.",
      );
    } catch {
      setStatus("연결이 끊겼습니다. 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="web-panel" aria-label="비공개 개인 메모">
      <h2>
        개인 메모 <span className="text-sm">· 나만 보기</span>
      </h2>
      <p>다른 방문자에게 공개되지 않습니다.</p>
      {userId ? (
        <>
          <label htmlFor={`private-${subject}-${year}-${questionNo}`}>
            내 암기 메모
          </label>
          <textarea
            id={`private-${subject}-${year}-${questionNo}`}
            className="web-input"
            value={content}
            disabled={loading}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <button
            className="web-primary"
            disabled={loading || saving}
            onClick={save}
          >
            {saving ? "저장 중…" : "개인 메모 저장"}
          </button>
          <p role="status">{status}</p>
        </>
      ) : (
        <Link href={`/login?next=${encodeURIComponent(loginNext)}`}>
          로그인하고 비공개 메모 저장 →
        </Link>
      )}
    </section>
  );
}
