import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExamSubject } from "@/lib/exam-questions";
import {
  getExamPdfArchiveContent,
  getExamPdfArchiveTitle,
  getExamPdfFileName,
  renderExamYearPdfBuffer,
} from "@/lib/exam-pdf";

export async function syncExamPdfToArchive(
  admin: SupabaseClient,
  authorId: string,
  subject: ExamSubject,
  year: number
): Promise<"skipped" | "created" | "updated"> {
  const title = getExamPdfArchiveTitle(subject, year);
  const content = getExamPdfArchiveContent(subject, year);
  const fileName = getExamPdfFileName(subject, year);

  const { data: existingPost } = await admin
    .from("posts")
    .select("id")
    .eq("category", "resource")
    .eq("title", title)
    .maybeSingle();

  let postId = existingPost?.id;

  if (postId) {
    const { data: existingAttachment } = await admin
      .from("post_attachments")
      .select("id")
      .eq("post_id", postId)
      .eq("file_name", fileName)
      .maybeSingle();

    if (existingAttachment?.id) {
      return "skipped";
    }
  }

  const buffer = await renderExamYearPdfBuffer(subject, year);

  if (!postId) {
    const { data: insertedPost, error: postInsertError } = await admin
      .from("posts")
      .insert({
        author_id: authorId,
        category: "resource",
        title,
        content,
        subject,
        resource_type: "past_exam",
      })
      .select("id")
      .single();

    if (postInsertError) throw new Error(postInsertError.message);
    if (!insertedPost?.id) throw new Error("archive post id is missing");
    postId = insertedPost.id;
  } else {
    await admin
      .from("posts")
      .update({ content, subject, resource_type: "past_exam" })
      .eq("id", postId);
  }

  const storagePath = `${authorId}/exam-pdfs/${subject}/${year}/${fileName}`;
  const { error: uploadError } = await admin.storage.from("archive").upload(storagePath, buffer, {
    contentType: "application/pdf",
    upsert: true,
  });

  if (uploadError) throw new Error(uploadError.message);

  const { data: existingAttachment } = await admin
    .from("post_attachments")
    .select("id")
    .eq("post_id", postId)
    .eq("file_name", fileName)
    .maybeSingle();

  if (existingAttachment?.id) {
    await admin
      .from("post_attachments")
      .update({
        file_path: storagePath,
        file_size: buffer.byteLength,
        mime_type: "application/pdf",
      })
      .eq("id", existingAttachment.id);
    return "updated";
  }

  const { error: attachError } = await admin.from("post_attachments").insert({
    post_id: postId,
    file_name: fileName,
    file_path: storagePath,
    file_size: buffer.byteLength,
    mime_type: "application/pdf",
  });

  if (attachError) throw new Error(attachError.message);
  return existingPost?.id ? "updated" : "created";
}
