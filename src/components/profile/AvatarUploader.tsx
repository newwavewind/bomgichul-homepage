"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MAX_AVATAR_BYTES = 25 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif",
]);

export function AvatarUploader({
  userId,
  nickname,
  avatarUrl,
}: {
  userId: string;
  nickname: string;
  avatarUrl: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
      setError("JPG, PNG, WebP, GIF, HEIC 사진만 등록할 수 있어요.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setError("프로필 사진은 25MB 이하로 선택해주세요.");
      return;
    }
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${userId}/avatar-${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("profile-avatars")
      .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
    if (uploadError) {
      setError(uploadError.message);
      setBusy(false);
      return;
    }
    const { data } = supabase.storage.from("profile-avatars").getPublicUrl(path);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", userId);
    if (updateError) setError(updateError.message);
    else router.refresh();
    setBusy(false);
  };

  const remove = async () => {
    setBusy(true);
    setError(null);
    const { error: updateError } = await createClient()
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", userId);
    if (updateError) setError(updateError.message);
    else router.refresh();
    setBusy(false);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-[1.5px] border-carbon bg-snow font-display text-heading-sm font-semibold text-ink disabled:opacity-60"
        aria-label="프로필 사진 변경"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : nickname.charAt(0).toUpperCase()}
        <span className="absolute inset-x-0 bottom-0 bg-black/55 py-0.5 text-center text-[9px] text-white">변경</span>
      </button>
      <div className="min-w-0">
        <p className="font-display text-body-sm font-semibold text-ink">프로필 사진</p>
        <p className="mt-1 font-display text-[11px] text-fog">원본 화질 · 최대 25MB</p>
        {avatarUrl ? (
          <button type="button" onClick={() => void remove()} disabled={busy} className="mt-1 font-display text-[11px] text-coral hover:underline">
            사진 삭제
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
          event.target.value = "";
        }}
      />
      {error ? <p className="font-display text-[11px] text-coral">{error}</p> : null}
    </div>
  );
}
