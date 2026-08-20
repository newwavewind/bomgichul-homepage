import { NextResponse } from "next/server";
import {
  isSameOriginRequest,
  isValidAccountDeletionConfirmation,
} from "@/lib/account-deletion";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type FilePathRow = { file_path: string };

async function removeFiles(bucket: string, paths: string[]) {
  const uniquePaths = [...new Set(paths.filter(Boolean))];
  if (uniquePaths.length === 0) return;

  const admin = createAdminClient();
  for (let index = 0; index < uniquePaths.length; index += 100) {
    const { error } = await admin.storage
      .from(bucket)
      .remove(uniquePaths.slice(index, index + 100));
    if (error) throw new Error(`${bucket} 파일 삭제 실패: ${error.message}`);
  }
}

async function listFilesRecursively(bucket: string, prefix: string): Promise<string[]> {
  const admin = createAdminClient();
  const files: string[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await admin.storage.from(bucket).list(prefix, {
      limit: 100,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) throw new Error(`${bucket} 파일 조회 실패: ${error.message}`);
    if (!data?.length) break;

    for (const item of data) {
      const path = `${prefix}/${item.name}`;
      if (item.id) files.push(path);
      else files.push(...(await listFilesRecursively(bucket, path)));
    }

    if (data.length < 100) break;
    offset += data.length;
  }

  return files;
}

async function removeUserStorage(userId: string) {
  const admin = createAdminClient();
  const [
    chatAttachments,
    chatReservations,
    profileMedia,
    archiveFiles,
    conceptFiles,
    avatarFiles,
    richProfileFiles,
  ] = await Promise.all([
    admin.from("dm_message_attachments").select("file_path").eq("uploader_id", userId),
    admin.from("chat_upload_reservations").select("file_path").eq("user_id", userId),
    admin.from("profile_media").select("file_path").eq("user_id", userId),
    listFilesRecursively("archive", userId),
    listFilesRecursively("concept-community", userId),
    listFilesRecursively("profile-avatars", userId),
    listFilesRecursively("profile-media", userId),
  ]);

  const queryError = chatAttachments.error || chatReservations.error || profileMedia.error;
  if (queryError) throw new Error(`업로드 파일 조회 실패: ${queryError.message}`);

  await Promise.all([
    removeFiles(
      "chat-media",
      [
        ...((chatAttachments.data ?? []) as FilePathRow[]),
        ...((chatReservations.data ?? []) as FilePathRow[]),
      ].map((row) => row.file_path)
    ),
    removeFiles("profile-media", [
      ...((profileMedia.data ?? []) as FilePathRow[]).map((row) => row.file_path),
      ...richProfileFiles,
    ]),
    removeFiles("archive", archiveFiles),
    removeFiles("concept-community", conceptFiles),
    removeFiles("profile-avatars", avatarFiles),
  ]);
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request.url, request.headers.get("origin"))) {
    return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const confirmation =
    typeof body === "object" && body !== null && "confirmation" in body
      ? (body as { confirmation?: unknown }).confirmation
      : undefined;
  if (!isValidAccountDeletionConfirmation(confirmation)) {
    return NextResponse.json({ error: "탈퇴 확인 문구가 일치하지 않습니다." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    await removeUserStorage(user.id);

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;

    await supabase.auth.signOut();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Account deletion failed", { userId: user.id, error });
    return NextResponse.json(
      { error: "계정을 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
