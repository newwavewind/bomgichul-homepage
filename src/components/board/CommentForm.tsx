"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { PrimaryButton } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

interface CommentFormProps {
  postId: string;
  userId?: string | null;
}

export function CommentForm({ postId, userId }: CommentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!userId) {
    return (
      <div className="rounded-[var(--radius-cards)] border border-dashed border-mist bg-surface p-6 text-center">
        <p className="font-display text-body-sm text-smoke">
          댓글 작성은 로그인 후 이용할 수 있어요.
        </p>
        <div className="mt-4">
          <PrimaryButton href="/login">로그인하기</PrimaryButton>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Supabase 연결이 필요합니다.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("comments").insert({
        post_id: postId,
        author_id: userId,
        content: content.trim(),
      });

      if (insertError) {
        setError(insertError.message);
      } else {
        setContent("");
        router.refresh();
      }
    } catch {
      setError("댓글 작성에 실패했습니다.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        id="comment"
        label="댓글 작성"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="댓글을 입력하세요"
        required
      />
      {error && (
        <p className="font-display text-body-sm text-coral">{error}</p>
      )}
      <div className="flex justify-end">
        <PrimaryButton type="submit" disabled={loading || !content.trim()}>
          {loading ? "등록 중..." : "댓글 등록"}
        </PrimaryButton>
      </div>
    </form>
  );
}
