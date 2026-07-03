"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SecondaryButton, TextButton } from "@/components/ui/Button";

interface PostActionsProps {
  postId: string;
  authorId: string;
  currentUserId?: string | null;
  listPath?: string;
  editPath?: string;
}

export function PostActions({
  postId,
  authorId,
  currentUserId,
  listPath = "/community",
  editPath,
}: PostActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!currentUserId || currentUserId !== authorId) return null;

  const editHref = editPath ?? `/community/${postId}/edit`;

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    if (!isSupabaseConfigured()) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (!error) {
      router.push(listPath);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <SecondaryButton href={editHref}>수정</SecondaryButton>
      {confirmDelete ? (
        <div className="flex items-center gap-2">
          <TextButton onClick={() => setConfirmDelete(false)}>취소</TextButton>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-[var(--radius-buttons)] bg-coral px-3 py-1.5 font-display text-body-sm font-medium text-paper"
          >
            {loading ? "삭제 중..." : "정말 삭제"}
          </button>
        </div>
      ) : (
        <TextButton onClick={handleDelete} className="text-coral hover:text-coral">
          삭제
        </TextButton>
      )}
    </div>
  );
}
