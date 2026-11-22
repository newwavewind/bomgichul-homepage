"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { PrimaryButton } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { readWebStudy, saveWebStudy } from "@/lib/web-study";

type Visibility = "public" | "private";

export function QuestionMemoComposer({
  subject, year, questionNo, userId, loginNext, postPublic,
}: {
  subject: string;
  year: number;
  questionNo: number;
  userId: string | null;
  loginNext: string;
  postPublic: (content: string) => Promise<boolean>;
}) {
  const id = useId();
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [publicDraft, setPublicDraft] = useState("");
  const [privateDraft, setPrivateDraft] = useState("");
  const [privateState, setPrivateState] = useState<"loading" | "ready" | "error">("loading");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ text: string; error?: boolean } | null>(null);

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    void (async () => {
      try {
        const { data, error } = await createClient()
          .from("question_notes")
          .select("content")
          .eq("user_id", userId)
          .eq("subject", subject)
          .eq("year", year)
          .eq("question_no", questionNo)
          .abortSignal(controller.signal)
          .maybeSingle();
        if (controller.signal.aborted) return;
        if (error) {
          setPrivateState("error");
        } else {
          setPrivateDraft(data?.content ?? "");
          setPrivateState("ready");
        }
      } catch {
        if (!controller.signal.aborted) setPrivateState("error");
      }
    })();
    return () => controller.abort();
  }, [userId, subject, year, questionNo]);

  const isPrivate = visibility === "private";
  const content = isPrivate ? privateDraft : publicDraft;
  const disabled = !userId || saving || (isPrivate && privateState !== "ready");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = content.trim();
    if (!userId || disabled || !trimmed) return;
    setSaving(true);
    setStatus(null);
    try {
      if (!isPrivate) {
        if (!await postPublic(trimmed)) throw new Error("public memo");
        setPublicDraft("");
      } else {
        const { error } = await createClient()
          .from("question_notes")
          .upsert(
            { user_id: userId, subject, year, question_no: questionNo, content: trimmed },
            { onConflict: "user_id,subject,year,question_no" },
          );
        if (error) throw error;
        setPrivateDraft(trimmed);
        const local = readWebStudy(userId);
        for (const entry of local.entries) {
          if (entry.href === loginNext) entry.note = trimmed;
        }
        saveWebStudy(userId, local);
      }
      setStatus({ text: isPrivate ? "나만 보는 메모를 저장했어요." : "공개 글을 등록했어요." });
    } catch {
      setStatus({ text: "등록하지 못했어요. 다시 시도해 주세요.", error: true });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="mb-2" onSubmit={(event) => void submit(event)}>
      <fieldset disabled={!userId || saving} className="mb-2 flex flex-wrap items-center gap-2">
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
                setVisibility(value);
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Textarea
            id={id}
            aria-label={isPrivate ? "비공개 메모 내용" : "공개 글 내용"}
            value={content}
            onChange={(event) => (isPrivate ? setPrivateDraft : setPublicDraft)(event.target.value)}
            rows={1}
            placeholder={isPrivate ? "나만 볼 메모를 적어 보세요." : "질문, 생각, 암기 팁 등을 나눠 보세요."}
            className="min-h-10 max-h-48 !py-2 !text-body-sm [field-sizing:content]"
            disabled={disabled}
          />
        </div>
        <PrimaryButton type="submit" size="sm" disabled={disabled || !content.trim()} className="shrink-0 self-end">
          {saving ? "등록 중…" : isPrivate ? "비공개 저장" : "공개 등록"}
        </PrimaryButton>
      </div>
      {isPrivate && privateState === "error" ? (
        <p className="mt-2 text-body-sm text-smoke" role="alert">저장된 메모를 불러오지 못했어요. 새로고침 후 다시 시도해 주세요.</p>
      ) : null}
      {status ? <p className="mt-2 text-body-sm text-smoke" role={status.error ? "alert" : "status"}>{status.text}</p> : null}
    </form>
  );
}
