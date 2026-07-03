import { createClient } from "@/lib/supabase/client";
import { MAX_FILE_SIZE_MB } from "@/lib/constants";

const BUCKET = "archive";

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileIcon(mimeType: string): string {
  if (mimeType === "application/pdf") return "📄";
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "📊";
  if (mimeType.includes("word") || mimeType.includes("hwp")) return "📝";
  if (mimeType.includes("zip")) return "📦";
  return "📎";
}

export async function uploadArchiveFiles(
  userId: string,
  postId: string,
  files: File[]
): Promise<{ path: string; name: string; size: number; mime: string }[]> {
  const supabase = createClient();
  const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
  const uploaded: { path: string; name: string; size: number; mime: string }[] = [];

  for (const file of files) {
    if (file.size > maxBytes) {
      throw new Error(`"${file.name}"은(는) ${MAX_FILE_SIZE_MB}MB를 초과합니다.`);
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-가-힣]/g, "_");
    const path = `${userId}/${postId}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      throw new Error(`"${file.name}" 업로드 실패: ${error.message}`);
    }

    uploaded.push({
      path,
      name: file.name,
      size: file.size,
      mime: file.type || "application/octet-stream",
    });
  }

  return uploaded;
}

export function getPublicFileUrl(filePath: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteArchiveFile(filePath: string) {
  const supabase = createClient();
  await supabase.storage.from(BUCKET).remove([filePath]);
}
