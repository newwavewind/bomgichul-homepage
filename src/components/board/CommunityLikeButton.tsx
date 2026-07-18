"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type CommunityLikeButtonProps = {
  targetType: "post" | "comment";
  targetId: string;
  authorId: string;
  currentUserId?: string | null;
  initialCount: number;
  initialLiked: boolean;
  loginHref: string;
};

export function CommunityLikeButton({
  targetType,
  targetId,
  authorId,
  currentUserId,
  initialCount,
  initialLiked,
  loginHref,
}: CommunityLikeButtonProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isOwnContent = Boolean(currentUserId && currentUserId === authorId);

  const toggleLike = async () => {
    if (!currentUserId) {
      router.push(loginHref);
      return;
    }
    if (isOwnContent || pending) return;

    const nextLiked = !liked;
    setErrorMessage("");
    setPending(true);
    setLiked(nextLiked);
    setCount((value) => Math.max(0, value + (nextLiked ? 1 : -1)));

    const supabase = createClient();
    const table = targetType === "post" ? "post_likes" : "comment_likes";
    const targetColumn = targetType === "post" ? "post_id" : "comment_id";
    const result = nextLiked
      ? await supabase.from(table).insert({
          [targetColumn]: targetId,
          user_id: currentUserId,
        })
      : await supabase
          .from(table)
          .delete()
          .eq(targetColumn, targetId)
          .eq("user_id", currentUserId);

    if (result.error) {
      setLiked(!nextLiked);
      setCount((value) => Math.max(0, value + (nextLiked ? -1 : 1)));
      setErrorMessage("좋아요를 저장하지 못했어요. 잠시 후 다시 시도해주세요.");
    } else {
      router.refresh();
    }
    setPending(false);
  };

  return (
    <span className="inline-flex shrink-0 flex-col items-start gap-1">
      <button
        type="button"
        onClick={toggleLike}
        disabled={pending || isOwnContent}
        title={isOwnContent ? "내 글과 댓글에는 좋아요를 누를 수 없어요" : "좋아요"}
        aria-pressed={liked}
        aria-describedby={errorMessage ? `like-error-${targetType}-${targetId}` : undefined}
        className={`inline-flex min-h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 font-display text-[12px] font-semibold transition-colors ${
          liked
            ? "border-[#f4a8b8] bg-[#fff1f4] text-[#be3658]"
            : "border-mist bg-paper text-fog hover:border-[#f4a8b8] hover:text-[#be3658]"
        } disabled:cursor-default disabled:opacity-55`}
      >
        <span aria-hidden className="text-[15px] leading-none">
          {liked ? "♥" : "♡"}
        </span>
        좋아요 {count}
      </button>
      {errorMessage && (
        <span
          id={`like-error-${targetType}-${targetId}`}
          role="status"
          className="max-w-52 font-display text-[11px] font-medium leading-snug text-[#be3658]"
        >
          {errorMessage}
        </span>
      )}
    </span>
  );
}
