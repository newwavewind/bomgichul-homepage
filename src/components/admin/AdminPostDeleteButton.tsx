"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextButton } from "@/components/ui/Button";

export function AdminPostDeleteButton({
  postId,
  label = "삭제",
}: {
  postId: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) return;
      router.refresh();
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      {confirming && (
        <TextButton onClick={() => !loading && setConfirming(false)}>
          취소
        </TextButton>
      )}
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="font-display text-body-sm font-medium text-coral hover:underline disabled:opacity-50"
      >
        {loading ? "삭제 중..." : confirming ? "정말 삭제" : label}
      </button>
    </span>
  );
}
