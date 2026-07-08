import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { LAW_UPDATE_POSTS } from "@/data/seed/law-updates";
import { ARCHIVE_SEED_FILES } from "@/data/seed/archive-files";

export const maxDuration = 60;

const ADMIN_EMAIL = "newwavewind@gmail.com";
const ADMIN_NICKNAME = "봄기출";

async function resolveAdminAuthorId(
  admin: ReturnType<typeof createAdminClient>
): Promise<string> {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw new Error(`관리자 계정 조회 실패: ${error.message}`);

  const user = data.users.find((u) => u.email === ADMIN_EMAIL);
  if (!user) throw new Error(`${ADMIN_EMAIL} 계정을 찾을 수 없습니다.`);

  const { data: profile } = await admin
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.nickname !== ADMIN_NICKNAME) {
    await admin
      .from("profiles")
      .upsert({ id: user.id, nickname: ADMIN_NICKNAME, username_set: true });
  }

  return user.id;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const origin = new URL(request.url).origin;

  let authorId: string;
  try {
    authorId = await resolveAdminAuthorId(admin);
  } catch (err) {
    const message = err instanceof Error ? err.message : "관리자 계정 확인 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const results = { lawPosts: [] as string[], archivePosts: [] as string[], errors: [] as string[] };

  // 1) 법령정보 커뮤니티 게시글
  for (const post of LAW_UPDATE_POSTS) {
    const { data: existing } = await admin
      .from("posts")
      .select("id")
      .eq("category", "law_update")
      .eq("title", post.title)
      .maybeSingle();

    if (existing) {
      results.errors.push(`이미 존재함(건너뜀): ${post.title}`);
      continue;
    }

    const { error } = await admin.from("posts").insert({
      author_id: authorId,
      category: "law_update",
      title: post.title,
      content: post.content,
    });

    if (error) {
      results.errors.push(`법령정보 게시 실패(${post.title}): ${error.message}`);
    } else {
      results.lawPosts.push(post.title);
    }
  }

  // 2) 자료실 게시글 + 파일 업로드
  for (const file of ARCHIVE_SEED_FILES) {
    const { data: existing } = await admin
      .from("posts")
      .select("id")
      .eq("category", "resource")
      .eq("title", file.title)
      .maybeSingle();

    if (existing) {
      results.errors.push(`이미 존재함(건너뜀): ${file.title}`);
      continue;
    }

    const { data: inserted, error: postError } = await admin
      .from("posts")
      .insert({
        author_id: authorId,
        category: "resource",
        title: file.title,
        content: file.content,
        subject: file.subject,
        resource_type: file.resourceType,
      })
      .select("id")
      .single();

    if (postError || !inserted) {
      results.errors.push(`자료실 게시 실패(${file.title}): ${postError?.message ?? "unknown"}`);
      continue;
    }

    try {
      const fileRes = await fetch(`${origin}/archive-seed/${encodeURIComponent(file.fileName)}`);
      if (!fileRes.ok) throw new Error(`파일 다운로드 실패 (${fileRes.status})`);
      const arrayBuffer = await fileRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const storagePath = `${authorId}/${inserted.id}/${file.fileName}`;
      const { error: uploadError } = await admin.storage
        .from("archive")
        .upload(storagePath, buffer, {
          contentType: file.mimeType,
          upsert: false,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { error: attachError } = await admin.from("post_attachments").insert({
        post_id: inserted.id,
        file_name: file.fileName,
        file_path: storagePath,
        file_size: buffer.byteLength,
        mime_type: file.mimeType,
      });

      if (attachError) throw new Error(attachError.message);

      results.archivePosts.push(file.title);
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error";
      // 게시글은 만들어졌으나 첨부 실패 — 게시글까지 롤백해 고아 글이 남지 않게 한다
      await admin.from("posts").delete().eq("id", inserted.id);
      results.errors.push(`자료 업로드 실패(${file.title}): ${message}`);
    }
  }

  return NextResponse.json({ ok: true, ...results });
}
