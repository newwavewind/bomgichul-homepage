"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FeatureCard } from "@/components/ui/Card";
import { TextButton } from "@/components/ui/Button";
import { PremiumBadge } from "@/components/ui/PremiumBadge";
import { formatKstDate } from "@/lib/datetime";
import type { Comment } from "@/types/database";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string | null;
  authorBadge?: string | null;
}

export function CommentItem({ comment, currentUserId, authorBadge }: CommentItemProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const canDelete = currentUserId === comment.author_id;

  const handleDelete = async () => {
    if (!confirm("댓글을 삭제할까요?")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("comments").delete().eq("id", comment.id);
    router.refresh();
    setDeleting(false);
  };

  return (
    <FeatureCard className="!p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 font-display text-body-sm">
          <span className="flex items-center gap-1.5 font-medium text-ink">
            {comment.profiles?.nickname ?? "익명"}
            {authorBadge && <PremiumBadge label={authorBadge} />}
          </span>
          <span className="text-fog">
            {formatKstDate(comment.created_at)}
          </span>
        </div>
        {canDelete && (
          <TextButton onClick={handleDelete} className="text-coral">
            {deleting ? "삭제 중..." : "삭제"}
          </TextButton>
        )}
      </div>
      <p className="whitespace-pre-wrap font-display text-body-sm leading-relaxed text-smoke">
        {comment.content}
      </p>
    </FeatureCard>
  );
}
