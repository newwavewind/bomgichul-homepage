"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { QuestionMemoAuthorActions } from "@/components/exam/QuestionMemoCard";
import { PrimaryButton } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { readWebStudy, saveWebStudy } from "@/lib/web-study";
import type { QuestionNote } from "@/types/database";

export type QuestionMemoVisibility = "public" | "private";
type SavedMemo = Pick<QuestionNote, "id" | "content" | "updated_at">;
const memoFields = "id,content,updated_at";

export function QuestionMemoComposer({
  subject, year, questionNo, userId, loginNext, postPublic, visibility, onVisibilityChange, onPublished,
}: {
  subject: string;
  year: number;
  questionNo: number;
  userId: string | null;
  loginNext: string;
  postPublic: (content: string) => Promise<boolean>;
  visibility: QuestionMemoVisibility;
  onVisibilityChange: (value: QuestionMemoVisibility) => void;
  onPublished: () => Promise<void>;
}) {
  const id = useId();
  const [publicDraft, setPublicDraft] = useState("");
  const [privateDraft, setPrivateDraft] = useState("");
  const [privateMemo, setPrivateMemo] = useState<SavedMemo | null>(null);
  const [privateState, setPrivateState] = useState<"loading" | "ready" | "error">("loading");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ text: string; error?: boolean } | null>(null);

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    void (async () => {
      try {
        const { data, error } = await createClient()
          .from("question_notes")
          .select(memoFields)
          .match({ user_id: userId, subject, year, question_no: questionNo })
          .abortSignal(controller.signal)
          .maybeSingle();
        if (controller.signal.aborted) return;
        if (error) throw error;
        setPrivateMemo(data);
        setPrivateState("ready");
      } catch {
        if (!controller.signal.aborted) setPrivateState("error");
      }
    })();
    return () => controller.abort();
  }, [userId, subject, year, questionNo]);

  const isPrivate = visibility === "private";
  const content = isPrivate ? privateDraft : publicDraft;
  const disabled = !userId || saving;
  const savedMemo = isPrivate && !editing && privateMemo?.content.trim() ? privateMemo : null;

  function updateLocalNote(actor: string, note?: string) {
    const local = readWebStudy(actor);
    const entries = local.entries.filter((entry) => entry.href === loginNext);
    if (!entries.length) return;
    for (const entry of entries) {
      if (note === undefined) delete entry.note;
      else entry.note = note;
    }
    saveWebStudy(actor, local);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = content.trim();
    if (!userId || disabled || !trimmed || (isPrivate && privateState !== "ready")) return;
    setSaving(true);
    setStatus(null);
    try {
      if (isPrivate) {
        const notes = createClient().from("question_notes");
        const { data, error } = privateMemo
          ? await notes.update({ content: trimmed }).eq("id", privateMemo.id).eq("user_id", userId)
            .eq("updated_at", privateMemo.updated_at).select(memoFields).single()
          : await notes.insert({ user_id: userId, subject, year, question_no: questionNo, content: trimmed })
            .select(memoFields).single();
        if (error) throw error;
        setPrivateMemo(data);
        setPrivateDraft("");
        setEditing(false);
        updateLocalNote(userId, data.content);
      } else {
        if (!await postPublic(trimmed)) throw new Error("public memo");
        setPublicDraft("");
      }
      setStatus({ text: isPrivate ? "나만 보는 메모를 저장했어요." : "공개 글을 등록했어요." });
    } catch {
      setStatus({ text: isPrivate ? "메모를 저장하지 못했어요. 다시 시도해 주세요." : "등록하지 못했어요. 다시 시도해 주세요.", error: true });
    } finally {
      setSaving(false);
    }
  }

  async function removeMemo() {
    if (!userId || disabled || !privateMemo || !window.confirm("비공개 메모를 삭제할까요?")) return;
    setSaving(true);
    setStatus(null);
    try {
      const { error } = await createClient().from("question_notes").delete()
        .eq("id", privateMemo.id).eq("user_id", userId).eq("updated_at", privateMemo.updated_at).select("id").single();
      if (error) throw error;
      setPrivateMemo(null);
      setPrivateDraft("");
      setEditing(false);
      updateLocalNote(userId);
      setStatus({ text: "비공개 메모를 삭제했어요." });
    } catch {
      setStatus({ text: "메모를 삭제하지 못했어요. 다시 시도해 주세요.", error: true });
    } finally {
      setSaving(false);
    }
  }

  async function publishMemo() {
    if (!userId || disabled || !savedMemo
      || !window.confirm("이 메모를 공개하면 누구나 볼 수 있어요. 공개 글로 옮길까요?")) return;
    setSaving(true);
    setStatus(null);
    try {
      const { error } = await createClient().rpc("publish_private_question_note", {
        note_id: savedMemo.id,
        note_updated_at: savedMemo.updated_at,
      });
      if (error) throw error;
      setPrivateMemo(null);
      setPrivateDraft("");
      updateLocalNote(userId);
      await onPublished();
      onVisibilityChange("public");
      setStatus({ text: "공개 글로 옮겼어요." });
    } catch {
      setStatus({ text: "공개 글로 옮기지 못했어요. 다시 시도해 주세요.", error: true });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-2">
      <fieldset disabled={disabled} className="mb-2 flex flex-wrap items-center gap-2">
        <legend className="sr-only">공개 범위</legend>
        {([
          ["public", "공개 · 누구나 보기"],
          ["private", "비공개 · 나만 보기"],
        ] as const).map(([value, label]) => (
          <label key={value} className="cursor-pointer">
            <input
              type="radio"
              name={id}
              value={value}
              checked={visibility === value}
              onChange={() => {
                onVisibilityChange(value);
                setStatus(null);
              }}
              className="peer sr-only"
            />
            <span className="inline-flex rounded-full border border-mist bg-paper px-3 py-1 font-display text-body-sm text-smoke peer-checked:border-ios-blue peer-checked:bg-ios-blue/10 peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ios-blue">
              {label}
            </span>
          </label>
        ))}
      </fieldset>

      {savedMemo ? (
        <article aria-label="나만 보는 메모" className="rounded-2xl border border-mist bg-paper p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-body-sm font-semibold text-ink">나만 보는 메모</h3>
            <QuestionMemoAuthorActions label="비공개 메모" busy={saving} onEdit={() => {
              setStatus(null);
              setPrivateDraft(savedMemo.content);
              setEditing(true);
            }} onDelete={() => void removeMemo()}
              visibilityAction={{ label: "공개 전환", run: () => void publishMemo() }} />
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words font-system text-body-sm leading-relaxed text-ink">{savedMemo.content}</p>
        </article>
      ) : isPrivate && privateState !== "ready" ? (
        privateState === "loading"
          ? <p role="status" className="py-1.5 text-body-sm text-fog">메모를 불러오고 있어요.</p>
          : <p role="alert" className="py-1.5 text-body-sm text-smoke">저장된 메모를 불러오지 못했어요. 새로고침 후 다시 시도해 주세요.</p>
      ) : (
        <form className="flex flex-col gap-2 sm:flex-row sm:items-end" onSubmit={(event) => void submit(event)}>
          <div className="min-w-0 flex-1">
            <Textarea
              id={id}
              aria-label={isPrivate ? "비공개 메모 내용" : "공개 글 내용"}
              value={content}
              onChange={(event) => (isPrivate ? setPrivateDraft : setPublicDraft)(event.target.value)}
              rows={4}
              placeholder={isPrivate ? "나만 볼 메모를 적어 보세요." : "질문, 생각, 암기 팁 등을 나눠 보세요."}
              className="min-h-[7.5rem] max-h-48 !py-2 !text-body-sm [field-sizing:content]"
              disabled={disabled}
              autoFocus={isPrivate && editing}
            />
          </div>
          <div className="flex shrink-0 items-center gap-1 self-end">
            {isPrivate && editing && <button type="button" className="rounded-lg px-3 py-2 text-body-sm text-smoke hover:bg-snow focus-visible:outline-2 focus-visible:outline-ios-blue" disabled={disabled}
              onClick={() => { setPrivateDraft(""); setEditing(false); setStatus(null); }}>취소</button>}
            <PrimaryButton type="submit" size="sm" disabled={disabled || !content.trim()}>
              {saving ? "저장 중…" : isPrivate ? (editing ? "수정 저장" : "비공개 저장") : "공개 등록"}
            </PrimaryButton>
          </div>
        </form>
      )}
      {status && <p className="mt-2 text-body-sm text-smoke" role={status.error ? "alert" : "status"}>{status.text}</p>}
    </div>
  );
}
