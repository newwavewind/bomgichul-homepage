"use client";
/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  nickname: string;
  avatar_url: string | null;
  status_message: string | null;
  profile_background_url: string | null;
};
type Media = {
  id: string;
  kind: "avatar" | "background";
  file_path: string;
  created_at: string;
};

export function ChatProfileModal({
  profileId,
  myUserId,
  onClose,
}: {
  profileId: string;
  myUserId: string;
  onClose: () => void;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const avatarInput = useRef<HTMLInputElement>(null);
  const backgroundInput = useRef<HTMLInputElement>(null);
  const isMine = profileId === myUserId;
  const load = useCallback(async () => {
    const s = createClient();
    const [{ data: p }, { data: m }, { data: admin }] = await Promise.all([
      s
        .from("profiles")
        .select("id,nickname,avatar_url,status_message,profile_background_url")
        .eq("id", profileId)
        .single(),
      s
        .from("profile_media")
        .select("id,kind,file_path,created_at")
        .eq("user_id", profileId)
        .order("created_at", { ascending: false })
        .limit(32),
      s.rpc("is_profile_admin", { p_user_id: profileId }),
    ]);
    if (p) {
      setProfile(p as Profile);
      setStatus(p.status_message ?? "");
    }
    setMedia((m ?? []) as Media[]);
    setIsAdmin(Boolean(admin));
  }, [profileId]);
  useEffect(() => {
    void load();
  }, [load]);
  const upload = async (file: File, kind: "avatar" | "background") => {
    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type,
      )
    ) {
      setError("JPG, PNG, WebP, GIF 사진만 사용할 수 있어요.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("사진은 10MB 이하로 선택해주세요.");
      return;
    }
    setBusy(true);
    setError(null);
    const s = createClient(),
      ext =
        file.name
          .split(".")
          .pop()
          ?.replace(/[^a-z0-9]/gi, "") || "jpg",
      path = `${myUserId}/${kind}-${crypto.randomUUID()}.${ext}`;
    const { error: u } = await s.storage
      .from("profile-media")
      .upload(path, file, { contentType: file.type });
    if (!u) {
      const { data: row, error: i } = await s
        .from("profile_media")
        .insert({ user_id: myUserId, kind, file_path: path })
        .select("id")
        .single();
      if (!i && row) {
        const url = `/api/profile-media/${row.id}`;
        await s
          .from("profiles")
          .update(
            kind === "avatar"
              ? { avatar_url: url }
              : { profile_background_url: url },
          )
          .eq("id", myUserId);
        if (kind === "avatar") {
          const avatars = media.filter((x) => x.kind === "avatar");
          if (avatars.length >= 30) {
            const old = avatars.slice(29);
            await s.storage
              .from("profile-media")
              .remove(old.map((x) => x.file_path));
            await s
              .from("profile_media")
              .delete()
              .in(
                "id",
                old.map((x) => x.id),
              );
          }
        }
        await load();
      }
    } else setError(u.message);
    setBusy(false);
  };
  const saveStatus = async () => {
    setBusy(true);
    await createClient()
      .from("profiles")
      .update({ status_message: status.trim().slice(0, 80) || null })
      .eq("id", myUserId);
    await load();
    setEditing(false);
    setBusy(false);
  };
  const removePhoto = async (item: Media) => {
    if (!isMine) return;
    const s = createClient();
    await s.storage.from("profile-media").remove([item.file_path]);
    await s.from("profile_media").delete().eq("id", item.id);
    if (profile?.avatar_url === `/api/profile-media/${item.id}`)
      await s.from("profiles").update({ avatar_url: null }).eq("id", myUserId);
    await load();
  };
  const avatars = media.filter((x) => x.kind === "avatar");
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        className="max-h-[94dvh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-sky-100 via-indigo-100 to-violet-200">
          {profile?.profile_background_url ? (
            <img
              src={profile.profile_background_url}
              alt="프로필 배경"
              className="h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
          <button
            onClick={onClose}
            aria-label="프로필 닫기"
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-xl text-white"
          >
            ✕
          </button>
          {isMine ? (
            <button
              onClick={() => backgroundInput.current?.click()}
              className="absolute bottom-3 right-3 rounded-full bg-black/45 px-3 py-2 text-xs text-white"
            >
              배경 꾸미기
            </button>
          ) : null}
        </div>
        <div className="relative px-5 pb-6 text-center">
          <button
            disabled={!isMine || busy}
            onClick={() => avatarInput.current?.click()}
            className="-mt-14 h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-ice text-3xl font-bold shadow-lg"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="프로필 사진"
                className="h-full w-full object-cover"
              />
            ) : (
              profile?.nickname?.slice(0, 1)
            )}
          </button>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <h2 className="text-xl font-bold">{profile?.nickname}</h2>
            {isAdmin ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm" title="봄기출 공식 운영자 계정">
                <span aria-hidden="true">✓</span> 운영자 · 관리자
              </span>
            ) : null}
          </div>
          {editing ? (
            <div className="mt-3 flex gap-2">
              <input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                maxLength={80}
                className="min-w-0 flex-1 rounded-xl border border-mist px-3 py-2 text-base"
                placeholder="상태 메시지"
              />
              <button
                onClick={() => void saveStatus()}
                className="rounded-xl bg-carbon px-4 text-sm text-white"
              >
                저장
              </button>
            </div>
          ) : (
            <button
              disabled={!isMine}
              onClick={() => setEditing(true)}
              className="mt-2 min-h-8 text-sm text-smoke"
            >
              {profile?.status_message ||
                (isMine
                  ? "상태 메시지를 입력해 보세요"
                  : "상태 메시지가 없어요")}
            </button>
          )}
          {error ? <p className="mt-2 text-xs text-coral">{error}</p> : null}
          <div className="mt-6 border-t border-mist pt-5 text-left">
            <h3 className="text-sm font-semibold">
              내 사진첩 <span className="text-fog">{avatars.length}/30</span>
            </h3>
            <p className="mt-1 text-[11px] text-fog">
              로그인한 봄기출 회원에게만 보여요.
            </p>
            {avatars.length ? (
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {avatars.map((x) => (
                  <div key={x.id} className="group relative">
                    <img
                      src={`/api/profile-media/${x.id}`}
                      alt="이전 프로필"
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                    {isMine ? (
                      <button
                        onClick={() => void removePhoto(x)}
                        aria-label="사진 삭제"
                        className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-xs text-white"
                      >
                        ✕
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-xs text-fog">
                저장된 프로필 사진이 없어요.
              </p>
            )}
          </div>
        </div>
        <input
          ref={avatarInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f, "avatar");
            e.target.value = "";
          }}
        />
        <input
          ref={backgroundInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f, "background");
            e.target.value = "";
          }}
        />
      </section>
    </div>
  );
}
